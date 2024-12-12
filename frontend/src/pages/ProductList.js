import React, { useState, useEffect } from "react";
import API from "../services/api";
import "./ProductList.css";
import smallLogo from "../resources/eco-commerce-logo.png"
import App from "../App";

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
            const visibleProducts = response.data.filter(product => product.visible);
            setProducts(visibleProducts);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [minPrice, maxPrice]);

    return (
        // Navbar
            

        // Product Cards
        <div className="container my-4">
            <nav class="navbar sticky-top navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                    <a class="navbar-brand-img" href="#">
                        <img src={smallLogo} alt="Logo" width="50" height="35" class="d-inline-block align-text-top" />
                    </a>
                    <a class="navbar-brand" href="#">Eco-Commerce</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item-home">
                        <a class="nav-link active" aria-current="page" href="#">Home</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="#">Companies</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="#">Stay Updated</a>
                        </li>
                        <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Categories
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#">Cleaning</a></li>
                            <li><a class="dropdown-item" href="#">Kitchen</a></li>
                            <li><a class="dropdown-item" href="#">Outdoor</a></li>
                            <li><a class="dropdown-item" href="#">Home</a></li>
                            <li><a class="dropdown-item" href="#">Pet</a></li>
                            <li><a class="dropdown-item" href="#">Personal Care</a></li>
                        </ul>
                        </li>
                    </ul>
                    <form class="d-flex" role="search">
                        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                        <button class="btn btn-outline-success" type="submit">Search</button>
                    </form>
                    </div>
                </div>
            </nav>

            <div className="product-list">
                {products.map((product, index) => (
                    <div key={product.id || index} className="product-card card text-center mb-4">
                            <div className="card-header column">
                                <img src={product.image} alt={product.title} style={{ height: "200px" }}/>
                                <h6 className="product-title card-title mb-0">{product.summary}</h6>
                            </div>    
                            <div className="card-body">    
                                <p className="card-text">
                                    <strong>Price: ${product.price}</strong>
                                </p>
                                <div className="d-flex flex-column align-item-start">
                                    <a class="link-offset-1 link-secondary link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover" href={product.url}>
                                        {product.source}
                                    </a>
                                    <a 
                                        href={product.url} 
                                        role="button"
                                        target="_blank"
                                        rel="noopener noreferrer" 
                                        class="btn btn-dark text-white mt-3"
                                    >
                                        View Product
                                    </a>
                                </div>
                            </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HomePage;