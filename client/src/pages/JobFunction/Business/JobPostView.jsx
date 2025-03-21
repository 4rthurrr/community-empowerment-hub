// eslint-disable-next-line no-unused-vars
import { useEffect, useState } from "react";
import axios from "axios";
import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { FaLocationDot } from "react-icons/fa6";
import { useParams } from "react-router";
function JobPostView() {
  const [inputs, setInputs] = useState({});
  const id = useParams().id;
  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/job/jobpost/${id}`
        );
        setInputs(response.data.jobPost);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchHandler();
  }, [id]);
  return (
    <div>
      <div className="admin_nav_bar_job">
        <p className="nav_logo_job">Manager Dashboard</p>
        <div className="admin_nav_bar_job_lft">
          <p
            className="admin_nav_item_job admin_nav_item_job_active"
            onClick={() => (window.location.href = "/jobPostDetails")}
          >
            Job Post
          </p>
          <p
            className="admin_nav_item_job "
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
      <div className="application_view_continer">
        <div className="application_job_card">
          <p className="application_job_card_topic">{inputs.title}</p>
          <p className="application_job_card_id">{inputs.postID}</p>
          <p className="application_job_card_contend">
            <HiMiniBuildingOffice2 /> {inputs.companyName}
          </p>
          <p className="application_job_card_contend">
            <FaLocationDot /> {inputs.location}
          </p>
          <p className="application_job_card_contend">
            {inputs.experienceLevel} Level
          </p>
          <p className="application_job_card_contend">
            {inputs.industry} industry
          </p>
          <p className="application_job_card_expdate">
            Application Valid {inputs.applicationCloseDate}
          </p>
          <p className="application_job_card_pera">{inputs.description}</p>
        </div>
      </div>
    </div>
  );
}

export default JobPostView;
