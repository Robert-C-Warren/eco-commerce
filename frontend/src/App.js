import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/ProductList";
import ProductDetailPage from "./pages/ProductDetailPage";
import AdminPage from "./pages/AdminPage";
import AdminConsole from "./pages/AdminConsole";
import CompaniesPage from "./pages/CompaniesPage";
import ProtectedRoute from "./services/ProtectedRoute";
import AdminCompaniesPage from "./pages/AdminCompaniesPage";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/companies" element={<CompaniesPage />} />
                <Route path="/admin" element={<AdminPage onLogin={setIsAuthenticated} />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route
                    path="/admin/products"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <AdminConsole />
                        </ProtectedRoute>
                    }
                />      
                <Route
                    path="/admin/companies"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <AdminCompaniesPage />
                        </ProtectedRoute>
                    }
                />      
            </Routes>
        </Router>
    );
};

export default App;