import React from 'react';

interface DemoPlayerProps {
  demoSrc?: string;
}

export const DemoPlayer: React.FC<DemoPlayerProps> = ({ demoSrc }) => {
  return (
    <div className="w-full">
      {demoSrc ? (
        <div className="relative w-full aspect-video overflow-hidden bg-black will-change-transform">
          <video
            className="absolute inset-0 w-full h-full object-cover block align-top mb-[-1px] [clip-path:inset(0_0_1px_0)]"
            muted
            autoPlay
            loop
            playsInline
            aria-label="BuildForMe demo video showing the bot in action"
          >
            <source src="/hero-video.webm" type="video/webm" />
            <source src="/hero-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : (
        <div className="relative w-full aspect-video overflow-hidden bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-brand rounded-full flex items-center justify-center mx-auto animate-pulse">
              <svg className="h-8 w-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <div className="space-y-2">
              <h3 className="text-white font-semibold">Watch Demo</h3>
              <p className="text-gray-400 text-sm">See BuildForMe in action</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 