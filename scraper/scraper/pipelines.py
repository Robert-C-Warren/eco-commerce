import pymongo
import os
from dotenv import load_dotenv

class MongoPipeline:
    def __init__(self):
        backend_env_path = os.path.join(os.path.dirname(__file__), "../../backend/.env")
        load_dotenv(backend_env_path)

        mongo_uri = os.getenv("MONGO_URI")
        self.client = pymongo.MongoClient(mongo_uri)
        self.db = self.client["eco_products"]

    def process_items(self, item, spider):
        self.db["products"].insert_one(dict(item))
        return item