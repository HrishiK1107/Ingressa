"""add unique constraint for findings key

Revision ID: 0b4cc182c000
Revises: a63dac2c432c
Create Date: 2026-01-29 17:17:19.557225

"""

from typing import Sequence, Union

# revision identifiers, used by Alembic.
revision: str = "0b4cc182c000"
down_revision: Union[str, None] = "a63dac2c432c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    pass


def downgrade() -> None:
    pass
