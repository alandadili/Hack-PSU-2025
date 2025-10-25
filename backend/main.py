from fastapi import FastAPI, HTTPException, Depends, Request, Response, Cookie
from fastapi.responses import JSONResponse
import requests
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta
from typing import Annotated, Optional

from sqlalchemy import select
import models
from models import *
import database
from database import engine, get_db
from sqlalchemy.orm import Session
from schemas import *
from json import dumps
from helpers import *

app = FastAPI()
origins = [
    "http://localhost:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # Allow cookies and credentials to be sent
    allow_methods=["*"],     # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],     # Allow all headers in the request
)
    
database.Base.metadata.create_all(bind=engine)

db_dependency = Annotated[Session, Depends(get_db)]

@app.get("/test")
async def test(subpath: str, request: Request):
    pass