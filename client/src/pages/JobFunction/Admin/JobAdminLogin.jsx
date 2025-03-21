// eslint-disable-next-line no-unused-vars
import React from "react";

function JobAdminLogin() {
  const handleLogin = (event) => {
    event.preventDefault();
    
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    
    if (username === "admin" && password === "123") {
      alert("Login successful");
      window.location.href = "/allJobPostAdmin";
    } else {
      alert("Incorrect username or password");
      window.location.reload();
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
              <p className="job_seeker_auth_sub_topic">Admin Panel</p>
            </div>
            <form className="job_seeker_auth_from" onSubmit={handleLogin}>
              <div className="job_seeker_auth_from_section">
                <label className="job_seeker_auth_from_lable">User Name</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="job_seeker_auth_from_input"
                  required
                  placeholder="Enter Your User Name"
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
                />
              </div>
              <button type="submit" className="job_seeker_auth_from_btn">
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobAdminLogin;