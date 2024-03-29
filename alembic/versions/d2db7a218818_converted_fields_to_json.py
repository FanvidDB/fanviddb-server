"""Converted fields to JSON

Revision ID: d2db7a218818
Revises: 7e570d5c7aa0
Create Date: 2022-10-24 17:25:26.380655

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd2db7a218818'
down_revision = '7e570d5c7aa0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('fanvids', 'audio_artists_or_sources',
               existing_type=sa.VARCHAR(),
               type_=sa.JSON(),
               existing_nullable=False,
               postgresql_using='audio_artists_or_sources::json')
    op.alter_column('fanvids', 'audio_languages',
               existing_type=sa.VARCHAR(),
               type_=sa.JSON(),
               existing_nullable=False,
               postgresql_using='audio_languages::json')
    op.alter_column('fanvids', 'fandoms',
               existing_type=sa.VARCHAR(),
               type_=sa.JSON(),
               existing_nullable=False,
               postgresql_using='fandoms::json')
    op.alter_column('fanvids', 'content_notes',
               existing_type=sa.VARCHAR(),
               type_=sa.JSON(),
               existing_nullable=False,
               postgresql_using='content_notes::json')
    op.alter_column('fanvids', 'urls',
               existing_type=sa.VARCHAR(),
               type_=sa.JSON(),
               existing_nullable=False,
               postgresql_using='urls::json')
    op.alter_column('fanvids', 'unique_identifiers',
               existing_type=sa.VARCHAR(),
               type_=sa.JSON(),
               existing_nullable=False,
               postgresql_using='unique_identifiers::json')
    op.alter_column('user', 'hashed_password',
               existing_type=sa.VARCHAR(length=72),
               type_=sa.String(length=1024),
               existing_nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('user', 'hashed_password',
               existing_type=sa.String(length=1024),
               type_=sa.VARCHAR(length=72),
               existing_nullable=False)
    op.alter_column('fanvids', 'unique_identifiers',
               existing_type=sa.JSON(),
               type_=sa.VARCHAR(),
               existing_nullable=False)
    op.alter_column('fanvids', 'urls',
               existing_type=sa.JSON(),
               type_=sa.VARCHAR(),
               existing_nullable=False)
    op.alter_column('fanvids', 'content_notes',
               existing_type=sa.JSON(),
               type_=sa.VARCHAR(),
               existing_nullable=False)
    op.alter_column('fanvids', 'fandoms',
               existing_type=sa.JSON(),
               type_=sa.VARCHAR(),
               existing_nullable=False)
    op.alter_column('fanvids', 'audio_languages',
               existing_type=sa.JSON(),
               type_=sa.VARCHAR(),
               existing_nullable=False)
    op.alter_column('fanvids', 'audio_artists_or_sources',
               existing_type=sa.JSON(),
               type_=sa.VARCHAR(),
               existing_nullable=False)
    # ### end Alembic commands ###
