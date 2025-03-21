// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { applyPlugin } from "jspdf-autotable";
applyPlugin(jsPDF);
import { useNavigate } from "react-router-dom";
const URL = "http://localhost:5000/job/businessManager";
function AllBusinessManagers() {
  const [businessManager, setBusinessManager] = useState([]);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  // Fetch all business managers
  useEffect(() => {
    axios
      .get("http://localhost:5000/job/businessManager")
      .then((response) => {
        setBusinessManager(response.data.businessManager);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  // Filtered managers based on search query
  const filteredManagers = businessManager.filter(
    (manager) =>
      manager.managerID.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manager.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manager.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manager.companyName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // Generate PDF Report
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Account Details Report", 14, 14);

    const tableColumn = [
      "Manager ID",
      "Full Name",
      "User Name",
      "Email",
      "Phone",
      "Company Name",
    ];

    const tableRows = filteredManagers.map((manager) => [
      manager.managerID,
      manager.fullName,
      manager.userName,
      manager.email,
      manager.phone,
      manager.companyName,
    ]);

    // Configure the table with autoTable
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "grid",
      styles: { fontSize: 8 },
      headStyles: { fillColor: [22, 160, 133] },
      bodyStyles: { cellPadding: 2 },
      margin: { top: 10, left: 10, right: 10 },
      pageBreak: "auto",
    });

    doc.save("manager report.pdf");
  };
  const deleteHandler = async (_id) => {
    // Define _id as a parameter
    const confirmed = window.confirm(
      "Are you sure you want to delete this Manager Account ?"
    );

    if (confirmed) {
      try {
        await axios.delete(`${URL}/${_id}`);
        window.alert("Account Delete successfully!");
        window.location.reload();
      } catch (error) {
        // Handle deletion error if needed
        console.error("Error deleting details:", error);
      }
    }
  };
  const UpdateHandler = (_id) => {
    navigate(`/updateBusinessManager/${_id}`);
  };
  return (
    <div>
      <div className="admin_nav_bar_job">
        <p className="nav_logo_job">Admin Dashboard</p>
        <div className="admin_nav_bar_job_lft">
          <p
            className="admin_nav_item_job admin_nav_item_job_active"
            onClick={() => (window.location.href = "/allBusinessManagers")}
          >
            Business
          </p>
          <p
            className="admin_nav_item_job "
            onClick={() => (window.location.href = "/allJobPostAdmin")}
          >
            Job Post
          </p>
          <p
            className="admin_nav_item_job "
            onClick={() => (window.location.href = "/appliedUsersDetails")}
          >
            Application
          </p>
          <p
            className="admin_nav_item_job"
            onClick={() => (window.location.href = "/jobAdminLogin")}
          >
            Logout
          </p>
        </div>
      </div>
      <div className="job_admin_continer">
        <p className="job_admin_continer_topic">
          Business Managers Account Details
        </p>

        <div className="admin_action_continer">
          <button
            className="admin_pdf_btn_job"
            onClick={() => (window.location.href = "/addBusinessManager")}
          >
            Add New Manager
          </button>
          <input
            type="text"
            className="admin_serch"
            placeholder="Search Here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="admin_pdf_btn_job" onClick={generatePDF}>
            Genarate Report
          </button>
        </div>
        <div className="admin_table_continer_job">
          <table className="admin_job_table">
            <thead>
              <tr className="admin_tr_job_tbl">
                <th className="admin_th_job_tbl">ID</th>
                <th className="admin_th_job_tbl">Name</th>
                <th className="admin_th_job_tbl">User Name</th>
                <th className="admin_th_job_tbl">Email</th>
                <th className="admin_th_job_tbl">Company</th>
                <th className="admin_th_job_tbl">Phone</th>
                <th className="admin_th_job_tbl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredManagers.length > 0 ? (
                filteredManagers.map((manager) => (
                  <tr key={manager.managerID} className="admin_tr_job_tbl">
                    <td className="admin_td_job_tbl">{manager.managerID}</td>
                    <td className="admin_td_job_tbl">{manager.fullName}</td>
                    <td className="admin_td_job_tbl">{manager.userName}</td>
                    <td className="admin_td_job_tbl">{manager.email}</td>
                    <td className="admin_td_job_tbl">{manager.companyName}</td>
                    <td className="admin_td_job_tbl">{manager.phone}</td>
                    <td className="admin_td_job_tbl">
                      <button
                        onClick={() => UpdateHandler(manager._id)}
                        className="admin_action_btn_job_update"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => deleteHandler(manager._id)}
                        className="admin_action_btn_job_delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="admin_td_job_tbl">
                    No Business Managers Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AllBusinessManagers;
