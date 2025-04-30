
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCompanionRequest, hasActiveRequest } from "@/lib/companionStore";
import { CompanionRequestFormData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MapPin } from "lucide-react";

const RequestCompanion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<CompanionRequestFormData>({
    name: "",
    currentLocation: "",
    destination: "",
    departureTime: new Date().toISOString().slice(0, 16),
    notes: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.name || !formData.currentLocation || !formData.destination || !formData.departureTime) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if user already has an active request
    if (hasActiveRequest(formData.name)) {
      toast({
        title: "Request already exists",
        description: "You already have an active companion request.",
        variant: "destructive"
      });
      return;
    }
    
    // Create the request
    const newRequest = createCompanionRequest(formData);
    
    toast({
      title: "Request submitted",
      description: "Your companion request has been submitted successfully."
    });
    
    // Navigate to waiting page
    navigate("/waiting", { state: { requestId: newRequest.id } });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-md mx-auto">
        <Card className="shadow-md">
          <CardHeader className="bg-primary/10 rounded-t-lg">
            <CardTitle className="text-xl text-center text-primary">Request a Companion</CardTitle>
            <CardDescription className="text-center">
              Find someone to accompany you on your journey
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
                <Input 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentLocation">Current Location *</Label>
                <div className="relative">
                  <Input 
                    id="currentLocation"
                    name="currentLocation"
                    value={formData.currentLocation}
                    onChange={handleChange}
                    placeholder="Enter your current location"
                    className="pl-9"
                    required
                  />
                  <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="destination">Destination *</Label>
                <div className="relative">
                  <Input 
                    id="destination"
                    name="destination"
                    value={formData.destination}
                    onChange={handleChange}
                    placeholder="Where are you going?"
                    className="pl-9"
                    required
                  />
                  <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="departureTime">Departure Time *</Label>
                <Input 
                  id="departureTime"
                  name="departureTime"
                  type="datetime-local"
                  value={formData.departureTime}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea 
                  id="notes"
                  name="notes"
                  value={formData.notes || ""}
                  onChange={handleChange}
                  placeholder="Add any additional details about your journey..."
                  rows={3}
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button type="submit" className="w-full">
                Request Companion
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RequestCompanion;
