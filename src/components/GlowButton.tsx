import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface GlowButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'glass' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  isLoading?: boolean;
  ariaLabel?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }> | any;
}

export default function GlowButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  isLoading = false,
  ariaLabel,
  icon: Icon
}: GlowButtonProps) {
  const getStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-primary via-purple-600 to-accent text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_35px_rgba(236,72,153,0.5)] border border-white/10';
      case 'accent':
        return 'bg-gradient-to-r from-accent to-pink-600 text-white shadow-[0_0_20px_rgba(236,72,153,0.35)] hover:shadow-[0_0_35px_rgba(236,72,153,0.6)] border border-white/10';
      case 'secondary':
        return 'bg-white/5 border border-white/12 text-white hover:bg-white/10 hover:border-white/20';
      case 'glass':
        return 'bg-card-dark/60 backdrop-blur-xl border border-white/10 text-white/90 hover:text-white hover:border-primary/40 hover:bg-primary/10';
      case 'danger':
        return 'bg-rose-600/80 border border-rose-500/30 text-white hover:bg-rose-600 shadow-[0_0_15px_rgba(225,29,72,0.3)]';
      default:
        return '';
    }
  };

  const getSize = () => {
    switch (size) {
      case 'sm':
        return 'px-3.5 py-1.5 text-xs rounded-xl gap-1.5';
      case 'lg':
        return 'px-8 py-3.5 text-base rounded-2xl gap-3 font-semibold';
      case 'md':
      default:
        return 'px-6 py-2.5 text-sm rounded-xl gap-2 font-medium';
    }
  };

  return (
    <motion.button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      aria-label={ariaLabel}
      whileHover={disabled || isLoading ? undefined : { scale: 1.02, y: -1 }}
      whileTap={disabled || isLoading ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className={`
        relative cursor-pointer transition-all duration-200 
        flex items-center justify-center shrink-0
        disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none
        focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2
        ${getStyles()} 
        ${getSize()}
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <Loader2 size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="shrink-0" />}
          <span>{children}</span>
        </>
      )}
    </motion.button>
  );
}
