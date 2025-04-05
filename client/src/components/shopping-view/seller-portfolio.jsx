import { useState, useEffect } from "react";
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

// Dummy data for demonstration
const portfolioItems = {
  topRated: [
    {
      id: 1,
      name: "Hand-painted Clay Pottery Set",
      description: "Traditional design with modern functionality, each piece uniquely crafted by skilled artisans.",
      price: 5200,
      image: "https://images.unsplash.com/photo-1605883705077-8d3d3cebe78c?q=80&w=500&auto=format&fit=crop",
      rating: 4.9,
      reviews: 47,
      sold: 152,
      category: "Pottery",
      featured: true,
      craftType: "Hand-painted",
      materials: ["Clay", "Natural pigments"]
    },
    {
      id: 2,
      name: "Handwoven Bamboo Basket",
      description: "Sustainable bamboo basket woven by traditional techniques passed through generations.",
      price: 1800,
      image: "https://images.unsplash.com/photo-1595964370363-2c54ca62db9d?q=80&w=500&auto=format&fit=crop",
      rating: 4.8,
      reviews: 34,
      sold: 89,
      category: "Home Decor",
      featured: true,
      craftType: "Weaving",
      materials: ["Bamboo", "Natural dyes"]
    },
    {
      id: 3,
      name: "Copper Incense Holder",
      description: "Hand-crafted from recycled copper using traditional metalworking techniques.",
      price: 1200,
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=500&auto=format&fit=crop",
      rating: 4.7,
      reviews: 28,
      sold: 73,
      category: "Home Decor",
      featured: false,
      craftType: "Metalwork",
      materials: ["Recycled copper"]
    }
  ],
  bestSelling: [
    {
      id: 4,
      name: "Organic Spice Gift Box",
      description: "Collection of hand-picked, sustainably grown spices from local farmers.",
      price: 2800,
      image: "https://images.unsplash.com/photo-1532336414046-2a47b2a97430?q=80&w=500&auto=format&fit=crop",
      rating: 4.6,
      reviews: 112,
      sold: 384,
      category: "Culinary",
      featured: true,
      craftType: "Food",
      materials: ["Organic spices", "Recycled packaging"]
    },
    {
      id: 5,
      name: "Handmade Coconut Oil Soap",
      description: "Natural soap made with virgin coconut oil and essential oils, plastic-free packaging.",
      price: 450,
      image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?q=80&w=500&auto=format&fit=crop",
      rating: 4.5,
      reviews: 89,
      sold: 276,
      category: "Personal Care",
      featured: false,
      craftType: "Soap Making",
      materials: ["Coconut oil", "Essential oils", "Natural herbs"]
    },
    {
      id: 6,
      name: "Hand-embroidered Table Runner",
      description: "Traditional embroidery showcasing Sri Lankan cultural motifs on handwoven cotton.",
      price: 3200,
      image: "https://images.unsplash.com/photo-1584811644165-33078f50eb15?q=80&w=500&auto=format&fit=crop",
      rating: 4.7,
      reviews: 56,
      sold: 218,
      category: "Textiles",
      featured: true,
      craftType: "Embroidery",
      materials: ["Handwoven cotton", "Natural thread"]
    }
  ],
  specialCollection: [
    {
      id: 7,
      name: "Limited Edition Batik Wall Hanging",
      description: "Celebrating local wildlife through traditional batik techniques on natural fabrics.",
      price: 7800,
      image: "https://images.unsplash.com/photo-1603031543919-74f8e4d51599?q=80&w=500&auto=format&fit=crop",
      rating: 4.9,
      reviews: 23,
      sold: 42,
      category: "Art",
      featured: true,
      craftType: "Batik",
      materials: ["Cotton", "Natural wax", "Natural dyes"]
    },
    {
      id: 8,
      name: "Handcrafted Wooden Educational Toys",
      description: "Sustainable wooden toys that teach traditional counting games and cultural activities.",
      price: 1500,
      image: "https://images.unsplash.com/photo-1516981879613-9f5da904015f?q=80&w=500&auto=format&fit=crop",
      rating: 4.8,
      reviews: 67,
      sold: 129,
      category: "Educational",
      featured: true,
      craftType: "Woodwork",
      materials: ["Sustainable wood", "Non-toxic paint"]
    },
    {
      id: 9,
      name: "Traditional Mask Replica",
      description: "Hand-carved authentic replica of ceremonial masks used in traditional Sri Lankan dance.",
      price: 6500,
      image: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=500&auto=format&fit=crop",
      rating: 4.7,
      reviews: 31,
      sold: 64,
      category: "Cultural Art",
      featured: true,
      craftType: "Carving",
      materials: ["Wood", "Natural pigments"]
    }
  ]
};

const SellerPortfolio = () => {
  const [portfolioData, setPortfolioData] = useState(portfolioItems);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("topRated");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form errors when the dialog opens/closes or product changes
  useEffect(() => {
    setFormErrors({});
  }, [isDialogOpen, currentProduct]);

  // Handle adding a new product
  const handleAddProduct = () => {
    setCurrentProduct({
      id: Date.now(),
      name: "",
      description: "",
      price: 0,
      image: "",
      rating: 0,
      reviews: 0,
      sold: 0,
      category: "",
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

  // Validate the product form
  const validateProductForm = () => {
    const errors = {};

    // Name validation
    if (!currentProduct?.name?.trim()) {
      errors.name = "Product name is required";
    } else if (currentProduct.name.trim().length < 3) {
      errors.name = "Product name must be at least 3 characters";
    } else if (!/^[A-Za-z\s'-]+$/.test(currentProduct.name.trim())) {
      errors.name = "Name cannot contain numbers or symbols";
    }

    // Category validation
    if (!currentProduct?.category) {
      errors.category = "Please select a category";
    }

    // Craft Type validation
    if (!currentProduct?.craftType?.trim()) {
      errors.craftType = "Craft type is required";
    } else if (!/^[A-Za-z\s'-]+$/.test(currentProduct.craftType.trim())) {
      errors.craftType = "Craft type cannot contain numbers or symbols";
    }
    

    // Price validation
    if (!currentProduct?.price) {
      errors.price = "Price is required";
    } else if (isNaN(Number(currentProduct.price))) {
      errors.price = "Price must be a valid number";
    } else if (Number(currentProduct.price) <= 0) {
      errors.price = "Price must be a positive number";
    }

    // Description validation
    if (!currentProduct?.description?.trim()) {
      errors.description = "Description is required";
    } else if (currentProduct.description.trim().length < 20) {
      errors.description = "Description should be at least 20 characters";
    }

    // Image URL validation
    if (!currentProduct?.image?.trim()) {
      errors.image = "Image URL is required";
    } else {
      try {
        new URL(currentProduct.image);
      } catch (e) {
        errors.image = "Please enter a valid URL";
      }
    }

    // Materials validation
    if (!currentProduct?.materials?.length || 
        (currentProduct.materials.length === 1 && currentProduct.materials[0] === "")) {
      errors.materials = "Add at least one material";
    }

    // Rating validation
    if (currentProduct?.rating !== 0 && !currentProduct?.rating) {
      errors.rating = "Rating is required";
    } else if (currentProduct.rating < 0 || currentProduct.rating > 5) {
      errors.rating = "Rating must be between 0 and 5";
    }

    // Reviews validation
    if (currentProduct?.reviews !== 0 && !currentProduct?.reviews) {
      errors.reviews = "Number of reviews is required";
    } else if (currentProduct.reviews < 0 || !Number.isInteger(Number(currentProduct.reviews))) {
      errors.reviews = "Reviews must be a non-negative whole number";
    }

    // Units Sold validation
    if (currentProduct?.sold !== 0 && !currentProduct?.sold) {
      errors.sold = "Units sold is required";
    } else if (currentProduct.sold < 0 || !Number.isInteger(Number(currentProduct.sold))) {
      errors.sold = "Units sold must be a non-negative whole number";
    }

    return errors;
  };

  // Handle saving product with validation
  const handleSaveProduct = () => {
    if (!currentProduct) return;
    
    setIsSubmitting(true);
    
    // Validate the form
    const validationErrors = validateProductForm();
    setFormErrors(validationErrors);
    
    // If there are errors, don't proceed
    if (Object.keys(validationErrors).length > 0) {
      setIsSubmitting(false);
      return;
    }
    
    // For demo purposes, we'll just add it to the top of the active category
    const newData = {...portfolioData};
    
    // Remove the product if it exists in any category
    Object.keys(newData).forEach(category => {
      newData[category] = newData[category].filter(item => item.id !== currentProduct.id);
    });
    
    // Add to the active category
    newData[activeTab] = [currentProduct, ...newData[activeTab]];
    
    setPortfolioData(newData);
    setIsDialogOpen(false);
    setIsSubmitting(false);
  };

  // Handle deleting a product
  const handleDeleteProduct = (productId) => {
    if (confirm("Are you sure you want to remove this product from your portfolio?")) {
      const newData = {...portfolioData};
      
      Object.keys(newData).forEach(category => {
        newData[category] = newData[category].filter(item => item.id !== productId);
      });
      
      setPortfolioData(newData);
    }
  };

  // Helper function to format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">My Product Portfolio</h2>
          <p className="text-gray-500">Showcase your best creations to potential customers</p>
        </div>
        <Button onClick={handleAddProduct} className="flex items-center gap-1">
          <Plus size={16} /> Add Product
        </Button>
      </div>

      <Tabs defaultValue="topRated" onValueChange={(value) => setActiveTab(value)}>
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
                  <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
                            onClick={() => handleDeleteProduct(product.id)}
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
                  <p className="text-gray-500 mb-4">Add your best products to showcase your craftsmanship</p>
                  <Button onClick={handleAddProduct}>
                    <Plus size={16} className="mr-1" /> Add Product
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <h3 className="font-medium text-blue-800 flex items-center">
          <Award size={18} className="mr-2" /> Portfolio Tips
        </h3>
        <ul className="mt-2 space-y-2 text-sm text-blue-700">
          <li className="flex items-start">
            <ChevronRight size={16} className="mt-0.5 mr-1 flex-shrink-0" />
            <span>Add high-quality photos that showcase your craftsmanship</span>
          </li>
          <li className="flex items-start">
            <ChevronRight size={16} className="mt-0.5 mr-1 flex-shrink-0" />
            <span>Highlight the cultural significance or traditional techniques used</span>
          </li>
          <li className="flex items-start">
            <ChevronRight size={16} className="mt-0.5 mr-1 flex-shrink-0" />
            <span>Update your portfolio regularly with your latest creations</span>
          </li>
          <li className="flex items-start">
            <ChevronRight size={16} className="mt-0.5 mr-1 flex-shrink-0" />
            <span>Feature products that are unique or represent local craftsmanship</span>
          </li>
        </ul>
      </div>

      {/* Product Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{currentProduct?.id ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {currentProduct?.id 
                ? 'Update your product details below' 
                : 'Showcase your craft by adding detailed product information'}
            </DialogDescription>
          </DialogHeader>
          
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
                    <SelectItem value="Pottery">Pottery</SelectItem>
                    <SelectItem value="Textiles">Textiles</SelectItem>
                    <SelectItem value="Woodwork">Woodwork</SelectItem>
                    <SelectItem value="Art">Art</SelectItem>
                    <SelectItem value="Culinary">Culinary</SelectItem>
                    <SelectItem value="Personal Care">Personal Care</SelectItem>
                    <SelectItem value="Home Decor">Home Decor</SelectItem>
                    <SelectItem value="Jewelry">Jewelry</SelectItem>
                    <SelectItem value="Educational">Educational</SelectItem>
                    <SelectItem value="Cultural Art">Cultural Art</SelectItem>
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