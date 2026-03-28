
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export function HotelNotFound() {
  return (
    <div className="container max-w-6xl mx-auto text-center py-20 px-4">
      <h1 className="text-3xl font-bold mb-6">Hotel not found</h1>
      <p className="text-lg mb-6 text-gray-400">
        The hotel you are looking for may have been removed or is temporarily unavailable.
      </p>
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-fuchsia-400 hover:text-fuchsia-300 transition"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to hotels
      </Link>
    </div>
  );
}
