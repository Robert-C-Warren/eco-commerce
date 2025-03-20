import React, { useState } from "react";
import { auth, signUpWithEmail, signInWithGoogle } from "../firebaseConfig"
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

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
        <div className="container my-4">
            <h1 className="text-center">Sign Up</h1>
            {error && <p className="text-danger text-center">{error}</p>}
            <form onSubmit={handleEmailSignUp} className="mx-auto" style={{ maxWidth: "400px"}}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
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
            <p className="text-center mt-3">
                <a href="/signin">Already have an account?</a> 
            </p>
        </div>
    )
}

export default SignUpPage;