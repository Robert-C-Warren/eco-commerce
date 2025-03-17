import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/AboutPage.scss";
import { FaBuilding, FaShoppingCart, FaCertificate, FaClock } from "react-icons/fa";
import API_BASE_URL from "../components/urls";

const LiveDashboard = () => {
    const [stats, setStats] = useState({
        totalCompanies: 0,
        totalProducts: 0,
        totalCertifications: 0,
        recentCompanies: []  // ✅ Ensures it's always an array
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [companiesRes, productsRes, certificationsRes, recentRes] = await Promise.all([
                    axios.get(`${API_BASE_URL}/companies/count`),
                    axios.get(`${API_BASE_URL}/products/count`),
                    axios.get(`${API_BASE_URL}/certifications/count`),
                    axios.get(`${API_BASE_URL}/companies/recent?limit=5`),
                ]);

                console.log("📊 Debug: API Responses", { companiesRes, productsRes, certificationsRes, recentRes });

                setStats({
                    totalCompanies: companiesRes.data.count ?? 0,
                    totalProducts: productsRes.data.count ?? 0,
                    totalCertifications: certificationsRes.data.count ?? 0,
                    recentCompanies: recentRes.data || []  // ✅ Default to an empty array
                });

            } catch (error) {
                console.error("❌ Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div className="live-dashboard">
            <h2 className="dashboard-title">Live EcoCommerce Stats</h2>
            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <FaBuilding className="dash-icon" />
                    <h3>{stats.totalCompanies}</h3>
                    <p>Companies Listed</p>
                </div>
                <div className="dashboard-card">
                    <FaShoppingCart className="dash-icon" />
                    <h3>{stats.totalProducts}</h3>
                    <p>Products Available</p>
                </div>
                <div className="dashboard-card">
                    <FaCertificate className="dash-icon" />
                    <h3>{stats.totalCertifications}</h3>
                    <p>Certifications Featured</p>
                </div>
                <div className="dashboard-card">
                    <FaClock className="dash-icon" />
                    <h3>Recent Companies</h3>
                    <ul className="recent-companies-list">
                        {stats.recentCompanies?.length > 0 ? (
                            stats.recentCompanies.map((company) => (
                                <li key={company._id}>{company.name}</li>
                            ))
                        ) : (
                            <li>No recent companies</li>  // ✅ Prevents empty mapping crash
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default LiveDashboard;
