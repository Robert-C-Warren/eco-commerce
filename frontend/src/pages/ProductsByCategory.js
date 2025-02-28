import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Logo from "../resources/eclogov7.webp"
import API_BASE_URL from "../components/urls"
import "./styles/ProductsByCategory.scss"

const ProductsByCategory = () => {
    const { categoryName } = useParams()
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [companies, setCompanies] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProductsByCategory = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/products/category/${categoryName}`)
                setProducts(response.data)
            } catch (error) {
                console.error("Error fetching products by category:", error)
            } finally {
                setLoading(false)
            }
        }

        const fetchCompanies = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/companies`);
                setCompanies(response.data);
            } catch (error) {
                console.error("Error fetching companies", error);
            }
        };

        fetchProductsByCategory()
        fetchCompanies()
    }, [categoryName])

    const getCompanyLogo = (companyName) => {
        if (!companyName || typeof companyName !== "string") {
            console.warn("⚠️ Missing or invalid company name:", companyName);
            return "default-logo.png";  // ✅ Return a safe default image
        }

        const company = companies.find((c) => c.name?.toLowerCase() === companyName.toLowerCase());
        return company ? company.logo : "default-logo.png";
    };

    return (
        <div>
            <div className="container my-4">
                <div className="hero-section text-center p-5">
                    <h1 className="display-2 hero-text">
                        {categoryName} <strong className="eco-hero">Products</strong>
                    </h1>
                    <p className="lead">
                        Explore sustainable and ethical {categoryName.toLowerCase()} products that help protect our planet.
                    </p>
                    {/* <button className="btn btn-dark" onClick={() => navigate("/products/recent")}>Recent Products</button> */}
                </div>

                {loading && (
                    <div className="loading-container">
                        <img src={Logo} alt="Loading..." className="logo-shake" />
                    </div>
                )}

                {!loading && products.length === 0 && (
                    <p className="text-center">No products found in this category</p>
                )}

                <div className="row">
                    {products
                        .sort((a, b) => {
                            const companyA = (a.company || "").toLowerCase();
                            const companyB = (b.company || "").toLowerCase();
                            if (companyA < companyB) return -1;
                            if (companyA > companyB) return 1;
                            return (a.title || "").localeCompare(b.title || "");
                        })
                        .map((product, index) => (
                            <div key={index} className="col-lg-3 col-md-6 col-sm-12" style={{ marginBottom: "20px" }}>
                                <div className="card product-card">
                                    <div className="card-header align-items-center">
                                        <img src={product.image} className="product-image" alt={product.title}
                                            style={{ objectFit: "contain" }} loading="lazy" />
                                    </div>

                                    <div className="card-details">
                                        <h5 className="card-title">{product.title}</h5>
                                        <h6 className="card-price">{product.price}</h6>
                                        <a href={product.website} className="btn btn-outline-secondary view-product-btn" target="_blank" rel="noopener noreferrer">
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
                <div className="disclaimer-footer" style={{ display: "flex", flexDirection: "row", textAlign: "center", justifyContent: "center"}}>
                    <i class="bi bi-cone-striped" style={{ fontSize: "3rem"}}></i>
                    <h5 className="disclaimer">
                    All product prices are from the time that the product was added to the site.<br/>
                    For current pricing, refer to the companies website.
                    </h5>
                    <i class="bi bi-cone-striped" style={{ fontSize: "3rem"}}></i>
                </div>
            </div>
        </div>
    )
}

export default ProductsByCategory