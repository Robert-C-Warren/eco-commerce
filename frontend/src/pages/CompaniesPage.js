import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/CompaniesPage.scss";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Helmet } from "react-helmet";
import Logo from "../resources/eclogo8.webp";
import { auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import API_BASE_URL from "../components/urls";
import BScoreChart from "../components/BScoreChart";
import availableIcons from "../components/AvailableIcons";

const CompaniesPage = ({ searchQuery, collection = "companies" }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCompany, setExpandedCompany] = React.useState(
    sessionStorage.getItem("expandedCompany") || null
  );
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [userFavorites, setUserFavorites] = useState([]);
  const categoryRefs = useRef({});
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const db = getFirestore();
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/${collection}`);
        const data = await response.json();
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching companies", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [collection]);

  useEffect(() => {
    const existingToolTips = Array.from(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    existingToolTips.forEach((tooltipTriggerE1) => {
      const tooltipInstance =
        window.bootstrap.Tooltip.getInstance(tooltipTriggerE1);
      if (tooltipInstance) {
        tooltipInstance.dispose();
      }
    });

    const initializeTooltips = () => {
      const tooltipTriggerList = Array.from(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
      );
      tooltipTriggerList.forEach((tooltipTriggerE1) => {
        new window.bootstrap.Tooltip(tooltipTriggerE1);
      });
    };

    const timer = setTimeout(initializeTooltips, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [companies]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setExpandedCompany(null); // Collapse the expanded card
      }
    };

    if (expandedCompany) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [expandedCompany]);

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      const userFavoritesRef = doc(db, "favorites", user.uid);
      const userFavoritesSnap = await getDoc(userFavoritesRef);

      if (userFavoritesSnap.exists()) {
        setUserFavorites(userFavoritesSnap.data().companies || []);
      }
    };

    fetchFavorites();
  }, [user]);

  const filteredCompanies = searchQuery
    ? companies.filter(
        (company) =>
          company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          company.specifics?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : companies;

  const groupedCompanies = searchQuery
    ? { "Search Results": filteredCompanies }
    : companies.reduce((acc, company) => {
        const category = company.category || "Uncatogorized";
        if (!acc[category]) acc[category] = [];
        acc[category].push(company);
        return acc;
      }, {});

  const toggleExpand = (id) => {
    const newExpanded = expandedCompany === String(id) ? null : String(id);
    setExpandedCompany(newExpanded);
    sessionStorage.setItem("expandedCompany", newExpanded);
  };

  const toggleCategory = (category) => {
    setExpandedCategory((prev) => {
      const contentEl = categoryRefs.current[category];

      if (contentEl) {
        if (prev === category) {
          contentEl.style.height = `${contentEl.scrollHeight}px`; // Set explicit height
          requestAnimationFrame(() => {
            contentEl.style.height = "0";
          });
          return null;
        } else {
          const prevContentE1 = categoryRefs.current[prev];
          if (prevContentE1) {
            prevContentE1.style.height = `${prevContentE1.scrollHeight}px`;
            requestAnimationFrame(() => {
              prevContentE1.style.height = "0";
            });
          }

          contentEl.style.height = `${contentEl.scrollHeight}px`;
          setTimeout(() => {
            contentEl.style.height = "auto";
          }, 500);

          return category;
        }
      }

      return prev;
    });
  };

  const handleMouseMove = (e) => {
    setTooltipPosition({ x: e.clientX + 10, y: e.clientY - 40 });
  };

  const getScoreColor = (score) => {
    if (score >= 85) return "#28a745", "Excellent";
    if (score >= 70) return "#ffc107", "Good";
    if (score >= 50) return "#fd7e14", "Moderate";
    if (score >= 30) return "#dc3545", "Low";
    return "#ffffff", "Not Enough Info";
  };

  const getScoreRating = (score) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Moderate";
    if (score >= 30) return "Low";
    return "Not Enough Info";
  };

  const toggleFavorite = async (companyId) => {
    if (!user) {
      toast.error("You must be signed in to favorite companies.", {
        autoClose: 2000,
      });
      return;
    }

    const userFavoritesRef = doc(db, "favorites", user.uid);
    const userFavoritesSnap = await getDoc(userFavoritesRef);

    let userFavorites = userFavoritesSnap.exists()
      ? userFavoritesSnap.data().companies
      : [];

    if (userFavorites.includes(companyId)) {
      userFavorites = userFavorites.filter((id) => id !== companyId);
    } else {
      userFavorites.push(companyId);
    }

    await setDoc(userFavoritesRef, { companies: userFavorites });
  };

  return (
    <div>
      <div className="container my-4">
        <Helmet>
          <title>EcoCommerce | Companies</title>
          <meta
            name="description"
            content="Find eco-friendly companies and sustainable products for responsible shopping"
          />
          <meta
            name="keywords"
            content="EcoCommerce, sustainable, eco-friendly, responsible shopping, ethical brands, 
                b-corp products, best eco-friendly clothing companies, best eco-friendly jewelry companies, best eco-friendly food companies,
                ethical sourcing, ethical brands, ethical clothing"
          />
        </Helmet>
        <div className="hero-section text-center p-5">
          <h1 className="display-2 hero-text">
            {collection === "smallbusiness"
              ? "Small Businesses Making an Impact"
              : "Companies Doing Good for the Planet"}
          </h1>
          {!searchQuery && (
            <p className="lead">
              {collection === "smallbusiness"
                ? "Support small businesses that prioritize sustainability and ethical practices."
                : "These companies prioritize eco-friendly practices, fair labor, and sustainable production."}
            </p>
          )}
          <button
            className="btn btn-dark"
            onClick={() => navigate("/companies/recent")}
          >
            Recent Companies
          </button>
        </div>
        {loading && (
          <div className="loading-container">
            <img src={Logo} alt="Loading..." className="logo-bounce" />
          </div>
        )}

        {!loading &&
          Object.keys(groupedCompanies)
            .sort()
            .map((category) => (
              <div key={category} className="category-container">
                <div className="category-toggle">
                  <h2
                    className="mt-4"
                    onClick={() => toggleCategory(category)}
                    style={{ cursor: "pointer" }}
                  >
                    {category}
                  </h2>
                  <i
                    className={`icon-toggler bi ${
                      expandedCategory === category
                        ? "bi-arrows-collapse"
                        : "bi-arrows-expand"
                    }`}
                    onClick={() => toggleCategory(category)}
                    style={{ cursor: "pointer" }}
                  ></i>
                </div>
                <div
                  ref={(el) => (categoryRefs.current[category] = el)}
                  className="category-content"
                  style={{
                    height: expandedCategory === category ? "auto" : "0",
                    overflow: "hidden",
                    transition: "height 0.5s ease",
                  }}
                >
                  <div className="row">
                    {groupedCompanies[category]
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((company, index) => (
                        <div
                          key={index}
                          className={`card-group col-lg-3 col-md-6 col-sm-12 ${
                            expandedCompany === company._id
                              ? "position-relative"
                              : ""
                          }`}
                        >
                          <div
                            ref={
                              expandedCompany === String(company._id)
                                ? cardRef
                                : null
                            }
                            className={`card company-card ${
                              expandedCompany === company._id
                                ? "expanded"
                                : "collapsed"
                            }`}
                            onPointerMove={handleMouseMove}
                            style={{ border: "none" }}
                          >
                            {expandedCompany !== company._id && (
                              <div
                                className="tooltip"
                                style={{
                                  position: "fixed",
                                  top: `${tooltipPosition.y}px`,
                                  left: `${tooltipPosition.x}px`,
                                }}
                              >
                                <i className="bi bi-eye-fill"></i> More Info
                              </div>
                            )}
                            <div
                              className="card-header-expanded"
                              onClick={() => toggleExpand(company._id)}
                              style={{ cursor: "pointer" }}
                            >
                              <img
                                src={company.logo}
                                className="card-img-top company-logo"
                                alt={`${company.name} logo`}
                                style={{
                                  objectFit: "contain",
                                  height: "150px",
                                  width: "100%",
                                }}
                                loading="lazy"
                              />
                              <h5 className="card-title m-0">{company.name}</h5>
                              <h6 className="card-specifics">
                                {company.specifics}
                              </h6>
                              <button
                                className="favorites-btn"
                                onClick={(e) => {
                                  e.stopPropagation(); // ✅ Prevents click from expanding the card
                                  toggleFavorite(company._id);
                                }}
                              >
                                {user && userFavorites.includes(company._id)
                                  ? <i class="bi bi-heart-fill"></i>
                                  : <i class="bi bi-heart"></i>}
                              </button>
                            </div>
                            {expandedCompany === company._id && (
                              <div className="card-body ">
                                <p className="card-text expanded-description">
                                  {company.description}
                                </p>
                                {company.b_score !== undefined &&
                                  company.b_score !== null && (
                                    <BScoreChart
                                      className="b-score-chart"
                                      score={company.b_score}
                                    />
                                  )}
                                <ul>
                                  {company.qualifications.map(
                                    (qualification, i) => (
                                      <li className="qualifications" key={i}>
                                        {qualification}
                                      </li>
                                    )
                                  )}
                                </ul>

                                <div className="company-links-container">
                                  <a
                                    href={company.website}
                                    className="btn btn-primary visit-company-btn"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    Visit Website
                                  </a>
                                </div>
                                <div className="company-insta-container">
                                  {company.instagram && (
                                    <a
                                      href={company.instagram}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="instagram-link"
                                      aria-label={`Visit ${company.name} on Instagram`}
                                    >
                                      <i className="bi bi-instagram visit-company-insta"></i>
                                    </a>
                                  )}
                                </div>
                                <div className="icon-wrapper">
                                  {/* Icons & Score (Centered) */}
                                  <div className="d-flex justify-content-center align-items-center center-container flex-grow-1">
                                    <div className="product-icons d-flex justify-content-center align-items-center gap-2">
                                      {company.icons?.map((iconId) => {
                                        const icon = availableIcons.find(
                                          (i) => i.id === iconId
                                        );
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
                                    <h2 className="index-score-title">
                                      Transparency Score
                                    </h2>
                                    <h2
                                      className="index-score"
                                      style={{
                                        color: getScoreColor(
                                          company.transparency_score
                                        ),
                                      }}
                                    >
                                      {company.transparency_score}{" "}
                                      {getScoreRating(
                                        company.transparency_score
                                      )}
                                    </h2>
                                  </div>

                                  {/* Absolutely Positioned Collapse Button */}
                                  <i
                                    className="collapse-button bi bi-box-arrow-in-up"
                                    onClick={() => toggleExpand(company._id)}
                                  ></i>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
};

export default CompaniesPage;
