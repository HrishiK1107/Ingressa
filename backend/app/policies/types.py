from dataclasses import dataclass
from typing import Any, Dict, Optional


@dataclass(frozen=True)
class PolicyResult:
    policy_id: str
    severity: str
    risk_score: int
    title: str
    description: str
    remediation: str

    resource_id: str
    resource_type: str
    region: str

    evidence: Dict[str, Any]
    status: str = "OPEN"

    asset_key: Optional[str] = None
