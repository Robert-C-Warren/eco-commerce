import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import bCorpIcon from "../resources/icons/bcorp.png"
import smallBusinessIcon from "../resources/icons/handshake.png"
import veganIcon from "../resources/icons/vegan.png"
import biodegradableIcon from "../resources/icons/leaf.png"
import fairTradeIcon from "../resources/icons/trade.png"
import recycled from "../resources/icons/recycle.svg"
import fla from "../resources/icons/flalogo.png";
import cascale from "../resources/icons/cascalelogo.png";
import oneForThePlanet from "../resources/icons/1fortheplanet.png"
import sai from "../resources/icons/sailogo.png"


const availableIcons = [
    { id: "b_corp", label: "B Corp", src: bCorpIcon, title: "Certified B Corporation"},
    { id: "small_business", label: "Small Business", src: smallBusinessIcon, title: "Small Business"},
    { id: "vegan", label: "Vegan", src: veganIcon, title: "Vegan"},
    { id: "biodegradable", label: "Biodegradable", src: biodegradableIcon, title: "Biodegradable"},
    { id: "fair_trade", label: "Fair-Trade", src: fairTradeIcon, title: "Fair-Trade Certified"},
    { id: "recycled_materials", label: "Recycled-Materials", src: recycled, title: "Made from Recycled Materials"},
    { id: "fla_association", label: "Fair Labor Association", src: fla, title: "Fair Labor Association Member" },
    { id: "cascale", label: "Cascale", src: cascale, title: "Cascale" },
    { id: "1_for_the_planet", label: "1% For The Planet", src: oneForThePlanet, title: "1% For The Planet" },
    { id: "social_accountability_international", label: "Social Accountability International (SAI)", src: sai, title: "Social Accountability International (SAI)" },
]

const AdminCompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [newCompany, setNewCompany] = useState({
    name: "",
    description: "",
    qualifications: "",
    logo: "",
    website: ""
  });
  const [selectedIcons, setSelectedIcons] = useState({})

  const fetchCompanies = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/companies");
      const data = await response.json();
      console.log("Fetched Companies:", data)
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies", error)
    }
  };

  const toggleIcon = (companyId, iconId) => {
    setSelectedIcons((prev) => ({
        ...prev,
        [companyId]: prev[companyId]?.includes(iconId)
        ? prev[companyId].filter((id) => id !== iconId)
        : [...(prev[companyId] || []), iconId],
    }));
  };

  const saveIcons = async(companyId) => {
    if(!companyId) {
      console.error("Company ID is undefined")
      return;
    }

    const icons = selectedIcons[companyId] || [];
    if (!icons.length) {
      console.error("icons array is empty")
      alert("Please select at least one icon")
      return
    }

    try {
      console.log("Sending request:", { icons })
      await API.patch(`/admin/companies/${companyId}/icons`, { icons })
      fetchCompanies()
    } catch (error) {
      console.error("Error saving icons:", error)
      alert("Failed to update icons.")
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const addCompany = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCompany),
      });
      if(response.ok) {
        alert("Company added successfully");
        fetchCompanies();
        setNewCompany({
          name: "",
          description: "",
          qualifications: "",
          logo: "",
          website: "",
        });
      }
    } catch (error) {
      console.error("Error adding company:", error);
    }
  };

  const editCompany = async (companyId, updatedCompany) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/companies/${companyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCompany),
      });
      if (response.ok) {
        alert("Company updated successfully");
        fetchCompanies();
      }
    } catch (error) {
      console.error("Error updating company", error);
    }
  };

  const deleteCompany = async (companyId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/companies/${companyId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        alert("Company deleted successfully");
        fetchCompanies();
      }
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Admin: Manage Companies</h1>
        <div className="d-flex justify-content-end mb-3">
          <Link to="/admin/products" className="btn btn-secondary">
            Admin Products
          </Link>
        </div>

      <div className="mb-4">
        <h3>Add New Company</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addCompany();
          }}
        >
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Company Name"
            value={newCompany.name}
            onChange={(e) =>
              setNewCompany({ ...newCompany, name: e.target.value })
            }
          />
          <textarea
            className="form-control mb-2"
            placeholder="Company Description"
            value={newCompany.description}
            onChange={(e) =>
              setNewCompany({
                ...newCompany,
                description: e.target.value,
              })
            }
          ></textarea>  
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Qualifications (comma separated)"
            value={newCompany.qualifications}
            onChange={(e) =>
              setNewCompany({
                ...newCompany,
                qualifications: e.target.value,
              })
            }
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Logo URL"
            value={newCompany.logo}
            onChange={(e) => 
              setNewCompany({ ...newCompany, logo: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Website URL"
            value={newCompany.website}
            onChange={(e) =>
              setNewCompany({ ...newCompany, website: e.target.value})
            }
          />
          <button type="submit" className="btn btn-success">
            Add Company
          </button>
        </form>
      </div>

      <h3>Existing Companies</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Qualifications</th>
            <th>Image Link</th>
            <th>Website Link</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company._id}>
              <td>{company.name}</td>
              <td>{company.description}</td>
              <td>{company.qualifications.join(", ")}</td>
              <td>{company.website}</td>
              <td>
                {availableIcons.map((icon) => (
                <div key={icon.id} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`${company._id}-${icon.id}`}
                    checked={selectedIcons[company.id]?.includes(icon.id)}
                    onChange={() => toggleIcon(company._id, icon.id)}
                  />
                  <label
                    className="form-check-label"
                    htmlFor={`${company._id}-${icon.id}`}
                  >
                    <img
                      src={icon.src}
                      alt={icon.label}
                      style={{ width: "30px", marginRight: "5px" }}
                    />
                    {icon.label}
                  </label>
                </div>
                ))}
                <button 
                  className="btn btn-primary mt-2"
                  onClick={() => saveIcons(company._id)}
                >
                  Save Icons
                </button>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() =>
                    editCompany(company._id, {
                      ...company,
                      name: prompt(
                        "Enter new name",
                        company.name
                      ) || company.name,
                      description: prompt(
                        "Enter new description",
                        company.description
                      ) || company.description,
                      qualifications: prompt(
                        "Enter qualifications",
                        company.qualifications
                      ) || company.qualifications
                    })
                  }
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteCompany(company._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCompaniesPage;