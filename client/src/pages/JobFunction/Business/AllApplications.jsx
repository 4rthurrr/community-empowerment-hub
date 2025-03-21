// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { applyPlugin } from "jspdf-autotable";
applyPlugin(jsPDF);
import "./business.css";
function AllApplications() {
  const [jobPostApplication, setJobPostApplication] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loginManagerID = localStorage.getItem("LoginManagerID"); 
    axios
      .get("http://localhost:5000/job/applyJob")
      .then((response) => {
        const filteredApplications = response.data.jobPostApplication.filter(
          (application) => application.postOwnerID === loginManagerID
        );
        setJobPostApplication(filteredApplications); // Set the filtered applications to state
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const filtered = jobPostApplication.filter(
    (jobApplication) =>
      jobApplication.applicationID
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      jobApplication.fullName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      jobApplication.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Application Details Report", 14, 14);

    const tableColumn = ["Application ID", "Full Name", "Email", "Phone"];

    const tableRows = filtered.map((jobApplication) => [
      jobApplication.applicationID,
      jobApplication.fullName,
      jobApplication.email,
      jobApplication.phone,
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

    doc.save("Application report.pdf");
  };
  const handleDownloadCV = (cvFileName) => {
    // Construct the URL to download the CV file
    const downloadUrl = `http://localhost:5000/uploads/${cvFileName}`;
    window.open(downloadUrl, "_blank"); // Open the file in a new tab for download
  };
  return (
    <div>
     <div className="admin_nav_bar_job">
        <p className="nav_logo_job">Manager Dashboard</p>
        <div className="admin_nav_bar_job_lft">
          <p
            className="admin_nav_item_job "
            onClick={() => (window.location.href = "/jobPostDetails")}
          >
            Job Post
          </p>
          <p
            className="admin_nav_item_job admin_nav_item_job_active"
            onClick={() => (window.location.href = "/allJobApplication")}
          >
            Job Applications
          </p>
          <p
            className="admin_nav_item_job"
            onClick={() => (window.location.href = "/businessManagerLogin")}
          >
            Logout
          </p>
        </div>
      </div>
      <div className="job_admin_continer">
        <p className="job_admin_continer_topic">Users Job Applications</p>

        <div className="admin_action_continer">
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
            <tr className="admin_tr_job_tbl">
              <th className="admin_th_job_tbl">Application ID</th>
              <th className="admin_th_job_tbl">Full Name</th>
              <th className="admin_th_job_tbl">Email</th>
              <th className="admin_th_job_tbl">Phone</th>
              <th className="admin_th_job_tbl">Resume</th>
            </tr>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((jobApplication) => (
                  <tr
                    key={jobApplication.applicationID}
                    className="admin_tr_job_tbl"
                  >
                    <td className="admin_td_job_tbl">
                      {jobApplication.applicationID}
                    </td>
                    <td className="admin_td_job_tbl">
                      {jobApplication.fullName}
                    </td>
                    <td className="admin_td_job_tbl">{jobApplication.email}</td>
                    <td className="admin_td_job_tbl">{jobApplication.phone}</td>
                    <td className="admin_td_job_tbl">
                      <button
                        className="admin_download_btn"
                        onClick={() =>
                          handleDownloadCV(jobApplication.cvFileName)
                        }
                      >
                        Download CV
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="admin_td_job_tbl">
                    No Applications Found
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

export default AllApplications;
