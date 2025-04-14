import { useEffect, useRef, useState } from "react";

interface ParticleProps {
  x: number;
  y: number;
  size: number;
  color: string;
  speed: number;
  opacity: number;
}

const InteractiveBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [particles, setParticles] = useState<ParticleProps[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationRef = useRef<number>(0);
  const initialized = useRef(false);

  // Colors for mental wellness theme
  const colors = [
    "rgba(155, 135, 245, 0.4)", // wellness purple
    "rgba(180, 161, 244, 0.3)", // light wellness purple
    "rgba(61, 213, 152, 0.4)",  // mint green
    "rgba(111, 224, 224, 0.3)", // teal
    "rgba(126, 105, 171, 0.3)", // mid-purple
  ];

  // Create initial particles
  useEffect(() => {
    if (initialized.current) return;
    
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = Math.min(window.innerHeight * 0.8, 800);
        setDimensions({ width: canvas.width, height: canvas.height });
      }
    };

    // Initialize with the right dimensions
    handleResize();
    window.addEventListener("resize", handleResize);

    // Create the particles
    const initialParticles = [];
    const particleCount = Math.min(Math.max(window.innerWidth / 15, 20), 50);
    
    for (let i = 0; i < particleCount; i++) {
      initialParticles.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 20 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        speed: Math.random() * 0.2 + 0.1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
    
    setParticles(initialParticles);
    initialized.current = true;

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [dimensions.height, dimensions.width]);

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animation loop
  useEffect(() => {
    if (particles.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      setParticles((prevParticles) =>
        prevParticles.map((particle) => {
          // Calculate distance to mouse for interactive effect
          const dx = mousePosition.x - particle.x;
          const dy = mousePosition.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Add gentle float movement
          particle.y += Math.sin(Date.now() * 0.001 * particle.speed) * 0.5;
          particle.x += Math.cos(Date.now() * 0.001 * particle.speed) * 0.5;
          
          // Interactive mouse repulsion (gentle)
          if (distance < 300) {  // Increase the radius to 300
            const angle = Math.atan2(dy, dx);
            particle.x -= Math.cos(angle) * (300 - distance) * 0.1;  // Increase the multiplier to 0.1
            particle.y -= Math.sin(angle) * (300 - distance) * 0.1;  // Increase the multiplier to 0.1
          }
          
          
          // Keep particles within bounds
          if (particle.x < 0) particle.x = canvas.width;
          if (particle.x > canvas.width) particle.x = 0;
          if (particle.y < 0) particle.y = canvas.height;
          if (particle.y > canvas.height) particle.y = 0;
          
          // Draw the particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
          
          return particle;
        })
      );
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => cancelAnimationFrame(animationRef.current);
  }, [mousePosition, particles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full -z-10 opacity-80"
    />
  );
};

export default InteractiveBackground;
