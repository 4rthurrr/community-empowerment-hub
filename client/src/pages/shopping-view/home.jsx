import { Button } from "@/components/ui/button";

import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Leaf,
  Heart,
  Paintbrush,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
  Wheat,
  Flower,
  Shovel,
  Droplet,
  Stethoscope,
  Pill,
  Sparkles,
  BadgePlus,
  PenTool,
  Scissors,
  Gem,
  Home,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

const categoriesWithIcon = [
  { id: "pottery_glass", label: "Pottery & Glass", icon: Images },
  { id: "electronics", label: "Electronics", icon: Airplay },
  { id: "clothing", label: "Clothing", icon: ShirtIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
  { id: "agriculture", label: "Agriculture", icon: Leaf },
  { id: "healthcare", label: "Healthcare", icon: Heart },
  { id: "handcraft", label: "Handcraft", icon: Paintbrush },
];

const subcategoriesWithIcon = [
  { id: "mobile_phones", label: "Mobile Phones", icon: Shirt },
  { id: "laptops", label: "Laptops", icon: WashingMachine },
  { id: "headphones", label: "Headphones", icon: ShoppingBasket },
  { id: "mens_clothing", label: "Men's Clothing", icon: ShirtIcon },
  { id: "womens_clothing", label: "Women's Clothing", icon: CloudLightning },
  { id: "kids_clothing", label: "Kids' Clothing", icon: BabyIcon },
  { id: "agriculture-organic", label: "Organic Products", icon: Wheat },
  { id: "agriculture-seeds", label: "Seeds & Seedlings", icon: Flower },
  { id: "agriculture-tools", label: "Farming Tools", icon: Shovel },
  { id: "agriculture-fertilizers", label: "Natural Fertilizers", icon: Droplet },
  { id: "healthcare-herbal", label: "Herbal Remedies", icon: Stethoscope },
  { id: "healthcare-wellness", label: "Wellness Products", icon: Pill },
  { id: "healthcare-personal", label: "Personal Care", icon: Sparkles },
  { id: "healthcare-hygiene", label: "Hygiene Products", icon: BadgePlus },
  { id: "handcraft-pottery", label: "Pottery & Ceramics", icon: PenTool },
  { id: "handcraft-textiles", label: "Handwoven Textiles", icon: Scissors },
  { id: "handcraft-jewelry", label: "Handmade Jewelry", icon: Gem },
  { id: "handcraft-decor", label: "Home Decor Items", icon: Home },
];


function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing?${section}=${getCurrentItem.id}`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  console.log(productList, "productList");

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[400px] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
              />
            ))
          : null}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Browse Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-all border-l-4 border-l-primary hover:translate-y-[-5px]"
              >
                <CardContent className="flex items-center p-6">
                  <div className="rounded-full bg-primary/10 p-3 mr-4">
                    <categoryItem.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{categoryItem.label}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Browse {categoryItem.label.toLowerCase()} products
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Specialized Categories</h2>
            <Button 
              variant="ghost" 
              className="text-primary"
              onClick={() => navigate('/shop/listing')}
            >
              View All
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {subcategoriesWithIcon.slice(0, 12).map((subcategoryItem) => (
              <Card
                key={subcategoryItem.id}
                onClick={() => handleNavigateToListingPage(subcategoryItem, "subcategory")}
                className="cursor-pointer group hover:bg-primary/5 transition-all border border-gray-100"
              >
                <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                  <div className="rounded-full bg-gray-100 p-3 mb-3 group-hover:bg-white transition-colors">
                    <subcategoryItem.icon className="w-6 h-6 text-gray-700 group-hover:text-primary" />
                  </div>
                  <span className="text-sm font-medium">{subcategoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3 relative inline-block">
              <span className="relative z-10">Featured Products</span>
              <span className="absolute bottom-0 left-0 w-full h-3 bg-blue-100 -z-10 transform -rotate-1"></span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover our handpicked selection of quality products from local artisans and community entrepreneurs</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {productList && productList.length > 0
              ? productList.slice(0, 8).map((productItem) => (
                  <div key={productItem._id} className="transform transition duration-300 hover:scale-105">
                    <ShoppingProductTile
                      handleGetProductDetails={handleGetProductDetails}
                      product={productItem}
                      handleAddtoCart={handleAddtoCart}
                    />
                  </div>
                ))
              : (
                <div className="col-span-full text-center py-12">
                  <div className="inline-block p-6 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500">No featured products available at the moment.</p>
                  </div>
                </div>
              )}
          </div>
          
          {productList && productList.length > 8 && (
            <div className="text-center mt-12">
              <Button 
                onClick={() => navigate('/shop/listing')}
                variant="outline" 
                className="px-6 py-3 border-2 border-primary hover:bg-primary/10"
              >
                View All Products
              </Button>
            </div>
          )}
        </div>
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;