import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'glass' | 'success' | 'warning' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ComponentType<{ size?: number; className?: string }> | any;
  className?: string;
}

export default function Badge({
  children,
  variant = 'glass',
  size = 'md',
  icon: Icon,
  className = ''
}: BadgeProps) {
  const getStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary/15 text-purple-300 border-primary/30 shadow-[0_0_12px_rgba(168,85,247,0.15)]';
      case 'accent':
        return 'bg-accent/15 text-pink-300 border-accent/30 shadow-[0_0_12px_rgba(236,72,153,0.15)]';
      case 'success':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'warning':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'outline':
        return 'bg-transparent text-white/70 border-white/15';
      case 'glass':
      default:
        return 'bg-white/5 text-white/90 border-white/10 backdrop-blur-md';
    }
  };

  const getSize = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-0.5 text-[10px] gap-1';
      case 'lg':
        return 'px-3.5 py-1.5 text-xs gap-2 font-semibold';
      case 'md':
      default:
        return 'px-2.5 py-1 text-[11px] gap-1.5 font-medium';
    }
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full border transition-all duration-200 shrink-0
        ${getStyles()}
        ${getSize()}
        ${className}
      `}
    >
      {Icon && <Icon size={size === 'sm' ? 10 : size === 'lg' ? 14 : 12} className="shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
