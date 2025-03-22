import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/account.jpg";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";
import SellerPortfolio from "@/components/shopping-view/seller-portfolio";
import ProfileSettings from "@/components/shopping-view/profile-settings";
import { useSelector } from "react-redux";
import { User, ShoppingBag, MapPin, Package } from "lucide-react";

function ShoppingAccount() {
  const { user } = useSelector((state) => state.auth);
  const isSeller = user?.role === "seller" || true; // For demo purposes, we're showing to all users
  
  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img
          src={accImg}
          className="h-full w-full object-cover object-center"
          alt="Account banner"
        />
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">My Account</h1>
            <p className="text-lg">{user?.name || "PROFILE"}</p>
          </div>
        </div>
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
        <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
          <Tabs defaultValue="profile">
            <TabsList className="mb-4">
              <TabsTrigger value="profile" className="flex items-center gap-1">
                <User size={16} /> Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-1">
                <ShoppingBag size={16} /> Orders
              </TabsTrigger>
              <TabsTrigger value="address" className="flex items-center gap-1">
                <MapPin size={16} /> Address
              </TabsTrigger>
              {isSeller && (
                <TabsTrigger value="portfolio" className="flex items-center gap-1">
                  <Package size={16} /> Product Portfolio
                </TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="profile">
              <ProfileSettings />
            </TabsContent>
            
            <TabsContent value="orders">
              <ShoppingOrders />
            </TabsContent>
            
            <TabsContent value="address">
              <Address />
            </TabsContent>
            
            {isSeller && (
              <TabsContent value="portfolio">
                <SellerPortfolio />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;
