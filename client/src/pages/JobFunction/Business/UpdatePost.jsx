// eslint-disable-next-line no-unused-vars
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";
import "./business.css";
function UpdatePost() {
  const [inputs, setInputs] = useState({});
  const history = useNavigate();
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
  const sendRequest = async () => {
    await axios
      .put(`http://localhost:5000/job/jobpost/${id}`, {
        postID: String(inputs.postID),
        title: String(inputs.title),
        industry: String(inputs.industry),
        location: String(inputs.location),
        experienceLevel: String(inputs.experienceLevel),
        applicationCloseDate: String(inputs.applicationCloseDate),
        description: String(inputs.description),
        companyName: String(inputs.companyName),
      })
      .then((res) => res.data);
  };
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(() => {
      window.alert("Post Updated successfully!");
      history("/jobPostDetails");
    });
  };
  const today = new Date().toISOString().split("T")[0];
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
      <div>
        <p className="admin_from_job_function_topic">Update Job Post Details</p>
        <form className="admin_from_job_function" onSubmit={handleSubmit}>
          <div className="job_seeker_auth_from_section">
            <label className="job_seeker_auth_from_lable">Post ID</label>
            <input
              type="text"
              id="postID"
              name="postID"
              className="job_seeker_auth_from_input"
              readOnly
              value={inputs.postID}
            />
          </div>
          <div className="job_seeker_auth_from_section">
            <label className="job_seeker_auth_from_lable">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="job_seeker_auth_from_input"
              required
              placeholder="Enter Title"
              value={inputs.title}
              onChange={handleChange}
            />
          </div>
          <div className="job_seeker_auth_from_section">
            <label className="job_seeker_auth_from_lable">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              className="job_seeker_auth_from_input"
              required
              value={inputs.companyName}
              onChange={handleChange}
              placeholder="Enter Company Name"
            />
          </div>
          <div className="job_seeker_auth_from_section">
            <label className="job_seeker_auth_from_lable">Industry</label>
            <select
              id="industry"
              name="industry"
              className="job_seeker_auth_from_input"
              required
              value={inputs.industry}
              onChange={handleChange}
            >
              <option value="">Select Industry</option>
              <option value="it">IT</option>
              <option value="finance">Finance</option>
              <option value="healthcare">Healthcare</option>
              <option value="education">Education</option>
              <option value="operations">Operations</option>
            </select>
          </div>
          <div className="job_seeker_auth_from_section">
            <label className="job_seeker_auth_from_lable">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              className="job_seeker_auth_from_input"
              required
              placeholder="Enter Location"
              value={inputs.location}
              onChange={handleChange}
            />
          </div>
          <div className="job_seeker_auth_from_section">
            <label className="job_seeker_auth_from_lable">
              Experience Level
            </label>
            <select
              id="experienceLevel"
              name="experienceLevel"
              className="job_seeker_auth_from_input"
              required
              value={inputs.experienceLevel}
              onChange={handleChange}
            >
              <option value="">Select Experience Level</option>
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
              <option value="lead">Lead</option>
              <option value="executive">Executive</option>
            </select>
          </div>
          <div className="job_seeker_auth_from_section">
            <label className="job_seeker_auth_from_lable">
              Application Close Date
            </label>
            <input
              type="date"
              id="applicationCloseDate"
              name="applicationCloseDate"
              className="job_seeker_auth_from_input"
              required
              placeholder="Select Date"
              value={inputs.applicationCloseDate}
              onChange={handleChange}
              min={today}
            />
          </div>
          <div className="job_seeker_auth_from_section">
            <label className="job_seeker_auth_from_lable">Description</label>
            <textarea
              value={inputs.description}
              onChange={handleChange}
              type="text"
              id="description"
              name="description"
              className="job_seeker_auth_from_input"
              required
              placeholder="Enter Job Description"
              rows="5"
            />
          </div>
          <button type="submit" className="job_seeker_auth_from_btn">
            Update
          </button>
        </form>
      </div>
      <br />
    </div>
  );
}

export default UpdatePost;
