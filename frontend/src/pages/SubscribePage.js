import React, { useState } from "react";

const SubscriberPage = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch("http://localhost:5000/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email })
        });

        const result = await response.json();
        if (response.ok) {
            setMessage("Subscription successful! You'll receive product updates when we have them!")
        } else {
            setMessage(`Error: ${result.error}`);
        }
    };

    return (
      <div>      
        <div className="container mt-5">
            <h2>Subscribe to Our Product Updates</h2>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input 
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
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
                <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
            {message && <p className="mt-3">{message}</p>}
        </div>
      </div>
    )
}

export default SubscriberPage;