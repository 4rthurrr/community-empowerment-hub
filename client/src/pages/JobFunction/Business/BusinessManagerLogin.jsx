import { useState } from "react";
import axios from "axios";
import "./business.css";

function BusinessManagerLogin() {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/job/businessManager/login",
        {
          email: inputs.email,
          password: inputs.password,
        }
      );

      if (response.data.success) {
        // Store the manager ID in localStorage
        localStorage.setItem("LoginManagerID", response.data.manager.managerID);
        localStorage.setItem("LoginManagerName", response.data.manager.fullName);
        
        console.log("Manager ID stored:", response.data.manager.managerID);
        
        alert("Login successful!");
        window.location.href = "/jobPostDetails";
      } else {
        alert(response.data.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
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
              <p className="job_seeker_auth_sub_topic">Manager Panel</p>
            </div>
            <form className="job_seeker_auth_from" onSubmit={handleSubmit}>
              <div className="job_seeker_auth_from_section">
                <label className="job_seeker_auth_from_lable">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="job_seeker_auth_from_input"
                  required
                  placeholder="Enter Your Email"
                  value={inputs.email}
                  onChange={handleChange}
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
                  value={inputs.password}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="job_seeker_auth_from_btn">Sign In</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BusinessManagerLogin;