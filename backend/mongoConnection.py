from mongoengine import connect
from mongoengine import StringField, Document


connect(
    db="hackathon2025",
    host="mongodb+srv://jeremiahallu13_db_user:<db_password>@fittrack-hackathonfall2.wmfwvml.mongodb.net/"
)


class AuthUsers(Document):
    meta = {'collection': 'AuthUsers'}
    username = StringField(required=True, unique=True)
    password = StringField(required=True)
    email = StringField()


