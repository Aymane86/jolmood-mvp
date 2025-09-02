from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy import create_engine, func
from sqlalchemy.orm import sessionmaker
from models import Base, AdminLog
from dotenv import load_dotenv
import os, jwt
from datetime import datetime

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")
JWT_SECRET = os.environ.get("JWT_SECRET")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base.metadata.create_all(bind=engine)

router = APIRouter(tags=["admin"])

def get_current_admin(Authorization: str = Header(None)):
    if not Authorization or not Authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Bearer token")
    token = Authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        if payload.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Admins only")
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.get("/stats")
def stats(user=Depends(get_current_admin)):
    # MVP → données simulées
    return {
        "users_count": 5,
        "posts_count": 10,
        "appointments_count": 3,
        "active_coaches": 2,
        "active_particuliers": 3
    }

@router.get("/logs")
def get_logs(user=Depends(get_current_admin)):
    db = SessionLocal()
    logs = db.query(AdminLog).all()
    return [ {"action": l.action, "created_at": l.created_at} for l in logs ]

@router.post("/logs")
def add_log(action: str, user=Depends(get_current_admin)):
    db = SessionLocal()
    log = AdminLog(action=action)
    db.add(log)
    db.commit()
    return {"message": "Log added"}
