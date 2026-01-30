# backend/app/collectors/aws_collector.py

from datetime import datetime

from app.collectors.base import BaseCollector
from app.collectors.types import CollectorOutput


class AWSCollector(BaseCollector):
    """
    Phase B13.3.1
    Stub AWS collector that returns a CollectorOutput
    compatible with MockAWSNormalizer.
    """

    def __init__(self, region: str):
        self.region = region

    def collect(self) -> CollectorOutput:
        return CollectorOutput(
            account_id="aws-real",
            region=self.region,
            collected_at=datetime.utcnow(),
            resources={
                "ec2_instances": [],
                "security_groups": [],
                "s3_buckets": [],
                "iam_users": [],
                "iam_roles": [],
                "cloudtrail_trails": [],
            },
        )
