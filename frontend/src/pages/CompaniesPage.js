import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "./CompaniesPage.css"
import bCorpIcon from "../resources/icons/bcorp.png";
import smallBusinessIcon from "../resources/icons/handshake.png";
import veganIcon from "../resources/icons/vegan.png";
import biodegradableIcon from "../resources/icons/leaf.png";
import fairTradeIcon from "../resources/icons/trade.png";
import recycled from "../resources/icons/recycle.svg";
import fla from "../resources/icons/flalogo.png";
import cascale from "../resources/icons/cascalelogo.png";
import oneForThePlanet from "../resources/icons/1fortheplanet.png"
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
];

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [expandedCompany, setExpandedCompany] = useState(null)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/companies');
        const data = await response.json();
        setCompanies(data)
      } catch (error) {
        console.error("Error fetching companies", error);
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

    const groupedCompanies = companies.reduce((acc, company) => {
      const category = company.category || "Uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(company);
      return acc;
    }, {});  
  
  const toggleExpand = (id) => {
    setExpandedCompany((prev) => (prev === id ? null : id))
  }

  return (
    <div>
      <Navbar />
      <div className="container my-4">
        <h1 className="text-center mb-4">Recommended Companies</h1>
        {Object.keys(groupedCompanies).map((category) => (
          <div key={category}>
            <h2 className="mt-4">{category}</h2>
                <div className="row">
                  {groupedCompanies[category].map((company, index) => (
                      <div key={index} className={`col-lg-4 col-md-6 col-sm-12 ${expandedCompany === company._id ? "position-relative" : ""}`}>
                        <div className={`card company-card ${expandedCompany === company._id ? "expanded" : "collapsed"}`}>
                          <div className="card-header align-items-center" onClick={() => toggleExpand(company._id)} style={{ cursor: "pointer"}}>
                            <img
                              src={company.logo}
                              className="card-img-top"
                              alt={`${company.name} logo`}
                              style={{ objectFit: "contain", height: "150px", width: "100%" }}
                            />
                            <h5 className="card-title m-0">{company.name}</h5>
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
                              <div className="product-icons d-flex justify-content-center align-items-center gap-2 mt-2">
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
                                    />
                                  ) : null;
                                })}
                              </div>
                              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                                <button className="collapse-button btn btn-outline-secondary" onClick={() => toggleExpand(company._id)} style={{ cursor: "pointer" }}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-box-arrow-in-up" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M3.5 10a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 0 0 1h2A1.5 1.5 0 0 0 14 9.5v-8A1.5 1.5 0 0 0 12.5 0h-9A1.5 1.5 0 0 0 2 1.5v8A1.5 1.5 0 0 0 3.5 11h2a.5.5 0 0 0 0-1z" />
                                    <path fillRule="evenodd" d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                  ))}
                </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompaniesPage;