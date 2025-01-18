const API_BASE_URL = 
  window.location.hostname === "ecocommerce.earth"
  ? "https://eco-commerce-backend.onrender.com" 
  : "http://localhost:5000"; 

  export default API_BASE_URL;