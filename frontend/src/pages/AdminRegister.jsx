import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import API_BASE_URL from "../components/urls";

const AdminRegister = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();  // ✅ Prevent form from refreshing

        try {
            const response = await axios.post(`${API_BASE_URL}/admin/register`, {
                email, password  // ✅ Removed username field
            });

            toast.success(response.data.message);
        } catch (err) {
            console.error("Error registering admin:", err);
            setError(err.response?.data?.error || "An error occurred");
        }
    };

    return (
        <div className="admin-register-container">
            <ToastContainer />
            <h2>Admin Registration</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleRegister}>
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default AdminRegister;
