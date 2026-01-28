from app.collectors.mock_aws_collector import MockAWSCollector
from app.engine.asset_mapper import AssetMapper
from app.engine.graph import GraphBuilder
from app.normalizer.mock_aws_normalizer import MockAWSNormalizer


def test_graph_builder_summary_and_relationships():
    collected = MockAWSCollector(region="ap-south-1").collect()
    snap = MockAWSNormalizer().normalize(collected)

    nodes = AssetMapper().map_assets(snap)
    graph = GraphBuilder().build(nodes)

    summary = graph.summary()
    assert summary["nodes"] > 0
    assert summary["edges"] > 0

    # security_group ingress relationship exists
    sg_edges = []
    for edges in graph.edges_out.values():
        for e in edges:
            if e.relation == "ingress_rule":
                sg_edges.append(e)

    assert len(sg_edges) > 0

    # bucket access control exists
    acl_edges = []
    for edges in graph.edges_out.values():
        for e in edges:
            if e.relation == "access_control":
                acl_edges.append(e)

    assert len(acl_edges) > 0
