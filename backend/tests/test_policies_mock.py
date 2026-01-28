from app.collectors.mock_aws_collector import MockAWSCollector
from app.engine.asset_mapper import AssetMapper
from app.engine.graph import GraphBuilder
from app.normalizer.mock_aws_normalizer import MockAWSNormalizer
from app.policies.default_registry import build_default_registry


def test_mock_policies_trigger_minimum_four():
    collected = MockAWSCollector(region="ap-south-1").collect()
    snap = MockAWSNormalizer().normalize(collected)

    nodes = AssetMapper().map_assets(snap)
    graph = GraphBuilder().build(nodes)

    reg = build_default_registry()

    results = []
    for p in reg.all():
        results.extend(p.evaluate(snap, graph))

    ids = {r.policy_id for r in results}
    assert "POL-001" in ids
    assert "POL-005" in ids
    assert "POL-010" in ids
    assert "POL-012" in ids
