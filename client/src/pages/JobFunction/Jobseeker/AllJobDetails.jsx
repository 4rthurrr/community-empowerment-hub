// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import CoverImg from "./img/cover.png";

function AllJobDetails() {
  const [jobPost, setJobPost] = useState([]); // All job posts
  const [filters, setFilters] = useState({
    industry: [],
    experienceLevel: [],
    location: [],
  }); // Filter options extracted from job posts
  const [selectedFilters, setSelectedFilters] = useState({
    industry: null,
    experienceLevel: null,
    location: null,
  }); // Selected filter values
  const navigate = useNavigate();

  // Fetch job posts
  useEffect(() => {
    axios
      .get("http://localhost:5000/job/jobpost")
      .then((response) => {
        setJobPost(response.data.jobPost);

        // Extract unique filter values from job posts
        const industries = [
          ...new Set(response.data.jobPost.map((job) => job.industry)),
        ];
        const experienceLevels = [
          ...new Set(response.data.jobPost.map((job) => job.experienceLevel)),
        ];
        const locations = [
          ...new Set(response.data.jobPost.map((job) => job.location)),
        ];

        // Set filter options
        setFilters({
          industry: industries,
          experienceLevel: experienceLevels,
          location: locations,
        });
      })
      .catch((error) => {
        console.error("Error fetching job posts:", error);
      });
  }, []);

  // Handle filter selection
  const handleFilterClick = (type, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [type]: prev[type] === value ? null : value, // Toggle filter selection
    }));
  };

  // Filter job posts based on selected filters
  const filteredJobPosts = jobPost.filter((job) => {
    return (
      (!selectedFilters.industry ||
        job.industry === selectedFilters.industry) &&
      (!selectedFilters.experienceLevel ||
        job.experienceLevel === selectedFilters.experienceLevel) &&
      (!selectedFilters.location || job.location === selectedFilters.location)
    );
  });

  // Navigate to view job post details
  const ViewJobPost = (_id) => {
    navigate(`/viewJobPoster/${_id}`);
  };

  return (
    <div>
      <div className="all_job_continer">
        {/* Filter Section */}
        <div className="side_bar_for_job_details">
          {/* Industry Filter */}
          <div className="side_section_job_details">
            <p className="side_section_job_details_topic">Industry</p>
            <div className="side_section_job_details_map_con">
              {filters.industry.map((industry, index) => (
                <p
                  key={index}
                  className={`side_section_job_details_map ${
                    selectedFilters.industry === industry ? "selected" : ""
                  }`}
                  onClick={() => handleFilterClick("industry", industry)}
                >
                  {industry}
                </p>
              ))}
            </div>
          </div>

          {/* Experience Level Filter */}
          <div className="side_section_job_details">
            <p className="side_section_job_details_topic">Experience Level</p>
            <div className="side_section_job_details_map_con">
              {filters.experienceLevel.map((level, index) => (
                <p
                  key={index}
                  className={`side_section_job_details_map ${
                    selectedFilters.experienceLevel === level ? "selected" : ""
                  }`}
                  onClick={() => handleFilterClick("experienceLevel", level)}
                >
                  {level}
                </p>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div className="side_section_job_details">
            <p className="side_section_job_details_topic">Location</p>
            <div className="side_section_job_details_map_con">
              {filters.location.map((location, index) => (
                <p
                  key={index}
                  className={`side_section_job_details_map ${
                    selectedFilters.location === location ? "selected" : ""
                  }`}
                  onClick={() => handleFilterClick("location", location)}
                >
                  {location}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div className="main_content_for_job_details">
          <p className="titlee_finde">
            Find Your Dream Job <span className="dot_span">.</span>
          </p>

          {/* Job Cards */}
          <div className="job_card_continer">
            {filteredJobPosts.map((jobPost) => (
              <div
                className="job_card_function"
                onClick={() => ViewJobPost(jobPost._id)}
                key={jobPost._id}
              >
                <img src={CoverImg} alt="jobcover" className="job_cover_img" />

                <p className="job_card_function_title">{jobPost.title}</p>
                <p className="job_card_function_companyName">
                  {jobPost.companyName}
                </p>

                <div className="job_card_contt">
                  <p className="job_card_function_sub_data">
                    {jobPost.industry}
                  </p>
                  <p className="job_card_function_sub_data job_card_function_sub_data_neww">
                    <FaLocationDot /> {jobPost.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllJobDetails;
