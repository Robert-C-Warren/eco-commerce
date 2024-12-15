import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const AdminCompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [newCompany, setNewCompany] = useState({
    name: "",
    description: "",
    qualifications: "",
    logo: "",
    website: ""
  });

  const fetchCompanies = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/companies");
      const data = await response.json();
      console.log("Fetched Companies:", data)
      setCompanies(data);
    } catch (error) {
      console.error("Error fetching companies", error)
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const addCompany = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCompany),
      });
      if(response.ok) {
        alert("Company added successfully");
        fetchCompanies();
        setNewCompany({
          name: "",
          description: "",
          qualifications: "",
          logo: "",
          website: "",
        });
      }
    } catch (error) {
      console.error("Error adding company:", error);
    }
  };

  const editCompany = async (companyId, updatedCompany) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/companies/${companyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCompany),
      });
      if (response.ok) {
        alert("Company updated successfully");
        fetchCompanies();
      }
    } catch (error) {
      console.error("Error updating company", error);
    }
  };

  const deleteCompany = async (companyId) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/companies/${companyId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        alert("Company deleted successfully");
        fetchCompanies();
      }
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Admin: Manage Companies</h1>
        <div className="d-flex justify-content-end mb-3">
          <Link to="/admin/products" className="btn btn-secondary">
            Admin Products
          </Link>
          <Link to="/admin/companies" className="btn btn-secondary">
            Admin Companies
          </Link>
        </div>

      <div className="mb-4">
        <h3>Add New Company</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addCompany();
          }}
        >
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Company Name"
            value={newCompany.name}
            onChange={(e) =>
              setNewCompany({ ...newCompany, name: e.target.value })
            }
          />
          <textarea
            className="form-control mb-2"
            placeholder="Company Description"
            value={newCompany.description}
            onChange={(e) =>
              setNewCompany({
                ...newCompany,
                description: e.target.value,
              })
            }
          ></textarea>  
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Qualifications (comma separated)"
            value={newCompany.qualifications}
            onChange={(e) =>
              setNewCompany({
                ...newCompany,
                qualifications: e.target.value,
              })
            }
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Logo URL"
            value={newCompany.logo}
            onChange={(e) => 
              setNewCompany({ ...newCompany, logo: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Website URL"
            value={newCompany.website}
            onChange={(e) =>
              setNewCompany({ ...newCompany, website: e.target.value})
            }
          />
          <button type="submit" className="btn btn-success">
            Add Company
          </button>
        </form>
      </div>

      <h3>Existing Companies</h3>
      <table className="table table-bordered">
        <head>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Qualifications</th>
            <th>Image Link</th>
            <th>Website Link</th>
            <th>Actions</th>
          </tr>
        </head>
        <tbody>
          {companies.map((company) => (
            <tr key={company._id}>
              <td>{company.name}</td>
              <td>{company.description}</td>
              <td>{company.qualifications.join(", ")}</td>
              <td>{company.website}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() =>
                    editCompany(company._id, {
                      ...company,
                      name: prompt(
                        "Enter new name",
                        company.name
                      ) || company.name,
                      description: prompt(
                        "Enter new description",
                        company.description
                      ) || company.description,
                      qualifications: prompt(
                        "Enter qualifications",
                        company.qualifications
                      ) || company.qualifications
                    })
                  }
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteCompany(company._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCompaniesPage;