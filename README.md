# 🌱 EcoCommerce Web App

[![Live Site](https://img.shields.io/badge/Live%20Site-ecocommerce.earth-brightgreen?style=for-the-badge)](https://ecocommerce.earth)

EcoCommerce is a web application that helps users discover and support eco-friendly companies and products.  
It provides information about companies' sustainability practices, certifications, and ethical business standards.

---

## ✨ Features

- 🔍 **Discover Ethical Brands** – Explore a curated directory of verified eco-friendly companies.
- 🧠 **Expandable Company Profiles** – See transparency reports, mission statements, and sustainability badges in detail.
- 🔎 **Full-Site Search** – Quickly find companies or products across all categories.
- 🛠️ **Admin Dashboard** – Add/edit companies, manage product entries, and update sustainability index data *(in progress)*.
- 🖼️ **Firebase Integration** – Securely handle image uploads for company logos and product cards.
- 💾 **MongoDB Backend** – Store and manage company data, product information, reports, and email subscribers *(partially implemented)*.

---

## 🧰 Tech Stack

### Frontend
- ⚛️ **React** – Component-based architecture for building interactive UIs.
- 🎨 **Bootstrap 5.3** – Responsive design and prebuilt styling components.
- 🧭 **React Router** – Client-side routing for seamless navigation.

### Backend
- 🐍 **Flask (Python)** – Lightweight API server with RESTful routing.
- 🗄️ **MongoDB (via PyMongo)** – NoSQL database for storing company and product data.
- ☁️ **Firebase Storage** – Handles image upload and cloud file hosting.
- 📧 **Brevo API** – Sends subscription emails and automated notifications.

---

## 🛠️ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Robert-C-Warren/eco-commerce.git
cd eco-commerce
```

### 2️⃣ Set Up the Backend

```bash
cd backend
```

Create a virtual environment and activate it:

```bash
python -m venv venv
# Mac/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://your-mongo-uri
ALLOWED_ORIGINS=http://localhost:3000
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_STORAGE_BUCKET=your-storage-bucket
BREVO_API_KEY=your-brevo-api-key
ADMIN_PASSWORD=your-admin-password
```

Run the Flask API:

```bash
python app.py
```

### 3️⃣ Set Up the Frontend

Navigate to the frontend directory and install dependencies:

```bash
cd ../frontend
npm install
npm start
```

---

## 📁 Project Structure

```
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
```

---

## 📡 API Endpoints

### 🛠️ Companies

- **GET** `/companies` → Fetch all companies  
- **GET** `/companies/search?q=keyword` → Search for companies  
- **POST** `/companies` → Add new company  
- **PUT** `/companies/<company_id>` → Update company details  
- **DELETE** `/companies/<company_id>` → Remove a company  

### 🛠️ Products

- **GET** `/products` → Get all products  
- **POST** `/products` → Add new product  
- **PATCH** `/admin/products/<id>/categories` → Update product category  
- **DELETE** `/admin/products/<id>` → Remove a product  

### 🛠️ Admin

- **POST** `/admin/login` → Admin authentication  
- **GET** `/admin/reports` → Get all reports  
- **POST** `/admin/reports/<company_id>` → Add or update a report  

### 🛠️ Assets

- **POST** `/upload-logo` → Upload a company logo  
- **GET** `/get-logo/<filename>` → Retrieve an uploaded logo
