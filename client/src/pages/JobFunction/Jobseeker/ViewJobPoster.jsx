// eslint-disable-next-line no-unused-vars
import { useEffect, useState } from "react";
import axios from "axios";
import { HiMiniBuildingOffice2 } from "react-icons/hi2";
import { FaLocationDot } from "react-icons/fa6";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
function ViewJobPoster() {
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
  const navigate = useNavigate();

  const applyForJob = () => {
    // Save the post ID to local storage
    localStorage.setItem("JobApplicationID", id);
    localStorage.setItem("ClickPosterOwnerID", inputs.ownerID);
    // Navigate to the apply page
    navigate("/applyForJob");
  };

  return (
    <div>
      <div className="application_view_continer">
        <div className="application_job_card">
          <p className="application_job_card_topic">{inputs.title}</p>
          
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
          <p
            className="application_job_card_pera"
            style={{ whiteSpace: "pre-line" }}
          >
            {inputs.description}
          </p>
          <button className="applybtn_job" onClick={applyForJob}>
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewJobPoster;
