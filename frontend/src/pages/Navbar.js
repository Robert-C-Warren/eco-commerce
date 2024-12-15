import React from "react";
import "./ProductList.css"
import smallLogo from "../resources/eco-commerce-logo.png";
import DarkModeToggle from "./DarkModeToggle";

const Navbar = () => {
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
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="/">
                                    Home
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/companies">
                                    Companies
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/email">
                                    Stay Updated
                                </a>
                            </li>
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="#"
                                    id="categoriesDropdown"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    Categories
                                </a>
                                <ul className="dropdown-menu" aria-labelledby="categoriesDropdown">
                                    <li>
                                        <a className="dropdown-item" href="/categories/cleaning">
                                            Cleaning
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="/categories/home">
                                            Home
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="/categories/outdoor">
                                            Outdoor
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="/categories/pet">
                                            Pet
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="/categories/kitchen">
                                            Kitchen
                                        </a>
                                    </li>
                                    <li>
                                        <a className="dropdown-item" href="/categories/personalcare">
                                            Personal Care
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                        <form className="d-flex" role="search">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                            <button className="btn btn-outline-success" type="submit">
                                Search
                            </button>
                        </form>
                    <DarkModeToggle />
                    </div>
                </div>
            </nav>
  )
}

export default Navbar;