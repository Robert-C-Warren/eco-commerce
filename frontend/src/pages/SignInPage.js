import React, { useState } from "react";
import { auth, signInWithGoogle, signInWithEmail } from "../firebaseConfig"
import { unstable_HistoryRouter, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "./styles/SignInSignUp.scss"

const SignInPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleEmailSignIn = async (e) => {
        e.preventDefault();
        setLoading(true)
        try{
            const user = await signInWithEmail(email, password)
            if (user) {
                navigate("/")
            } else {
                setError("Invalid email or password.")
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.", {autoClose: 3000})
            console.error("Sign-in error:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="sign-in-container my-4">
            <ToastContainer />
            <div className="sign-in-form">
                <h1 className="text-center" style={{ color: "white"}}>Sign In</h1>
                {error && <p className="text-danger text-center">{error}</p>}
                <form onSubmit={handleEmailSignIn} className="mx-auto" style={{ maxWidth: "400px"}}>
                    <div className="mb-3 login-inputs">
                        <label className="email-form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <label className="password-form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mb-2 sign-in-btn" disabled={loading}>{loading ? "Signing In..." : "Sign In"}</button>
                    <button type="button" className="btn btn-danger w-100 google-sign-in-btn" onClick={signInWithGoogle}>
                        <i class="bi bi-google"></i> Sign In
                    </button>
                </form>
                <p className="text-center mt-3 sign-up-link-container">
                    Don't have an account? <a href="/signup" className="sign-up-link">Sign Up</a>
                </p>
            </div>
        </div>
    )
}

export default SignInPage;