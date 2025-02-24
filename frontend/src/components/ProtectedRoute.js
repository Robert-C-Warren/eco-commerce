import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const mfaToken = localStorage.getItem("mfaToken"); // ✅ Get MFA Code from Storage

    if (!mfaToken) {
        console.log("🔒 Unauthorized! Redirecting to login...");
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
