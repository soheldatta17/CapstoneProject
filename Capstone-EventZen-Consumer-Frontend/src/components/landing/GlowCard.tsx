import { motion } from "framer-motion";
import { useRef, useState, useCallback } from "react";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowClassName?: string;
}

const GlowCard = ({ children, className = "", glowClassName = "" }: GlowCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative rounded-2xl group ${className}`}
    >
      {/* Animated gradient border */}
      <div
        className={`absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[1px] ${glowClassName}`}
        style={{
          background: isHovered
            ? `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, hsl(var(--primary) / 0.4), hsl(var(--primary) / 0.1) 40%, transparent 70%)`
            : "none",
        }}
      />

      {/* Sharper border overlay */}
      <div
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: isHovered
            ? `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, hsl(var(--primary) / 0.25), transparent 50%)`
            : "none",
        }}
      />

      {/* Spotlight effect on card surface */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
        style={{
          background: isHovered
            ? `radial-gradient(350px circle at ${mousePosition.x}px ${mousePosition.y}px, hsl(var(--primary) / 0.06), transparent 60%)`
            : "none",
        }}
      />

      {/* Card content */}
      <div className="relative bg-card rounded-2xl z-[1] h-full">
        {children}
      </div>
    </motion.div>
  );
};

export default GlowCard;
