import React from 'react';
import { Bot, Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'fullscreen';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'md',
  variant = 'default'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const containerClasses = {
    default: 'flex flex-col items-center justify-center p-8 space-y-4',
    minimal: 'flex items-center space-x-2',
    fullscreen: 'fixed inset-0 bg-discord-darker/80 backdrop-blur-sm flex flex-col items-center justify-center z-50'
  };

  if (variant === 'minimal') {
    return (
      <div className={containerClasses[variant]}>
        <Loader2 className={`${sizeClasses[size]} text-discord-blurple animate-spin`} />
        {message && <span className="text-discord-light text-sm">{message}</span>}
      </div>
    );
  }

  if (variant === 'fullscreen') {
    return (
      <div className={containerClasses[variant]}>
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 bg-discord-gradient rounded-full flex items-center justify-center animate-pulse">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-discord-blurple animate-spin"></div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-white">{message}</h3>
            <p className="text-discord-light">Please wait while we load your data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClasses[variant]}>
      <div className="relative">
        <div className="w-12 h-12 bg-discord-gradient rounded-full flex items-center justify-center animate-glow">
          <Bot className="h-6 w-6 text-white animate-float" />
        </div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-discord-blurple animate-spin"></div>
      </div>
      <div className="text-center space-y-1">
        <p className="text-white font-medium">{message}</p>
        <div className="flex space-x-1 justify-center">
          <div className="w-2 h-2 bg-discord-blurple rounded-full animate-pulse" style={{animationDelay: '0ms'}}></div>
          <div className="w-2 h-2 bg-discord-blurple rounded-full animate-pulse" style={{animationDelay: '150ms'}}></div>
          <div className="w-2 h-2 bg-discord-blurple rounded-full animate-pulse" style={{animationDelay: '300ms'}}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 