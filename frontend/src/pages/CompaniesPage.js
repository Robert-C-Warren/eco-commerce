import React, { useEffect, useState, useRef } from "react";
import "./CompaniesPage.css"
import "bootstrap-icons/font/bootstrap-icons.css";
import Logo from "../resources/eclogov7.svg"
import API_BASE_URL from "../components/urls"
import bCorpIcon from "../resources/icons/bcorp.png";
import smallBusinessIcon from "../resources/icons/handshake.png";
import veganIcon from "../resources/icons/veganlogo.png";
import biodegradableIcon from "../resources/icons/leaf.png";
import fairTradeIcon from "../resources/icons/trade.png";
import recycled from "../resources/icons/recycle.svg";
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
];

const CompaniesPage = ({ searchQuery }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true)
  const [expandedCompany, setExpandedCompany] = useState(null)
  const [expandedCategory, setExpandedCategory] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0})
  const categoryRefs = useRef({})
  const cardRef = useRef(null)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/companies`);

        const data = await response.json();

        setCompanies(data)
      } catch (error) {
        console.error("Error fetching companies", error);
      } finally {
        setLoading(false)
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    const existingToolTips = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    existingToolTips.forEach((tooltipTriggerE1) => {
      const tooltipInstance = window.bootstrap.Tooltip.getInstance(tooltipTriggerE1);
      if (tooltipInstance) {
        tooltipInstance.dispose();
      }
    })

    const initializeTooltips = () => {
      const tooltipTriggerList = Array.from(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
      )
      tooltipTriggerList.forEach((tooltipTriggerE1) => {
        new window.bootstrap.Tooltip(tooltipTriggerE1)
      })
    }

    const timer = setTimeout(initializeTooltips, 100)

    return () => {
      clearTimeout(timer)
    }
  }, [companies])

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target)) {
        setExpandedCompany(null); // Collapse the expanded card
      }
    };

    if (expandedCompany) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [expandedCompany])

  const filteredCompanies = searchQuery
    ? companies.filter((company) => 
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.specifics?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : companies;

  const groupedCompanies = searchQuery
    ? { "Search Results": filteredCompanies }
    : companies.reduce((acc, company) => {
        const category = company.category || "Uncatogorized"
        if (!acc[category]) acc[category] = []
        acc[category].push(company)
        return acc
    }, {})


  const toggleExpand = (id) => {
    setExpandedCompany((prev) => (prev === id ? null : id))
  }

  const toggleCategory = (category) => {
    setExpandedCategory((prev) => {
      const contentEl = categoryRefs.current[category];

      if (contentEl) {
        if (prev === category) {
          contentEl.style.height = `${contentEl.scrollHeight}px`; // Set explicit height
          requestAnimationFrame(() => {
            contentEl.style.height = "0"
          })
          return null
        } else {
          const prevContentE1 = categoryRefs.current[prev]
          if (prevContentE1) {
            prevContentE1.style.height = `${prevContentE1.scrollHeight}px`
            requestAnimationFrame(() => {
              prevContentE1.style.height = "0"
            })
          }

          contentEl.style.height = `${contentEl.scrollHeight}px`
          setTimeout(() => {
            contentEl.style.height = "auto"
          }, 500)

          return category
        }
      }

      return prev
    });
  };

  const handleMouseMove = (e) => {
    setTooltipPosition({ x: e.clientX + 10, y: e.clientY - 40 })
  }

  return (
    <div>
      <div className="container my-4">
        <div className="hero-section text-center p-5">
          <h1 className="display-2 hero-text">
            Companies Doing <strong className="eco-hero">Good</strong> for the Planet
          </h1>
          {!searchQuery && (
            <p className="lead">
              The companies listed below are dedicated to making a positive impact on our planet.<br /> 
              They prioritize treating their employees with respect and dignity while ensuring<br />
              their products meet the high standards you deserve.
            </p>
          )}
        </div>
        {loading && (
          <div className="loading-container">
            <img src={Logo} alt="Loading..." className="logo-shake" />
          </div>
        )}

        {!loading && Object.keys(groupedCompanies).sort().map((category) => (
          <div key={category} className="category-container">
            <h2 className="mt-4" onClick={() => toggleCategory(category)} style={{ cursor: "pointer" }}>
              {category}
            </h2>
            <i className={`icon-toggler bi ${expandedCategory === category ? "bi-arrows-collapse" : "bi-arrows-expand"}`} onClick={() => toggleCategory(category)} style={{ cursor: "pointer" }}></i>
            <div
              ref={(el) => (categoryRefs.current[category] = el)}
              className="category-content"
              style={{
                height: expandedCategory === category ? "auto" : "0",
                overflow: "hidden",
                transition: "height 0.5s ease"
              }}
            >
              <div className="row">
                {groupedCompanies[category].sort((a, b) => a.name.localeCompare(b.name)).map((company, index) => (
                  <div key={index} className={`card-group col-lg-3 col-md-6 col-sm-12 ${expandedCompany === company._id ? "position-relative" : ""}`}>
                    <div 
                      ref={expandedCompany === company._id ? cardRef : null} 
                      className={`card company-card ${expandedCompany === company._id ? "expanded" : "collapsed"}`}
                      onPointerMove={handleMouseMove}
                    >
                      {expandedCompany !== company._id && (
                        <div className="tooltip" style={{ position: "fixed", top: `${tooltipPosition.y}px`, left: `${tooltipPosition.x}px`}}><i class="bi bi-eye-fill"></i> More Info</div>
                      )}
                      <div className="card-header align-items-center" onClick={() => toggleExpand(company._id)} style={{ cursor: "pointer" }}>
                        <img
                          src={company.logo}
                          className="card-img-top"
                          alt={`${company.name} logo`}
                          style={{ objectFit: "contain", height: "150px", width: "100%" }}
                          loading="lazy"
                        />
                        <h5 className="card-title m-0">{company.name}</h5>
                        <h6 className="card-specifics">{company.specifics}</h6>
                      </div>
                      {expandedCompany === company._id && (
                        <div className="card-body ">
                          <p className="card-text">{company.description}</p>
                          <ul>
                            {company.qualifications.map((qualification, i) => (
                              <li className="qualifications" key={i}>{qualification}</li>
                            ))}
                          </ul>
                          <a
                            href={company.website}
                            className="btn btn-primary"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Visit Website
                          </a>
                          <div className="d-flex justify-content-between align-items-center icon-wrapper">
                            <div className="d-flex justify-content-center align-items-center flex-grow-1">
                              <div className="product-icons d-flex justify-content-center align-items-center gap-2">
                                {company.icons?.map((iconId) => {
                                  const icon = availableIcons.find((i) => i.id === iconId);
                                  return icon ? (
                                    <img
                                      className="icon_actual"
                                      key={icon.id}
                                      src={icon.src}
                                      alt={icon.label}
                                      data-bs-toggle="tooltip"
                                      data-bs-placement="bottom"
                                      data-bs-title={icon.label}
                                      loading="lazy"
                                    />
                                  ) : null;
                                })}
                              </div>
                            </div>
                            <div className="d-flex">
                              <i className="collapse-button bi bi-box-arrow-in-up" onClick={() => toggleExpand(company._id)} style={{ cursor: "pointer" }}></i>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompaniesPage;