from mongoengine import connect, StringField, Document
import os
from dotenv import load_dotenv 

load_dotenv()
MONGO_URI=os.getenv("MONGO_URI")   

connect(
    db="hackathon2025",
    host=f"mongodb+srv://jeremiahallu13_db_user:{MONGO_URI}@fittrack-hackathonfall2.wmfwvml.mongodb.net/"
)


class AuthUsers(Document):
    meta = {'collection': 'AuthUsers'}
    username = StringField(required=True, unique=True)
    password = StringField(required=True)
    email = StringField()

