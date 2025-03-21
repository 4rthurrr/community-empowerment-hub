// eslint-disable-next-line no-unused-vars
import { useState, useEffect } from "react";
import axios from "axios";
import "./business.css";
function AddJobPost() {
  const [inputs, setInputs] = useState({
    ownerID: "",
    postID: "",
    industry: "",
    location: "",
    experienceLevel: "",
    applicationCloseDate: "",
    description: "",
    companyName: "",
  });
  const generateID = () => {
    const prefix = "PID ";
    const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
    return `${prefix}${randomNumber}`;
  };

  useEffect(() => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      postID: generateID(),
    }));
  }, []);
  useEffect(() => {
    const ownerID = localStorage.getItem("LoginManagerID");
    if (ownerID) {
      setInputs((prevInputs) => ({
        ...prevInputs,
        ownerID: ownerID,
      }));
    }
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(inputs);
    await sendRequest();
    window.alert("Post Upload successfully!");
    window.location.href = "./jobPostDetails";
  };
  const sendRequest = async () => {
    await axios.post("http://localhost:5000/job/jobpost", {
      ownerID: inputs.ownerID,
      postID: inputs.postID,
      title: inputs.title,
      industry: inputs.industry,
      location: inputs.location,
      experienceLevel: inputs.experienceLevel,
      applicationCloseDate: inputs.applicationCloseDate,
      description: inputs.description,
      companyName: inputs.companyName,
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
        <p className="admin_from_job_function_topic">Upload New Job Post</p>
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
              value={inputs.title}
              onChange={handleChange}
              placeholder="Enter Title"
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
              value={inputs.location}
              onChange={handleChange}
              type="text"
              id="location"
              name="location"
              className="job_seeker_auth_from_input"
              required
              placeholder="Enter Location"
            />
          </div>
          <div className="job_seeker_auth_from_section">
            <label className="job_seeker_auth_from_lable">
              Experience Level
            </label>
            <select
              value={inputs.experienceLevel}
              onChange={handleChange}
              id="experienceLevel"
              name="experienceLevel"
              className="job_seeker_auth_from_input"
              required
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
              value={inputs.applicationCloseDate}
              onChange={handleChange}
              type="date"
              id="applicationCloseDate"
              name="applicationCloseDate"
              className="job_seeker_auth_from_input"
              required
              placeholder="Select Date"
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
            Add
          </button>
        </form>
      </div>
      <br />
    </div>
  );
}

export default AddJobPost;
