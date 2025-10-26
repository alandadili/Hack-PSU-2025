from fastapi import FastAPI, HTTPException, Request, Body, Response, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uuid
import time

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory sessionion store (for dev). Replace with DB/redis for production.
SESSIONS: dict = {}
SESSION_EXPIRY_SECONDS = 60 * 60 * 24  # 1 day

def _create_session(username: str) -> str:
    sid = uuid.uuid4().hex
    expires_at = time.time() + SESSION_EXPIRY_SECONDS
    SESSIONS[sid] = {"username": username, "expires_at": expires_at}
    return sid

def _get_session(sid: str) -> Optional[dict]:
    session = SESSIONS.get(sid)
    if not session:
        return None
    # expire cleanup
    if session["expires_at"] < time.time():
        try:
            del SESSIONS[sid]
        except KeyError:
            pass
        return None
    return session

def _destroy_session(sid: str):
    SESSIONS.pop(sid, None)

async def get_current_user(request: Request):
    sid = request.cookies.get("session_id")
    if not sid:
        raise HTTPException(status_code=401, detail="Not authenticated")
    session = _get_session(sid)
    if not session:
        raise HTTPException(status_code=401, detail="Session expired or invalid")
    return session["username"]

@app.get("/")
async def health():
    return {"status": "ok"}

@app.post("/login")
async def login(payload: dict = Body(...)):
    """
    Simple login stub. Expects JSON: { "username": "...", "password": "..." }
    On success sets an HttpOnly cookie `session_id`.
    """
    username = payload.get("username") or payload.get("email")
    password = payload.get("password")

    if not username or not password:
        raise HTTPException(status_code=400, detail="username and password required")

    # Replace with real authenticator / DB check
    if (authenticate(username, password)):
        sid = _create_session(username)
        response = JSONResponse(content={"message": "Login successful", "username": username})
        # For local dev secure=False. Set secure=True when using HTTPS.
        response.set_cookie(
            key="session_id",
            value=sid,
            httponly=True,
            max_age=SESSION_EXPIRY_SECONDS,
            samesite="lax",
            secure=False,
        )
        return response

    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.post("/logout")
async def logout(request: Request):
    sid = request.cookies.get("session_id")
    if sid:
        _destroy_session(sid)
    resp = JSONResponse(content={"message": "Logged out"})
    resp.delete_cookie("session_id")
    return resp

@app.get("/me")
async def me(username: str = Depends(get_current_user)):
    return {"username": username}

def authenticate(username: str, password: str) -> bool:
    # TODO make real autahentator with DB
    return username == "test" and password == "test" 
