import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, Optional

from app.collectors.base import BaseCollector
from app.collectors.types import CollectorOutput


class MockAWSCollector(BaseCollector):
    name = "mock_aws"

    def __init__(self, region: str, fixture_path: Optional[str] = None):
        super().__init__(region=region, account_id=None)
        self.fixture_path = fixture_path

    def _load_fixture(self) -> Dict[str, Any]:
        if self.fixture_path:
            path = Path(self.fixture_path)
        else:
            # default: backend/tests/fixtures/aws/mock_state.json
            path = (
                Path(__file__).resolve().parents[2]
                / "tests"
                / "fixtures"
                / "aws"
                / "mock_state.json"
            )

        with path.open("r", encoding="utf-8") as f:
            return json.load(f)

    def collect(self) -> CollectorOutput:
        data = self._load_fixture()

        account_id = data["account_id"]
        region = data.get("region", self.region)

        # parse fixture collected_at (Z)
        collected_raw = data.get("collected_at", None)
        if collected_raw and isinstance(collected_raw, str) and collected_raw.endswith("Z"):
            collected_at = datetime.fromisoformat(collected_raw.replace("Z", "+00:00"))
        else:
            collected_at = datetime.now(timezone.utc)

        resources = data.get("resources", {})

        return CollectorOutput(
            account_id=account_id,
            region=region,
            collected_at=collected_at,
            resources=resources,
        )
