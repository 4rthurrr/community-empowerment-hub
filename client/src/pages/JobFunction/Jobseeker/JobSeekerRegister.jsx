// eslint-disable-next-line no-unused-vars
import { useState, useEffect } from "react";
import axios from "axios";

function JobSeekerRegister() {
  const [inputs, setInputs] = useState({
    fullName: "",
    email: "",
    phone: "",
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

    await sendRequest();
  };
  const sendRequest = async () => {
    try {
      const response = await axios.post("http://localhost:5000/job/jobSeeker", {
        fullName: inputs.fullName,
        email: inputs.email,
        phone: inputs.phone,
        password: inputs.password,
      });

      if (response.status === 200) {
        window.alert("Account Created successfully!");
        window.location.href = "./jobSeekerLogin";
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        window.alert(error.response.data.message);
      } else {
        // Handle other errors
        window.alert("An error occurred while creating the account.");
      }
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
              <p className="job_seeker_auth_topic">Create new account</p>
              <p className="job_seeker_auth_sub_topic">
                Already have an account{" "}
                <span
                  className="job_seeker_auth_sub_topic_link"
                  onClick={() => (window.location.href = "/jobSeekerLogin")}
                >
                  Login
                </span>
              </p>
            </div>
            <form className="job_seeker_auth_from" onSubmit={handleSubmit}>
              <div className="job_seeker_auth_from_section">
                <label className="job_seeker_auth_from_lable">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="job_seeker_auth_from_input"
                  required
                  placeholder="Enter Your Full Name"
                  value={inputs.fullName}
                  onChange={(e) => {
                    const re = /^[A-Za-z\s]*$/;
                    if (re.test(e.target.value)) {
                      handleChange(e);
                    }
                  }}
                />
              </div>
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
              <div className="job_seeker_auth_from_section">
                <label className="job_seeker_auth_from_lable">Phone</label>
                <input
                  type="text"
                  id="phone"
                  placeholder="Enter Your Phone Number"
                  name="phone"
                  className="job_seeker_auth_from_input"
                  required
                  onChange={(e) => {
                    const re = /^[0-9\b]{0,10}$/;
                    if (re.test(e.target.value)) {
                      handleChange(e);
                    }
                  }}
                  maxLength="10"
                  pattern="[0-9]{10}"
                  title="Please enter exactly 10 digits."
                  value={inputs.phone}
                />
              </div>
              <button className="job_seeker_auth_from_btn">Sign Up</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobSeekerRegister;
