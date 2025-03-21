// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import "./jobSeeker.css";
function JobSeekerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/job/jobSeeker/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Login successful");
        localStorage.setItem("JobSeekerID", data.jobSeeker._id);
        window.location.href = "/allJobDetails";
      } else {
        alert(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login");
    }
  };
  return (
    <div>
      <div className="job_seeker_auth_continer">
        <div className="job_seeker_auth_continer_colum">
          <div className="job_seeker_auth_continer_colum_left">
            <p className="job_seeker_auth_continer_colum_left_topic">
              Welcome to Community Empowerment Hub <br />
              Job Portal
            </p>
          </div>
        </div>
        <div className="job_seeker_auth_continer_colum">
          <div className="job_seeker_auth_colum_right">
            <div className="job_seeker_auth_colum_right_section_one">
              <p className="job_seeker_auth_topic">Sign in to your account</p>
              <p className="job_seeker_auth_sub_topic">
                Don&apos;t have an account?{" "}
                <span
                  className="job_seeker_auth_sub_topic_link"
                  onClick={() => (window.location.href = "/jobSeekerRegister")}
                >
                  Register
                </span>
              </p>
            </div>
            <form className="job_seeker_auth_from" onSubmit={handleLogin}>
              <div className="job_seeker_auth_from_section">
                <label className="job_seeker_auth_from_lable">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="job_seeker_auth_from_input"
                  required
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="job_seeker_auth_from_section">
                <label className="job_seeker_auth_from_lable">Password</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter Your Password"
                  name="password"
                  className="job_seeker_auth_from_input"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className="job_seeker_auth_from_btn">Sign In</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobSeekerLogin;
