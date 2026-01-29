"""b11.2 add scan run metadata

Revision ID: a372203201eb
Revises: 0b4cc182c000
Create Date: 2026-01-30 00:27:12.505438

"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "a372203201eb"
down_revision: Union[str, None] = "0b4cc182c000"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column("scan_runs", sa.Column("asset_count", sa.Integer(), nullable=True))
    op.add_column("scan_runs", sa.Column("finding_count", sa.Integer(), nullable=True))
    op.add_column("scan_runs", sa.Column("duration_ms", sa.Integer(), nullable=True))
    op.add_column("scan_runs", sa.Column("error_reason", sa.String(length=512), nullable=True))


def downgrade():
    op.drop_column("scan_runs", "error_reason")
    op.drop_column("scan_runs", "duration_ms")
    op.drop_column("scan_runs", "finding_count")
    op.drop_column("scan_runs", "asset_count")
