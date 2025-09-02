from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Appointment
from dotenv import load_dotenv
import os, jwt
from datetime import datetime

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")
JWT_SECRET = os.environ.get("JWT_SECRET")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base.metadata.create_all(bind=engine)

router = APIRouter(tags=["appointments"])

def get_current_user(Authorization: str = Header(None)):
    if not Authorization or not Authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Bearer token")
    token = Authorization.split(" ")[1]
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

class AppointmentCreate(BaseModel):
    coach_id: str
    date: datetime

@router.post("/")
def create_appointment(data: AppointmentCreate, user=Depends(get_current_user)):
    if user["role"] != "particulier":
        raise HTTPException(status_code=403, detail="Only particuliers can create appointments")
    db = SessionLocal()
    appointment = Appointment(user_id=user["sub"], coach_id=data.coach_id, date=data.date)
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return {"id": str(appointment.id), "status": appointment.status}

@router.get("/user/{user_id}")
def get_user_appointments(user_id: str, user=Depends(get_current_user)):
    db = SessionLocal()
    appts = db.query(Appointment).filter(Appointment.user_id == user_id).all()
    return [a.__dict__ for a in appts]

@router.get("/coach/{coach_id}")
def get_coach_appointments(coach_id: str, user=Depends(get_current_user)):
    db = SessionLocal()
    appts = db.query(Appointment).filter(Appointment.coach_id == coach_id).all()
    return [a.__dict__ for a in appts]

@router.put("/{appointment_id}/status")
def update_status(appointment_id: str, status: str, user=Depends(get_current_user)):
    if user["role"] != "coach":
        raise HTTPException(status_code=403, detail="Only coaches can update status")
    db = SessionLocal()
    appt = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appt.status = status
    db.commit()
    return {"id": appointment_id, "new_status": status}
