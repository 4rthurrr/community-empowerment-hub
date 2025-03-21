import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
 
 function LandingPage() {
   const navigate = useNavigate();
 
   return (
     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
       <h1 className="text-5xl font-bold mb-8">Welcome to Our Shop!</h1>
       <div className="space-x-4">
         <Button onClick={() => navigate("/shop/home")} className="px-6 py-3">
           Shop Now
         </Button>
         <Button onClick={() => navigate("/shop/account")} className="px-6 py-3">
           My Account
         </Button>
       </div>
     </div>
   );
 }
 
 export default LandingPage;