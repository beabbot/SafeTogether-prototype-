
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCompanionRequest, getCompanionMatch } from "@/lib/companionStore";
import { CompanionRequest } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Clock, User, Check } from "lucide-react";

const WaitingForMatch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const requestId = location.state?.requestId;
  
  const [request, setRequest] = useState<CompanionRequest | null>(null);
  const [isMatched, setIsMatched] = useState(false);
  
  useEffect(() => {
    if (!requestId) {
      navigate("/");
      return;
    }
    
    const checkRequest = () => {
      const currentRequest = getCompanionRequest(requestId);
      if (!currentRequest) {
        navigate("/");
        return;
      }
      
      setRequest(currentRequest);
      
      // Check if a match has been made
      const match = getCompanionMatch(requestId);
      if (match) {
        setIsMatched(true);
        navigate(`/connection/${requestId}`, { state: { isRequester: true } });
      }
    };
    
    checkRequest();
    
    // Poll for updates every 5 seconds
    const interval = setInterval(checkRequest, 5000);
    
    return () => clearInterval(interval);
  }, [requestId, navigate]);
  
  if (!request) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-md mx-auto">
        <Card className="shadow-md">
          <CardHeader className="bg-accent rounded-t-lg">
            <CardTitle className="text-xl text-center">Waiting for a Companion</CardTitle>
            <CardDescription className="text-center">
              Someone will join you soon
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Your request is active. We'll notify you when someone offers to accompany you.
                </AlertDescription>
              </Alert>
              
              <Separator />
              
              <div>
                <h3 className="font-medium">Your Request Details:</h3>
                
                <div className="mt-3 space-y-3">
                  <div className="flex items-start">
                    <User className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                    <div>
                      <p className="font-medium">Name</p>
                      <p className="text-gray-600">{request.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                    <div>
                      <p className="font-medium">Route</p>
                      <p className="text-gray-600">From: {request.currentLocation}</p>
                      <p className="text-gray-600">To: {request.destination}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                    <div>
                      <p className="font-medium">Departure Time</p>
                      <p className="text-gray-600">{formatDate(request.departureTime)}</p>
                    </div>
                  </div>
                  
                  {request.notes && (
                    <div className="flex items-start">
                      <div>
                        <p className="font-medium">Notes</p>
                        <p className="text-gray-600">{request.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/")}
            >
              Cancel Request
            </Button>
            
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={() => navigate("/find-companion")}
            >
              Find Others to Help
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default WaitingForMatch;
