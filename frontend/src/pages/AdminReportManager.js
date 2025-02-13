import React, { useState, useEffect } from "react";

const AdminReportManager = () => {
    const [companies, setCompanies] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCompany, setSelectedCompany] = useState(null)
    const [formData, setFormData] = useState({
        filing_date: "",
        esg_data: "",
        climate_risk: "",
        report_links: [],
    })
    const [newLink, setNewLink] = useState("")

    // Fetch companies when searching
    useEffect(() => {
        if (searchQuery.length > 2) {
            fetch(`/admin/companies?q=${searchQuery}`)
                .then((res) => res.json())
                .then((data) => setCompanies(data))
                .catch((err) => console.error("Error fetching companies:", err))
        }
    }, [searchQuery])

    // Fetch report when selecting a company
    const fetchReport = (companyId) => {
        fetch(`/reports/${companyId}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                setFormData({
                    filing_date: "",
                    esg_data: "", 
                    climate_risk: "",
                    report_links: [],
                })
            } else {
                setFormData({
                    filing_date: data.filing_date || "",
                    esg_data: data.esg_data || "",
                    climate_risk: data.climate_risk || "",
                    report_links: data.report_links || [],
                })
            }
            setSelectedCompany({_id: companyId})
        })
        .catch((err) => console.error("Error fetching report:", err))
    }

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    // Handle adding new report links
    const handleAddLink = () => {
        if (newLink.trim()) {
            setFormData({ ...formData, report_links: [...formData.report_links, newLink.trim()]})
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
        e.preventDefault()

        fetch(`/admin/reports/${selectedCompany._id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })
        .then((res) => res.json())
        .then((data) => alert(data.message || "Report saved successfully"))
        .catch((err) => console.error("Error saving report:", err))
    }

    return (
        <div>
            <h2>Admin: Manage Reports</h2>

            {/* Search Bar */}
            <input type="text" placeholder="Company Name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

            {/* Company List */}
            {companies.length > 0 && (
                <ul>
                    {companies.map((company) => (
                        <li key={company._id} onClick={() => fetchReport(company._id)}>{company.name}</li>
                    ))}
                </ul>
            )}

            {/* Report Form */}
            {selectedCompany && (
                <form onSubmit={handleSubmit}>
                    <h3>Editing Report for: {selectedCompany.name}</h3>

                    <label>Filing Date:</label>
                    <input type="date" name="filing_date" value={formData.filing_date} onChange={handleChange} />

                    <label>ESG Data:</label>
                    <textarea name="esg_data" value={formData.esg_data} onChange={handleChange} />

                    <label>Climate Risk Assesment:</label>
                    <textarea name="climate_risk" value={formData.climate_risk} onChange={handleChange} />

                    <label>Report Links:</label>
                    <div>
                        {formData.report_links.map((link, index) => {
                            <div key={index}>
                                <span>{link}</span>
                                <button type="button" onClick={() => handleRemoveLink(index)}>Remove</button>
                            </div>
                        })}
                    </div>

                    <input type="text" placeholder="Add new report link" value={newLink} onChange={(e) => setNewLink(e.target.value)} />
                    <button type="button" onClick={handleAddLink}>Add Link</button>

                    <button type="submit">Save Report</button>
                </form>
            )}
        </div>
    )
}

export default AdminReportManager