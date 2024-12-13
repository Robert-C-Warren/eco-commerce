import React, { useState, useEffect } from "react";
import API from "../services/api";
import "./ProductList.css";
import smallLogo from "../resources/eco-commerce-logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import bCorpIcon from "../resources/icons/bcorp.png";
import smallBusinessIcon from "../resources/icons/handshake.png";
import veganIcon from "../resources/icons/vegan.png";
import biodegradableIcon from "../resources/icons/leaf.png";
import fairTradeIcon from "../resources/icons/trade.png";
import recycled from "../resources/icons/recycle.svg";
import * as bootstrap from "bootstrap";

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

    const fetchProducts = async () => {
        try {
            const response = await API.get("/products/filter", {
                params: {
                    min_price: minPrice || 0,
                    max_price: maxPrice || Number.MAX_SAFE_INTEGER,
                },
            });
            const visibleProducts = response.data.filter((product) => product.visible);
            setProducts(visibleProducts);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();

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

            tooltipTriggerList.forEach((tooltipTriggerEl) => {
                const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
                if (tooltipInstance) {
                    tooltipInstance.dispose();
                }
            });
        };
    }, [minPrice, maxPrice]);

    return (
        <div className="container my-4">
            <nav className="navbar sticky-top navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand d-flex align-items-center" href="#">
                        <img src={smallLogo} alt="Logo" width="50" height="35" className="d-inline-block align-text-top" />
                        <span className="ms-2">Eco-Commerce</span>
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarMenu"
                        aria-controls="navbarMenu"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarMenu">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">
                                    Home
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/companies">
                                    Companies
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="email_list">
                                    Stay Updated
                                </a>
                            </li>
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    id="categoriesDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Categories
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="categoriesDropdown">
                                    <li>
                                        <a className="dropdown-item" href="/categories/cleaning">
                                            Cleaning
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="/categories/home">
                                            Home
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="/categories/outdoor">
                                            Outdoor
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="/categories/pet">
                                            Pet
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="/categories/kitchen">
                                            Kitchen
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="/categories/personalcare">
                                            Personal Care
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <form className="d-flex" role="search">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">
                                Search
                            </button>
                        </form>
                    </div>
                </div>
            </nav>

            <div className="product-list">
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
                                    className="btn btn-dark text-white mt-3"
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
    );
};

export default HomePage;
