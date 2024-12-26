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
import crueltyFree from "../resources/icons/crueltyfreelogo.svg"
import ECOLOGO from "../resources/icons/ecologologo.png"
import fscLogo from "../resources/icons/fsclogo.svg"
import rainforestAlliance from "../resources/icons/rainforestalliancelogo.png"
import ewg from "../resources/icons/ewglogo.svg"
import nongmo from "../resources/icons/nongmologo.jpeg"
import greenAmerica from "../resources/icons/greenamericalogo.png"
import safecosmetics from "../resources/icons/safecosmeticslogo.png"
import reefsafe from "../resources/icons/reefsafelogo.png"
import leed from "../resources/icons/leedlogo.png"
import energystar from "../resources/icons/energystarlogo.svg"
import cradletocradle from "../resources/icons/cradletocradle.png"
import MSC from "../resources/icons/msclogo.png"
import BAP from "../resources/icons/baplogo.svg"
import GRS from "../resources/icons/grslogo.svg"
import WFTO from "../resources/icons/wftologo.svg"
import LWG from "../resources/icons/lwglogo.png"
import FLA from "../resources/icons/flalogo.jpeg"
import SCA from "../resources/icons/scalogo.png"


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
    { id: "cruelty_free_logo", label: "Cruelty Free", src: crueltyFree, title: "Cruelty Free" },
    { id: "ECOLOGO_logo", label: "ECOLOGO", src: ECOLOGO, title: "ECOLOGO" },
    { id: "fsc_logo", label: "FSC (Forest Stewardship Council) Certified", src: fscLogo, title: "fsc" },
    { id: "rainforest_alliance_logo", label: "Rainforest Alliance Certified", src: rainforestAlliance, title: "Rainforest Alliance" },
    { id: "ewg_logo", label: "EWG (Environmental Working Group) Verified", src: ewg, title: "EWG" },
    { id: "nongmo_logo", label: "Non-GMO Project Certified", src: nongmo, title: "nongmo" },
    { id: "greenamerica_logo", label: "Green America Certified", src: greenAmerica, title: "Green America" },
    { id: "safe_cosmetics_logo", label: "Safe Cosmetics Certified", src: safecosmetics, title: "Safe Cosmetics" },
    { id: "reef_safe_logo", label: "Reef-Safe Certified", src: reefsafe, title: "Reef Safe" },
    { id: "leed_logo", label: "LEED Certified", src: leed, title: "LEED Certified" },
    { id: "energy_star_logo", label: "Energy Star Certified", src: energystar, title: "Energy Star Certified" },
    { id: "cradle_to_cradle_logo", label: "Cradle To Cradle Certified", src: cradletocradle, title: "Cradle to Cradle Certified" },
    { id: "msc_logo", label: "MSC (Marine Stewardship Council) Certified", src: MSC, title: "MSC" },
    { id: "bap_logo", label: "BAP (Best Aquaculture Practices) Certified", src: BAP, title: "BAP" },
    { id: "grs_logo", label: "GRS (Global Recycling Standard) Certified", src: GRS, title: "GRS" },
    { id: "wfto_logo", label: "WFTO (World Fair Trade Organization) Guaranteed", src: WFTO, title: "WFTO" },
    { id: "lwg_logo", label: "LWG (Leather Working Group) Gold Certification", src: LWG, title: "LWG" },
    { id: "fla_logo", label: "FLA (Fair Labor Association) Accredidation", src: FLA, title: "FLA" },
    { id: "sca_logo", label: "SCA (Specialty Coffee Association) Standards", src: SCA, title: "SCA" },
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
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Company Name
          </label>
          <input
            type="text"
            id="name"
            className="form-control"
            placeholder="Enter Company Name"
            value={newCompany.name}
            onChange={(e) =>
              setNewCompany({ ...newCompany, name: e.target.value})
            }
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Company Description
          </label>
          <textarea
            id="description"
            className="form-control"
            placeholder="Enter Company Description"
            value={newCompany.description}
            onChange={(e) =>
              setNewCompany({ ...newCompany, description: e.target.value })
            }
            required
            ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="qualifications" className="form-label">
            Qualifications
          </label>
          <input
            type="text"
            id="qualifications"
            className="form-control"
            placeholder="Enter qualifications (CSV)"
            value={newCompany.qualifications}
            onChange={(e) =>
              setNewCompany({
                ...newCompany, qualifications: e.target.value
              })
            }
          />
        </div>
        <div className="mb-3">
          <label htmlFor="logo" className="form-label">
            Logo URL
          </label>
          <input
            type="text"
            id="logo"
            className="form-control"
            placeholder="Enter logo URL"
            value={newCompany.logo}
            onChange={(e) =>
              setNewCompany({
                ...newCompany, logo: e.target.value
              })
            }
          />
        </div>
        <div className="mb-3">
          <label htmlFor="website" className="form-label">
            Website URL
          </label>
          <input
            type="text"
            id="website"
            className="form-control"
            placeholder="Enter website URL"
            value={newCompany.website}
            onChange={(e) =>
              setNewCompany({
                ...newCompany, website: e.target.value
              })
            }
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Certifications</label>
          <div className="row">
            {availableIcons.map((icon) => (
              <div key={icon.id} className="col-6 col-md-4">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id={`newCompany-${icon.id}`}
                    onChange={(e) => {
                      setNewCompany((prevState) => ({
                        ...prevState,
                        certifications: e.target.checked
                          ? [...(prevState.icons || []), icon.id]
                          : prevState.icons.filter((id) => id !== icon.id),
                      }))
                    }}
                  />
                  <label 
                    htmlFor={`newCompany-${icon.id}`}
                    className="form-check-label"
                  >
                    <img
                      src={icon.src}
                      alt={icon.label}
                      style={{ width: "30px", marginRight: "5px" }}
                    />
                    {icon.label}
                  </label>
                </div>
              </div>
            ))}
                <div>
                  <button 
                    className="btn btn-secondary" 
                    onClick={() => saveIcons(newCompany._id)}>
                    Save Icons
                  </button>
                </div>
          </div>
        </div>
        <button type="submit" className="btn btn-success">
          Add Company
        </button>
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
              <div className="company-details card-content">
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
                <div className="product-icons d-flex justify-content-center align-items-center gap-2 mt-2">
                      {company.icons?.map((iconId) => {
                        const icon = availableIcons.find((i) => i.id === iconId);
                        return icon ? (
                          <img
                            className="icon_actual"
                            key={icon.id}
                            src={icon.src}
                            alt={icon.label}
                            data-bs-toggle="tooltip"
                            data-bs-placement="bottom"
                            data-bs-title={icon.label}
                          />
                        ) : null;
                      })}
                    </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCompaniesPage;
