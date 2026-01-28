from app.collectors.mock_aws_collector import MockAWSCollector
from app.engine.asset_mapper import AssetMapper
from app.engine.graph import GraphBuilder
from app.normalizer.mock_aws_normalizer import MockAWSNormalizer
from app.policies.pol001_ec2_public_ssh import POL001EC2PublicSSH
from app.policies.pol002_ec2_public_rdp import POL002EC2PublicRDP
from app.policies.pol003_dangerous_ports import POL003DangerousPortsExposed
from app.policies.pol004_sg_all_traffic_public import POL004SGAllTrafficPublic


def _prep():
    collected = MockAWSCollector(region="ap-south-1").collect()
    snap = MockAWSNormalizer().normalize(collected)
    graph = GraphBuilder().build(AssetMapper().map_assets(snap))
    return snap, graph


def test_pol001_ec2_public_ssh_triggers():
    snap, graph = _prep()
    results = POL001EC2PublicSSH().evaluate(snap, graph)
    assert any(r.resource_id == "i-ssh-public-0001" for r in results)


def test_pol002_ec2_public_rdp_triggers():
    snap, graph = _prep()
    results = POL002EC2PublicRDP().evaluate(snap, graph)
    assert any(r.resource_id == "i-rdp-public-0002" for r in results)


def test_pol003_dangerous_ports_triggers():
    snap, graph = _prep()
    results = POL003DangerousPortsExposed().evaluate(snap, graph)
    assert any(r.resource_id == "sg-dangerous-ports" for r in results)


def test_pol004_sg_all_traffic_public_triggers():
    snap, graph = _prep()
    results = POL004SGAllTrafficPublic().evaluate(snap, graph)
    assert any(r.resource_id == "sg-all-traffic" for r in results)
