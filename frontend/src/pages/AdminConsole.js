import React, { useEffect, useState } from "react";
import API from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css"
import "./AdminConsole.css"


const AdminConsole = () => {
    const [products, setProducts] = useState([]);
    const [editingProductId, setEditingProductId] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");
    const [selectedProducts, setSelectedProducts] = useState([])

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

    useEffect(() => {
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