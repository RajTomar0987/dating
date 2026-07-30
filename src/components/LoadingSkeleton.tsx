import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'card' | 'circle' | 'text' | 'rect' | 'avatar';
  count?: number;
}

export default function LoadingSkeleton({ 
  className = '', 
  variant = 'text',
  count = 1
}: LoadingSkeletonProps) {
  const getBaseStyle = () => {
    switch (variant) {
      case 'avatar':
      case 'circle':
        return 'rounded-full';
      case 'card':
        return 'rounded-3xl h-48';
      case 'rect':
        return 'rounded-2xl';
      case 'text':
      default:
        return 'rounded-lg h-4';
    }
  };

  const renderSingle = (key: number) => (
    <div 
      key={key}
      className={`
        bg-white/[0.04] border border-white/5 relative overflow-hidden shimmer-bg
        ${getBaseStyle()}
        ${className}
      `}
    />
  );

  if (count > 1) {
    return (
      <div className="flex flex-col gap-3 w-full">
        {Array.from({ length: count }).map((_, i) => renderSingle(i))}
      </div>
    );
  }

  return renderSingle(0);
}
