
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <ShieldCheck className="h-16 w-16 text-primary mb-4" />
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Page Not Found</h1>
      <p className="text-lg text-gray-600 mb-6 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button onClick={() => navigate("/")} size="lg">
        Return to Home
      </Button>
    </div>
  );
};

export default NotFound;
