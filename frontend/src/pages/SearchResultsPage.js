import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import API from "../services/api";
import Navbar from "./Navbar";
import bCorpIcon from "../resources/icons/bcorp.png";
import smallBusinessIcon from "../resources/icons/handshake.png";
import veganIcon from "../resources/icons/vegan.png";
import biodegradableIcon from "../resources/icons/leaf.png";
import fairTradeIcon from "../resources/icons/trade.png";
import recycled from "../resources/icons/recycle.svg";
import "./ProductList.css"
import "./CompaniesPage.css"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const availableIcons = [
    { id: "b_corp", label: "B Corp", src: bCorpIcon, title: "Certified B Corporation" },
    { id: "small_business", label: "Small Business", src: smallBusinessIcon, title: "Small Business" },
    { id: "vegan", label: "Vegan", src: veganIcon, title: "Vegan" },
    { id: "biodegradable", label: "Biodegradable", src: biodegradableIcon, title: "Biodegradable" },
    { id: "fair_trade", label: "Fair-Trade", src: fairTradeIcon, title: "Fair-Trade Certified" },
    { id: "recycled_materials", label: "Recycled-Materials", src: recycled, title: "Made from Recycled Materials" },
];

const SearchResultsPage = () => {
    const [products, setProducts] = useState([]);
    const [expandedCompany, setExpandedCompany] = useState(null)
    const [companies, setCompanies] = useState([])
    const [error, setError] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const fetchSearchResults = async () => {
            const query = new URLSearchParams(location.search).get("q");

            try {
                const productResponse = await API.get("/products/search", {
                    params: { q: query },
                });
                setProducts(productResponse.data)

                const companyResponse = await API.get("/companies/search", {
                    params: { q: query },
                })
                setCompanies(companyResponse.data)
            } catch (error) {
                console.error("Error fetching search results", error);
                setError("An error occurred while fetching search results")
            }
        };

        fetchSearchResults();
    }, [location.search]);

    const groupedCompanies = companies.reduce((acc, company) => {
        const category = company.category || "Uncategorized";
        if (!acc[category]) acc[category] = [];
        acc[category].push(company);
        return acc;
      }, {});  
    
    const toggleExpand = (id) => {
      setExpandedCompany((prev) => (prev === id ? null : id))
    }

    return (
        <div>
            <Navbar />
            <div className="continer my-4">
                <h1 className="text-center mb-4">Search Results</h1>
                <h2>Products</h2>
                <div className="row">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div
                                key={product._id} // Use `_id` instead of `id`
                                className="product-card card text-center mb-3"
                            >
                                <div className="card-header column">
                                    <img
                                        src={product.image}
                                        alt={product.title || "Product Image"}
                                        style={{ height: "200px", objectFit: "cover" }}
                                    />
                                    <h6 className="product-title card-title mb-0">
                                        {product.summary || "No Summary Available"}
                                    </h6>
                                </div>
                                <div className="card-body">
                                    <p className="card-text">
                                        <strong>Price:</strong> {product.price}
                                    </p>
                                    <p className="card-text">
                                        <strong>Category:</strong>{" "}
                                        {product.category?.join(", ") || "Uncategorized"}
                                    </p>
                                    <div className="d-flex flex-column align-items-center">
                                        <a
                                            className="source-link link-offset-1 link-secondary"
                                            href={product.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {product.source || "No Source"}
                                        </a>
                                        <a
                                            href={product.url}
                                            role="button"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-dark text-white mt-3 btn-view-product"
                                        >
                                            View Product
                                        </a>
                                    </div>
                                    <div className="product-icons d-flex justify-content-center align-items-center gap-2 mt-2">
                                        {product.icons?.map((iconId) => {
                                            const icon = availableIcons.find((i) => i.id === iconId);
                                            return icon ? (
                                                <img
                                                    className="icon_actual"
                                                    key={icon.id}
                                                    src={icon.src}
                                                    alt={icon.label}
                                                    data-bs-toggle="tooltip"
                                                    data-bs-title={icon.label}
                                                />
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center my-4">
                            No products available for the selected category.
                        </p>
                    )}
                </div>

                <h2>Companies</h2>
                <div className="row">
                    {Object.keys(groupedCompanies).map((category) => (
                        <div>
                            <div className="row">
                                {groupedCompanies[category].map((company, index) => (
                                    <div key={index} className={`col-lg-4 col-md-6 col-sm-12 ${expandedCompany === company._id ? "position-relative" : ""}`}>
                                        <div className={`card company-card ${expandedCompany === company._id ? "expanded" : "collapsed"}`}>
                                            <div className="card-header align-items-center" onClick={() => toggleExpand(company._id)} style={{ cursor: "pointer" }}>
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
                                                            <li className="qualifications" key={i}>{qualification}</li>
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
                                                    <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                                        <button className="collapse-button btn btn-outline-secondary" onClick={() => toggleExpand(company._id)} style={{ cursor: "pointer" }}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-in-up" viewBox="0 0 16 16">
                                                                <path fillRule="evenodd" d="M3.5 10a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 0 0 1h2A1.5 1.5 0 0 0 14 9.5v-8A1.5 1.5 0 0 0 12.5 0h-9A1.5 1.5 0 0 0 2 1.5v8A1.5 1.5 0 0 0 3.5 11h2a.5.5 0 0 0 0-1z" />
                                                                <path fillRule="evenodd" d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708z" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchResultsPage;