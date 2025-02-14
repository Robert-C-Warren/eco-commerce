import React, { useState, useEffect } from "react";
import API_BASE_URL from "../components/urls";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify"
import "./AdminReportManager.css"

const AdminReportManager = () => {
    const [companies, setCompanies] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCompany, setSelectedCompany] = useState(null)
    const [formData, setFormData] = useState({
        filing_date: "",
        report_name: "",
        report_details: "",
        climate_impact: "",
        sourcing_details: "",
        report_links: [],
    })
    const [newLink, setNewLink] = useState("")

    // Fetch companies when searching
    useEffect(() => {
        if (searchQuery.length > 2) {
            axios
                .get(`${API_BASE_URL}/companies/search`, {
                    params: { q: searchQuery.trim() }, // ✅ Use correct search API
                    headers: { "Content-Type": "application/json" },
                })
                .then((response) => {
                    console.log("✅ Filtered Companies:", response.data); // Debugging
                    setCompanies(response.data);
                })
                .catch((error) => {
                    console.error("❌ Error fetching companies:", error);
                    toast.error(`Failed to fetch companies: ${error.response?.status || "Unknown Error"}`, {
                        autoClose: 2000,
                    });
                });
        }
    }, [searchQuery]);

    // Fetch report when selecting a company
    const fetchReport = (company) => {
        console.log(`Fetching report for company: ${company.name} (ID: ${company._id})`); // ✅ Debugging
    
        axios
            .get(`${API_BASE_URL}/reports/${company._id}`)
            .then((response) => {
                console.log("✅ Reports response:", response.data); // ✅ Debugging API response
    
                if (response.data.reports && response.data.reports.length > 0) {
                    setFormData({
                        report_name: response.data.reports[0].report_name || "",
                        report_details: response.data.reports[0].report_details || "",
                        climate_impact: response.data.reports[0].climate_impact || "",
                        sourcing_details: response.data.reports[0].sourcing_details || "",
                        report_links: response.data.reports[0].report_links || [],
                    });
                } else {
                    console.log("ℹ No reports found for this company. Opening form for new entry.");
                    setFormData({
                        report_name: "",
                        report_details: "",
                        climate_impact: "",
                        sourcing_details: "",
                        report_links: [],
                    });
                }
    
                setSelectedCompany(company); // ✅ Ensure the selected company is updated
                console.log("✅ Selected company set:", company); // ✅ Debugging
            })
            .catch((error) => {
                console.error("❌ Error fetching report:", error.response?.data || error);
                toast.error(`No reports found. You can add one now!`, { autoClose: 2000 });
    
                // ✅ Ensure form clears so the user can enter a new report
                setFormData({
                    report_name: "",
                    report_details: "",
                    climate_impact: "",
                    sourcing_details: "",
                    report_links: [],
                });
    
                setSelectedCompany(company); // ✅ Ensure company is still selected
                console.log("✅ Selected company set (no report found):", company); // ✅ Debugging
            });
    };    

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // Handle adding new report links
    const handleAddLink = () => {
        if (newLink.trim()) {
            setFormData({ ...formData, report_links: [...formData.report_links, newLink.trim()] })
            setNewLink("")
        }
    }

    // Handle removing a report link
    const handleRemoveLink = (index) => {
        const updatedLinks = [...formData.report_links]
        updatedLinks.splice(index, 1)
        setFormData({ ...formData, report_links: updatedLinks })
    }

    // Submit report data
    const handleSubmit = (e) => {
        e.preventDefault();
    
        // ✅ Ensure "report_name" is provided
        if (!formData.report_name.trim()) {
            toast.error("Report name is required!", { autoClose: 2000 });
            return;
        }
    
        axios
            .post(`${API_BASE_URL}/admin/reports/${selectedCompany._id}`, formData)
            .then((response) => {
                toast.success("Report added successfully!", { autoClose: 2000 });
    
                // ✅ Clear form after successful submission
                setFormData({
                    report_name: "",
                    report_details: "",
                    climate_impact: "",
                    sourcing_details: "",
                    report_links: [],
                });
    
            })
            .catch((error) => {
                console.error("❌ Error adding report:", error.response?.data || error);
                toast.error(`Failed to add report: ${error.response?.data?.error || "Unknown Error"}`, {
                    autoClose: 2000,
                });
            });
    };


    return (
        <div className="container-fluid">
            <ToastContainer />
            <h2>Admin: Manage Reports</h2>

            {/* Search Bar */}
            <input type="text" placeholder="Company Name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

            {/* Company List */}
            {companies.length > 0 && (
                <ul className="search-results-list">
                    {companies.map((company) => (
                        <li key={company._id} className="search-results" onClick={() => fetchReport(company)}>
                            {company.name}
                        </li>
                    ))}
                </ul>
            )}

            {/* Report Form */}
            {selectedCompany && (
                <form onSubmit={handleSubmit} className="report-form">
                    <h3>Editing Report for: {selectedCompany.name}</h3>

                    <label>Filing Date:</label>
                    <input type="date" name="filing_date" className="filing_date" value={formData.filing_date} onChange={handleChange} />

                    <label>Report Name:</label>
                    <input type="text" name="report_name" className="report_name" value={formData.report_name} onChange={handleChange} />

                    <label>Report Details:</label>
                    <input type="text" name="report_details" className="report_details" value={formData.report_details} onChange={handleChange} />

                    <label>Climate Impact:</label>
                    <textarea name="climate_impact" className="climate_impact" value={formData.climate_impact} onChange={handleChange} />
                    
                    <label>Sourcing Details:</label>
                    <textarea name="sourcing_details" className="sourcing_details" value={formData.sourcing_details} onChange={handleChange} />

                    <label>Report Links:</label>
                    <div>
                        {formData.report_links.map((link, index) => (
                            <div key={index}>
                                <span >{link}</span>
                                <button type="button" onClick={() => handleRemoveLink(index)}>Remove</button>
                            </div>
                        ))}
                    </div>

                    <input type="text" className="report-link" placeholder="Add new report link" value={newLink} onChange={(e) => setNewLink(e.target.value)} />
                    <button type="button" className="add-link-btn" onClick={handleAddLink}>Add Link</button>

                    <button type="submit" className="save-link-btn">Save Report</button>
                </form>
            )}
        </div>
    )
}

export default AdminReportManager