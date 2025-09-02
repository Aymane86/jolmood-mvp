from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, String, DateTime, Integer
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

Base = declarative_base()

class AdminLog(Base):
    __tablename__ = "admin_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    action = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
