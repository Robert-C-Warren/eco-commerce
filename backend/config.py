from pymongo import MongoClient
import os

def get_database():
    mongo_uri = "mongodb+srv://robertcwarren1:Sn3akyHunt%26r1995@eco-commerce.ktcjv.mongodb.net/eco-commerce"
    client = MongoClient(mongo_uri)
    db = client["eco-commerce"]
    return db