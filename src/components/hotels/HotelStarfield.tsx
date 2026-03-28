
import { useEffect, useRef } from 'react';

export function HotelStarfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const context = canvas.getContext('2d');
    if (!context) return;
    
    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Star properties
    const stars: {x: number; y: number; z: number; radius: number; color: string}[] = [];
    const starCount = 500; // Number of stars
    const maxDepth = 1000; // Maximum depth
    const speed = 0.6; // Speed increased by 20% (from 0.5 to 0.6)
    
    // Color palette for stars - slightly brighter colors
    const starColors = [
      'rgba(255, 255, 255, 0.95)', // White - slightly brighter
      'rgba(183, 226, 240, 0.95)', // Light blue - slightly brighter
      'rgba(255, 233, 196, 0.95)', // Light orange - slightly brighter
      'rgba(231, 170, 231, 0.95)', // Plum - slightly brighter
      'rgba(185, 248, 248, 0.95)', // Pale turquoise - slightly brighter
      'rgba(250, 138, 138, 0.95)', // Light coral - slightly brighter
      'rgba(162, 255, 162, 0.95)', // Pale green - slightly brighter
      'rgba(255, 192, 203, 0.95)'  // Light pink - slightly brighter
    ];
    
    // Generate random stars
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * maxDepth,
        radius: 1 + Math.random() * 1.5,
        color: starColors[Math.floor(Math.random() * starColors.length)]
      });
    }
    
    // Create radial gradient for central light source
    function drawCentralGlow(ctx: CanvasRenderingContext2D) {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.4;
      
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      );
      
      // Very subtle gradient - slightly lighter in the center
      gradient.addColorStop(0, 'rgba(90, 30, 120, 0.25)');
      gradient.addColorStop(0.5, 'rgba(80, 20, 110, 0.15)');
      gradient.addColorStop(1, 'rgba(60, 6, 90, 0.05)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Animation function
    function animate() {
      requestAnimationFrame(animate);
      
      // Changed to slightly lighter rich purple background color
      context.fillStyle = 'rgba(65, 12, 95, 0.2)'; // Slightly lighter than before
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw the subtle central glow
      drawCentralGlow(context);
      
      // Update and draw stars
      for (let i = 0; i < starCount; i++) {
        const star = stars[i];
        
        // Move star closer (decrease z)
        star.z -= speed;
        
        // Reset star to far distance if it gets too close
        if (star.z <= 0) {
          star.z = maxDepth;
          star.x = Math.random() * canvas.width - canvas.width / 2;
          star.y = Math.random() * canvas.height - canvas.height / 2;
          // Assign a new random color when star resets
          star.color = starColors[Math.floor(Math.random() * starColors.length)];
        }
        
        // Calculate star position with perspective
        const depth = star.z / maxDepth;
        const screenX = (star.x / depth) + canvas.width / 2;
        const screenY = (star.y / depth) + canvas.height / 2;
        
        // Calculate star size based on depth
        const size = Math.max(0.5, (1 - depth) * star.radius * 2);
        
        // Draw star
        context.fillStyle = star.color;
        context.beginPath();
        context.arc(screenX, screenY, size, 0, Math.PI * 2);
        context.fill();
      }
    }
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-1]"
      style={{ background: 'rgb(65, 15, 82)', pointerEvents: 'none' }} // Slightly lighter background
    />
  );
}
