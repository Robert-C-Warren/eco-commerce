import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../components/urls";
import Logo from "../resources/eclogo8.webp"
import "./styles/ProductsPage.scss"
import veganIcon from "../resources/icons/veganlogo.png"
import glutenFreeIcon from "../resources/icons/glutenfreeicon.png"
import nutFreeIcon from "../resources/icons/nutfreeicon.png"
import nonGmoLogo from "../resources/icons/nongmologo.png"
import usdaOrganic from "../resources/icons/usdaorganiclogo.png"
import { Helmet } from "react-helmet";


const availableIcons = [
    { id: "vegan", label: "Vegan", src: veganIcon, title: "Vegan" },
    { id: "gluten_free", label: "Gluten Free", src: glutenFreeIcon, title: "Gluten Free" },
    { id: "nut_free", label: "Nut Free", src: nutFreeIcon, title: "Nut Free" },
    { id: "non_gmo", label: "Non GMO", src: nonGmoLogo, title: "Non GMO" },
    { id: "organic", label: "Organic", src: usdaOrganic, title: "Organic" },

]

const ProductsPage = ({ searchQuery, collection = "products" }) => {
    const [products, setProducts] = useState([])
    const [companies, setCompanies] = useState([])
    const [loading, setLoading] = useState(true)
    const [expandedCategory, setExpandedCategory] = useState(null)
    const categoryRefs = useRef({})
    const cardRef = useRef(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/${collection}`)
                const data = await response.json()
                setProducts(data)
            } catch (error) {
                console.error("Error fetching products", error)
            } finally {
                setLoading(false)
            }
        }

        const fetchCompanies = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/companies`)
                const data = await response.json()
                setCompanies(data)
            } catch (error) {
                console.error("Error fetching companies", error)
            }
        }

        fetchProducts()
        fetchCompanies()
    }, [collection])

    const getCompanyLogo = (companyName) => {
        if (!companyName || typeof companyName !== "string") {
            console.warn("⚠️ Missing or invalid company name:", companyName);
            return "default-logo.png";  // ✅ Return a safe default image
        }

        const company = companies.find((c) => c.name?.toLowerCase() === companyName.toLowerCase());
        return company ? company.logo : "default-logo.png";
    };

    const filteredProducts = searchQuery ? products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
    ) : products

    const groupedProducts = searchQuery ? { "Search Results": filteredProducts } : products.reduce((acc, company) => {
        if (!company.products || company.products.length === 0) {
            console.warn("Company has no products:", company);
            return acc; // Skip if no products
        }

        company.products.forEach((product) => {
            if (!product.category) {
                console.warn("Product missing category:", product);
            }

            const category = product.category && typeof product.category === "string"
                ? product.category.trim()
                : "Uncategorized";

            if (!acc[category]) acc[category] = [];
            acc[category].push(product);
        });

        return acc;
    }, {});

    const toggleCategory = (category) => {
        setExpandedCategory((prev) => {
            const contentEl = categoryRefs.current[category];

            if (contentEl) {
                if (prev === category) {
                    // Collapse the currently expanded category
                    contentEl.style.height = `${contentEl.scrollHeight}px`;
                    requestAnimationFrame(() => {
                        contentEl.style.height = "0";
                    });
                    return null;
                } else {
                    // Collapse the previously expanded category
                    const prevContentEl = categoryRefs.current[prev];
                    if (prevContentEl) {
                        prevContentEl.style.height = `${prevContentEl.scrollHeight}px`;
                        requestAnimationFrame(() => {
                            prevContentEl.style.height = "0";
                        });
                    }

                    // Expand the new category
                    contentEl.style.height = `${contentEl.scrollHeight}px`;

                    // Ensure height change is applied before setting to auto
                    requestAnimationFrame(() => {
                        contentEl.style.height = "auto";
                    });

                    // Scroll **AFTER** height transition completes (ensure full expansion first)
                    setTimeout(() => {
                        const categoryHeader = document.querySelector(`h2[data-category="${category}"]`);
                        if (categoryHeader) {
                            const headerOffset = categoryHeader.getBoundingClientRect().top + window.scrollY;
                            window.scrollTo({ top: headerOffset - 20, behavior: "smooth" });
                        }
                    }, 600); // Ensure it waits for full transition (adjust delay if necessary)

                    return category;
                }
            }
            return prev;
        });
    };

    return (
        <div>
            <div className="container my-4">
                <Helmet>
                    <title>EcoCommerce | About</title>
                    <meta name="description" content="Find eco-friendly companies and sustainable products for responsible shopping" />
                    <meta name="keywords" content="EcoCommerce, sustainable, eco-friendly, responsible shopping, ethical brands, 
                        b-corp products, best eco-friendly clothing companies, best eco-friendly jewelry companies, best eco-friendly food companies,
                        ethical sourcing, ethical brands, ethical clothing" />
                </Helmet>
                <div className="hero-section text-center p-5">
                    <h1 className="display-2 hero-text">Eco-Friendly Products</h1>
                    {!searchQuery && (
                        <p className="lead">
                            These products are just a glimpse of what each company offers.
                            To explore their full catalog, click on a product to visit their website directly.
                        </p>
                    )}
                    <button className="btn btn-outline-secondary recent-companies-btn" onClick={() => navigate("/products/recent")}>
                        Recent Products
                    </button>
                </div>

                {loading && (
                    <div className="loading-container">
                        <img src={Logo} alt="Loading..." className="logo-bounce" />
                    </div>
                )}
                {!loading &&
                    Object.keys(groupedProducts)
                        .sort()
                        .map((category) => (
                            <div key={category} className="category-container">
                                <div className="category-toggle">
                                    <h2
                                        className="mt-4"
                                        data-category={category}
                                        onClick={() => toggleCategory(category)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {category}
                                    </h2>
                                    <i
                                        className={`icon-toggler bi ${expandedCategory === category
                                            ? "bi-arrows-collapse"
                                            : "bi-arrows-expand"
                                            }`}
                                        onClick={() => toggleCategory(category)}
                                        style={{ cursor: "pointer" }}
                                    />
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
                                        {groupedProducts[category]
                                            .filter((product) => product.title)
                                            .sort((a, b) => {
                                                const companyA = (a.company || "").toLowerCase();
                                                const companyB = (b.company || "").toLowerCase();
                                                if (companyA < companyB) return -1;
                                                if (companyA > companyB) return 1;
                                                return (a.title || "").localeCompare(b.title || "");
                                            })
                                            .map((product, index) => (
                                                <div key={index} className="card-group col-lg-3 col-md-6 col-sm-12 card-container">
                                                    <div className="product-card">
                                                        <div className="card-header align-items-center">
                                                            <img src={product.image} className="product-image" alt={product.title}
                                                                style={{ objectFit: "contain" }} loading="lazy"
                                                            />

                                                        </div>

                                                        <div className="card-details">
                                                            <h5 className="card-title">{product.title}</h5>
                                                            <h6 className="card-price">{product.price}</h6>
                                                            <a href={product.website} className="btn btn-outline-secondary view-product-btn" target="_blank" rel="noopener noreferrer">
                                                                View Product
                                                            </a>

                                                            <div className="dietary-icons">
                                                                {availableIcons.map(icon =>
                                                                    product[icon.id] && ( // ✅ Only display icons where product field is true
                                                                        <img key={icon.id} src={icon.src} alt={icon.label} title={icon.label} className="dietary-icon" />
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="card-footer text-center">
                                                            <img src={getCompanyLogo(product.company)} alt="Company Logo"
                                                                style={{ width: "100px", height: "50px", objectFit: "contain" }} loading="lazy" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                <div className="disclaimer-footer" style={{ display: "flex", flexDirection: "row", textAlign: "center", justifyContent: "center" }}>
                    <i className="bi bi-cone-striped" style={{ fontSize: "3rem" }}></i>
                    <h5 className="disclaimer">
                        All product prices are from the time that the product was added to the site.<br />
                        For current pricing, refer to the companies website.
                    </h5>
                    <i className="bi bi-cone-striped" style={{ fontSize: "3rem" }}></i>
                </div>
            </div>
        </div>
    );
}

export default ProductsPage