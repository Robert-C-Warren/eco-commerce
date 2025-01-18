import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"
import API_BASE_URL from "../components/urls"

const AdminLogin = ({ onLogin }) => {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${API_BASE_URL}/admin/login`, {
                password,
            })

            if (response.data.success) {
                onLogin(true)
                navigate(`${API_BASE_URL}/admin/products`);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error(err)
            setError("An error occurred while logging in")
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%"}}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4 text-primary">Admin Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label fw-bold">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="form-control"
                                placeholder="Enter Admin Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary fw-bold">
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;