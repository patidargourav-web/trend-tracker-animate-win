
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Weight } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-6">
        <div className="mb-6 flex justify-center">
          <Weight className="h-16 w-16 text-theme-purple animate-pulse" />
        </div>
        <h1 className="text-6xl font-bold mb-4 text-theme-purple">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Oops! This page doesn't exist
        </p>
        <Button 
          asChild 
          size="lg" 
          className="bg-theme-purple hover:bg-theme-purple/90"
        >
          <a href="/">Back to Dashboard</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
