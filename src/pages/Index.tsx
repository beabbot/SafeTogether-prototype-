
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RideForm from "@/components/RideForm";
import { getCurrentRide } from "@/lib/rideStore";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if there's an active ride
    const currentRide = getCurrentRide();
    if (currentRide && currentRide.status === "active") {
      navigate("/ride-progress");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-primary text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-bold">SafeTogether</h1>
        </div>
      </header>
      
      <main>
        <RideForm />
      </main>
    </div>
  );
};

export default Index;
