"""Add hotel_id column to reviews

Revision ID: 3fc6e5f5adb0
Revises: 06d2f9b19aa2
Create Date: 2024-11-27 15:25:41.536625

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3fc6e5f5adb0'
down_revision = '06d2f9b19aa2'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('hotels',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('city_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['city_id'], ['cities.id'], name=op.f('fk_hotels_city_id_cities')),
    sa.PrimaryKeyConstraint('id')
    )
    with op.batch_alter_table('reviews', schema=None) as batch_op:
        batch_op.add_column(sa.Column('hotel_id', sa.Integer(), nullable=True))
        batch_op.create_foreign_key(batch_op.f('fk_reviews_hotel_id_hotels'), 'hotels', ['hotel_id'], ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('reviews', schema=None) as batch_op:
        batch_op.drop_constraint(batch_op.f('fk_reviews_hotel_id_hotels'), type_='foreignkey')
        batch_op.drop_column('hotel_id')

    op.drop_table('hotels')
    # ### end Alembic commands ###
