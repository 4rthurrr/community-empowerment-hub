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

const initialFormErrors = {
  image: "",
  title: "",
  description: "",
  category: "",
  subcategory: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

function AdminProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);

  const { productList } = useSelector((state) => state.adminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Calculate stats
  const totalProducts = productList?.length || 0;
  const outOfStock = productList?.filter(p => p.totalStock === 0)?.length || 0;
  const onSale = productList?.filter(p => p.salePrice > 0)?.length || 0;
  
  // Validate form function
  const validateForm = () => {
    const errors = {};
    let isValid = true;
    
    // Image validation (required for new products)
    if (!currentEditedId && !uploadedImageUrl) {
      errors.image = "Product image is required";
      isValid = false;
    }
    
    // Title validation
    if (!formData.title.trim()) {
      errors.title = "Product title is required";
      isValid = false;
    } else if (formData.title.trim().length < 3) {
      errors.title = "Title must be at least 3 characters";
      isValid = false;
    }
    
    // Description validation
    if (!formData.description.trim()) {
      errors.description = "Product description is required";
      isValid = false;
    } else if (formData.description.trim().length < 10) {
      errors.description = "Description must be at least 10 characters";
      isValid = false;
    }
    
    // Category validation
    if (!formData.category) {
      errors.category = "Product category is required";
      isValid = false;
    }
    
    // Subcategory validation
    if (!formData.subcategory && formData.category) {
      errors.subcategory = "Product subcategory is required";
      isValid = false;
    }
    
    // Price validation
    if (!formData.price) {
      errors.price = "Product price is required";
      isValid = false;
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      errors.price = "Price must be a positive number";
      isValid = false;
    }
    
    // Sale price validation (if provided)
    if (formData.salePrice) {
      if (isNaN(Number(formData.salePrice))) {
        errors.salePrice = "Sale price must be a number";
        isValid = false;
      } else if (Number(formData.salePrice) < 0) {
        errors.salePrice = "Sale price cannot be negative";
        isValid = false;
      } else if (Number(formData.salePrice) >= Number(formData.price)) {
        errors.salePrice = "Sale price must be less than regular price";
        isValid = false;
      }
    }
    
    // Stock validation
    if (!formData.totalStock) {
      errors.totalStock = "Product stock is required";
      isValid = false;
    } else if (isNaN(Number(formData.totalStock))) {
      errors.totalStock = "Stock must be a number";
      isValid = false;
    } else if (Number(formData.totalStock) < 0) {
      errors.totalStock = "Stock cannot be negative";
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  function onSubmit(event) {
    event.preventDefault();
    
    // Validate the form before submission
    if (!validateForm()) {
      toast({
        title: "Please fix the form errors",
        variant: "destructive",
      });
      return;
    }

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialFormData);
            setFormErrors(initialFormErrors);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
            toast({
              title: "Product updated successfully",
            });
          } else {
            toast({
              title: "Failed to update product",
              variant: "destructive",
            });
          }
        })
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialFormData);
            setFormErrors(initialFormErrors);
            toast({
              title: "Product added successfully",
            });
          } else {
            toast({
              title: "Failed to add product",
              variant: "destructive",
            });
          }
        });
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        toast({
          title: "Product deleted successfully",
        });
      } else {
        toast({
          title: "Failed to delete product",
          variant: "destructive",
        });
      }
    });
  }

  function isFormValid() {
    // Check if there are validation errors
    const hasErrors = Object.values(formErrors).some(error => error !== "");
    if (hasErrors) return false;
    
    // Additional check for required fields
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview" && currentKey !== "salePrice")
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
    
    // Clear subcategory error when category changes
    setFormErrors({
      ...formErrors,
      subcategory: "",
    });
  }
  
  // Function to reset form when dialog is closed
  function handleCloseDialog() {
    setOpenCreateProductsDialog(false);
    setCurrentEditedId(null);
    setFormData(initialFormData);
    setFormErrors(initialFormErrors);
    setImageFile(null);
  }
  
  // Function for handling form field changes
  function handleFormChange(name, value) {
    // For number fields, ensure no negative values
    if ((name === 'price' || name === 'salePrice' || name === 'totalStock') && value < 0) {
      value = 0;
    }
    
    // Update form data
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear specific field error when user edits the field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
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
  
  // When editing a product, pre-validate the form
  useEffect(() => {
    if (currentEditedId) {
      validateForm();
    }
  }, [currentEditedId, formData]);

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
          {productList && productList.length > 0
            ? productList.map((productItem) => (
                <AdminProductTile
                  key={productItem._id}
                  setFormData={setFormData}
                  setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                  setCurrentEditedId={setCurrentEditedId}
                  product={productItem}
                  handleDelete={handleDelete}
                />
              ))
            : <div className="col-span-full text-center py-12 text-gray-500">
                No products available. Add your first product to get started.
              </div>
          }
        </div>
      </div>

      {/* Add/Edit Product Sheet */}
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={handleCloseDialog}
      >
        <SheetContent side="right" className="overflow-auto w-full max-w-md sm:max-w-lg">
          <SheetHeader>
            <SheetTitle className="text-2xl">
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <div className="py-6">
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
              <p className="text-sm text-red-500 mt-1 mb-3">{formErrors.image}</p>
            )}
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={(data) => {
                // For tracking individual field changes
                const changedField = Object.keys(data).find(key => data[key] !== formData[key]);
                if (changedField) {
                  handleFormChange(changedField, data[changedField]);
                } else {
                  setFormData(data);
                }
              }}
              formErrors={formErrors}
              buttonText={currentEditedId !== null ? "Update Product" : "Create Product"}
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
              isBtnDisabled={!isFormValid() || imageLoadingState || (!currentEditedId && !uploadedImageUrl)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;

