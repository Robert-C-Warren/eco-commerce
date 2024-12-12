import React, { useEffect, useState } from "react";
import API from "../services/api";
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
        <div className="container my-4">
            <h1 className="mb-4">Admin Console</h1>
            <button onClick={showSelectedProducts} className="btn btn-primary mb-3">
                Show All on Site 
            </button>
            <div className="row gy-4">
                {products.map((product) => 
                    <div key={product.id} className="col-md-4">
                        <div className="card">
                            <div className="card-body">
                                <div className="form-check mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={selectedProducts.includes(product._id)}
                                        onChange={() => toggleProductSelected(product._id)}
                                        style={{ transform: "scale(1.5)"}}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>    
                )}
            </div>
        </div>
    );
};

export default AdminConsole;