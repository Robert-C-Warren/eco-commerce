import React, { useState, useEffect } from "react";
import API from "../services/api";
import "./ProductList.css";
import Navbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import bCorpIcon from "../resources/icons/bcorp.png";
import smallBusinessIcon from "../resources/icons/handshake.png";
import veganIcon from "../resources/icons/vegan.png";
import biodegradableIcon from "../resources/icons/leaf.png";
import fairTradeIcon from "../resources/icons/trade.png";
import recycled from "../resources/icons/recycle.svg";
import { useParams, useLocation } from "react-router-dom";

const availableIcons = [
    { id: "b_corp", label: "B Corp", src: bCorpIcon, title: "Certified B Corporation" },
    { id: "small_business", label: "Small Business", src: smallBusinessIcon, title: "Small Business" },
    { id: "vegan", label: "Vegan", src: veganIcon, title: "Vegan" },
    { id: "biodegradable", label: "Biodegradable", src: biodegradableIcon, title: "Biodegradable" },
    { id: "fair_trade", label: "Fair-Trade", src: fairTradeIcon, title: "Fair-Trade Certified" },
    { id: "recycled_materials", label: "Recycled-Materials", src: recycled, title: "Made from Recycled Materials" },
];

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const { category } = useParams(); // Get category from the route
    const location = useLocation();

    const fetchProducts = async () => {
        try {
            const response = await API.get("/products/filter", {
                params: {
                    category, // Use category from useParams
                    min_price: 0, // Default price filtering
                    max_price: Number.MAX_SAFE_INTEGER,
                },
            });

            if (Array.isArray(response.data)) {
            const visibleProducts = response.data.filter((product) => product.visible);
            setProducts(visibleProducts);
            setFilteredProducts(visibleProducts)
            } else {
                console.error("Unexpected API response:", response.data)
                setProducts([]);
                setFilteredProducts([]);
            }

        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts(); // Fetch whenever category changes
    }, [category]);

    useEffect(() => {
        const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach((tooltipTriggerE1) => {
            new window.bootstrap.Tooltip(tooltipTriggerE1)
        })
    }, [products])

    return (
        <div>
            <Navbar />
            <div className="container my-4">
                <div className="product-list">
                    {location.pathname === "/" && (
                        <div className="hero-section text-center p-5 bg-light">
                            <h1 className="display-2 text-success">
                                Welcome to <strong className="eco-hero">Eco-Commerce</strong>
                            </h1>
                            <p className="lead">
                                Shop eco-friendly products for a sustainable future!
                            </p>
                        </div>
                    )}
                    {products.length > 0 ? (
                        <div className="row">
                            {products.map((product, index) => (
                                <div
                                    key={product._id || index}
                                    className="product-card card text-center "
                                >
                                    <div className="card-header column">
                                        <img
                                            src={product.image}
                                            alt={product.title || "Product Image"}
                                            style={{ height: "200px", objectFit: "cover" }}
                                        />
                                        <h6 className="product-title card-title mb-0">
                                            {product.summary || "No Summary Available"}
                                        </h6>
                                    </div>
                                    <div className="card-body">
                                        <p className="card-text">
                                            <strong>Price:</strong> ${product.price ? product.price.toFixed(2) : "N/A"}
                                        </p>
                                        <p className="card-text">
                                            <strong>Category:</strong>{" "}
                                            {product.category?.join(", ") || "Uncategorized"}
                                        </p>
                                        <div className="d-flex flex-column align-items-center">
                                            <a
                                                className="source-link link-offset-1 link-secondary"
                                                href={product.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {product.source || "No Source"}
                                            </a>
                                            <a
                                                href={product.url}
                                                role="button"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-dark text-white mt-3 btn-view-product"
                                            >
                                                View Product
                                            </a>
                                        </div>
                                        <div className="product-icons d-flex justify-content-center align-items-center gap-2 mt-2">
                                            {product.icons?.map((iconId) => {
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
                                                    />
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center my-4">
                            No products available for the selected category.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
