import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";

export const Hero = ({ user }) => {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-16 md:py-24">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter mb-6 text-white leading-tight">
            Build Discord servers
            <br />
            <span className="gradient-text">in seconds</span>
          </h1>
          <p className="max-w-xl mx-auto md:mx-0 text-lg sm:text-xl md:text-2xl text-gray-400 mb-8">
            AI-powered Discord bot that creates, manages, and optimizes your servers with intelligent automation. 10x faster than manual setup.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <a
              href={user ? "/dashboard" : "/auth"}
              className="bg-gray-700 text-white text-lg font-semibold py-3 px-8 rounded-full border border-border transition-all duration-200 hover:bg-gray-600 w-full sm:w-auto"
            >
              Open Dashboard
            </a>
            <p className="text-sm text-gray-500 mt-2 sm:mt-0">
              No credit card required.
              <br />
              Setup in 30 seconds.
            </p>
          </div>

          {/* Trust indicators for tablet/desktop */}
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-400 justify-center md:justify-start flex-wrap mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center">
                <CheckCircle className="h-2.5 w-2.5 text-white" />
              </div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center">
                <CheckCircle className="h-2.5 w-2.5 text-white" />
              </div>
              <span>Get started for free</span>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0">
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl" style={{ transform: 'translateZ(0)' }}>
            <video
              className="w-full h-full object-cover"
              src="hero-video.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
