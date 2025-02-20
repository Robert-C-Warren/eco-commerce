import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../components/urls";
import Logo from "../resources/eclogov7.webp"
import "./ProductsPage.css"

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
            const contentEl = categoryRefs.current[category]

            if (contentEl) {
                if (prev === category) {
                    contentEl.style.height = `${contentEl.scrollHeight}px`
                    requestAnimationFrame(() => {
                        contentEl.style.height = "0"
                    })
                    return null
                } else {
                    const prevContentE1 = categoryRefs.current[prev]
                    if (prevContentE1) {
                        prevContentE1.style.height = `${prevContentE1.scrollHeight}px`
                        requestAnimationFrame(() => {
                            prevContentE1.style.height = "0"
                        })
                    }

                    contentEl.style.height = `${contentEl.scrollHeight}px`
                    setTimeout(() => {
                        contentEl.style.height = "auto"
                    }, 500)

                    return category
                }
            }
            return prev
        })
    }

    return (
        <div>
            <div className="container my-4">
                <div className="hero-section text-center p-5">
                    <h1 className="display-2 hero-text">Eco-Friendly Products</h1>
                    {!searchQuery && (
                        <p className="lead">
                            Discover sustainable and ethical products that help protect our planet.
                        </p>
                    )}
                    <button className="btn btn-dark" onClick={() => navigate("/products/recent")}>
                        Recent Products
                    </button>
                </div>

                {loading && (
                    <div className="loading-container">
                        <img src={Logo} alt="Loading..." className="logo-shake" />
                    </div>
                )}
                {!loading &&
                    Object.keys(groupedProducts)
                        .sort()
                        .map((category) => (
                            <div key={category} className="category-container">
                                <h2
                                    className="mt-4"
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
                                                <div key={index} className="card-group col-lg-3 col-md-6 col-sm-12">
                                                    <div className="product-card">
                                                        <div className="card-header align-items-center">
                                                            <img src={product.image} className="product-image" alt={product.title}
                                                                style={{ objectFit: "contain" }} loading="lazy"
                                                            />

                                                        </div>

                                                        <div className="card-details">
                                                            <h5 className="card-title">{product.title}</h5>
                                                            <h6 className="card-price">{product.price}</h6>
                                                            <a href={product.website} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
                                                                View Product
                                                            </a>
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
                    <div className="disclaimer-footer" style={{ display: "flex", flexDirection: "row", textAlign: "center", justifyContent: "center"}}>
                    <i class="bi bi-cone-striped" style={{ fontSize: "3rem"}}></i>
                    <h5>
                    All product prices are from the time that the product was added to the site.<br/>
                    For current pricing, refer to the companies website.
                    </h5>
                    <i class="bi bi-cone-striped" style={{ fontSize: "3rem"}}></i>
                </div>
            </div>
        </div>
    );
}

export default ProductsPage