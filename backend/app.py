from flask import Flask, jsonify, request
from flask_cors import CORS
from config import get_database
from bson import ObjectId

availableIcons = [
    { "id": "b_corp", "label": "B Corp", "src": "../frontend/src/resources/icons/bcorp.png"},
    { "id": "small_business", "label": "Small Business", "src": "../frontend/src/resources/icons/handshake.png"},
    { "id": "vegan", "label": "Vegan", "src": "../frontend/src/resources/icons/vegan.png"},
    { "id": "biodegradable", "label": "Biodegradable", "src": "../frontend/src/resources/icons/leaf.png"},
    { "id": "fair_trade", "label": "Fair-Trade", "src": "../frontend/src/resources/icons/trade.png"},
]
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
    
@app.route("/products", methods=["POST"])
def add_product():
    try:
        product = request.json
        products_collection.insert_one(product)
        return jsonify({"message": "Product added successfully!"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/admin/products/<id>", methods=["PATCH"])
def update_product_visibilty(id):
    try:
        visible = request.json.get("visible", False)
        update_data = {"visible": visible}

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
    
@app.route("/admin/products/<id>/edit", methods=["PATCH"])
def edit_product_title(id):
    try:
        new_title = request.json.get("summary", None)
        if not new_title:
            return jsonify({"error": "Title is required"}), 400
        
        result = products_collection.update_one(
            {"_id": ObjectId(id)}, {"$set": {"summary": new_title}}
        )

        if result.modified_count == 1:
            return jsonify({"message": "Title updated successfully"}), 200
        else:
            return jsonify({"error": "No product found or no changes made"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/admin/products/visibility", methods=["PATCH"])
def update_visibility_bulk():
    try:
        product_ids = request.json.get("product_ids", [])
        visible = request.json.get("visible", False)
        if not product_ids:
            return jsonify({"error": "No product IDs provided"}), 400
        
        result = db.products.update_many(
            {"_id": {"$in": [ObjectId(pid) for pid in product_ids]}},
            {"$set": {"visible": visible}}
        )

        if result.modified_count > 0:
            return jsonify({"message": f"Updated {result.modified_count}"}), 200
        else:
            return jsonify({"message": "No products updated"}), 400
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
    
@app.route("/admin/products/<id>/icons", methods=["PATCH"])
def update_product_icons(id):
    try:
        # Log the incoming data
        print(f"Request data: {request.json}")
        
        # Extract icons from the request body
        icons = request.json.get("icons")
        
        # Validate 'icons' is present and is a list
        if not icons or not isinstance(icons, list):
            return jsonify({"error": "'icons' must be a non-empty list"}), 400

        # Attempt to update the product in the database
        result = db.products.update_one(
            {"_id": ObjectId(id)},  # Match by product ID
            {"$set": {"icons": icons}}  # Update the icons field
        )

        # Check if the product was updated
        if result.matched_count == 0:
            return jsonify({"error": "Product not found"}), 404
        if result.modified_count == 0:
            return jsonify({"message": "No changes made"}), 200

        return jsonify({"message": "Icons updated successfully"}), 200

    except Exception as e:
        print(f"Error in update_product_icons: {e}")  # Log the error
        return jsonify({"error": str(e)}), 500

@app.route('/companies', methods=['GET'])
def get_companies():
    try:
        companies = list(db.companies.find({}, {"_id": 0}))
        return jsonify(companies), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/admin/companies', methods=['POST'])
def add_company():
    data = request.json
    try:
        db.companies.insert_one(data)
        return jsonify({"message": "Company added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)