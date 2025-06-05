
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text }) => {
  let sizeClasses = '';
  switch (size) {
    case 'sm':
      sizeClasses = 'w-6 h-6 border-2';
      break;
    case 'md':
      sizeClasses = 'w-12 h-12 border-4';
      break;
    case 'lg':
      sizeClasses = 'w-20 h-20 border-[6px]';
      break;
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div
        className={`animate-spin rounded-full border-sky-500 border-t-transparent ${sizeClasses}`}
      ></div>
      {text && <p className="text-slate-300 mt-2">{text}</p>}
    </div>
  );
};
    