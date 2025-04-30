
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RideData } from "@/lib/types";
import { getCurrentRide, updateRideLocation } from "@/lib/rideStore";
import { toast } from "sonner";
import { AlertTriangle, MapPin, Send } from "lucide-react";

const RideProgress = () => {
  const navigate = useNavigate();
  const [ride, setRide] = useState<RideData | null>(null);
  const [locationLink, setLocationLink] = useState("");
  const [sosSent, setSosSent] = useState(false);
  
  useEffect(() => {
    const currentRide = getCurrentRide();
    if (!currentRide) {
      navigate("/");
      return;
    }
    
    setRide(currentRide);
    setLocationLink(currentRide.locationLink || "");
  }, [navigate]);
  
  if (!ride) {
    return <div className="app-container"><p>Loading ride details...</p></div>;
  }
  
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleLocationUpdate = () => {
    if (!locationLink.trim()) {
      toast.error("Please enter a location link");
      return;
    }
    
    if (!locationLink.includes("maps.google.com") && !locationLink.includes("maps.app.goo.gl")) {
      toast.error("Please enter a valid Google Maps link");
      return;
    }
    
    const updatedRide = updateRideLocation(locationLink);
    if (updatedRide) {
      setRide(updatedRide);
      toast.success("Location updated successfully");
    }
  };
  
  const sendSOS = () => {
    if (!ride.locationLink) {
      toast.error("Please update your location before sending SOS");
      return;
    }
    
    // In a real app, this would connect to Zapier or another service to send SMS
    const sosMessage = `🚨 ${ride.name} triggered an SOS during a ride. Live location: ${ride.locationLink}. Ride Description: ${ride.description}. Please check in with them now.`;
    
    console.log("SOS Message:", sosMessage);
    console.log("Would send to:", ride.emergencyContactPhone);
    
    // For the MVP, just show a toast that the SOS would be sent
    toast.info(
      <div>
        <p className="font-bold mb-2">SOS Alert Triggered</p>
        <p className="text-sm">In a connected app, this would send the following message to {ride.emergencyContactName}:</p>
        <p className="text-xs mt-2 p-2 bg-gray-100 rounded">{sosMessage}</p>
      </div>,
      { duration: 8000 }
    );
    
    setSosSent(true);
    
    setTimeout(() => {
      setSosSent(false);
    }, 5000);
  };
  
  const handleCompleteRide = () => {
    navigate("/ride-completed");
  };

  return (
    <div className="app-container">
      <h1 className="page-title">Ride in Progress</h1>
      
      <div className="ride-card">
        <div className="flex flex-col space-y-2 mb-4">
          <h2 className="text-lg font-semibold">{ride.name}'s Ride</h2>
          <p className="text-sm text-gray-500">Started at {formatTime(ride.startTime)}</p>
        </div>
        
        <div className="space-y-4 mb-6">
          <div>
            <p className="text-sm font-medium">Description:</p>
            <p className="text-gray-700">{ride.description}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium">Destination:</p>
            <p className="text-gray-700">{ride.destination}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium">Emergency Contact:</p>
            <p className="text-gray-700">{ride.emergencyContactName} ({ride.emergencyContactPhone})</p>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-4 mb-6">
          <Label htmlFor="locationLink" className="form-label flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            Update Your Live Location
          </Label>
          
          <div className="flex gap-2 mt-1">
            <Input
              id="locationLink"
              value={locationLink}
              onChange={(e) => setLocationLink(e.target.value)}
              placeholder="Paste Google Maps live location link"
              className="form-input flex-1"
            />
            <Button 
              onClick={handleLocationUpdate}
              size="sm" 
              className="bg-secondary hover:bg-secondary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-xs text-gray-500 mt-1">
            Open Google Maps → Your location → Share → Copy link
          </p>
        </div>
        
        <div className="flex flex-col gap-4">
          <Button
            className={`sos-button ${sosSent ? "animate-pulse" : ""}`}
            onClick={sendSOS}
            disabled={sosSent}
          >
            <AlertTriangle className="mr-2" size={20} />
            {sosSent ? "SOS Alert Sent" : "Send SOS Alert"}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleCompleteRide}
            className="w-full py-3"
          >
            Mark Ride as Safe
          </Button>
        </div>
      </div>
      
      <p className="text-center text-sm text-gray-500 mt-4">
        {ride.locationLink ? 
          "Your location is updated and ready for emergency sharing" :
          "Please update your location for emergency sharing"
        }
      </p>
    </div>
  );
};

export default RideProgress;
