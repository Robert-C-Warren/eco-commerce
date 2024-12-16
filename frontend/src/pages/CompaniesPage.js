import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./ProductList.css"
import DarkModeToggle from "./DarkModeToggle";

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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;