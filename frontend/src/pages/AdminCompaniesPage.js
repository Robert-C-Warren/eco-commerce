import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify"
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import "react-toastify/dist/ReactToastify.css"
import "./AdminCompaniesPage.css"
import API_BASE_URL from "../components/urls"
import API from "../services/api";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"
import { initializeApp } from "firebase/app"
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

const firebaseConfig = {
  apiKey: process.env.REAT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
}

const firebaseApp = initializeApp(firebaseConfig)
const storage = getStorage(firebaseApp)

/* --------------------------------
    Subcomponent: NewCompanyForm
    Handles adding a new company
-----------------------------------*/
const NewCompanyForm = () => {
  const queryClient = useQueryClient()

  // Store selected file
  const [file, setFile] = useState(null)

  // Local state form fields
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    qualifications: "",
    logo: "",
    website: "",
    category: "",
    isSmallBusiness: false,
  })

  // Mutation for adding a company
  // On success, invalidate the "companies" query so the list refetches
  const addCompanyMutation = useMutation({
    mutationFn: async (newCompany) => {
        const mfaToken = localStorage.getItem("mfaToken");

        if (!mfaToken) {
            toast.error("MFA required. Please log in again.");
            return Promise.reject("Unauthorized: No MFA token");
        }

        if (file) {
            // Upload the file if a file is selected
            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await fetch(`${API_BASE_URL}/upload-logo`, {
                    method: "POST",
                    body: formData,
                    headers: { Authorization: `Bearer ${mfaToken}` }  // ✅ Include MFA token
                });

                const data = await response.json();
                if (data.file_url) {
                    newCompany.logo = data.file_url;
                }
            } catch (error) {
                toast.error("Failed to upload logo");
                return Promise.reject("Failed to upload logo");
            }
        }

        return API.post(`${API_BASE_URL}/companies`, newCompany, {
            headers: { Authorization: `Bearer ${mfaToken}` }  // ✅ Include MFA token
        });
    },

    onSuccess: () => {
        toast.success("Company added successfully", { autoClose: 2000 });
        queryClient.invalidateQueries(["companies"]);
        setFormData({
            name: "",
            description: "",
            qualifications: "",
            logo: "",
            website: "",
            category: "",
        });
        setFile(null);
    },

    onError: () => {
        toast.error("Failed to add company");
    },
  });


  // Handle checkbox change for small business
  const handleCheckboxChange = (e) => {
    setFormData((prev) => ({ ...prev, isSmallBusiness: e.target.checked }))
  }

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Submitting data:", formData)
    addCompanyMutation.mutate(formData)

    // Clear form
    setFormData({
      name: "",
      description: "",
      qualifications: "",
      logo: "",
      website: "",
      category: "",
      isSmallBusiness: false,
    })
  }

  //Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // New Company Form
  return (
    <div className="my-3 form-container">
      <h3>Add New Company</h3>
      <form onSubmit={handleSubmit}>
        {/* Company Name */}
        <div className="mb-3 form-input">
          <label htmlFor="name" className="form-label" />
          <input type="text" name="name" id="name" className="form-control"
            placeholder="Company Name" value={formData.name} onChange={handleChange} required />
        </div>
        {/* Company Description */}
        <div className="mb-3 form-input">
          <label htmlFor="description" className="form-label" />
          <textarea name="description" id="description" className="form-control"
            placeholder="Company Description" value={formData.description} onChange={handleChange} style={{ height: "250px"}} required />
        </div>
        {/* Company Qualifications */}
        <div className="mb-3 form-input">
          <label htmlFor="qualifications" className="form-label" />
          <input type="text" name="qualifications" id="qualifications" className="form-control"
            placeholder="Company Qualifications (CSV)" value={formData.qualifications} onChange={handleChange} required />
        </div>
        {/* Company Logo */}
        <div className="mb-3 form-input">
          <label htmlFor="logo" className="form-label"/>
          <input type="text" name="logo" id="logo" className="form-control"
            placeholder="Company Logo URL" value={formData.logo} onChange={handleChange} />
          <input type="file" className="form-control mt-2" onChange={handleFileChange} />
        </div>
        {/* Company Website */}
        <div className="mb-3 form-input">
          <label htmlFor="website" className="form-label" />
          <input type="text" name="website" id="website" className="form-control"
            placeholder="Company Website URL" value={formData.website} onChange={handleChange} />
        </div>
        {/* Company Category */}
        <div className="mb-3 form-input">
          <label htmlFor="category" className="form-label" />
          <select name="category" id="category" className="form-control"
            value={formData.category} onChange={handleChange} required >
            <option value="">Select a category</option>
            <option value="Accessories">Accessories</option>
            <option value="Beverage">Beverage</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Clothing">Clothing</option>
            <option value="Food">Food</option>
            <option value="Home">Home</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Outdoor">Outdoor</option>
            <option value="Personal Care">Personal Care</option>
            <option value="Pet">Pet</option>
          </select>
        </div>
        <div className="mb-3 form-input">
          <label className="form-label">Small Business</label>
          <input type="checkbox" name="isSmallBusiness" checked={formData.isSmallBusiness}
            onChange={handleCheckboxChange} className="form-check-input" style={{ height: "30px", width: "30px"}}/>
        </div>
        <button type="submit" className="btn btn-success">
          Add Company
        </button>
      </form>
    </div>
  )
}

/* --------------------------------- 
    Subcomponent: Company Card
    Manages each company's display including
    expand/collapse, icons, category, specifics, etc.
------------------------------------*/
const CompanyCard = ({ company, availableIcons }) => {
  const queryClient = useQueryClient()
  const [expanded, setExpanded] = useState(false)
  const [specificsText, setSpecificsText] = useState(company.specifics || "")
  const [selectedIcons, setSelectedIcons] = useState(company.icons || [])
  const [selectedCategory, , setSelectedCategory] = useState(company.category || "")
  const [selectedFile, setSelectedFile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: company.name,
    description: company.description,
    logo: company.logo
  })
  const toggleExpand = () => setExpanded((prev) => !prev)

  // Mutation to delete a company
  const deleteCompanyMutation = useMutation({
    mutationFn: (companyId) => {
        const mfaToken = localStorage.getItem("mfaToken");  // Get MFA code from storage

        if (!mfaToken) {
            toast.error("MFA required. Please log in again.");
            return Promise.reject("Unauthorized: No MFA token");
        }

        return API.delete(`${API_BASE_URL}/companies/${companyId}`, {
            headers: { Authorization: `Bearer ${mfaToken}` }  // Send MFA code as token
        });
    },

    onSuccess: () => {
        toast.success("Company deleted successfully", { autoClose: 2000 });
        queryClient.invalidateQueries(["companies"]);
    },
    onError: () => {
        toast.error("Failed to delete company");
    }
  });

  // Mutation to update entire company or partial updates
  const editCompanyMutation = useMutation({
    mutationFn: async ({ companyId, updateFields, file }) => {
        if (!companyId) {
            console.error("❌ Company ID is missing!");
            return Promise.reject("Company ID is required");
        }

        const mfaToken = localStorage.getItem("mfaToken");

        if (!mfaToken) {
            toast.error("MFA required. Please log in again.");
            return Promise.reject("Unauthorized: No MFA token");
        }

        const formData = new FormData();

        Object.keys(updateFields).forEach((key) => {
            if (updateFields[key]) {
                formData.append(key, updateFields[key]);  
            }
        });

        if (file) {
            console.log("📂 Adding file to FormData:", file.name);
            formData.append("file", file);
        } else {
            console.log("⚠️ No file added to FormData.");
        }

        console.log("🚀 Sending PUT request to:", `${API_BASE_URL}/companies/${companyId}`);

        const response = await fetch(`${API_BASE_URL}/companies/${companyId}`, {
            method: "PUT",
            body: formData,
            headers: {
                Authorization: `Bearer ${mfaToken}`  // ✅ Include MFA token
            }
        });

        const data = await response.json();
        console.log("🔄 Server response:", data);

        if (!response.ok) {
            throw new Error("❌ Failed to update company");
        }

        return data;
    },

    onSuccess: () => {
        toast.success("✅ Company updated successfully!", { autoClose: 2000 });
        queryClient.invalidateQueries(["companies"]); // Forces React to fetch updated data
        closeModal();
    },

    onError: (error) => {
        console.error("❌ Update Error:", error);
        toast.error("Failed to update company");
    }
  });
  
  // Partial update for specifics
  const updateSpecificsMutation = useMutation({
    mutationFn: ({ companyId, specifics }) => {
        const mfaToken = localStorage.getItem("mfaToken");

        if (!mfaToken) {
            toast.error("MFA required. Please log in again.");
            return Promise.reject("Unauthorized: No MFA token");
        }

        return API.patch(`${API_BASE_URL}/admin/companies/${companyId}/specifics`, 
            { specifics }, 
            { headers: { Authorization: `Bearer ${mfaToken}` } } // ✅ Include MFA token
        );
    },

    onSuccess: () => {
        toast.success("Specifics updated successfully", { autoClose: 3000 });
        queryClient.invalidateQueries(["companies"]);
    },
    onError: () => {
        toast.error("Failed to update specifics");
    }
  });


// ✅ Partial update for icons with MFA
  const updateIconsMutation = useMutation({
    mutationFn: ({ companyId, icons }) => {
        const mfaToken = localStorage.getItem("mfaToken");

        if (!mfaToken) {
            toast.error("MFA required. Please log in again.");
            return Promise.reject("Unauthorized: No MFA token");
        }

        return API.patch(`${API_BASE_URL}/admin/companies/${companyId}/icons`, 
            { icons }, 
            { headers: { Authorization: `Bearer ${mfaToken}` } } // ✅ Include MFA token
        );
    },

    onSuccess: () => {
        toast.success("Icons updated successfully", { autoClose: 3000 });
        queryClient.invalidateQueries(["companies"]);
    },
    onError: () => {
        toast.error("Failed to update icons");
    }
  });


// ✅ Partial update for category with MFA
  const updateCategoryMutation = useMutation({
    mutationFn: ({ companyId, category }) => {
        const mfaToken = localStorage.getItem("mfaToken");

        if (!mfaToken) {
            toast.error("MFA required. Please log in again.");
            return Promise.reject("Unauthorized: No MFA token");
        }

        return API.patch(`${API_BASE_URL}/companies/${companyId}/category`, 
            { category }, 
            { headers: { Authorization: `Bearer ${mfaToken}` } } // ✅ Include MFA token
        );
    },

    onSuccess: () => {
        toast.success("Category updated successfully", { autoClose: 3000 });
        queryClient.invalidateQueries(["companies"]);
    },
    onError: () => {
        toast.error("Failed to update category");
    }
  });


  // Handle toggling icons in local state before saving
  const toggleIcon = (iconId) => {
    setSelectedIcons((prev) =>
      prev.includes(iconId) ? prev.filter((id) => id !== iconId) : [...prev, iconId]
    )
  }

  const getCompanyLogo = (company) => {
    return company.logo
      ? company.logo  // ✅ Uses Firebase URL stored in MongoDB
      : "https://via.placeholder.com/150"; // ✅ Default placeholder image
  };  
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle file input
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("📂 Selected file:", file.name);

    const storageRef = ref(storage, `logos/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        console.log(`Upload progress: ${(snapshot.bytesTransferred / snapshot.totalBytes) * 100}%`);
      },
      (error) => {
        console.error("❌ Upload failed:", error);
        toast.error("Failed to upload logo");
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("✅ File uploaded. URL:", downloadURL);
          setFormData((prev) => ({ ...prev, logo: downloadURL }));
          toast.success("Logo uploaded successfully");
        } catch (err) {
          console.error("❌ Error retrieving file URL:", err);
          toast.error("Failed to retrieve logo URL");
        }
      }
    );
  };

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
        toast.error("Name and description are required!");
        return;
    }

    console.log("🚀 Submitting form with file:", selectedFile);

    const mfaToken = localStorage.getItem("mfaToken");

    if (!mfaToken) {
        toast.error("MFA required. Please log in again.");
        return;
    }

    editCompanyMutation.mutate({
        companyId: company._id,
        updateFields: formData,
        file: selectedFile, // Pass selected file
        mfaToken // ✅ Include MFA token
    });
  };

  const closeModal = () => {
    setIsEditing(false)
  }

  // Render the card
  return (
    <div className={`company-card ${expanded ? "expanded" : "collapsed"}`}>
      <div className="company-header" onClick={toggleExpand}>
        {company.name}{" "}
        {company.icons?.includes("small_business") && (
          <img src={smallBusinessIcon} alt="Small Business" title="Small Business" style={{ width: "20px", marginLeft: "5px" }} />
        )}
      </div>
      <img src={getCompanyLogo(company)} className="card-img-top" alt={`${company.name} logo`} style={{
        objectFit: "contain",
        height: "150px", width: "100%"
      }} onClick={toggleExpand} loading="lazy" />

      {expanded && (
        <div className="company-details card-content">
          <p><strong>Description:</strong> {company.description}</p>
          <p><strong>QualificationsL</strong>{" "}{Array.isArray(company.qualifications) ?
            company.qualifications.join(", ") : company.qualifications}
          </p>
          <p><strong>Specifics:</strong> {company.specifics}</p>
          <a href={company.website} target="_blank" rel="noopener noreferrer">
            Visit Website
          </a>

          {/* Specifics Textarea */}
          <textarea className="form-control my-2" placeholder="Enter specifics" value={specificsText} onChange={(e) => setSpecificsText(e.target.value)} />
          <button className="btn btn-primary mb-3" onClick={() => updateSpecificsMutation.mutate({
            companyId: company._id, specifics: specificsText
          })}>
            Save Speicifics
          </button>

          {/* Icon Selector */}
          <div className="icon-selector row">
            {availableIcons.map((icon) => (
              <div key={icon.id} className="form-check col-md-4 mb-1">
                <input type="checkbox" className="form-check-input" id={`${company._id}.${icon.id}`}
                  checked={selectedIcons.includes(icon.id)} onChange={() => toggleIcon(icon.id)} />
                <label htmlFor={`${company._id}-${icon.id}`}>
                  <img src={icon.src} alt={icon.label} style={{ width: "30px", marginRight: "5px" }} />
                  {icon.label}
                </label>
              </div>
            ))}
          </div>
          <button className="btn btn-primary mt-2" onClick={() =>
            updateIconsMutation.mutate({ companyId: company._id, icons: selectedIcons })}>
            Save Icons
          </button>

          {/* Category Dropdown */}
          <select className="form-control mb-2 mt-2" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
            <option value="">Select a category</option>
            <option value="Accessories">Accessories</option>
            <option value="Beverage">Beverage</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Clothing">Clothing</option>
            <option value="Food">Food</option>
            <option value="Home">Home</option>
            <option value="Kitchen">Kitchen</option>
            <option value="Outdoor">Outdoor</option>
            <option value="Personal Care">Personal Care</option>
            <option value="Pet">Pet</option>
          </select>
          <button className="btn btn-primary" onClick={() => updateCategoryMutation.mutate({
            companyId: company._id, category: selectedCategory
          })}>
            Update Category
          </button>

          {/* Edit Button */}
          <button className="btn btn-warning my-2" onClick={() => setIsEditing(true)}>
            Edit Company
          </button>
          {/* Delete Button */}
          <button className="btn btn-danger my-2" onClick={() => deleteCompanyMutation.mutate(company._id)}>
            Delete
          </button>
          {/* Done Button */}
          <button className="btn btn-secondary" onClick={toggleExpand}>
            Done
          </button>

          {/* Display assigned icons */}
          <div className="product-icons d-flex justify-content-center align-items-center gap-2 mt-2">
            {company.icons?.map((iconId) => {
              const iconData = availableIcons.find((i) => i.id === iconId)
              return iconData ? (
                <img className="icon_actual" key={iconData.id} src={iconData.src} alt={iconData.label} data-bs-toggle="tooltip"
                  data-bs-placement="bottom" data-bs-title={iconData.label} style={{ width: "30px" }} />
              ) : null;
            })}
          </div>

          {/* Edit Modal */}
          {isEditing && (
            <div className="modal show d-block" tabIndex="-1">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Edit Company</h5>
                    <button type="button" className="btn-close" onClick={() => setIsEditing(false)}></button>
                  </div>
                  <div className="modal-body">
                    <form onSubmit={handleSubmit}>
                      {/* Company Name */}
                      <div className="mb-3">
                        <label className="form-label">Company Name</label>
                        <input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} required />
                      </div>
                      {/* Company Description */}
                      <div className="mb-3">
                        <label className="form-label">Company Description</label>
                        <textarea name="description" className="form-control" value={formData.description} onChange={handleChange} required />
                      </div>
                      {/* Existing Logo Preview */}
                      {formData.logo && (
                        <div className="mb-3">
                          <label className="form-label">Current Logo</label>
                          <img src={formData.logo} alt="Company Logo" className="img-fluid" style={{ maxHeight: "100px" }} />
                        </div>
                      )}
                      {/* Logo Upload */}
                      <div className="mb-3">
                        <label className="form-label">Upload New Logo</label>
                        <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
                      </div>
                      {/* Submit Button */}
                      <button type="submit" className="btn btn-success">Save Changes</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/*--------------------------------- 
  Main Component: AdminCompaniesPage
-----------------------------------*/
const AdminCompaniesPage = () => {
  // Use Query to fetch companies
  const {
    data: companies = [],
    isLoading,
    error
  } = useQuery ({
    queryKey: ["companies", "smallbusiness"],
    queryFn: async () => {
      const [companiesRes, smallBusinessRes] = await Promise.all([
        API.get(`${API_BASE_URL}/companies`),
        API.get(`${API_BASE_URL}/smallbusiness`)      
      ])

      const combineData = [...companiesRes.data, ...smallBusinessRes.data]

      combineData.sort((a, b) => new Date(b.createdAt) -new Date(a.createdAt))

      return combineData
    }
  })

  if (isLoading) return <div>Loading Companies...</div>
  if (error) {
    console.error(error)
    return <div>Error loading companies</div>
  }

  return (
    <div className="container-fluid my-4">
      <ToastContainer />
      <h1 className="text-center mb-4">Admin: Manage Companies</h1>

      <div className="d-flex justify-content-end mb-3">
        <Link to="/admin/products" className="btn btn-secondary">
          Admin Products
        </Link>
      </div>

      {/* New Company Form */}
      <NewCompanyForm />

      <h3>Existing Companies</h3>
      <div className="container-fluid my-4">
        <div className="row company-container">
          {companies.map((company) => (
            <div key={company._id} className="col-lg-3 col-md-4 col-sm-6 mb-3">
              <CompanyCard company={company} availableIcons={availableIcons} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminCompaniesPage;