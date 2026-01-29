from app.policies.pol001_ec2_public_ssh import POL001EC2PublicSSH
from app.policies.pol002_ec2_public_rdp import POL002EC2PublicRDP
from app.policies.pol003_dangerous_ports import POL003DangerousPortsExposed
from app.policies.pol004_sg_all_traffic_public import POL004SGAllTrafficPublic
from app.policies.pol005_s3_public_read import POL005S3PublicRead
from app.policies.pol006_s3_public_write import POL006S3PublicWrite
from app.policies.pol007_s3_encryption_pab import POL007S3EncryptionPABMisconfig
from app.policies.pol008_admin_no_mfa import POL008AdminWithoutMFA
from app.policies.pol009_old_access_keys import POL009OldAccessKeys
from app.policies.pol010_wildcard_policies import POL010WildcardPolicies
from app.policies.pol011_priv_esc_perms import POL011PrivilegeEscalationPerms
from app.policies.pol012_cloudtrail_disabled import POL012CloudTrailDisabledOrNotMultiRegion
from app.policies.registry import PolicyRegistry


def build_default_registry() -> PolicyRegistry:
    """
    Canonical registry of all locked 12 policies.

    IMPORTANT:
    - Must register policy CLASSES (not instances)
    - Order should remain stable (deterministic behavior + test stability)
    """
    reg = PolicyRegistry()

    reg.register(POL001EC2PublicSSH)
    reg.register(POL002EC2PublicRDP)
    reg.register(POL003DangerousPortsExposed)
    reg.register(POL004SGAllTrafficPublic)
    reg.register(POL005S3PublicRead)
    reg.register(POL006S3PublicWrite)
    reg.register(POL007S3EncryptionPABMisconfig)
    reg.register(POL008AdminWithoutMFA)
    reg.register(POL009OldAccessKeys)
    reg.register(POL010WildcardPolicies)
    reg.register(POL011PrivilegeEscalationPerms)
    reg.register(POL012CloudTrailDisabledOrNotMultiRegion)

    return reg
