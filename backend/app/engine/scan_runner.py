import logging
from typing import Any, Dict, List

from app.collectors.mock_aws_collector import MockAWSCollector
from app.engine.asset_mapper import AssetMapper
from app.engine.graph import GraphBuilder
from app.engine.policy_runner import PolicyRunner
from app.normalizer.mock_aws_normalizer import MockAWSNormalizer
from app.normalizer.types import NormalizedSnapshot

log = logging.getLogger("ingressa.scan_runner")


class ScanRunner:
    """
    Runs pipeline:
    Collector -> Normalizer -> AssetMapper -> Graph -> PolicyRunner

    NOTE: DB persistence happens in B9.2 (API wiring layer).
    """

    def run(self, mode: str, region: str) -> Dict[str, Any]:
        if mode not in ("mock", "aws"):
            raise ValueError("mode must be mock|aws")

        # -------------------------
        # 1) Collect
        # -------------------------
        if mode == "mock":
            collector = MockAWSCollector(region=region)
            collected = collector.collect()
        else:
            # Placeholder: real AWS collector later (B10+)
            raise NotImplementedError("aws mode collector not implemented yet")

        # -------------------------
        # 2) Normalize
        # -------------------------
        normalizer = MockAWSNormalizer()
        snap: NormalizedSnapshot = normalizer.normalize(collected)

        # -------------------------
        # 3) Asset mapping
        # -------------------------
        nodes = AssetMapper().map_assets(snap)

        # -------------------------
        # 4) Graph build
        # -------------------------
        graph = GraphBuilder().build(nodes)

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

        return {
            "account_id": snap.account_id,
            "region": snap.region,
            "collected_at": snap.collected_at.isoformat(),
            "assets_count": len(nodes),
            "graph_nodes": graph.summary()["nodes"],
            "graph_edges": graph.summary()["edges"],
            "findings_count": len(findings),
            "policy_counts": policy_counts,
            "findings": findings,  # DB layer will store these
        }
