import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminLogin from "./pages/AdminLogin";
import AdminConsole from "./pages/AdminConsole";
import CompaniesPage from "./pages/CompaniesPage";
import AdminCompaniesPage from "./pages/AdminCompaniesPage";
import SubscribePage from "./pages/SubscribePage"
import SearchResultsPage from "./pages/SearchResultsPage";
import ScrollToTop from "./components/ScrollToTop";
import CustomNavbar from "./pages/Navbar";
import ContactPage from "./pages/ContactPage";
import RecentCompaniesPage from "./pages/RecentCompaniesPage";
import CompaniesByCategory from "./pages/CompaniesByCategory";
import ProductsPage from "./pages/ProductsPage";
import ProductsByCategory from "./pages/ProductsByCategory";
import AdminTransparencyForm from "./pages/AdminTransparencyForm";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRegister from "./pages/AdminRegister"
import AboutPage from "./pages/AboutPage";
import FavoritesPage from "./pages/FavoritesPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Nav } from "react-bootstrap";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const mfaToken = sessionStorage.getItem("mfaToken");
        setIsAuthenticated(!!mfaToken); // ✅ Update authentication state when MFA is set
    }, []);


    return (
        <>
            <CustomNavbar />
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/companies" element={<CompaniesPage collection="companies" />} />
                <Route path="/smallbusiness" element={<CompaniesPage collection="smallbusiness" />} />
                <Route path="/companies/recent" element={<RecentCompaniesPage />} />
                <Route path="/companies/category/:categoryName" element={<CompaniesByCategory />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/category/:categoryName" element={<ProductsByCategory />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/email" element={<SubscribePage />} />
                {/* <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/favorites" element={<FavoritesPage />} /> */}
                <Route path="/products/category/:category" element={<HomePage />} />
                <Route path="/search" element={<SearchResultsPage />} />

                {/* Admin login route */}
                <Route path="/admin/login" element={<AdminLogin onLogin={setIsAuthenticated} />} />
                <Route path="/admin/register" element={<AdminRegister />} />

                {/* Protected admin routes */}
                <Route path="/admin/*" element={<ProtectedRoute isAuthenticated={isAuthenticated}/>}>
                    <Route path="products" element={<AdminConsole />} />
                    <Route path="companies" element={<AdminCompaniesPage />} />
                    <Route path="index" element={<AdminTransparencyForm />} />
                    <Route index element={<Navigate to="login" replace />} />
                </Route>

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

export default App;