import React, { useEffect, useState } from "react";
import API from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./AdminConsole.css"
import bCorpIcon from "../resources/icons/bcorp.png"
import smallBusinessIcon from "../resources/icons/handshake.png"
import veganIcon from "../resources/icons/vegan.png"
import biodegradableIcon from "../resources/icons/leaf.png"
import fairTradeIcon from "../resources/icons/trade.png"
import recycled from "../resources/icons/recycle.svg"
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const availableIcons = [
    { id: "b_corp", label: "B Corp", src: bCorpIcon, title: "Certified B Corporation"},
    { id: "small_business", label: "Small Business", src: smallBusinessIcon, title: "Small Business"},
    { id: "vegan", label: "Vegan", src: veganIcon, title: "Vegan"},
    { id: "biodegradable", label: "Biodegradable", src: biodegradableIcon, title: "Biodegradable"},
    { id: "fair_trade", label: "Fair-Trade", src: fairTradeIcon, title: "Fair-Trade Certified"},
    { id: "recycled_materials", label: "Recycled-Materials", src: recycled, title: "Made from Recycled Materials"},
]

const availableCategories = ["Cleaning", "Home", "Outdoor", "Pet", "Kitchen", "Personal Care"]


const ProductCard = ({ product, fetchProducts, toggleVisibility, startEditing, deleteProduct, selectedProducts, toggleProductSelected }) => {
    const [selectedCategories, setSelectedCategories] = useState(product.categories || []);
    const [selectedIcons, setSelectedIcons] = useState(product.icons || []);

    const handleCategoryChange = (category) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const updateCategories = async () => {
        try {
            await API.patch(`/admin/products/${product._id}/categories`, { categories: selectedCategories });
            fetchProducts();
        } catch (error) {
            console.error("Error updating categories:", error);
        }
    };

    const toggleIcon = (iconId) => {
        setSelectedIcons((prev) =>
            prev.includes(iconId) ? prev.filter((id) => id !== iconId) : [...prev, iconId]
        );
    };

    const saveIcons = async () => {
        try {
            await API.patch(`/admin/products/${product._id}/icons`, { icons: selectedIcons });
            fetchProducts();
        } catch (error) {
            console.error("Error saving icons:", error);
        }
    };

    return (
        <div className="card h-100">
            <img src={product.image} alt={product.summary} className="card-img-top" style={{objectFit: "contain", height: "200px", width: "100%", borderRadius: "8px" }} />
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{product.summary}</h5>
                <p><strong>Price:</strong> {product.price}</p>
                <p><strong>Source:</strong> {product.source}</p>

                {/* Category Selection */}
                <h6>Select Categories</h6>
                {availableCategories.map((category) => (
                    <div key={category} className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id={`${product._id}-${category}`}
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleCategoryChange(category)}
                        />
                        <label htmlFor={`${product._id}-${category}`} className="form-check-label">
                            {category}
                        </label>
                    </div>
                ))}
                <button className="btn btn-primary mt-2" onClick={updateCategories}>Update Categories</button>
                <h6 className="category">{product.category}</h6>

                {/* Icon Selection */}
                <h6>Select Icons</h6>
                {availableIcons.map((icon) => (
                    <div key={icon.id} className="form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id={`${product._id}-${icon.id}`}
                            checked={selectedIcons.includes(icon.id)}
                            onChange={() => toggleIcon(icon.id)}
                        />
                        <label htmlFor={`${product._id}-${icon.id}`} className="form-check-label">
                            <img src={icon.src} alt={icon.label} style={{ width: "30px", marginRight: "5px" }} />
                            {icon.label}
                        </label>
                    </div>
                ))}
                <button className="btn btn-primary mt-2" onClick={saveIcons}>Save Icons</button>

                {/* Product Actions */}
                <div className="mt-auto">
                    <a href={product.url} target="_blank" rel="noopener noreferrer" className="btn btn-dark w-100 mb-2">View Product</a>
                    <button
                        className={`btn w-100 ${product.visible ? "btn-danger" : "btn-success"}`}
                        onClick={() => toggleVisibility(product._id, product.visible)}
                    >
                        {product.visible ? "Hide from Site" : "Show on Site"}
                    </button>
                    <button className="btn btn-warning w-100 mt-2" onClick={() => startEditing(product._id, product.summary)}>Edit Title</button>
                    <button className="btn btn-danger w-100 mt-2" onClick={() => deleteProduct(product._id)}>Delete Product</button>
                    <div className="form-check mt-3">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={selectedProducts.includes(product._id)}
                            onChange={() => toggleProductSelected(product._id)}
                        />
                        <label className="form-check-label" htmlFor={`select-${product._id}`}>Select for Bulk Show</label>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminConsole = () => {
    const [products, setProducts] = useState([]);
    const [editingProductId, setEditingProductId] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");
    const [selectedProducts, setSelectedProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const response = await API.get("/admin/products");
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const toggleVisibility = async (productId, currentVisibility) => {
        try {
            await API.patch(`/admin/products/${productId}`, { visible: !currentVisibility });
            fetchProducts();
        } catch (error) {
            console.error("Error updating visibility:", error);
        }
    };

    const startEditing = (productId, currentTitle) => {
        setEditingProductId(productId);
        setEditedTitle(currentTitle);
    };

    const deleteProduct = async (productId) => {
        try {
            await API.delete(`/admin/products/${productId}`);
            setProducts(products.filter((product) => product._id !== productId));
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const toggleProductSelected = (productId) => {
        setSelectedProducts((prev) =>
            prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
        );
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="container mt-4">
                <h1 className="text-center mb-4">Admin Console</h1>
                <div className="row mb-3">
                    <div className="col text-end">
                        <Link to="/admin/companies" className="btn btn-secondary mb-3">Admin Companies</Link>
                        <button className="btn btn-success me-2" onClick={() => toggleProductSelected()}>Show All Selected</button>
                    </div>
                </div>
                <div className="row g-3">
                    {products.map((product) => (
                        <div key={product._id} className="col-lg-3 col-md-4 col-sm-6">
                            <ProductCard
                                product={product}
                                fetchProducts={fetchProducts}
                                toggleVisibility={toggleVisibility}
                                startEditing={startEditing}
                                deleteProduct={deleteProduct}
                                selectedProducts={selectedProducts}
                                toggleProductSelected={toggleProductSelected}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminConsole;
