from typing import Any, Dict


class RemediationGenerator:
    """
    Deterministic remediation generator.

    Phase B10:
    - Policy-specific remediation templates
    - Evidence-grounded (may interpolate resource_id/region/resource_type)
    - No AI / no randomness

    Output:
    - remediation text string (stored in findings.remediation)
    """

    def generate(self, finding: Dict[str, Any]) -> str:
        policy_id = (finding.get("policy_id") or "").strip()
        resource_id = (finding.get("resource_id") or "").strip()
        resource_type = (finding.get("resource_type") or "").strip()
        region = (finding.get("region") or "").strip()

        # Evidence is optional but should exist
        evidence = finding.get("evidence") or {}

        if not policy_id:
            return "Remediation unavailable: missing policy_id."

        # Dispatcher (policy_id -> template)
        if policy_id == "POL-001":
            return self._pol001_ec2_public_ssh(resource_id, region, evidence)
        if policy_id == "POL-002":
            return self._pol002_ec2_public_rdp(resource_id, region, evidence)
        if policy_id == "POL-003":
            return self._pol003_dangerous_ports(resource_id, region, evidence)
        if policy_id == "POL-004":
            return self._pol004_sg_all_traffic_public(resource_id, region, evidence)
        if policy_id == "POL-005":
            return self._pol005_s3_public_read(resource_id, region, evidence)
        if policy_id == "POL-006":
            return self._pol006_s3_public_write(resource_id, region, evidence)
        if policy_id == "POL-007":
            return self._pol007_s3_encryption_pab(resource_id, region, evidence)
        if policy_id == "POL-008":
            return self._pol008_admin_no_mfa(resource_id, region, evidence)
        if policy_id == "POL-009":
            return self._pol009_old_access_keys(resource_id, region, evidence)
        if policy_id == "POL-010":
            return self._pol010_wildcard_policies(resource_id, region, evidence)
        if policy_id == "POL-011":
            return self._pol011_priv_esc_perms(resource_id, region, evidence)
        if policy_id == "POL-012":
            return self._pol012_cloudtrail_disabled(resource_id, region, evidence)

        # fallback (unknown policy)
        return (
            f"Remediation steps (generic):\n"
            f"1) Identify the affected resource.\n"
            f"   - resource_type: {resource_type or 'unknown'}\n"
            f"   - resource_id: {resource_id or 'unknown'}\n"
            f"   - region: {region or 'unknown'}\n"
            f"2) Review evidence and reduce exposure.\n"
            f"3) Apply least-privilege and secure-by-default configuration.\n"
            f"4) Re-run the scan to confirm the issue is resolved."
        )

    # -------------------------
    # Policy templates
    # -------------------------

    def _pol001_ec2_public_ssh(
        self, resource_id: str, region: str, evidence: Dict[str, Any]
    ) -> str:
        return (
            f"[POL-001] EC2 instance exposed to public SSH (22)\n\n"
            f"Affected Resource:\n"
            f"- resource_id: {resource_id}\n"
            f"- region: {region}\n\n"
            f"Console Fix:\n"
            f"1) Go to EC2 -> Security Groups\n"
            f"2) Find SG attached to instance {resource_id}\n"
            f"3) Remove inbound rule: TCP 22 from 0.0.0.0/0 (and ::/0)\n"
            f"4) Allow SSH only from admin IP(s) or through a bastion/VPN\n\n"
            f"CLI Fix:\n"
            f"- Use revoke-security-group-ingress for port 22 public rules\n"
            f"- Re-add restricted CIDR if needed\n\n"
            f"Terraform hint:\n"
            f"- Replace 0.0.0.0/0 with a restricted cidr_blocks for SSH\n"
        )

    def _pol002_ec2_public_rdp(
        self, resource_id: str, region: str, evidence: Dict[str, Any]
    ) -> str:
        return (
            f"[POL-002] EC2 instance exposed to public RDP (3389)\n\n"
            f"Affected Resource:\n"
            f"- resource_id: {resource_id}\n"
            f"- region: {region}\n\n"
            f"Console Fix:\n"
            f"1) EC2 -> Security Groups\n"
            f"2) Remove inbound: TCP 3389 from 0.0.0.0/0 and ::/0\n"
            f"3) Restrict RDP to trusted IP ranges or private network only\n\n"
            f"CLI Fix:\n"
            f"- revoke-security-group-ingress (port 3389 public)\n\n"
            f"Terraform hint:\n"
            f"- restrict cidr_blocks for 3389\n"
        )

    def _pol003_dangerous_ports(
        self, resource_id: str, region: str, evidence: Dict[str, Any]
    ) -> str:
        ports = evidence.get("ports") or evidence.get("dangerous_ports") or "unknown"
        return (
            f"[POL-003] Dangerous ports exposed to the internet\n\n"
            f"Affected Resource:\n"
            f"- resource_id: {resource_id}\n"
            f"- region: {region}\n"
            f"- ports: {ports}\n\n"
            f"Fix:\n"
            f"1) Identify which SG/NACL exposes these ports\n"
            f"2) Remove public inbound rules for those ports\n"
            f"3) If service must be public, enforce:\n"
            f"   - IP allowlists\n"
            f"   - authentication\n"
            f"   - TLS\n"
            f"   - WAF / reverse proxy (where applicable)\n\n"
            f"Terraform hint:\n"
            f"- avoid 0.0.0.0/0 for risky service ports\n"
        )

    def _pol004_sg_all_traffic_public(
        self, resource_id: str, region: str, evidence: Dict[str, Any]
    ) -> str:
        return (
            f"[POL-004] Security Group allows ALL traffic from the internet\n\n"
            f"Affected SG:\n"
            f"- security_group_id: {resource_id}\n"
            f"- region: {region}\n\n"
            f"Console Fix:\n"
            f"1) EC2 -> Security Groups -> {resource_id}\n"
            f"2) Remove inbound rules that allow all protocols/ports from 0.0.0.0/0 or ::/0\n"
            f"3) Replace with least-privilege rules:\n"
            f"   - specific ports\n"
            f"   - specific sources\n\n"
            f"Terraform hint:\n"
            f"- define explicit ingress blocks, do not use protocol=-1 with 0.0.0.0/0\n"
        )

    def _pol005_s3_public_read(
        self, resource_id: str, region: str, evidence: Dict[str, Any]
    ) -> str:
        return (
            f"[POL-005] S3 bucket allows public read\n\n"
            f"Affected Bucket:\n"
            f"- bucket: {resource_id}\n"
            f"- region: {region}\n\n"
            f"Console Fix:\n"
            f"1) S3 -> Bucket -> {resource_id}\n"
            f"2) Permissions -> Block public access (Enable all)\n"
            f"3) Review bucket policy / ACLs and remove public grants\n\n"
            f"CLI Fix:\n"
            f"- put-public-access-block\n"
            f"- delete-public bucket policy statements\n\n"
            f"Terraform hint:\n"
            f"- aws_s3_bucket_public_access_block should block public ACL + policy\n"
        )

    def _pol006_s3_public_write(
        self, resource_id: str, region: str, evidence: Dict[str, Any]
    ) -> str:
        return (
            f"[POL-006] S3 bucket allows public write\n\n"
            f"Affected Bucket:\n"
            f"- bucket: {resource_id}\n"
            f"- region: {region}\n\n"
            f"Fix:\n"
            f"1) Immediately remove any public write permissions\n"
            f"2) Enable Block Public Access\n"
            f"3) Audit for malicious uploads / tampering\n\n"
            f"Terraform hint:\n"
            f"- block public ACL/policies; restrict PutObject to trusted principals\n"
        )

    def _pol007_s3_encryption_pab(
        self, resource_id: str, region: str, evidence: Dict[str, Any]
    ) -> str:
        return (
            f"[POL-007] S3 encryption / public access block misconfiguration\n\n"
            f"Affected Bucket:\n"
            f"- bucket: {resource_id}\n"
            f"- region: {region}\n\n"
            f"Fix:\n"
            f"1) Enable default encryption (SSE-S3 or SSE-KMS)\n"
            f"2) Enable S3 Block Public Access\n"
            f"3) Ensure bucket policy does not allow public access\n\n"
            f"Terraform hint:\n"
            f"- aws_s3_bucket_server_side_encryption_configuration\n"
            f"- aws_s3_bucket_public_access_block\n"
        )

    def _pol008_admin_no_mfa(self, resource_id: str, region: str, evidence: Dict[str, Any]) -> str:
        user = evidence.get("user") or evidence.get("username") or resource_id
        return (
            f"[POL-008] IAM admin without MFA\n\n"
            f"Affected Identity:\n"
            f"- user: {user}\n\n"
            f"Fix:\n"
            f"1) Enable MFA device for the user\n"
            f"2) Enforce MFA using IAM policy / SCP condition\n"
            f"3) Rotate credentials after enabling MFA\n\n"
            f"Terraform hint:\n"
            f"- enforce aws:MultiFactorAuthPresent condition in IAM policies\n"
        )

    def _pol009_old_access_keys(
        self, resource_id: str, region: str, evidence: Dict[str, Any]
    ) -> str:
        user = evidence.get("user") or evidence.get("username") or "unknown"
        age = evidence.get("key_age_days") or evidence.get("age_days") or "unknown"
        return (
            f"[POL-009] Old IAM access keys detected\n\n"
            f"Affected:\n"
            f"- user: {user}\n"
            f"- key_age_days: {age}\n\n"
            f"Fix:\n"
            f"1) Create new access key\n"
            f"2) Update applications/CI secrets\n"
            f"3) Disable old key\n"
            f"4) Delete old key after verification\n\n"
            f"Terraform hint:\n"
            f"- consider IAM Access Analyzer / rotation automation\n"
        )

    def _pol010_wildcard_policies(
        self, resource_id: str, region: str, evidence: Dict[str, Any]
    ) -> str:
        return (
            f"[POL-010] IAM wildcard policies detected (* permissions)\n\n"
            f"Affected Identity/Policy:\n"
            f"- resource_id: {resource_id}\n\n"
            f"Fix:\n"
            f"1) Replace '*' actions with exact required actions\n"
            f"2) Replace '*' resources with scoped ARNs\n"
            f"3) Separate admin privileges into break-glass role\n\n"
            f"Terraform hint:\n"
            f"- rewrite aws_iam_policy_document with explicit actions/resources\n"
        )

    def _pol011_priv_esc_perms(
        self, resource_id: str, region: str, evidence: Dict[str, Any]
    ) -> str:
        perms = evidence.get("dangerous_permissions") or evidence.get("permissions") or "unknown"
        return (
            f"[POL-011] Privilege escalation permissions detected\n\n"
            f"Affected:\n"
            f"- resource_id: {resource_id}\n"
            f"- risky_permissions: {perms}\n\n"
            f"Fix:\n"
            f"1) Remove privilege escalation actions where not needed\n"
            f"2) Restrict iam:PassRole with explicit role ARNs\n"
            f"3) Restrict sts:AssumeRole by principal + conditions\n\n"
            f"Terraform hint:\n"
            f"- deny-list risky IAM actions; scope PassRole to exact roles\n"
        )

    def _pol012_cloudtrail_disabled(
        self, resource_id: str, region: str, evidence: Dict[str, Any]
    ) -> str:
        return (
            f"[POL-012] CloudTrail disabled or not multi-region\n\n"
            f"Affected:\n"
            f"- trail_id: {resource_id}\n"
            f"- region: {region}\n\n"
            f"Fix:\n"
            f"1) Enable CloudTrail\n"
            f"2) Configure as Multi-Region trail\n"
            f"3) Send logs to a dedicated S3 bucket with encryption\n"
            f"4) Enable log file validation\n\n"
            f"Terraform hint:\n"
            f"- aws_cloudtrail: enable multi_region_trail = true\n"
        )
