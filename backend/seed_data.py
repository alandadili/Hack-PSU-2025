"""
Seed script to populate MongoDB with sample data
Run this once: python seed_data.py
"""

from mongoConnection import AuthUsers, UserProfile, Workout, Exercise, WorkoutHistory
from datetime import datetime, timedelta
import random

def clear_all_data():
    """Clear all existing data (optional - use with caution!)"""
    print("Clearing existing data...")
    AuthUsers.objects().delete()
    UserProfile.objects().delete()
    Workout.objects().delete()
    WorkoutHistory.objects().delete()
    print("All data cleared!")

def create_users():
    """Create sample users"""
    print("\n=== Creating Users ===")
    
    users = [
        {"username": "test", "password": "test", "email": "test@gmail.com", "full_name": "Alex Johnson"},
        {"username": "john", "password": "password123", "email": "john@example.com", "full_name": "John Smith"},
        {"username": "sarah", "password": "password123", "email": "sarah@example.com", "full_name": "Sarah Davis"},
        {"username": "mike", "password": "password123", "email": "mike@example.com", "full_name": "Mike Wilson"},
    ]
    
    for user_data in users:
        # Check if user already exists
        existing = AuthUsers.objects(username=user_data["username"]).first()
        if existing:
            print(f"  ✓ User '{user_data['username']}' already exists, skipping...")
            continue
        
        # Create auth user
        user = AuthUsers(
            username=user_data["username"],
            password=user_data["password"],
            email=user_data["email"]
        )
        user.save()
        print(f"  ✓ Created user: {user_data['username']}")

def create_profiles():
    """Create user profiles with stats"""
    print("\n=== Creating User Profiles ===")
    
    profiles = [
        {
            "username": "test",
            "full_name": "Alex Johnson",
            "weight_goal": 165,
            "weekly_workout_goal": 5,
            "focus_area": "Strength",
            "current_streak": 7,
            "workouts_this_week": 4,
            "total_workouts": 50,
            "total_calories": 1250,
            "week_activity": [True, True, True, True, False, False, False]
        },
        {
            "username": "john",
            "full_name": "John Smith",
            "weight_goal": 180,
            "weekly_workout_goal": 4,
            "focus_area": "Cardio",
            "current_streak": 3,
            "workouts_this_week": 3,
            "total_workouts": 28,
            "total_calories": 850,
            "week_activity": [True, False, True, True, False, False, False]
        },
        {
            "username": "sarah",
            "full_name": "Sarah Davis",
            "weight_goal": 140,
            "weekly_workout_goal": 6,
            "focus_area": "Flexibility",
            "current_streak": 12,
            "workouts_this_week": 5,
            "total_workouts": 95,
            "total_calories": 2100,
            "week_activity": [True, True, True, True, True, False, False]
        },
        {
            "username": "mike",
            "full_name": "Mike Wilson",
            "weight_goal": 200,
            "weekly_workout_goal": 5,
            "focus_area": "Strength",
            "current_streak": 1,
            "workouts_this_week": 2,
            "total_workouts": 15,
            "total_calories": 420,
            "week_activity": [False, True, False, True, False, False, False]
        },
    ]
    
    for profile_data in profiles:
        existing = UserProfile.objects(username=profile_data["username"]).first()
        if existing:
            print(f"  ✓ Profile for '{profile_data['username']}' already exists, skipping...")
            continue
        
        profile = UserProfile(
            username=profile_data["username"],
            full_name=profile_data["full_name"],
            member_since=datetime.utcnow() - timedelta(days=random.randint(30, 365)),
            weight_goal=profile_data["weight_goal"],
            weekly_workout_goal=profile_data["weekly_workout_goal"],
            focus_area=profile_data["focus_area"],
            current_streak=profile_data["current_streak"],
            workouts_this_week=profile_data["workouts_this_week"],
            total_workouts=profile_data["total_workouts"],
            total_calories=profile_data["total_calories"],
            week_activity=profile_data["week_activity"],
            last_workout_date=datetime.utcnow() - timedelta(days=1)
        )
        profile.save()
        print(f"  ✓ Created profile for: {profile_data['username']}")

def create_workouts():
    """Create workout plans for users"""
    print("\n=== Creating Workouts ===")
    
    workout_templates = [
        {
            "title": "Full Body Strength",
            "description": "Customized for you",
            "total_time": "23 min",
            "total_calories": 240,
            "exercises": [
                {"title": "Push-ups", "reps": "3x12", "time": "5 min", "calories": 45},
                {"title": "Squats", "reps": "3x15", "time": "6 min", "calories": 60},
                {"title": "Plank", "reps": "3x30s", "time": "3 min", "calories": 30},
                {"title": "Lunges", "reps": "3x10", "time": "5 min", "calories": 50},
                {"title": "Mountain Climbers", "reps": "3x20", "time": "4 min", "calories": 55},
            ]
        },
        {
            "title": "Cardio Blast",
            "description": "Get your heart pumping",
            "total_time": "30 min",
            "total_calories": 320,
            "exercises": [
                {"title": "Jumping Jacks", "reps": "3x30", "time": "5 min", "calories": 50},
                {"title": "High Knees", "reps": "3x30", "time": "5 min", "calories": 55},
                {"title": "Burpees", "reps": "3x10", "time": "8 min", "calories": 90},
                {"title": "Jump Rope", "reps": "3x1min", "time": "7 min", "calories": 75},
                {"title": "Mountain Climbers", "reps": "3x30", "time": "5 min", "calories": 50},
            ]
        },
        {
            "title": "Upper Body Power",
            "description": "Build upper body strength",
            "total_time": "25 min",
            "total_calories": 280,
            "exercises": [
                {"title": "Push-ups", "reps": "4x15", "time": "7 min", "calories": 70},
                {"title": "Dips", "reps": "3x12", "time": "5 min", "calories": 55},
                {"title": "Pike Push-ups", "reps": "3x10", "time": "5 min", "calories": 50},
                {"title": "Diamond Push-ups", "reps": "3x10", "time": "5 min", "calories": 55},
                {"title": "Arm Circles", "reps": "3x30s", "time": "3 min", "calories": 50},
            ]
        },
        {
            "title": "Core Crusher",
            "description": "Strengthen your core",
            "total_time": "20 min",
            "total_calories": 200,
            "exercises": [
                {"title": "Plank", "reps": "3x45s", "time": "4 min", "calories": 40},
                {"title": "Russian Twists", "reps": "3x20", "time": "5 min", "calories": 50},
                {"title": "Bicycle Crunches", "reps": "3x20", "time": "4 min", "calories": 40},
                {"title": "Leg Raises", "reps": "3x15", "time": "4 min", "calories": 40},
                {"title": "Mountain Climbers", "reps": "3x20", "time": "3 min", "calories": 30},
            ]
        },
    ]
    
    users = ["test", "john", "sarah", "mike"]
    
    for username in users:
        # Create 1-2 workouts per user
        num_workouts = random.randint(1, 2)
        templates_to_use = random.sample(workout_templates, num_workouts)
        
        for template in templates_to_use:
            # Check if similar workout exists
            existing = Workout.objects(username=username, title=template["title"], completed=False).first()
            if existing:
                continue
            
            exercises = [
                Exercise(
                    title=ex["title"],
                    reps=ex["reps"],
                    time=ex["time"],
                    calories=ex["calories"],
                    completed=False
                )
                for ex in template["exercises"]
            ]
            
            workout = Workout(
                username=username,
                title=template["title"],
                description=template["description"],
                total_time=template["total_time"],
                total_calories=template["total_calories"],
                exercises=exercises,
                completed=False,
                date_assigned=datetime.utcnow()
            )
            workout.save()
            print(f"  ✓ Created workout '{template['title']}' for {username}")

def create_workout_history():
    """Create workout history for users"""
    print("\n=== Creating Workout History ===")
    
    users_workouts = [
        ("test", 4),
        ("john", 3),
        ("sarah", 5),
        ("mike", 2),
    ]
    
    workout_titles = [
        "Full Body Strength",
        "Cardio Blast",
        "Upper Body Power",
        "Core Crusher",
        "Morning Yoga",
    ]
    
    for username, num_workouts in users_workouts:
        for i in range(num_workouts):
            # Create history for this week
            day_offset = i
            workout_date = datetime.utcnow() - timedelta(days=day_offset)
            
            history = WorkoutHistory(
                username=username,
                workout_title=random.choice(workout_titles),
                exercises_completed=random.randint(3, 5),
                total_exercises=5,
                calories_burned=random.randint(200, 320),
                duration_minutes=random.randint(20, 35),
                date=workout_date,
                week_day=workout_date.weekday()
            )
            history.save()
        
        print(f"  ✓ Created {num_workouts} workout history entries for {username}")

def main():
    """Run all seed functions"""
    print("=" * 50)
    print("MONGODB DATA SEEDING SCRIPT")
    print("=" * 50)
    
    # Uncomment the next line if you want to clear all data first (DANGEROUS!)
    # clear_all_data()
    
    create_users()
    create_profiles()
    create_workouts()
    create_workout_history()
    
    print("\n" + "=" * 50)
    print("✅ SEEDING COMPLETE!")
    print("=" * 50)
    print("\nYou can now login with:")
    print("  - Username: test, Password: test")
    print("  - Username: john, Password: password123")
    print("  - Username: sarah, Password: password123")
    print("  - Username: mike, Password: password123")
    print("\n")

if __name__ == "__main__":
    main()