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

const availableIcons = [
    { id: "b_corp", label: "B Corp", src: bCorpIcon, title: "Certified B Corporation"},
    { id: "small_business", label: "Small Business", src: smallBusinessIcon, title: "Small Business"},
    { id: "vegan", label: "Vegan", src: veganIcon, title: "Vegan"},
    { id: "biodegradable", label: "Biodegradable", src: biodegradableIcon, title: "Biodegradable"},
    { id: "fair_trade", label: "Fair-Trade", src: fairTradeIcon, title: "Fair-Trade Certified"},
    { id: "recycled_materials", label: "Recycled-Materials", src: recycled, title: "Made from Recycled Materials"},
]

const AdminConsole = () => {
    const [products, setProducts] = useState([]);
    const [editingProductId, setEditingProductId] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");
    const [selectedProducts, setSelectedProducts] = useState([])
    const [selectedIcons, setSelectedIcons] = useState({})

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
            await API.patch(`/admin/products/${productId}`, { visible: !currentVisibility});
            fetchProducts();
        } catch (error) {
            console.error("Error updating visibilty:", error);
        }
    };

    const toggleProductSelected = (productId) => {
        setSelectedProducts((prevSelected) => 
            prevSelected.includes(productId)
                ? prevSelected.filter((id) => id !== productId)
                : [...prevSelected, productId]
        );
    };

    const showSelectedProducts = async () => {
        try {
            await API.patch("/admin/products/visibility", {
                product_ids: selectedProducts,
                visible: true,            
            });
            fetchProducts();
        } catch (error) {
            console.error("Error updating visibility", error)
        }
    };

    const deleteProduct = async (productId) => {
        try {
            await API.delete(`/admin/products/${productId}`);
            setProducts(products.filter((product) => product._id !== productId));
        } catch (error) {
            console.error("Error deleting product:", error)
        }
    };

    const startEditing = (productId, currentTitle) => {
        setEditingProductId(productId);
        setEditedTitle(currentTitle);
    };

    const saveEditedTitle = async (productId) => {
        try {
            await API.patch(`/admin/products/${productId}/edit`, { summary: editedTitle});
            setEditingProductId(null);
            fetchProducts();
        } catch (error) {
            console.error("Error updating title:", error)
        }
    };

    const toggleIcon = (productId, iconId) => {
        setSelectedIcons((prev) => ({
            ...prev,
            [productId]: prev[productId]?.includes(iconId)
            ? prev[productId].filter((id) => id !== iconId)
            : [...(prev[productId] || []), iconId],
        }));
    };

    const saveIcons = async(productId) => {
        try {
            const icons = selectedIcons[productId] || [];
            console.log("Icons being sent:", { icons: icons});
            await API.patch(`/admin/products/${productId}/icons`, { icons });
            fetchProducts();
        } catch (error) {
            console.error("Error saving icons:", error)
            alert("Failed to update icons.");
        }
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await API.get("/admin/products");
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error)
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="container mt-4">
            <h1 className="text-center mb-4">Admin Console</h1>
            <div className="row mb-3">
                <div className="col text-end">
                    <button
                        className="btn btn-success"
                        onClick={showSelectedProducts}
                        disabled={!selectedProducts.length}
                    >
                        Show All Selected Products 
                    </button>
                </div>
            </div>
            <div className="container mt-4">
                <div className="row g-3">
                    {products.map((product) => (
                        <div key={product._id} className="col-lg-3 col-md-4 col-sm-6">
                            <div className="card h-100 d-flex flex-column">
                                <img 
                                    src={product.image}
                                    className="card-img-top"
                                    alt={product.title}
                                    style={{ objectFit: "contain", height: "200px", width: "100% "}}
                                />
                                <div className="card-body d-flex flex-column">
                                    {editingProductId === product._id ? (
                                        <div>
                                            <input
                                                type="text"
                                                className="form-control mb-2"
                                                value={editedTitle}
                                                onChange={(e) => setEditedTitle(e.target.value)}
                                            />
                                            <button
                                                className="btn btn-primary w-100"
                                                onClick={() => saveEditedTitle(product._id)}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="btn btn-secondary w-100 mt-2"
                                                onClick={() => setEditingProductId(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="mt-auto">
                                            <h5 className="card-title text-wrap text-center">{product.summary}</h5>
                                            <p className="card-text">
                                                <strong>Price:</strong> {product.price} <br />
                                                <strong>Source:</strong> {product.source}
                                            </p>
                                            <div className="mt-auto">
                                                <a
                                                    href={product.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-dark w-100 mb-2"
                                                >
                                                    View Product
                                                </a>
                                                <button 
                                                    className={`btn w-100 ${
                                                        product.visible ? "btn-danger" : "btn-success"
                                                    }`}
                                                    onClick={() =>
                                                        toggleVisibility(product._id, product.visible)
                                                    }
                                                >
                                                    {product.visible
                                                        ? "Hide from Site"
                                                        : "Show on Site"}
                                                </button>
                                                <button
                                                    className="btn btn-warning w-100 mt-2"
                                                    onClick={() => startEditing(product._id, product.title)}
                                                >
                                                    Edit Title 
                                                </button>
                                                <button
                                                    className="btn btn-danger w-100 mt-2"
                                                    onClick={() => deleteProduct(product._id)}
                                                >
                                                    Delete Product 
                                                </button>
                                                <div className="form-check mt-3">
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={selectedProducts.includes(product._id)}
                                                        onChange={() => toggleProductSelected(product._id)}
                                                        id={`select-${product._id}`}
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor={`select-${product._id}`}
                                                    >
                                                        Select for Bulk Show
                                                    </label>
                                                </div>
                                                <div className="icons">
                                                    <h6>Select Icons</h6>
                                                    {availableIcons.map((icon) => (
                                                        <div key={icon.id} className="form-check">
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                id={`${product._id}-${icon.id}`}
                                                                checked={selectedIcons[product.id]?.includes(icon.id)}
                                                                onChange={() => toggleIcon(product._id, icon.id)}
                                                            />
                                                            <label
                                                                className="form-check-label"
                                                                htmlFor={`${product._id}-${icon.id}`}
                                                            >
                                                                <img
                                                                    src={icon.src}
                                                                    alt={icon.label}
                                                                    style={{ width: "30px", marginRight: "5px"}}
                                                                />
                                                                {icon.label}
                                                            </label>
                                                        </div>
                                                    ))}
                                                    <button
                                                        className="btn btn-primary mt-2"
                                                        onClick={() => saveIcons(product._id)}
                                                    >
                                                        Save Icons
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>    
            </div>
        </div>
    );
};

export default AdminConsole;