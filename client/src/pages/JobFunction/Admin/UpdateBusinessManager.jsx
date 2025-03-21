// eslint-disable-next-line no-unused-vars
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useNavigate } from "react-router";

function UpdateBusinessManager() {
  const [inputs, setInputs] = useState({});
  const history = useNavigate();
  const id = useParams().id;
  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/job/businessManager/${id}`
        );
        setInputs(response.data.businessManager);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchHandler();
  }, [id]);
  const sendRequest = async () => {
    await axios
      .put(`http://localhost:5000/job/businessManager/${id}`, {
        managerID: String(inputs.managerID),
        fullName: String(inputs.fullName),
        userName: String(inputs.userName),
        email: String(inputs.email),
        phone: String(inputs.phone),
        companyName: String(inputs.companyName),
        password: String(inputs.password),
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
      window.alert("Account Updated successfully!");
      history("/allBusinessManagers");
    });
  };
  return (
    <div>
      <div className="admin_nav_bar_job">
        <p className="nav_logo_job">Admin Dashboard</p>
        <div className="admin_nav_bar_job_lft">
          <p
            className="admin_nav_item_job admin_nav_item_job_active"
            onClick={() => (window.location.href = "/allBusinessManagers")}
          >
            Business
          </p>
          <p
            className="admin_nav_item_job "
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
      <div>
        <p className="admin_from_job_function_topic">
          Update Business Manager Account
        </p>
        <form onSubmit={handleSubmit} className="admin_from_job_function">
          <div className="job_seeker_auth_from_section">
            <label className="job_seeker_auth_from_lable">Manager ID</label>
            <input
              type="text"
              id="managerID"
              name="managerID"
              value={inputs.managerID}
              className="job_seeker_auth_from_input"
              readOnly
            />
          </div>
          <div className="job_seeker_auth_from_section">
            <label className="job_seeker_auth_from_lable">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="job_seeker_auth_from_input"
              required
              placeholder="Enter Full Name"
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
            <label className="job_seeker_auth_from_lable">User Name</label>
            <input
              type="text"
              id="userName"
              name="userName"
              className="job_seeker_auth_from_input"
              required
              placeholder="Enter User Name"
              value={inputs.userName}
              onChange={handleChange}
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
              placeholder="Enter Email"
              value={inputs.email}
              onChange={handleChange}
            />
          </div>
          <div className="job_seeker_auth_from_section">
            <label className="job_seeker_auth_from_lable">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="job_seeker_auth_from_input"
              required
              placeholder="Enter Your Password"
              value={inputs.password}
              onChange={handleChange}
            />
          </div>
          <div className="job_seeker_auth_from_section">
            <label className="job_seeker_auth_from_lable">Phone</label>
            <input
              type="text"
              id="phone"
              name="phone"
              className="job_seeker_auth_from_input"
              required
              placeholder="Enter Phone Number"
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
          <div className="job_seeker_auth_from_section">
            <label className="job_seeker_auth_from_lable">Company Name</label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              className="job_seeker_auth_from_input"
              required
              placeholder="Enter Company Name"
              value={inputs.companyName}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="job_seeker_auth_from_btn">
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateBusinessManager;
