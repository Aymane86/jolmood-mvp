from fastapi import APIRouter, Depends, HTTPException, Header
from pydantic import BaseModel
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Post, Comment, Like
from dotenv import load_dotenv
import os, jwt
from datetime import datetime

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")
JWT_SECRET = os.environ.get("JWT_SECRET")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base.metadata.create_all(bind=engine)

router = APIRouter(tags=["posts"])

def get_current_user(Authorization: str = Header(None)):
    if not Authorization or not Authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Bearer token")
    token = Authorization.split(" ")[1]
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

class PostCreate(BaseModel):
    content: str
    media_url: str | None = None
    media_id: str | None = None

@router.post("/")
def create_post(data: PostCreate, user=Depends(get_current_user)):
    db = SessionLocal()
    post = Post(user_id=user["sub"], content=data.content, media_url=data.media_url, media_id=data.media_id)
    db.add(post)
    db.commit()
    db.refresh(post)
    return {"id": str(post.id), "content": post.content, "media_id": post.media_id, "created_at": post.created_at}

@router.get("/")
def list_posts(skip: int = 0, limit: int = 10, user=Depends(get_current_user)):
    db = SessionLocal()
    posts = db.query(Post).order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
    return [p.__dict__ for p in posts]

@router.post("/{post_id}/like")
def like_post(post_id: str, user=Depends(get_current_user)):
    db = SessionLocal()
    existing = db.query(Like).filter(Like.post_id == post_id, Like.user_id == user["sub"]).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already liked")
    like = Like(post_id=post_id, user_id=user["sub"])
    db.add(like)
    db.commit()
    return {"message": "Liked"}

class CommentCreate(BaseModel):
    content: str

@router.post("/{post_id}/comment")
def comment_post(post_id: str, data: CommentCreate, user=Depends(get_current_user)):
    db = SessionLocal()
    comment = Comment(post_id=post_id, user_id=user["sub"], content=data.content)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return {"id": str(comment.id), "content": comment.content, "created_at": comment.created_at}

@router.get("/{post_id}/comments")
def list_comments(post_id: str, skip: int = 0, limit: int = 10, user=Depends(get_current_user)):
    db = SessionLocal()
    comments = db.query(Comment).filter(Comment.post_id == post_id).order_by(Comment.created_at).offset(skip).limit(limit).all()
    return [c.__dict__ for c in comments]
