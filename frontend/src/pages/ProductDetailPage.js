import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import API from "../services/api";

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await API.get(`/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProduct();
const toggleVisibility = async (productId, currentVisibility) => {
    try {
        await API.patch(`/admin/products/${productId}`, { visible: !currentVisibility});
        fetchProduct();
    } catch (error) {
        console.error("Error updating visibilty:", error)
    }
}
    }, [id]);

    if (!product) return <p>Loading...</p>

    return (
        <div>
            <h1>{product.title}</h1>
            <p>Price: ${product.price}</p>
            <a href={product.url} target="_blank" rel="noopener noreferrer">
                View Product
            </a>
        </div>
    );
};

export default ProductDetailPage;