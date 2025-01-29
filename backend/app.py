from flask import Flask, jsonify, request
from flask_cors import CORS
from config import get_database
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime, timezone
import os
import base64
from unicodedata import normalize, combining
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from pprint import pprint
from werkzeug.utils import secure_filename

availableIcons = [
    { "id": "b_corp", "label": "B Corp", "src": "../frontend/src/resources/icons/bcorp.png"},
    { "id": "small_business", "label": "Small Business", "src": "../frontend/src/resources/icons/handshake.png"},
    { "id": "vegan", "label": "Vegan", "src": "../frontend/src/resources/icons/vegan.png"},
    { "id": "biodegradable", "label": "Biodegradable", "src": "../frontend/src/resources/icons/leaf.png"},
    { "id": "fair_trade", "label": "Fair-Trade", "src": "../frontend/src/resources/icons/trade.png"},
]

allowed_origins = os.getenv("ALLOWED_ORIGINS").split(",")
app = Flask(__name__)
CORS(app, supports_credentials=True, resources={
    r"/*": {
        "origins": allowed_origins
    }
})

ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
configuration = sib_api_v3_sdk.Configuration()
configuration.api_key['api-key'] = os.getenv("BREVO_API_KEY")

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

db = get_database()
products_collection = db["products"]
companies_collection = db["companies"]
subscribers = db["subscribers"]

def normalize_text(text):
    """Normalize text by removing diacritics and converting to lowercase."""
    if not text:
        return ""
    return ''.join(
        c for c in normalize('NFKD', text)
        if not combining(c)
    ).lower()

@app.before_request
def handle_options_request():
    if request.method == "OPTIONS":
        response = app.make_response("")
        headers = response.headers

        headers["Access-Control-Allow-Origin"] = "https://ecocommerce.earth"
        headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"

        return response

@app.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin")
    allowed_origins = os.getenv("ALLOWED_ORIGINS").split(",")

    if origin in allowed_origins:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, PATCH, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type"
    return response

@app.route("/")
def home():
    return jsonify({"message": "Welcome to the Eco-Commerce API"}), 200

@app.route("/products", methods=["GET"])
def get_products():
    try:
        products = list(products_collection.find({}, {"_id": 0}).sort("createdAt", -1))
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

@app.route("/products/<product_id>", methods=["GET"])
def get_product_by_id(product_id):
    try:
        product_id = product_id.strip()
        product = db.products.find_one({"_id": ObjectId(product_id)})

        if not product:
            return jsonify({"error": "Product not found"}), 404

        product["_id"] = str(product["_id"])  # Convert ObjectId to string
        return jsonify(product), 200

    except Exception as e:
        print(f"Error fetching product: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/admin/login", methods=['POST'])
def admin_login():
    data = request.json
    if data.get("password") == ADMIN_PASSWORD:
        return jsonify({"success": True, "message": "Login Successful"}), 200
    else:
        return jsonify({"success": False, "message": "Invalid"}), 401

@app.route("/admin/products/<id>/categories", methods=["PATCH"])
def update_product_category(id):
    try:
        data = request.json
        categories = data.get("categories")
        if not categories or not isinstance(categories, list):
            return jsonify({"error": "Categories must be a list"}), 400
        
        result = db.products.update_one(
            {"_id": ObjectId(id)}, {"$set": {"category": categories}}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Product not found"}), 404
        
        return jsonify({"message": "Categories updated successfully"}), 200
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
    
@app.route("/admin/products/show_all", methods=["PATCH"])
def show_all_products():
    try:
        result = db.products.update_many({"visible": False}, {"$set": {"visible": True}})
        return jsonify({
            "message": f"{result.modified_count} products are now visible"
        }), 200
    except Exception as e:
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
        products = list(db.products.find().sort("createdAt", -1))
        for product in products:
            product["_id"] = str(product["_id"])
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/products/search", methods=["GET"])
def search_products():
    query = request.args.get("q", "").strip()
    try:
        products = list(products_collection.find(
            {
                "$or": [
                    {"category": {"$regex": query, "$options": "i"}},
                    {"summary": {"$regex": query, "$options": "i"}}
                ]
            }
        ))
        for product in products:
            product["_id"] = str(product["_id"])
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/companies/search", methods=["GET"])
def search_companies():
    query = request.args.get("q", "").strip()
    try:
        if not query:
            return jsonify([]), 200

        # Log the incoming query
        app.logger.info(f"Raw search query: {query}")

        # Normalize the input query
        normalized_query = normalize_text(query)
        app.logger.info(f"Normalized query: {normalized_query}")

        # Fetch all companies from the database
        companies = list(companies_collection.find())
        app.logger.info(f"Total companies fetched: {len(companies)}")

        # Filter companies dynamically based on normalized fields
        def matches(company):
            fields_to_search = [
                company.get("name", ""),
                company.get("specifics", ""),
                company.get("description", "")
            ]
            for field in fields_to_search:
                app.logger.info(f"Checking field: {field}")
                if normalized_query in normalize_text(field):
                    return True
            return False

        filtered_companies = [company for company in companies if matches(company)]

        app.logger.info(f"Filtered companies: {len(filtered_companies)}")

        # Convert ObjectId to string
        for company in filtered_companies:
            company["_id"] = str(company["_id"])

        return jsonify(filtered_companies), 200

    except Exception as e:
        app.logger.error(f"Error in /companies/search: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route("/products/filter", methods=["GET"])
def filter_products():
    try:
        min_price = float(request.args.get("min_price", 0))
        max_price = float(request.args.get("max_price", float("inf")))
        category = request.args.get("category")

        query = {"visible": True}
        if category:
            query["category"] = {"$regex": f"^{category}$", "$options": "i"}

        products = list(db.products.find(query))
        filtered_products = []

        for product in products:
            try:
                price = float(product.get("price", "0").replace("$", "").replace(",", ""))
                if min_price <= price <= max_price:
                    product["price"] = price
                    product["_id"] = str(product["_id"])
                    filtered_products.append(product)
            except (ValueError, KeyError) as e:
                print(f"Skipping product due to error: {e}, Product: {product}")

        print("Final filtered products to return:", filtered_products)  # Debug filtered data
        return jsonify(filtered_products), 200

    except Exception as e:
        print(f"Error in filter_products: {e}")
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

@app.route("/admin/companies/<id>/icons", methods=["PATCH"])
def update_company_icons(id):
    try:
        # Log the incoming data
        print(f"Request data: {request.json}")
        
        # Extract icons from the request body
        icons = request.json.get("icons")
        
        # Validate 'icons' is present and is a list
        if not icons or not isinstance(icons, list):
            return jsonify({"error": "'icons' must be a non-empty list"}), 400

        # Attempt to update the product in the database
        result = db.companies.update_one(
            {"_id": ObjectId(id)},  # Match by product ID
            {"$set": {"icons": icons}}  # Update the icons field
        )

        # Check if the product was updated
        if result.matched_count == 0:
            return jsonify({"error": "Company not found"}), 404
        if result.modified_count == 0:
            return jsonify({"message": "No changes made"}), 200

        return jsonify({"message": "Icons updated successfully"}), 200

    except Exception as e:
        print(f"Error in update_product_icons: {e}")  # Log the error
        return jsonify({"error": str(e)}), 500

@app.route("/admin/companies/<id>/specifics", methods=["PATCH"])
def update_company_specifics(id):
    try:
        specifics = request.json.get("specifics")

        if specifics is None or not isinstance(specifics, str):
            return jsonify({"error": "'specifics' must be a non-empty string"}), 400
        
        result = db.companies.update_one(
            {"_id":  ObjectId(id)},
            {"$set": {"specifics": specifics}}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Company not found"}), 404
        if result.modified_count == 0:
            return jsonify({"message": "No changes made"}), 200
        
        return jsonify({"message": "Specifics updated successfully"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/companies', methods=['GET'])
def get_companies():
    try:
        db = get_database()

        companies = list(db.companies.find({}))

        for company in companies:
            company["_id"] = str(company["_id"])

        return jsonify(companies), 200
    except Exception as e:
        print(f"Error in /companies: {e}")  # Log the error
        return jsonify({"error": str(e)}), 500

@app.route('/companies', methods=['POST'])
def add_company():
    data = request.json
    data["createdAt"] = datetime.now(timezone.utc)
    if isinstance(data.get("qualifications"), str):
        data["qualifications"] = [q.strip() for q in data["qualifications"].split(",")]
    try:
        db.companies.insert_one(data)
        return jsonify({"message": "Company added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/companies/<company_id>', methods=['PUT'])
def update_company(company_id):
    try:
        data = request.json
        
        # Ensure company_id is a valid ObjectId
        object_id = ObjectId(company_id)

        # Remove '_id' from the data if present
        if "_id" in data:
            data.pop("_id")

        # Convert qualifications to an array if it's a string
        if "qualifications" in data and isinstance(data["qualifications"], str):
            data["qualifications"] = [q.strip() for q in data["qualifications"].split(",")]

        # Perform the update
        result = db.companies.update_one({"_id": object_id}, {"$set": data})

        if result.matched_count == 0:
            return jsonify({"error": "Company not found"}), 404

        return jsonify({"message": "Company updated successfully"}), 200
    except InvalidId:
        return jsonify({"error": "Invalid company ID"}), 400
    except Exception as e:
        print("Unexpected Error:", str(e))
        return jsonify({"error": str(e)}), 500
    
@app.route('/companies/<company_id>', methods=['DELETE'])
def delete_company(company_id):
    try:
        db.companies.delete_one({"_id": ObjectId(company_id)})
        return jsonify({"message": "Company deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/companies/<company_id>/category', methods=['PUT'])
def update_company_category(company_id):
    try:
        data = request.json
        object_id = ObjectId(company_id)

        category = data.get("category")
        if not category:
            return jsonify({"error": "Category is required"}), 400
        
        result = db.companies.update_one(
            {"_id": object_id},
            {"$set": {"category": category}}
        )

        if result.matched_count == 0:
            return jsonify({"error": "Company not found"}), 404
        
        return jsonify({"message": "Category updated successfully"}), 200
    except InvalidId:
        return jsonify({"error": "Invalid company ID"}), 400


    data = request.json
    name = data.get("name")
    email = data.get("email")

    if not email or not name:
        return jsonify({"error": "Name and email are required"}), 400
    
    if subscribers.find_one({"email": email}):
        return jsonify({"error": "Email is already subscribed"}), 400
    
    subscribers.insert_one({"name": name, "email": email})
    return jsonify({"message": "Subscription successful!"}), 200

@app.route("/contact", methods=["POST"])
def send_contact_email():
    try: 
        # Ensure the request contains form data
        if "name" not in request.form or "email" not in request.form or "message" not in request.form:
            return jsonify({"error": "Missing form data"}), 400

        name = request.form.get("name")
        email = request.form.get("email")
        message = request.form.get("message")
        file = request.files.get("file")  # Get the attached file

        if not name or not email or not message:
            return jsonify({"error": "All fields are required."}), 400
        
        attachment_data = None
        attachment_filename = None

        if file and file.filename:  # ✅ Check if file exists and has a name
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(file_path)

            # ✅ Ensure file is not empty before encoding
            if os.path.getsize(file_path) > 0:
                with open(file_path, "rb") as f:
                    attachment_data = base64.b64encode(f.read()).decode("utf-8")
                attachment_filename = filename
            else:
                print("Warning: File is empty, skipping attachment.")

        # Initialize Sendinblue API instance
        configuration = sib_api_v3_sdk.Configuration()
        api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

        subject = "New Contact Form Submission"
        html_content = f"""
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Message:</strong></p>
        <p>{message}</p>
        """

        sender = {"email": "contact@ecocommerce.earth", "name": "EcoCommerce"}
        recipients = [{"email": "contact@ecocommerce.earth"}]

        email_data = sib_api_v3_sdk.SendSmtpEmail(
            to=recipients,
            sender=sender,
            subject=subject,
            html_content=html_content
        )

        # ✅ Attach file to email if present
        if attachment_data:
            email_data.attachment = [{
                "content": attachment_data,
                "name": attachment_filename
            }]

        api_response = api_instance.send_transac_email(email_data)
        pprint(api_response)

        return jsonify({"message": "Email sent successfully!"}), 200
    
    except ApiException as e:
        print("Error sending email:", str(e))
        return jsonify({"error": "Failed to send email."}), 500

    except Exception as e:
        print("Unexpected error:", str(e))
        return jsonify({"error": "An unexpected error occurred."}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
    db = get_database()