
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export function Logo({ className }: { className?: string }) {
  const isMobile = useIsMobile();
  
  return (
    <Link 
      to="/" 
      className={className}
    >
      <div className="flex items-center gap-2">
        <img 
          src="/lovable-uploads/950ed52a-c737-4637-9751-d6f1db78b7b4.png" 
          alt="Hotel-Living Logo"
          loading="eager"
          className={isMobile ? "h-[77.57px]" : "h-[52px]"}
        />
      </div>
    </Link>
  );
}
