
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RideData } from "@/lib/types";
import { completeRide, clearRide, getCurrentRide } from "@/lib/rideStore";

const RideCompleted = () => {
  const navigate = useNavigate();
  const [ride, setRide] = useState<RideData | null>(null);
  
  useEffect(() => {
    const currentRide = getCurrentRide();
    if (!currentRide) {
      navigate("/");
      return;
    }
    
    const completedRideData = completeRide();
    setRide(completedRideData);
  }, [navigate]);
  
  if (!ride) {
    return <div className="app-container"><p>Loading ride details...</p></div>;
  }
  
  const formatDate = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleString([], { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  const calculateDuration = () => {
    if (!ride.endTime) return "Unknown";
    
    const start = new Date(ride.startTime).getTime();
    const end = new Date(ride.endTime).getTime();
    const durationMs = end - start;
    
    const minutes = Math.floor(durationMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    }
    return `${minutes}m`;
  };
  
  const handleNewRide = () => {
    clearRide();
    navigate("/");
  };

  return (
    <div className="app-container">
      <div className="flex flex-col items-center justify-center my-8">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="page-title text-center">Ride Completed Safely</h1>
        <p className="text-gray-600 text-center mb-8">
          Your ride has been marked as safe
        </p>
      </div>
      
      <div className="ride-card">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Ride Details:</p>
            <h2 className="text-lg font-semibold">{ride.description}</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4 py-2">
            <div>
              <p className="text-sm text-gray-500">Started</p>
              <p className="font-medium">{formatDate(ride.startTime)}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">Ended</p>
              <p className="font-medium">{ride.endTime ? formatDate(ride.endTime) : "Unknown"}</p>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-500">Duration</p>
            <p className="font-medium">{calculateDuration()}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Destination</p>
            <p className="font-medium">{ride.destination}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <Button onClick={handleNewRide} className="primary-button">
          Start a New Ride
        </Button>
      </div>
    </div>
  );
};

export default RideCompleted;
