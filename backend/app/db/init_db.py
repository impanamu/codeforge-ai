from app.db.base import Base
from app.db.session import engine

# Import models here


def init_db():
    Base.metadata.create_all(bind=engine)