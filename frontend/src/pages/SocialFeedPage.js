import React, { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import axios from "axios"
import API_BASE_URL from "../components/urls"
import "./styles/SocialFeedPage.scss"

const SocialFeed = () => {
    const [companies, setCompanies] = useState([])

    useEffect(() => {
        axios
            .get(`${API_BASE_URL}/companies`)
            .then((res) => setCompanies(res.data))
            .catch((err) => console.error(err))
    }, [])

    return (
        <div className="social-feed-container">
            <Helmet>
                <title>EcoCommerce | About</title>
                <meta name="description" content={`Find eco-friendly ${companies} companies and sustainable products for responsible shopping`} />
                <meta name="keywords" content={`${companies}, EcoCommerce, sustainable, eco-friendly, responsible shopping, ethical brands, 
                    b-corp products, best eco-friendly clothing companies, best eco-friendly jewelry companies, best eco-friendly food companies,
                    ethical sourcing, ethical brands, ethical clothing`} />
            </Helmet>
            <h1 className="social-page-title">Company Social Media Activity</h1>
            <p className="social-description">Browse the latest updates from companies in the directory</p>
            
            {companies.map((company) => (
                <div key={company._id} className="company-social-section">
                    <h2 className="social-company-name">{company.name}</h2>

                    {/* Instagram Embed */}
                    {company.instagram ? (
                        <div className="social-embed">
                            <iframe src={`https://www.instagram.com/${company.instagram.replace(
                                "https://www.instagram.com/", "")}/embed/`} width="320" height="480"
                                allowTransparency="true" title={`${company.name} Instagram`}></iframe>
                        </div>
                    ) : (
                        <p>No Instagram Link Available</p>
                    )}
                </div>
            ))}
        </div>
    )
}

export default SocialFeed;