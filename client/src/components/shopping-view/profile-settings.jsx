import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch, useSelector } from "react-redux";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Trash2 } from "lucide-react";
import { Loader2 } from "lucide-react";
import { 
  AlertCircle, 
  Camera, 
  Check, 
  Edit, 
  Lock, 
  UserCircle, 
  X, 
  Eye, 
  EyeOff 
} from "lucide-react";
import { 
  getUserProfile, 
  updateUserProfile, 
  updatePassword,
  deactivateAccount,
  uploadProfileImage
} from "@/services/userService";

function ProfileSettings() {
  const { user: authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  // State for general profile info
  const [profileData, setProfileData] = useState({
    userName: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    profileImage: "",
    interestedCategories: [],
  });
  
  // State for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  //state for password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State for notification preferences
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    promotions: false,
    newsletter: false,
  });
  
  // Form validation errors
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  
  // Loading states
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [isNotificationSubmitting, setIsNotificationSubmitting] = useState(false);
  
  // Editing states
  const [isEditing, setIsEditing] = useState(false);
  
  // Image upload preview
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  
  // New loading state for initial data loading
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  
  // Load user profile data
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        setApiError(null);
        
        // Fetch user profile
        const userData = await getUserProfile();
        
        // Update form state with user data
        setProfileData({
          userName: userData.userName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          bio: userData.bio || "",
          location: userData.location || "",
          profileImage: userData.profileImage || "",
          interestedCategories: userData.interestedCategories || [],
        });
        
        // Update notification settings
        setNotificationSettings({
          emailNotifications: userData.emailNotifications !== undefined ? userData.emailNotifications : true,
          orderUpdates: userData.orderUpdates !== undefined ? userData.orderUpdates : true,
          promotions: userData.promotions !== undefined ? userData.promotions : false,
          newsletter: userData.newsletter !== undefined ? userData.newsletter : false,
        });
        
      } catch (error) {
        console.error("Error loading user profile:", error);
        setApiError("Failed to load your profile data. Please try again later.");
        
        // Use auth data as fallback if available
        if (authUser) {
          setProfileData({
            userName: authUser.userName || "",
            email: authUser.email || "",
            phone: "",
            bio: "",
            location: "",
            profileImage: "",
            interestedCategories: [],
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    // Load user profile when component mounts
    loadUserProfile();
  }, [authUser]);
  
  // Handle input changes for profile form
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
    
    // Clear error when user types
    if (profileErrors[name]) {
      setProfileErrors({
        ...profileErrors,
        [name]: null,
      });
    }
  };
  
  // Handle input changes for password form
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
    
    // Clear error when user types
    if (passwordErrors[name]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: null,
      });
    }
  };
  
  // Handle changes for notification toggles
  const handleNotificationChange = (name, checked) => {
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked,
    });
  };
  
  // Handle category selection
  const handleCategoryChange = (value) => {
    let updatedCategories = [...profileData.interestedCategories];
    
    if (updatedCategories.includes(value)) {
      updatedCategories = updatedCategories.filter(cat => cat !== value);
    } else {
      updatedCategories.push(value);
    }
    
    setProfileData({
      ...profileData,
      interestedCategories: updatedCategories,
    });
  };
  
  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, this would upload to a server/CDN
      // For now, we'll create a data URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setUploadedImage(file);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Remove uploaded image
  const handleRemoveImage = () => {
    setImagePreview(null);
    setUploadedImage(null);
  };
  
  // Validate profile form
  const validateProfileForm = () => {
    const errors = {};
    
    // UserName validation
    if (!profileData.userName?.trim()) {
      errors.userName = "Name is required";
    } else if (profileData.userName.trim().length < 3) {
      errors.userName = "Name must be at least 3 characters";
    }
    
    // Email validation
    if (!profileData.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(profileData.email.trim())) {
      errors.email = "Please enter a valid email address";
    }
    
    // Phone validation (optional field but validate if provided)
    if (profileData.phone && !/^0[0-9]{9}$|^\+94[0-9]{9}$/.test(profileData.phone.trim().replace(/\s/g, ''))) {
      errors.phone = "Please enter a valid Sri Lankan phone number";
    }
    
    // Bio validation (optional but with max length)
    if (profileData.bio && profileData.bio.length > 300) {
      errors.bio = "Bio must be less than 300 characters";
    }
    
    return errors;
  };
  
  // Validate password form
  const validatePasswordForm = () => {
    const errors = {};
    
    // Current password validation
    if (!passwordData.currentPassword) {
      errors.currentPassword = "Current password is required";
    }
    
    // New password validation
    if (!passwordData.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordData.newPassword)) {
      errors.newPassword = "Password must include uppercase, lowercase, and numbers";
    }
    
    // Confirm password validation
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    
    return errors;
  };
  
  // Handle profile form submission
  const handleProfileSubmit = async () => {
    // Validate form
    const validationErrors = validateProfileForm();
    setProfileErrors(validationErrors);
    
    // If there are errors, don't proceed
    if (Object.keys(validationErrors).length > 0) {
      toast({
        title: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }
    
    setIsProfileSubmitting(true);
    
    try {
      // First, handle image upload if there's a new image
      let profileImageUrl = profileData.profileImage;
      
      if (uploadedImage) {
        const formData = new FormData();
        formData.append('profileImage', uploadedImage);
        
        const imageResult = await uploadProfileImage(formData);
        profileImageUrl = imageResult.imageUrl;
      }
      
      // Update profile with all data including the new image URL
      const updatedProfileData = {
        ...profileData,
        profileImage: profileImageUrl
      };
      
      const result = await updateUserProfile(updatedProfileData);
      
      toast({
        title: "Profile updated successfully",
        description: "Your profile information has been saved.",
      });
      
      // Update local state with the returned user data
      setProfileData({
        userName: result.user.userName || "",
        email: result.user.email || "",
        phone: result.user.phone || "",
        bio: result.user.bio || "",
        location: result.user.location || "",
        profileImage: result.user.profileImage || "",
        interestedCategories: result.user.interestedCategories || [],
      });
      
      setIsEditing(false);
      setImagePreview(null);
      setUploadedImage(null);
      
    } catch (error) {
      console.error("Error updating profile:", error);
      
      // Handle different error scenarios
      if (error.response && error.response.status === 400) {
        // Validation errors from server
        const serverErrors = error.response.data.errors;
        const formattedErrors = {};
        
        serverErrors.forEach(err => {
          formattedErrors[err.param] = err.msg;
        });
        
        setProfileErrors({...validationErrors, ...formattedErrors});
        
        toast({
          title: "Validation error",
          description: "Please check the form for errors.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error updating profile",
          description: error.response?.data?.message || "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsProfileSubmitting(false);
    }
  };
  
  // Enhanced password update
  const handlePasswordSubmit = async () => {
    // Validate form
    const validationErrors = validatePasswordForm();
    setPasswordErrors(validationErrors);
    
    // If there are errors, don't proceed
    if (Object.keys(validationErrors).length > 0) {
      toast({
        title: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }
    
    setIsPasswordSubmitting(true);
    
    try {
      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      toast({
        title: "Password updated successfully",
        description: "Your password has been changed.",
      });
      
      // Clear password form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
    } catch (error) {
      console.error("Error updating password:", error);
      
      // Handle invalid current password
      if (error.response && error.response.status === 400) {
        if (error.response.data.message === "Current password is incorrect") {
          setPasswordErrors({
            ...passwordErrors,
            currentPassword: "Current password is incorrect"
          });
        } else {
          toast({
            title: "Error updating password",
            description: error.response.data.message || "Please try again.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error updating password",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsPasswordSubmitting(false);
    }
  };
  
  // Handle notification settings submission
  const handleNotificationSubmit = async () => {
    setIsNotificationSubmitting(true);
    
    try {
      await updateUserProfile({
        emailNotifications: notificationSettings.emailNotifications,
        orderUpdates: notificationSettings.orderUpdates,
        promotions: notificationSettings.promotions,
        newsletter: notificationSettings.newsletter
      });
      
      toast({
        title: "Notification preferences updated",
      });
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      toast({
        title: "Error updating preferences",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsNotificationSubmitting(false);
    }
  };
  
  // Handle account deactivation
  const handleDeactivateAccount = async () => {
    // Confirm with user before proceeding
    if (window.confirm("Are you sure you want to deactivate your account? This action cannot be undone.")) {
      try {
        await deactivateAccount();
        
        toast({
          title: "Account deactivated",
          description: "Your account has been deactivated. You will be logged out shortly.",
        });
        
        // Log user out after deactivation
        setTimeout(() => {
          // Assuming logout function is available in Redux
          // dispatch(logout());
          
          // Alternatively, clear local storage and redirect to login
          localStorage.removeItem('token');
          window.location.href = '/login';
        }, 2000);
        
      } catch (error) {
        console.error("Error deactivating account:", error);
        toast({
          title: "Error deactivating account",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (apiError) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Profile</h3>
        <p className="text-red-700">{apiError}</p>
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
        {!isEditing ? (
          <Button 
            onClick={() => setIsEditing(true)} 
            variant="outline" 
            className="flex items-center gap-1"
          >
            <Edit size={16} /> Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button 
              onClick={() => setIsEditing(false)} 
              variant="outline" 
              className="flex items-center gap-1"
            >
              <X size={16} /> Cancel
            </Button>
            <Button 
              onClick={handleProfileSubmit} 
              disabled={isProfileSubmitting}
              className="flex items-center gap-1"
            >
              {isProfileSubmitting ? (
                "Saving..."
              ) : (
                <>
                  <Check size={16} /> Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General Information</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardContent className="p-6">
              {/* Profile header with avatar */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-2 border-primary/20">
                    {imagePreview ? (
                      <AvatarImage src={imagePreview} alt="Profile" />
                    ) : (
                      <>
                        <AvatarImage src={profileData.profileImage} alt="Profile" />
                        <AvatarFallback className="text-lg bg-primary/10 text-primary">
                          {profileData.userName ? profileData.userName[0].toUpperCase() : <UserCircle />}
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  
                  {isEditing && (
                    <div className="absolute -bottom-2 -right-2 flex gap-1">
                      <div className="relative">
                        <input
                          type="file"
                          id="profile-image"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        <label
                          htmlFor="profile-image"
                          className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white cursor-pointer"
                        >
                          <Camera size={14} />
                        </label>
                      </div>
                      
                      {imagePreview && (
                        <button
                          onClick={handleRemoveImage}
                          className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center text-white"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="text-center sm:text-left">
                  <h3 className="text-2xl font-bold">{profileData.userName || "Profile"}</h3>
                  <p className="text-gray-500">{profileData.email || "No email provided"}</p>
                  {!isEditing && profileData.bio && (
                    <p className="mt-2 text-sm text-gray-600 max-w-md">{profileData.bio}</p>
                  )}
                </div>
              </div>
              
              {/* Profile form */}
              <div className="space-y-4">
                {/* Error summary */}
                {Object.keys(profileErrors).length > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
                    <div className="flex gap-2">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-semibold text-red-800">Please fix the following errors:</p>
                        <ul className="mt-1 list-disc list-inside text-sm text-red-700">
                          {Object.values(profileErrors).map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="userName">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="userName"
                      name="userName"
                      value={profileData.userName}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className={profileErrors.userName ? "border-red-500" : ""}
                    />
                    {profileErrors.userName && (
                      <p className="text-sm text-red-500">{profileErrors.userName}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className={profileErrors.email ? "border-red-500" : ""}
                    />
                    {profileErrors.email && (
                      <p className="text-sm text-red-500">{profileErrors.email}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone Number <span className="text-gray-500 font-normal">(optional)</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className={profileErrors.phone ? "border-red-500" : ""}
                      placeholder="07XXXXXXXX"
                    />
                    {profileErrors.phone && (
                      <p className="text-sm text-red-500">{profileErrors.phone}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">
                      Location <span className="text-gray-500 font-normal">(optional)</span>
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={profileData.location}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      placeholder="e.g. Colombo, Sri Lanka"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">
                    Bio <span className="text-gray-500 font-normal">(optional)</span>
                  </Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={profileData.bio}
                    onChange={handleProfileChange}
                    disabled={!isEditing}
                    className={profileErrors.bio ? "border-red-500" : ""}
                    placeholder="Tell us a bit about yourself..."
                    rows={3}
                  />
                  {isEditing && (
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Share a brief description of yourself</span>
                      <span className={profileData.bio?.length > 250 ? "text-amber-500" : ""}>
                        {profileData.bio?.length || 0}/300
                      </span>
                    </div>
                  )}
                  {profileErrors.bio && (
                    <p className="text-sm text-red-500">{profileErrors.bio}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Interested Categories</Label>
                  {isEditing ? (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {["Crafts", "Textiles", "Art", "Culinary", "Pottery", "Jewelry", "Home Decor", "Educational"].map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => handleCategoryChange(category)}
                          className={`px-3 py-1.5 text-sm rounded-full ${
                            profileData.interestedCategories.includes(category)
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profileData.interestedCategories.length > 0 ? (
                        profileData.interestedCategories.map((category) => (
                          <span key={category} className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">
                            {category}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">No categories selected</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Lock className="mr-2 h-5 w-5" /> Change Password
              </h3>
              
              {/* Error summary */}
              {Object.keys(passwordErrors).length > 0 && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-semibold text-red-800">Please fix the following errors:</p>
                      <ul className="mt-1 list-disc list-inside text-sm text-red-700">
                        {Object.values(passwordErrors).map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
  {/* Current Password Field with Eye Icon */}
  <div className="space-y-2">
    <Label htmlFor="currentPassword">
      Current Password <span className="text-red-500">*</span>
    </Label>
    <div className="relative">
      <Input
        id="currentPassword"
        name="currentPassword"
        type={showCurrentPassword ? "text" : "password"}
        value={passwordData.currentPassword}
        onChange={handlePasswordChange}
        className={passwordErrors.currentPassword ? "border-red-500" : ""}
      />
      <button
        type="button"
        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
        className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
      >
        {showCurrentPassword ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    </div>
    {passwordErrors.currentPassword && (
      <p className="text-sm text-red-500">{passwordErrors.currentPassword}</p>
    )}
  </div>
                
                {/* <div className="space-y-2">
                  <Label htmlFor="newPassword">
                    New Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={passwordErrors.newPassword ? "border-red-500" : ""}
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-red-500">{passwordErrors.newPassword}</p>
                  )}
                  {!passwordErrors.newPassword && (
                    <p className="text-xs text-gray-500">
                      Password must be at least 8 characters and include uppercase, lowercase letters, and numbers
                    </p>
                  )}
                </div> */}
                
                <div className="space-y-2">
                <Label htmlFor="newPassword">
                  New Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={passwordErrors.newPassword ? "border-red-500" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-sm text-red-500">{passwordErrors.newPassword}</p>
                )}
                {!passwordErrors.newPassword && (
                  <p className="text-xs text-gray-500">
                    Password must be at least 8 characters and include uppercase, lowercase letters, and numbers
                  </p>
                )}
              </div>
              
                {/* Confirm Password Field with Eye Icon */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm New Password <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={passwordErrors.confirmPassword ? "border-red-500" : ""}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-sm text-red-500">{passwordErrors.confirmPassword}</p>
                )}
              </div>

              </div>

              <div className="pt-4">
                <Button 
                  onClick={handlePasswordSubmit}
                  disabled={isPasswordSubmitting}
                  className="w-full bg-primary hover:bg-primary-dark text-white"
                >
                  {isPasswordSubmitting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating Password...
                    </div>
                  ) : (
                    "Change Password"
                  )}
                </Button>
              </div>

              
              <Separator className="my-6" />
              
              <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
  

  <Button 
    variant="destructive" 
    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white hover:text-white"
    onClick={handleDeactivateAccount}
  >
    <Trash2 className="mr-2 h-4 w-4" />
    Deactivate Account
  </Button>
</div>
              {/* <div className="space-y-4">
                <button className="text-sm text-blue-600 hover:underline">
                  Download Personal Data
                </button>
                <button className="text-sm text-red-600 hover:underline">
                  Deactivate Account
                </button>
              </div> */}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-gray-500">Receive email notifications for important updates</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => handleNotificationChange('emailNotifications', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Order Updates</h4>
                    <p className="text-sm text-gray-500">Get notified about your order status changes</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.orderUpdates}
                    onCheckedChange={(checked) => handleNotificationChange('orderUpdates', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Promotions and Discounts</h4>
                    <p className="text-sm text-gray-500">Receive information about sales and special offers</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.promotions}
                    onCheckedChange={(checked) => handleNotificationChange('promotions', checked)}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Community Newsletter</h4>
                    <p className="text-sm text-gray-500">Stay updated with community events and success stories</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.newsletter}
                    onCheckedChange={(checked) => handleNotificationChange('newsletter', checked)}
                  />
                </div>
                
                <div className="pt-4">
                  <Button
                    onClick={handleNotificationSubmit}
                    disabled={isNotificationSubmitting}
                  >
                    {isNotificationSubmitting ? "Saving..." : "Save Preferences"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default ProfileSettings;