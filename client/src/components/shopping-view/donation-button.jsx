import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HeartHandshake } from "lucide-react";
import DonationModal from "./donation-modal";

const DonationButton = ({ seller, className }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)}
        variant="secondary" 
        className={`flex items-center gap-2 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 ${className}`}
      >
        <HeartHandshake className="h-4 w-4" />
        <span>Support Artisan</span>
      </Button>

      <DonationModal 
        open={isModalOpen} 
        setOpen={setIsModalOpen}
        seller={seller}
      />
    </>
  );
};

export default DonationButton;
