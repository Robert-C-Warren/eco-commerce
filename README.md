<h1>EcoCommerce Web App</h1>
<p>
  EcoCommerce is a web application that helps users discover and support eco-friendly companies and products.
  It provides information about companies' sustainability practices, certifications, and ethical business standards.
</p>

<h3>Features</h3>
<p>✅ <strong>Eco-Friendly Companies</strong> - Browse a directory of sustainable businesses.</p>
<p>✅ <strong>Expandable Company Cards</strong> - View details about companies, including their mission and certifications.</p>
<p>✅ <strong>Search Functionality</strong> - Find companies easily with search functionality.</p>
<p>✅ <strong>Admin Panel</strong> - Manage Products (in progress), companies, and sustainability reports (in progress).</p>
<p>✅ <strong>Firebase Storage Integration</strong> - Handles image uploads for company logos.</p>
<p>✅ <strong>MongoDB Backend</strong> - Stores companies, products, reports, and subscriber data (in progress)</p>

<h2>Tech Stack</h2>
<h3>Frontend</h3>
<ul>
  <li>⚛️ React (JS)</li>
  <li>🎨 Bootstrap 5</li>
  <li>🔍 React Router</li>
</ul>
<h3>Backend</h3>
<ul>
  <li>🐍 Flask (Python)</li>
  <li>🗄️ MongoDB (with PyMongo)</li>
  <li>☁️ Firebase Storage</li>
  <li>📧 Brevo API for emails</li>
</ul>

<h2>Installation</h2>
<h3>1️⃣ Clone the Repository</h3>
<pre><code>
  git clone https://github.com/Robert-C-Warren/eco-commerce.git
  cd eco-commerce
</code></pre>
<h3>2️⃣ Set Up the Backend</h3>
<p>
  <strong>1. Navigate to backend folder</strong>
  <pre><code>cd backend</code></pre>
  
  <strong>2. Create a virtual environment and activate it</strong>
  <pre><code>
    python -m venv venv
    source venv/bin/activate  # Mac/Linx
    venv/Scripts/activate  # Windows
  </code></pre>

  <strong>3. Install dependencies</strong>
  <pre><code>pip install -r requirements.txt</code></pre>

  <strong>4. Set up environment variables</strong>
  Create a .env file in the backend directory:
  <pre><code>
    PORT=5000
    MONGO_URI=mongodb+srv://your-mongo-uri
    ALLOWED_ORIGINS=http://localhost:3000
    FIREBASE_PROJECT_ID=your-firebase-project-id
    FIREBASE_PRIVATE_KEY=your-private-key
    FIREBASE_CLIENT_EMAIL=your-client-email
    FIREBASE_STORAGE_BUCKET=your-storage-bucket
    BREVO_API_KEY=your-brevo-api-key
    ADMIN_PASSWORD=your-admin-password
  </code></pre>

  <strong>Run the Flask API</strong>
  <pre><code>python app.py</code></pre>

  <h3>3️⃣ Set Up the Frontend</h3>
  <strong>Navigate to the frontend folder</strong>
  <pre><code>cd ../frontend</code></pre>

  <strong>Install dependencies</strong>
  <pre><code>npm install</code></pre>

  <strong>Start the development server</strong>
  <pre><code>npm start</code></pre>
</p>

<h2>Project Structure</h2>
<pre><code>
  EcoCommerce/
│── backend/
│   ├── app.py                # Main Flask app
│   ├── config.py             # MongoDB connection
│   ├── routes/               # API endpoints
│   ├── models/               # Database models
│   ├── uploads/              # Image uploads
│   └── requirements.txt      # Backend dependencies
│
│── frontend/
│   ├── src/
│   │   ├── components/       # UI components (Company Cards, BScoreChart, etc.)
│   │   ├── pages/            # React pages (AdminConsole, CompaniesPage, etc.)
│   │   ├── services/         # API functions
│   │   ├── resources/        # Images & icons
│   │   └── App.js            # Main React app
│   ├── package.json          # Frontend dependencies
│   ├── public/
│   └── index.js
│
│── .env                      # Environment variables
│── README.md                 # Documentation
│── .gitignore                # Files to ignore in Git
</code></pre>

<h2>API Endpoints</h2>
<h3>🛠️ Companies</h3>
<ul>
  <li><strong>GET</strong> /companies -> Fetch all companies</li>
  <li><strong>GET</strong> /companies/search?q=keyword -> Search for companies</li>
  <li><strong>POST</strong> /companies -> Add new company</li>
  <li><strong>PUT</strong> /companies/<company_id> -> Update company details</li>
  <li><strong>DELETE</strong> /companies/<company_id> -> Remove a company</li>
</ul>

<h3>🛠️ Products</h3>
<ul>
  <li><strong>GET</strong> /products -> Get all products</li>
  <li><strong>POST</strong> /products -> Add new product</li>
  <li><strong>PATCH</strong> /admin/products/<id>/categories -> Update product category</li>
  <li><strong>DELETE</strong> /admin/products/<id> -> Remove a product</li>
</ul>

<h3>🛠️ Admin</h3>
<ul>
  <li><strong>POST</strong> /admin/login -> Admin authentication</li>
  <li><strong>GET</strong> /admin/reports -> Get all reports</li>
  <li><strong>POST</strong> /admin/reports/<company_id> -> Add or update a report</li>
</ul>

<h3>🛠️ Admin</h3>
<ul>
  <li><strong>POST</strong> /upload-logo -> Upload a company logo</li>
  <li><strong>GET</strong> /get-logo/<filename> -> Retrieve an uploaded logo</li>
</ul>











