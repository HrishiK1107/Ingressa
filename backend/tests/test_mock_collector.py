import json
from pathlib import Path

from app.collectors.mock_aws_collector import MockAWSCollector


def test_mock_collector_matches_fixture():
    collector = MockAWSCollector(region="ap-south-1")
    out = collector.collect()

    fixture_path = Path(__file__).resolve().parent / "fixtures" / "aws" / "mock_state.json"

    with fixture_path.open("r", encoding="utf-8") as f:
        fixture = json.load(f)

    assert out.account_id == fixture["account_id"]
    assert out.region == fixture["region"]

    # collected_at is parsed datetime (fixture date fixed)
    assert out.collected_at.isoformat().startswith("2026-01-01T00:00:00")

    assert out.resources == fixture["resources"]
