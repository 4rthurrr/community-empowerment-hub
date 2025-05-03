import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Star, 
  Edit, 
  Trash2, 
  Plus, 
  Award, 
  TrendingUp, 
  Heart,
  ImagePlus,
  ChevronRight,
  MessageCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Printer } from "lucide-react";

const SellerPortfolio = () => {
  const { toast } = useToast();
  const [portfolioData, setPortfolioData] = useState({
    topRated: [],
    bestSelling: [],
    specialCollection: []
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState();
  const [activeTab, setActiveTab] = useState("topRated");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Add a refresh trigger state to control when to refresh data
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch portfolio data from API
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setIsLoading(true);
        // Use the correct API URL with environment variable and authentication
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/shop/portfolio`,
          {
            headers: { 
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        
        // Log the response to see the structure
        console.log('Portfolio API response:', response.data);
        
        // The API already returns data categorized, so use it directly
        if (response.data && typeof response.data === 'object') {
          // Make sure we have all the expected categories, even if they're empty
          const categorizedData = {
            topRated: response.data.topRated || [],
            bestSelling: response.data.bestSelling || [],
            specialCollection: response.data.specialCollection || []
          };
          
          setPortfolioData(categorizedData);
        } else {
          // Fallback to empty categories if the structure isn't as expected
          setPortfolioData({
            topRated: [],
            bestSelling: [],
            specialCollection: []
          });
        }
      } catch (err) {
        console.error('Error fetching portfolio:', err);
        setError(err.response?.data?.message || "Failed to fetch portfolio");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load portfolio data"
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPortfolio();
  }, [refreshTrigger]); // Add refreshTrigger to the dependency array so the effect runs when it changes

  // Handle adding a new product
  const handleAddProduct = () => {
    setCurrentProduct({
      name: "",
      description: "",
      price: 0,
      image: "",
      rating: 0,
      reviews: 0,
      sold: 0,
      category: activeTab,
      featured: false,
      craftType: "",
      materials: []
    });
    setIsDialogOpen(true);
  };

  // Handle editing an existing product
  const handleEditProduct = (product) => {
    setCurrentProduct({...product});
    setIsDialogOpen(true);
  };

  // Form validation
  const validateProductForm = () => {
    const errors = {};
    if (!currentProduct?.name?.trim()) errors.name = "Product name is required";
    if (!currentProduct?.description?.trim()) errors.description = "Description is required";
    if (!currentProduct?.price || currentProduct.price <= 0) errors.price = "Valid price is required";
    //if (!currentProduct?.image?.trim()) errors.image = "Image URL is required";
    if (currentProduct?.rating < 0 || currentProduct?.rating > 5) errors.rating = "Rating must be 0-5";
    if (!currentProduct?.category) errors.category = "Category is required";
    if (!currentProduct?.craftType?.trim()) errors.craftType = "Craft type is required";
    if (!currentProduct?.materials?.length) errors.materials = "At least one material is required";
    return errors;
  };

  // Save product to backend
  const handleSaveProduct = async () => {
    const validationErrors = validateProductForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const authToken = localStorage.getItem("token");
      
      // Create a portfolio item object that matches the exact field names expected by your backend
      const portfolioItem = {
        name: currentProduct.name,
        description: currentProduct.description,
        price: Number(currentProduct.price),
        image: currentProduct.image,
        rating: Number(currentProduct.rating),
        reviews: Number(currentProduct.reviews),
        sold: Number(currentProduct.sold),
        category: currentProduct.category,
        craftType: currentProduct.craftType,
        materials: currentProduct.materials,
        featured: Boolean(currentProduct.featured),
      };
      
      // Log the data being sent to help with debugging
      console.log('Sending portfolio data:', portfolioItem);
      
      let response;
      if (currentProduct._id) {
        // Update existing portfolio item
        response = await axios.put(
          `${import.meta.env.VITE_API_URL}/shop/portfolio/${currentProduct._id}`,
          portfolioItem,
          { 
            headers: { 
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            } 
          }
        );
      } else {
        // Create new portfolio item
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/shop/portfolio`,
          portfolioItem,
          { 
            headers: { 
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json'
            } 
          }
        );
      }
      
      // Log successful response
      console.log('Response from server:', response.data);
      
      // Determine category for UI purposes
      let category = 'specialCollection';
      if (portfolioItem.rating >= 4.5) {
        category = 'topRated';
      } else if (portfolioItem.sold >= 10) {
        category = 'bestSelling';
      }
      
      // After successful save, trigger a refresh instead of manually updating the UI
      setRefreshTrigger(prev => prev + 1); // Increment to trigger the useEffect

      toast({
        title: "Success",
        description: `Portfolio item ${currentProduct._id ? "updated" : "created"} successfully`
      });
      setIsDialogOpen(false);
    } catch (err) {
      console.error('Error saving portfolio:', err);
      // More detailed error logging
      if (err.response) {
        console.error('Error response data:', err.response.data);
        console.error('Error response status:', err.response.status);
        
        // If there are validation errors in the response, display them
        if (err.response.data && err.response.data.errors) {
          const validationErrors = err.response.data.errors;
          const errorMessage = validationErrors.map(e => e.msg || e.message).join(', ');
          toast({
            variant: "destructive",
            title: "Validation Error",
            description: errorMessage || "Please check your form inputs"
          });
          return;
        }
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to save portfolio item"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const authToken = localStorage.getItem("token");
      // Use the correct endpoint for deletion
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/shop/portfolio/${productId}`,
        { headers: { 
          Authorization: `Bearer ${authToken}` 
        } 
      });
      // After successful delete, trigger a refresh instead of manually updating the UI
      setRefreshTrigger(prev => prev + 1); // Increment to trigger the useEffect

      toast({
        title: "Success",
        description: "Portfolio item deleted successfully"
      });
    } catch (err) {
      console.error('Error deleting portfolio:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Delete failed"
      });
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[300px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[400px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const generateReport = () => {
    const printWindow = window.open('', '_blank');
    const reportDate = new Date().toLocaleDateString();
    
    const reportContent = `
      <html>
        <head>
          <title>Product Portfolio Report - ${reportDate}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 2rem; }
            h1 { color: #1a365d; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; }
            table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
            th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e2e8f0; }
            th { background-color: #f7fafc; }
            .category-header { background-color: #2d3748; color: white; padding: 0.5rem; margin-top: 2rem; }
            .totals { margin-top: 2rem; padding: 1rem; background-color: #f7fafc; }
            @media print { 
              .no-print { display: none; } 
              body { margin: 1cm; }
            }
          </style>
        </head>
        <body>
          <h1>Product Portfolio Report - ${reportDate}</h1>
          
          ${Object.entries(portfolioData).map(([category, products]) => `
            <div class="category-section">
              <div class="category-header">${category.replace(/([A-Z])/g, ' $1').toUpperCase()}</div>
              ${products.length > 0 ? `
                <table>
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Price</th>
                      <th>Units Sold</th>
                      <th>Rating</th>
                      <th>Reviews</th>
                      <th>Craft Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${products.map(product => `
                      <tr>
                        <td>${product.name}</td>
                        <td>${formatPrice(product.price)}</td>
                        <td>${product.sold}</td>
                        <td>${product.rating}/5</td>
                        <td>${product.reviews}</td>
                        <td>${product.craftType}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              ` : '<p>No products in this category</p>'}
            </div>
          `).join('')}
  
          <div class="totals">
            <h3>Portfolio Summary</h3>
            <p>Total Products: ${Object.values(portfolioData).reduce((acc, curr) => acc + curr.length, 0)}</p>
            <p>Total Potential Revenue: ${formatPrice(
              Object.values(portfolioData).flat().reduce((acc, product) => acc + (product.price * product.sold), 0)
            )}</p>
            <p>Average Rating: ${(
              Object.values(portfolioData).flat().reduce((acc, product) => acc + product.rating, 0) /
              Object.values(portfolioData).flat().filter(p => p.rating > 0).length || 0
            ).toFixed(1)}/5</p>
          </div>
  
          <div class="no-print" style="margin-top: 2rem; text-align: center;">
            <button onclick="window.print()" style="padding: 0.5rem 1rem; background: #4299e1; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Print Report
            </button>
          </div>
        </body>
      </html>
    `;
  
    printWindow.document.write(reportContent);
    printWindow.document.close();
  };
  

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
  <div>
    <h2 className="text-2xl font-bold">My Product Portfolio</h2>
    <p className="text-gray-500">Showcase your best creations to potential customers</p>
  </div>
  <div className="flex gap-2">
    <Button 
      onClick={generateReport} 
      variant="outline" 
      className="flex items-center gap-1"
    >
      <Printer size={16} /> Print Report
    </Button>
    <Button onClick={handleAddProduct} className="flex items-center gap-1">
      <Plus size={16} /> Add Product
    </Button>
  </div>
</div>
      <Tabs defaultValue="topRated" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="topRated" className="flex items-center gap-1">
            <Star size={16} /> Top Rated
          </TabsTrigger>
          <TabsTrigger value="bestSelling" className="flex items-center gap-1">
            <TrendingUp size={16} /> Best Selling
          </TabsTrigger>
          <TabsTrigger value="specialCollection" className="flex items-center gap-1">
            <Award size={16} /> Special Collection
          </TabsTrigger>
        </TabsList>
        {Object.keys(portfolioData).map((category) => (
          <TabsContent key={category} value={category} className="space-y-4">
            {portfolioData[category].length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioData[category].map((product) => (
                  <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48 w-full">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                      {product.featured && (
                        <Badge className="absolute top-2 right-2 bg-amber-500">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <p className="text-gray-500 text-sm line-clamp-2 mt-1">
                            {product.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{formatPrice(product.price)}</div>
                          <div className="text-gray-500 text-sm">{product.sold} sold</div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Badge variant="outline" className="mr-1 text-xs">
                          {product.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {product.craftType}
                        </Badge>
                      </div>
                      <div className="flex items-center mt-3">
                        <div className="flex items-center text-amber-500">
                          <Star size={16} className="fill-amber-500" />
                          <span className="ml-1 text-sm font-medium">{product.rating}</span>
                        </div>
                        <span className="mx-2 text-gray-400">•</span>
                        <div className="flex items-center text-gray-500 text-sm">
                          <MessageCircle size={15} className="mr-1" />
                          {product.reviews} reviews
                        </div>
                        <div className="ml-auto flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEditProduct(product)}
                            className="h-8 w-8"
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteProduct(product._id)}
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed">
                <div className="max-w-md mx-auto">
                  <h3 className="text-xl font-medium text-gray-600 mb-2">No products in this collection</h3>
                  <Button onClick={handleAddProduct}>
                    <Plus size={16} className="mr-1" /> Add Product
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
      {/* Product Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentProduct?._id ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {currentProduct?._id 
                ? 'Update your product details below' 
                : 'Showcase your craft by adding detailed product information'}
            </DialogDescription>
          </DialogHeader>
          {/* Form fields remain the same as your original implementation */}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name *
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="name"
                  value={currentProduct?.name || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                  className={formErrors.name ? "border-red-500" : ""}
                />
                {formErrors.name && (
                  <p className="text-xs text-red-500">{formErrors.name}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description *
              </Label>
              <div className="col-span-3 space-y-1">
                <Textarea
                  id="description"
                  value={currentProduct?.description || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                  className={formErrors.description ? "border-red-500" : ""}
                  rows={4}
                />
                {formErrors.description && (
                  <p className="text-xs text-red-500">{formErrors.description}</p>
                )}
                {!formErrors.description && currentProduct?.description && (
                  <p className="text-xs text-gray-500">
                    {currentProduct.description.length}/20 characters
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price (LKR) *
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="price"
                  type="number"
                  value={currentProduct?.price || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, price: parseInt(e.target.value) || 0})}
                  className={formErrors.price ? "border-red-500" : ""}
                />
                {formErrors.price && (
                  <p className="text-xs text-red-500">{formErrors.price}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image URL *
              </Label>
              <div className="col-span-3 space-y-1">
                <div className="flex gap-2">
                  <Input
                    id="image"
                    value={currentProduct?.image || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, image: e.target.value})}
                    className={`flex-1 ${formErrors.image ? "border-red-500" : ""}`}
                    placeholder="Enter image URL"
                  />
                  <Button variant="outline" size="icon" className="flex-shrink-0">
                    <ImagePlus size={16} />
                  </Button>
                </div>
                {formErrors.image && (
                  <p className="text-xs text-red-500">{formErrors.image}</p>
                )}
                {!formErrors.image && currentProduct?.image && (
                  <div className="mt-2 w-24 h-24 border rounded overflow-hidden">
                    <img 
                      src={currentProduct.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/100x100?text=No+Image";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="rating" className="text-right">
                  Rating *
                </Label>
                <div className="space-y-1">
                  <Input
                    id="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={currentProduct?.rating || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, rating: parseFloat(e.target.value) || 0})}
                    className={formErrors.rating ? "border-red-500" : ""}
                  />
                  {formErrors.rating && (
                    <p className="text-xs text-red-500">{formErrors.rating}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="reviews" className="text-right">
                  Reviews *
                </Label>
                <div className="space-y-1">
                  <Input
                    id="reviews"
                    type="number"
                    min="0"
                    value={currentProduct?.reviews || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, reviews: parseInt(e.target.value) || 0})}
                    className={formErrors.reviews ? "border-red-500" : ""}
                  />
                  {formErrors.reviews && (
                    <p className="text-xs text-red-500">{formErrors.reviews}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sold" className="text-right">
                Units Sold *
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="sold"
                  type="number"
                  min="0"
                  value={currentProduct?.sold || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, sold: parseInt(e.target.value) || 0})}
                  className={`col-span-3 ${formErrors.sold ? "border-red-500" : ""}`}
                />
                {formErrors.sold && (
                  <p className="text-xs text-red-500">{formErrors.sold}</p>
                )}
              </div>
            </div>
          </div>


            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category *
              </Label>
              <div className="col-span-3 space-y-1">
                <Select 
                  value={currentProduct?.category || ''}
                  onValueChange={(value) => setCurrentProduct({...currentProduct, category: value})}
                >
                  <SelectTrigger className={formErrors.category ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Use these exact category values that match the backend */}
                    <SelectItem value="topRated">Top Rated</SelectItem>
                    <SelectItem value="bestSelling">Best Selling</SelectItem>
                    <SelectItem value="specialCollection">Special Collection</SelectItem>
                    <SelectItem value="pottery">Pottery</SelectItem>
                    <SelectItem value="textiles">Textiles</SelectItem>
                    <SelectItem value="woodwork">Woodwork</SelectItem>
                    <SelectItem value="art">Art</SelectItem>
                    <SelectItem value="culinary">Culinary</SelectItem>
                    <SelectItem value="personalCare">Personal Care</SelectItem>
                    <SelectItem value="homeDecor">Home Decor</SelectItem>
                    <SelectItem value="jewelry">Jewelry</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="culturalArt">Cultural Art</SelectItem>
                  </SelectContent>
                </Select>
                {formErrors.category && (
                  <p className="text-xs text-red-500">{formErrors.category}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="craftType" className="text-right">
                Craft Type *
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="craftType"
                  value={currentProduct?.craftType || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, craftType: e.target.value})}
                  className={formErrors.craftType ? "border-red-500" : ""}
                  placeholder="e.g. Hand-painted, Weaving, Carving"
                />
                {formErrors.craftType && (
                  <p className="text-xs text-red-500">{formErrors.craftType}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="materials" className="text-right">
                Materials *
              </Label>
              <div className="col-span-3 space-y-1">
                <Input
                  id="materials"
                  value={currentProduct?.materials?.join(', ') || ''}
                  onChange={(e) => setCurrentProduct({
                    ...currentProduct, 
                    materials: e.target.value.split(',').map(item => item.trim()).filter(item => item !== '')
                  })}
                  className={formErrors.materials ? "border-red-500" : ""}
                  placeholder="e.g. Clay, Wood, Natural dyes (comma separated)"
                />
                {formErrors.materials && (
                  <p className="text-xs text-red-500">{formErrors.materials}</p>
                )}
                {!formErrors.materials && currentProduct?.materials?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {currentProduct.materials.map((material, index) => (
                      material && (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {material}
                        </Badge>
                      )
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Featured
              </Label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={currentProduct?.featured || false}
                  onChange={(e) => setCurrentProduct({...currentProduct, featured: e.target.checked})}
                  className="h-4 w-4 rounded"
                />
                <Label htmlFor="featured" className="text-sm font-normal">
                  Highlight this product in your portfolio
                </Label>
              </div>
            </div>
            
          {Object.keys(formErrors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800 mb-4">
              <p className="font-medium">Please fix the following errors:</p>
              <ul className="list-disc list-inside mt-1">
                {Object.values(formErrors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveProduct} 
              disabled={isSubmitting}
              className={isSubmitting ? "opacity-70" : ""}
            >
              {isSubmitting ? "Saving..." : "Save Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    
  );
};

export default SellerPortfolio;