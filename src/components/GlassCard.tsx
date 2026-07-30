import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'interactive' | 'glow' | 'subtle';
  animate?: any;
  initial?: any;
  transition?: any;
  role?: string;
  ariaLabel?: string;
  enable3DTilt?: boolean;
}

export default function GlassCard({ 
  children, 
  className = '', 
  hoverEffect = true,
  onClick,
  variant = 'default',
  animate,
  initial,
  transition,
  role,
  ariaLabel,
  enable3DTilt = true
}: GlassCardProps) {

  const getVariantStyles = () => {
    switch (variant) {
      case 'interactive':
        return 'bg-card-dark/60 backdrop-blur-2xl border-white/10 shadow-2xl';
      case 'glow':
        return 'bg-card-dark/70 backdrop-blur-2xl border-primary/30 shadow-[0_0_30px_rgba(168,85,247,0.15)]';
      case 'subtle':
        return 'bg-white/[0.02] backdrop-blur-xl border-white/5 shadow-lg';
      case 'default':
      default:
        return 'bg-card-dark/50 backdrop-blur-2xl border-white/8 shadow-2xl';
    }
  };

  return (
    <motion.div
      onClick={onClick}
      role={role || (onClick ? 'button' : undefined)}
      aria-label={ariaLabel}
      tabIndex={onClick ? 0 : undefined}
      initial={initial}
      animate={animate}
      transition={transition || { duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hoverEffect ? { 
        rotateX: enable3DTilt ? 4 : 0, 
        rotateY: enable3DTilt ? -6 : 0, 
        z: enable3DTilt ? 20 : 0,
        borderColor: 'rgba(168, 85, 247, 0.4)', 
        backgroundColor: 'rgba(16, 16, 28, 0.75)',
        boxShadow: '0 30px 60px -15px rgba(168, 85, 247, 0.25), 0 0 30px rgba(236, 72, 153, 0.2)'
      } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={`
        rounded-3xl border transition-colors relative overflow-hidden preserve-3d perspective-1200
        ${getVariantStyles()}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {/* Specular Light Accent Reflection */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-gradient-to-br from-white/10 to-transparent rounded-full filter blur-xl pointer-events-none" />
      
      {children}
    </motion.div>
  );
}
