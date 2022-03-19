"""Added filename search doc and index

Revision ID: 1ad61786605d
Revises: a98187169b2b
Create Date: 2022-03-18 07:46:08.115355

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '1ad61786605d'
down_revision = 'a98187169b2b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('fanvids', sa.Column('filename_search_doc', postgresql.TSVECTOR(), nullable=True, server_default=''))
    op.alter_column('fanvids', 'filename_search_doc', server_default=None)
    op.create_index('filename_search_index', 'fanvids', ['filename_search_doc'], unique=False, postgresql_using='gin')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index('filename_search_index', table_name='fanvids')
    op.drop_column('fanvids', 'filename_search_doc')
    # ### end Alembic commands ###
