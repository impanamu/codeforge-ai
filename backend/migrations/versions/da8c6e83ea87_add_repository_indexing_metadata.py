"""add repository indexing metadata

Revision ID: da8c6e83ea87
Revises: 0a56bf067b69
Create Date: 2026-07-22 21:37:02.718251

"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "da8c6e83ea87"
down_revision: str | Sequence[str] | None = "0a56bf067b69"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Upgrade schema."""

    op.add_column(
        "repositories",
        sa.Column(
            "status",
            sa.String(length=50),
            nullable=False,
            server_default="Not Indexed",
        ),
    )

    op.add_column(
        "repositories",
        sa.Column(
            "indexed_chunks",
            sa.Integer(),
            nullable=False,
            server_default="0",
        ),
    )

    op.add_column(
        "repositories",
        sa.Column(
            "indexed_files",
            sa.Integer(),
            nullable=False,
            server_default="0",
        ),
    )

    op.add_column(
        "repositories",
        sa.Column(
            "last_indexed_at",
            sa.DateTime(),
            nullable=True,
        ),
    )

    # Remove temporary defaults after existing rows are updated
    op.alter_column(
        "repositories",
        "status",
        server_default=None,
    )

    op.alter_column(
        "repositories",
        "indexed_chunks",
        server_default=None,
    )

    op.alter_column(
        "repositories",
        "indexed_files",
        server_default=None,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column("repositories", "last_indexed_at")
    op.drop_column("repositories", "indexed_files")
    op.drop_column("repositories", "indexed_chunks")
    op.drop_column("repositories", "status")