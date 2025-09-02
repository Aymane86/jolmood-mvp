from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, UserProfile
from dotenv import load_dotenv
import os, jwt

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")
JWT_SECRET = os.environ.get("JWT_SECRET")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base.metadata.create_all(bind=engine)

router = APIRouter(tags=["users"])

class ProfileUpdate(BaseModel):
    bio: str | None = None
    avatar_url: str | None = None

class ProfileCreate(BaseModel):
    user_id: str
    name: str
    email: str
    role: str = "particulier"
    bio: str | None = None
    avatar_url: str | None = None

def get_current_user(Authorization: str = Header(None)):
    if not Authorization or not Authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Bearer token")
    token = Authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/create")
def create_profile(data: ProfileCreate):
    db = SessionLocal()
    if db.query(UserProfile).filter(UserProfile.email == data.email).first():
        raise HTTPException(status_code=400, detail="Profile already exists")
    profile = UserProfile(**data.dict())
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return {"id": str(profile.id), "email": profile.email}

@router.get("/me")
def get_my_profile(user=Depends(get_current_user)):
    db = SessionLocal()
    profile = db.query(UserProfile).filter(UserProfile.user_id == user["sub"]).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile.__dict__

@router.put("/me")
def update_my_profile(update: ProfileUpdate, user=Depends(get_current_user)):
    db = SessionLocal()
    profile = db.query(UserProfile).filter(UserProfile.user_id == user["sub"]).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    if update.bio: profile.bio = update.bio
    if update.avatar_url: profile.avatar_url = update.avatar_url
    db.commit()
    return {"message": "Profile updated"}

@router.get("/{user_id}")
def get_public_profile(user_id: str):
    db = SessionLocal()
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {
        "name": profile.name,
        "role": profile.role,
        "bio": profile.bio,
        "avatar_url": profile.avatar_url
    }

@router.get("/")
def list_profiles(skip: int = 0, limit: int = 10):
    db = SessionLocal()
    profiles = db.query(UserProfile).offset(skip).limit(limit).all()
    return [p.__dict__ for p in profiles]
