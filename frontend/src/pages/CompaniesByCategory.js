import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE_URL from "../components/urls";
import "./CompaniesPage.css"

const CompaniesByCategory = () => {
    const { categoryName } = useParams()
    const [companies, setCompanies] = useState([])
    const [loading, setLoading] = useState(true)
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
    const [expandedCategory, setExpandedCategory] = useState(null)

    useEffect(() => {
        const fetchCompaniesByCategory = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/companies?category=${categoryName}`)
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`)
                }
                const data = await response.json()
                setCompanies(data)
            } catch (error) {
                console.error("Error fetching companies by category:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchCompaniesByCategory()
    }, [categoryName])

    
    const handleMouseMove = (e) => {
        setTooltipPosition({ x: e.clientX + 10, y: e.clientY - 40 })
    }

    const toggleExpand = (id) => {
        setExpandedCompany((prev) => (prev === id ? null : id))
    }

    return (
        <div>
            <div className="container my-4">
                <div className="hero-section text-center p-5">
                    <h1 className="display-2 hero-text">
                        Companies Doing <strong className="eco-hero">Good</strong> for the Planet
                    </h1>
                        <p className="lead">
                            The companies listed below are dedicated to making a positive impact on our planet.<br />
                            They prioritize treating their employees with respect and dignity while ensuring<br />
                            their products meet the high standards you deserve.
                        </p>
                    <button className="btn btn-dark" onClick={() => navigate("/companies/recent")}>Recent Companies</button>
                </div>
                {loading && (
                    <div className="loading-container">
                        <img src={Logo} alt="Loading..." className="logo-shake" />
                    </div>
                )}
                <div className="row">
                    <div key={index} className={`card-group col-lg-3 col-md-6 col-sm-12 ${expandedCompany === company._id ? "position-relative" : ""}`}>
                        <div
                            ref={expandedCompany === company._id ? cardRef : null}
                            className={`card company-card ${expandedCompany === company._id ? "expanded" : "collapsed"}`}
                            onPointerMove={handleMouseMove}
                        >
                            {expandedCompany !== company._id && (
                                <div className="tooltip" style={{ position: "fixed", top: `${tooltipPosition.y}px`, left: `${tooltipPosition.x}px` }}><i className="bi bi-eye-fill"></i> More Info</div>
                            )}
                            <div className="card-header align-items-center" onClick={() => toggleExpand(company._id)} style={{ cursor: "pointer" }}>
                                <img
                                    src={company.logo}
                                    className="card-img-top"
                                    alt={`${company.name} logo`}
                                    style={{ objectFit: "contain", height: "150px", width: "100%" }}
                                    loading="lazy"
                                />
                                <h5 className="card-title m-0">{company.name}</h5>
                                <h6 className="card-specifics">{company.specifics}</h6>
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
                                    <div className="d-flex justify-content-between align-items-center icon-wrapper">
                                        <div className="d-flex justify-content-center align-items-center flex-grow-1">
                                            <div className="product-icons d-flex justify-content-center align-items-center gap-2">
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
                                                            loading="lazy"
                                                        />
                                                    ) : null;
                                                })}
                                            </div>
                                        </div>
                                        <div className="d-flex">
                                            <i className="collapse-button bi bi-box-arrow-in-up" onClick={() => toggleExpand(company._id)} style={{ cursor: "pointer" }}></i>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default CompaniesByCategory