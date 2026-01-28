import csv
import io
import json
import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.db.models import Finding

router = APIRouter(prefix="/reports", tags=["reports"])
log = logging.getLogger("ingressa.reports")


@router.get("/export")
def export_findings(
    db: Session = Depends(get_db),
    format: str = Query(default="csv", pattern="^(csv|json)$"),
    severity: Optional[str] = Query(default=None),
    status: Optional[str] = Query(default=None),
):
    query = db.query(Finding)

    if severity:
        query = query.filter(Finding.severity == severity)
    if status:
        query = query.filter(Finding.status == status)

    findings = query.order_by(Finding.risk_score.desc(), Finding.last_seen.desc()).all()

    if format == "json":
        payload = []
        for f in findings:
            payload.append(
                {
                    "finding_id": f.id,
                    "policy_id": f.policy_id,
                    "severity": f.severity,
                    "risk_score": f.risk_score,
                    "status": f.status,
                    "resource_id": f.resource_id,
                    "resource_type": f.resource_type,
                    "region": f.region,
                    "first_seen": f.first_seen.isoformat(),
                    "last_seen": f.last_seen.isoformat(),
                    "evidence": f.evidence,
                    "remediation": f.remediation,
                }
            )

        content = json.dumps(payload, indent=2)
        return StreamingResponse(
            io.BytesIO(content.encode("utf-8")),
            media_type="application/json",
            headers={"Content-Disposition": "attachment; filename=findings.json"},
        )

    if format == "csv":
        buffer = io.StringIO()
        writer = csv.writer(buffer)

        writer.writerow(
            [
                "finding_id",
                "policy_id",
                "severity",
                "risk_score",
                "status",
                "resource_id",
                "resource_type",
                "region",
                "first_seen",
                "last_seen",
            ]
        )

        for f in findings:
            writer.writerow(
                [
                    f.id,
                    f.policy_id,
                    f.severity,
                    f.risk_score,
                    f.status,
                    f.resource_id,
                    f.resource_type,
                    f.region,
                    f.first_seen.isoformat(),
                    f.last_seen.isoformat(),
                ]
            )

        data = buffer.getvalue().encode("utf-8")

        return StreamingResponse(
            io.BytesIO(data),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=findings.csv"},
        )

    raise HTTPException(status_code=400, detail="invalid format")
