import logging
from typing import Any, Dict, List

from app.collectors.aws_collector import AWSCollector
from app.collectors.mock_aws_collector import MockAWSCollector
from app.engine.asset_mapper import AssetMapper
from app.engine.graph import GraphBuilder
from app.engine.policy_runner import PolicyRunner
from app.engine.types import AssetNode
from app.normalizer.mock_aws_normalizer import MockAWSNormalizer
from app.normalizer.types import NormalizedSnapshot

log = logging.getLogger("ingressa.scan_runner")


def _assetnode_to_dict(a: AssetNode) -> Dict[str, Any]:
    return {
        "asset_id": a.asset_id,
        "asset_type": a.asset_type,
        "region": a.region,
        "name": a.name,
        "data": a.data,
    }


class ScanRunner:
    """
    Runs pipeline:
    Collector -> Normalizer -> AssetMapper -> Graph -> PolicyRunner
    """

    def run(self, mode: str, region: str) -> Dict[str, Any]:
        if mode not in ("mock", "aws"):
            raise ValueError("mode must be mock|aws")

        # -------------------------
        # 1) Collect
        # -------------------------
        if mode == "mock":
            collector = MockAWSCollector(region=region)
        else:
            collector = AWSCollector(
                region=region,
                profile="ingressa",  # 🔒 explicit, deterministic
            )

        collected = collector.collect()

        # -------------------------
        # 2) Normalize
        # -------------------------
        normalizer = MockAWSNormalizer()
        snap: NormalizedSnapshot = normalizer.normalize(collected)

        # -------------------------
        # 3) Asset mapping
        # -------------------------
        asset_nodes: List[AssetNode] = AssetMapper().map_assets(snap)

        # -------------------------
        # 4) Graph build
        # -------------------------
        graph = GraphBuilder().build(asset_nodes)

        # -------------------------
        # 5) Policies
        # -------------------------
        findings: List[Dict[str, Any]] = PolicyRunner().run(snap, graph)

        # -------------------------
        # Summary
        # -------------------------
        policy_counts: Dict[str, int] = {}
        for f in findings:
            pid = f["policy_id"]
            policy_counts[pid] = policy_counts.get(pid, 0) + 1

        summary = graph.summary()

        return {
            "account_id": snap.account_id,
            "region": snap.region,
            "collected_at": snap.collected_at.isoformat(),
            "assets_count": len(asset_nodes),
            "graph_nodes": summary["nodes"],
            "graph_edges": summary["edges"],
            "findings_count": len(findings),
            "policy_counts": policy_counts,
            "assets": [_assetnode_to_dict(a) for a in asset_nodes],
            "findings": findings,
        }
