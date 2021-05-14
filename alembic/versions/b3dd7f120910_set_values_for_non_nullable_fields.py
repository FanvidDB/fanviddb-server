"""set all fanvid states to active

Revision ID: b3dd7f120910
Revises: 783f90d206f6
Create Date: 2021-05-01 17:41:50.332611

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "b3dd7f120910"
down_revision = "783f90d206f6"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    fanvids = sa.table(
        "fanvids", sa.column("state", sa.String), sa.column("premiere_event", sa.String)
    )
    op.execute(fanvids.update().values({"state": "active"}))
    op.execute(
        fanvids.update()
        .where(fanvids.c.premiere_event == None)
        .values({"premiere_event": ""})
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    pass
    # ### end Alembic commands ###