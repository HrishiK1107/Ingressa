from app.collectors.mock_aws_collector import MockAWSCollector
from app.engine.asset_mapper import AssetMapper
from app.normalizer.mock_aws_normalizer import MockAWSNormalizer


def test_asset_mapper_outputs_assets():
    collected = MockAWSCollector(region="ap-south-1").collect()
    snap = MockAWSNormalizer().normalize(collected)

    nodes = AssetMapper().map_assets(snap)

    assert len(nodes) > 0

    types = {n.asset_type for n in nodes}
    assert "s3" in types
    assert "security_group" in types
    assert "iam_user" in types
    assert "ec2" in types
    assert "cloudtrail" in types
