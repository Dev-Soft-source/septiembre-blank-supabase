
import { useState, useEffect } from 'react';

export function HotelVideoPlayer() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Set loaded to true after a small delay to allow for rendering
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden shadow-xl border border-[#ad66a8]/30 bg-[#460F54]/20 backdrop-blur-sm relative hover:shadow-[0_0_25px_rgba(217,70,239,0.25)] transition-all duration-300 max-w-xl mx-auto sm:max-w-2xl md:max-w-xl px-2 sm:px-0">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-fuchsia-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <iframe
        className="w-full aspect-video"
        src="https://www.youtube.com/embed/NEn7uG_fb8M"
        title="Hotel-Living - Themed Hotels Experience"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => setIsLoaded(true)}
      ></iframe>
    </div>
  );
}
