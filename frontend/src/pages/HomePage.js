import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/HomePage.scss"
import Logo from "../resources/ecocommercelogo.webp"

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="container-fluid my-4">
            <div className="logo-container">
                <img className="logo-actual" src={Logo} alt="EC" loading="lazy" fetchPriority="high"/>
            </div>
            <div className="hero-section-home text-center p-5">
                <h1 className="display-2 hero-text">
                    Find Better <strong className="eco-hero">Companies</strong> & <strong className="eco-hero">Products</strong> for the Planet.
                </h1>
                <p className="lead">
                    This site serves as a dedicated directory, making it easier for you to shop responsibly
                    and sustainably. Every company listed here is certified by reputable organizations
                    committed to preserving our planet's resources, promoting ethical practices, and
                    ensuring the fair treatment of workers and suppliers. The products we use daily have
                    a far-reaching impact—on us, the people who create them, and the environment. It's time
                    to prioritize companies that strive for excellence in sustainability and ethics, so we
                    can support a better future for everyone.
                </p>
            </div>
            <div className="nav-buttons">
                <button className="btn btn-dark products-btn" onClick={() => navigate("/products")}>Products</button>
                <button className="btn btn-dark companies-btn" onClick={() => navigate("/companies")}>Companies</button>
            </div>
        </div>
    )
}

export default HomePage