import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import "./styles/AdminCompaniesPage.scss";
import { Helmet } from "react-helmet";
import API_BASE_URL from "../components/urls";
import API from "../services/api";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";
import availableIcons from "../components/AvailableIcons";

/* --------------------------------
    Subcomponent: NewCompanyForm
    Handles adding a new company
-----------------------------------*/
const NewCompanyForm = () => {
	const queryClient = useQueryClient();

	// Store selected file
	const [file, setFile] = useState(null);

	// Local state form fields
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		qualifications: "",
		logo: "",
		website: "",
		instagram: "",
		category: "",
		isSmallBusiness: false,
	});

	// Mutation for adding a company
	// On success, invalidate the "companies" query so the list refetches
	const addCompanyMutation = useMutation({
		mutationFn: async (newCompany) => {
			const sessionToken = sessionStorage.getItem("sessionToken"); // ✅ Get MFA from sessionStorage

			if (!sessionToken) {
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
						headers: { Authorization: `Bearer ${sessionToken}` }, // ✅ Include MFA token
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
				headers: { Authorization: `Bearer ${sessionToken}` }, // ✅ Include MFA token
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
				instagram: "",
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
		setFormData((prev) => ({ ...prev, isSmallBusiness: e.target.checked }));
	};

	// Handle file input change
	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("Submitting data:", formData);
		addCompanyMutation.mutate(formData);

		// Clear form
		setFormData({
			name: "",
			description: "",
			qualifications: "",
			logo: "",
			website: "",
			category: "",
			isSmallBusiness: false,
		});
	};

	//Input change handler
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "instagram" ? `https://www.instagram.com/${value.replace("https://www.instagram.com/", "").trim()}` : value,
		}));
	};

	// New Company Form
	return (
		<div className="my-3 form-container">
			<h3>Add New Company</h3>
			<form onSubmit={handleSubmit} className="form-actual">
				{/* Company Name */}
				<div className="mb-3 form-input">
					<label htmlFor="name" className="form-label" />
					<input type="text" name="name" id="name" className="form-control" placeholder="Company Name" value={formData.name} onChange={handleChange} required />
				</div>
				{/* Company Description */}
				<div className="mb-3 form-input">
					<label htmlFor="description" className="form-label" />
					<textarea
						name="description"
						id="description"
						className="form-control"
						placeholder="Company Description"
						value={formData.description}
						onChange={handleChange}
						style={{ height: "250px" }}
						required
					/>
				</div>
				{/* Company Qualifications */}
				<div className="mb-3 form-input">
					<label htmlFor="qualifications" className="form-label" />
					<input
						type="text"
						name="qualifications"
						id="qualifications"
						className="form-control"
						placeholder="Company Qualifications (CSV)"
						value={formData.qualifications}
						onChange={handleChange}
						required
					/>
				</div>
				{/* Company Logo */}
				<div className="mb-3 form-input">
					<label htmlFor="logo" className="form-label" />
					<input type="text" name="logo" id="logo" className="form-control" placeholder="Company Logo URL" value={formData.logo} onChange={handleChange} />
					<input type="file" className="form-control mt-2" onChange={handleFileChange} />
				</div>
				{/* Company Website */}
				<div className="mb-3 form-input">
					<label htmlFor="website" className="form-label" />
					<input type="text" name="website" id="website" className="form-control" placeholder="Company Website URL" value={formData.website} onChange={handleChange} />
				</div>
				{/* Company Instagram */}
				<div className="mb-3 form-input">
					<label htmlFor="instagram" className="form-label" />
					<input
						type="text"
						name="instagram"
						id="instagram"
						className="form-control"
						placeholder="Company Instagram URL"
						value={formData.instagram ? formData.instagram.replace("https://www.instagram.com/", "") : ""}
						onChange={handleChange}
					/>
				</div>
				{/* Company Category */}
				<div className="mb-3 form-input">
					<label htmlFor="category" className="form-label" />
					<select name="category" id="category" className="form-control" value={formData.category} onChange={handleChange} required>
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
					<input type="checkbox" name="isSmallBusiness" checked={formData.isSmallBusiness} onChange={handleCheckboxChange} className="form-check-input" style={{ height: "30px", width: "30px" }} />
				</div>
				<button type="submit" className="btn btn-success">
					Add Company
				</button>
			</form>
		</div>
	);
};

/* --------------------------------- 
    Subcomponent: Company Card
    Manages each company's display including
    expand/collapse, icons, category, specifics, etc.
------------------------------------*/
const CompanyCard = ({ company, availableIcons }) => {
	const queryClient = useQueryClient();
	const [expanded, setExpanded] = useState(false);
	const [specificsText, setSpecificsText] = useState(company.specifics || "");
	const [selectedIcons, setSelectedIcons] = useState(company.icons || []);
	const [selectedCategory, , setSelectedCategory] = useState(company.category || "");
	const [selectedFile, setSelectedFile] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		name: company.name,
		description: company.description,
		logo: company.logo,
		instagram: company.instagram,
	});
	const toggleExpand = () => setExpanded((prev) => !prev);

	// Mutation to delete a company
	const deleteCompanyMutation = useMutation({
		mutationFn: (companyId) => {
			const sessionToken = localStorage.getItem("sessionToken"); // Get MFA code from storage

			if (!sessionToken) {
				toast.error("MFA required. Please log in again.");
				return Promise.reject("Unauthorized: No MFA token");
			}

			return API.delete(`${API_BASE_URL}/companies/${companyId}`, {
				headers: { Authorization: `Bearer ${sessionToken}` }, // Send MFA code as token
			});
		},

		onSuccess: () => {
			toast.success("Company deleted successfully", { autoClose: 2000 });
			queryClient.invalidateQueries(["companies"]);
		},
		onError: () => {
			toast.error("Failed to delete company");
		},
	});

	// Partial update for specifics
	const updateSpecificsMutation = useMutation({
		mutationFn: ({ companyId, specifics }) => {
			const sessionToken = localStorage.getItem("sessionToken");

			if (!sessionToken) {
				toast.error("MFA required. Please log in again.");
				return Promise.reject("Unauthorized: No MFA token");
			}

			return API.patch(
				`${API_BASE_URL}/admin/companies/${companyId}/specifics`,
				{ specifics },
				{ headers: { Authorization: `Bearer ${sessionToken}` } } // ✅ Include MFA token
			);
		},

		onSuccess: () => {
			toast.success("Specifics updated successfully", { autoClose: 3000 });
			queryClient.invalidateQueries(["companies"]);
		},
		onError: () => {
			toast.error("Failed to update specifics");
		},
	});

	// ✅ Partial update for icons with MFA
	const updateIconsMutation = useMutation({
		mutationFn: ({ companyId, icons }) => {
			const sessionToken = localStorage.getItem("sessionToken");

			if (!sessionToken) {
				toast.error("MFA required. Please log in again.");
				return Promise.reject("Unauthorized: No MFA token");
			}

			return API.patch(
				`${API_BASE_URL}/admin/companies/${companyId}/icons`,
				{ icons },
				{ headers: { Authorization: `Bearer ${sessionToken}` } } // ✅ Include MFA token
			);
		},

		onSuccess: () => {
			toast.success("Icons updated successfully", { autoClose: 3000 });
			queryClient.invalidateQueries(["companies"]);
		},
		onError: () => {
			toast.error("Failed to update icons");
		},
	});

	// ✅ Partial update for category with MFA
	const updateCategoryMutation = useMutation({
		mutationFn: ({ companyId, category }) => {
			const sessionToken = localStorage.getItem("sessionToken");

			if (!sessionToken) {
				toast.error("MFA required. Please log in again.");
				return Promise.reject("Unauthorized: No MFA token");
			}

			return API.patch(
				`${API_BASE_URL}/companies/${companyId}/category`,
				{ category },
				{ headers: { Authorization: `Bearer ${sessionToken}` } } // ✅ Include MFA token
			);
		},

		onSuccess: () => {
			toast.success("Category updated successfully", { autoClose: 3000 });
			queryClient.invalidateQueries(["companies"]);
		},
		onError: () => {
			toast.error("Failed to update category");
		},
	});

	// Handle toggling icons in local state before saving
	const toggleIcon = (iconId) => {
		setSelectedIcons((prev) => (prev.includes(iconId) ? prev.filter((id) => id !== iconId) : [...prev, iconId]));
	};

	const getCompanyLogo = (company) => {
		return company.logo
			? company.logo // ✅ Uses Firebase URL stored in MongoDB
			: "https://via.placeholder.com/150"; // ✅ Default placeholder image
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: name === "instagram" ? `https://www.instagram.com/${value.replace("https://www.instagram.com/", "").trim()}` : value,
		}));
	};

	// Handle file input
	const handleFileChange = (e) => {
		const file = e.target.files[0];

		if (!file) return;

		setSelectedFile(file); // ✅ Just store the file, don't upload yet
	};

	// Handle Submit
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!formData.name || !formData.description) {
			toast.error("Name and description are required!");
			return;
		}

		let formattedInstagram = formData.instagram ? `https://www.instagram.com/${formData.instagram.replace("https://www.instagram.com/", "").trim()}` : "";

		// ✅ Prepare JSON data for update (Only send changed fields)
		let updateData = { company_id: company._id };

		if (formattedInstagram) {
			updateData.instagram = formattedInstagram; // ✅ Save full URL
		}

		if (selectedFile) {
			try {
				console.log("📂 Uploading file to Firebase...");
				const storageRef = ref(storage, `logos/${Date.now()}_${selectedFile.name}`);
				const uploadTaskSnapshot = await uploadBytesResumable(storageRef, selectedFile);
				const fileUrl = await getDownloadURL(uploadTaskSnapshot.ref);
				updateData.file_url = fileUrl; // ✅ Include file only if uploaded
			} catch (error) {
				toast.error("Failed to upload logo");
				return;
			}
		}

		try {
			const response = await fetch(`${API_BASE_URL}/upload-logo`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("sessionToken")}`,
				},
				body: JSON.stringify(updateData),
			});

			const data = await response.json();
			if (!response.ok) throw new Error(data.error);

			setFormData((prev) => ({
				...prev,
				logo: data.file_url || prev.logo, // ✅ Preserve old logo if unchanged
				instagram: data.instagram || prev.instagram, // ✅ Preserve old Instagram if unchanged
			}));

			toast.success("Company updated successfully!");

			setIsEditing(false);
		} catch (error) {
			console.error("❌ Error updating MongoDB:", error);
			toast.error("Error updating company details.");
		}
	};

	// Render the card
	return (
		<div className={`company-card ${expanded ? "expanded" : "collapsed"}`}>
			<Helmet>
				<title>EcoCommerce | Admin Companies</title>
			</Helmet>
			<div className="company-header" onClick={toggleExpand}>
				{company.name}{" "}
				{company.icons?.includes("small_business")?.src && (
					<img src={availableIcons.find((icon) => icon.id === "small_business").src} alt="Small Business" title="Small Business" style={{ width: "20px", marginLeft: "5px" }} />
				)}
			</div>
			<img
				src={getCompanyLogo(company)}
				className="card-img-top"
				alt={`${company.name} logo`}
				style={{
					objectFit: "contain",
					height: "150px",
					width: "100%",
				}}
				onClick={toggleExpand}
				loading="lazy"
			/>

			{expanded && (
				<div className="company-details card-content">
					<p>
						<strong>Description:</strong> {company.description}
					</p>
					<p>
						<strong>QualificationsL</strong> {Array.isArray(company.qualifications) ? company.qualifications.join(", ") : company.qualifications}
					</p>
					<p>
						<strong>Specifics:</strong> {company.specifics}
					</p>
					<a href={company.website} target="_blank" rel="noopener noreferrer">
						Visit Website
					</a>

					{/* Specifics Textarea */}
					<textarea className="form-control my-2" placeholder="Enter specifics" value={specificsText} onChange={(e) => setSpecificsText(e.target.value)} />
					<button
						className="btn btn-primary mb-3"
						onClick={() =>
							updateSpecificsMutation.mutate({
								companyId: company._id,
								specifics: specificsText,
							})
						}>
						Save Speicifics
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
					<button
						className="btn btn-primary"
						onClick={() =>
							updateCategoryMutation.mutate({
								companyId: company._id,
								category: selectedCategory,
							})
						}>
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

					{/* Icon Selector */}
					<div className="icon-selector row">
						{availableIcons.map((icon) => (
							<div key={icon.id} className="form-check col-md-4 mb-1">
								<input type="checkbox" className="form-check-input" id={`${company._id}.${icon.id}`} checked={selectedIcons.includes(icon.id)} onChange={() => toggleIcon(icon.id)} />
								<label htmlFor={`${company._id}-${icon.id}`}>
									<img src={icon.src} alt={icon.label} style={{ width: "30px", marginRight: "5px" }} />
									{icon.label}
								</label>
							</div>
						))}
					</div>
					<button
						className="btn btn-primary mt-2"
						onClick={() =>
							updateIconsMutation.mutate({
								companyId: company._id,
								icons: selectedIcons,
							})
						}>
						Save Icons
					</button>

					{/* Display assigned icons */}
					<div className="product-icons d-flex justify-content-center align-items-center gap-2 mt-2">
						{company.icons?.map((iconId) => {
							const iconData = availableIcons.find((i) => i.id === iconId);
							return iconData ? (
								<img
									className="icon_actual"
									key={iconData.id}
									src={iconData.src}
									alt={iconData.label}
									data-bs-toggle="tooltip"
									data-bs-placement="bottom"
									data-bs-title={iconData.label}
									style={{ width: "30px" }}
								/>
							) : null;
						})}
					</div>

					{/* Edit Modal */}
					{isEditing && (
						<div className="modal show d-block modal-container" tabIndex="-1">
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
												<input type="text" name="name" className="form-control" value={formData.name} onChange={handleChange} />
											</div>
											{/* Company Description */}
											<div className="mb-3">
												<label className="form-label">Company Description</label>
												<textarea name="description" className="form-control company-description-modal" value={formData.description} onChange={handleChange} />
											</div>
											{/* Instagram Link */}
											<div className="mb-3">
												<label className="form-label">Instagram</label>
												<input
													type="text"
													name="instagram"
													className="form-control"
													value={formData.instagram ? formData.instagram.replace("https://www.instagram.com/", "") : ""}
													onChange={handleChange}
													placeholder="Instagram"
												/>
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
											<button type="submit" className="btn btn-success">
												Save Changes
											</button>
										</form>
									</div>
								</div>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

/*--------------------------------- 
  Main Component: AdminCompaniesPage
-----------------------------------*/
const AdminCompaniesPage = () => {
	// Use Query to fetch companies
	const {
		data: companies = [],
		isLoading,
		error,
	} = useQuery({
		queryKey: ["companies", "smallbusiness"],
		queryFn: async () => {
			const [companiesRes, smallBusinessRes] = await Promise.all([API.get(`${API_BASE_URL}/companies`), API.get(`${API_BASE_URL}/smallbusiness`)]);

			const combineData = [...companiesRes.data, ...smallBusinessRes.data];

			combineData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

			return combineData;
		},
	});

	if (isLoading) return <div>Loading Companies...</div>;
	if (error) {
		console.error(error);
		return <div>Error loading companies</div>;
	}

	return (
		<div className="container-fluid my-4">
			<ToastContainer />
			<h1 className="text-center mb-4 admin-manage-companies">Admin: Manage Companies</h1>

			<div className="d-flex justify-content-end mb-3">
				<div className="admin-nav-btns">
					<div className="admin-companies-btn">
						<Link to="/admin/products" className="btn btn-secondary mb-3">
							Admin Products
						</Link>
					</div>
					<div className="index-btn">
						<Link to="/admin/index" className="btn btn-secondary mb-3">
							Admin Sustainability Index
						</Link>
					</div>
				</div>
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
	);
};

export default AdminCompaniesPage;
