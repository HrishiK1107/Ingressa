from datetime import datetime
from typing import Optional

from sqlalchemy import JSON, DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


# -------------------------
# Scan Runs
# -------------------------
class ScanRun(Base):
    __tablename__ = "scan_runs"

    id: Mapped[int] = mapped_column(primary_key=True)
    scan_id: Mapped[str] = mapped_column(String(64), unique=True, index=True)

    mode: Mapped[str] = mapped_column(String(16))  # mock | aws
    status: Mapped[str] = mapped_column(String(16))  # RUNNING | SUCCESS | FAILED

    started_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    finished_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    findings = relationship("Finding", back_populates="scan_run")


# -------------------------
# Assets
# -------------------------
class Asset(Base):
    __tablename__ = "assets"

    id: Mapped[int] = mapped_column(primary_key=True)

    asset_id: Mapped[str] = mapped_column(String(128), index=True)
    asset_type: Mapped[str] = mapped_column(String(64))
    region: Mapped[str] = mapped_column(String(32))

    name: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    data: Mapped[dict] = mapped_column(JSON)

    findings = relationship("Finding", back_populates="asset")


# -------------------------
# Findings
# -------------------------
class Finding(Base):
    __tablename__ = "findings"

    id: Mapped[int] = mapped_column(primary_key=True)

    policy_id: Mapped[str] = mapped_column(String(32), index=True)
    severity: Mapped[str] = mapped_column(String(16))  # LOW/MED/HIGH/CRITICAL
    risk_score: Mapped[int]

    status: Mapped[str] = mapped_column(String(16))  # OPEN/RESOLVED

    # ✅ canonical resource binding (needed for UI + reconciliation key)
    resource_id: Mapped[str] = mapped_column(String(256), index=True)
    resource_type: Mapped[str] = mapped_column(String(64), index=True)
    region: Mapped[str] = mapped_column(String(32), index=True)

    asset_id_fk: Mapped[int] = mapped_column(ForeignKey("assets.id"))
    scan_run_id: Mapped[int] = mapped_column(ForeignKey("scan_runs.id"))

    evidence: Mapped[dict] = mapped_column(JSON)
    remediation: Mapped[str]

    first_seen: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    last_seen: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    asset = relationship("Asset", back_populates="findings")
    scan_run = relationship("ScanRun", back_populates="findings")
    events = relationship("FindingEvent", back_populates="finding")


# -------------------------
# Finding Events (timeline)
# -------------------------
class FindingEvent(Base):
    __tablename__ = "finding_events"

    id: Mapped[int] = mapped_column(primary_key=True)

    finding_id: Mapped[int] = mapped_column(ForeignKey("findings.id"))
    event_type: Mapped[str] = mapped_column(String(32))  # CREATED / UPDATED / RESOLVED
    message: Mapped[str]

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # optional evidence snapshot (helps timeline later)
    snapshot: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

    finding = relationship("Finding", back_populates="events")
