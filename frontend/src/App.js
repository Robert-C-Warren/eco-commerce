import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AdminPage from "./pages/AdminPage";
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
import AdminReportManager from "./pages/AdminReportManager";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);

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
                <Route path="/products" element={<HomePage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/products/details/:id" element={<ProductDetailPage />} />
                <Route path="/email" element={<SubscribePage />} />
                <Route path="/products/category/:category" element={<HomePage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/admin" element={<AdminPage onLogin={setIsAuthenticated} />} />
                {isAuthenticated ? (
                    <>
                        <Route path="/admin/products" element={<AdminConsole />} />
                        <Route path="/admin/companies" element={<AdminCompaniesPage />} />
                        <Route path="/admin/manage-reports" element={<AdminReportManager />} />
                        <Route path="*" element={<Navigate to="/admin/products" />} />
                    </>
                ) : (
                    <Route path="*" element={<Navigate to="/admin" />} />
                
                )}   
            </Routes>
        </>
    );
};

export default App;