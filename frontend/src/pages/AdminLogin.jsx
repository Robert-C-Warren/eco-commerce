import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = ({ onLogin }) => {
    const [password, setPassword] = useState("");
    const [destination, setDestination] = useState("/admin/products")
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password === "#HoliLogi91823") {
            onLogin(true);
            navigate(destination);
        } else {
            alert("Invalid Password!");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <h1>Admin Login</h1>
                <input
                    type="password"
                    placeholder="Enter Admin Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="destination">Choose Admin Page:</label>
                <select 
                    id="destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                >
                    <option value="/admin/products">Manage Products</option>
                    <option value="/admin/companies">Manage Companies</option>
                </select>
            </div>
            <button type="submit">Login</button>
        </form>
    );
};

export default AdminLogin;