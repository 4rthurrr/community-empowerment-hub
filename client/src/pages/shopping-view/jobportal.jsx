import React, { useState, useEffect } from 'react';

const JobPortal = () => {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Job Form State
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    location: '',
    salary: '',
    jobDescription: '',
    category: ''
  });
  
  // Form Validation State
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Jobs State
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  
  // Search/Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Mock job data relevant to Community Empowerment Hub
  const dummyJobs = [
    {
      id: 1,
      jobTitle: 'Handcraft Artisan',
      companyName: 'Artisan Collective Sri Lanka',
      location: 'Colombo',
      salary: 35000,
      jobDescription: 'Seeking skilled artisans specializing in traditional Sri Lankan handcrafts. Must have experience with local materials and traditional techniques. Will create items for both local markets and tourism sector.',
      category: 'Crafts',
      postedDate: '2025-03-15'
    },
    {
      id: 2,
      jobTitle: 'Electrician',
      companyName: 'Community Development Trust',
      location: 'Kandy',
      salary: 42000,
      jobDescription: 'Experienced electrician needed for community infrastructure projects. Must have certification and 3+ years of experience with both residential and commercial installations.',
      category: 'Trades',
      postedDate: '2025-03-18'
    },
    {
      id: 3,
      jobTitle: 'Sewing Skills Instructor',
      companyName: 'Women Empowerment Cooperative',
      location: 'Jaffna',
      salary: 28000,
      jobDescription: 'Looking for a skilled tailor to teach sewing and garment-making to women in our community skills program. Part-time position, experience in teaching preferred.',
      category: 'Education',
      postedDate: '2025-03-10'
    },
    {
      id: 4,
      jobTitle: 'Organic Farming Coordinator',
      companyName: 'Sustainable Agriculture Network',
      location: 'Rural',
      salary: 38000,
      jobDescription: 'Coordinator needed to help organize and train small-scale farmers in organic farming techniques. Knowledge of sustainable agriculture practices required.',
      category: 'Agriculture',
      postedDate: '2025-03-20'
    },
    {
      id: 5,
      jobTitle: 'Community Health Worker',
      companyName: 'Rural Health Initiative',
      location: 'Batticaloa',
      salary: 32000,
      jobDescription: 'Part-time community health worker needed to assist with health education and basic healthcare services in underserved areas.',
      category: 'Healthcare',
      postedDate: '2025-03-17'
    },
    {
      id: 6,
      jobTitle: 'Traditional Cooking Instructor',
      companyName: 'Culinary Heritage Center',
      location: 'Galle',
      salary: 30000,
      jobDescription: 'Looking for someone with extensive knowledge of traditional Sri Lankan cooking techniques to provide workshops and training sessions for community members interested in culinary entrepreneurship.',
      category: 'Culinary',
      postedDate: '2025-03-12'
    },
    {
      id: 7,
      jobTitle: 'Carpenter',
      companyName: 'Rural Development Association',
      location: 'Anuradhapura',
      salary: 45000,
      jobDescription: 'Skilled carpenter needed for community building projects. Must have experience with both traditional and modern woodworking techniques.',
      category: 'Trades',
      postedDate: '2025-03-19'
    }
  ];
  
  // Load dummy jobs on component mount
  useEffect(() => {
    setJobs(dummyJobs);
    setFilteredJobs(dummyJobs);
  }, []);
  
  // Open modal and reset form
  const openModal = () => {
    setFormData({
      jobTitle: '',
      companyName: '',
      location: '',
      salary: '',
      jobDescription: '',
      category: ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };
  
  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.jobTitle.trim()) {
      errors.jobTitle = 'Job title is required';
    }
    
    if (!formData.companyName.trim()) {
      errors.companyName = 'Organization name is required';
    }
    
    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }
    
    if (formData.salary && isNaN(Number(formData.salary))) {
      errors.salary = 'Salary must be a number';
    }
    
    if (!formData.jobDescription.trim()) {
      errors.jobDescription = 'Job description is required';
    } else if (formData.jobDescription.trim().length < 50) {
      errors.jobDescription = 'Job description must be at least 50 characters';
    }
    
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    
    return errors;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    setFormErrors(errors);
    
    // Check if there are any errors
    if (Object.keys(errors).length === 0) {
      setIsSubmitting(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Add new job to the list with mock ID and current date
        const newJob = {
          ...formData,
          id: jobs.length + 1,
          salary: formData.salary ? Number(formData.salary) : null,
          postedDate: new Date().toISOString().slice(0, 10)
        };
        
        const updatedJobs = [newJob, ...jobs];
        setJobs(updatedJobs);
        
        // Apply current filters to updated jobs
        applyFilters(updatedJobs);
        
        // Close modal and reset form
        setIsModalOpen(false);
        alert('Job opportunity posted successfully!');
      } catch (error) {
        console.error('Error posting job:', error);
        alert('Failed to post job opportunity. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  // Apply search and filters
  const applyFilters = (jobsList = jobs) => {
    let filtered = [...jobsList];
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(job => 
        job.jobTitle.toLowerCase().includes(term) || 
        job.companyName.toLowerCase().includes(term)
      );
    }
    
    // Apply location filter
    if (locationFilter) {
      filtered = filtered.filter(job => job.location === locationFilter);
    }
    
    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(job => job.category === categoryFilter);
    }
    
    setFilteredJobs(filtered);
  };
  
  // Handle search/filter changes
  useEffect(() => {
    applyFilters();
  }, [searchTerm, locationFilter, categoryFilter, jobs]);
  
  // Get unique locations for filter dropdown
  const uniqueLocations = [...new Set(jobs.map(job => job.location))];
  
  // Get unique categories for filter dropdown
  const uniqueCategories = [...new Set(jobs.map(job => job.category))];
  
  // Category badge colors
  const categoryColors = {
    'Trades': 'bg-blue-500',
    'Crafts': 'bg-purple-500',
    'Agriculture': 'bg-green-500',
    'Education': 'bg-yellow-500',
    'Healthcare': 'bg-red-500',
    'Culinary': 'bg-orange-500'
  };
  
  // Click outside to close modal
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isModalOpen && e.target.classList.contains('modal-overlay')) {
        closeModal();
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isModalOpen]);
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);
  
  return (
    <div className="max-w-6xl mx-auto p-4 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Community Job Portal</h1>
        <p className="text-gray-600 mt-2">Connect with local opportunities or post jobs to support community empowerment</p>
        <div className="mt-4">
          <button 
            onClick={openModal}
            className="px-6 py-3 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 transition-colors"
          >
            Post a Job Opportunity
          </button>
        </div>
      </div>
      
      {/* Job Search and Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by job title or organization..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-64 p-3 border border-gray-300 rounded-md"
        />
        
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="flex-1 min-w-40 p-3 border border-gray-300 rounded-md"
        >
          <option value="">All Locations</option>
          {uniqueLocations.map((location, index) => (
            <option key={index} value={location}>{location}</option>
          ))}
        </select>
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="flex-1 min-w-40 p-3 border border-gray-300 rounded-md"
        >
          <option value="">All Categories</option>
          {uniqueCategories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
      </div>
      
      {/* Job Listings */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Available Opportunities ({filteredJobs.length})</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <div key={job.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="text-lg font-bold text-gray-800">{job.jobTitle}</div>
                <div className="text-gray-600 mb-2">{job.companyName}</div>
                
                <div className="flex items-center mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${categoryColors[job.category] || 'bg-gray-500'}`}>
                    {job.category}
                  </span>
                  <span className="text-xs text-gray-500 ml-auto">Posted: {job.postedDate}</span>
                </div>
                
                <div className="text-sm text-gray-700 mb-1">
                  <span className="font-semibold">Location:</span> {job.location}
                </div>
                
                {job.salary && (
                  <div className="text-sm text-gray-700 mb-1">
                    <span className="font-semibold">Salary:</span> Rs. {job.salary.toLocaleString()}
                  </div>
                )}
                
                <div className="my-4 text-sm text-gray-600">
                  {job.jobDescription.length > 120 
                    ? `${job.jobDescription.substring(0, 120)}...` 
                    : job.jobDescription}
                </div>
                
                <button 
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md text-sm font-semibold hover:bg-green-600 transition-colors"
                  onClick={() => alert(`Applied for ${job.jobTitle} at ${job.companyName}`)}
                >
                  Apply Now
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No opportunities found matching your criteria. Try adjusting your filters or post a new opportunity.
            </div>
          )}
        </div>
      </div>
      
      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Post a Job Opportunity</h2>
              <button 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block font-semibold mb-2 text-gray-700">Job Title *</label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md ${formErrors.jobTitle ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g. Handcraft Artisan, Carpenter, Electrician"
                  />
                  {formErrors.jobTitle && <div className="text-red-500 text-sm mt-1">{formErrors.jobTitle}</div>}
                </div>
                
                <div className="mb-4">
                  <label className="block font-semibold mb-2 text-gray-700">Organization Name *</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md ${formErrors.companyName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g. Artisan Collective, Community Development Trust"
                  />
                  {formErrors.companyName && <div className="text-red-500 text-sm mt-1">{formErrors.companyName}</div>}
                </div>
                
                <div className="mb-4">
                  <label className="block font-semibold mb-2 text-gray-700">Location *</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md ${formErrors.location ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g. Colombo, Kandy, Jaffna"
                  />
                  {formErrors.location && <div className="text-red-500 text-sm mt-1">{formErrors.location}</div>}
                </div>
                
                <div className="mb-4">
                  <label className="block font-semibold mb-2 text-gray-700">Monthly Salary (Rs.) (optional)</label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md ${formErrors.salary ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g. 35000"
                  />
                  {formErrors.salary && <div className="text-red-500 text-sm mt-1">{formErrors.salary}</div>}
                </div>
                
                <div className="mb-4">
                  <label className="block font-semibold mb-2 text-gray-700">Job Description *</label>
                  <textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md ${formErrors.jobDescription ? 'border-red-500' : 'border-gray-300'}`}
                    rows="4"
                    placeholder="Describe the job responsibilities, skills required, and qualifications (minimum 50 characters)"
                  />
                  {formErrors.jobDescription && <div className="text-red-500 text-sm mt-1">{formErrors.jobDescription}</div>}
                </div>
                
                <div className="mb-6">
                  <label className="block font-semibold mb-2 text-gray-700">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md ${formErrors.category ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select Category</option>
                    <option value="Trades">Trades (Carpentry, Electrical, Plumbing)</option>
                    <option value="Crafts">Crafts & Artisanal Work</option>
                    <option value="Agriculture">Agriculture & Farming</option>
                    <option value="Education">Education & Training</option>
                    <option value="Healthcare">Healthcare & Wellness</option>
                    <option value="Culinary">Culinary & Food Production</option>
                  </select>
                  {formErrors.category && <div className="text-red-500 text-sm mt-1">{formErrors.category}</div>}
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-md font-semibold text-white ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Posting...' : 'Post Opportunity'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPortal;