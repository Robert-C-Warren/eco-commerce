from pymongo import MongoClient
def removeDuplicates(db):
    # Connect to MongoDB
    client = MongoClient("mongodb://localhost:27017/")
    db = client["eco_commerce"]
    collection = db["products"]

    # Correct aggregation pipeline
    pipeline = [
        {"$group": {
            "_id": {"title": "$title"},  # Group by "url" field
            "duplicates": {"$addToSet": "$_id"},  # Collect duplicate IDs
            "count": {"$sum": 1}  # Count number of documents
        }},
        {"$match": {"count": {"$gt": 1}}}  # Filter to only duplicates
    ]

    # Iterate through the results and delete duplicates
    for doc in collection.aggregate(pipeline):
        ids_to_delete = doc["duplicates"][1:]  # Exclude the first ID (keep it)
        if ids_to_delete:  # Check if there are duplicates
            collection.delete_many({"_id": {"$in": ids_to_delete}})
            print(f"Deleted duplicates for URL: {doc['_id']['title']}")
