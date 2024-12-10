import React, { useEffect, useState } from "react";
import API from "../services/api";
import "./AdminConsole.css"


const AdminConsole = () => {
    const [products, setProducts] = useState([]);

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

    const deleteProduct = async (productId) => {
        try {
            await API.delete(`/admin/products/${productId}`);
            setProducts(products.filter((product) => product._id !== productId));
        } catch (error) {
            console.error("Error deleting product:", error)
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div className="admin-console">
            <h1>Admin Console</h1>
            <div className="product-list">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        <img src={product.image} alt={product.title} />
                        <h6>{product.title}</h6>
                        <p>Price: {product.price}</p>
                        <p>Source: {product.source}</p>
                        <a href={product.url} target="_blank" rel="noopener noreferrer">
                            View Product
                        </a>
                        <button
                            onClick={() => toggleVisibility(product._id, product.visible)}
                            className={product.visible ? "btn-hide" : "btn-show"}
                        >
                            {product.visible ? "Hide from Site" : "Show on Site"}
                        </button>
                        <button
                            onClick={() => deleteProduct(product._id)}
                            className="btn-delete"
                        >
                            Delete
                        </button>
                    </div>    
                ))}
            </div>
        </div>
    );
};

export default AdminConsole;