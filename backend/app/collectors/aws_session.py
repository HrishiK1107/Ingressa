import logging
from typing import Optional

import boto3
from botocore.exceptions import ClientError

from app.config import settings

log = logging.getLogger("ingressa.aws")


class AWSSessionFactory:
    """
    Creates boto3 Sessions based on env config.

    Supported:
    - AWS_AUTH_MODE=keys
    - AWS_AUTH_MODE=assume_role
    """

    def __init__(self, region: Optional[str] = None):
        self.region = region or settings.AWS_REGION_DEFAULT

    def create_session(self) -> boto3.Session:
        mode = settings.AWS_AUTH_MODE

        if mode == "keys":
            return self._session_from_keys()

        if mode == "assume_role":
            return self._session_from_assume_role()

        raise ValueError(f"Unsupported AWS_AUTH_MODE={mode}")

    def _session_from_keys(self) -> boto3.Session:
        # If explicit keys exist -> use them
        if settings.AWS_ACCESS_KEY_ID and settings.AWS_SECRET_ACCESS_KEY:
            log.info("aws session: keys mode (explicit)")
            return boto3.Session(
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                aws_session_token=settings.AWS_SESSION_TOKEN,
                region_name=self.region,
            )

        # else fallback to default AWS credential chain
        log.info("aws session: keys mode (default chain)")
        return boto3.Session(region_name=self.region)

    def _session_from_assume_role(self) -> boto3.Session:
        if not settings.AWS_ASSUME_ROLE_ARN:
            raise ValueError("AWS_ASSUME_ROLE_ARN is required for assume_role mode")

        base = boto3.Session(region_name=self.region)
        sts = base.client("sts", region_name=self.region)

        role_arn = settings.AWS_ASSUME_ROLE_ARN
        log.info("aws session: assume_role mode | role=%s", role_arn)

        try:
            resp = sts.assume_role(
                RoleArn=role_arn,
                RoleSessionName="ingressa-session",
            )
        except ClientError as e:
            raise RuntimeError(f"assume_role failed: {e}") from e

        creds = resp["Credentials"]

        return boto3.Session(
            aws_access_key_id=creds["AccessKeyId"],
            aws_secret_access_key=creds["SecretAccessKey"],
            aws_session_token=creds["SessionToken"],
            region_name=self.region,
        )
