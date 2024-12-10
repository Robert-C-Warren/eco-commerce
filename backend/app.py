from flask import Flask, jsonify, request
from flask_cors import CORS
from config import get_database
from bson import ObjectId

app = Flask(__name__)
CORS(app)

db = get_database()
products_collection = db["products"]

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
    
@app.route("/admin/products/<id>", methods=["PATCH"])
def update_product_visibilty(id):
    try:
        visible = request.json.get("visible", False)
        result = db.products.update_one({"_id": ObjectId(id)}, {"$set": {"visible": visible}})
       
        if result.modified_count == 1:
            return jsonify({"message": "Product updated successfully"}), 200
        return jsonify({"message": "No changes made"}), 400
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
    
@app.route("/products", methods=["POST"])
def add_product():
    try:
        product = request.json
        products_collection.insert_one(product)
        return jsonify({"message": "Product added successfully!"}), 201
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