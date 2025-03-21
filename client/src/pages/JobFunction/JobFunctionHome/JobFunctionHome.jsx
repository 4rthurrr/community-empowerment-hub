// eslint-disable-next-line no-unused-vars
import React from 'react'
import './JobFunctionHome.css'
function JobFunctionHome() {
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
            <p className='nav_btn_job_poster' onClick={()=>(window.location.href='/jobSeekerLogin')}>Job Seeker</p><br/>
            <p className='nav_btn_job_poster' onClick={()=>(window.location.href='/businessManagerLogin')}>Business Manager</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobFunctionHome
