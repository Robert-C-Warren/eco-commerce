import React, { useState } from "react"
import API from "../services/api"

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: ""})
  const [status, setStatus] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...")
    try {
      const response = await API.post("/contact", formData)
      setStatus("Message sent successfully!")
      setFormData({ name: "", email: "", message: "" })
    } catch (error) {
      console.error("Error sending message:", error)
      setStatus("Failed to send message. Please try again.")
    }
  }

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Contact Us</h1>
      <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: "600px"}}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="form-label">Message</label>
          <textarea className="form-control" id="message" name="message" rows="4" value={formData.message} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}

export default ContactPage;