from app.policies.pol001_s3_public import POL001S3PublicBucket
from app.policies.pol005_sg_open_ssh import POL005SecurityGroupOpenSSH
from app.policies.pol010_iam_user_mfa import POL010IAMUserMFA
from app.policies.pol012_visibility_controls import POL012VisibilityControls
from app.policies.registry import PolicyRegistry


def build_default_registry() -> PolicyRegistry:
    reg = PolicyRegistry()
    reg.register(POL001S3PublicBucket)
    reg.register(POL005SecurityGroupOpenSSH)
    reg.register(POL010IAMUserMFA)
    reg.register(POL012VisibilityControls)
    return reg
