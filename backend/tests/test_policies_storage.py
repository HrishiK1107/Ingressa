from app.collectors.mock_aws_collector import MockAWSCollector
from app.engine.asset_mapper import AssetMapper
from app.engine.graph import GraphBuilder
from app.normalizer.mock_aws_normalizer import MockAWSNormalizer
from app.policies.pol005_s3_public_read import POL005S3PublicRead
from app.policies.pol006_s3_public_write import POL006S3PublicWrite
from app.policies.pol007_s3_encryption_pab import POL007S3EncryptionPABMisconfig


def _prep():
    collected = MockAWSCollector(region="ap-south-1").collect()
    snap = MockAWSNormalizer().normalize(collected)
    graph = GraphBuilder().build(AssetMapper().map_assets(snap))
    return snap, graph


def test_pol005_s3_public_read_triggers():
    snap, graph = _prep()
    results = POL005S3PublicRead().evaluate(snap, graph)
    ids = {r.resource_id for r in results}
    assert "ingressa-public-read-bucket" in ids


def test_pol006_s3_public_write_triggers():
    snap, graph = _prep()
    results = POL006S3PublicWrite().evaluate(snap, graph)
    ids = {r.resource_id for r in results}
    assert "ingressa-public-write-bucket" in ids


def test_pol007_s3_encryption_pab_misconfig_triggers():
    snap, graph = _prep()
    results = POL007S3EncryptionPABMisconfig().evaluate(snap, graph)
    ids = {r.resource_id for r in results}
    assert "ingressa-misconfig-bucket" in ids
