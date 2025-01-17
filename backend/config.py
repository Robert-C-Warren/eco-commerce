from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

port = os.getenv("PORT", 5000)
mongo_uri = os.getenv("MONGO_URI")
allowed_origins = os.getenv("ALLOWED_ORIGINS").split(",")

def get_database():
    client = MongoClient(mongo_uri)
    db = client["eco_commerce"]
    return db