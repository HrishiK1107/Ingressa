from app.collectors.mock_aws_collector import MockAWSCollector
from app.engine.asset_mapper import AssetMapper
from app.engine.graph import GraphBuilder
from app.normalizer.mock_aws_normalizer import MockAWSNormalizer
from app.policies.pol008_admin_no_mfa import POL008AdminWithoutMFA
from app.policies.pol009_old_access_keys import POL009OldAccessKeys
from app.policies.pol010_wildcard_policies import POL010WildcardPolicies
from app.policies.pol011_priv_esc_perms import POL011PrivilegeEscalationPerms


def _prep():
    collected = MockAWSCollector(region="ap-south-1").collect()
    snap = MockAWSNormalizer().normalize(collected)
    graph = GraphBuilder().build(AssetMapper().map_assets(snap))
    return snap, graph


def test_pol008_admin_without_mfa_triggers():
    snap, graph = _prep()
    results = POL008AdminWithoutMFA().evaluate(snap, graph)
    assert any(r.resource_id == "legacy-admin" for r in results)


def test_pol009_old_access_keys_triggers():
    snap, graph = _prep()
    results = POL009OldAccessKeys().evaluate(snap, graph)
    assert any(r.resource_id == "legacy-admin" for r in results)


def test_pol010_wildcard_policies_triggers():
    snap, graph = _prep()
    results = POL010WildcardPolicies().evaluate(snap, graph)

    # should hit legacy-admin (actions ["*"])
    assert any(r.resource_id == "legacy-admin" and r.resource_type == "iam_user" for r in results)
    # should hit AdminRole (actions ["iam:*"])
    assert any(r.resource_id == "AdminRole" and r.resource_type == "iam_role" for r in results)


def test_pol011_priv_esc_perms_triggers():
    snap, graph = _prep()
    results = POL011PrivilegeEscalationPerms().evaluate(snap, graph)

    assert any(r.resource_id == "legacy-admin" for r in results)
    assert any(r.resource_id == "AdminRole" for r in results)
