from fastapi import FastAPI, HTTPException, Request, Body, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uuid
import time
from datetime import datetime
from fastapi.staticfiles import StaticFiles
from mongoConnection import AuthUsers, UserProfile, Workout, Exercise, WorkoutHistory
from chatbot import handle_user_message

app = FastAPI()

app.mount("/", StaticFiles(directory="../frontend/build", html=True), name="frontend")

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
            
            # Create user profile if it doesn't exist
            ensure_user_profile(username)
            
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

@app.get("/profile")
async def get_profile(username: str = Depends(get_current_user)):
    """Get user profile data"""
    try:
        profile = UserProfile.objects(username=username).first()
        if not profile:
            profile = create_default_profile(username)
        
        return {
            "username": profile.username,
            "full_name": profile.full_name,
            "member_since": profile.member_since.strftime("%b %Y"),
            "goals": {
                "weight_goal": profile.weight_goal,
                "weekly_workout_goal": profile.weekly_workout_goal,
                "focus_area": profile.focus_area
            },
            "stats": {
                "current_streak": profile.current_streak,
                "workouts_this_week": profile.workouts_this_week,
                "total_workouts": profile.total_workouts,
                "total_calories": profile.total_calories
            },
            "week_activity": profile.week_activity
        }
    except Exception as e:
        print(f"[ERROR] Get profile error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/workouts/today")
async def get_todays_workout(username: str = Depends(get_current_user)):
    """Get today's assigned workout"""
    try:
        workout = Workout.objects(username=username, completed=False).first()
        if not workout:
            # Create a default workout if none exists
            workout = create_default_workout(username)
        
        exercises_data = []
        for ex in workout.exercises:
            exercises_data.append({
                "title": ex.title,
                "reps": ex.reps,
                "time": ex.time,
                "calories": ex.calories,
                "completed": ex.completed
            })
        
        return {
            "id": str(workout.id),
            "title": workout.title,
            "description": workout.description,
            "total_time": workout.total_time,
            "total_calories": workout.total_calories,
            "exercises": exercises_data
        }
    except Exception as e:
        print(f"[ERROR] Get workout error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/workouts/{workout_id}/complete")
async def complete_workout(workout_id: str, payload: dict = Body(...), username: str = Depends(get_current_user)):
    """Mark a workout as complete and update user stats"""
    try:
        workout = Workout.objects(id=workout_id, username=username).first()
        if not workout:
            raise HTTPException(status_code=404, detail="Workout not found")
        
        # Mark workout as complete
        workout.completed = True
        workout.date_completed = datetime.utcnow()
        
        # Update exercise completion from payload if provided
        completed_exercises = payload.get("completed_exercises", [])
        for i, ex in enumerate(workout.exercises):
            if i < len(completed_exercises):
                ex.completed = completed_exercises[i]
        
        workout.save()
        
        # Update user profile
        profile = UserProfile.objects(username=username).first()
        if profile:
            profile.workouts_this_week += 1
            profile.total_workouts += 1
            profile.total_calories += workout.total_calories
            profile.last_workout_date = datetime.utcnow()
            
            # Update week activity (0=Mon, 6=Sun)
            day_of_week = datetime.utcnow().weekday()
            profile.week_activity[day_of_week] = True
            
            # Calculate streak
            update_streak(profile)
            
            profile.save()
        
        # Add to workout history
        WorkoutHistory(
            username=username,
            workout_title=workout.title,
            exercises_completed=sum(1 for ex in workout.exercises if ex.completed),
            total_exercises=len(workout.exercises),
            calories_burned=workout.total_calories,
            duration_minutes=int(workout.total_time.split()[0]),
            week_day=datetime.utcnow().weekday()
        ).save()
        
        return {"message": "Workout completed successfully"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] Complete workout error: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

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
            return False
        
        # Plain text password comparison
        print(f"[DEBUG] Comparing passwords")
        is_valid = (password == user.password)
        print(f"[DEBUG] Authentication result: {is_valid}")
        return is_valid
        
    except Exception as e:
        print(f"[ERROR] Authentication error: {str(e)}")
        import traceback
        traceback.print_exc()
        return False

def ensure_user_profile(username: str):
    """Create user profile if it doesn't exist"""
    profile = UserProfile.objects(username=username).first()
    if not profile:
        create_default_profile(username)

def create_default_profile(username: str) -> UserProfile:
    """Create a default user profile"""
    profile = UserProfile(
        username=username,
        full_name=username.capitalize(),
        current_streak=7,
        workouts_this_week=4,
        total_workouts=50,
        total_calories=1250,
        week_activity=[True, True, True, True, False, False, False]
    )
    profile.save()
    print(f"[INFO] Created default profile for {username}")
    return profile

def create_default_workout(username: str) -> Workout:
    """Create a default workout for a user"""
    exercises = [
        Exercise(title="Push-ups", reps="3x12", time="5 min", calories=45),
        Exercise(title="Squats", reps="3x15", time="6 min", calories=60),
        Exercise(title="Plank", reps="3x30s", time="3 min", calories=30),
        Exercise(title="Lunges", reps="3x10", time="5 min", calories=50),
        Exercise(title="Mountain Climbers", reps="3x20", time="4 min", calories=55),
    ]
    
    workout = Workout(
        username=username,
        title="Full Body Strength",
        description="Customized for you",
        total_time="23 min",
        total_calories=240,
        exercises=exercises
    )
    workout.save()
    print(f"[INFO] Created default workout for {username}")
    return workout

def update_streak(profile: UserProfile):
    """Calculate and update user's workout streak"""
    if not profile.last_workout_date:
        profile.current_streak = 1
        return
    
    days_since_last = (datetime.utcnow() - profile.last_workout_date).days
    if days_since_last == 0:
        # Same day, don't change streak
        pass
    elif days_since_last == 1:
        # Consecutive day, increment streak
        profile.current_streak += 1
    else:
        # Streak broken, reset to 1
        profile.current_streak = 1