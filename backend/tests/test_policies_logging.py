from app.collectors.mock_aws_collector import MockAWSCollector
from app.engine.asset_mapper import AssetMapper
from app.engine.graph import GraphBuilder
from app.normalizer.mock_aws_normalizer import MockAWSNormalizer
from app.policies.pol012_cloudtrail_disabled import POL012CloudTrailDisabledOrNotMultiRegion


def test_pol012_cloudtrail_triggers():
    collected = MockAWSCollector(region="ap-south-1").collect()
    snap = MockAWSNormalizer().normalize(collected)
    graph = GraphBuilder().build(AssetMapper().map_assets(snap))

    results = POL012CloudTrailDisabledOrNotMultiRegion().evaluate(snap, graph)

    assert len(results) == 1
    r = results[0]

    assert r.policy_id == "POL-012"
    assert r.resource_type == "cloudtrail"
    assert r.resource_id == "cloudtrail:111122223333"
    assert "cloudtrail" in r.evidence
