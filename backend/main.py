from fastapi import FastAPI, HTTPException, Request, Body, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uuid
import time
from mongoConnection import AuthUsers
from chatbot import handle_user_message

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://hack-psu-2025.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
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
    Login endpoint. Expects JSON: { "username": "...", "password": "..." }
    """
    try:
        print("[LOGIN] Starting login process")
        username = payload.get("username") or payload.get("email")
        password = payload.get("password")
        print(f"[LOGIN] Username: {username}")

        if not username or not password:
            raise HTTPException(status_code=400, detail="username and password required")

        print("[LOGIN] Calling authenticate...")
        if authenticate(username, password):
            print("[LOGIN] Authentication successful, creating session...")
            
            # Don't initialize chat on login - do it when user first chats instead
            # This avoids crashes if API key is missing
            
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
            print("[LOGIN] Returning success response")
            return response

        print("[LOGIN] Authentication failed")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Login error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

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

@app.post("/chat")
async def chat(request: Request):

    try:
        body = await request.json()
        text = body.get("text")
        if not text:
            raise HTTPException(status_code=400, detail="Message text is required")
            
        # Set a 2-minute timeout for the entire operation
        response = await handle_user_message(text)
        return response
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid JSON body")
    except Exception as e:
        print(f"[ERROR] Chat request failed: {str(e)}")
        raise HTTPException(status_code=504, detail="Request timed out or failed to process")
    
def authenticate(username: str, password: str) -> bool:
    """
    Simple username/password authentication with plain text passwords.
    """
    print(f"[DEBUG] Authenticating user: {username}")
    try:
        # Try to find user by username
        print(f"[DEBUG] Querying MongoDB for username: {username}")
        user = AuthUsers.objects(username=username).first()
        print(f"[DEBUG] Query result: {user}")
        
        # Try by email if not found
        if not user:
            print(f"[DEBUG] Trying email query...")
            user = AuthUsers.objects(email=username).first()
            print(f"[DEBUG] Email query result: {user}")
        
        if not user:
            print(f"[DEBUG] No user found for: {username}")
            # Debug: Let's see what users exist
            all_users = AuthUsers.objects()
            print(f"[DEBUG] Total users in database: {all_users.count()}")
            for u in all_users:
                print(f"[DEBUG] Found user: username='{u.username}', email='{u.email}'")
            return False
        
        # Plain text password comparison
        print(f"[DEBUG] Comparing passwords - Input: '{password}', Stored: '{user.password}'")
        is_valid = (password == user.password)
        print(f"[DEBUG] Authentication result: {is_valid}")
        return is_valid
        
    except Exception as e:
        print(f"[ERROR] Authentication error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False