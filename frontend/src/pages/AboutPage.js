import React from "react";
import "./styles/AboutPage.scss";
import LongLogo from "../resources/ecocommercelogo.webp";
import { Helmet } from "react-helmet";
import LiveDashboard from "./LiveDashboard";

const AboutPage = () => (
	<div className="container about-page">
		{/* SEO Meta Tags using react-helmet */}
		<Helmet>
			<title>EcoCommerce | About</title>
			<meta name="description" content="Find eco-friendly companies and sustainable products for responsible shopping" />
			<meta
				name="keywords"
				content="EcoCommerce, sustainable, eco-friendly, responsible shopping, ethical brands, 
                b-corp products, best eco-friendly clothing companies, best eco-friendly jewelry companies, best eco-friendly food companies,
                ethical sourcing, ethical brands, ethical clothing"
			/>
		</Helmet>

		{/* Intro Section */}
		<div className="my-5 about-container">
			<h1 className="text-center about-title">
				About <img src={LongLogo} alt="EcoCommerce" className="worded-logo" />
			</h1>

			{/* Platform Description */}
			<p className="section-1 sections">
				EcoCommerce is your trusted guide for discovering eco-friendly and ethically responsible companies and their products. Our platform serves as a comprehensive directory designed to empower
				consumers to easily find and support businesses committed to sustainability, fair labor practices, and environmental responsibility. Every company featured on our site has been thoughtfully
				evaluated, providing clarity and confidence in your eco-conscious shopping choices.
			</p>

			{/* Live Transparency Metrics Component */}
			<LiveDashboard className="sections" />

			{/* Platform Ethos (No tracking, ads, etc) */}
			<p className="section-2 sections">
				EcoCommerce was created to help you make informed purchasing decisions without cost, tracking, or monetization. We do not charge fees, use cookies, or earn revenue from the platform. Our sole
				mission is to offer accessible, unbiased information on companies actively working to protect the planet and promote ethical business practices.
			</p>

			{/* Highlight Features */}
			<div className="highlights-container sections">
				<h3 className="ecocommerce-highlights">Highlights:</h3>
				<ul>
					<li>Prioritizing sustainability and environmental stewardship</li>
					<li>Advocating for ethically sourced and responsibly manufactured products</li>
					<li>Transparent presentation of sustainability practices and scores</li>
					<li>Commitment to ethical practices within supply chains</li>
					<li>Empowering consumer choices with clear and actionable insights</li>
					<li>Free, unbiased, and not monetized</li>
				</ul>
			</div>
		</div>

		{/* Transparency Score Section */}
		<div className="index-info">
			<h1 className="transp-title">How We Calculate Transparency Scores</h1>
			<p className="transp-exp">
				Each company is evaluated based on five key factors that impact people and the planet. We assign a score out of <strong className="emphasize">100 points</strong>, with higher scores indicating
				greater transparency and commitment to sustainability.
			</p>

			{/* Score Categories Breakdown */}
			{/* Sustainability */}
			<i className="bi bi-tree transp-icon"></i>
			<h3 className="transp-sustain">Sustainability (35 points)</h3>
			<p className="transp-score-exp">We assess the company’s efforts toward environmental responsibility, such as:</p>
			<ul className="transp-exp-list">
				<li className="transp-exp-list-item">Use of renewable energy</li>
				<li className="transp-exp-list-item">Waste reduction and recycling programs</li>
				<li className="transp-exp-list-item">Water conservation efforts</li>
				<li className="transp-exp-list-item">Overall environmental initiatives</li>
			</ul>

			{/* Ethical Sourcing */}
			<i class="bi bi-globe-americas transp-icon"></i>
			<h3 className="transp-sustain">Ethical Sourcing (25 points)</h3>
			<p className="transp-score-exp">We examine how companies ensure fair labor practices and responsible sourcing, including:</p>
			<ul className="transp-exp-list">
				<li className="transp-exp-list-item">Fair wages and safe working conditions</li>
				<li className="transp-exp-list-item">Ethical supply chain practices</li>
				<li className="transp-exp-list-item">Certifications like Fair Trade or Rainforest Alliance</li>
			</ul>

			{/* Materials */}
			<i class="bi bi-box-seam transp-icon"></i>
			<h3 className="transp-sustain">Materials (20 points)</h3>
			<p className="transp-score-exp">We look at the sustainability of the materials used in their products:</p>
			<ul className="transp-exp-list">
				<li className="transp-exp-list-item">Use of recycled, organic, or biodegradable materials</li>
				<li className="transp-exp-list-item">Avoidance of harmful chemicals and unsustainable resouces</li>
			</ul>

			{/* Carbon & Energy Impact */}
			<i class="bi bi-cloud-haze transp-icon"></i>
			<h3 className="transp-sustain">Carbon & Energy Impact (10 points)</h3>
			<p className="transp-score-exp">We evaluate the company’s carbon footprint and energy consumption:</p>
			<ul className="transp-exp-list">
				<li className="transp-exp-list-item">Carbon neutrality efforts</li>
				<li className="transp-exp-list-item">Use of renewable energy sources</li>
				<li className="transp-exp-list-item">Emissions reduction initiatives</li>
			</ul>

			{/* Transparency */}
			<i class="bi bi-eye transp-icon"></i>
			<h3 className="transp-sustain">Transparency (10 points)</h3>
			<p className="transp-score-exp">We consider how openly a company shares information about its sustainability and ethical practices:</p>
			<ul className="transp-exp-list">
				<li className="transp-exp-list-item">Availability of clear, verifiable sustainability reports</li>
				<li className="transp-exp-list-item">Accessibility of sourcing and supply chain details</li>
				<li className="transp-exp-list-item">Third-party certifications</li>
			</ul>

			{/* Score Legend */}
			<h1 className="transp-meaning">What the Scores Mean</h1>
			<p className="transp-mean-exp">
				The total score determines the company's <strong className="emphasize">Transparency Level</strong>
			</p>
			<table className="table table-bordered table-dark table-hover table-striped-columns transp-table" border="5">
				<thead className="table-light">
					<tr>
						<th scope="col">Score</th>
						<th scope="col">Transparency Level</th>
					</tr>
				</thead>
				<tbody className="table-group-divider">
					<tr>
						<th scope="row">
							<strong className="emphasize">85 – 100</strong>
						</th>
						<td>
							<strong className="emphasize">Excellent Transparency</strong> – The company is highly transparent and committed to ethical and sustainable practices.
						</td>
					</tr>
					<tr>
						<th scope="row">
							<strong className="emphasize">70 – 84</strong>
						</th>
						<td>
							<strong className="emphasize">Good Transparency</strong> – The company shares substantial information and takes meaningful action.
						</td>
					</tr>
					<tr>
						<th scope="row">
							<strong className="emphasize">50 – 69</strong>
						</th>
						<td>
							<strong className="emphasize">Moderate Transparency</strong> – The company has some sustainable practices but lacks full transparency.
						</td>
					</tr>
					<tr>
						<th scope="row">
							<strong className="emphasize">30 – 49</strong>
						</th>
						<td>
							<strong className="emphasize">Limited Transparency</strong> – The company provides minimal details about its sustainability efforts.
						</td>
					</tr>
					<tr>
						<th scope="row">
							<strong className="emphasize">Below 30</strong>
						</th>
						<td>
							<strong className="emphasize">Very Low Transparency</strong> – The company shares little to no information on its ethical and environmental impact.
						</td>
					</tr>
				</tbody>
			</table>

      {/* Why Transparency Matters */}
			<h1 className="transp-matter">Why Transparency Matters</h1>
			<p className="transp-matter-exp">
				Transparency empowers consumers to make informed decisions about the products they purchase. Our Transparency Score is designed to cut through marketing claims, allowing you to support businesses
				that align with your values. A lower score does not necessarily indicate poor ethical or environmental standards but rather a lack of publicly available information regarding the company’s
				practices.
			</p>

      {/* AI Disclaimer */}
			<i class="bi bi-robot transp-icon"></i>
			<h5 className="transp-ai">
				All scores are generated using AI and may not always be fully representative or accurate. If you believe a company has been misrepresented, please contact us so we can review and update our
				assessment as needed.
			</h5>
		</div>
	</div>
);

export default AboutPage;
