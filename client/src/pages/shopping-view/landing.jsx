import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
 
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
=======
import { useState, useEffect, useRef } from "react";
import { 
  ShoppingBag, 
  Briefcase, 
  Lightbulb, 
  ChevronRight, 
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react";

function LandingPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ volunteers: 0, training: 0, businesses: 0 });
  const animationRef = useRef(null);
  const refreshTimerRef = useRef(null);
  
  // Function to animate stats count
  const animateStats = () => {
    // First reset stats to 0
    setStats({ volunteers: 0, training: 0, businesses: 0 });
    
    // Then start the animation
    if (animationRef.current) clearInterval(animationRef.current);
    
    animationRef.current = setInterval(() => {
      setStats(prevStats => {
        const newVolunteers = Math.min(prevStats.volunteers + 5, 500);
        const newTraining = Math.min(prevStats.training + 10, 1000);
        const newBusinesses = Math.min(prevStats.businesses + 2, 200);
        
        const complete = newVolunteers === 500 && newTraining === 1000 && newBusinesses === 200;
        if (complete) clearInterval(animationRef.current);
        
        return {
          volunteers: newVolunteers,
          training: newTraining,
          businesses: newBusinesses
        };
      });
    }, 20);
  };
  
  // Initialize animation on first render and set up refresh timer
  useEffect(() => {
    // Start initial animation with a small delay
    const timeout = setTimeout(() => {
      animateStats();
    }, 500);
    
    // Set up recurring animation every 5 seconds
    refreshTimerRef.current = setInterval(() => {
      animateStats();
    }, 5000);
    
    return () => {
      clearTimeout(timeout);
      clearInterval(animationRef.current);
      clearInterval(refreshTimerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with gradient background */}
      <section className="relative py-24 text-center text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 z-0"></div>
        <div className="relative z-10 container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Empowering Communities, <br/>Enriching Lives
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            Join our community-driven marketplace connecting skills, products, and opportunities for sustainable growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate("/shop/home")} 
              className="px-8 py-6 text-lg font-semibold bg-white text-blue-600 hover:bg-blue-50"
            >
              Explore Marketplace
              <ShoppingBag className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={() => navigate("/shop/listing")} 
              className="px-8 py-6 text-lg font-semibold border-2 border-white bg-transparent hover:bg-white/10"
            >
              Browse Products
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Combining marketplace, skills development, and community support in one platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Marketplace Card */}
            <div className="bg-blue-50 rounded-xl p-8 transition-all hover:shadow-lg">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <ShoppingBag className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Community Marketplace</h3>
              <p className="text-gray-700 mb-6">
                Buy and sell local products, supporting community entrepreneurs and artisans with fair trade practices.
              </p>
              <Button 
                variant="link" 
                onClick={() => navigate("/shop/home")} 
                className="text-blue-600 p-0 flex items-center"
              >
                Visit Marketplace <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            {/* Job Portal Card */}
            <div className="bg-purple-50 rounded-xl p-8 transition-all hover:shadow-lg">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Briefcase className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Jobs & Opportunities</h3>
              <p className="text-gray-700 mb-6">
                Connect with employment opportunities, freelance work, and skills-based volunteering in your community.
              </p>
              <Button 
                variant="link" 
                onClick={() => navigate("/shop/home")} 
                className="text-purple-600 p-0 flex items-center"
              >
                Find Opportunities <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            {/* Skills Development Card */}
            <div className="bg-green-50 rounded-xl p-8 transition-all hover:shadow-lg">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Lightbulb className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Skills Development</h3>
              <p className="text-gray-700 mb-6">
                Access training resources, workshops, and mentorship to develop marketable skills for economic independence.
              </p>
              <Button 
                variant="link" 
                onClick={() => navigate("/shop/home")} 
                className="text-green-600 p-0 flex items-center"
              >
                Explore Resources <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section with animated counters */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Community Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Building stronger communities through collective action and support
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
            <div className="bg-white p-10 rounded-xl shadow-md transform hover:-translate-y-2 transition-all duration-300">
              <div className="text-6xl font-bold text-blue-600 mb-4">{stats.volunteers}+</div>
              <p className="text-xl font-medium">Community Members</p>
              <div className="w-full bg-gray-200 h-2.5 rounded-full mt-4 overflow-hidden">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${(stats.volunteers/500)*100}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-white p-10 rounded-xl shadow-md transform hover:-translate-y-2 transition-all duration-300">
              <div className="text-6xl font-bold text-purple-600 mb-4">{stats.training}+</div>
              <p className="text-xl font-medium">Training Hours</p>
              <div className="w-full bg-gray-200 h-2.5 rounded-full mt-4 overflow-hidden">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${(stats.training/1000)*100}%` }}
                ></div>
              </div>
            </div>
            <div className="bg-white p-10 rounded-xl shadow-md transform hover:-translate-y-2 transition-all duration-300">
              <div className="text-6xl font-bold text-green-600 mb-4">{stats.businesses}+</div>
              <p className="text-xl font-medium">Local Businesses Supported</p>
              <div className="w-full bg-gray-200 h-2.5 rounded-full mt-4 overflow-hidden">
                <div 
                  className="bg-green-600 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${(stats.businesses/200)*100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Community Voices</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from those who've experienced positive change through our platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="bg-gray-50 p-8 rounded-xl relative">
              <div className="absolute -top-5 left-8 text-6xl text-gray-200">"</div>
              <p className="text-lg text-gray-700 mb-6 relative z-10">
                "The Hub's marketplace gave me a platform to sell my handcrafted products and build a sustainable business that supports my family. The skills workshops helped me improve my craftsmanship and business knowledge."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-600">SM</span>
                </div>
                <div className="ml-4">
                  <p className="font-bold">Sarah Miller</p>
                  <p className="text-gray-600">Artisan Entrepreneur</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-xl relative">
              <div className="absolute -top-5 left-8 text-6xl text-gray-200">"</div>
              <p className="text-lg text-gray-700 mb-6 relative z-10">
                "After losing my job, I found work opportunities through the Hub's job portal. The community also helped me develop new digital skills that led to a full-time position. This platform truly changes lives."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-600">JD</span>
                </div>
                <div className="ml-4">
                  <p className="font-bold">James Davis</p>
                  <p className="text-gray-600">Web Developer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Community Today</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            Whether you're looking to buy or sell products, find opportunities, or develop new skills, become part of our growing community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate("/shop/home")} 
              className="px-8 py-6 text-lg font-semibold bg-white text-blue-600 hover:bg-blue-50"
            >
              Explore Marketplace
            </Button>
            <Button 
              onClick={() => navigate("/auth/register")} 
              className="px-8 py-6 text-lg font-semibold border-2 border-white bg-transparent hover:bg-white/10"
            >
              Sign Up Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Community Empowerment Hub</h3>
              <p className="text-gray-400">
                Connecting communities with opportunities for growth, skills, and economic independence.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">About Us</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Our Programs</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Marketplace</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Jobs Portal</Button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Contact Us</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">FAQ</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Privacy Policy</Button></li>
                <li><Button variant="link" className="text-gray-400 hover:text-white p-0">Terms & Conditions</Button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact Us</h4>
              <p className="text-gray-400 mb-2">contact@empowermenthub.org</p>
              <p className="text-gray-400 mb-4">+1 (555) 123-4567</p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="hover:bg-blue-600/20 h-8 w-8 p-0">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-blue-400/20 h-8 w-8 p-0">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-pink-600/20 h-8 w-8 p-0">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-blue-800/20 h-8 w-8 p-0">
                  <Linkedin className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-6 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Community Empowerment Hub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
>>>>>>> 1d46dd9f3d1e015b3a4b1debeb6147142c8cebd5
