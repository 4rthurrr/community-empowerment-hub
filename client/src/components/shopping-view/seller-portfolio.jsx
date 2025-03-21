import { useState } from "react";
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

  // Handle saving product (new or edited)
  const handleSaveProduct = () => {
    if (!currentProduct) return;
    
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
                Name
              </Label>
              <Input
                id="name"
                value={currentProduct?.name || ''}
                onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Select 
                value={currentProduct?.category || ''}
                onValueChange={(value) => setCurrentProduct({...currentProduct, category: value})}
              >
                <SelectTrigger className="col-span-3">
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
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="craftType" className="text-right">
                Craft Type
              </Label>
              <Input
                id="craftType"
                value={currentProduct?.craftType || ''}
                onChange={(e) => setCurrentProduct({...currentProduct, craftType: e.target.value})}
                className="col-span-3"
                placeholder="e.g. Hand-painted, Weaving, Carving"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price (LKR)
              </Label>
              <Input
                id="price"
                type="number"
                value={currentProduct?.price || ''}
                onChange={(e) => setCurrentProduct({...currentProduct, price: parseInt(e.target.value)})}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right pt-2">
                Description
              </Label>
              <Textarea
                id="description"
                value={currentProduct?.description || ''}
                onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                className="col-span-3"
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image URL
              </Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="image"
                  value={currentProduct?.image || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, image: e.target.value})}
                  className="flex-1"
                  placeholder="Enter image URL"
                />
                <Button variant="outline" size="icon" className="flex-shrink-0">
                  <ImagePlus size={16} />
                </Button>
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
                Materials
              </Label>
              <Input
                id="materials"
                value={currentProduct?.materials?.join(', ') || ''}
                onChange={(e) => setCurrentProduct({
                  ...currentProduct, 
                  materials: e.target.value.split(',').map(item => item.trim())
                })}
                className="col-span-3"
                placeholder="e.g. Clay, Wood, Natural dyes (comma separated)"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="rating" className="text-right">
                  Rating
                </Label>
                <Input
                  id="rating"
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={currentProduct?.rating || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, rating: parseFloat(e.target.value)})}
                />
              </div>
              
              <div className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor="reviews" className="text-right">
                  Reviews
                </Label>
                <Input
                  id="reviews"
                  type="number"
                  min="0"
                  value={currentProduct?.reviews || ''}
                  onChange={(e) => setCurrentProduct({...currentProduct, reviews: parseInt(e.target.value)})}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sold" className="text-right">
                Units Sold
              </Label>
              <Input
                id="sold"
                type="number"
                min="0"
                value={currentProduct?.sold || ''}
                onChange={(e) => setCurrentProduct({...currentProduct, sold: parseInt(e.target.value)})}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProduct}>
              Save Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellerPortfolio;