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
];

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);

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

  return (
    <div>
      <Navbar />
      <div className="container my-4">
        <h1 className="text-center mb-4">Recommended Companies</h1>
        <div className="row">
          {companies.map((company, index) => (
            <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-4">
              <div className="card company-card h-100">
                <img
                  src={company.logo}
                  className="card-img-top"
                  alt={`${company.name} logo`}
                  style={{ objectFit: "contain", height: "150px", width: "100%"}}
                />
                <div className="card-body">
                  <h5 className="card-title">{company.name}</h5>
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
                </div>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;