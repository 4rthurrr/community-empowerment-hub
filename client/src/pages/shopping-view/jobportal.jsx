import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const JobPortal = () => {
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editJobId, setEditJobId] = useState(null);
  
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
  const [myJobs, setMyJobs] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  
  // Active tab state
  const [activeTab, setActiveTab] = useState('all');
  
  // Search/Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Additional state for applications
  const [applications, setApplications] = useState([]);
  const [userAppliedJobs, setUserAppliedJobs] = useState([]);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [currentJobToApply, setCurrentJobToApply] = useState(null);
  const [applicationFormData, setApplicationFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    coverLetter: '',
    resume: null
  });
  const [applicationFormErrors, setApplicationFormErrors] = useState({});
  const [isApplicationSubmitting, setIsApplicationSubmitting] = useState(false);
  
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
      postedDate: '2025-03-15',
      postedBy: 'user123' // Mock user ID
    },
    {
      id: 2,
      jobTitle: 'Electrician',
      companyName: 'Community Development Trust',
      location: 'Kandy',
      salary: 42000,
      jobDescription: 'Experienced electrician needed for community infrastructure projects. Must have certification and 3+ years of experience with both residential and commercial installations.',
      category: 'Trades',
      postedDate: '2025-03-18',
      postedBy: 'other123'
    },
    // Other job listings remain the same...
    {
      id: 3,
      jobTitle: 'Sewing Skills Instructor',
      companyName: 'Women Empowerment Cooperative',
      location: 'Jaffna',
      salary: 28000,
      jobDescription: 'Looking for a skilled tailor to teach sewing and garment-making to women in our community skills program. Part-time position, experience in teaching preferred.',
      category: 'Education',
      postedDate: '2025-03-10',
      postedBy: 'other123'
    },
    {
      id: 4,
      jobTitle: 'Organic Farming Coordinator',
      companyName: 'Sustainable Agriculture Network',
      location: 'Rural',
      salary: 38000,
      jobDescription: 'Coordinator needed to help organize and train small-scale farmers in organic farming techniques. Knowledge of sustainable agriculture practices required.',
      category: 'Agriculture',
      postedDate: '2025-03-20',
      postedBy: 'user123' // Mock user ID
    },
    {
      id: 5,
      jobTitle: 'Community Health Worker',
      companyName: 'Rural Health Initiative',
      location: 'Batticaloa',
      salary: 32000,
      jobDescription: 'Part-time community health worker needed to assist with health education and basic healthcare services in underserved areas.',
      category: 'Healthcare',
      postedDate: '2025-03-17',
      postedBy: 'other123'
    },
    {
      id: 6,
      jobTitle: 'Traditional Cooking Instructor',
      companyName: 'Culinary Heritage Center',
      location: 'Galle',
      salary: 30000,
      jobDescription: 'Looking for someone with extensive knowledge of traditional Sri Lankan cooking techniques to provide workshops and training sessions for community members interested in culinary entrepreneurship.',
      category: 'Culinary',
      postedDate: '2025-03-12',
      postedBy: 'other123'
    },
    {
      id: 7,
      jobTitle: 'Carpenter',
      companyName: 'Rural Development Association',
      location: 'Anuradhapura',
      salary: 45000,
      jobDescription: 'Skilled carpenter needed for community building projects. Must have experience with both traditional and modern woodworking techniques.',
      category: 'Trades',
      postedDate: '2025-03-19',
      postedBy: 'user123' // Mock user ID
    }
  ];
  
  // Mock current user ID (in a real app, this would come from authentication)
  const currentUserId = 'user123';
  
  // Add the missing mock applications data
  const mockApplications = [
    {
      id: 1,
      jobId: 1,
      applicantId: 'other456',
      applicantName: 'Priya Fernando',
      email: 'priya.f@example.com',
      phone: '071-555-3421',
      experience: '5 years of experience with traditional Sri Lankan handicrafts, specializing in pottery and batik.',
      coverLetter: 'I am excited to apply for the Handcraft Artisan position as I believe my skills in traditional crafts would be valuable to your organization...',
      resume: 'resume-file.pdf',
      status: 'pending',
      appliedDate: '2025-03-20'
    },
    {
      id: 2,
      jobId: 1,
      applicantId: 'other789',
      applicantName: 'Amal Perera',
      email: 'amal.p@example.com',
      phone: '077-555-8976',
      experience: '3 years working with local artisan collective, trained in traditional techniques by master craftspeople.',
      coverLetter: 'Having worked with traditional materials and techniques for several years, I am interested in bringing my skills to your organization...',
      resume: 'resume-file.pdf',
      status: 'pending',
      appliedDate: '2025-03-21'
    },
    {
      id: 3,
      jobId: 4,
      applicantId: 'other123',
      applicantName: 'Kamal Silva',
      email: 'kamal.s@example.com',
      phone: '076-555-4567',
      experience: '4 years working with sustainable farming practices, certified in organic cultivation methods.',
      coverLetter: 'With my background in sustainable agriculture and experience training small-scale farmers, I believe I can contribute significantly to your network...',
      resume: 'resume-file.pdf',
      status: 'pending',
      appliedDate: '2025-03-22'
    }
  ];
  
  // Load dummy jobs on component mount and filter my jobs
  useEffect(() => {
    setJobs(dummyJobs);
    setFilteredJobs(dummyJobs);
    
    // Filter jobs posted by current user
    const userJobs = dummyJobs.filter(job => job.postedBy === currentUserId);
    setMyJobs(userJobs);
  }, []);
  
  // Load mock applications on component mount
  useEffect(() => {
    setApplications(mockApplications);
  }, []);
  
  // Open modal and reset form for new job
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
    setIsEditMode(false);
    setEditJobId(null);
  };
  
  // Open modal with job data for editing
  const openEditModal = (job) => {
    setFormData({
      jobTitle: job.jobTitle,
      companyName: job.companyName,
      location: job.location,
      salary: job.salary.toString(),
      jobDescription: job.jobDescription,
      category: job.category
    });
    setFormErrors({});
    setIsModalOpen(true);
    setIsEditMode(true);
    setEditJobId(job.id);
  };
  
  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditJobId(null);
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
    
    // Job Title validation
    if (!formData.jobTitle.trim()) {
      errors.jobTitle = 'Job title is required';
    } else if (formData.jobTitle.trim().length < 3) {
      errors.jobTitle = 'Job title must be at least 3 characters';
    } else if (formData.jobTitle.trim().length > 100) {
      errors.jobTitle = 'Job title must be less than 100 characters';
    }
    
    // Organization Name validation
    if (!formData.companyName.trim()) {
      errors.companyName = 'Organization name is required';
    } else if (formData.companyName.trim().length < 3) {
      errors.companyName = 'Organization name must be at least 3 characters';
    } else if (formData.companyName.trim().length > 100) {
      errors.companyName = 'Organization name must be less than 100 characters';
    }
    
    // Location validation
    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    } else if (formData.location.trim().length < 2) {
      errors.location = 'Location must be at least 2 characters';
    } else if (formData.location.trim().length > 50) {
      errors.location = 'Location must be less than 50 characters';
    }
    
    // Salary validation - must be positive number or empty
    if (formData.salary !== '') {
      const salaryNum = Number(formData.salary);
      if (isNaN(salaryNum)) {
        errors.salary = 'Salary must be a valid number';
      } else if (salaryNum <= 0) {
        errors.salary = 'Salary must be greater than zero';
      } else if (salaryNum > 1000000) {
        errors.salary = 'Salary value is too high';
      } else if (!Number.isInteger(salaryNum)) {
        errors.salary = 'Salary must be a whole number';
      }
    }
    
    // Job Description validation
    if (!formData.jobDescription.trim()) {
      errors.jobDescription = 'Job description is required';
    } else if (formData.jobDescription.trim().length < 50) {
      errors.jobDescription = `Job description must be at least 50 characters (currently ${formData.jobDescription.trim().length})`;
    } else if (formData.jobDescription.trim().length > 1000) {
      errors.jobDescription = 'Job description must be less than 1000 characters';
    }
    
    // Category validation
    if (!formData.category) {
      errors.category = 'Please select a job category';
    }
    
    return errors;
  };
  
  // Handle form submission (create or edit job)
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
        
        if (isEditMode) {
          // Update existing job
          const updatedJobs = jobs.map(job => 
            job.id === editJobId ? {
              ...job,
              jobTitle: formData.jobTitle,
              companyName: formData.companyName,
              location: formData.location,
              salary: formData.salary ? Number(formData.salary) : null,
              jobDescription: formData.jobDescription,
              category: formData.category
            } : job
          );
          
          setJobs(updatedJobs);
          
          // Update myJobs state
          const updatedMyJobs = myJobs.map(job => 
            job.id === editJobId ? {
              ...job,
              jobTitle: formData.jobTitle,
              companyName: formData.companyName,
              location: formData.location,
              salary: formData.salary ? Number(formData.salary) : null,
              jobDescription: formData.jobDescription,
              category: formData.category
            } : job
          );
          
          setMyJobs(updatedMyJobs);
          
          // Update wishlist if the edited job is in wishlist
          if (wishlist.some(job => job.id === editJobId)) {
            const updatedWishlist = wishlist.map(job => 
              job.id === editJobId ? {
                ...job,
                jobTitle: formData.jobTitle,
                companyName: formData.companyName,
                location: formData.location,
                salary: formData.salary ? Number(formData.salary) : null,
                jobDescription: formData.jobDescription,
                category: formData.category
              } : job
            );
            
            setWishlist(updatedWishlist);
          }
          
          alert('Job opportunity updated successfully!');
        } else {
          // Add new job
          const newJob = {
            ...formData,
            id: jobs.length + 1,
            salary: formData.salary ? Number(formData.salary) : null,
            postedDate: new Date().toISOString().slice(0, 10),
            postedBy: currentUserId
          };
          
          const updatedJobs = [newJob, ...jobs];
          setJobs(updatedJobs);
          
          // Add to myJobs
          setMyJobs([newJob, ...myJobs]);
          
          alert('Job opportunity posted successfully!');
        }
        
        // Apply current filters to updated jobs if on main tab
        if (activeTab === 'all') {
          applyFilters();
        }
        
        // Close modal and reset form
        setIsModalOpen(false);
      } catch (error) {
        console.error('Error handling job:', error);
        alert('Failed to process job opportunity. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  // Delete a job
  const handleDeleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job opportunity?')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Remove from all jobs
        const updatedJobs = jobs.filter(job => job.id !== jobId);
        setJobs(updatedJobs);
        
        // Remove from my jobs
        const updatedMyJobs = myJobs.filter(job => job.id !== jobId);
        setMyJobs(updatedMyJobs);
        
        // Remove from wishlist if present
        if (wishlist.some(job => job.id !== jobId)) {
          const updatedWishlist = wishlist.filter(job => job.id !== jobId);
          setWishlist(updatedWishlist);
        }
        
        // Apply filters to update filtered jobs if on main tab
        if (activeTab === 'all') {
          applyFilters(updatedJobs);
        }
        
        alert('Job opportunity deleted successfully!');
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job opportunity. Please try again.');
      }
    }
  };
  
  // Toggle wishlist status
  const toggleWishlist = (job) => {
    const isInWishlist = wishlist.some(item => item.id === job.id);
    
    if (isInWishlist) {
      // Remove from wishlist
      const updatedWishlist = wishlist.filter(item => item.id !== job.id);
      setWishlist(updatedWishlist);
    } else {
      // Add to wishlist
      setWishlist([...wishlist, job]);
    }
  };
  
  // Check if a job is in wishlist
  const isJobInWishlist = (jobId) => {
    return wishlist.some(job => job.id === jobId);
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
  
  // Open application modal
  const openApplicationModal = (job) => {
    setCurrentJobToApply(job);
    setApplicationFormData({
      name: '',
      email: '',
      phone: '',
      experience: '',
      coverLetter: '',
      resume: null
    });
    setApplicationFormErrors({});
    setIsApplicationModalOpen(true);
  };
  
  // Close application modal
  const closeApplicationModal = () => {
    setIsApplicationModalOpen(false);
    setCurrentJobToApply(null);
  };
  
  // Handle application form input changes
  const handleApplicationChange = (e) => {
    const { name, value } = e.target;
    setApplicationFormData({
      ...applicationFormData,
      [name]: value
    });
  };
  
  // Handle file upload for resume
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setApplicationFormData({
        ...applicationFormData,
        resume: e.target.files[0]
      });
    }
  };
  
  // Validate application form
  const validateApplicationForm = () => {
    const errors = {};
    
    // Name validation
    if (!applicationFormData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (applicationFormData.name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters';
    } else if (applicationFormData.name.trim().length > 100) {
      errors.name = 'Name must be less than 100 characters';
    } else if (!/^[a-zA-Z\s.'-]+$/.test(applicationFormData.name.trim())) {
      errors.name = 'Name contains invalid characters';
    }
    
    // Email validation with better regex
    if (!applicationFormData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(applicationFormData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Phone validation with Sri Lankan format
    if (!applicationFormData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^0[0-9]{9}$|^\+94[0-9]{9}$|^07[0-9]-[0-9]{3}-[0-9]{4}$/.test(
      applicationFormData.phone.trim().replace(/\s/g, '')
    )) {
      errors.phone = 'Please enter a valid Sri Lankan phone number (e.g., 07X-XXX-XXXX or 07XXXXXXXX)';
    }
    
    // Experience validation
    if (!applicationFormData.experience.trim()) {
      errors.experience = 'Experience information is required';
    } else if (applicationFormData.experience.trim().length < 20) {
      errors.experience = `Experience details must be at least 20 characters (currently ${applicationFormData.experience.trim().length})`;
    } else if (applicationFormData.experience.trim().length > 500) {
      errors.experience = 'Experience details must be less than 500 characters';
    }
    
    // Cover letter validation
    if (!applicationFormData.coverLetter.trim()) {
      errors.coverLetter = 'Cover letter is required';
    } else if (applicationFormData.coverLetter.trim().length < 50) {
      errors.coverLetter = `Cover letter must be at least 50 characters (currently ${applicationFormData.coverLetter.trim().length})`;
    } else if (applicationFormData.coverLetter.trim().length > 1000) {
      errors.coverLetter = 'Cover letter must be less than 1000 characters';
    }
    
    // Resume file validation
    if (applicationFormData.resume) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!allowedTypes.includes(applicationFormData.resume.type)) {
        errors.resume = 'Resume must be in PDF, DOC, or DOCX format';
      } else if (applicationFormData.resume.size > maxSize) {
        errors.resume = 'Resume file size must be less than 5MB';
      }
    }
    
    return errors;
  };
  
  // Handle application form submission
  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateApplicationForm();
    setApplicationFormErrors(errors);
    
    // Check if there are any errors
    if (Object.keys(errors).length === 0) {
      setIsApplicationSubmitting(true);
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Create new application
        const newApplication = {
          id: applications.length + 1,
          jobId: currentJobToApply.id,
          applicantId: currentUserId,
          applicantName: applicationFormData.name,
          email: applicationFormData.email,
          phone: applicationFormData.phone,
          experience: applicationFormData.experience,
          coverLetter: applicationFormData.coverLetter,
          resume: applicationFormData.resume ? applicationFormData.resume.name : 'resume.pdf',
          status: 'pending',
          appliedDate: new Date().toISOString().slice(0, 10)
        };
        
        // Add to applications
        setApplications([...applications, newApplication]);
        
        // Add to user's applied jobs
        setUserAppliedJobs([...userAppliedJobs, currentJobToApply.id]);
        
        alert(`Your application for ${currentJobToApply.jobTitle} has been submitted successfully!`);
        
        // Close modal
        closeApplicationModal();
      } catch (error) {
        console.error('Error submitting application:', error);
        alert('Failed to submit application. Please try again.');
      } finally {
        setIsApplicationSubmitting(false);
      }
    }
  };
  
  // Check if user has applied to a job
  const hasUserAppliedToJob = (jobId) => {
    return userAppliedJobs.includes(jobId) || applications.some(app => app.applicantId === currentUserId && app.jobId === jobId);
  };
  
  // Get applications for a specific job
  const getApplicationsForJob = (jobId) => {
    return applications.filter(app => app.jobId === jobId);
  };
  
  // Update application status
  const updateApplicationStatus = (applicationId, newStatus) => {
    const updatedApplications = applications.map(app => 
      app.id === applicationId ? { ...app, status: newStatus } : app
    );
    setApplications(updatedApplications);
    alert(`Application status updated to ${newStatus}`);
  };
  
  // Add new state for tracking expanded application sections
  const [expandedJobApplications, setExpandedJobApplications] = useState({});
  
  // Toggle expansion for a job's applications
  const toggleApplicationsExpansion = (jobId) => {
    setExpandedJobApplications(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };
  
  // Check if a job's applications are expanded
  const isApplicationsExpanded = (jobId) => {
    return expandedJobApplications[jobId] || false;
  };
  
  // Render job card - extracted as component for reuse
  const JobCard = ({ job, showActions = true, showWishlist = true, showEdit = false, showDelete = false, showApplications = false }) => (
    <div key={job.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow relative">
      {showWishlist && (
        <button
          onClick={() => toggleWishlist(job)}
          className={`absolute top-3 right-3 p-2 rounded-full ${
            isJobInWishlist(job.id) ? 'text-red-500 hover:bg-red-50' : 'text-gray-400 hover:bg-gray-50'
          }`}
          aria-label={isJobInWishlist(job.id) ? "Remove from wishlist" : "Add to wishlist"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill={isJobInWishlist(job.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
      )}
      
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
      
      <div className="flex flex-wrap gap-2 mt-3">
        {showActions && (
          hasUserAppliedToJob(job.id) ? (
            <button 
              className="px-4 py-2 bg-green-200 text-green-800 rounded-md text-sm font-semibold cursor-default flex-1 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
              Applied
            </button>
          ) : (
            <button 
              className="px-4 py-2 bg-green-500 text-white rounded-md text-sm font-semibold hover:bg-green-600 transition-colors flex-1"
              onClick={() => openApplicationModal(job)}
            >
              Apply Now
            </button>
          )
        )}
        
        {showEdit && (
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-semibold hover:bg-blue-600 transition-colors flex-1"
            onClick={() => openEditModal(job)}
          >
            Edit
          </button>
        )}
        
        {showDelete && (
          <button 
            className="px-4 py-2 bg-red-500 text-white rounded-md text-sm font-semibold hover:bg-red-600 transition-colors flex-1"
            onClick={() => handleDeleteJob(job.id)}
          >
            Delete
          </button>
        )}
      </div>
      
      {showApplications && (
        <>
          {getApplicationsForJob(job.id).length > 0 ? (
            <div className="mt-4 pt-4 border-t">
              <button 
                onClick={() => toggleApplicationsExpansion(job.id)}
                className="flex items-center justify-between w-full py-2 px-4 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  Applications ({getApplicationsForJob(job.id).length})
                </div>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 text-gray-600 transition-transform ${isApplicationsExpanded(job.id) ? 'rotate-180' : ''}`} 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              
              {isApplicationsExpanded(job.id) && (
                <div className="mt-3 space-y-3">
                  {getApplicationsForJob(job.id).map(application => (
                    <div key={application.id} className="bg-gray-50 p-4 rounded-md border border-gray-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-semibold">{application.applicantName}</div>
                          <div className="text-xs text-gray-500">Applied: {application.appliedDate}</div>
                        </div>
                        <Badge className={`
                          ${application.status === 'approved' ? 'bg-green-500' : 
                            application.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'}
                        `}>
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-2">
                        <div>
                          <span className="font-medium">Email:</span> {application.email}
                        </div>
                        <div>
                          <span className="font-medium">Phone:</span> {application.phone}
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-600 mb-3">
                        <span className="font-medium">Experience:</span> {application.experience}
                      </div>
                      
                      <details className="mb-3">
                        <summary className="text-xs font-medium text-blue-600 cursor-pointer">View Cover Letter</summary>
                        <div className="mt-2 p-3 bg-white rounded border text-xs text-gray-700">
                          {application.coverLetter}
                        </div>
                      </details>
                      
                      <div className="text-xs mb-3">
                        <span className="font-medium">Resume:</span> 
                        <a href="#" className="text-blue-600 ml-1 hover:underline">{application.resume}</a>
                      </div>
                      
                      {application.status === 'pending' && (
                        <div className="flex space-x-2 mt-3">
                          <button 
                            onClick={() => updateApplicationStatus(application.id, 'approved')}
                            className="px-3 py-1.5 text-xs bg-green-500 text-white rounded hover:bg-green-600 flex-1"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => updateApplicationStatus(application.id, 'rejected')}
                            className="px-3 py-1.5 text-xs bg-red-500 text-white rounded hover:bg-red-600 flex-1"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t">
              <div className="text-center text-sm text-gray-500 py-3">
                No applications received yet
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

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
      
      {/* Tabs Navigation */}
      <Tabs 
        defaultValue="all" 
        className="mb-6"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="all">All Opportunities</TabsTrigger>
          <TabsTrigger value="myjobs">My Job Listings</TabsTrigger>
          <TabsTrigger value="wishlist">
            Wish List
            {wishlist.length > 0 && (
              <Badge className="ml-2 bg-blue-500">{wishlist.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
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
          
          {/* All Job Listings */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Available Opportunities ({filteredJobs.length})</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.length > 0 ? (
                filteredJobs.map(job => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No opportunities found matching your criteria. Try adjusting your filters or post a new opportunity.
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="myjobs">
          {/* My Job Listings */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">My Job Listings ({myJobs.length})</h2>
              <button 
                onClick={openModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-semibold hover:bg-blue-600 transition-colors"
              >
                Post New Job
              </button>
            </div>
            
            {myJobs.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {myJobs.map(job => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    showActions={false}
                    showWishlist={false}
                    showEdit={true}
                    showDelete={true}
                    showApplications={true}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-2">You haven't posted any job opportunities yet</h3>
                <p className="text-gray-600 mb-4">Share opportunities to help community members find work that matches their skills</p>
                <button 
                  onClick={openModal}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 transition-colors"
                >
                  Post Your First Job
                </button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="wishlist">
          {/* Wishlist */}
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Saved Opportunities ({wishlist.length})</h2>
            
            {wishlist.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map(job => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                  />
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-600 mb-4">Save job opportunities by clicking the heart icon on any job listing</p>
                <button 
                  onClick={() => setActiveTab('all')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 transition-colors"
                >
                  Browse Opportunities
                </button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {isEditMode ? 'Edit Job Opportunity' : 'Post a Job Opportunity'}
              </h2>
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
              {/* Error summary */}
              {Object.keys(formErrors).length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="font-semibold text-red-700 mb-2">Please fix the following errors:</p>
                  <ul className="list-disc list-inside text-sm text-red-700">
                    {Object.values(formErrors).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block font-semibold mb-2 text-gray-700">
                    Job Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md ${formErrors.jobTitle ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g. Handcraft Artisan, Carpenter, Electrician"
                    maxLength={100}
                  />
                  <div className="flex justify-between mt-1">
                    {formErrors.jobTitle && <div className="text-red-500 text-sm">{formErrors.jobTitle}</div>}
                    <div className="text-xs text-gray-500 ml-auto">
                      {formData.jobTitle.length}/100
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block font-semibold mb-2 text-gray-700">
                    Organization Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md ${formErrors.companyName ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g. Artisan Collective, Community Development Trust"
                    maxLength={100}
                  />
                  <div className="flex justify-between mt-1">
                    {formErrors.companyName && <div className="text-red-500 text-sm">{formErrors.companyName}</div>}
                    <div className="text-xs text-gray-500 ml-auto">
                      {formData.companyName.length}/100
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block font-semibold mb-2 text-gray-700">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md ${formErrors.location ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g. Colombo, Kandy, Jaffna"
                    maxLength={50}
                  />
                  <div className="flex justify-between mt-1">
                    {formErrors.location && <div className="text-red-500 text-sm">{formErrors.location}</div>}
                    <div className="text-xs text-gray-500 ml-auto">
                      {formData.location.length}/50
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block font-semibold mb-2 text-gray-700">
                    Monthly Salary (Rs.) <span className="text-gray-500 font-normal">(optional)</span>
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md ${formErrors.salary ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="e.g. 35000"
                    min="0"
                    step="1"
                  />
                  {formErrors.salary && <div className="text-red-500 text-sm mt-1">{formErrors.salary}</div>}
                  <div className="text-xs text-gray-500 mt-1">
                    Enter whole number without commas or decimals
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block font-semibold mb-2 text-gray-700">
                    Job Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleChange}
                    className={`w-full p-3 border rounded-md ${formErrors.jobDescription ? 'border-red-500' : 'border-gray-300'}`}
                    rows="4"
                    placeholder="Describe the job responsibilities, skills required, and qualifications (minimum 50 characters)"
                    maxLength={1000}
                  />
                  <div className="flex justify-between mt-1">
                    {formErrors.jobDescription && <div className="text-red-500 text-sm">{formErrors.jobDescription}</div>}
                    <div className={`text-xs ${formData.jobDescription.length < 50 ? 'text-amber-500' : 'text-gray-500'} ml-auto`}>
                      {formData.jobDescription.length}/1000 (min 50)
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block font-semibold mb-2 text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
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
                    {isSubmitting ? 'Processing...' : isEditMode ? 'Update Opportunity' : 'Post Opportunity'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Application Form Modal */}
      {isApplicationModalOpen && currentJobToApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Apply for: {currentJobToApply.jobTitle}
              </h2>
              <button 
                onClick={closeApplicationModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-6 bg-gray-50 p-4 rounded-md">
                <div className="font-semibold text-gray-800">{currentJobToApply.companyName}</div>
                <div className="text-sm text-gray-600">{currentJobToApply.location}</div>
                {currentJobToApply.salary && (
                  <div className="text-sm text-gray-600">Salary: Rs. {currentJobToApply.salary.toLocaleString()}</div>
                )}
              </div>

              {/* Error summary */}
              {Object.keys(applicationFormErrors).length > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="font-semibold text-red-700 mb-2">Please fix the following errors:</p>
                  <ul className="list-disc list-inside text-sm text-red-700">
                    {Object.values(applicationFormErrors).map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <form onSubmit={handleApplicationSubmit}>
                <div className="mb-4">
                  <label className="block font-semibold mb-2 text-gray-700">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={applicationFormData.name}
                    onChange={handleApplicationChange}
                    className={`w-full p-3 border rounded-md ${applicationFormErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Your full name"
                    maxLength={100}
                  />
                  <div className="flex justify-between mt-1">
                    {applicationFormErrors.name && <div className="text-red-500 text-sm">{applicationFormErrors.name}</div>}
                    <div className="text-xs text-gray-500 ml-auto">
                      {applicationFormData.name.length}/100
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={applicationFormData.email}
                      onChange={handleApplicationChange}
                      className={`w-full p-3 border rounded-md ${applicationFormErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="your.email@example.com"
                    />
                    {applicationFormErrors.email && <div className="text-red-500 text-sm mt-1">{applicationFormErrors.email}</div>}
                  </div>
                  
                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={applicationFormData.phone}
                      onChange={handleApplicationChange}
                      className={`w-full p-3 border rounded-md ${applicationFormErrors.phone ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="07X-XXX-XXXX"
                    />
                    {applicationFormErrors.phone && <div className="text-red-500 text-sm mt-1">{applicationFormErrors.phone}</div>}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block font-semibold mb-2 text-gray-700">
                    Relevant Experience <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="experience"
                    value={applicationFormData.experience}
                    onChange={handleApplicationChange}
                    className={`w-full p-3 border rounded-md ${applicationFormErrors.experience ? 'border-red-500' : 'border-gray-300'}`}
                    rows="3"
                    placeholder="Briefly describe your relevant skills and experience (min 20 characters)"
                    maxLength={500}
                  />
                  <div className="flex justify-between mt-1">
                    {applicationFormErrors.experience && <div className="text-red-500 text-sm">{applicationFormErrors.experience}</div>}
                    <div className={`text-xs ${applicationFormData.experience.length < 20 ? 'text-amber-500' : 'text-gray-500'} ml-auto`}>
                      {applicationFormData.experience.length}/500 (min 20)
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block font-semibold mb-2 text-gray-700">
                    Cover Letter <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="coverLetter"
                    value={applicationFormData.coverLetter}
                    onChange={handleApplicationChange}
                    className={`w-full p-3 border rounded-md ${applicationFormErrors.coverLetter ? 'border-red-500' : 'border-gray-300'}`}
                    rows="5"
                    placeholder="Explain why you're interested in this position and how your skills match the requirements (min 50 characters)"
                    maxLength={1000}
                  />
                  <div className="flex justify-between mt-1">
                    {applicationFormErrors.coverLetter && <div className="text-red-500 text-sm">{applicationFormErrors.coverLetter}</div>}
                    <div className={`text-xs ${applicationFormData.coverLetter.length < 50 ? 'text-amber-500' : 'text-gray-500'} ml-auto`}>
                      {applicationFormData.coverLetter.length}/1000 (min 50)
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block font-semibold mb-2 text-gray-700">
                    Resume <span className="text-gray-500 font-normal">(optional)</span>
                  </label>
                  <div className="flex items-center">
                    <input
                      type="file"
                      name="resume"
                      onChange={handleFileChange}
                      className="hidden"
                      id="resume-upload"
                      accept=".pdf,.doc,.docx"
                    />
                    <label 
                      htmlFor="resume-upload"
                      className={`px-4 py-2 ${applicationFormErrors.resume ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-700'} rounded-md cursor-pointer hover:bg-gray-300 transition-colors`}
                    >
                      Select File
                    </label>
                    <span className="ml-3 text-sm text-gray-600">
                      {applicationFormData.resume ? applicationFormData.resume.name : "No file selected"}
                    </span>
                  </div>
                  {applicationFormErrors.resume ? (
                    <div className="text-red-500 text-sm mt-1">{applicationFormErrors.resume}</div>
                  ) : (
                    <div className="text-xs text-gray-500 mt-1">
                      Accepted formats: PDF, DOC, DOCX (Max size: 5MB)
                    </div>
                  )}
                </div>
                
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    onClick={closeApplicationModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-md font-semibold text-white ${isApplicationSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                    disabled={isApplicationSubmitting}
                  >
                    {isApplicationSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {/* Existing Modal Popup remains unchanged */}
    </div>
  );
};

export default JobPortal;