import React from 'react';
import './styles/AboutPage.scss';
import LongLogo from '../resources/ecocommercelogo.webp';
import { Helmet } from "react-helmet";

const AboutPage = () => (
    <div className="container about-page">
        <Helmet>
            <title>EcoCommerce | About</title>
            <meta name="description" content="Find eco-friendly companies and sustainable products for responsible shopping" />
            <meta name="keywords" content="EcoCommerce, sustainable, eco-friendly, responsible shopping, ethical brands, 
                b-corp products, best eco-friendly clothing companies, best eco-friendly jewelry companies, best eco-friendly food companies,
                ethical sourcing, ethical brands, ethical clothing" />
        </Helmet>
        <div className="my-5">
            <h1 className="text-center about-title">About <img src={LongLogo} className='worded-logo' /></h1>
            <p className='section-1'>
                EcoCommerce is your trusted guide for discovering eco-friendly and ethically responsible companies
                and their products. Our platform serves as a comprehensive directory designed to empower consumers
                to easily find and support businesses committed to sustainability, fair labor practices, and
                environmental responsibility. Every company featured on our site has been thoughtfully evaluated,
                providing clarity and confidence in your eco-conscious shopping choices.
            </p>
            <p className='section-2'>
                EcoCommerce was created to help you make informed purchasing decisions without cost, tracking,
                or monetization. We do not charge fees, use cookies, or earn revenue from the platform. Our sole
                mission is to offer accessible, unbiased information on companies actively working to protect the
                planet and promote ethical business practices.
            </p>
            <div className='highlights-container'>
                <h3 className='ecocommerce-highlights'>Highlights:</h3>
                <ul>
                    <li>Prioritizing sustainability and environmental stewardship</li>
                    <li>Advocating for ethically sourced and responsibly manufactured products</li>
                    <li>Transparent presentation of sustainability practices and scores</li>
                    <li>Commitment to ethical practices within supply chains</li>
                    <li>Empowering consumer choices with clear and actionable insights</li>
                    <li>Free, unbiased, and not monetized</li>
                </ul>
            </div>
            <p className='section-4'>
                We invite you to explore our curated directory and support businesses making genuine efforts to protect the planet and respect their workers and suppliers.
            </p>
        </div>
    </div>
);

export default AboutPage;