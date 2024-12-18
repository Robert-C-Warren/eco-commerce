import React from "react";
import "./ProductList.css"
import { Link } from "react-router-dom"
import smallLogo from "../resources/eco-commerce-logo.png";
import DarkModeToggle from "./DarkModeToggle";

const Navbar = () => {
    const categories = ["Cleaning", "Home", "Outdoor", "Pet", "Kitchen", "Personal Care"];

  return (
    <nav className="navbar sticky-top navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand d-flex align-items-center" href="/">
                        <img src={smallLogo} alt="Logo" width="50" height="35" className="d-inline-block align-text-top"/>
                        <span className="ms-2">Eco-Commerce</span>
                    </a>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarMenu"
                        aria-controls="navbarMenu"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarMenu">
                            <ul className="navbar-nav mb-2 mb-lg-0 ms-3">
                                <li class="nav-item">
                                    <a class="nav-link active" aria-current="page" href="/">Home</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link active" aria-current="page" href="/companies">Companies</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link active" aria-current="page" href="/email">Stay Updated</a>
                                </li>
                            </ul>

                        <li className="nav-item dropdown">
                            <a
                                className="nav-link active dropdown-toggle"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Categories
                            </a>
                            <ul className="dropdown-menu">
                                {categories.map((category) => (
                                    <li key={category}>
                                        <Link
                                            to={`/products/${category}`}
                                            className="dropdown-item"
                                        >
                                            {category}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </div>
                        <form className="d-flex" role="search">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">
                                Search
                            </button>
                        </form>
                    <DarkModeToggle />
                    </div>
            </nav>
  )
}

export default Navbar;