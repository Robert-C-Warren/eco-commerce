import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./AdminCompaniesPage.css"
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
import changeclimate from "../resources/icons/changeclimatelogo.png"
import RAINN from "../resources/icons/RAINNlogo.png"
import oneTreePlanted from "../resources/icons/onetreeplantedlogo.svg"
import ecovadis from "../resources/icons/ecovadislogo.svg"
import peruvianHearts from "../resources/icons/peruvianheartslogo.png"
import seaLegacy from "../resources/icons/sealegacy.svg"
import GOTS from "../resources/icons/gotslogo.png"
import bluesign from "../resources/icons/bluesignlogo.svg"
import jettyrockfoundation from "../resources/icons/jettyrockfoundationlogo.png"
import epagreenpower from "../resources/icons/epagreenpowerlogo.svg"
import asbc from "../resources/icons/asbclogo.svg"

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
    { id: "change_climate", label: "Change Climate", src: changeclimate, title: "Change Climate" },
    { id: "RAINN_logo", label: "RAINN (Rape, Abuse & Incest National Network)", src: RAINN, title: "RAINN" },
    { id: "One_Tree_Planted_Logo", label: "One Tree Planted", src: oneTreePlanted, title: "One Tree Planted" },
    { id: "EcoVadis_logo", label: "EcoVadis", src: ecovadis, title: "EcoVadis" },
    { id: "Peruvian_Hearts_logo", label: "Peruvian Hearts", src: peruvianHearts, title: "Peruvian Hearts" },
    { id: "SeaLegacy_logo", label: "SeaLegacy", src: seaLegacy, title: "SeaLegacy" },
    { id: "GOTS_logo", label: "GOTS (Global Organic Textile Standard)", src: GOTS, title: "GOTS" },
    { id: "bluesign_logo", label: "bluesign", src: bluesign, title: "bluesign" },
    { id: "jetty_rock_foundation_logo", label: "Jetty Rock Foundation", src: jettyrockfoundation, title: "Jetty Rock Foundation" },
    { id: "epa_green_power_logo", label: "EPA Green Power Partner", src: epagreenpower, title: "EPA Green Power Partner" },
    { id: "asbc_logo", label: "ASBC (American Sustainable Business Council)", src: asbc, title: "ASBC" },
]

const AdminCompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [newCompany, setNewCompany] = useState({
    name: "",
    description: "",
    qualifications: "",
    logo: "",
    website: "",
  });
  const [selectedIcons, setSelectedIcons] = useState({});
  const [expandedCompany, setExpandedCompany] = useState(null);

  const fetchCompanies = async () => {
    try {
      const response = await API.get("/companies");
      setCompanies(response.data);
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const toggleExpand = (id) => {
    setExpandedCompany((prev) => (prev === id ? null : id));
  };

  const toggleIcon = (companyId, iconId) => {
    setSelectedIcons((prev) => ({
      ...prev,
      [companyId]: prev[companyId]?.includes(iconId)
        ? prev[companyId].filter((id) => id !== iconId)
        : [...(prev[companyId] || []), iconId],
    }));
  };

  const saveIcons = async (companyId) => {
    if (!companyId) {
      console.error("Company ID is undefined");
      return;
    }

    const icons = selectedIcons[companyId] || [];
    if (!icons.length) {
      alert("Please select at least one icon");
      return;
    }

    try {
      await API.patch(`/admin/companies/${companyId}/icons`, { icons });
      fetchCompanies();
    } catch (error) {
      console.error("Error saving icons:", error);
      alert("Failed to update icons.");
    }
  };

  const addCompany = async () => {
    try {
      const response = await API.post("/companies", newCompany);
      if (response.status === 201) {
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
      const response = await API.put(`/companies/${companyId}`, updatedCompany);
      if (response.status === 200) {
        alert("Company updated successfully");
        fetchCompanies();
      }
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };

  const deleteCompany = async (companyId) => {
    try {
      const response = await API.delete(`/companies/${companyId}`);
      if (response.status === 200) {
        alert("Company deleted successfully");
        fetchCompanies();
      }
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Admin: Manage Companies</h1>
      <div className="d-flex justify-content-end mb-3">
        <Link to="/admin/products" className="btn btn-secondary">
          Admin Products
        </Link>
      </div>

      <h3>Add New Company</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addCompany();
        }}
      >
        {/* Form Fields */}
      </form>

      <h3>Existing Companies</h3>
      <div className="company-list">
        {companies.map((company) => (
          <div
            key={company._id}
            className={`company-card ${
              expandedCompany === company._id ? "expanded" : "collapsed"
            }`}
          >
            <div className="company-header" onClick={() => toggleExpand(company._id)}>
              {company.name}
            </div>
            {expandedCompany === company._id && (
              <div className="company-details">
                <p>
                  <strong>Description:</strong> {company.description}
                </p>
                <p>
                  <strong>Qualifications:</strong> {company.qualifications.join(", ")}
                </p>
                <a href={company.website} target="_blank" rel="noopener noreferrer">
                  Visit Website
                </a>
                <div className="icon-selector">
                  {availableIcons.map((icon) => (
                    <div key={icon.id} className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`${company._id}-${icon.id}`}
                        checked={selectedIcons[company._id]?.includes(icon.id)}
                        onChange={() => toggleIcon(company._id, icon.id)}
                      />
                      <label htmlFor={`${company._id}-${icon.id}`}>
                        <img
                          src={icon.src}
                          alt={icon.label}
                          style={{ width: "30px", marginRight: "5px" }}
                        />
                        {icon.label}
                      </label>
                    </div>
                  ))}
                </div>
                <button className="btn btn-primary mt-2" onClick={() => saveIcons(company._id)}>
                  Save Icons
                </button>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() =>
                    editCompany(company._id, {
                      ...company,
                      name: prompt("Enter new name", company.name) || company.name,
                      description:
                        prompt("Enter new description", company.description) ||
                        company.description,
                    })
                  }
                >
                  Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => deleteCompany(company._id)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCompaniesPage;
