from app.collectors.mock_aws_collector import MockAWSCollector
from app.engine.asset_mapper import AssetMapper
from app.engine.graph import GraphBuilder
from app.normalizer.mock_aws_normalizer import MockAWSNormalizer


def test_graph_query_helpers():
    collected = MockAWSCollector(region="ap-south-1").collect()
    snap = MockAWSNormalizer().normalize(collected)

    nodes = AssetMapper().map_assets(snap)
    graph = GraphBuilder().build(nodes)

    # get asset by id
    s3 = graph.get_asset_by_id("s3", "ingressa-public-bucket", "ap-south-1")
    assert s3 is not None
    assert s3.asset_type == "s3"

    # neighbors lookup (bucket should have access_control self-edge)
    bucket_key = graph.key("s3", "ingressa-public-bucket", "ap-south-1")
    n = graph.neighbors(bucket_key, relation="access_control")
    assert bucket_key in n
