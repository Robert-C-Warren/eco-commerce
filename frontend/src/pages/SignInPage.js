import React, { useState } from "react";
import { auth, signInWithGoogle, signInWithEmail } from "../firebaseConfig"
import { unstable_HistoryRouter, useNavigate } from "react-router-dom";

const SignInPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const navigate = useNavigate()

    const handleEmailSignIn = async (e) => {
        e.preventDefault();
        const user = await signInWithEmail(email, password)
        if (user) {
            navigate("/")
        } else {
            setError("Invalid email or password.")
        }
    }

    return (
        <div className="container my-4">
            <h1 className="text-center">Sign In</h1>
            {error && <p className="text-danger text-center">{error}</p>}
            <form onSubmit={handleEmailSignIn} className="mx-auto" style={{ maxWidth: "400px"}}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100 mb-2">Sign In</button>
                <button type="button" className="btn btn-danger w-100" onClick={signInWithGoogle}>
                    <i class="bi bi-google"></i> Sign In
                </button>
            </form>
            <p className="text-center mt-3">
                Don't have an account? <a href="/signup">Sign Up</a>
            </p>
        </div>
    )
}

export default SignInPage;