import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../services/api';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts()
            .then((response) => setProducts(response.data))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div>
            <h1>Eco-Friendly Products</h1>
            <ul>
                {products.map((product) => (
                    <li key={product._id}>
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                        <a href={product.link} target='_blank' rel='noopener norefferer'>Buy Now</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;