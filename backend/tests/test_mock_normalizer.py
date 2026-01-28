import json
from pathlib import Path

from app.collectors.mock_aws_collector import MockAWSCollector
from app.normalizer.mock_aws_normalizer import MockAWSNormalizer


def test_mock_normalizer_matches_fixture():
    collector = MockAWSCollector(region="ap-south-1")
    collected = collector.collect()

    normalizer = MockAWSNormalizer()
    snap = normalizer.normalize(collected)

    fixture_path = Path(__file__).resolve().parent / "fixtures" / "aws" / "normalized_snapshot.json"
    with fixture_path.open("r", encoding="utf-8") as f:
        fixture = json.load(f)

    assert snap.account_id == fixture["account_id"]
    assert snap.region == fixture["region"]
    assert snap.collected_at.isoformat() == fixture["collected_at"]

    # convert dataclasses to dict list
    assets = [
        {
            "asset_id": a.asset_id,
            "asset_type": a.asset_type,
            "region": a.region,
            "name": a.name,
            "data": a.data,
        }
        for a in snap.assets
    ]

    assert assets == fixture["assets"]
    assert snap.raw == fixture["raw"]
