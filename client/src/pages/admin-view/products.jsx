import ProductImageUpload from "@/components/admin-view/image-upload";
import AdminProductTile from "@/components/admin-view/product-tile";
import CommonForm from "@/components/common/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements, subcategoryOptionsMap } from "@/config";
import {
  addNewProduct,
  deleteProduct,
  editProduct,
  fetchAllProducts,
  clearProductErrors,
} from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Plus, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  subcategory: "",
  price: "",
  salePrice: "",
  totalStock: "",
  averageReview: 0,
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const { productList, isLoading, error } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Calculate stats
  const totalProducts = productList?.length || 0;
  const outOfStock = productList?.filter(p => p.totalStock === 0)?.length || 0;
  const onSale = productList?.filter(p => p.salePrice > 0)?.length || 0;

  // Validate the form data
  const validateForm = () => {
    const errors = {};
    const requiredFields = ['title', 'description', 'category', 'subcategory', 'price', 'totalStock'];
    
    requiredFields.forEach(field => {
      // Check if field is empty or undefined
      if (!formData[field] || 
          (typeof formData[field] === 'string' && formData[field].trim() === '') ||
          (typeof formData[field] === 'number' && formData[field] <= 0)) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
      }
    });
    
    if (!uploadedImageUrl && !currentEditedId) {
      errors.image = "Image is required";
    }
    
    // Validate numeric fields
    if (formData.price && isNaN(Number(formData.price))) {
      errors.price = "Price must be a valid number";
    }
    
    if (formData.salePrice && isNaN(Number(formData.salePrice))) {
      errors.salePrice = "Sale price must be a valid number";
    }
    
    if (formData.totalStock && isNaN(Number(formData.totalStock))) {
      errors.totalStock = "Total stock must be a valid number";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  function onSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Please fix the form errors",
        variant: "destructive",
      });
      return;
    }

    // Format the numeric fields properly
    const processedFormData = {
      ...formData,
      price: Number(formData.price),
      salePrice: formData.salePrice ? Number(formData.salePrice) : 0,
      totalStock: Number(formData.totalStock)
    };

    if (currentEditedId !== null) {
      dispatch(
        editProduct({
          id: currentEditedId,
          formData: processedFormData,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setFormData(initialFormData);
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormErrors({});
          toast({
            title: "Product updated successfully",
          });
        } else if (data.error) {
          toast({
            title: "Failed to update product",
            description: data.payload,
            variant: "destructive",
          });
        }
      });
    } else {
      if (!uploadedImageUrl) {
        toast({
          title: "Image is required",
          variant: "destructive",
        });
        return;
      }
      
      dispatch(
        addNewProduct({
          ...processedFormData,
          image: uploadedImageUrl,
        })
      ).then((data) => {
        if (data?.payload?.success) {
          dispatch(fetchAllProducts());
          setOpenCreateProductsDialog(false);
          setImageFile(null);
          setFormData(initialFormData);
          setFormErrors({});
          toast({
            title: "Product added successfully",
          });
        } else if (data.error) {
          toast({
            title: "Failed to add product",
            description: data.payload,
            variant: "destructive",
          });
        }
      });
    }
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({
          title: "Product deleted successfully",
        });
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview")
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  function handleCategoryChange(event) {
    const selectedCategory = event.target.value;
    const subcategoryOptions = subcategoryOptionsMap[selectedCategory] || [];
    setFormData({
      ...formData,
      category: selectedCategory,
      subcategory: "",
    });
    setSubcategoryOptions(subcategoryOptions);
  }

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  useEffect(() => {
    if (formData.category) {
      const subcategoryOptions = subcategoryOptionsMap[formData.category] || [];
      setSubcategoryOptions(subcategoryOptions);
    }
  }, [formData.category]);

  // Show error toast when error state changes
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
      dispatch(clearProductErrors());
    }
  }, [error, toast, dispatch]);

  return (
    <Fragment>
      {/* Page Header with Stats */}
      <div className="flex flex-col gap-5 mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
          <Button onClick={() => setOpenCreateProductsDialog(true)} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus size={18} />
            <span>Add New Product</span>
          </Button>
        </div>
        
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
              <ShoppingBag className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProducts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">On Sale</CardTitle>
              <Box className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{onSale}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Out of Stock</CardTitle>
              <Box className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{outOfStock}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Grid */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Product Inventory</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {productList && productList.length > 0 ? (
            productList.map((productItem) => (
              <AdminProductTile
                key={productItem._id}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No products available. Add your first product to get started.
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Product Sheet */}
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setFormErrors({});
        }}
      >
        <SheetContent side="right" className="overflow-auto w-full max-w-md sm:max-w-lg md:max-w-xl">
          <SheetHeader className="pb-4 border-b">
            <SheetTitle className="text-2xl font-bold text-primary">
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
            <p className="text-sm text-muted-foreground">
              {currentEditedId !== null 
                ? "Update your product information below" 
                : "Complete the form below to add a new product to your inventory"}
            </p>
          </SheetHeader>
          <div className="py-6 space-y-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-base mb-3">Product Image</h3>
              <ProductImageUpload
                imageFile={imageFile}
                setImageFile={setImageFile}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                setImageLoadingState={setImageLoadingState}
                imageLoadingState={imageLoadingState}
                isEditMode={currentEditedId !== null}
              />
              {formErrors.image && (
                <p className="text-sm text-red-600 mt-2">
                  {formErrors.image}
                </p>
              )}
              {!uploadedImageUrl && !imageFile && !formErrors.image && (
                <p className="text-sm text-amber-600 mt-2">
                  Image is required for product listing
                </p>
              )}
            </div>

            <div></div>
              <h3 className="font-medium text-base mb-4">Product Information</h3>
              <CommonForm
                onSubmit={onSubmit}
                formData={formData}
                setFormData={setFormData}
                formErrors={formErrors}
                buttonText={currentEditedId !== null ? "Update Product" : "Create Product"}
                buttonClassName="w-full bg-primary hover:bg-primary/90 text-white"
                formClassName="space-y-4"
                isLoading={isLoading}
                formControls={addProductFormElements.map((element) => {
                  if (element.name === "subcategory") {
                    return {
                      ...element,
                      options: subcategoryOptions,
                    };
                  }
                  if (element.name === "category") {
                    return {
                      ...element,
                      onChange: handleCategoryChange,
                    };
                  }
                  return element;
                })}
              />
            </div>
          </SheetContent>
        </Sheet>
      </Fragment>
  );
}

export default AdminProducts;
