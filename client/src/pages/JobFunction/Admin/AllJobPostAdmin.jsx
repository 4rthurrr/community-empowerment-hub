// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const URL = "http://localhost:5000/job/jobpost";
function AllJobPostAdmin() {
  const [jobPost, setJobPost] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:5000/job/jobpost")
      .then((response) => {
        setJobPost(response.data.jobPost);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  const filter = jobPost.filter(
    (jobPost) =>
      jobPost.postID.toLowerCase().includes(searchQuery.toLowerCase()) ||
      jobPost.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      jobPost.experienceLevel
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      jobPost.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const deleteHandler = async (_id) => {
    // Define _id as a parameter
    const confirmed = window.confirm(
      "Are you sure you want to delete this Post ?"
    );

    if (confirmed) {
      try {
        await axios.delete(`${URL}/${_id}`);
        window.alert("Post Delete successfully!");
        window.location.reload();
      } catch (error) {
        // Handle deletion error if needed
        console.error("Error deleting details:", error);
      }
    }
  };
  const ViewJobPost = (_id) => {
    navigate(`/viewJobPost/${_id}`);
  };
  return (
    <div>
     <div className="admin_nav_bar_job">
        <p className="nav_logo_job">Admin Dashboard</p>
        <div className="admin_nav_bar_job_lft">
          <p
            className="admin_nav_item_job "
            onClick={() => (window.location.href = "/allBusinessManagers")}
          >
            Business
          </p>
          <p
            className="admin_nav_item_job admin_nav_item_job_active"
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
        <p className="job_admin_continer_topic">Job Post List</p>

        <div className="admin_action_continer">
          <input
            type="text"
            className="admin_serch"
            placeholder="Search Here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <p></p>
        </div>
        <div className="admin_table_continer_job">
          <table className="admin_job_table">
            <tr className="admin_tr_job_tbl">
              <th className="admin_th_job_tbl">Post ID</th>
              <th className="admin_th_job_tbl">title</th>
              <th className="admin_th_job_tbl">industry</th>
              <th className="admin_th_job_tbl">location</th>
              <th className="admin_th_job_tbl">experience Level</th>
              <th className="admin_th_job_tbl">Company name</th>
              <th className="admin_th_job_tbl">Action</th>
            </tr>
            <tbody>
              {filter.length > 0 ? (
                filter.map((manager) => (
                  <tr key={manager.managerID} className="admin_tr_job_tbl">
                    <td className="admin_td_job_tbl">{manager.postID}</td>
                    <td className="admin_td_job_tbl">{manager.title}</td>
                    <td className="admin_td_job_tbl">{manager.industry}</td>
                    <td className="admin_td_job_tbl">{manager.location}</td>
                    <td className="admin_td_job_tbl">
                      {manager.experienceLevel}
                    </td>
                    <td className="admin_td_job_tbl">
                      {manager.companyName}
                    </td>
                    <td className="admin_td_job_tbl">
                      <button
                        onClick={() => deleteHandler(manager._id)}
                        className="admin_action_btn_job_delete"
                      >
                        Delete
                      </button>
                      &nbsp;&nbsp;
                      <button
                        onClick={() => ViewJobPost(manager._id)}
                        className="admin_action_btn_job_update"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="admin_td_job_tbl">
                    No Post Found
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

export default AllJobPostAdmin;
