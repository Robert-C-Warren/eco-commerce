from pymongo import MongoClient

def get_database():
    connection_string = "mongodb://localhost:27017/"
    client = MongoClient(connection_string)
    db = client["eco_commerce"]
    return db

def insert_product(data):
    db = get_database()
    collection = db["products"]
    if collection.find_one({"url": data["url"]}):
        print(f"Product already exists in the database: {data['title']}")
    else:
        collection.insert_one(data)
        print(f"Inserted product: {data['title']}")