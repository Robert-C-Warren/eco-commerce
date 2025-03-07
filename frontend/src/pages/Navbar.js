import React, { useEffect, useState } from "react"
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from "react-bootstrap"
import { useNavigate, Link } from "react-router-dom"
import smallLogo from "../resources/eclogo8.webp";
import "./styles/HomePage.scss"
import API_BASE_URL from "../components/urls";
import axios from "axios"

const CustomNavbar = () => {
    const [companyCategories, setCompanyCategories] = useState([])
    const [productCategories, setProductCategories] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const [companyRes, productRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/companies/categories`),  // ✅ Fetch company categories
                    axios.get(`${API_BASE_URL}/products/categories`)    // ✅ Fetch product categories
                ]);
    
                setCompanyCategories(companyRes.data || []);  // ✅ Ensure correct mapping
                setProductCategories(productRes.data || []);  // ✅ Ensure correct mapping
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
    
        fetchCategories();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/search?q=${searchQuery.trim()}`)
        }
    }

    return (
        <Navbar expand="lg" style={{ backgroundColor: "#62929E" }} className="sticky-top navbar">
            <Navbar.Brand as={Link} to="/">
                <img className="nav-logo" src={smallLogo} alt="EC" height="80" style={{ paddingLeft: "8%" }} />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav" style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} to="/products">Products</Nav.Link>
                    <Nav.Link as={Link} to="/companies">Companies</Nav.Link>
                    {/* <Nav.Link as={Link} to="/smallbusiness">Small Businesses</Nav.Link> */}
                    <Nav.Link as={Link} to="/contact">Contact</Nav.Link>

                    {/* Categories Dropdown */}
                    <NavDropdown title="Categories" id="categories-dropdown">
                        {/* Company Categories */}
                        <NavDropdown title="Company Categories" id="company-categories-dropdown">
                            {companyCategories.length > 0 ? (
                                companyCategories.map((category) => (
                                    <NavDropdown.Item as={Link} to={`/companies/category/${category}`} key={category}>
                                        {category}
                                    </NavDropdown.Item>
                                ))
                            ) : (
                                <NavDropdown.Item disabled>Loading...</NavDropdown.Item>
                            )}
                        </NavDropdown>
                        {/* Product Categories */}
                        <NavDropdown title="Product Categories" id="product-categories-dropdown">
                            {productCategories.length > 0 ? (
                                productCategories.map((category) => (
                                    <NavDropdown.Item as={Link} to={`/products/category/${category}`} key={category}>
                                        {category}
                                    </NavDropdown.Item>
                                ))
                            ) : (
                                <NavDropdown.Item disabled>Loading...</NavDropdown.Item>
                            )}
                        </NavDropdown>
                    </NavDropdown>
                </Nav>
                <Form className="d-flex" onSubmit={handleSearch}>
                    <FormControl
                        type="search"
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button variant="outline-success" type="submit" className="search-submit-btn" style={{ marginRight: "15px", color: "#3C3941", borderColor: "#3C3941" }}>
                        Search
                    </Button>
                </Form>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default CustomNavbar