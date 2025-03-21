import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { CloudUpload, Image, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

function ProductImageUpload({
  imageFile,
  setImageFile,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  imageLoadingState,
  isEditMode,
  isCustomStyling,
  formData
}) {
  const [showRemovePreview, setShowRemovePreview] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const { toast } = useToast();

  function handleImageChange(event) {
    setUploadError(null);
    const file = event.target.files[0];
    if (file) {
      // Validate file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError("Image size should be less than 5MB");
        toast({
          title: "Image size too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        setUploadError("Please select a valid image file (JPEG, PNG, GIF, WEBP)");
        toast({
          title: "Invalid file type",
          description: "Please select a valid image file (JPEG, PNG, GIF, WEBP)",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageFile(file);
      };
    }
  }

  function handleUpload() {
    if (!imageFile) {
      toast({
        title: "Please select an image",
        variant: "destructive",
      });
      return;
    }

    setUploadError(null);
    setImageLoadingState(true);

    const formData = new FormData();
    formData.append("my_file", imageFile);

    axios
      .post("http://localhost:5000/api/admin/products/upload-image", formData)
      .then((res) => {
        if (res?.data?.success) {
          setUploadedImageUrl(res?.data?.result?.url);
          toast({
            title: "Image uploaded successfully",
            variant: "default",
          });
        } else {
          setUploadError("Failed to upload image. Please try again.");
          toast({
            title: "Upload failed",
            description: res?.data?.message || "Failed to upload image. Please try again.",
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        console.error("Upload error:", error);
        setUploadError("Failed to upload image. Please try again.");
        toast({
          title: "Upload failed",
          description: error.response?.data?.message || "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      })
      .finally(() => {
        setImageLoadingState(false);
      });
  }

  function handleRemoveImage() {
    setImageFile(null);
    setUploadedImageUrl("");
    setUploadError(null);
  }

  useEffect(() => {
    if (isEditMode && formData?.image) setUploadedImageUrl(formData?.image);
  }, [isEditMode, formData]);

  return (
    <div className="flex flex-col items-center">
      {uploadedImageUrl ? (
        <div className="relative w-full max-w-xs mx-auto">
          <div 
            className="relative rounded-lg overflow-hidden border shadow-sm group"
            onMouseEnter={() => setShowRemovePreview(true)}
            onMouseLeave={() => setShowRemovePreview(false)}
          >
            <img
              src={uploadedImageUrl}
              alt="Product image"
              className="w-full h-[200px] object-cover"
            />
            {showRemovePreview && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity duration-200">
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="rounded-full" 
                  onClick={handleRemoveImage}
                >
                  <X className="w-4 h-4 mr-1" />
                  Remove
                </Button>
              </div>
            )}
          </div>
          <p className="text-sm text-center text-green-600 mt-2">
            Image uploaded successfully
          </p>
        </div>
      ) : (
        <div className="w-full">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
            <Image className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-2">
              Drag and drop your image here or click to browse
            </p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              id="product-image"
            />
            <label
              htmlFor="product-image"
              className="cursor-pointer px-4 py-2 text-sm font-medium rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
            >
              Select Image
            </label>
          </div>
          
          {imageFile && (
            <div className="mt-4">
              <div className="flex items-center justify-between border rounded-md p-2 bg-blue-50">
                <div className="flex items-center">
                  <Image className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-sm font-medium truncate max-w-[180px]">
                    {imageFile.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveImage}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={handleUpload}
                disabled={imageLoadingState}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
              >
                <CloudUpload className="w-4 h-4 mr-2" />
                {imageLoadingState ? "Uploading..." : "Upload Image"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductImageUpload;
