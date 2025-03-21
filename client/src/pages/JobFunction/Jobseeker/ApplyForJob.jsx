import { useState, useEffect } from "react";
import axios from "axios";

function ApplyForJob() {
  const [inputs, setInputs] = useState({
    postID: "",
    userID: "",
    applicationID: "",
    fullName: "",
    email: "",
    phone: "",
    postOwnerID: "",
    cvFile: null,
  });

  const [fileError, setFileError] = useState("");

  const generateID = () => {
    const prefix = "AID ";
    const randomNumber = Math.floor(100000000 + Math.random() * 900000000);
    return `${prefix}${randomNumber}`;
  };

  useEffect(() => {
    setInputs((prevInputs) => ({
      ...prevInputs,
      applicationID: generateID(),
    }));
  }, []);

  useEffect(() => {
    const userID = localStorage.getItem("JobSeekerID");
    const postID = localStorage.getItem("JobApplicationID");
    const postOwnerID = localStorage.getItem("ClickPosterOwnerID");
    if (userID || postID) {
      setInputs((prevInputs) => ({
        ...prevInputs,
        ...(userID && { userID }),
        ...(postID && { postID }),
        ...(postOwnerID && { postOwnerID }),
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setInputs((prevInputs) => ({
        ...prevInputs,
        cvFile: file,
      }));
      setFileError("");
    } else {
      setInputs((prevInputs) => ({
        ...prevInputs,
        cvFile: null,
      }));
      setFileError("Please upload a valid PDF file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!inputs.cvFile) {
      setFileError("Please upload a PDF file.");
      return;
    }

    await sendRequest();
    window.alert("Application sent successfully!");
    window.location.href = "./allJobDetails";
  };

  const sendRequest = async () => {
    const formData = new FormData();
    formData.append("postID", inputs.postID);
    formData.append("userID", inputs.userID);
    formData.append("postOwnerID", inputs.postOwnerID);
    formData.append("applicationID", inputs.applicationID);
    formData.append("fullName", inputs.fullName);
    formData.append("email", inputs.email);
    formData.append("phone", inputs.phone);
    formData.append("cvFile", inputs.cvFile);

    await axios.post("http://localhost:5000/job/applyJob", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  return (
    <div>
      <div>
        <p className="admin_from_job_function_topic">Apply New Job</p>
        <form className="admin_from_job_function" onSubmit={handleSubmit}>
          <div className="job_seeker_auth_from_section">
            <label className="job_seeker_auth_from_lable">Application ID</label>
            <input
              type="text"
              id="applicationID"
              name="applicationID"
              className="job_seeker_auth_from_input"
              readOnly
              value={inputs.applicationID}
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
            <label className="job_seeker_auth_from_lable">
              Upload Your CV (PDF only)
            </label>
            <input
              type="file"
              id="cvFile"
              name="cvFile"
              className="job_seeker_auth_from_input"
              accept="application/pdf"
              onChange={handleFileChange}
            />
            {fileError && <p style={{ color: "red" }}>{fileError}</p>}
          </div>
          <button type="submit" className="job_seeker_auth_from_btn">
            Apply
          </button>
        </form>
      </div>
    </div>
  );
}

export default ApplyForJob;
