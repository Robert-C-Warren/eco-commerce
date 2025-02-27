import React, { useEffect, useState } from "react";
import API from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./AdminConsole.css"
import { ToastContainer, toast } from "react-toastify"
import { Link } from "react-router-dom";
import API_BASE_URL from "../components/urls"
import bCorpIcon from "../resources/icons/bcorp.png"
import smallBusinessIcon from "../resources/icons/handshake.png"
import veganIcon from "../resources/icons/veganlogo.png"
import biodegradableIcon from "../resources/icons/leaf.png"
import fairTradeIcon from "../resources/icons/trade.png"
import recycled from "../resources/icons/recycle.svg"
import fla from "../resources/icons/flalogo.png";
import cascale from "../resources/icons/cascalelogo.png";
import oneForThePlanet from "../resources/icons/1planetlogo.svg"
import sai from "../resources/icons/sailogo.png"
import changeclimate from "../resources/icons/changeclimatelogo.png"
import RAINN from "../resources/icons/RAINNlogo.png"
import oneTreePlanted from "../resources/icons/onetreeplantedlogo.svg"
import ecovadis from "../resources/icons/ecovadislogo.svg"
import peruvianHearts from "../resources/icons/peruvianheartslogo.png"
import seaLegacy from "../resources/icons/sealegacy.svg"
import GOTS from "../resources/icons/gotslogo.png"
import bluesign from "../resources/icons/bluesignlogo.svg"
import jettyrockfoundation from "../resources/icons/jettyrockfoundationlogo.png"
import epagreenpower from "../resources/icons/epagreenpowerlogo.svg"
import asbc from "../resources/icons/asbclogo.svg"
import crueltyFree from "../resources/icons/crueltyfreelogo.svg"
import ECOLOGO from "../resources/icons/ecologologo.png"
import fscLogo from "../resources/icons/fsclogo.svg"
import rainforestAlliance from "../resources/icons/rainforestalliancelogo.png"
import ewg from "../resources/icons/ewglogo.svg"
import nongmo from "../resources/icons/nongmologo.jpeg"
import greenAmerica from "../resources/icons/greenamericalogo.png"
import safecosmetics from "../resources/icons/safecosmeticslogo.png"
import reefsafe from "../resources/icons/reefsafelogo.png"
import leed from "../resources/icons/leedlogo.png"
import energystar from "../resources/icons/energystarlogo.svg"
import cradletocradle from "../resources/icons/cradletocradle.png"
import MSC from "../resources/icons/msclogo.png"
import BAP from "../resources/icons/baplogo.svg"
import GRS from "../resources/icons/grslogo.svg"
import WFTO from "../resources/icons/wftologo.svg"
import LWG from "../resources/icons/lwglogo.png"
import FLA from "../resources/icons/flalogo.jpeg"
import SCA from "../resources/icons/scalogo.png"
import PSC from "../resources/icons/psclogo.png"
import fairWear from "../resources/icons/fairwearlogo.jpg"
import scsGlobal from "../resources/icons/scsglobalserviceslogo.svg"
import SDG from "../resources/icons/sdglogo.png"
import globalGood from "../resources/icons/globalgoodlogo.png"
import SolarAid from "../resources/icons/solaraidlogo.png"
import ipso from "../resources/icons/ipsologo.png"
import realSeal from "../resources/icons/realseallogo.jpeg"
import DFA from "../resources/icons/dfalogo.png"
import GAP from "../resources/icons/gaplogo.png"
import certifiedHumane from "../resources/icons/certifiedhumanelogo.png"
import oceanCycle from "../resources/icons/oceancyclelogo.png"
import sdvosb from "../resources/icons/sdvosblogo.png"
import madeSafe from "../resources/icons/madesafelogo.png"
import nsfansi from "../resources/icons/nsfansilogo.svg"
import WRAP from "../resources/icons/wraplogo.svg"
import ISO from "../resources/icons/isologo.svg"
import SWA from "../resources/icons/swalogo.jpeg"
import soil from "../resources/icons/soilassociationlogo.jpg"
import napaGreen from "../resources/icons/napagreenlogo.png"
import CSWA from "../resources/icons/sustainablewinegrowinglogo.svg"
import OEKO from "../resources/icons/oekotexlogo.svg"
import goodWeave from "../resources/icons/goodweavelogo.png"
import compostable from "../resources/icons/compostablelogo.svg"
import Agave from "../resources/icons/agavelogo.png"
import MCS from "../resources/icons/marineconservationlogo.gif"
import jpma from "../resources/icons/jpmalogo.png"
import carbonNeutral from "../resources/icons/carbonneutrallogo.png"
import usdaOrganic from "../resources/icons/usdaorganiclogo.gif"
import craftDistillery from "../resources/icons/craftdistillery.png"
import ecoboard from "../resources/icons/ecoboardlogo.png"
import GIA from "../resources/icons/gialogo.svg"
import RJC from "../resources/icons/rjclogo.png"
import CCIB from "../resources/icons/cciblogo.png"
import WBENC from "../resources/icons/wbenclogo.svg"
import blueAngel from "../resources/icons/blueangellogo.svg"
import BRCGS from "../resources/icons/brcgslogo.png"
import greenGuard from "../resources/icons/greenguardlogo.png"
import sfc from "../resources/icons/sfclogo.svg"
import nasc from "../resources/icons/nasclogo.svg"
import BPI from "../resources/icons/bpilogo.svg"
import okCompost from "../resources/icons/okcompostlogo.jpg"
import floristry from "../resources/icons/floristrylogo.webp"
import LIVE from "../resources/icons/livelogo.svg"
import salmonSafe from "../resources/icons/salmonsafelogo.jpg"
import OMRI from "../resources/icons/omrilogo.png"
import AWG from "../resources/icons/awglogo.png"
import fairmined from "../resources/icons/fairminedlogo.png"
import ecolabel from "../resources/icons/ecolabellogo.jpg"
import PDO from "../resources/icons/pdologo.jpg"
import NFF from "../resources/icons/nfflogo.svg"
import climateNeutral from "../resources/icons/climateneutrallogo.png"

const availableIcons = [
    { id: "b_corp", label: "B Corp", src: bCorpIcon, title: "Certified B Corporation" },
    { id: "small_business", label: "Small Business", src: smallBusinessIcon, title: "Small Business" },
    { id: "vegan", label: "Vegan", src: veganIcon, title: "Vegan" },
    { id: "biodegradable", label: "Biodegradable", src: biodegradableIcon, title: "Biodegradable" },
    { id: "fair_trade", label: "Fair-Trade", src: fairTradeIcon, title: "Fair-Trade Certified" },
    { id: "recycled_materials", label: "Recycled-Materials", src: recycled, title: "Made from Recycled Materials" },
    { id: "fla_association", label: "Fair Labor Association", src: fla, title: "Fair Labor Association Member" },
    { id: "cascale", label: "Cascale", src: cascale, title: "Cascale" },
    { id: "1_for_the_planet", label: "1% For The Planet", src: oneForThePlanet, title: "1% For The Planet" },
    { id: "social_accountability_international", label: "Social Accountability International (SAI)", src: sai, title: "Social Accountability International (SAI)" },
    { id: "change_climate", label: "Change Climate", src: changeclimate, title: "Change Climate" },
    { id: "RAINN_logo", label: "RAINN (Rape, Abuse & Incest National Network)", src: RAINN, title: "RAINN" },
    { id: "One_Tree_Planted_Logo", label: "One Tree Planted", src: oneTreePlanted, title: "One Tree Planted" },
    { id: "EcoVadis_logo", label: "EcoVadis", src: ecovadis, title: "EcoVadis" },
    { id: "Peruvian_Hearts_logo", label: "Peruvian Hearts", src: peruvianHearts, title: "Peruvian Hearts" },
    { id: "SeaLegacy_logo", label: "SeaLegacy", src: seaLegacy, title: "SeaLegacy" },
    { id: "GOTS_logo", label: "GOTS (Global Organic Textile Standard)", src: GOTS, title: "GOTS" },
    { id: "bluesign_logo", label: "bluesign", src: bluesign, title: "bluesign" },
    { id: "jetty_rock_foundation_logo", label: "Jetty Rock Foundation", src: jettyrockfoundation, title: "Jetty Rock Foundation" },
    { id: "epa_green_power_logo", label: "EPA Green Power Partner", src: epagreenpower, title: "EPA Green Power Partner" },
    { id: "asbc_logo", label: "ASBC (American Sustainable Business Council)", src: asbc, title: "ASBC" },
    { id: "cruelty_free_logo", label: "Cruelty Free", src: crueltyFree, title: "Cruelty Free" },
    { id: "ECOLOGO_logo", label: "ECOLOGO", src: ECOLOGO, title: "ECOLOGO" },
    { id: "fsc_logo", label: "FSC (Forest Stewardship Council) Certified", src: fscLogo, title: "fsc" },
    { id: "rainforest_alliance_logo", label: "Rainforest Alliance Certified", src: rainforestAlliance, title: "Rainforest Alliance" },
    { id: "ewg_logo", label: "EWG (Environmental Working Group) Verified", src: ewg, title: "EWG" },
    { id: "nongmo_logo", label: "Non-GMO Project Certified", src: nongmo, title: "nongmo" },
    { id: "greenamerica_logo", label: "Green America Certified", src: greenAmerica, title: "Green America" },
    { id: "safe_cosmetics_logo", label: "Safe Cosmetics Certified", src: safecosmetics, title: "Safe Cosmetics" },
    { id: "reef_safe_logo", label: "Reef-Safe Certified", src: reefsafe, title: "Reef Safe" },
    { id: "leed_logo", label: "LEED Certified", src: leed, title: "LEED Certified" },
    { id: "energy_star_logo", label: "Energy Star Certified", src: energystar, title: "Energy Star Certified" },
    { id: "cradle_to_cradle_logo", label: "Cradle To Cradle Certified", src: cradletocradle, title: "Cradle to Cradle Certified" },
    { id: "msc_logo", label: "MSC (Marine Stewardship Council) Certified", src: MSC, title: "MSC" },
    { id: "bap_logo", label: "BAP (Best Aquaculture Practices) Certified", src: BAP, title: "BAP" },
    { id: "grs_logo", label: "GRS (Global Recycling Standard) Certified", src: GRS, title: "GRS" },
    { id: "wfto_logo", label: "WFTO (World Fair Trade Organization) Guaranteed", src: WFTO, title: "WFTO" },
    { id: "lwg_logo", label: "LWG (Leather Working Group) Gold Certification", src: LWG, title: "LWG" },
    { id: "fla_logo", label: "FLA (Fair Labor Association) Accredidation", src: FLA, title: "FLA" },
    { id: "sca_logo", label: "SCA (Specialty Coffee Association) Standards", src: SCA, title: "SCA" },
    { id: "psc_logo", label: "PSC (Pet Sustainability Coalition) Member", src: PSC, title: "PSC" },
    { id: "fair_wear_logo", label: "Fair Wear Foundation Member", src: fairWear, title: "Fair Wear" },
    { id: "scs_global_logo", label: "SCS Global Zero-Waste-to-Landfill", src: scsGlobal, title: "SCS Global" },
    { id: "sdg_logo", label: "SDGs (Sustainable Development Goals) Alignment", src: SDG, title: "SDG" },
    { id: "global_good_logo", label: "Global Good Awards Recognition", src: globalGood, title: "Global Good" },
    { id: "solar_aid_logo", label: "SolarAid Partnership Certification", src: SolarAid, title: "SolarAid" },
    { id: "ipso_logo", label: "IPSO Gold Award", src: ipso, title: "IPSO" },
    { id: "real_seal_logo", label: "REAL Seal Certification", src: realSeal, title: "realSeal" },
    { id: "dfa_logo", label: "Dairy Farmers of America (DFA) Membership", src: DFA, title: "DFA" },
    { id: "gap_logo", label: "Global Animal Partnership (GAP) Certification", src: GAP, title: "GAP" },
    { id: "certified_humane_logo", label: "Certified Humane", src: certifiedHumane, title: "Certified Humane" },
    { id: "ocean_cycle_logo", label: "OceanCycle Certification", src: oceanCycle, title: "OceanCycle" },
    { id: "sdvosb_logo", label: "Service-Disabled Veteran-Owned Small Business (SDVOSB)", src: sdvosb, title: "SVOSB" },
    { id: "made_safe_logo", label: "MADE SAFE Certified", src: madeSafe, title: "MADE SAFE" },
    { id: "nsf_ansi_logo", label: "NSF/ANSI International Standards Compliance", src: nsfansi, title: "nsfansi" },
    { id: "wrap_logo", label: "Worldwide Responsible Accredited Production (WRAP) Certification", src: WRAP, title: "WRAP" },
    { id: "iso_logo", label: "ISO 14001 Environmental Management Certified", src: ISO, title: "ISO" },
    { id: "swa_logo", label: "Member of the Scotch Whisky Association's Environmental Charter", src: SWA, title: "SWA" },
    { id: "soil_logo", label: "Certified Organic by the Soil Association", src: soil, title: "Soil Association" },
    { id: "napa_green_logo", label: "Napa Green Certified Winery", src: napaGreen, title: "Napa Green" },
    { id: "sustainable_winegrowing_logo", label: "Sustainable Winegrowing Certification", src: CSWA, title: "Sustainable Winegrowing" },
    { id: "oeko_tex_logo", label: "OEKO-TEX Standard 100 Certified", src: OEKO, title: "OEKO-TEX" },
    { id: "good_weave_logo", label: "GoodWeave Certified", src: goodWeave, title: "GoodWeave" },
    { id: "compostable_logo", label: "Certified Compostable", src: compostable, title: "Compostable" },
    { id: "100%_agave_logo", label: "Certified 100% Agave Tequila", src: Agave, title: "Agave" },
    { id: "mcs_logo", label: "Recognized by the Marine Conservation Society", src: MCS, title: "MSC" },
    { id: "jpma_logo", label: "Juvenile Products Manufacturers Association (JPMA)", src: jpma, title: "jpma" },
    { id: "carbon_neutral_logo", label: "Certified Carbon-Neutral", src: carbonNeutral, title: "Carbon Neutral" },
    { id: "usda_organic_logo", label: "USDA Organic Certification", src: usdaOrganic, title: "USDA Organic" },
    { id: "craft_distillery_logo", label: "Certified Craft Distillery", src: craftDistillery, title: "Craft Distillery" },
    { id: "ecoboard_logo", label: "ECOBOARD Project Certified", src: ecoboard, title: "ecoboard logo" },
    { id: "gia_logo", label: "GIA (Gemological Institute of America) Certified lab-grown diamonds", src: GIA, title: "GIA" },
    { id: "rjc_logo", label: "Responsible Jewellery Council (RJC) Member", src: RJC, title: "RJC" },
    { id: "ccib_logo", label: "Member of the Canadian Council for Aboriginal Business", src: CCIB, title: "CCIB" },
    { id: "wbenc_logo", label: "WBENC Certification", src: WBENC, title: "wbenc" },
    { id: "blue_angel_logo", label: "Blue Angel Certification", src: blueAngel, title: "Blue Angel" },
    { id: "brcgs_logo", label: "BRC Certification", src: BRCGS, title: "BRCGS" },
    { id: "greenguard_logo", label: "GREENGUARD Certified", src: greenGuard, title: "Greenguard" },
    { id: "sfc_logo", label: "Sustainable Furnishings Council (SFC) Member", src: sfc, title: "SFC" },
    { id: "nasc_logo", label: "Certified by National Animal Supplement Council (NASC)", src: nasc, title: "NASC" },
    { id: "bpi_logo", label: "BPI (Biodegradable Products Institute) Certified", src: BPI, title: "BPI" },
    { id: "ok_compost_logo", label: "OK Compost Certified", src: okCompost, title: "OK Compost" },
    { id: "floristry_logo", label: "Sustainable Floristry Certification", src: floristry, title: "floristry" },
    { id: "live_logo", label: "LIVE Certified Sustainable", src: LIVE, title: "LIVE" },
    { id: "salmon_safe_logo", label: "Salmon-Safe Certified", src: salmonSafe, title: "Salmon Safe" },
    { id: "omri_logo", label: "OMRI (Organic Materials Review Institute) Listed", src: OMRI, title: "OMRI" },
    { id: "awg_logo", label: "Animal Welfare Approved", src: AWG, title: "AWG" },
    { id: "fairmined_logo", label: "Fairmined Certified", src: fairmined, title: "fairmined" },
    { id: "ecolabel_logo", label: "EU Ecolabel Certified", src: ecolabel, title: "ecolabel" },
    { id: "pdo_logo", label: "Protected Designation of Origin (PDO) Certified", src: PDO, title: "PDO" },
    { id: "nff_logo", label: "National Forest Foundation", src: NFF, title: "NFF" },
    { id: "climate_neutral_logo", label: "Climate Neutral Certified", src: climateNeutral, title: "Climate Neutral" },
]

const availableCategories = ["Accessories", "Beverage", "Cleaning", "Clothing", "Food", "Home", "Kitchen", "Outdoor", "Personal Care", "Pet"]

const AdminConsole = () => {
    const [companies, setCompanies] = useState([])
    const [productsByCompany, setProductsByCompany] = useState({})
    const [newProduct, setNewProduct] = useState({
        title: "",
        website: "",
        image: "",
        company: "",
        category: "",
        price: ""
    })
    const [filteredCompanies, setFilteredCompanies] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCompany, setSelectedCompany] = useState("")
    const sanitizeId = (name) => name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-_]/g, '');
    const [expandedCompany, setExpandedCompany] = useState(null)

    const fetchProducts = async () => {
        try {
            const response = await API.get(`${API_BASE_URL}/products`);
            const data = response.data.data || response.data; // Handle nested responses

            console.log("API Response Data:", data); // Log response

            const formattedProducts = {};
            data.forEach(group => {
                if (group._id && Array.isArray(group.products)) {
                    formattedProducts[group._id] = group.products.map(product => ({
                        _id: product._id,
                        title: product.title,
                        website: product.website, // ✅ Ensure 'link' is included
                        category: product.category,
                        image: product.image,
                        price: product.price,
                    }));
                } else {
                    console.warn("Unexpected group format:", group);
                }
            });

            console.log("Formatted Products with Links:", formattedProducts); // Log transformed data
            setProductsByCompany(formattedProducts);
        } catch (error) {
            console.error("Error fetching products:", error.response ? error.response.data : error);
        }
    };

    const fetchCompanies = async () => {
        try {
            const response = await API.get(`${API_BASE_URL}/companies`)
            setCompanies(response.data)
        } catch (error) {
            console.error("Error fetching companies:", error)
        }
    }

    useEffect(() => {
        fetchProducts()
        fetchCompanies()
    }, [])

    useEffect(() => {
        if (searchTerm) {
            const results = companies.filter(company =>
                company.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setFilteredCompanies(results)
        } else {
            setFilteredCompanies([])
        }
    }, [searchTerm, companies])

    useEffect(() => {
        const interval = setInterval(updateButtonColors, 500)
        return () => clearInterval(interval)
    })

    const handleCompanySelect = (company) => {
        setSelectedCompany(company.name)
        setNewProduct({ ...newProduct, company: company.name })
        setSearchTerm("")
        setFilteredCompanies([])
    }

    const addProduct = async () => {
        try {
            const response = await API.post(`${API_BASE_URL}/products`, newProduct, {
                headers: { "Content-Type": "application/json" }
            });

            // Axios already parses JSON, use response.data
            const data = response.data;

            // Check if the request was successful (status 200-299)
            toast.success("Product added successfully", { autoClose: 2000 });

            // ✅ Reset form state properly
            setNewProduct({
                title: "",
                price: "",
                website: "",
                image: "",
                company: "",
                category: "",
            });

            setSelectedCompany(""); // Reset selected company
            fetchProducts(); // Refresh the product list

        } catch (error) {
            console.error("Error adding product", error);
            toast.error("Failed to add product", { autoClose: 2000 });
        }
    };

    const toggleCollapse = (company) => {
        setExpandedCompany(prev => (prev === company ? null : company))
    }

    function updateButtonColors() {
        const buttons = document.querySelectorAll('.company-button-container button')
        buttons.forEach((button, index) => {
            if (index % 2 === 0) {
                button.style.backgroundColor = '#357266';
            } else {
                button.style.backgroundColor = '#37be59'
            }
            button.style.color = 'white'
        })
    }

    return (
        <div className="admin-container mt-4">
            <ToastContainer />
            <h1 className="text-center mb-4">Admin Console - Manage Products</h1>
            <div className="admin-nav-btns">
                <div className="admin-companies-btn">
                    <Link to="/admin/companies" className="btn btn-secondary mb-3">Admin Companies</Link>
                </div>
                <div className="index-btn">
                    <Link to="/admin/index" className="btn btn-secondary mb-3">Admin Sustainability Index</Link>
                </div>
            </div>

            <div className="new-product-card p-4 mb-4">
                <h3>Add New Product</h3>
                <form onSubmit={(e) => { e.preventDefault(); addProduct(); }} className="new-product-form">
                    {/* Title */}
                    <input type="text" className="form-control mb-2" placeholder="Title"
                        value={newProduct.title} onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })} />
                    {/* Price */}
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Price"
                        value={newProduct.price}
                        onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers & .
                            setNewProduct({ ...newProduct, price: value });
                        }}
                        onBlur={(e) => {
                            let priceValue = e.target.value;
                            if (priceValue && !priceValue.startsWith("$") && !isNaN(priceValue)) {
                                priceValue = `$${parseFloat(priceValue).toFixed(2)}`; // Convert to $X.XX format
                                setNewProduct({ ...newProduct, price: priceValue });
                            }
                        }}
                    />
                    {/* Website */}
                    <input className="form-control mb-2" placeholder="Website"
                        value={newProduct.website} onChange={(e) => setNewProduct({ ...newProduct, website: e.target.value })}></input>
                    {/* Image URL */}
                    <input type="text" className="form-control mb-2" placeholder="Image URL"
                        value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} />
                    {/* Company */}
                    <div className="position-relative">
                        <input type="text" className="form-control mb-2" placeholder="Company" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        {filteredCompanies.length > 0 && (
                            <ul className="list-group position-absolute w-100 bg-white shadow">
                                {filteredCompanies.length > 0 && (
                                    <ul className="list-group position-absolute w-100 bg-white shadow">
                                        {filteredCompanies.map((company) => (
                                            <li
                                                key={company._id}
                                                className="list-group-item list-group-item-action"
                                                onClick={() => handleCompanySelect(company)}
                                                style={{ cursor: "pointer" }}
                                            >
                                                {company.name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </ul>
                        )}
                    </div>
                    {selectedCompany && (
                        <div className="alert alert-success mt-2">
                            <strong>{selectedCompany}</strong>
                        </div>
                    )}
                    {/* Category */}
                    <select className="form-control mb-2" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}>
                        <option value="">Select Category</option>
                        {availableCategories.map(category => <option key={category} value={category}>{category}</option>)}
                    </select>
                    <button type="submit" className="btn btn-success w-100 add-product-btn">Add Product</button>
                </form>
            </div>
            {Object.keys(productsByCompany).map(company => {
                const isExpanded = expandedCompany === company;
                return (
                    <div key={company} className="mb-4 company-button-container">
                        <button
                            className="btn btn-info w-100 text-start company-button"
                            type="button"
                            aria-expanded={isExpanded}
                            onClick={() => toggleCollapse(company)}
                        >
                            {company}
                        </button>
                        <div className={`collapse ${isExpanded ? "show" : ""} mt-2`} id={`collapse-${sanitizeId(company)}`}>
                            <div className="product-card-row">
                                {productsByCompany[company].map(product => (
                                    <div key={product._id} className="col-md-4">
                                        <div className="existing-product-card">
                                            <img src={product.image} className="product-card-image" alt={product.title} height="300px" />
                                            <div className="product-card-body">
                                                <h5 className="product-card-title">{product.title}</h5>
                                                <h5 className="product-card-price">{product.price}</h5>
                                                <a
                                                    href={product.website}
                                                    className="btn btn-primary"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    View Product
                                                </a>
                                                <p className="product-text-muted">{product.category}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    )
};

export default AdminConsole;
