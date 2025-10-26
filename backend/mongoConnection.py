from mongoengine import connect
from mongoengine import Document, StringField

connect(db="hackathon_db", host="localhost", port=27017)

class AuthUser(Document):
    username = StringField(required=True, unique=True)
    password = StringField(required=True)
    email = StringField()


