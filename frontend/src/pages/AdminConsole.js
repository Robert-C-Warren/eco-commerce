import React, { useEffect, useState } from "react";
import API from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/AdminConsole.scss"
import { Helmet } from 'react-helmet';
import { ToastContainer, toast } from "react-toastify"
import { Link } from "react-router-dom";
import API_BASE_URL from "../components/urls"
import veganIcon from "../resources/icons/veganlogo.png"
import glutenFreeIcon from "../resources/icons/glutenfreeicon.png"
import nutFreeIcon from "../resources/icons/nutfreeicon.png"
import nonGmoLogo from "../resources/icons/nongmologo.png"
import usdaOrganic from "../resources/icons/usdaorganiclogo.png"


const availableIcons = [
    { id: "vegan", label: "Vegan", src: veganIcon, title: "Vegan" },
    { id: "gluten_free", label: "Gluten Free", src: glutenFreeIcon, title: "Gluten Free" },
    { id: "nut_free", label: "Nut Free", src: nutFreeIcon, title: "Nut Free" },
    { id: "non_gmo", label: "Non GMO", src: nonGmoLogo, title: "Non GMO" },
    { id: "organic", label: "Organic", src: usdaOrganic, title: "Organic" },

]

const availableCategories = ["Accessories", "Beverage", "Cleaning", "Clothing", "Food", "Home", "Kitchen", "Outdoor", "Personal Care", "Pet"]

const AdminConsole = () => {
    const [companies, setCompanies] = useState([])
    const [productsByCompany, setProductsByCompany] = useState({})
    const [newProduct, setNewProduct] = useState({
        title: "",
        website: "",
        image: "",
        company: "",
        category: "",
        price: ""
    })
    const [filteredCompanies, setFilteredCompanies] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCompany, setSelectedCompany] = useState("")
    const sanitizeId = (name) => name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]/g, '');
    const [expandedCompany, setExpandedCompany] = useState(null)
    const [dietaryOptions, setDietaryOptions] = useState({
        vegan: false,
        gluten_free: false,
        nut_free: false,
        non_gmo: false,
        organic: false
    })

    const fetchProducts = async () => {
        try {
            const response = await API.get(`${API_BASE_URL}/products`);

            const formattedProducts = {};
            response.data.forEach(group => {
                if (group._id && Array.isArray(group.products)) {
                    formattedProducts[group._id] = group.products.map(product => {

                        return {
                            _id: product._id,
                            title: product.title,
                            website: product.website,
                            category: product.category,
                            image: product.image,
                            price: product.price,
                            vegan: product.vegan ?? false,
                            gluten_free: product.gluten_free ?? false,
                            nut_free: product.nut_free ?? false,
                            non_gmo: product.non_gmo ?? false,
                            organic: product.organic ?? false,
                        };
                    });
                } else {
                    console.warn("Unexpected group format:", group);
                }
            });

            setProductsByCompany(formattedProducts);  // ✅ Updates state (was missing before)
        } catch (error) {
            console.error("Error fetching products:", error.response ? error.response.data : error);
        }
    };

    const fetchCompanies = async () => {
        try {
            const response = await API.get(`${API_BASE_URL}/companies`)
            setCompanies(response.data)
        } catch (error) {
            console.error("Error fetching companies:", error)
        }
    }

    useEffect(() => {
        fetchProducts()
        fetchCompanies()
    }, [])

    useEffect(() => {
        if (searchTerm) {
            const results = companies.filter(company =>
                company.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setFilteredCompanies(results)
        } else {
            setFilteredCompanies([])
        }
    }, [searchTerm, companies])

    useEffect(() => {
        const interval = setInterval(updateButtonColors, 500)
        return () => clearInterval(interval)
    })

    const handleCompanySelect = (company) => {
        setSelectedCompany(company.name)
        setNewProduct({ ...newProduct, company: company.name })
        setSearchTerm("")
        setFilteredCompanies([])
    }

    const addProduct = async () => {
        try {
            const productData = {
                ...newProduct,
                ...dietaryOptions
            };

            if (!productData.company) {
                toast.error("Please select a company", { autoClose: 2000 });
                return; // Prevent API call if company is missing
            }

            // ✅ Ensure data is actually being sent in the request
            const response = await API.post(`${API_BASE_URL}/products`, JSON.stringify(productData), {
                headers: { "Content-Type": "application/json" }
            });

            toast.success("Product added successfully", { autoClose: 2000 });

            setNewProduct({
                title: "",
                price: "",
                website: "",
                image: "",
                company: "",
                category: "",
            });

            setDietaryOptions({ vegan: false, gluten_free: false, nut_free: false, organic: false }); // Reset checkboxes
            setSelectedCompany("");
            fetchProducts();
        } catch (error) {
            console.error("Error adding product", error);
            toast.error("Failed to add product", { autoClose: 2000 });
        }
    };

    const toggleCollapse = (company) => {
        setExpandedCompany(prev => (prev === company ? null : company))
    }

    function updateButtonColors() {
        const buttons = document.querySelectorAll('.company-button-container button')
        buttons.forEach((button, index) => {
            if (index % 2 === 0) {
                button.style.backgroundColor = '#62929E';
            } else {
                button.style.backgroundColor = '#59594A'
            }
            button.style.color = 'white'
        })
    }

    return (
        <div className="admin-container mt-4">
            <Helmet>
                <title>EcoCommerce | Admin Console</title>
            </Helmet>
            <ToastContainer />
            <h1 className="text-center mb-4 admin-page-title">Admin Console - Manage Products</h1>
            <div className="admin-nav-btns">
                <div className="admin-companies-btn">
                    <Link to="/admin/companies" className="btn btn-secondary mb-3">Admin Companies</Link>
                </div>
                <div className="index-btn">
                    <Link to="/admin/index" className="btn btn-secondary mb-3">Admin Sustainability Index</Link>
                </div>
            </div>

            <div className="new-product-card p-4 mb-4">
                <h3 className="new-product-title">Add New Product</h3>
                <form onSubmit={(e) => { e.preventDefault(); addProduct(); }} className="new-product-form">
                    {/* Title */}
                    <input type="text" className="form-control mb-2" placeholder="Title"
                        value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} />
                    {/* Price */}
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Price"
                        value={newProduct.price}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers & .
                            setNewProduct({ ...newProduct, price: value });
                        }}
                        onBlur={(e) => {
                            let priceValue = e.target.value;
                            if (priceValue && !priceValue.startsWith("$") && !isNaN(priceValue)) {
                                priceValue = `$${parseFloat(priceValue).toFixed(2)}`; // Convert to $X.XX format
                                setNewProduct({ ...newProduct, price: priceValue });
                            }
                        }}
                    />
                    {/* Website */}
                    <input className="form-control mb-2" placeholder="Website"
                        value={newProduct.website} onChange={(e) => setNewProduct({ ...newProduct, website: e.target.value })}></input>
                    {/* Image URL */}
                    <input type="text" className="form-control mb-2" placeholder="Image URL"
                        value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} />
                    {/* Company */}
                    <div className="position-relative">
                        <input type="text" className="form-control mb-2" placeholder="Company" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        {filteredCompanies.length > 0 && (
                            <ul className="list-group position-absolute w-100 bg-white shadow">
                                {filteredCompanies.length > 0 && (
                                    <ul className="list-group position-absolute w-100 bg-white shadow">
                                        {filteredCompanies.map((company) => (
                                            <li
                                                key={company._id}
                                                className="list-group-item list-group-item-action"
                                                onClick={() => handleCompanySelect(company)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {company.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </ul>
                        )}
                    </div>
                    {selectedCompany && (
                        <div className="alert alert-success mt-2">
                            <strong>{selectedCompany}</strong>
                        </div>
                    )}
                    {/* Category */}
                    <select className="form-control mb-2" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
                        <option value="">Select Category</option>
                        {availableCategories.map(category => <option key={category} value={category}>{category}</option>)}
                    </select>
                    {/* Dietary Checkboxes */}
                    {["Food", "Beverage"].includes(newProduct.category) && (
                        <div className="form-check-group">
                            {availableIcons.map(icon => (
                                <div key={icon.id} className="form-check">
                                    <input type="checkbox" id={icon.id} className="form-check-input" checked={dietaryOptions[icon.id]}
                                        onChange={(e) => setDietaryOptions({ ...dietaryOptions, [icon.id]: e.target.checked })} />
                                    <label htmlFor={icon.id} className="dietary-form-check-label" style={{ color: "white" }}>{icon.label}</label>
                                </div>
                            ))}
                        </div>
                    )}
                    <button type="submit" className="btn btn-success w-100 add-product-btn">Add Product</button>
                </form>
            </div>
            {Object.keys(productsByCompany).map(company => {
                const isExpanded = expandedCompany === company;
                return (
                    <div key={company} className="mb-4 company-button-container">
                        <button
                            className="btn btn-info w-100 text-start company-button"
                            type="button"
                            aria-expanded={isExpanded}
                            onClick={() => toggleCollapse(company)}
                        >
                            {company}
                        </button>
                        <div className={`collapse ${isExpanded ? "show" : ""} mt-2`} id={`collapse-${sanitizeId(company)}`}>
                            <div className="product-card-row">
                                {productsByCompany[company]?.map((product) => {
                                    const iconCount = [
                                        product.vegan,
                                        product.gluten_free,
                                        product.nut_free,
                                        product.non_gmo,
                                        product.organic
                                    ].filter(Boolean).length; // Count active icons

                                    return (
                                        <div key={product._id} className="col-md-4">
                                            <div className="existing-product-card">
                                                <img src={product.image} className="product-card-image" alt={product.title} height="300px" />
                                                <div className="product-card-body">
                                                    <h5 className="product-card-title">{product.title}</h5>
                                                    <h5 className="product-card-price">{product.price}</h5>
                                                    <a
                                                        href={product.website}
                                                        className="btn btn-primary"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        View Product
                                                    </a>
                                                    <p className="product-text-muted">{product.category}</p>

                                                    {/* Apply "shrink-icons" class when there are 4 or more icons */}
                                                    <div className={`dietary-icons ${iconCount >= 4 ? "shrink-icons" : ""}`}>
                                                        {product.vegan && <img src={veganIcon} alt="Vegan" title="Vegan" className="dietary-icon" />}
                                                        {product.gluten_free && <img src={glutenFreeIcon} alt="Gluten Free" title="Gluten Free" className="dietary-icon" />}
                                                        {product.nut_free && <img src={nutFreeIcon} alt="Nut Free" title="Nut Free" className="dietary-icon" />}
                                                        {product.non_gmo && <img src={nonGmoLogo} alt="Non GMO" title="Non GMO" className="dietary-icon" />}
                                                        {product.organic && <img src={usdaOrganic} alt="Organic" title="Organic" className="dietary-icon" />}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    )
};

export default AdminConsole;
