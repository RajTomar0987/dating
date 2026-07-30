import React from 'react';

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-xl ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 border border-white/10 flex items-center justify-center mb-4 text-primary shadow-[0_0_30px_rgba(168,85,247,0.2)]">
        <Icon size={32} className="text-accent" />
      </div>
      <h3 className="text-lg font-bold text-white mb-2 font-display">{title}</h3>
      <p className="text-xs md:text-sm text-white/50 max-w-md leading-relaxed mb-6 font-sans">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-medium text-xs shadow-lg hover:shadow-primary/30 transition-all cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
