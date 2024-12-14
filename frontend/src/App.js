import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/ProductList";
import ProductDetailPage from "./pages/ProductDetailPage";
import AdminPage from "./pages/AdminPage";
import AdminConsole from "./pages/AdminConsole";
import CompaniesPage from "./pages/CompaniesPage";
import ProtectedRoute from "./services/ProtectedRoute";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/companies" element={<CompaniesPage />} />
                <Route path="/admin" element={<AdminPage onLogin={setIsAuthenticated} />} />
                <Route
                    path="/admin/products"
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <AdminConsole />
                        </ProtectedRoute>
                    }
                />      
                <Route path="/products/:id" element={<ProductDetailPage />} />
            </Routes>
        </Router>
    );
};

export default App;