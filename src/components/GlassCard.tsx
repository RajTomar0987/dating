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
  ariaLabel
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
      transition={transition || { duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      whileHover={hoverEffect ? { 
        y: -3, 
        borderColor: 'rgba(168, 85, 247, 0.35)', 
        backgroundColor: 'rgba(16, 16, 28, 0.7)',
        boxShadow: '0 20px 45px -10px rgba(168, 85, 247, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)'
      } : undefined}
      whileTap={onClick ? { scale: 0.99 } : undefined}
      className={`
        rounded-[24px] border overflow-hidden transition-all duration-300
        ${getVariantStyles()}
        ${onClick ? 'cursor-pointer focus-visible:outline-2 focus-visible:outline-primary' : ''} 
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
