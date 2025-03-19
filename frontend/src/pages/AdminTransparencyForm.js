import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../components/urls";
import { ToastContainer, toast } from "react-toastify"
import "./styles/AdminTransparencyForm.scss"
import { Helmet } from 'react-helmet';

const AdminTransparencyForm = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [formData, setFormData] = useState({
    company_id: "",
    company_name: "",
    sustainability: "",
    ethical_sourcing: "",
    materials: "",
    carbon_energy: "",
    transparency: "",
    links: {
      sustainability: "",
      ethical_sourcing: "",
      materials: "",
      carbon_energy: "",
      transparency: "",
    },
  });

  const [message, setMessage] = useState("");
  const placeholders = {
    sustainability: "0-35",
    ethical_sourcing: "0-25",
    materials: "0-20",
    carbon_energy: "0-10",
    transparency: "0-10",
  }
  // Fetch companies on load
  useEffect(() => {
    axios.get(`${API_BASE_URL}/companies`)
      .then((res) => {
        setCompanies(res.data);
      })
      .catch((err) => {
        console.error("Error fetching companies:", err);
        setMessage("Error loading companies. Please try again.");
      });
  }, []);

  // Handle company selection
  const handleCompanySelect = (e) => {
    const selectedId = e.target.value;

    if (!selectedId) {
        setSelectedCompany(null);
        return;
    }

    setSelectedCompany(selectedId);

    const sessionToken = sessionStorage.getItem("sessionToken");

    if (!sessionToken) {
        toast.error("MFA required. Please log in again.", { autoClose: 2000 });
        return;
    }

    axios.get(`${API_BASE_URL}/admin/index/${selectedId}`, {
        headers: { Authorization: `Bearer ${sessionToken}` }  // ✅ Include MFA token
    })
    .then((res) => {
        setFormData(res.data);
    })
    .catch((err) => {
        console.error("❌ Error fetching company index data:", err);
        
        setFormData({
            company_id: selectedId,
            company_name: companies.find(c => c.id === selectedId)?.name || "",
            sustainability: 0,
            ethical_sourcing: 0,
            materials: 0,
            carbon_energy: 0,
            transparency: 0,
            links: {
                sustainability: "",
                ethical_sourcing: "",
                materials: "",
                carbon_energy: "",
                transparency: "",
            },
        });

        toast.error("Failed to fetch company data. Please try again.", { autoClose: 2000 });
    });
  };

  // Handle input changes (scores)
  const handleScoreChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? "" : Number(value), // Converts input to number but allows empty state
    }));
  };

  // Handle input changes (links)
  const handleLinkChange = (e) => {
    setFormData({
      ...formData,
      links: {
        ...formData.links,
        [e.target.name]: e.target.value,
      },
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.company_id) {
        setMessage("Please select a company.");
        return;
    }

    const sessionToken = sessionStorage.getItem("sessionToken"); // ✅ Use sessionStorage

    if (!sessionToken) {
        toast.error("MFA required. Please log in again.", { autoClose: 2000 });
        console.error("🚨 No MFA token found in sessionStorage.");
        return;
    }

    console.log("🔍 Sending request with Session Token:", sessionToken);

    try {
        const response = await axios.post(`${API_BASE_URL}/admin/index`, formData, {
            headers: { Authorization: `Bearer ${sessionToken}` }  // ✅ Include MFA token
        });

        toast.success(`✅ Saved! Score: ${response?.data?.score}, Badge: ${response?.data?.badge}`, { autoClose: 2000 });
    } catch (error) {
        console.error("❌ Error saving transparency data:", error.response?.data || error);
        setMessage("Failed to save transparency data.");
        toast.error("Failed to save transparency data. Please try again.", { autoClose: 2000 });
    }
};



  return (
    <div className="container-fluid">
      <Helmet>
        <title>EcoCommerce | Transparency Index</title>
      </Helmet>
      <ToastContainer />
      <h2 className="page-title-label">Admin - Transparency Index</h2>

      {/* {message && <div className="alert alert-info">{message}</div>} */}

      {/* Company Dropdown */}
      <div className="dropdown-container">
        <label className="form-label page-title-label">Select Company</label>
        <select
          className="form-select dropdown"
          value={selectedCompany || ""}
          onChange={handleCompanySelect}
        >
          <option value="">-- Select a company --</option>
          {companies.map((company) => (
            <option key={company._id} value={company._id}>
              {company.name}
            </option>
          ))}
        </select>
      </div>

      {/* Score Inputs */}
      {["sustainability", "ethical_sourcing", "materials", "carbon_energy", "transparency"].map((category) => (
        <div key={category} className="form-container-transp">
          <label className="form-label score-label">
            {category.replace("_", " ").toUpperCase()} Score
          </label>
          <input
            type="number"
            placeholder={placeholders[category]}
            className="form-control score-input"
            name={category}
            value={formData?.[category] || ""}
            onChange={handleScoreChange}
            required
            inputMode="numeric"
            style={{ appearance: 'textfield' }}
          />
          <input
            type="url"
            className="form-control mt-2 score-input"
            placeholder="Source link"
            name={category}
            value={formData.links[category]}
            onChange={handleLinkChange}
            required
          />
        </div>
      ))}

      {/* Submit Button */}
      <button type="submit" className="btn btn-primary calculate-btn" onClick={handleSubmit}>
        Calculate & Save
      </button>
    </div>
  );
};

export default AdminTransparencyForm;
