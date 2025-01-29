import React, { useState } from "react"
import { Navbar, Nav, NavDropdown, Form, FormControl, Button } from "react-bootstrap"
import { useNavigate, Link } from "react-router-dom"
import smallLogo from "../resources/eclogov7.svg";


const CustomNavbar = () => {
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
        <Navbar expand="lg" style={{ backgroundColor: "#A3BBAD"}}>
            <Navbar.Brand as={Link} to="/">
                <img src={smallLogo} alt="EC" height="80"/>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav" style={{ fontWeight: "bold", fontSize: "1.5rem"}}>
                <Nav className="me-auto">
                    <Nav.Link as={Link} to="/">
                        Home
                    </Nav.Link>
                    <Nav.Link as={Link} to="/companies">
                        Companies
                    </Nav.Link>
                    <Nav.Link as={Link} to="/contact">
                        Contact
                    </Nav.Link>
                    <NavDropdown title="Categories" id="categories-dropdown">
                        {categories.map((category) => (
                            <NavDropdown.Item as={Link} to={`/products/category/${category}`} key={category}>
                                {category}
                            </NavDropdown.Item>
                        ))}
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
                    <Button variant="outline-success" type="submit" style={{ marginRight: "15px"}}>
                        Search
                    </Button>
                </Form>
            </Navbar.Collapse>
        </Navbar>
    )
}

export default CustomNavbar