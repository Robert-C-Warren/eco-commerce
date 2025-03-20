import React, { useState, useRef, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import API_BASE_URL from "../components/urls";
import BScoreChart from "../components/BScoreChart";
import availableIcons from "../components/AvailableIcons";
import "./styles/FavoritesPage.scss"

const db = getFirestore();

const FavoritesPage = () => {
  const [user] = useAuthState(auth);
  const [favoriteCompanies, setFavoriteCompanies] = useState([]);
  const [expandedCompany, setExpandedCompany] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const cardRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const fetchFavorites = async () => {
      const userFavoritesRef = doc(db, "favorites", user.uid);
      const userFavoritesSnap = await getDoc(userFavoritesRef);

      if (userFavoritesSnap.exists()) {
        const companyIds = userFavoritesSnap.data().companies;
        const companyData = await Promise.all(
          companyIds.map(async (id) => {
            const res = await fetch(`${API_BASE_URL}/companies/${id}`);
            return res.json();
          })
        );
        setFavoriteCompanies(companyData);
      }
    };

    fetchFavorites();
  }, [user]);

  const handleMouseMove = (e) => {
    setTooltipPosition({ x: e.clientX + 10, y: e.clientY - 40 });
  };

  const toggleExpand = (id) => {
    setExpandedCompany((prev) => (prev === id ? null : id));
  };

  return (
    <div className="container my-4">
      <h1 className="display-4 text-center favorites-title">Your Favorites</h1>
      {favoriteCompanies.length === 0 ? (
        <p className="text-center favorites-title">Start favoriting to see companies here!</p>
      ) : (
        <div className="row">
          {favoriteCompanies
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((company, index) => (
              <div
                key={index}
                className={`card-group col-lg-3 col-md-6 col-sm-12 ${
                  expandedCompany === company._id ? "position-relative" : ""
                }`}
              >
                <div
                  ref={expandedCompany === company._id ? cardRef : null}
                  className={`card company-card ${
                    expandedCompany === company._id ? "expanded" : "collapsed"
                  }`}
                  onPointerMove={handleMouseMove}
                  style={{ boder: "none" }}
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
                    className="align-items-center card-header-expanded"
                    onClick={() => toggleExpand(company._id)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={company.logo}
                      className="card-img-top"
                      alt={`${company.name} logo`}
                      style={{
                        objectFit: "contain",
                        height: "150px",
                        width: "100%",
                      }}
                      loading="lazy"
                    />
                    <h5 className="card-title m-0">{company.name}</h5>
                    <h6 className="card-specifics">{company.specifics}</h6>
                  </div>
                  {expandedCompany === company._id && (
                    <div className="card-body">
                      <p className="card-text">{company.description}</p>
                      {company.b_score !== undefined &&
                        company.b_score !== null && (
                          <BScoreChart
                            className="b-score-chart"
                            score={company.b_score}
                          />
                        )}
                      <ul>
                        {company.qualifications.map((qualification, i) => (
                          <li className="qualifications" key={i}>
                            {qualification}
                          </li>
                        ))}
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
                        <div className="d-flex justify-content-center align-items-center center-container flex-grow-1">
                          <div className="product-icons d-flex justify-content-center align-items-center gap-2">
                            {company.icons.map((iconId) => {
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
                              color: company.transparency_score
                                ? "#28a745"
                                : "#dc3545",
                            }}
                          >
                            {company.transparency_score || "N/A"}
                          </h2>
                        </div>
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
      )}
    </div>
  );
};

export default FavoritesPage;
