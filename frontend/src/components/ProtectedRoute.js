import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const sessionToken = sessionStorage.getItem("sessionToken"); // ✅ Get MFA Code from sessionStorage

    if (!sessionToken) {
        console.log("🔒 Unauthorized! Redirecting to login...");
        return <Navigate to="/admin/login" replace />;
    }

    const tokenPayload = JSON.parse(atob(sessionToken.split(".")[1]))
    const tokenExpiration = tokenPayload.exp * 1000

    if (Date.now() > tokenExpiration) {
        console.log("Session expired. redirecting to login")
        sessionStorage.removeItem("sessionToken")
        return <Navigate to="/admin/login" replace />
    }

    return <Outlet />;
};

export default ProtectedRoute;
