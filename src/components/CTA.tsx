import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Settings } from "lucide-react";

interface CTAProps {
  user?: any;
}

export const CTA: React.FC<CTAProps> = ({ user }) => {
  return (
    <section className="relative py-8 sm:py-12 lg:py-16 xl:py-20">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main CTA Headline with improved typography */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 lg:mb-8 tracking-tight leading-tight">
            Ready to transform your Discord server?
          </h2>
          
          {/* CTA Subtitle with better line height and spacing */}
          <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-gray-300 max-w-4xl mx-auto mb-6 sm:mb-8 lg:mb-10 leading-relaxed">
            Use BuildForMe to create 
            professional Discord communities in minutes, not hours.
          </p>
          
          {/* CTA Button with improved spacing and hover effects */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
            {user ? (
              <Button 
                asChild 
                size="lg"
                variant="neutral"
                className="text-lg w-auto"
                aria-label="Go to your BuildForMe dashboard"
              >
                <Link to="/dashboard">
                  Open Dashboard
                  <div className="w-5 h-5 bg-transparent rounded-lg flex items-center justify-center ml-2">
                    <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </Button>
            ) : (
              <Button 
                asChild 
                size="lg"
                variant="neutral"
                className="text-lg w-auto"
                aria-label="Get started with BuildForMe for free"
              >
                <Link to="/auth">
                  Get Started Free
                  <ArrowRight className="ml-3 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}; 