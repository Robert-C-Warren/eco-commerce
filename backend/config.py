from pymongo import MongoClient
import os
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(env_path, override=True)

port = os.getenv("PORT", 5000)
mongo_uri = os.getenv("MONGO_URI")
allowed_origins = [
    o.strip() for o in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:3000"
    ).split(",")
]

def get_database():
    client = MongoClient(
        mongo_uri,
        tls=True,
        tlsAllowInvalidCertificates=False
    )
    db = client["eco_commerce"]
    return db