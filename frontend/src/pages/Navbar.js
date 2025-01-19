import { React } from "react";
import "./ProductList.css"
import { Link, useNavigate } from "react-router-dom"
import smallLogo from "../resources/eclogov2.svg";
import DarkModeToggle from "./DarkModeToggle";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Navbar = () => {
    const categories = ["Cleaning", "Home", "Outdoor", "Pet", "Kitchen", "Personal Care"];
    const [searchQuery, setSearchQuery] = useState("")
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${searchQuery.trim()}`)
        }
    };

  return (
    <nav className="navbar sticky-top navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand d-flex align-items-center" href="/">
                        <img src={smallLogo} alt="Logo" width="width" height="60" className="d-inline-block align-text-top"/>
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
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" href="/">Home</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" href="/companies">Companies</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link active" aria-current="page" href="/email">Stay Updated</a>
                                </li>
                            </ul>

                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                role="button"
                                id="dropdownMenuLink"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Categories
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                {categories.map((category) => (
                                    <li key={category}>
                                        <Link
                                            to={`/products/category/${category}`}
                                            className="dropdown-item"
                                        >
                                            {category}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </div>
                        <form className="d-flex" role="search" onSubmit={handleSearch}>
                            <input 
                                className="form-control me-2" 
                                type="search" 
                                placeholder="Search" 
                                aria-label="Search" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
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