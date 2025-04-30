
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mt-2 text-gray-900">SafeTogether</h1>
          <p className="text-gray-600 mt-2">
            Travel safely with companions who care
          </p>
        </div>

        <div className="space-y-6">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-primary/10 rounded-t-lg">
              <CardTitle className="text-lg text-center">Need a Companion?</CardTitle>
              <CardDescription>
                Request someone to accompany you on your journey
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 mx-auto text-primary mb-4" />
              <p className="text-gray-600">
                Create a request for someone to walk or virtually accompany you to your destination
              </p>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => navigate("/request")}>
                Request Companion
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="bg-accent rounded-t-lg">
              <CardTitle className="text-lg text-center">Be a Companion</CardTitle>
              <CardDescription>
                Help someone feel safe on their journey
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 mx-auto text-primary mb-4" />
              <p className="text-gray-600">
                Browse active requests and offer to accompany someone to their destination
              </p>
            </CardContent>
            <CardFooter>
              <Button 
                variant="secondary" 
                className="w-full" 
                onClick={() => navigate("/find-companion")}
              >
                Find Someone to Help
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
