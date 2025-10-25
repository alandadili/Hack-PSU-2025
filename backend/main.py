from fastapi import FastAPI, HTTPException, Request, Body
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def health():
    return {"status": "ok"}

@app.post("/login")
async def login(payload: dict = Body(...), request: Request = None):
    """
    Simple login stub. Expects JSON: { "username": "...", "password": "..." }
    """
    username = payload.get("username") or payload.get("email")
    password = payload.get("password")

    if not username or not password:
        raise HTTPException(status_code=400, detail="username and password required")

    if username == "test" and password == "test":
        response = JSONResponse(
            content={"message": "Login successful", "access_token": "dummy_token"}
        )
        response.set_cookie(
            key="session_id", value="dummy_session_token", httponly=True, max_age=1800
        )
        return response

    raise HTTPException(status_code=401, detail="Invalid credentials")