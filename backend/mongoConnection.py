from mongoengine import connect
from mongoengine import Document, StringField, IntField

connect(db="hackathon_db", host="localhost", port=27017)

class User(Document):
    name = StringField(required=True)
    age = IntField()
    role = StringField()


