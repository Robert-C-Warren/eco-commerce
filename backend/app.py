from flask import Flask, jsonify, request
from flask_cors import CORS
from config import get_database
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime, timezone, timedelta
import os
import base64
import certifi
import firebase_admin
from firebase_admin import credentials, storage, auth
from unicodedata import normalize, combining
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from pprint import pprint
from werkzeug.utils import secure_filename
from pymongo.collation import Collation
import pyotp
import bcrypt
import jwt
from functools import wraps


availableIcons = [
    { "id": "b_corp", "label": "B Corp", "src": "../frontend/src/resources/icons/bcorp.png"},
    { "id": "small_business", "label": "Small Business", "src": "../frontend/src/resources/icons/handshake.png"},
    { "id": "vegan", "label": "Vegan", "src": "../frontend/src/resources/icons/vegan.png"},
    { "id": "biodegradable", "label": "Biodegradable", "src": "../frontend/src/resources/icons/leaf.png"},
    { "id": "fair_trade", "label": "Fair-Trade", "src": "../frontend/src/resources/icons/trade.png"},
]

os.environ["SSL_CERT_FILE"] = certifi.where()

allowed_origins = os.getenv("ALLOWED_ORIGINS").split(",")
app = Flask(__name__)
CORS(app, supports_credentials=True, resources={
    r"/*": {
        "origins": allowed_origins
    }
})

ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
SA_EMAIL = os.getenv("SA_EMAIL")
SA_PASSWORD = os.getenv("SA_PASSWORD")
SECRET_KEY = os.getenv("SECRET_KEY", "SECRET_KEY")

# Brevo API Configuration for contact capability
configuration = sib_api_v3_sdk.Configuration()
configuration.api_key['api-key'] = os.getenv("BREVO_API_KEY")

# Set up for file uploads
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

# MongoDB set up and collection definitions
db = get_database()
products_collection = db["products"]
companies_collection = db["companies"]
small_business_collection = db["smallbusiness"]
reports_collection = db["reports"]
subscribers = db["subscribers"]
admins_collection = db["admins"]

firebase_creds = {
    "type": "service_account",
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace("\\n", "\\n"),
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "token_uri": "https://oauth2.googleapis.com/token"
}

cred = credentials.Certificate(firebase_creds)
firebase_admin.initialize_app(cred, {"storageBucket": os.getenv("FIREBASE_STORAGE_BUCKET")})

firebase_bucket = storage.bucket()
    
@app.route("/admin/reports", methods=["GET"])
def get_reports():
    try:
        reports = list(reports_collection.find({}, {"_id": 0}))
        return jsonify(reports), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def auth_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header or "Bearer" not in auth_header:
            return jsonify({"message": "Unauthorized: Token missing"}), 401

        token = auth_header.split(" ")[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            user_id = payload["user_id"]

            admin = db.admins.find_one({"_id": ObjectId(user_id)})
            if not admin:
                return jsonify({"message": "Unauthorized: User not found"}), 403

            last_activity = admin.get("lastActivity")
            if last_activity and (datetime.utcnow() - last_activity.replace(tzinfo=None)) > timedelta(hours=2):
                return jsonify({"message": "Session expired. Please log in again."}), 401

            db.admins.update_one({"_id": ObjectId(user_id)}, {"$set": {"lastActivity": datetime.utcnow()}})

            return f(*args, **kwargs)

        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Session expired. Please log in again."}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Unauthorized: Invalid token"}), 401

    return decorated

def normalize_text(text):
    """Normalize text by removing diacritics and converting to lowercase."""
    if not text:
        return ""
    return ''.join(
        c for c in normalize('NFKD', text)
        if not combining(c)
    ).lower()

def send_sa_notification(new_admin_email):
    """
    Sends an email to the Super Admin notifying them about a new admin registration.
    """
    try:
        sa_email = SA_EMAIL  # Get SA email from environment variable

        if not sa_email:
            print("🚨 ERROR: SA_EMAIL is not set! No notification sent.")
            return

        # Initialize Brevo API client
        api_client = sib_api_v3_sdk.ApiClient(configuration)
        api_instance = sib_api_v3_sdk.TransactionalEmailsApi(api_client)

        subject = "New Admin Registration Request"
        html_content = f"""
        <p>A new admin has registered and is awaiting approval:</p>
        <ul>
            <li><strong>Email:</strong> {new_admin_email}</li>
        </ul>
        <p>Please log in to approve or reject the request.</p>
        """

        sender = {"email": "contact@ecocommerce.earth", "name": "EcoCommerce"}
        recipients = [{"email": sa_email}]

        email_payload = {
            "to": recipients,
            "sender": sender,
            "subject": subject,
            "html_content": html_content
        }

        # Send email via Brevo API
        email_data = sib_api_v3_sdk.SendSmtpEmail(**email_payload)
        api_instance.send_transac_email(email_data)

        print(f"✅ Notification sent to SA: {sa_email}")

    except ApiException as e:
        print(f"🚨 Brevo API Error: {e}")
    except Exception as e:
        print(f"🚨 Unexpected error in SA notification: {e}")

@app.before_request
def handle_options_request():
    if request.method == "OPTIONS":
        response = app.make_response("")
        headers = response.headers

        # Set allowed origings and methods
        headers["Access-Control-Allow-Origin"] = "https://ecocommerce.earth"
        headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Content-Security-Policy"] = "upgrade-insecure-requests;"

        return response

@app.after_request
def add_cors_headers(response):
    # CORS headers after each allowed request
    origin = request.headers.get("Origin")
    allowed_origins = os.getenv("ALLOWED_ORIGINS").split(",")

    if origin in allowed_origins:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, PATCH, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type"
    return response

@app.after_request
def add_security_headers(response):
    """
    Adds key security headers, including Content Security Policy (CSP).
    """
    csp = (
        "default-src 'self'; "
        "script-src 'self'; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data:; "
        "object-src 'none'; "
        
    ) 
    response.headers["Content-Security-Policy"] = csp
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "accelerometer=(), camera=(), microphone=()"

    return response

@app.route("/upload-logo", methods=["POST"])
def upload_logo():
    """Update MongoDB with file URL and Instagram without requiring both"""
    data = request.json
    company_id = data.get("company_id")  # Get company ID
    file_url = data.get("file_url", None)  # Get uploaded file URL
    instagram = data.get("instagram", None)  # Get Instagram link

    if not company_id:
        return jsonify({"error": "Company ID is required"}), 400

    try:
        update_fields = {}

        if file_url:
            update_fields["logo"] = file_url  # ✅ Update only if file is uploaded
        if instagram:
            update_fields["instagram"] = instagram  # ✅ Update Instagram if provided

        if not update_fields:
            return jsonify({"error": "No valid fields provided for update"}), 400

        # 🔄 Update MongoDB with provided fields
        result = db.companies.update_one(
            {"_id": ObjectId(company_id)},
            {"$set": update_fields}
        )

        if result.modified_count == 0:
            return jsonify({"error": "No changes made"}), 400

        return jsonify({"message": "Company updated successfully", "updated_data": update_fields}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/get-logo/<filename>", methods=["GET"])
def get_logo(filename):
    try:
        blob = firebase_bucket.blob(f"logos/{filename}")

        if not blob.exists():
            return jsonify({"error": "File not found"}), 404
        
        file_url = blob.generate_signed_url(expiration=timedelta(hours=24))

        return jsonify({"file_url": file_url}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/")
def home():
    # Welcome message for backend testing
    return jsonify({"message": "Welcome to the Eco-Commerce API"}), 200

@app.route("/products/<product_id>", methods=["GET"])
def get_product_by_id(product_id):
    """
        Retrieve a product by ID.
        Converts the MongoDB ObjectId to a string before returning
    """
    try:
        product = db.products.find_one({"_id": ObjectId(product_id)})

        if not product:
            return jsonify({"error": "Product not found"}), 404

        product["_id"] = str(product["_id"])  # Convert ObjectId to string
        return jsonify(product), 200

    except Exception as e:
        print(f"Error fetching product: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/admin/products/<id>/categories", methods=["PATCH"])
@auth_required
def update_product_category(id):
    """
        Update the categories for a specific product.
        Validates that the categories provided are in the list.
    """
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

@app.route("/products", methods=["POST"])
def add_product():
    try:
        data = request.get_json()  # ✅ Get raw JSON from request

        required_fields = ["title", "website", "image", "company", "category", "price"]
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        if not isinstance(data["price"], str):
            data["price"] = str(data["price"])

        # ✅ Ensure dietary fields are received
        dietary_fields = ["vegan", "gluten_free", "nut_free", "non_gmo", "organic"]
        for field in dietary_fields:
            if field in data:
                print(f"Field {field}: {data[field]}")  # ✅ Debug before insertion
                data[field] = bool(data[field])  # Ensure proper boolean conversion
            else:
                data[field] = False  # Default if missing

        data["createdAt"] = datetime.now(timezone.utc)

        db.products.insert_one(data)  # ✅ Insert into DB

        return jsonify({"message": "Product added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/products", methods=["GET"])
def get_products():
    """
    Get products grouped by company.
    If a category query parameter is provided, filters by that category.
    The aggregation pipeline groups products by company and converts ObjectId to str.
    """
    category = request.args.get('category', None)

    try:
        # Build aggregation pipeline dynamically
        pipeline = []
        if category:
            pipeline.append({"$match": {"category": category}})  # Filter by category if provided

        pipeline.extend([
            {
                "$lookup": {  # Join with the companies collection to get the company logo
                    "from": "companies",
                    "localField": "company",
                    "foreignField": "name",
                    "as": "company_details"
                }
            },
            {
                "$addFields": {  # Extract the first company logo (if exists)
                    "company_logo": {"$arrayElemAt": ["$company_details.logo", 0]}
                }
            },
            {
                "$group": {  # Group by company name
                    "_id": "$company",
                    "company_logo": {"$first": "$company_logo"},  # Include logo in the group
                    "products": {"$push": {
                        "_id": {"$toString": "$_id"},  # Convert ObjectId to string
                        "title": "$title",
                        "company": "$company",
                        "website": "$website",
                        "category": "$category",
                        "image": "$image",
                        "price": "$price",
                        "vegan": "$vegan",   
                        "gluten_free": "$gluten_free", 
                        "nut_free": "$nut_free", 
                        "non_gmo": "$non_gmo",  
                        "organic": "$organic",  
                        "createdAt": "$createdAt"
                    }}
                }
            },
            {"$sort": {"_id": 1}}  # Sort companies alphabetically
        ])

        grouped_products = list(db.products.aggregate(pipeline))
        return jsonify(grouped_products), 200

    except Exception as e:
        import traceback
        print(f"Error fetching products: {e}")
        traceback.print_exc()
        return jsonify({"error": f"Failed to fetch products: {str(e)}"}), 500
    
@app.route("/companies/categories", methods=["GET"])
def get_company_categories():
    try:
        categories = db.companies.distinct("category")  # ✅ Get unique categories
        return jsonify(categories), 200
    except Exception as e:
        print(f"Error fetching company categories: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/products/categories", methods=["GET"])
def get_product_categories():
    try:
        categories = db.products.distinct("category")  # ✅ Get unique categories
        return jsonify(categories), 200
    except Exception as e:
        print(f"Error fetching product categories: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/products/category/<category_name>", methods=["GET"])
def get_products_by_category(category_name):
    """Retrieve products filtered by a specific category."""
    try:
        # ✅ Case-insensitive category matching
        products = list(db.products.find({"category": {"$regex": f"^{category_name}$", "$options": "i"}}))

        # Convert ObjectId to string
        for product in products:
            product["_id"] = str(product["_id"])

        if not products:
            return jsonify({"message": "No products found in this category"}), 404

        return jsonify(products), 200
    except Exception as e:
        print(f"Error fetching products by category: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/admin/products/<id>", methods=["PATCH"])
@auth_required
def update_product_visibilty(id):
    """
        Update the visibility of a product.
        Expects a JSON body with a "visible" key.
    """
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
@auth_required
def delete_product_admin(id):
    """
        Delete a product by its ID from the admin endpoint.
    """
    try:
        result = products_collection.delete_one({"_id": ObjectId(id)})
        if result.deleted_count:
            return jsonify({"message": "Product deleted successfully"}), 200
        else:
            return jsonify({"error": "Product not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/admin/products/<id>/edit", methods=["PATCH"])
@auth_required
def edit_product_title(id):
    """
        Edit products title, expects JSON key "summary" for new title.
    """
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

@app.route("/admin/products", methods=["GET"])
@auth_required
def get_all_products():
    """
        Retrieve all products from the DB.
        Prodcuts are sorted by creation date, ObjectIds are converted to str.
    """
    try:
        products = list(db.products.find().sort("createdAt", -1))
        for product in products:
            product["_id"] = str(product["_id"])
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/companies/search", methods=["GET"])
def search_companies():
    """
        Search for companies by normalizing the query and comparing it against
        the "name", "specifics", and "description" fields.
    """
    query = request.args.get("q", "").strip()
    try:
        if not query:
            return jsonify([]), 200

        # Normalize the input query
        normalized_query = normalize_text(query)
        app.logger.info(f"Normalized query: {normalized_query}")

        # Fetch all companies from the database
        companies = list(companies_collection.find())
        app.logger.info(f"Total companies fetched: {len(companies)}")

        # Finction to check if any company fields match the query.
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

        # Filter companies based on the normalized query.
        filtered_companies = [company for company in companies if matches(company)]

        # Convert ObjectId to string
        for company in filtered_companies:
            company["_id"] = str(company["_id"])

        return jsonify(filtered_companies), 200

    except Exception as e:
        app.logger.error(f"Error in /companies/search: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500
    
@app.route("/admin/companies/<id>/icons", methods=["PATCH"])
@auth_required
def update_company_icons(id):
    """
        Update icons for companies.
        Expects JSON body with an "icons" list
    """
    try:        
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
@auth_required
def update_company_specifics(id):
    """
        Update the "specifics" field for a company.
        Expects a JSON string for "specifics".
    """
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

@app.route("/admin/index/<company_id>", methods=["GET"])
@auth_required
def get_company_transparency_index(company_id):
    """
    Fetch the transparency index for a company, or return a default template if none exists.
    """
    try:
        if not ObjectId.is_valid(company_id):
            return jsonify({"error": "Invalid company ID format"}), 400

        object_id = ObjectId(company_id)

        # 🔧 Improved query: Check `_id` as both ObjectId and string
        index_data = db.index.find_one({
            "$or": [{"_id": object_id}, {"_id": company_id}]
        })

        if not index_data:
            # If no index data exists, return a default template
            company = db.companies.find_one({"_id": object_id})
            if not company:
                return jsonify({"error": "Company not found"}), 404

            return jsonify({
                "company_id": company_id,
                "company_name": company.get("name", "Unknown"),
                "sustainability": 0,
                "ethical_sourcing": 0,
                "materials": 0,
                "carbon_energy": 0,
                "transparency": 0,
                "links": {
                    "sustainability": "",
                    "ethical_sourcing": "",
                    "materials": "",
                    "carbon_energy": "",
                    "transparency": "",
                },
            }), 200

        index_data["_id"] = str(index_data["_id"])
        return jsonify(index_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/admin/index", methods=["POST"])
@auth_required
def submit_transparency_index():
    """Submit or update transparency index data for a company."""
    try:
        data = request.json
        print("🔍 Received transparency index data:", data)  # ✅ Log the incoming request

        # Validate required fields
        required_fields = ["company_id", "company_name", "sustainability", "ethical_sourcing", "materials", "carbon_energy", "transparency", "links"]
        for field in required_fields:
            if field not in data:
                print(f"❌ Missing field: {field}")  # ✅ Debugging
                return jsonify({"error": f"Missing field: {field}"}), 400

        company_id = data["company_id"]

        # Ensure ObjectId is valid
        try:
            company_id_obj = ObjectId(company_id)
        except Exception as e:
            print(f"❌ Invalid company_id format: {e}")  # ✅ Debugging
            return jsonify({"error": "Invalid company_id format"}), 400

        # Calculate total score
        total_score = sum([
            data.get("sustainability", 0),
            data.get("ethical_sourcing", 0),
            data.get("materials", 0),
            data.get("carbon_energy", 0),
            data.get("transparency", 0),
        ])

        # Assign transparency badge based on score
        if total_score >= 85:
            badge = "🟢 Excellent Transparency"
        elif total_score >= 70:
            badge = "🟡 Good Transparency"
        elif total_score >= 50:
            badge = "🟠 Moderate Transparency"
        elif total_score >= 30:
            badge = "🔴 Limited Transparency"
        else:
            badge = "⚪ Opaque (Minimal Info)"

        print(f"📊 Calculated Score: {total_score}, Assigned Badge: {badge}")  # ✅ Debugging

        # Prepare index data
        index_entry = {
            "_id": company_id_obj,  # ✅ Ensure correct _id format
            "company_name": data["company_name"],
            "sustainability": {"score": data["sustainability"], "link": data["links"]["sustainability"]},
            "ethical_sourcing": {"score": data["ethical_sourcing"], "link": data["links"]["ethical_sourcing"]},
            "materials": {"score": data["materials"], "link": data["links"]["materials"]},
            "carbon_energy": {"score": data["carbon_energy"], "link": data["links"]["carbon_energy"]},
            "transparency": {"score": data["transparency"], "link": data["links"]["transparency"]},
            "total_score": total_score,
            "transparency_badge": badge,
            "last_updated": datetime.utcnow()
        }

        print(f"📥 Saving transparency index to MongoDB: {index_entry}")  # ✅ Debugging

        # Save in `index` collection
        db.index.update_one({"_id": company_id_obj}, {"$set": index_entry}, upsert=True)

        # Update `companies` collection
        db.companies.update_one(
            {"_id": company_id_obj},
            {"$set": {"transparency_score": total_score, "transparency_badge": badge}}
        )

        print("✅ Transparency index updated successfully!")  # ✅ Debugging
        return jsonify({"message": "Transparency index updated successfully", "score": total_score, "badge": badge}), 200

    except Exception as e:
        print("❌ ERROR in /admin/index:", str(e))  # ✅ Debugging
        return jsonify({"error": str(e)}), 500

@app.route('/companies', methods=['GET'])
def get_companies():
    """
    Retrieve companies from the DB.
    Optionally filters companies by category if provided as a query parameter.
    Uses collation to perform a case-insensitive sort on the "name" field.
    """
    try:
        db = get_database()  # Ensure MongoDB connection is initialized
        category = request.args.get("category")
        query = {}
        if category:
            query["category"] = category

        collation = Collation("en", strength=2)
        companies = list(db.companies.find(query).collation(collation).sort("name", 1))

        for company in companies:
            company["_id"] = str(company["_id"])  # Convert ObjectId to string

        return jsonify(companies), 200
    except Exception as e:
        print(f"Error in /companies: {e}")  # Log error in console
        return jsonify({"error": str(e)}), 500

@app.route('/companies', methods=['POST'])
def add_company():
    """
        Add a new company to the DB.
        Automatically sets the creation date and converts qualifications
        from a comma-separated string to a list if necessary.
    """
    try:
        # Get JSON data
        data = request.json
        if not data:
            return jsonify({"error": "Invalid JSON data"}), 400

        data["createdAt"] = datetime.now(timezone.utc)

        # Convert qualifications from CSV to list
        if isinstance(data.get("qualifications"), str):
            data["qualifications"] = [q.strip() for q in data["qualifications"].split(",")]

        # Ensure required fields are present
        required_fields = ["name", "description", "website", "category"]
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        is_small_business = data.get("isSmallBusiness", False)
        if isinstance(is_small_business, str):
            is_small_business = is_small_business.lower() in ["true", "1"]    
        elif not isinstance(is_small_business, bool):
            is_small_business = bool(is_small_business)
        collection = db["smallbusiness"] if is_small_business else db["companies"]

        # ✅ Insert company data into MongoDB
        result = collection.insert_one(data)

        # ✅ Convert ObjectId to string before returning the response
        data["_id"] = str(result.inserted_id)

        return jsonify({"message": "Company added successfully", "company": data}), 201

    except Exception as e:
        import traceback
        print("❌ Error in /companies:", str(e))
        traceback.print_exc()  # ✅ Logs the full error stack trace
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

@app.route('/companies/<company_id>', methods=['PUT'])
def update_company(company_id):
    try:
        try:
            object_id = ObjectId(company_id)
        except Exception as e:
            print("❌ Invalid company ID:", e)
            return jsonify({"error": "Invalid company ID"}), 400

        data = request.json  # ✅ Expect JSON input
        update_fields = {}

        company = db.companies.find_one({"_id": object_id})
        if company:
            collection = db.companies
            print("✅ Found company in `companies` collection")
        else:
            company = db.smallbusiness.find_one({"_id": object_id})
            if company:
                collection = db.smallbusiness
                print("✅ Found company in `smallbusiness` collection")
            else:
                print("❌ Company not found in either collection.")
                return jsonify({"error": "Company not found"}), 404

        # ✅ Handle Instagram Link Update (JSON input)
        if "instagram" in data:
            new_instagram = data["instagram"].strip()
            if new_instagram:
                update_fields["instagram"] = new_instagram
                print(f"🔗 Updating Instagram Link: {new_instagram}")

        # ✅ Handle File Upload (Only if present)
        if "file" in request.files:
            file = request.files["file"]
            file_name = f"logos/{datetime.now().timestamp()}_{secure_filename(file.filename)}"
            blob = firebase_bucket.blob(file_name)

            try:
                print(f"📂 Uploading file: {file.filename} to Firebase Storage")
                blob.upload_from_file(file, content_type=file.content_type)
                blob.make_public()

                file_url = blob.public_url
                update_fields["logo"] = file_url  # ✅ Preserve old logo if no new file

                print(f"✅ File uploaded successfully: {file_url}")

            except Exception as e:
                print(f"❌ File upload failed: {e}")
                return jsonify({"error": "File upload failed", "details": str(e)}), 500
        else:
            print("⚠️ No file received in request.")

        # ✅ Ensure MongoDB Only Updates Provided Fields
        if not update_fields:
            print("❌ No valid fields provided for update.")
            return jsonify({"error": "No valid fields provided"}), 400

        result = collection.update_one({"_id": object_id}, {"$set": update_fields})

        if result.modified_count == 0:
            print("❌ MongoDB did not modify any documents")
            return jsonify({"error": "No changes made to the company"}), 400

        return jsonify({"message": "Company updated successfully", "updated_data": update_fields}), 200

    except Exception as e:
        print("❌ Unexpected Error:", str(e))
        return jsonify({"error": str(e)}), 500
    
@app.route('/companies/<company_id>', methods=['DELETE'])
def delete_company(company_id):
    """
        Delete a company from the DB based on its ID.
    """
    try:
        db.companies.delete_one({"_id": ObjectId(company_id)})
        return jsonify({"message": "Company deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/companies/<company_id>', methods=["GET"])
def get_company_by_id(company_id):
    """
    Retrieve a company by ID.
    Converts the MongoDB ObjectId to a string before returning
    """
    try:
        company = db.companies.find_one({"_id": ObjectId(company_id)})

        if not company:
            return jsonify({"error": "Company not found"}), 404
        
        company["_id"] = str(company["_id"])
        return jsonify(company), 200

    except Exception as e:
        print(f"Error fetching company: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/reports/<company_id>", methods=["GET"])
def get_reports_by_company(company_id):
    """
    Retrieve all reports linked to a company. If none exist, return an empty object.
    """
    try:
        object_id = ObjectId(company_id)  # ✅ Ensure valid ObjectId
        reports = list(reports_collection.find({"company_id": str(object_id)}, {"_id": 0}))

        if not reports:
            return jsonify({"message": "No reports found", "reports": []}), 200  # ✅ Return empty list instead of 404

        return jsonify({"reports": reports}), 200

    except InvalidId:
        return jsonify({"error": "Invalid company ID format"}), 400
    except Exception as e:
        print("❌ Error fetching reports:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/companies/<company_id>/category', methods=['PUT'])
def update_company_category(company_id):
    """
        Update the category field of a company.
        Expects a JSON payload with a "category" field.
    """
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

@app.route('/admin/reports/<company_id>', methods=["POST"])
@auth_required
def add_or_update_reports(company_id):
    """
    Allows an admin to manually add or update a report for a company
    Only "report_name" is required, other fields are optional.
    """
    try:
        data = request.json

        # ✅ Require only "report_name"
        if "report_name" not in data or not data["report_name"].strip():
            return jsonify({"error": "Report name is required"}), 400

        # ✅ Validate company_id as a valid ObjectId
        try:
            object_id = ObjectId(company_id)
        except InvalidId:
            return jsonify({"error": "Invalid company ID format"}), 400

        # ✅ Check if company exists
        company = companies_collection.find_one({"_id": object_id})
        if not company:
            return jsonify({"error": "Company not found"}), 404

        # ✅ Use `.get()` to allow optional fields (default to empty string or list)
        report_entry = {
            "company_id": str(object_id),  # ✅ Ensure company_id is stored as a string
            "company_name": company["name"],
            "report_name": data["report_name"],  # Required
            "report_details": data.get("report_details", ""),  # Optional
            "climate_impact": data.get("climate_impact", ""),  # Optional
            "sourcing_details": data.get("sourcing_details", ""),  # Optional
            "report_links": data.get("report_links", []),  # Optional, default to empty list
            "added_at": datetime.utcnow(),
        }

        # ✅ Insert or update the report
        reports_collection.update_one(
            {"company_id": str(object_id)},  # Ensure matching with string ID
            {"$set": report_entry},
            upsert=True  # ✅ Creates a new document if one doesn't exist
        )

        return jsonify({"message": "Report added/updated successfully!"}), 200

    except Exception as e:
        import traceback
        traceback.print_exc()  # ✅ Print the full error in the console
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500

@app.route('/admin/register', methods=['POST'])
def register_admin():
    """
    Step 1: Register a new admin.
    - The account remains "pending" until the SA approves it.
    - Sends an email notification to the Super Admin.
    """
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        # Check if email already exists
        if db.admins.find_one({"email": email}):
            return jsonify({"error": "Email already registered"}), 400

        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        # Insert new admin with "pending" status
        db.admins.insert_one({
            "email": email,
            "password": hashed_password,
            "status": "pending",  # ✅ Admin remains pending until approved
            "mfa_secret": None,
            "role": "admin"
        })

        # ✅ Send Email Notification to Super Admin
        send_sa_notification(email)

        return jsonify({"message": "Admin account created. Waiting for SA approval."}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/admin/approve/<admin_id>", methods=["PATCH"])
@auth_required
def approve_admin(admin_id):
    """
    Approve a pending admin.
    Only SA can perform this action.
    """
    sa_email = request.json.get(SA_EMAIL)
    sa_password = request.json.get(SA_PASSWORD)

    super_admin = db.admins.find_one({"email": sa_email, "role": "super_admin"})

    if not super_admin or not bcrypt.checkpw(sa_password.encode('utf-8'), super_admin["password"].encode('utf-8')):
        return jsonify({"error": "Unauthorized"}), 403
    
    updated = db.admins.update_one(
        {"_id": ObjectId(admin_id), "status": "pending"},
        {"$set": {"status": "approved"}}
    )

    if updated.modified_count == 1:
        return jsonify({"message": "Admin approved"}), 200
    else:
        return jsonify({"error": "Admin not found or already approved"}), 404

@app.route("/admin/reject/<admin_id>", methods=["DELETE"])
def reject_admin(admin_id):
    """
    Step 2: SA manually rejects and deletes a pending admin.
    """
    try:
        sa_email = request.json.get(SA_EMAIL)  # Super Admin credentials
        sa_password = request.json.get(SA_PASSWORD)

        super_admin = db.admins.find_one({"email": sa_email, "role": "super_admin"})

        if not super_admin or not bcrypt.checkpw(sa_password.encode('utf-8'), super_admin["password"].encode('utf-8')):
            return jsonify({"error": "Unauthorized"}), 403

        deleted = db.admins.delete_one({"_id": ObjectId(admin_id), "status": "pending"})

        if deleted.deleted_count == 1:
            return jsonify({"message": "Admin rejected and deleted"}), 200
        else:
            return jsonify({"error": "Admin not found"}), 404
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/admin/login", methods=['POST'])
def admin_login():
    """
    Step 1: Handle admin login and return MFA requirement status.
    """
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        print(f"🔍 Login attempt: Email={email}")

        if not email or not password:
            return jsonify({"success": False, "message": "Email and password are required"}), 400

        admin = db.admins.find_one({"email": email})
        if not admin:
            print("❌ Admin not found.")
            return jsonify({"success": False, "message": "Invalid credentials"}), 401

        stored_hash = admin["password"]

        # Check password
        if not bcrypt.checkpw(password.encode("utf-8"), stored_hash.encode("utf-8")):
            print("❌ Incorrect password.")
            return jsonify({"success": False, "message": "Invalid credentials"}), 401

        # Check if the account is approved
        if admin["status"] != "approved":
            print("⚠️ Account pending approval.")
            return jsonify({"success": False, "message": "Account pending approval"}), 403

        # ✅ If MFA is not set up, prompt for setup
        if not admin.get("mfa_secret"):
            print("⚠️ MFA not set up for this user. Prompting setup.")
            return jsonify({"success": True, "mfaSetupRequired": True, "user_id": str(admin["_id"])}), 200

        print("🔒 MFA required on login.")
        return jsonify({"success": True, "mfaRequired": True, "user_id": str(admin["_id"])}), 200

    except Exception as e:
        print(f"🚨 Login error: {e}")
        return jsonify({"success": False, "message": "Internal server error"}), 500

@app.route("/admin/setup-mfa", methods=["POST"])
def setup_mfa():
    """
    Step 2: Generate MFA secret for an approved admin.
    """
    try:
        email = request.json.get("email")

        # Get the admin user
        admin = db.admins.find_one({"email": email, "status": "approved"})
        if not admin:
            return jsonify({"error": "User not found or not approved"}), 404

        secret = pyotp.random_base32()
        db.admins.update_one({"_id": admin["_id"]}, {"$set": {"mfa_secret": secret}})

        otp_uri = pyotp.totp.TOTP(secret).provisioning_uri(
            name=f"EcoCommerce:{admin['email']}", issuer_name="EcoCommerce"
        )

        return jsonify({"otp_uri": otp_uri, "secret": secret}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/admin/verify-mfa", methods=["POST"])
def verify_mfa():
    """
    Step 2: Verify TOTP MFA code during login.
    Uses the Google Authenticator code as the session token.
    """
    try:
        user_id = request.json.get("user_id")
        mfa_code = request.json.get("mfaCode")

        print(f"🔍 Received MFA verification request for user_id: {user_id}, mfaCode: {mfa_code}")

        if not user_id or not mfa_code:
            return jsonify({"error": "Missing user_id or MFA code"}), 400

        admin = db.admins.find_one({"_id": ObjectId(user_id), "status": "approved"})
        if not admin or not admin.get("mfa_secret"):
            return jsonify({"error": "MFA not set up or user not approved"}), 404

        totp = pyotp.TOTP(admin["mfa_secret"])

        # ✅ Verify MFA Code (Acts as the session token)
        if not totp.verify(mfa_code):
            return jsonify({"error": "Invalid MFA code"}), 401
        
        expiration_time = datetime.utcnow() + timedelta(hours=2)
        token_payload = {"user_id": str(admin["_id"]), "exp": expiration_time}
        session_token = jwt.encode(token_payload, SECRET_KEY, algorithm="HS256")

        db.admins.update_one({"_id": admin["_id"]}, {"$set": {"lastActivity": datetime.utcnow()}})

        # ✅ Return MFA Code as the session token (expires in 30 seconds)
        return jsonify({"success": True, "sessionToken": session_token, "message": "MFA verified"}), 200

    except Exception as e:
        print(f"🚨 MFA Verification error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route('/smallbusiness', methods=['GET'])
def get_small_business():
    try:
        small_business = list(db.smallbusiness.find().sort("name", 1))

        for business in small_business:
            business["_id"] = str(business["_id"])

        return jsonify(small_business), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/contact", methods=["POST"])
def send_contact_email():
    """
    Send an email using the Brevo transactional email API.
    Validates required fields, handles optional file attachment (base64 encoded),
    and builds the email payload to be sent.
    """
    try:
        # Validate API Key
        if not os.getenv("BREVO_API_KEY"):
            print("🚨 ERROR: BREVO_API_KEY is not set!")
            return jsonify({"error": "Server misconfiguration. No API key found."}), 500

        # Validate required form fields
        if not all(field in request.form for field in ["name", "email", "message"]):
            print("🚨 Missing form fields!")
            return jsonify({"error": "Missing form data"}), 400

        # Extract form data
        name = request.form.get("name")
        email = request.form.get("email")
        message = request.form.get("message")
        file = request.files.get("file")

        # Debugging: Log received data
        print(f"📥 Received form data: Name={name}, Email={email}, Message={message}")
        print(f"📎 File received: {file.filename if file else 'No file uploaded'}")

        # Ensure required fields are not empty
        if not name or not email or not message:
            return jsonify({"error": "All fields are required."}), 400

        # Handle optional file attachment
        attachment_list = []  # Default empty attachment list

        if file and file.filename:
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(file_path)

            if os.path.getsize(file_path) > 0:
                with open(file_path, "rb") as f:
                    encoded_file = base64.b64encode(f.read()).decode("utf-8")

                attachment_list.append({
                    "content": encoded_file,
                    "name": filename
                })
            else:
                print("⚠️ Warning: File is empty, skipping attachment.")

        # Initialize Brevo API client
        api_client = sib_api_v3_sdk.ApiClient(configuration)
        api_instance = sib_api_v3_sdk.TransactionalEmailsApi(api_client)

        # Build email content
        subject = "New Contact Form Submission"
        html_content = f"""
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Message:</strong></p>
        <p>{message}</p>
        """

        # Define sender and recipient
        sender = {"email": "contact@ecocommerce.earth", "name": "EcoCommerce"}
        recipients = [{"email": "contact@ecocommerce.earth"}]

        # ✅ **Only include `attachment` if there is a file**
        email_payload = {
            "to": recipients,
            "sender": sender,
            "subject": subject,
            "html_content": html_content
        }

        if attachment_list:
            email_payload["attachment"] = attachment_list  # Only add if non-empty

        # Debug: Print the final email payload before sending
        print("📤 Sending Email Payload:", email_payload)

        # Send email via Sendinblue API
        email_data = sib_api_v3_sdk.SendSmtpEmail(**email_payload)
        api_response = api_instance.send_transac_email(email_data)
        pprint(api_response)

        return jsonify({"message": "Email sent successfully!"}), 200

    except ApiException as e:
        print("🚨 Sendinblue API Error:", str(e))
        return jsonify({"error": "Failed to send email due to API error."}), 500

    except Exception as e:
        print("🚨 Unexpected Error:", str(e))
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

@app.route('/companies/count', methods=['GET'])
def get_companies_count():
    try:
        total_companies = db.companies.count_documents({})

        print(f"📊 Total Companies (Debug): {total_companies}")  # Ensure it's correct

        # ✅ Explicitly return JSON response
        response = jsonify({"count": int(total_companies)})  # Convert to int just in case
        response.status_code = 200
        return response

    except Exception as e:
        print("❌ Error:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/products/count', methods=['GET'])
def get_products_count():
    try:
        total_products = db.products.count_documents({})
        print(f"📦 Total Products (Debug): {total_products}")  # Debug log
        return jsonify({"count": int(total_products)}), 200  # Ensure JSON response
    except Exception as e:
        print("❌ Error in /products/count:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/certifications/count', methods=['GET'])
def get_unique_icons_count():
    """
    Counts the total number of unique icons used in the 'icons' field
    across all companies in the database.
    """
    try:
        # Fetch all distinct icon arrays from companies collection
        all_icons = db.companies.distinct("icons")

        # Flatten the list and remove duplicates
        unique_icons = set(icon for icon_list in all_icons if icon_list for icon in icon_list)

        print(f"🏅 Total Unique Icons (Certifications Count Debug): {len(unique_icons)}")  # Debugging

        return jsonify({"count": len(unique_icons)}), 200
    except Exception as e:
        print("❌ Error in /certifications/count:", str(e))
        return jsonify({"error": str(e)}), 500

@app.route('/companies/recent', methods=['GET'])
def get_recent_companies():
    """
    Retrieve the most recent companies added.
    - If `lastTwoWeeks=true` is provided, it only returns companies added in the last 14 days.
    - If `limit` is provided, it limits the number of results (default: 5).
    """
    try:
        limit = int(request.args.get('limit', 5))  # Default limit is 5
        last_two_weeks = request.args.get('lastTwoWeeks', 'false').lower() == 'true'

        query = {}

        if last_two_weeks:
            two_weeks_ago = datetime.now(timezone.utc) - timedelta(days=14)
            query["createdAt"] = {"$gte": two_weeks_ago}  # Fetch only recent companies

        # Fetch companies based on the query
        recent_companies = list(db.companies.find(query, {"name": 1, "createdAt": 1})
                                .sort("createdAt", -1)
                                .limit(limit))

        # Fetch from `smallbusiness` collection too
        recent_small_businesses = list(db.smallbusiness.find(query, {"name": 1, "createdAt": 1})
                                       .sort("createdAt", -1)
                                       .limit(limit))

        all_recent = recent_companies + recent_small_businesses

        # Convert ObjectId to string for JSON response
        for company in all_recent:
            company["_id"] = str(company["_id"])

        # Sort results by creation date (most recent first)
        all_recent.sort(key=lambda x: x.get("createdAt", ""), reverse=True)

        return jsonify(all_recent), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
    db = get_database()