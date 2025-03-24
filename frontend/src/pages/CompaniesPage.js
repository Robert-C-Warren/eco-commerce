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
import ScrollToTop from "../components/ScrollToTop"

const CompaniesPage = ({ searchQuery, collection = "companies" }) => {
	const [companies, setCompanies] = useState([]);
	const [loading, setLoading] = useState(true);
	const [expandedCompany, setExpandedCompany] = React.useState(sessionStorage.getItem("expandedCompany") || null);
	const [expandedCategory, setExpandedCategory] = useState(null);
	const [userFavorites, setUserFavorites] = useState([]);
	const [favoritingNow, setFavoritingNow] = useState(null);
	const [floatingHearts, setFloatingHearts] = useState([]);
	const [breakingHearts, setBreakingHearts] = useState([]);
	const [tooltipState, setTooltipState] = useState({
		x: 0,
		y: 0,
		visible: false,
		content: "More Info",
	});
	const categoryTitleRefs = useRef({});
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
		const existingToolTips = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
		existingToolTips.forEach((tooltipTriggerE1) => {
			const tooltipInstance = window.bootstrap.Tooltip.getInstance(tooltipTriggerE1);
			if (tooltipInstance) {
				tooltipInstance.dispose();
			}
		});

		const initializeTooltips = () => {
			const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
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
	}, [user, db]);

	const filteredCompanies = searchQuery
		? companies.filter(
				(company) =>
					company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					company.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

					setTimeout(() => {
						const titleEl = categoryTitleRefs.current[category];
						if (titleEl) {
							titleEl.scrollIntoView({ behavior: "auto", block: "start" });

							const offset = 300;
							window.scrollBy({ top: offset, behavior: "smooth" });
						}
					}, 550);

					return category;
				}
			}

			return prev;
		});
	};

	const handleMouseMove = (e, companyId) => {
		const isFavorites = e.target.closest(".favorites-btn");

		if (isFavorites || expandedCompany === companyId) {
			setTooltipState((prev) => ({ ...prev, visible: false }));
			return;
		}

		setTooltipState({
			x: e.clientX - 45,
			y: e.clientY + 25,
			visible: true,
			content: "More Info",
		});
	};

	const getScoreColor = (score) => {
		if (score >= 85) return { color: "#28a745", label: "Excellent" };
		if (score >= 70) return { color: "#ffc107", label: "Good" };
		if (score >= 50) return { color: "#fd7e14", label: "Moderate" };
		if (score >= 30) return { color: "#dc3545", label: "Low" };
		return { color: "#ffffff", label: "Not Enough Info" };
	};

	const toggleFavorite = async (companyId) => {
		if (!user) {
			toast.error("You must be signed in to favorite companies.", { autoClose: 2000 });
			return;
		}

		setFavoritingNow(companyId);

		const userFavoritesRef = doc(db, "favorites", user.uid);
		const userFavoritesSnap = await getDoc(userFavoritesRef);

		let favorites = userFavoritesSnap.exists() ? userFavoritesSnap.data().companies : [];
		let updatedFavorites;

		const isRemoving = favorites.includes(companyId);

		if (isRemoving) {
			updatedFavorites = favorites.filter((id) => id !== companyId);

			// 💔 Heartbreak burst
			const heartbreakBurst = [
				{
					id: `${companyId}-${Date.now()}-break-center`,
					companyId,
					xOffset: Math.floor(Math.random() * 10 - 5),
					rotation: Math.floor(Math.random() * 20 - 10),
					scale: 0.9 + Math.random() * 0.2,
				},
				{
					id: `${companyId}-${Date.now()}-break-left`,
					companyId,
					xOffset: Math.floor(Math.random() * 10 - 30),
					rotation: -15 + Math.random() * 10,
					scale: 0.8 + Math.random() * 0.2,
				},
				{
					id: `${companyId}-${Date.now()}-break-right`,
					companyId,
					xOffset: Math.floor(Math.random() * 10 + 20),
					rotation: 10 + Math.random() * 10,
					scale: 0.8 + Math.random() * 0.2,
				},
			];

			setBreakingHearts((prev) => [...prev, ...heartbreakBurst]);

			setTimeout(() => {
				setBreakingHearts((prev) => prev.filter((h) => h.companyId !== companyId));
			}, 1000);
		} else {
			updatedFavorites = [...favorites, companyId];

			// 💗 Floating heart burst
			const heartBurst = [
				{
					id: `${companyId}-${Date.now()}-center`,
					companyId,
					xOffset: Math.floor(Math.random() * 10 - 5),
					yOffset: 0,
					rotation: Math.floor(Math.random() * 20 - 10),
					scale: 1 + Math.random() * 0.2,
				},
				{
					id: `${companyId}-${Date.now()}-left`,
					companyId,
					xOffset: Math.floor(Math.random() * 10 - 30),
					yOffset: -10,
					rotation: -20 + Math.random() * 10,
					scale: 0.9 + Math.random() * 0.2,
				},
				{
					id: `${companyId}-${Date.now()}-right`,
					companyId,
					xOffset: Math.floor(Math.random() * 10 + 20),
					yOffset: -10,
					rotation: 10 + Math.random() * 10,
					scale: 0.9 + Math.random() * 0.2,
				},
			];

			setFloatingHearts((prev) => [...prev, ...heartBurst]);

			setTimeout(() => {
				setFloatingHearts((prev) => prev.filter((h) => h.companyId !== companyId));
			}, 1000);
		}

		await setDoc(userFavoritesRef, { companies: updatedFavorites });
		setUserFavorites(updatedFavorites);
		setFavoritingNow(null);
	};

	return (
		<div>
			<div className="container my-4">
				<Helmet>
					<title>EcoCommerce | Companies</title>
					<meta name="description" content="Find eco-friendly companies and sustainable products for responsible shopping" />
					<meta
						name="keywords"
						content="EcoCommerce, sustainable, eco-friendly, responsible shopping, ethical brands, 
                b-corp products, best eco-friendly clothing companies, best eco-friendly jewelry companies, best eco-friendly food companies,
                ethical sourcing, ethical brands, ethical clothing"
					/>
				</Helmet>
				<ToastContainer />
				<div className="hero-section text-center p-5">
					<h1 className="display-2 hero-text">{collection === "smallbusiness" ? "Small Businesses Making an Impact" : "Companies Doing Good for the Planet"}</h1>
					{!searchQuery && (
						<p className="lead">
							{collection === "smallbusiness"
								? "Support small businesses that prioritize sustainability and ethical practices."
								: "These companies prioritize eco-friendly practices, fair labor, and sustainable production."}
						</p>
					)}
					<button className="btn btn-dark" onClick={() => navigate("/companies/recent")}>
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
									<h2 className="mt-4" ref={(e1) => (categoryTitleRefs.current[category] = e1)} onClick={() => toggleCategory(category)} style={{ cursor: "pointer" }}>
										{category}
									</h2>
									<i className={`icon-toggler bi ${expandedCategory === category ? "bi-arrows-collapse" : "bi-arrows-expand"}`} onClick={() => toggleCategory(category)} style={{ cursor: "pointer" }}></i>
								</div>
								<div
									ref={(el) => (categoryRefs.current[category] = el)}
									className="category-content"
									style={{
										height: expandedCategory === category ? "auto" : "0",
										overflow: "hidden",
										transition: "height 0.5s ease",
									}}>
									<div className="row">
										{groupedCompanies[category]
											.sort((a, b) => a.name.localeCompare(b.name))
											.map((company) => {
												const scoreInfo = getScoreColor(company.transparency_score);

												return (
													<div key={company._id} className={`card-group col-lg-3 col-md-6 col-sm-12 ${expandedCompany === company._id ? "position-relative" : ""}`}>
														<div
															ref={expandedCompany === String(company._id) ? cardRef : null}
															className={`card company-card ${expandedCompany === company._id ? "expanded" : "collapsed"}`}
															onPointerMove={(e) => handleMouseMove(e, company._id)}
															onPointerLeave={() => setTooltipState((prev) => ({ ...prev, visible: false }))}
															style={{ border: "none" }}>
															<div className="card-header-expanded" onClick={() => toggleExpand(company._id)} style={{ cursor: "pointer" }}>
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
																<h6 className="card-specifics">{company.specifics}</h6>
																<button
																	className="favorites-btn"
																	onClick={(e) => {
																		e.stopPropagation();
																		toggleFavorite(company._id);
																	}}
																	disabled={favoritingNow === company._id}
																	aria-label={`${userFavorites.includes(String(company._id)) ? "Remove from" : "Add to"} favorites`}>
																	{/* Heart icon */}
																	{userFavorites.includes(String(company._id)) ? <i className="bi bi-heart-fill"></i> : <i className="bi bi-heart"></i>}

																	{/* Render all floating hearts */}
																	{floatingHearts
																		.filter((h) => h.companyId === company._id)
																		.map((h) => (
																			<span
																				key={h.id}
																				className="floating-heart"
																				style={{
																					left: `calc(50% + ${h.xOffset}px)`,
																					transform: `translateX(-50%) scale(${h.scale}) rotate(${h.rotation}deg)`,
																				}}>
																				<i className="bi bi-heart-fill small-heart"></i>
																			</span>
																		))}
																	{breakingHearts
																		.filter((h) => h.companyId === company._id)
																		.map((h) => (
																			<span
																				key={h.id}
																				className="breaking-heart"
																				style={{
																					left: `calc(50% + ${h.xOffset}px)`,
																					transform: `translateX(-50%) scale(${h.scale}) rotate(${h.rotation}deg)`,
																				}}>
																				<i className="bi bi-heartbreak-fill"></i>
																			</span>
																		))}
																</button>
															</div>
															{expandedCompany === company._id && (
																<div className="card-body ">
																	<p className="card-text expanded-description">{company.description}</p>
																	{company.b_score !== undefined && company.b_score !== null && <BScoreChart className="b-score-chart" score={company.b_score} />}
																	<ul>
																		{company.qualifications.map((qualification, i) => (
																			<li className="qualifications" key={i}>
																				{qualification}
																			</li>
																		))}
																	</ul>

																	<div className="company-links-container">
																		<a href={company.website} className="btn btn-primary visit-company-btn" target="_blank" rel="noopener noreferrer">
																			Visit Website
																		</a>
																	</div>
																	<div className="company-insta-container">
																		{company.instagram && (
																			<a href={company.instagram} target="_blank" rel="noopener noreferrer" className="instagram-link" aria-label={`Visit ${company.name} on Instagram`}>
																				<i className="bi bi-instagram visit-company-insta"></i>
																			</a>
																		)}
																	</div>
																	<div className="icon-wrapper">
																		{/* Icons & Score (Centered) */}
																		<div className="d-flex justify-content-center align-items-center center-container flex-grow-1">
																			<div className="product-icons d-flex justify-content-center align-items-center gap-2">
																				{company.icons?.map((iconId) => {
																					const icon = availableIcons.find((i) => i.id === iconId);
																					return icon ? (
																						<img className="icon_actual" key={icon.id} src={icon.src} alt={icon.label} data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title={icon.label} loading="lazy" />
																					) : null;
																				})}
																			</div>
																			<h2 className="index-score-title">Transparency Score</h2>
																			<h2
																				className="index-score"
																				style={{
																					color: scoreInfo.color,
																				}}>
																				{company.transparency_score} {scoreInfo.label}
																			</h2>
																		</div>

																		{/* Absolutely Positioned Collapse Button */}
																		<i className="collapse-button bi bi-box-arrow-in-up" onClick={() => toggleExpand(company._id)}></i>
																	</div>
																</div>
															)}
														</div>
													</div>
												);
											})}
									</div>
								</div>
							</div>
						))}
			</div>
			{tooltipState.visible && (
				<div
				className="global-tooltip"
				style={{
					position: "fixed",
					top: `${tooltipState.y}px`,
					left: `${tooltipState.x}px`,
					background: "rgba(0, 0, 0, 0.85)",
					color: "white",
					padding: "6px 10px",
					borderRadius: "6px",
					fontSize: "0.85rem",
					transition: "top 0.08s ease, left 0.08s ease, opacity 0.15s ease",
					pointerEvents: "none",
					zIndex: 9999,
				}}>
					<i className="bi bi-eye-fill me-1" />
					{tooltipState.content}
				</div>
			)}
			<ScrollToTop />
		</div>
	);
};

export default CompaniesPage;
