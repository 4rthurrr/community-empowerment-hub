import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { HeartHandshake, AlertCircle } from "lucide-react";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Donation form component (inside Stripe Elements)
const DonationForm = ({ seller, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState("");
  
  // Predefined donation amounts
  const predefinedAmounts = [100, 500, 1000, 2000];
  
  // Handle amount selection
  const handleAmountSelect = (value) => {
    setAmount(value.toString());
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    // Basic validation
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid donation amount",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Step 1: Create a payment intent on the server
      const { data: intentData } = await axios.post(
        "http://localhost:5000/api/shop/donations/create-intent",
        {
          sellerId: seller.id,
          buyerId: user.id,
          amount: parseFloat(amount),
        }
      );
      
      if (!intentData.success) {
        throw new Error(intentData.message || "Failed to create payment intent");
      }
      
      // Step 2: Confirm the payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        intentData.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              email: user.email,
            },
          },
        }
      );
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (paymentIntent.status === "succeeded") {
        // Step 3: Record the donation in our database
        await axios.post("http://localhost:5000/api/shop/donations/process", {
          paymentIntentId: intentData.paymentIntentId,
          sellerId: seller.id,
          buyerId: user.id,
          buyerEmail: user.email,
          amount: parseFloat(amount),
          message,
        });
        
        // Success notification
        toast({
          title: "Donation successful!",
          description: `Thank you for your donation of LKR ${amount} to ${seller.name}`,
        });
        
        // Close the modal
        onClose();
      }
    } catch (error) {
      console.error("Donation error:", error);
      setCardError(error.message);
      toast({
        variant: "destructive",
        title: "Donation failed",
        description: error.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4 py-4">
        <div className="text-center mb-4">
          <div className="bg-pink-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-2">
            <HeartHandshake className="h-8 w-8 text-pink-500" />
          </div>
          <h3 className="text-lg font-medium text-center">Support {seller.name}</h3>
        </div>
        
        <div className="mb-4">
          <Label htmlFor="amount" className="text-sm font-medium">Donation Amount (LKR)</Label>
          <Input
            id="amount"
            type="number"
            min="10"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 shadow-sm"
            required
          />
          
          {/* Predefined amounts */}
          <div className="flex flex-wrap gap-2 mt-2">
            {predefinedAmounts.map((amt) => (
              <Button
                key={amt}
                type="button"
                variant={amount === amt.toString() ? "default" : "outline"}
                size="sm"
                onClick={() => handleAmountSelect(amt)}
                className={amount === amt.toString() ? "bg-primary text-white" : "border-gray-300 hover:bg-gray-50"}
              >
                LKR {amt}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <Label htmlFor="card-element" className="text-sm font-medium mb-1 block">Card Details</Label>
          <div className="mt-1 p-3 border rounded-md bg-white shadow-sm">
            <CardElement 
              id="card-element" 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                    padding: '10px 0',
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
          {cardError && (
            <div className="mt-2 flex items-center text-sm text-red-600 bg-red-50 p-2 rounded">
              <AlertCircle className="h-4 w-4 mr-1" /> {cardError}
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <Label htmlFor="message" className="text-sm font-medium">Message (Optional)</Label>
          <Textarea
            id="message"
            placeholder="Add a personal message to the seller"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 shadow-sm"
          />
        </div>
      </div>
      
      <DialogFooter className="gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
          disabled={isProcessing}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!stripe || isProcessing}
          className={`flex-1 ${isProcessing ? "opacity-70" : ""}`}
        >
          {isProcessing ? "Processing..." : "Donate Now"}
        </Button>
      </DialogFooter>
    </form>
  );
};

// Main donation modal component
const DonationModal = ({ open, setOpen, seller }) => {
  if (!seller) return null;
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] p-6 rounded-lg">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-bold text-center text-primary">Support {seller.name}</DialogTitle>
          <DialogDescription className="text-center">
            Your donation helps local artisans and small businesses grow.
          </DialogDescription>
        </DialogHeader>
        
        <Elements stripe={stripePromise}>
          <DonationForm 
            seller={seller} 
            onClose={() => setOpen(false)} 
          />
        </Elements>
      </DialogContent>
    </Dialog>
  );
};

export default DonationModal;
