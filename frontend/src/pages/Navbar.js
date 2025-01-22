import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import smallLogo from "../resources/eclogov2.svg"
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
    const categories = ["Cleaning", "Home", "Outdoor", "Pet", "Kitchen", "Personal Care"];
    const [searchQuery, setSearchQuery] = useState("")
    const navigate = useNavigate()

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?q=${searchQuery.trim()}`)
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">
                    <img src={smallLogo} alt="EC" height="60" />
                </a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collaps navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link to="/" className="nav-link">
                            Home
                        </Link>
                        </li>
                        <li className="nav-item">
                        <Link to="/companies" className="nav-link">
                            Companies
                        </Link>
                        </li>
                        <li className="nav-item">
                        <Link to="/email" className="nav-link">
                            Contact
                        </Link>
                        </li>

                        <li className="nav-item dropdown">
                            <button 
                                className="nav-link dropdown-toggle btn btn-link"
                                id="categoriesDropdown"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Categories
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="categoriesDropdown">
                                {categories.map((category) => (
                                    <li key={category}>
                                        <Link to={`/products/category/${category}`} className="dropdown-item">
                                            {category}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </ul>

                    <form className="d-flex" onSubmit={handleSearch}>
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
                </div>
            </div>
        </nav>
    )
}

export default Navbar