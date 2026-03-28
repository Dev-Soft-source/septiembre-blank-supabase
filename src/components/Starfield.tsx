
import { useEffect, useRef } from 'react';

export function Starfield() {
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
    const starCount = 800;
    const maxDepth = 1000;
    const speed = 1.2;
    
    // Color palette for stars
    const starColors = [
      'rgba(255, 255, 255, 0.9)',
      'rgba(183, 226, 240, 0.8)',
      'rgba(255, 233, 196, 0.7)',
      'rgba(231, 170, 231, 0.8)',
      'rgba(185, 248, 248, 0.7)',
      'rgba(250, 138, 138, 0.6)',
      'rgba(162, 255, 162, 0.7)',
      'rgba(255, 192, 203, 0.8)'
    ];
    
    // Generate random stars
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width - canvas.width / 2,
        y: Math.random() * canvas.height - canvas.height / 2,
        z: Math.random() * maxDepth,
        radius: 0.5 + Math.random() * 2,
        color: starColors[Math.floor(Math.random() * starColors.length)]
      });
    }
    
    // Animation function
    function animate() {
      if (!canvas || !context) return;
      
      requestAnimationFrame(animate);
      
      // Clear canvas with gradient background
      const gradient = context.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
      );
      gradient.addColorStop(0, 'rgba(80, 20, 120, 0.8)');
      gradient.addColorStop(0.5, 'rgba(60, 10, 90, 0.9)');
      gradient.addColorStop(1, 'rgba(40, 5, 60, 1)');
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw stars
      for (let i = 0; i < starCount; i++) {
        const star = stars[i];
        
        // Move star closer
        star.z -= speed;
        
        // Reset star if too close
        if (star.z <= 0) {
          star.z = maxDepth;
          star.x = Math.random() * canvas.width - canvas.width / 2;
          star.y = Math.random() * canvas.height - canvas.height / 2;
          star.color = starColors[Math.floor(Math.random() * starColors.length)];
        }
        
        // Calculate position with perspective
        const depth = star.z / maxDepth;
        const screenX = (star.x / depth) + canvas.width / 2;
        const screenY = (star.y / depth) + canvas.height / 2;
        
        // Calculate size based on depth
        const size = Math.max(0.1, (1 - depth) * star.radius * 3);
        const opacity = Math.max(0.1, 1 - depth);
        
        // Draw star with glow effect
        context.save();
        context.globalAlpha = opacity;
        context.fillStyle = star.color;
        context.shadowBlur = size * 2;
        context.shadowColor = star.color;
        context.beginPath();
        context.arc(screenX, screenY, size, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
    }
    
    animate();
    
    // Handle window resize
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{ background: 'linear-gradient(45deg, #2D1B69, #1A1F2C)', pointerEvents: 'none' }}
    />
  );
}
