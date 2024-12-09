import React, { useState, useEffect } from "react";
import API from "../services/api";
import "./ProductList.css";
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
        <div className="container">
            <div className="filter-form">
                <input
                type="number"
                placeholder="Min Price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                />
                <input
                type="number"
                placeholder="Max Price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                />
                <button onClick={fetchProducts}>Filter</button>
            </div>

            <div className="product-list">
                {products.map((product, index) => (
                    <div key={product.id || index} className="product-card">
                        <img 
                            src={product.image}
                            alt={product.title}
                            style={{ width: "100%", height: "200px", objectFit: "cover" }}
                            onError={(e) => { e.target.src = "/fallback-image.jpg"; }}
                            className="product-image"
                        />
                        <h3 className="product-title">{product.title}</h3>
                        <p className="product-price">Price: ${product.price}</p>
                        <a 
                            href={product.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="product-link"
                        >
                            View Product
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HomePage;