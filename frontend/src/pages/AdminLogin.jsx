import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = ({ onLogin }) => {
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password === "#HoliLogi91823") {
            onLogin(true);
            navigate("/admin/products");
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
            <button type="submit">Login</button>
        </form>
    );
};

export default AdminLogin;