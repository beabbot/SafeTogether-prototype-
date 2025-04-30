
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWaitingCompanionRequests } from "@/lib/companionStore";
import { CompanionRequest } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MapPin, Clock, User } from "lucide-react";

const FindCompanion = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<CompanionRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<CompanionRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    // Load all waiting requests
    const loadRequests = () => {
      const allRequests = getWaitingCompanionRequests();
      setRequests(allRequests);
      setFilteredRequests(allRequests);
    };
    
    loadRequests();
    
    // Poll for updates every 5 seconds
    const interval = setInterval(loadRequests, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // Filter requests based on search term
    const filtered = requests.filter(request => 
      request.currentLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRequests(filtered);
  }, [searchTerm, requests]);
  
  const handleOfferHelp = (requestId: string) => {
    navigate(`/offer-help/${requestId}`);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-md mx-auto">
        <Card className="shadow-md mb-6">
          <CardHeader className="bg-accent rounded-t-lg">
            <CardTitle className="text-xl text-center">Find Someone to Help</CardTitle>
            <CardDescription className="text-center">
              Offer to accompany someone on their journey
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="Search by location or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                {filteredRequests.length} {filteredRequests.length === 1 ? "person" : "people"} looking for companions
              </div>
            </div>
          </CardContent>
        </Card>
        
        {filteredRequests.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            <p>No active companion requests at the moment.</p>
            <Button 
              variant="link" 
              onClick={() => navigate("/")}
              className="mt-2"
            >
              Make your own request
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card key={request.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <User className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                      <div>
                        <p className="font-medium">{request.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-600">From: {request.currentLocation}</p>
                        <p className="text-sm text-gray-600">To: {request.destination}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                      <div>
                        <p className="text-sm text-gray-600">{formatDate(request.departureTime)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="pt-0">
                  <Button 
                    className="w-full"
                    onClick={() => handleOfferHelp(request.id)}
                  >
                    Join Her
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
        
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Request Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FindCompanion;
