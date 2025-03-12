import React, { useState } from "react"
import API from "../services/api"
import { Helmet } from "react-helmet"
import "./styles/ContactPage.scss"

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Submitting...")

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name)
    formDataToSend.append("email", formData.email)
    formDataToSend.append("message", formData.message)
    if (file) {
      formDataToSend.append("file", file)
    }

    try {
      const response = await API.post("/contact", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      setStatus("Message Sent Successfully!")
      setFormData({ name: "", email: "", message: "" })
      setFile(null)
    } catch (error) {
      console.error("Error sending message:", error)
      setStatus("Failed to send message. Please try again")
    }
  }

  return (
    <div className="parent">
      <Helmet>
        <title>EcoCommerce | About</title>
        <meta name="description" content="Find eco-friendly companies and sustainable products for responsible shopping" />
        <meta name="keywords" content="EcoCommerce, sustainable, eco-friendly, responsible shopping, ethical brands, 
            b-corp products, best eco-friendly clothing companies, best eco-friendly jewelry companies, best eco-friendly food companies,
            ethical sourcing, ethical brands, ethical clothing" />
      </Helmet>
      <div className="contact-form my-4">
        <h1 className="text-center mb-4">Contact Us</h1>
        <h4 className="text-center mb-4">If you have any questions, suggestions, or company recommendations for our site, feel free to contact us. We welcome feedback and will respond as soon as possible.

          If you represent a company listed on our site and wish to be removed, submit a request, and we will process the removal promptly upon receiving your submission.</h4>
        <form onSubmit={handleSubmit} className="mx-auto form-details" style={{ maxWidth: "600px" }}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label"></label>
            <input type="text" className="form-control name-box" id="name" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label"></label>
            <input type="email" className="form-control email-box" id="email" name="email" placeholder="email@example.com" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="message" className="form-label"></label>
            <textarea className="form-control message-box" id="message" name="message" rows="4" placeholder="Send us a message!" value={formData.message} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label htmlFor="file" className="form-label"></label>
            <input type="file" className="form-control" onChange={handleFileChange} />
          </div>
          <button type="submit" className="btn btn-primary contact-button"><i class="bi bi-envelope-arrow-up"></i></button>
          <p>{status}</p>
        </form>
      </div>
    </div>
  )
}

export default ContactPage;