"""Made filename search not nullable

Revision ID: 7e570d5c7aa0
Revises: 1ad61786605d
Create Date: 2022-03-25 21:18:10.617165

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '7e570d5c7aa0'
down_revision = '1ad61786605d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('fanvids', 'filename_search_doc',
               existing_type=postgresql.TSVECTOR(),
               nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('fanvids', 'filename_search_doc',
               existing_type=postgresql.TSVECTOR(),
               nullable=True)
    # ### end Alembic commands ###