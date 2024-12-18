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
import * as bootstrap from "bootstrap";
import { useParams } from "react-router-dom";

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
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const { category } = useParams();
    const [filteredProducts, setFilteredProducts] = useState([]);

    const fetchProducts = async (category = null) => {
        try {
            const response = await API.get("/products/filter", {
                params: {
                    min_price: minPrice || 0,
                    max_price: maxPrice || Number.MAX_SAFE_INTEGER,
                    category
                },
            });
            const visibleProducts = response.data.filter((product) => product.visible);
            setProducts(visibleProducts);

            if(category) {
                const catergoryFiltered = visibleProducts.filter(
                    (product) => product.categories?.includes(category)
                );
                setFilteredProducts(catergoryFiltered)
            } else {
                setFilteredProducts(visibleProducts)
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search)
        const category = queryParams.get("category");
        fetchProducts();
        fetchProducts(category);

        const handleScroll = () => {
            const navbarCollapse = document.getElementById("navbarMenu");
            if (navbarCollapse && navbarCollapse.classList.contains("show")) {
                const collapseInstance = bootstrap.Collapse.getInstance(navbarCollapse);
                if (collapseInstance) {
                    collapseInstance.hide();
                }
            }
        };

        window.addEventListener("scroll", handleScroll);

        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipTriggerList.forEach((tooltipTriggerEl) => {
            new bootstrap.Tooltip(tooltipTriggerEl, {
                placement: "bottom",
                boundary: document.body,
            });
    
        });   

        return () => {
            window.removeEventListener("scroll", handleScroll);

            const queryParams = new URLSearchParams(window.location.search)
            const category = queryParams.get("category")

            tooltipTriggerList.forEach((tooltipTriggerEl) => {
                const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
                if (tooltipInstance) {
                    tooltipInstance.dispose();
                }
            });
        };
    }, [minPrice, maxPrice, category]);

    return (
        <div>
            <Navbar />
            <div className="container my-4">
                <div className="product-list">
                <div className="hero-section text-center p-5 bg-light">
                    <h1 className="display-2 text-success">Welcome to <strong className="eco-hero">Eco-Commerce</strong></h1>
                    <p className="lead">
                        Shop eco-friendly products for a sustainable future!
                    </p>
                </div>
                    {products.map((product, index) => (
                        <div key={product.id || index} className="product-card card text-center mb-3">
                            <div className="card-header column">
                                <img src={product.image} alt={product.title} style={{ height: "200px" }} />
                                <h6 className="product-title card-title mb-0">{product.summary}</h6>
                            </div>
                            <div className="card-body">
                                <p className="card-text">
                                    <strong>Price: ${product.price}</strong>
                                </p>
                                <p className="card-text">Categories: {product.categories?.join(", ") || ""}</p>
                                <div className="d-flex flex-column align-items-center">
                                    <a
                                        className="source-link link-offset-1 link-secondary link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                                        href={product.url}
                                    >
                                        {product.source}
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
                                                data-bs-title={icon.label}
                                            />
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
