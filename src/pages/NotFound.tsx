
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Compass, ChevronLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16">
        <div className="container max-w-xl mx-auto px-4 py-24 text-center">
          <div className="w-24 h-24 rounded-full bg-fuchsia-500/20 flex items-center justify-center mx-auto mb-8">
            <Compass className="w-12 h-12 text-fuchsia-400" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient glow">404</h1>
          <p className="text-xl md:text-2xl font-medium mb-8">Page not found</p>
          <p className="text-foreground/80 mb-10">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          
          <Link to="/" className="inline-flex items-center gap-2 py-3 px-6 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-colors">
            <ChevronLeft className="w-5 h-5" />
            Return to Home
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
