from fastapi import APIRouter

from app.ai.advisor import AIAdvisor
from app.ai.schemas import AIExplainRequest, AIExplainResponse

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/explain_finding", response_model=AIExplainResponse)
def explain_finding(req: AIExplainRequest):
    advisor = AIAdvisor()
    return advisor.explain(req.finding)
