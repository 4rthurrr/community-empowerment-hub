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
import { AlertCircle, Camera, Check, Edit, Lock, UserCircle, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Trash2 } from "lucide-react";

function ProfileSettings() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  // State for general profile info
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    location: user?.location || "",
    profileImage: user?.profileImage || "",
    interestedCategories: user?.interestedCategories || [],
  });
  
  // State for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  // State for notification preferences
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: user?.emailNotifications || true,
    orderUpdates: user?.orderUpdates || true,
    promotions: user?.promotions || false,
    newsletter: user?.newsletter || false,
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
    
    // Name validation
    if (!profileData.name.trim()) {
      errors.name = "Name is required";
    } else if (profileData.name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters";
    }
    
    // Email validation
    if (!profileData.email.trim()) {
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
  const handleProfileSubmit = () => {
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
    
    // In a real app, you would dispatch an action to update the profile
    // For demo purposes, we'll simulate a successful update
    setTimeout(() => {
      toast({
        title: "Profile updated successfully",
        description: "Your profile information has been saved.",
      });
      setIsProfileSubmitting(false);
      setIsEditing(false);
      
      // In a real app, this would come from the API response
      // dispatch(updateUserProfile(profileData));
    }, 1000);
  };
  
  // Handle password form submission
  const handlePasswordSubmit = () => {
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
    
    // In a real app, you would dispatch an action to update the password
    // For demo purposes, we'll simulate a successful update
    setTimeout(() => {
      toast({
        title: "Password updated successfully",
        description: "Your password has been changed.",
      });
      setIsPasswordSubmitting(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      // In a real app, this would be an API call
      // dispatch(updateUserPassword(passwordData));
    }, 1000);
  };
  
  // Handle notification settings submission
  const handleNotificationSubmit = () => {
    setIsNotificationSubmitting(true);
    
    // In a real app, you would dispatch an action to update notification settings
    // For demo purposes, we'll simulate a successful update
    setTimeout(() => {
      toast({
        title: "Notification preferences updated",
      });
      setIsNotificationSubmitting(false);
      
      // In a real app, this would be an API call
      // dispatch(updateNotificationSettings(notificationSettings));
    }, 1000);
  };
  
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
                          {profileData.name ? profileData.name[0].toUpperCase() : <UserCircle />}
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
                  <h3 className="text-2xl font-bold">{profileData.name || "Profile"}</h3>
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
                    <Label htmlFor="name">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className={profileErrors.name ? "border-red-500" : ""}
                    />
                    {profileErrors.name && (
                      <p className="text-sm text-red-500">{profileErrors.name}</p>
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
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">
                    Current Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={passwordErrors.currentPassword ? "border-red-500" : ""}
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-sm text-red-500">{passwordErrors.currentPassword}</p>
                  )}
                </div>
                
                <div className="space-y-2">
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
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">
                    Confirm New Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={passwordErrors.confirmPassword ? "border-red-500" : ""}
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-sm text-red-500">{passwordErrors.confirmPassword}</p>
                  )}
                </div>
                
                <div className="pt-2">
                  <Button
                    onClick={handlePasswordSubmit}
                    disabled={isPasswordSubmitting}
                  >
                    {isPasswordSubmitting ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </div>
              
              <Separator className="my-6" />
              
              <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
  <Button 
    variant="default" 
    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white hover:text-white"
  >
    <Download className="mr-2 h-4 w-4" />
    Download Personal Data
  </Button>

  <Button 
    variant="destructive" 
    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white hover:text-white"
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