from pymongo import MongoClient

def get_database():
    client = MongoClient("mongodb://localhost27017/")
    db = client["eco_commerce"]
    return db