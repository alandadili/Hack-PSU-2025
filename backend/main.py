from fastapi import FastAPI, HTTPException, Request, Body
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from mongoConnection import AuthUser  # new model

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@app.get("/")
async def health():
    return {"status": "ok"}

@app.post("/register")
async def register(payload: dict = Body(...)):
    username = payload.get("username")
    password = payload.get("password")
    email = payload.get("email")
    if not username or not password:
        raise HTTPException(status_code=400, detail="username and password required")
    if AuthUser.objects(username=username).first():
        raise HTTPException(status_code=400, detail="username already exists")
    hashed = pwd_context.hash(password)
    user = AuthUser(username=username, password_hash=hashed, email=email)
    user.save()
    return JSONResponse(status_code=201, content={"message": "user created", "id": str(user.id)})

@app.post("/login")
async def login(payload: dict = Body(...), request: Request = None):
    """
    Login: checks username/password against AuthUser in MongoDB
    """
    username = payload.get("username") or payload.get("email")
    password = payload.get("password")

    if not username or not password:
        raise HTTPException(status_code=400, detail="username and password required")

    user = AuthUser.objects(username=username).first()
    if not user or not pwd_context.verify(password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    response = JSONResponse(
        content={"message": "Login successful", "access_token": "dummy_token_for_now"}
    )
    response.set_cookie(
        key="session_id", value="dummy_session_token", httponly=True, max_age=1800
    )
    return response