import os, io
from datetime import datetime, timezone
from fastapi import FastAPI, UploadFile, File, HTTPException, Header
from fastapi.responses import StreamingResponse
from pymongo import MongoClient
from gridfs import GridFS
from bson import ObjectId
from utils import decode_bearer

MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo:27017/jolmood_media")
GRIDFS_BUCKET = os.getenv("GRIDFS_BUCKET", "uploads")

app = FastAPI(title="media-service")

client = MongoClient(MONGO_URI)
db = client.get_default_database()
fs = GridFS(db, collection=GRIDFS_BUCKET)
meta = db["media_meta"]

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/media/upload")
async def upload_media(file: UploadFile = File(...), authorization: str = Header(None)):
    user = decode_bearer(authorization)
    if file.content_type not in {"image/png","image/jpeg","image/jpg","video/mp4"}:
        raise HTTPException(400, "Unsupported content type")

    raw = await file.read()
    if not raw:
        raise HTTPException(400, "Empty file")

    grid_id = fs.put(raw, filename=file.filename, contentType=file.content_type)
    doc = {
        "owner_id": user.get("sub"),
        "type": file.content_type,
        "size": len(raw),
        "filename": file.filename,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "gridfs_id": grid_id,
        "visibility": "private",
    }
    ins = meta.insert_one(doc)
    return {"media_id": str(ins.inserted_id)}

@app.get("/media/meta/{media_id}")
def get_metadata(media_id: str, authorization: str = Header(None)):
    user = decode_bearer(authorization)
    _id = _as_oid(media_id)
    m = meta.find_one({"_id": _id}) or _not_found()
    _authorize_read(m, user)
    return _normalize(m)

@app.get("/media/{media_id}")
def get_media(media_id: str, authorization: str = Header(None)):
    user = decode_bearer(authorization)
    _id = _as_oid(media_id)
    m = meta.find_one({"_id": _id}) or _not_found()
    _authorize_read(m, user)
    gf = fs.get(m["gridfs_id"])
    return StreamingResponse(io.BytesIO(gf.read()), media_type=m.get("type") or "application/octet-stream")

@app.delete("/media/{media_id}")
def delete_media(media_id: str, authorization: str = Header(None)):
    user = decode_bearer(authorization)
    _id = _as_oid(media_id)
    m = meta.find_one({"_id": _id}) or _not_found()
    _authorize_delete(m, user)
    fs.delete(m["gridfs_id"])
    meta.delete_one({"_id": _id})
    return {"deleted": True}

def _as_oid(s: str) -> ObjectId:
    try:
        return ObjectId(s)
    except Exception:
        raise HTTPException(400, "Invalid media_id")

def _not_found():
    raise HTTPException(404, "Not found")

def _normalize(m: dict) -> dict:
    m["_id"] = str(m["_id"])
    m["gridfs_id"] = str(m["gridfs_id"])
    return m

def _authorize_read(m: dict, user: dict):
    if m.get("visibility") == "public":
        return
    if user.get("role") == "admin":
        return
    if user.get("sub") == m.get("owner_id"):
        return
    raise HTTPException(403, "Forbidden")

def _authorize_delete(m: dict, user: dict):
    if user.get("role") == "admin":
        return
    if user.get("sub") == m.get("owner_id"):
        return
    raise HTTPException(403, "Forbidden")



