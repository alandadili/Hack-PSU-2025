from mongoengine import connect, Document, EmbeddedDocument
from mongoengine import StringField, IntField, BooleanField, DateTimeField, ListField, EmbeddedDocumentField
from datetime import datetime
import os
from dotenv import load_dotenv 

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")   

connect(
    db="hackathon2025",
    host=f"mongodb+srv://jeremiahallu13_db_user:{MONGO_URI}@fittrack-hackathonfall2.wmfwvml.mongodb.net/hackathon2025?retryWrites=true&w=majority"
)

# Authentication model
class AuthUsers(Document):
    meta = {'collection': 'AuthUsers'}
    username = StringField(required=True, unique=True)
    password = StringField(required=True)
    email = StringField()

# User profile and stats model
class UserProfile(Document):
    meta = {'collection': 'UserProfiles'}
    username = StringField(required=True, unique=True)
    full_name = StringField(default="User")
    member_since = DateTimeField(default=datetime.utcnow)
    
    # Goals
    weight_goal = IntField(default=165)  # in lbs
    weekly_workout_goal = IntField(default=5)  # days per week
    focus_area = StringField(default="Strength")  # Strength, Cardio, Flexibility, etc.
    
    # Current stats
    current_streak = IntField(default=0)
    workouts_this_week = IntField(default=0)
    total_workouts = IntField(default=0)
    total_calories = IntField(default=0)
    
    # Weekly activity (7 booleans for Mon-Sun)
    week_activity = ListField(BooleanField(), default=[False] * 7)
    
    # Last workout date (to calculate streaks)
    last_workout_date = DateTimeField()

# Exercise embedded in a workout
class Exercise(EmbeddedDocument):
    title = StringField(required=True)
    reps = StringField(required=True)  # e.g., "3x12" or "3x30s"
    time = StringField(required=True)  # e.g., "5 min"
    calories = IntField(required=True)
    completed = BooleanField(default=False)

# Workout plan
class Workout(Document):
    meta = {'collection': 'Workouts'}
    username = StringField(required=True)
    title = StringField(required=True)
    description = StringField(default="Customized for you")
    total_time = StringField(required=True)  # e.g., "23 min"
    total_calories = IntField(required=True)
    exercises = ListField(EmbeddedDocumentField(Exercise))
    date_assigned = DateTimeField(default=datetime.utcnow)
    completed = BooleanField(default=False)
    date_completed = DateTimeField()

# Workout history for tracking progress
class WorkoutHistory(Document):
    meta = {'collection': 'WorkoutHistory'}
    username = StringField(required=True)
    workout_title = StringField(required=True)
    exercises_completed = IntField(default=0)
    total_exercises = IntField(default=0)
    calories_burned = IntField(default=0)
    duration_minutes = IntField(default=0)
    date = DateTimeField(default=datetime.utcnow)
    week_day = IntField()  # 0=Mon, 1=Tue, ..., 6=Sun