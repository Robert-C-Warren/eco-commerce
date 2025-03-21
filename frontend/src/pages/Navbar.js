import React, { useEffect, useState, useRef } from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import smallLogo from "../resources/eclogo8.webp";
import "./styles/HomePage.scss";
import API_BASE_URL from "../components/urls";
import axios from "axios";
import { Helmet } from "react-helmet";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min.js";
import { auth, signInWithGoogle, logOut } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

const CustomNavbar = () => {
  const [companyCategories, setCompanyCategories] = useState([]);
  const [productCategories, setProductCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [user] = useAuthState(auth);
  const navbarCollapseRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [companyRes, productRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/companies/categories`), // ✅ Fetch company categories
          axios.get(`${API_BASE_URL}/products/categories`), // ✅ Fetch product categories
        ]);

        setCompanyCategories(companyRes.data || []); // ✅ Ensure correct mapping
        setProductCategories(productRes.data || []); // ✅ Ensure correct mapping
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery.trim()}`);
      closeNavbar();
    }
  };

  const closeNavbar = () => {
    if (navbarCollapseRef.current) {
      const bsCollapse = new bootstrap.Collapse(navbarCollapseRef.current, {
        toggle: false,
      });
      bsCollapse.hide(); // ✅ Force navbar to collapse
    }

    // ✅ Ensure the toggler button is reset
    const toggler = document.querySelector(".navbar-toggler");
    if (toggler) {
      setTimeout(() => {
        if (!toggler.classList.contains("collapsed")) {
          toggler.click(); // ✅ Ensures next click opens navbar properly
        }
      }, 300); // Small delay to ensure Bootstrap state updates correctly
    }
  };

  return (
    <Navbar
      expand="lg"
      style={{ backgroundColor: "#62929E" }}
      className="sticky-top navbar"
    >
      <Helmet>
        <meta
          name="description"
          content="Find eco-friendly companies and sustainable products for responsible shopping"
        />
        <meta
          name="keywords"
          content="EcoCommerce, sustainable, eco-friendly, responsible shopping, ethical brands, 
                    b-corp products, best eco-friendly clothing companies, best eco-friendly jewelry companies, best eco-friendly food companies,
                    ethical sourcing, ethical brands, ethical clothing"
        />
      </Helmet>
      <Navbar.Brand as={Link} to="/">
        <img
          className="nav-logo"
          src={smallLogo}
          alt="EC"
          height="80"
          style={{ paddingLeft: "8%" }}
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse
        ref={navbarCollapseRef}
        id="navbar-nav"
        style={{ fontWeight: "bold", fontSize: "1.2rem" }}
      >
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/" onClick={closeNavbar}>
            Home
          </Nav.Link>
          <Nav.Link as={Link} to="/products" onClick={closeNavbar}>
            Products
          </Nav.Link>
          <Nav.Link as={Link} to="/companies" onClick={closeNavbar}>
            Companies
          </Nav.Link>
          {/* <Nav.Link as={Link} to="/smallbusiness" onClick={closeNavbar}>Small Businesses</Nav.Link> */}
          <Nav.Link as={Link} to="/contact" onClick={closeNavbar}>
            Contact
          </Nav.Link>
          <Nav.Link as={Link} to="/about" onClick={closeNavbar}>
            About
          </Nav.Link>

          {/* Categories Dropdown */}
          <NavDropdown title="Categories" id="categories-dropdown">
            {/* Company Categories */}
            <NavDropdown
              title="Company Categories"
              id="company-categories-dropdown"
            >
              {companyCategories.length > 0 ? (
                companyCategories.map((category) => (
                  <NavDropdown.Item
                    as={Link}
                    to={`/companies/category/${category}`}
                    key={category}
                    onClick={closeNavbar}
                  >
                    {category}
                  </NavDropdown.Item>
                ))
              ) : (
                <NavDropdown.Item disabled>Loading...</NavDropdown.Item>
              )}
            </NavDropdown>
            {/* Product Categories */}
            <NavDropdown
              title="Product Categories"
              id="product-categories-dropdown"
            >
              {productCategories.length > 0 ? (
                productCategories.map((category) => (
                  <NavDropdown.Item
                    as={Link}
                    to={`/products/category/${category}`}
                    key={category}
                    onClick={closeNavbar}
                  >
                    {category}
                  </NavDropdown.Item>
                ))
              ) : (
                <NavDropdown.Item disabled>Loading...</NavDropdown.Item>
              )}
            </NavDropdown>
          </NavDropdown>
          {user ? (
            <>
              <Nav.Link as={Link} to="/favorites">
                Favorites
              </Nav.Link>
              <Button className="logout-button" variant="danger" onClick={logOut}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="primary"
                className="me-2"
                onClick={() => navigate("/signin")}
              >
                Sign In
              </Button>
              <Button variant="success" onClick={() => navigate("/signup")}>
                Sign Up
              </Button>
            </>
          )}
        </Nav>
        <div className="search-bar-container">
          <Form className="d-flex search-bar" onSubmit={handleSearch}>
            <FormControl
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              variant="outline-success"
              type="submit"
              className="search-submit-btn"
              style={{
                marginRight: "15px",
                color: "#3C3941",
                borderColor: "#3C3941",
              }}
            >
              Search
            </Button>
          </Form>
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
