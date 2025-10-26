from fastapi import FastAPI, HTTPException, Request, Body, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uuid
import time
# todo uncomment
#from mongoConnection import AuthUser
from chatbot import handle_user_message, Chats

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory session store (for development)
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
    if session["expires_at"] < time.time():
        SESSIONS.pop(sid, None)
        return None
    return session

def _destroy_session(sid: str):
    SESSIONS.pop(sid, None)

async def get_current_user(request: Request):
    sid = None
    auth = request.headers.get("Authorization")
    if auth and auth.lower().startswith("bearer "):
        sid = auth.split(None, 1)[1].strip()
    if not sid:
        sid = request.headers.get("X-Session")
    if not sid:
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

    chats = Chats()
    chats.set_chat()

    if not username or not password:
        raise HTTPException(status_code=400, detail="username and password required")

    # TODO: Replace with authentication
    if auth(username, password):
        sid = _create_session(username)
        response = JSONResponse(
            content={"message": "Login successful", "username": username, "session_id": sid}
        )
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


# chatting
@app.post("/chat")
async def chat(request: Request):
    try:
        body = await request.json()
        text = body.get("text")
        if not text:
            raise HTTPException(status_code=400, detail="Message text is required")
            
        # Set a 2-minute timeout for the entire operation
        response = await handle_user_message(text)
        return {"response": response}
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid JSON body")
    except Exception as e:
        print(f"[ERROR] Chat request failed: {str(e)}")
        raise HTTPException(status_code=504, detail="Request timed out or failed to process")
    

def authenticate(username: str, password: str) -> bool:
    """
    Simple username/password authentication (no encryption).
    """
    try:
        user = AuthUser.objects(username=username).first()
        if not user:
            return False
        # Compare plain text passwords
        return password == user.password
    except Exception:
        return False
    
def auth(username: str, password: str) -> bool:
    return username == "test" and password == "test"
