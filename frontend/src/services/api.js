import axios from 'axios';
import API_BASE_URL from "../components/urls"

const API = axios.create({ 
    baseURL: process.env.API_BASE_URL || "http://localhost:5000",
    headers: {
        "Content-Type": "applcation/json"
    },  
    withCredentials: true
});

export default API;