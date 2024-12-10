from config import get_database
from nltk.tokenize import word_tokenize
import nltk

nltk.download("punkt")

db = get_database()
products_collection = db["products"]

def summarize_title(title, max_words=5):
  words = word_tokenize(title)
  if len(words) <= max_words:
    return title
  return " ".join(words[:max_words])

def update_existing_summaries():
  products = products_collection.find()
  for product in products:
    if "title" in product:
      summary = summarize_title(product["title"])
      products_collection.update_one(
        {"_id": product["_id"]}, {"$set": {"summary": summary}}
      )
      print(f"Updated product: {product['_id']} with summary: {summary}")

  if __name__ == "__main__":
    update_existing_summaries()