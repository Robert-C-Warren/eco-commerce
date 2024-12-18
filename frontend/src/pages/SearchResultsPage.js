import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import API from "../services/api";

const SearchResultsPage = () => {
    const [products, setProducts] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const fetchSearchResults = async () => {
            const query = new URLSearchParams(location.search).get("q");
            try {
                const response = await API.get("/products/search", {
                    params: { q: query },
                });
                setProducts(response.data)
            } catch (error) {
                console.error("Error fetching search results", error);
            }
        };

        fetchSearchResults();
    }, [location.search]);

    return (
        <div className="continer my-4">
            <h1 className="text-center mb-4">Search Results</h1>
            <div className="row">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product._id} className="col-lg-4 col-md-6 col-sm-12 mb-4">
                            <div className="card">
                                <img
                                    src={product.image}
                                    alt={product.title || "Product"}
                                    className="card-img-top"
                                    style={{ height: "200px", objectFit: "cover"}}
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{product.title}</h5>
                                    <p className="card-text">
                                        <strong>Price:</strong> ${product.price.toFixed(2)}
                                    </p>
                                    <a
                                        href={`/products/details/${product._id}`}
                                        className="btn btn-primary"
                                    >
                                        View details
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No Matching Products</p>
                )}
            </div>
        </div>
    )
}

export default SearchResultsPage;