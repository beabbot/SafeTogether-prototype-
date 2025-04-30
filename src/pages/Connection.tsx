
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getCompanionMatch, getCompanionRequest, addMessageToMatch } from "@/lib/companionStore";
import { CompanionMatch, CompanionRequest, Message } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Send, ShieldCheck, Check, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const Connection = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isRequester = location.state?.isRequester === true;
  
  const [match, setMatch] = useState<CompanionMatch | null>(null);
  const [request, setRequest] = useState<CompanionRequest | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  
  useEffect(() => {
    if (!requestId) {
      navigate("/");
      return;
    }
    
    const loadData = () => {
      const currentMatch = getCompanionMatch(requestId);
      const currentRequest = getCompanionRequest(requestId);
      
      if (!currentMatch || !currentRequest) {
        toast({
          title: "Connection not found",
          description: "This connection may have been cancelled.",
          variant: "destructive"
        });
        navigate("/");
        return;
      }
      
      setMatch(currentMatch);
      setRequest(currentRequest);
      setMessages(currentMatch.messages);
    };
    
    loadData();
    
    // Poll for updates every 3 seconds
    const interval = setInterval(loadData, 3000);
    
    return () => clearInterval(interval);
  }, [requestId, navigate, toast]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!requestId || !message.trim()) return;
    
    const newMessage = addMessageToMatch(
      requestId,
      message.trim(),
      !isRequester
    );
    
    if (newMessage) {
      setMessage("");
      setMessages(prevMessages => [...prevMessages, newMessage]);
    }
  };
  
  if (!match || !request) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-md mx-auto">
        <Card className="shadow-md">
          <CardHeader className="bg-primary text-white rounded-t-lg">
            <div className="flex items-center justify-center mb-2">
              <ShieldCheck className="h-6 w-6 mr-2" />
              <CardTitle className="text-xl">Connected</CardTitle>
            </div>
            <CardDescription className="text-center text-white/80">
              {isRequester ? `${match.companionName} will accompany you` : `You are accompanying ${match.requestName}`}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6 space-y-6">
            <div className="p-3 bg-accent rounded-lg">
              <div className="flex items-center justify-center">
                <Check className="h-5 w-5 text-green-600 mr-2" />
                <p className="text-sm font-medium">
                  You are now connected with {isRequester ? match.companionName : match.requestName}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium">Journey Details:</h3>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <User className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  <div>
                    <p className="font-medium">Requester</p>
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
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="font-medium">Messages:</h3>
              
              <div className="bg-gray-50 rounded-lg p-3 max-h-60 overflow-y-auto space-y-3">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm">No messages yet</p>
                ) : (
                  messages.map((msg) => (
                    <div 
                      key={msg.id}
                      className={`flex ${msg.senderName === (isRequester ? match.requestName : match.companionName) ? 'justify-start' : 'justify-end'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-2 ${
                          msg.senderName === (isRequester ? match.requestName : match.companionName)
                            ? 'bg-gray-200 text-gray-800' 
                            : 'bg-primary text-white'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs text-right mt-1 opacity-70">{formatMessageTime(msg.timestamp)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-grow"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center pt-2">
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="w-full"
            >
              Back to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Connection;
