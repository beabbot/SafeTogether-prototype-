
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RideFormData } from "@/lib/types";
import { saveRide } from "@/lib/rideStore";
import { toast } from "sonner";

const RideForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RideFormData>({
    name: "",
    description: "",
    destination: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number format
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.emergencyContactPhone)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      saveRide(formData);
      toast.success("Ride started successfully");
      navigate("/ride-progress");
    } catch (error) {
      console.error("Error saving ride:", error);
      toast.error("Failed to start ride");
    }
  };

  return (
    <div className="app-container">
      <h1 className="page-title">Start a Safe Ride</h1>
      
      <div className="ride-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="form-label">Your Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              className="form-input"
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="form-label">Ride Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="E.g., Uber from downtown to home"
              required
              className="form-input min-h-[80px]"
            />
          </div>
          
          <div>
            <Label htmlFor="destination" className="form-label">Destination</Label>
            <Input
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              placeholder="Enter your destination"
              required
              className="form-input"
            />
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Emergency Contact</h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="emergencyContactName" className="form-label">Contact Name</Label>
                <Input
                  id="emergencyContactName"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleChange}
                  placeholder="Emergency contact name"
                  required
                  className="form-input"
                />
              </div>
              
              <div>
                <Label htmlFor="emergencyContactPhone" className="form-label">Contact Phone Number</Label>
                <Input
                  id="emergencyContactPhone"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleChange}
                  placeholder="Phone number with country code"
                  required
                  className="form-input"
                  type="tel"
                />
                <p className="text-xs text-gray-500 mt-1">Format: +1234567890</p>
              </div>
            </div>
          </div>
          
          <Button type="submit" size="lg" className="primary-button mt-6">
            Start Ride
          </Button>
        </form>
      </div>
      
      <p className="text-center text-sm text-gray-500 mt-4">
        Your information is stored only on this device
      </p>
    </div>
  );
};

export default RideForm;
