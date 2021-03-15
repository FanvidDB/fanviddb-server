"""added fanvid table

Revision ID: c5cef61ec67a
Revises: 3dcb51b20021
Create Date: 2021-03-14 19:46:49.253373

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'c5cef61ec67a'
down_revision = '3dcb51b20021'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('fanvids',
    sa.Column('uuid', postgresql.UUID(as_uuid=True), nullable=False),
    sa.Column('title', sa.String(), nullable=True),
    sa.Column('creators', sa.JSON(), nullable=True),
    sa.Column('premiere_date', sa.DateTime(), nullable=True),
    sa.Column('premiere_event', sa.String(), nullable=True),
    sa.Column('audio_title', sa.String(), nullable=True),
    sa.Column('audio_artists_or_sources', sa.String(), nullable=True),
    sa.Column('audio_language', sa.String(), nullable=True),
    sa.Column('length', sa.Interval(), nullable=True),
    sa.Column('rating', sa.String(), nullable=True),
    sa.Column('fandoms', sa.String(), nullable=True),
    sa.Column('summary', sa.String(), nullable=True),
    sa.Column('content_notes', sa.String(), nullable=True),
    sa.Column('urls', sa.String(), nullable=True),
    sa.Column('unique_identifiers', sa.String(), nullable=True),
    sa.Column('thumbnail_url', sa.String(), nullable=True),
    sa.Column('state', sa.String(), nullable=True),
    sa.Column('created_timestamp', sa.DateTime(), nullable=True),
    sa.Column('modified_timestamp', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('uuid')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('fanvids')
    # ### end Alembic commands ###