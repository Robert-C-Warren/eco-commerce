import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"
import API_BASE_URL from "../components/urls"

const AdminLogin = ({ onLogin }) => {
    const [step, setStep] = useState("login");
    const [password, setPassword] = useState("");
    const [mfaCode, setMfaCode] = useState("");
    const [otpUri, setOtpUri] = useState("");
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [user_id, setUserId] = useState("");
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        console.log("🔍 Sending login request:", { email, password });

        try {
            const response = await axios.post(`${API_BASE_URL}/admin/login`, { email, password });

            console.log("✅ Login response:", response.data);

            if (response.data.success) {
                if (response.data.mfaRequired) {
                    console.log("🔒 MFA required. Storing user_id...");
                    setUserId(response.data.user_id); // ✅ Store user ID for MFA
                    setStep("mfa");
                } else if (response.data.mfaSetupRequired) {
                    console.log("⚠️ MFA setup required. Redirecting to setup...");

                    // ✅ Request MFA setup
                    const setupResponse = await axios.post(`${API_BASE_URL}/admin/setup-mfa`, { email });
                    setOtpUri(setupResponse.data.otp_uri);
                    setStep("setup-mfa");
                } else {
                    console.log("✅ Login successful.");
                    onLogin(true); // ✅ Update authentication state
                    navigate("/admin/products");
                }
            } else {
                console.log("❌ Login failed:", response.data.message);
                setError(response.data.message);
            }
        } catch (err) {
            console.error("🚨 Error in login request:", err);
            setError("An error occurred while logging in.");
        }
    };    

    const handleMfaSubmit = async (e) => {
        e.preventDefault();
        console.log("🔍 Sending MFA verification request:", { user_id, mfaCode });
    
        try {
            const response = await axios.post(`${API_BASE_URL}/admin/verify-mfa`, {
                user_id, 
                mfaCode
            });
    
            console.log("✅ MFA Verification response:", response.data);
    
            if (response.data.success) {
                console.log("✅ MFA verified. Storing session token...");
    
                // ✅ Store Session Token (Not MFA Code)
                sessionStorage.setItem("sessionToken", response.data.sessionToken);
    
                if (typeof onLogin === "function") {
                    onLogin(true);
                }
    
                navigate("/admin/products");
            } else {
                console.log("❌ MFA verification failed:", response.data.message);
                setError(response.data.message);
            }
        } catch (err) {
            console.error("🚨 Error in MFA verification:", err);
            setError("An error occurred during MFA verification.");
        }
    };
    

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow-lg p-4" style={{ maxWidth: "400px", width: "100%"}}>
                <div className="card-body">
                    <h2 className="card-title text-center mb-4 text-primary">
                        {step === "login" ? "Admin Login" : "MFA Verification"}
                    </h2>
                    {step === "setup-mfa" && (
                        <div className="text-center">
                            <p>Scan the QR with Google Authenticator</p>
                            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(otpUri)}`} alt="QR Code" />
                            <p>Or manually enter key:</p>
                            <code>{otpUri}</code>
                            <button className="btn btn-primary" onClick={() => setStep("mfa")}>Continue</button>
                        </div>
                    )}
                    {error && <div className="alert alert-danger">{error}</div>}
                    {step === "login" ? (
                    <form onSubmit={handleLoginSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label fw-bold">
                                Email
                            </label>
                            <input type="email" id="email" className="form-control" placeholder="Enter Email"
                                value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label fw-bold">
                                Password
                            </label>
                            <input type="password" id="password" className="form-control" placeholder="Enter Password"
                                value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="d-grid">
                            <button type="submit" className="btn btn-primary fw-bold">
                                Login
                            </button>
                        </div>
                    </form>
                    ) :(
                        <form onSubmit={handleMfaSubmit}>
                            <div className="mb-3">
                                <label htmlFor="mfaCode" className="form-label fw-bold">
                                    MFA Code
                                </label>
                                <input type="text" id="mfaCode" className="form-control" placeholder="Enter MFA"
                                    value={mfaCode} onChange={(e) => setMfaCode(e.target.value)} />
                            </div>
                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary fw-bold">
                                    Verify
                                </button>
                            </div>
                        </form>
                    )}
                    <p><Link to="/admin/register">Register here</Link></p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
