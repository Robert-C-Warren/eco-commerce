from flask import Flask, jsonify, request
from flask_cors import CORS
from config import get_database
from bson import ObjectId
from nltk.tokenize import word_tokenize
import nltk
nltk.download("punkt")

app = Flask(__name__)
CORS(app)

db = get_database()
products_collection = db["products"]

def summarize_title(title, max_words=5):
    words = word_tokenize(title)
    if len(words) <= max_words:
        return title
    return " ".join(words[:max_words])

@app.route("/")
def home():
    return jsonify({"message": "Welcome to the Eco-Commerce API"}), 200

@app.route("/products", methods=["GET"])
def get_products():
    try:
        products = list(products_collection.find({}, {"_id": 0}))
        return jsonify({"products": products}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/products", methods=["POST"])
def add_product():
    try:
        product = request.json
        if "title" in product:
            product["summary"] = summarize_title(product["title"])
        products_collection.insert_one(product)
        return jsonify({"message": "Product added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/admin/products/<id>", methods=["PATCH"])
def update_product_visibilty(id):
    try:
        visible = request.json.get("visible", False)
        title = request.json.get("title", None)
        update_data = {"visible": visible}

        if title:
            update_data["summary"] = summarize_title(title)

        result = products_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": update_data}
        )
       
        if result.modified_count == 1:
            return jsonify({"message": "Product updated successfully"}), 200
        else: 
            return jsonify({"message": "No product found or no change made"}), 400
        
    except Exception as e:
        print(f"Error updating visibility: {e}")
        return jsonify({"error": str(e)}), 500
    
@app.route("/admin/products/<id>", methods=["DELETE"])
def delete_product_admin(id):
    try:
        result = products_collection.delete_one({"_id": ObjectId(id)})
        if result.deleted_count:
            return jsonify({"message": "Product deleted successfully"}), 200
        else:
            return jsonify({"error": "Product not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/admin/products", methods=["GET"])
def get_all_products():
    try:
        products = list(db.products.find())
        for product in products:
            product["_id"] = str(product["_id"])
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/products/search", methods=["GET"])
def search_products():
    query = request.args.get("q", "")
    try:
        products = list(products_collection.find(
            {"title": {"$regex": query, "$options": "i"}},
            {"_id": 0}
        ))
        return jsonify({"products": products}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/products/filter", methods=["GET"])
def filter_products():
    try:
        min_price = float(request.args.get("min_price", 0))
        max_price = float(request.args.get("max_price", float("inf")))
        
        products = db.products.find()
        filtered_products = []

        for product in products:
            try:
                price = float(product["price"].replace("$", "").replace(",", ""))
                if min_price <= price <= max_price:
                    product["price"] = price
                    product["_id"] = str(product["_id"])
                    filtered_products.append(product)
            except (ValueError, KeyError):
                print(f"Skipping product with invalid price: {product}")

        return jsonify(filtered_products), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/products/<title>", methods=["DELETE"])
def delete_product(title):
    try:
        result = products_collection.delete_one({"title": title})
        if result.deleted_count:
            return jsonify({"message": f"Product '{title}' deleted successfully!"}), 200
        else:
            return jsonify({"error": "Product not found!"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    app.run(debug=True)