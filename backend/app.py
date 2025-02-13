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
from firebase_admin import credentials, storage
from unicodedata import normalize, combining
import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from pprint import pprint
from werkzeug.utils import secure_filename
from pymongo.collation import Collation
import requests
from bs4 import BeautifulSoup

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

SEC_USER_AGENT = "contact@ecocommerce.earth"
CIK_LIST_URL = "https://www.sec.gov/files/company_tickers.json"

# Function to get CIK from company name
def get_cik(company_name):
    try:
        headers = {"User-Agent": SEC_USER_AGENT}
        response = requests.get(CIK_LIST_URL, headers=headers, verify=True)  # Ensure SSL verification

        if response.status_code != 200:
            print(f"Error: Received status code {response.status_code}")
            return None

        cik_data = response.json()
        for _, info in cik_data.items():
            if company_name.lower() in info["title"].lower():
                return str(info["cik_str"]).zfill(10)
        return None
    except requests.exceptions.RequestException as e:
        print("Error fetching CIK:", e)
        return None

def get_sec_filings(cik):
    try:
        url = f"https://data.sec.gov/submissions/CIK{cik}.json"
        headers = {"User-Agent": SEC_USER_AGENT}

        response = requests.get(url, headers=headers, verify=True)  # Ensure SSL verification
        if response.status_code != 200:
            print(f"Error fetching SEC Filings: Status code {response.status_code}")
            return None

        filings = response.json().get("filings", {}).get("recent", {})

        reports = [
            {
                "filingDate": filings["filingDate"][i],
                "reportUrl": f"https://www.sec.gov/Archives/{filings['accessionNumber'][i].replace('-', '')}.txt"
            }
            for i in range(len(filings["form"]))
            if filings["form"][i] == "10-K"
        ]

        return reports if reports else None
    except requests.exceptions.RequestException as e:
        print("Error fetching SEC Filings:", e)
        return None

# Extract ESG Infomation from 10-K Reports
def extract_esg_data(report_url):
    try:
        response = requests.get(report_url, headers={"User Agent": SEC_USER_AGENT})
        soup = BeautifulSoup(response.text, "html.parser")

        esg_sections = []
        keywords = ["sustainability", "climate-risk", "carbon-footprint", "environmental impact"]

        for paragraph in soup.find_all("p"):
            text = paragraph.get_text()
            if any(keyword in text.lower() for keyword in keywords):
                esg_sections.append(text.strip())
        return esg_sections if esg_sections else ["No ESG data found."]
    except Exception as e:
        print("Error extracting ESG data:", e)
        return ["Error extracting ESG data."]
    
# Admin route to fetch & store SEC Reports
@app.route("/admin/add_report", methods=["POST"])
def add_report():
    print("✅ Route /admin/add_report was hit!")    
    try:
        data = request.json
        company_name = data.get("company_name")

        cik = get_cik(company_name)
        if not cik:
            return jsonify({"error": "CIK not found"}), 404

        reports = get_sec_filings(cik)
        if not reports:
            return jsonify({"error": "No 10-K reports found"}), 404

        report_entries = []
        for report in reports:
            report["esg_data"] = extract_esg_data(report["reportUrl"])

            report_entry = {
                "company_name": company_name,
                "cik": cik,
                "reports": [report]  # Store each report as a separate entry
            }
            reports_collection.insert_one(report_entry)
            report_entries.append(report_entry)

        return jsonify({"message": "Reports added successfully!", "data": report_entries}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/admin/reports", methods=["GET"])
def get_reports():
    try:
        reports = list(reports_collection.find({}, {"_id": 0}))
        return jsonify(reports), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

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

        # Set allowed origings and methods
        headers["Access-Control-Allow-Origin"] = "https://ecocommerce.earth"
        headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"

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

@app.route("/upload-logo", methods=["POST"])
def upload_logo():
    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files["file"]
    file_name = f"logos/{datetime.now().timestamp()}_{file.filename}"
    blob = firebase_bucket.blob(file_name)

    try:
        blob.upload_from_file(file, content_type=file.content_type)
        blob.make_public()
        return jsonify({"message": "Upload successful", "file_url": blob.public_url}), 200
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
    """
        Admin login endpoint.
        Checks the provided password again env variable set password.
    """
    data = request.json
    if data.get("password") == ADMIN_PASSWORD:
        return jsonify({"success": True, "message": "Login Successful"}), 200
    else:
        return jsonify({"success": False, "message": "Invalid"}), 401

@app.route("/admin/products/<id>/categories", methods=["PATCH"])
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
    """
        Add a new product to the DB.
        Requires certain fields to be present in the request JSON.
    """
    try:
        data = request.json
        print("Recieved data:", data)

        # Ensure required fields exist
        required_fields = ["title", "website", "image", "company", "category", "price"]
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400

        data["createdAt"] = datetime.now(timezone.utc)
    
        products_collection.insert_one(data)  # ✅ Insert into the correct "products" collection

        return jsonify({"message": "Product added successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/products", methods=["GET"])
def get_products():
    """
        Get products grouped by company.
        If a category query parameter is provided, filters by that category.
        The aggreagation pipeline groups products by company and converts ObjectId to str.
    """
    category = request.args.get('category', None)

    try:
        # Build aggreagtion pipeline dynamically
        pipeline = []
        if category:
            pipeline.append({"$match": {"category": category}}) # Filter by category if provided

        pipeline.extend([
            {"$group": {
                "_id": "$company",  # Group by company name
                "products": {"$push": {
                    "_id": {"$toString": "$_id"},  # Convert ObjectId to string
                    "title": "$title",
                    "website": "$website",
                    "category": "$category",
                    "image": "$image",
                    "price": "$price"
                }}
            }},
            {"$sort": {"_id": 1}}  # Sort companies alphabetically
        ])

        grouped_products = list(db.products.aggregate(pipeline))

        return jsonify(grouped_products), 200

    except Exception as e:
        import traceback
        print(f"Error fetching products: {e}")
        traceback.print_exc()
        return jsonify({"error": f"Failed to fetch products: {str(e)}"}), 500
    
@app.route("/admin/products/<id>", methods=["PATCH"])
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

@app.route('/companies', methods=['GET'])
def get_companies():
    """
        Retrieve companies from the DB.
        Optionally filters companies by category if procided as a query parameter.
        Uses collation to perform a case-insensitive sort on the "name" field.
    """
    try:
        db = get_database()
        category = request.args.get("category")
        query = {}
        if category:
            query["category"] = category

        collation = Collation("en", strength=2)
        companies = list(db.companies.find(query).collation(collation).sort("name", 1))

        for company in companies:
            company["_id"] = str(company["_id"])

        return jsonify(companies), 200
    except Exception as e:
        print(f"Error in /companies: {e}") 
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

@app.route('/companies/recent', methods=["GET"])
def get_recent_companies():
    """
        Retrieve companies added in the last two weeks.
        Filters companies by comparing their creation date.
    """
    try:
        two_weeks_ago = datetime.now(timezone.utc) - timedelta(days=14)

        recent_companies = list(db.companies.find(
            {"createdAt": {"$gte": two_weeks_ago}}
        ))

        recent_small_businesses = list(db.smallbusiness.find({"createdAt": {"$gte": two_weeks_ago}}))

        all_recent = recent_companies + recent_small_businesses

        for company in all_recent:
            company["_id"] = str(company["_id"])

        all_recent.sort(key=lambda x: x.get("createdAt", ""), reverse=True)

        return jsonify(all_recent), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/companies/<company_id>', methods=['PUT'])
def update_company(company_id):
    try:
        print(f"📥 Received PUT request for company ID: {company_id}")

        try:
            object_id = ObjectId(company_id)
        except Exception as e:
            print("❌ Invalid company ID:", e)
            return jsonify({"error": "Invalid company ID"}), 400
        
        print("📥 Incoming Form Data:", request.form.to_dict())
        print("📂 Incoming Files:", request.files.keys())

        data = {}

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

        if "file" in request.files:
            file = request.files["file"]
            file_name = f"logos/{datetime.now().timestamp()}_{secure_filename(file.filename)}"
            blob = firebase_bucket.blob(file_name)

            try:
                print(f"📂 Uploading file: {file.filename} to Firebase Storage")
                blob.upload_from_file(file, content_type=file.content_type)
                blob.make_public()

                file_url = blob.public_url
                data["logo"] = file_url

                print(f"✅ File uploaded successfully: {file_url}")

            except Exception as e:
                print(f"❌ File upload failed: {e}")
                return jsonify({"error": "File upload failed", "details": str(e)}), 500
        else:
            print("⚠️ No file received in request.")

        # Read other form data
        form_data = request.form.to_dict()
        data.update(form_data)

        # Remove '_id' if present
        data.pop("_id", None)

        # Convert qualifications to a list if needed
        if "qualifications" in data and isinstance(data["qualifications"], str):
            data["qualifications"] = [q.strip() for q in data["qualifications"].split(",")]

        # Debug: Check if logo exists in `data`
        print(f"🛠️ Data before MongoDB update: {data}")

        if not data:
            print("❌ No valid fields provided for update.")
            return jsonify({"error": "No valid fields provided"}), 400

        # Log MongoDB update
        print(f"🔄 Updating MongoDB for {company_id} with:", data)

        result = collection.update_one({"_id": object_id}, {"$set": data})

        if result.modified_count == 0:
            print("❌ MongoDB did not modify any documents")
            return jsonify({"error": "No changes made to the company"}), 400

        print("✅ Company updated successfully in MongoDB")
        return jsonify({"message": "Company updated successfully", "updated_data": data}), 200

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
def add_or_update_reports(company_id):
    """
    Allows an admin to manually add or update a report for a company
    """
    try:
        data = request.json

        required_fields = ["filing_date", "esg_data", "climate_risk", "report_links"]
        if not all(field in data for field in required_fields):
            return jsonify({"error": "Missing required fields"}), 400
        
        company = companies_collection.find_one({"_id": ObjectId(company_id)})
        if not company:
            return jsonify({"error": "Company not found"}), 404
        
        reports_collection.update_one(
            {"company_id": company_id},
            {"$set": {
                "company_id": company_id,
                "company_name": company["name"],
                "filing_date": data["filing_date"],
                "esg_data": data["esg_data"],
                "climate_risk": data["climate_risk"],
                "report_links": data["report_links"],
                "added_at": datetime.utcnow(),
            }},
            upsert=True
        )

        return jsonify({"message": "Report added/updated successfully!"}), 200
    
    except Exception as e:
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
        Validates required fields, handles optional file attachment (base64 encoded)
        and builds the email payload to be sent.
    """
    try:
        # Validate API Key
        if not os.getenv("BREVO_API_KEY"):
            print("🚨 ERROR: BREVO_API_KEY is not set!")
            return jsonify({"error": "Server misconfiguration. No API key found."}), 500

        # Validate that required form data is present
        if "name" not in request.form or "email" not in request.form or "message" not in request.form:
            return jsonify({"error": "Missing form data"}), 400

        # Extract data from form submission
        name = request.form.get("name")
        email = request.form.get("email")
        message = request.form.get("message")
        file = request.files.get("file")

        # Ensure none of the required fields are empty
        if not name or not email or not message:
            return jsonify({"error": "All fields are required."}), 400

        attachment_list = []  # List to store any file attachments

        # IF a file is provided and is not empty, save and encode it
        if file and file.filename:
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
            file.save(file_path)

            if os.path.getsize(file_path) > 0:
                with open(file_path, "rb") as f:
                    encoded_file = base64.b64encode(f.read()).decode("utf-8")

                # Add the properly formatted attachment to the list
                attachment_list.append({
                    "content": encoded_file,
                    "name": filename
                })
            else:
                print("⚠️ Warning: File is empty, skipping attachment.")

        # Initialize Brevo API client
        api_client = sib_api_v3_sdk.ApiClient(configuration)
        api_instance = sib_api_v3_sdk.TransactionalEmailsApi(api_client)

        # Build Email content
        subject = "New Contact Form Submission"
        html_content = f"""
        <p><strong>Name:</strong> {name}</p>
        <p><strong>Email:</strong> {email}</p>
        <p><strong>Message:</strong></p>
        <p>{message}</p>
        """

        # Define sender and recipient information
        sender = {"email": "contact@ecocommerce.earth", "name": "EcoCommerce"}
        recipients = [{"email": "contact@ecocommerce.earth"}]

        # Create the email payload with attachments (if any)
        email_data = sib_api_v3_sdk.SendSmtpEmail(
            to=recipients,
            sender=sender,
            subject=subject,
            html_content=html_content,
            attachment=attachment_list  # ✅ Ensure attachments are added as a list
        )

        print("📨 Sending email with attachment to Sendinblue API...")
        api_response = api_instance.send_transac_email(email_data)
        pprint(api_response)

        return jsonify({"message": "Email sent successfully!"}), 200

    except ApiException as e:
        print("🚨 Sendinblue API Error:", str(e))
        return jsonify({"error": "Failed to send email due to API error."}), 500

    except Exception as e:
        print("🚨 Unexpected Error:", str(e))
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
    db = get_database()