import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/ProductList";
import ProductDetailPage from "./pages/ProductDetailPage";
import AdminPage from "./pages/AdminPage";
import AdminConsole from "./pages/AdminConsole";
import CompaniesPage from "./pages/CompaniesPage";
import AdminCompaniesPage from "./pages/AdminCompaniesPage";
import SubscribePage from "./pages/SubscribePage"
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/companies" element={<CompaniesPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/email" element={<SubscribePage />} />
                <Route path="/admin" element={<AdminPage onLogin={setIsAuthenticated} />} />
                {isAuthenticated ? (
                    <>
                        <Route path="/admin/products" element={<AdminConsole />} />
                        <Route path="/admin/companies" element={<AdminCompaniesPage />} />
                        <Route path="*" element={<Navigate to="/admin/products" />} />
                    </>
                ) : (
                    <Route path="*" element={<Navigate to="/admin" />} />
                
                )}   
            </Routes>
        </Router>
    );
};

export default App;