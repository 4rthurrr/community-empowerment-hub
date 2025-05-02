import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Star, Award, TrendingUp, Store, MapPin, Users, Calendar, ExternalLink } from "lucide-react";

const SellerPortfolioModal = ({ open, setOpen, sellerInfo }) => {
  const [loading, setLoading] = useState(true);
  const [sellerData, setSellerData] = useState(null);
  const [portfolioData, setPortfolioData] = useState({
    topRated: [],
    bestSelling: [],
    specialCollection: []
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("topRated");
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    if (open) {
      // In a real app, you would fetch seller data from API
      // For now, we'll use mock data
      setTimeout(() => {
        setSellerData(mockSellerData);
        setLoading(false);
      }, 800);
    } else {
      setLoading(true);
    }
  }, [open, sellerInfo]);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await fetch('/api/portfolio');
        if (!response.ok) throw new Error('Failed to fetch portfolio');
        const data = await response.json();
        setPortfolioData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPortfolio();
  }, []);


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

  // Name validation
  if (!currentProduct?.name?.trim()) {
    errors.name = "Product name is required";
  } else if (currentProduct.name.trim().length < 3) {
    errors.name = "Product name must be at least 3 characters";
  } else if (!/^[A-Za-z\s\-',.]+$/.test(currentProduct.name.trim())) {
    errors.name = "Name can only contain letters, spaces, and basic punctuation";
  }

  // Category validation
  if (!currentProduct?.category) {
    errors.category = "Please select a category";
  }

  // Craft Type validation
  if (!currentProduct?.craftType?.trim()) {
    errors.craftType = "Craft type is required";
  } else if (!/^[A-Za-z\s\-',.]+$/.test(currentProduct.craftType.trim())) {
    errors.craftType = "Craft type can only contain letters and spaces";
  }

  // Price validation
  if (!currentProduct?.price) {
    errors.price = "Price is required";
  } else if (isNaN(Number(currentProduct.price))) {
    errors.price = "Price must be a valid number";
  } else if (Number(currentProduct.price) < 0) {
    errors.price = "Price cannot be negative";
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
  } else if (!/^(https?:\/\/).+\.(jpe?g|png|webp|gif|svg)$/i.test(currentProduct.image)) {
    errors.image = "Please enter a valid image URL (jpg, png, webp, gif, svg)";
  }

  // Materials validation
  if (!currentProduct?.materials?.length || 
      currentProduct.materials.some(material => !material.trim())) {
    errors.materials = "Add at least one valid material";
  }

  // Rating validation
  if (typeof currentProduct?.rating === 'undefined') {
    errors.rating = "Rating is required";
  } else if (isNaN(currentProduct.rating) || 
             currentProduct.rating < 0 || 
             currentProduct.rating > 5) {
    errors.rating = "Rating must be between 0 and 5";
  }

  // Reviews validation
  if (typeof currentProduct?.reviews === 'undefined') {
    errors.reviews = "Number of reviews is required";
  } else if (!Number.isInteger(currentProduct.reviews) || currentProduct.reviews < 0) {
    errors.reviews = "Reviews must be a non-negative whole number";
  }

  // Sold units validation
  if (typeof currentProduct?.sold === 'undefined') {
    errors.sold = "Units sold is required";
  } else if (!Number.isInteger(currentProduct.sold) || currentProduct.sold < 0) {
    errors.sold = "Units sold must be a non-negative whole number";
  }

  return errors;
};

  // Format price helper
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Artisan Portfolio</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-500">Loading artisan information...</p>
          </div>
        ) : (
          <>
            {/* Seller Profile Header */}
            <div className="flex flex-col md:flex-row gap-6 pb-6 border-b">
              <div className="md:w-1/4 flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-3 overflow-hidden">
                  {sellerData?.profileImage ? (
                    <img 
                      src={sellerData?.profileImage} 
                      alt={sellerData?.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Store className="w-12 h-12 text-primary" />
                  )}
                </div>
                <h2 className="text-xl font-bold">{sellerData?.name}</h2>
                <p className="text-gray-500 flex items-center justify-center mt-1">
                  <MapPin className="w-4 h-4 mr-1" /> {sellerData?.location}
                </p>
                
                <div className="flex items-center mt-2">
                  <Star className="text-amber-500 fill-amber-500 w-4 h-4" />
                  <span className="ml-1 font-medium">{sellerData?.rating}</span>
                  <span className="text-gray-500 text-sm ml-1">
                    ({sellerData?.reviewCount} reviews)
                  </span>
                </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  <div className="flex items-center mt-1">
                    <Users className="w-4 h-4 mr-2" />
                    <span>{sellerData?.groupSize} artisans</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Member since {sellerData?.memberSince}</span>
                  </div>
                </div>
                
                <Button variant="outline" className="mt-4 w-full">
                  View Full Profile
                </Button>
              </div>
              
              <div className="md:w-3/4">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg">About {sellerData?.name}</h3>
                  <p className="mt-2 text-gray-600">{sellerData?.bio}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {sellerData?.specialties.map((specialty, index) => (
                    <Badge key={index} variant="outline" className="justify-center py-1.5">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  <div className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Award className="w-4 h-4 mr-1" /> {sellerData?.certificationType}
                  </div>
                  {sellerData?.sustainable && (
                    <div className="bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Sustainable Practices
                    </div>
                  )}
                  {sellerData?.communityFocused && (
                    <div className="bg-purple-50 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      Community-Focused
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Seller Products */}
            <div className="mt-6">
              <Tabs defaultValue="featured">
                <TabsList className="mb-4">
                  <TabsTrigger value="featured" className="flex items-center gap-1">
                    <Award className="w-4 h-4" /> Featured Products
                  </TabsTrigger>
                  <TabsTrigger value="bestsellers" className="flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> Best Sellers
                  </TabsTrigger>
                  <TabsTrigger value="recent" className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> Recent Work
                  </TabsTrigger>
                </TabsList>
                
                {Object.keys(sellerData?.products).map((category) => (
                  <TabsContent key={category} value={category}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {sellerData?.products[category].map((product, index) => (
                        <Card key={index} className="overflow-hidden hover:shadow-md transition-all">
                          <div className="relative h-36">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                            {product.isFeatured && (
                              <Badge className="absolute top-2 right-2 bg-amber-500">
                                Featured
                              </Badge>
                            )}
                          </div>
                          <CardContent className="p-3">
                            <h4 className="font-medium text-sm">{product.name}</h4>
                            <div className="flex justify-between items-center mt-1">
                              <Badge variant="outline" className="text-xs">
                                {product.category}
                              </Badge>
                              <span className="font-bold text-sm">{formatPrice(product.price)}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
            
            {/* Footer */}
            <div className="mt-6 pt-4 border-t text-center">
              <Button 
                variant="outline" 
                className="mx-auto flex items-center gap-2"
                onClick={() => window.open(`/shop?seller=${sellerInfo.id || 'demo'}`, '_blank')}
              >
                View All Products by {sellerData?.name} <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Mock data for demonstration
const mockSellerData = {
  id: "seller123",
  name: "Sri Lankan Artisan Collective",
  location: "Kandy, Sri Lanka",
  bio: "We are a cooperative of 12 skilled artisans from the central highlands of Sri Lanka. Our collective specializes in traditional pottery, handloom textiles, and woodcraft using techniques passed down through generations. We work with sustainable materials and traditional methods to create authentic Sri Lankan crafts.",
  profileImage: "https://images.unsplash.com/photo-1590422749897-47ccfcb68283?q=80&w=500&auto=format&fit=crop",
  rating: 4.8,
  reviewCount: 136,
  memberSince: "June 2022",
  groupSize: 12,
  specialties: ["Traditional Pottery", "Natural Dyes", "Handloom Textiles", "Woodcraft", "Heritage Designs"],
  certificationType: "Fair Trade Certified",
  sustainable: true,
  communityFocused: true,
  products: {
    featured: [
      {
        id: "p1",
        name: "Hand-painted Clay Pottery Set",
        price: 5200,
        category: "Pottery",
        image: "https://images.unsplash.com/photo-1605883705077-8d3d3cebe78c?q=80&w=500&auto=format&fit=crop",
        isFeatured: true
      },
      {
        id: "p2",
        name: "Traditional Batik Wall Hanging",
        price: 7800,
        category: "Textiles",
        image: "https://images.unsplash.com/photo-1603031543919-74f8e4d51599?q=80&w=500&auto=format&fit=crop",
        isFeatured: true
      },
      {
        id: "p3",
        name: "Handcrafted Wooden Sculptures",
        price: 3500,
        category: "Woodcraft",
        image: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=500&auto=format&fit=crop",
        isFeatured: true
      }
    ],
    bestsellers: [
      {
        id: "p4",
        name: "Organic Spice Gift Box",
        price: 2800,
        category: "Culinary",
        image: "https://images.unsplash.com/photo-1532336414046-2a47b2a97430?q=80&w=500&auto=format&fit=crop",
        isFeatured: false
      },
      {
        id: "p5",
        name: "Handmade Coconut Oil Soap",
        price: 450,
        category: "Personal Care",
        image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?q=80&w=500&auto=format&fit=crop",
        isFeatured: false
      },
      {
        id: "p6",
        name: "Hand-embroidered Table Runner",
        price: 3200,
        category: "Textiles",
        image: "https://images.unsplash.com/photo-1584811644165-33078f50eb15?q=80&w=500&auto=format&fit=crop",
        isFeatured: false
      }
    ],
    recent: [
      {
        id: "p7",
        name: "Ceramic Hanging Planters",
        price: 1800,
        category: "Pottery",
        image: "https://images.unsplash.com/photo-1595434091143-b375ced5fe5c?q=80&w=500&auto=format&fit=crop",
        isFeatured: false
      },
      {
        id: "p8",
        name: "Recycled Paper Notebooks",
        price: 650,
        category: "Stationery",
        image: "https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?q=80&w=500&auto=format&fit=crop",
        isFeatured: false
      },
      {
        id: "p9",
        name: "Palm Leaf Woven Baskets",
        price: 1200,
        category: "Home Decor",
        image: "https://images.unsplash.com/photo-1595964370363-2c54ca62db9d?q=80&w=500&auto=format&fit=crop",
        isFeatured: false
      }
    ]
  }
};

export default SellerPortfolioModal;