from typing import Any, Dict


class RemediationGenerator:
    """
    Deterministic remediation generator.

    Phase B10:
    - Policy-specific remediation templates
    - Evidence-grounded interpolation allowed
    - No AI / no randomness
    - Output must contain Console Fix / CLI Fix (+ Terraform hint)
    """

    def generate(self, finding: Dict[str, Any]) -> str:
        policy_id = (finding.get("policy_id") or "").strip()
        resource_id = (finding.get("resource_id") or "").strip()
        resource_type = (finding.get("resource_type") or "").strip()
        region = (finding.get("region") or "").strip()
        evidence = finding.get("evidence") or {}

        if not policy_id:
            return self._generic(resource_type, resource_id, region)

        mapping = {
            "POL-001": self._pol001,
            "POL-002": self._pol002,
            "POL-003": self._pol003,
            "POL-004": self._pol004,
            "POL-005": self._pol005,
            "POL-006": self._pol006,
            "POL-007": self._pol007,
            "POL-008": self._pol008,
            "POL-009": self._pol009,
            "POL-010": self._pol010,
            "POL-011": self._pol011,
            "POL-012": self._pol012,
        }

        fn = mapping.get(policy_id)
        if not fn:
            return self._generic(resource_type, resource_id, region)

        return fn(resource_id=resource_id, region=region, evidence=evidence)

    # -------------------------
    # Fallback
    # -------------------------
    def _generic(self, resource_type: str, resource_id: str, region: str) -> str:
        return (
            "Remediation steps (generic)\n\n"
            "Console Fix:\n"
            "1) Identify the affected resource and verify the configuration.\n"
            "2) Disable public exposure / weak permissions.\n"
            "3) Apply least privilege.\n\n"
            "CLI Fix:\n"
            "- Use AWS CLI / IaC to remove insecure configuration.\n\n"
            "Terraform hint:\n"
            "- Replace broad rules with scoped configuration.\n\n"
            f"Affected Resource:\n"
            f"- resource_type: {resource_type or 'unknown'}\n"
            f"- resource_id: {resource_id or 'unknown'}\n"
            f"- region: {region or 'unknown'}\n"
        )

    # -------------------------
    # Templates (ALL must include Console Fix + CLI Fix)
    # -------------------------
    def _pol001(self, resource_id: str, region: str, evidence: Dict[str, Any]) -> str:
        # EC2 public SSH
        return (
            "[POL-001] EC2 instance exposed to public SSH (22)\n\n"
            f"Affected Resource:\n- instance_id: {resource_id}\n- region: {region}\n\n"
            "Console Fix:\n"
            "1) EC2 -> Instances -> select instance\n"
            "2) Find attached Security Group(s)\n"
            "3) Remove inbound rule allowing TCP 22 from 0.0.0.0/0 and ::/0\n"
            "4) Allow SSH only from trusted admin IPs OR use VPN/Bastion\n\n"
            "CLI Fix:\n"
            "- aws ec2 revoke-security-group-ingress --group-id <sg-id> --protocol tcp --port 22 --cidr 0.0.0.0/0\n"
            "- aws ec2 revoke-security-group-ingress --group-id <sg-id> --protocol tcp --port 22 --cidr ::/0\n\n"
            "Terraform hint:\n"
            "- Restrict ingress cidr_blocks to admin IPs. Never use 0.0.0.0/0 for SSH.\n"
        )

    def _pol002(self, resource_id: str, region: str, evidence: Dict[str, Any]) -> str:
        return (
            "[POL-002] EC2 instance exposed to public RDP (3389)\n\n"
            f"Affected Resource:\n- instance_id: {resource_id}\n- region: {region}\n\n"
            "Console Fix:\n"
            "1) EC2 -> Security Groups attached to the instance\n"
            "2) Remove inbound rule allowing TCP 3389 from 0.0.0.0/0 and ::/0\n"
            "3) Allow RDP only from private IP range / VPN / jumpbox\n\n"
            "CLI Fix:\n"
            "- aws ec2 revoke-security-group-ingress --group-id <sg-id> --protocol tcp --port 3389 --cidr 0.0.0.0/0\n\n"
            "Terraform hint:\n"
            "- Restrict RDP ingress cidr_blocks to trusted CIDR only.\n"
        )

    def _pol003(self, resource_id: str, region: str, evidence: Dict[str, Any]) -> str:
        ports = evidence.get("ports") or evidence.get("dangerous_ports") or "unknown"
        return (
            "[POL-003] Dangerous ports exposed to the internet\n\n"
            f"Affected Resource:\n- security_group_id: {resource_id}\n- region: {region}\n- ports: {ports}\n\n"
            "Console Fix:\n"
            "1) EC2 -> Security Groups\n"
            "2) Open SG -> Inbound rules\n"
            "3) Remove public rules exposing risky ports\n"
            "4) If service must be public, restrict by IP allowlist + auth + TLS\n\n"
            "CLI Fix:\n"
            "- aws ec2 revoke-security-group-ingress ... (for each exposed port/rule)\n\n"
            "Terraform hint:\n"
            "- Replace broad ingress rules with explicit scoped rules.\n"
        )

    def _pol004(self, resource_id: str, region: str, evidence: Dict[str, Any]) -> str:
        return (
            "[POL-004] Security Group allows ALL traffic from the internet\n\n"
            f"Affected Resource:\n- security_group_id: {resource_id}\n- region: {region}\n\n"
            "Console Fix:\n"
            "1) EC2 -> Security Groups -> select SG\n"
            "2) Remove inbound rule: All traffic / All protocols from 0.0.0.0/0 and ::/0\n"
            "3) Add only required ports and trusted sources\n\n"
            "CLI Fix:\n"
            "- aws ec2 revoke-security-group-ingress --group-id <sg-id> --protocol -1 --cidr 0.0.0.0/0\n\n"
            "Terraform hint:\n"
            "- Avoid protocol = -1 with public CIDR in ingress.\n"
        )

    def _pol005(self, resource_id: str, region: str, evidence: Dict[str, Any]) -> str:
        return (
            "[POL-005] S3 bucket allows public read\n\n"
            f"Affected Resource:\n- bucket: {resource_id}\n- region: {region}\n\n"
            "Console Fix:\n"
            "1) S3 -> Bucket -> Permissions\n"
            "2) Enable Block Public Access (all)\n"
            "3) Remove bucket policy statements allowing public read\n"
            "4) Remove public ACL grants\n\n"
            "CLI Fix:\n"
            "- aws s3api put-public-access-block --bucket <bucket> --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true\n\n"
            "Terraform hint:\n"
            "- Use aws_s3_bucket_public_access_block and restrict bucket policy principals.\n"
        )

    def _pol006(self, resource_id: str, region: str, evidence: Dict[str, Any]) -> str:
        return (
            "[POL-006] S3 bucket allows public write\n\n"
            f"Affected Resource:\n- bucket: {resource_id}\n- region: {region}\n\n"
            "Console Fix:\n"
            "1) Immediately remove public write from bucket policy / ACL\n"
            "2) Enable Block Public Access (all)\n"
            "3) Review uploaded objects for tampering\n\n"
            "CLI Fix:\n"
            "- aws s3api put-public-access-block ...\n"
            "- remove any PutObject allow for public principals\n\n"
            "Terraform hint:\n"
            "- Enforce public access block + least privilege PutObject permissions.\n"
        )

    def _pol007(self, resource_id: str, region: str, evidence: Dict[str, Any]) -> str:
        return (
            "[POL-007] S3 encryption / public access block misconfiguration\n\n"
            f"Affected Resource:\n- bucket: {resource_id}\n- region: {region}\n\n"
            "Console Fix:\n"
            "1) Enable Default encryption (SSE-S3 or SSE-KMS)\n"
            "2) Enable Block Public Access\n"
            "3) Verify bucket policy does not allow public access\n\n"
            "CLI Fix:\n"
            "- aws s3api put-bucket-encryption ...\n"
            "- aws s3api put-public-access-block ...\n\n"
            "Terraform hint:\n"
            "- aws_s3_bucket_server_side_encryption_configuration + aws_s3_bucket_public_access_block\n"
        )

    def _pol008(self, resource_id: str, region: str, evidence: Dict[str, Any]) -> str:
        user = evidence.get("user") or evidence.get("username") or resource_id
        return (
            "[POL-008] IAM admin without MFA\n\n"
            f"Affected Resource:\n- iam_user: {user}\n\n"
            "Console Fix:\n"
            "1) IAM -> Users -> select user\n"
            "2) Security credentials -> Assign MFA device\n"
            "3) Enforce MFA using IAM conditions / SCP\n\n"
            "CLI Fix:\n"
            "- Enforce MFA condition (aws:MultiFactorAuthPresent) in IAM policies\n\n"
            "Terraform hint:\n"
            "- Add MFA enforcement policy condition to privileged roles/users.\n"
        )

    def _pol009(self, resource_id: str, region: str, evidence: Dict[str, Any]) -> str:
        user = evidence.get("user") or evidence.get("username") or "unknown"
        age = evidence.get("key_age_days") or evidence.get("age_days") or "unknown"
        return (
            "[POL-009] Old IAM access keys detected\n\n"
            f"Affected Resource:\n- user: {user}\n- key_age_days: {age}\n\n"
            "Console Fix:\n"
            "1) IAM -> Users -> Security credentials\n"
            "2) Create new access key\n"
            "3) Update apps/CI secrets\n"
            "4) Deactivate old key, then delete after validation\n\n"
            "CLI Fix:\n"
            "- aws iam update-access-key --user-name <user> --access-key-id <old> --status Inactive\n\n"
            "Terraform hint:\n"
            "- Add rotation controls / periodic key audits.\n"
        )

    def _pol010(self, resource_id: str, region: str, evidence: Dict[str, Any]) -> str:
        return (
            "[POL-010] IAM wildcard policies detected\n\n"
            f"Affected Resource:\n- identity_or_policy: {resource_id}\n\n"
            "Console Fix:\n"
            "1) IAM -> Policies / Roles / Users\n"
            "2) Find statements with Action='*' or Resource='*'\n"
            "3) Replace with explicit actions and scoped ARNs\n\n"
            "CLI Fix:\n"
            "- Tighten IAM policies by editing policy JSON (least privilege)\n\n"
            "Terraform hint:\n"
            "- Use aws_iam_policy_document with explicit actions/resources.\n"
        )

    def _pol011(self, resource_id: str, region: str, evidence: Dict[str, Any]) -> str:
        perms = evidence.get("dangerous_permissions") or evidence.get("permissions") or "unknown"
        return (
            "[POL-011] Privilege escalation permissions detected\n\n"
            f"Affected Resource:\n- identity: {resource_id}\n- risky_permissions: {perms}\n\n"
            "Console Fix:\n"
            "1) IAM -> Role/User -> Permissions\n"
            "2) Remove privilege escalation actions where not required\n"
            "3) Restrict iam:PassRole to specific role ARNs\n"
            "4) Restrict AssumeRole trust policies\n\n"
            "CLI Fix:\n"
            "- Remove dangerous IAM actions from attached policies\n"
            "- Scope iam:PassRole with Resource constraints\n\n"
            "Terraform hint:\n"
            "- Deny-list risky actions and scope PassRole to explicit ARNs.\n"
        )

    def _pol012(self, resource_id: str, region: str, evidence: Dict[str, Any]) -> str:
        return (
            "[POL-012] CloudTrail disabled or not multi-region\n\n"
            f"Affected Resource:\n- trail_id: {resource_id}\n- region: {region}\n\n"
            "Console Fix:\n"
            "1) CloudTrail -> Trails\n"
            "2) Enable trail and enable Multi-region\n"
            "3) Deliver logs to dedicated encrypted S3 bucket\n"
            "4) Enable log file validation\n\n"
            "CLI Fix:\n"
            "- aws cloudtrail start-logging --name <trail>\n"
            "- ensure multi-region trail enabled\n\n"
            "Terraform hint:\n"
            "- aws_cloudtrail: multi_region_trail = true, enable_log_file_validation = true\n"
        )
