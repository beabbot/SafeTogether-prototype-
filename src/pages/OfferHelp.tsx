
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCompanionRequest, createCompanionMatch } from "@/lib/companionStore";
import { CompanionRequest } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { MapPin, Clock, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const OfferHelp = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [request, setRequest] = useState<CompanionRequest | null>(null);
  const [companionName, setCompanionName] = useState("");
  
  useEffect(() => {
    if (!requestId) {
      navigate("/find-companion");
      return;
    }
    
    const currentRequest = getCompanionRequest(requestId);
    if (!currentRequest) {
      toast({
        title: "Request not found",
        description: "This companion request may have been cancelled or fulfilled.",
        variant: "destructive"
      });
      navigate("/find-companion");
      return;
    }
    
    if (currentRequest.status === "matched") {
      toast({
        title: "Request already matched",
        description: "Someone has already offered to accompany this person.",
        variant: "destructive"
      });
      navigate("/find-companion");
      return;
    }
    
    setRequest(currentRequest);
  }, [requestId, navigate, toast]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!requestId || !companionName.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter your name.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const match = createCompanionMatch(requestId, companionName);
      toast({
        title: "Connection successful",
        description: `You are now connected with ${match.requestName}.`
      });
      navigate(`/connection/${requestId}`, { state: { isRequester: false } });
    } catch (error) {
      toast({
        title: "Error creating connection",
        description: "There was a problem connecting with this request. Please try again.",
        variant: "destructive"
      });
    }
  };
  
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
            <CardTitle className="text-xl text-center">Offer to Help</CardTitle>
            <CardDescription className="text-center">
              Accompany {request.name} on her journey
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6 space-y-6">
            <Alert>
              <AlertDescription>
                By offering to help, you'll be connected with {request.name} so you can accompany her safely.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <h3 className="font-medium">Request Details:</h3>
              
              <div className="space-y-3">
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
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="companionName">Your Name</Label>
                  <Input 
                    id="companionName"
                    value={companionName}
                    onChange={(e) => setCompanionName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </form>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-2">
            <Button 
              onClick={handleSubmit}
              className="w-full"
            >
              Join Her
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate("/find-companion")}
            >
              Back to List
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default OfferHelp;
