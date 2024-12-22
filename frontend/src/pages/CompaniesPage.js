import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./ProductList.css"
import "./CompaniesPage.css"
import bCorpIcon from "../resources/icons/bcorp.png";
import smallBusinessIcon from "../resources/icons/handshake.png";
import veganIcon from "../resources/icons/vegan.png";
import biodegradableIcon from "../resources/icons/leaf.png";
import fairTradeIcon from "../resources/icons/trade.png";
import recycled from "../resources/icons/recycle.svg";
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

const availableIcons = [
  { id: "b_corp", label: "B Corp", src: bCorpIcon, title: "Certified B Corporation" },
  { id: "small_business", label: "Small Business", src: smallBusinessIcon, title: "Small Business" },
  { id: "vegan", label: "Vegan", src: veganIcon, title: "Vegan" },
  { id: "biodegradable", label: "Biodegradable", src: biodegradableIcon, title: "Biodegradable" },
  { id: "fair_trade", label: "Fair-Trade", src: fairTradeIcon, title: "Fair-Trade Certified" },
  { id: "recycled_materials", label: "Recycled-Materials", src: recycled, title: "Made from Recycled Materials" },
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
];

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [expandedCompany, setExpandedCompany] = useState(null)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/companies');
        const data = await response.json();
        setCompanies(data)
      } catch (error) {
        console.error("Error fetching companies", error);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerE1) => {
      new window.bootstrap.Tooltip(tooltipTriggerE1)
    })
  }, [companies])

  const toggleExpand = (id) => {
    setExpandedCompany((prev) => (prev === id ? null : id))
  }

  return (
    <div>
      <Navbar />
      <div className="container my-4">
        <h1 className="text-center mb-4">Recommended Companies</h1>
        <div className="row position-relative">
          {companies.map((company, index) => (
            <div key={index} className={`col-lg-4 col-md-6 col-sm-12 ${expandedCompany === company._id ? "position-relative" : ""}`}>
              <div className={`card company-card ${expandedCompany === company._id ? "expanded" : "collapsed"}`}>
                <div className="card-header align-items-center" onClick={() => toggleExpand(company._id)} style={{ cursor: "pointer"}}>
                  <img
                    src={company.logo}
                    className="card-img-top"
                    alt={`${company.name} logo`}
                    style={{ objectFit: "contain", height: "150px", width: "100%" }}
                  />
                  <h5 className="card-title m-0">{company.name}</h5>
                </div>
                {expandedCompany === company._id && (
                  <div className="card-body ">
                    <p className="card-text">{company.description}</p>
                    <ul>
                      {company.qualifications.map((qualification, i) => (
                        <li key={i}>{qualification}</li>
                      ))}
                    </ul>
                    <a
                      href={company.website}
                      className="btn btn-primary"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Visit Website
                    </a>

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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;