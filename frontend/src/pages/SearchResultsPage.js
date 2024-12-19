import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import API from "../services/api";
import Navbar from "./Navbar";
import bCorpIcon from "../resources/icons/bcorp.png";
import smallBusinessIcon from "../resources/icons/handshake.png";
import veganIcon from "../resources/icons/vegan.png";
import biodegradableIcon from "../resources/icons/leaf.png";
import fairTradeIcon from "../resources/icons/trade.png";
import recycled from "../resources/icons/recycle.svg";
import "./ProductList.css"
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const availableIcons = [
    { id: "b_corp", label: "B Corp", src: bCorpIcon, title: "Certified B Corporation" },
    { id: "small_business", label: "Small Business", src: smallBusinessIcon, title: "Small Business" },
    { id: "vegan", label: "Vegan", src: veganIcon, title: "Vegan" },
    { id: "biodegradable", label: "Biodegradable", src: biodegradableIcon, title: "Biodegradable" },
    { id: "fair_trade", label: "Fair-Trade", src: fairTradeIcon, title: "Fair-Trade Certified" },
    { id: "recycled_materials", label: "Recycled-Materials", src: recycled, title: "Made from Recycled Materials" },
];

const SearchResultsPage = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const fetchSearchResults = async () => {
            const query = new URLSearchParams(location.search).get("q");
            console.log("Search Query:", query)
            try {
                const response = await API.get("/products/search", {
                    params: { q: query },
                });
                console.log("API response:", response.data);
                setProducts(response.data)
            } catch (error) {
                console.error("Error fetching search results", error);
                setError("An error occurred while fetching search results")
            }
        };

        fetchSearchResults();
    }, [location.search]);

    return (
        <div>
            <Navbar />
            <div className="continer my-4">
                <h1 className="text-center mb-4">Search Results</h1>
                <div className="row">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div
                                key={product._id} // Use `_id` instead of `id`
                                className="product-card card text-center mb-3"
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
                                        <strong>Price:</strong> {product.price}
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
                                                    data-bs-title={icon.label}
                                                />
                                            ) : null;
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))
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

export default SearchResultsPage;