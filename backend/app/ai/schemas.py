from typing import Any, Dict, List

from pydantic import BaseModel


class AIExplainRequest(BaseModel):
    finding: Dict[str, Any]


class AIExplainResponse(BaseModel):
    explanation: str
    attack_narrative: str
    priority_reasoning: str
    fix_suggestions: List[str]
