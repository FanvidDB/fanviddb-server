"""Made username unique

Revision ID: 783f90d206f6
Revises: efc64168fb33
Create Date: 2021-04-11 14:45:18.910994

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '783f90d206f6'
down_revision = 'efc64168fb33'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_unique_constraint(None, 'user', ['username'])
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint(None, 'user', type_='unique')
    # ### end Alembic commands ###
