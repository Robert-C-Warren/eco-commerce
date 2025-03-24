import React, { useState } from "react";
import { auth, signUpWithEmail, signInWithGoogle } from "../firebaseConfig"
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "./styles/SignInSignUp.scss"

const SignUpPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleEmailSignUp = async (e) => {
        e.preventDefault();
        const user = await signUpWithEmail(email, password)
        if (user) {
            navigate("/")
        } else {
            toast.error("Error creating account. Try again.")
        }
    }

    return (
        <div className="sign-up-container my-4">
            <ToastContainer />
            {error && <p className="text-danger text-center">{error}</p>}
            <div className="sign-up-form">
                <h1 className="text-center" style={{ color: "white"}}>Sign Up</h1>
                <form onSubmit={handleEmailSignUp} className="mx-auto" style={{ maxWidth: "400px"}}>
                    <div className="mb-3 sign-up-inputs">
                        <label className="email-form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3 sign-up-inputs">
                        <label className="password-form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-success w-100 mb-2">Sign Up</button>
                    <button type="button" className="btn btn-danger w-100" onClick={signInWithGoogle}>
                        <i class="bi bi-google"></i> Sign Up
                    </button>
                </form>
                <div className="sign-in-link-container">
                    <p className="text-center mt-3">
                        <a href="/signin" className="sign-in-link">Already have an account?</a> 
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUpPage;