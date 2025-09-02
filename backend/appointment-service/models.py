from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime

Base = declarative_base()

class Appointment(Base):
    __tablename__ = "appointments"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False)     # particulier
    coach_id = Column(UUID(as_uuid=True), nullable=False)    # coach
    date = Column(DateTime, nullable=False)
    status = Column(String, default="pending")  # pending | accepted | rejected
    created_at = Column(DateTime, default=datetime.utcnow)
