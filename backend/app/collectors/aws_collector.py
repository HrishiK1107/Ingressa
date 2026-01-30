import logging
from datetime import datetime
from typing import Any, Dict

import boto3

from app.collectors.base import BaseCollector
from app.collectors.types import CollectorOutput

log = logging.getLogger("ingressa.aws_collector")


class AWSCollector(BaseCollector):
    """
    Real AWS collector (read-only).

    Contract:
    - Uses explicit AWS profile
    - Returns CollectorOutput
    - Shape MUST match MockAWSCollector
    """

    def __init__(self, region: str, profile: str = "ingressa"):
        self.region = region
        self.profile = profile

    def collect(self) -> CollectorOutput:
        # -------------------------
        # FORCE profile binding
        # -------------------------
        session = boto3.Session(
            profile_name=self.profile,
            region_name=self.region,
        )

        sts = session.client("sts")
        identity = sts.get_caller_identity()
        account_id = identity["Account"]

        log.info(
            "aws collector identity ok",
            extra={"account_id": account_id, "profile": self.profile},
        )

        collected_at = datetime.utcnow()

        resources: Dict[str, Any] = {
            "ec2_instances": [],
            "security_groups": [],
            "s3_buckets": [],
        }

        # -------------------------
        # EC2 + Security Groups
        # -------------------------
        ec2 = session.client("ec2")

        instances = ec2.describe_instances()
        for r in instances.get("Reservations", []):
            for i in r.get("Instances", []):
                resources["ec2_instances"].append(
                    {
                        "instance_id": i["InstanceId"],
                        "public_ip": i.get("PublicIpAddress"),
                        "security_groups": [sg["GroupId"] for sg in i.get("SecurityGroups", [])],
                        "region": self.region,
                    }
                )

        sgs = ec2.describe_security_groups()
        for sg in sgs.get("SecurityGroups", []):
            resources["security_groups"].append(
                {
                    "group_id": sg["GroupId"],
                    "group_name": sg["GroupName"],
                    "inbound_rules": [
                        {
                            "protocol": r.get("IpProtocol"),
                            "port": r.get("FromPort"),
                            "cidr": ip.get("CidrIp"),
                        }
                        for r in sg.get("IpPermissions", [])
                        for ip in r.get("IpRanges", [])
                    ],
                    "region": self.region,
                }
            )

        # -------------------------
        # S3
        # -------------------------
        s3 = session.client("s3")

        buckets = s3.list_buckets().get("Buckets", [])
        for b in buckets:
            name = b["Name"]

            try:
                pab = s3.get_public_access_block(Bucket=name)["PublicAccessBlockConfiguration"]
            except s3.exceptions.NoSuchPublicAccessBlockConfiguration:
                pab = None

            resources["s3_buckets"].append(
                {
                    "bucket": name,
                    "public_access_block": pab,
                }
            )

        return CollectorOutput(
            account_id=account_id,
            region=self.region,
            collected_at=collected_at,
            resources=resources,
        )
