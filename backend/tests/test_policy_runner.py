from app.collectors.mock_aws_collector import MockAWSCollector
from app.engine.asset_mapper import AssetMapper
from app.engine.graph import GraphBuilder
from app.engine.policy_runner import PolicyRunner
from app.normalizer.mock_aws_normalizer import MockAWSNormalizer


def test_policy_runner_outputs_findings_dicts():
    collected = MockAWSCollector(region="ap-south-1").collect()
    snap = MockAWSNormalizer().normalize(collected)

    nodes = AssetMapper().map_assets(snap)
    graph = GraphBuilder().build(nodes)

    finding_dicts = PolicyRunner().run(snap, graph)

    assert len(finding_dicts) >= 4

    ids = {f["policy_id"] for f in finding_dicts}
    assert "POL-001" in ids
    assert "POL-005" in ids
    assert "POL-010" in ids
    assert "POL-012" in ids

    # required fields
    for f in finding_dicts:
        assert "asset_key" in f
        assert "resource_id" in f
        assert "resource_type" in f
        assert "region" in f
