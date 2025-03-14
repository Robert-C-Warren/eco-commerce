import React from "react";
import CompaniesPage from "./CompaniesPage";
import "./styles/CompaniesPage.scss"
import { useLocation } from "react-router-dom";

const SearchResultsPage = () => {
    const location = useLocation()
    const query = new URLSearchParams(location.search).get("q")

    return <CompaniesPage searchQuery={query} />
}

export default SearchResultsPage;