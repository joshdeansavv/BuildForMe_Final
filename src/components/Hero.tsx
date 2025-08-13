import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { CheckCircle, Star, Users, Server, Settings, Sparkles } from "lucide-react";
import { DemoPlayer } from "@/components/DemoPlayer";

interface HeroProps {
  user?: any;
  serverCount?: number;
  userCount?: number;
  uptime?: number;
}

export const Hero: React.FC<HeroProps> = ({ 
  user, 
  serverCount = 0, 
  userCount = 0, 
  uptime = 0 
}) => {
  return (
    <section className="relative py-10 sm:py-14 lg:py-18 xl:py-20">
      {/* Subtle radial backdrop for depth */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.20),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.18),transparent_50%)]" />
      </div>
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 xl:gap-20 items-center">
            {/* Left Column - Hero Content */}
            <div className="text-center lg:text-left lg:col-span-6 lg:flex lg:flex-col lg:justify-center lg:pr-8 xl:pr-10">
              <div className="space-y-3 lg:space-y-4">
                {/* Hero Headline with modern, clean styling */}
                <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight leading-tight">
                  <span className="block sm:whitespace-nowrap md:whitespace-nowrap">Build Communities</span>
                  <span className="block text-white">in Seconds</span>
                </h1>
                
                {/* Hero Subtitle with better line height and spacing */}
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Build smarter communities with an AI co-admin that sets up, protects, and grows your server — in seconds.
                </p>

                {/* CTA Section - Desktop */}
                <div className="hidden lg:block space-y-8">
                  {/* Primary CTA Button */}
                  <div>
                    {user ? (
                      <Button 
                        asChild 
                        size="lg"
                        variant="neutral"
                        className="text-lg"
                        aria-label="Open your BuildForMe dashboard"
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
                        className="text-lg"
                        aria-label="Add BuildForMe bot to your Discord server"
                      >
                        <Link to="/auth">
                          <div className="w-5 h-5 bg-transparent rounded-lg flex items-center justify-center mr-3">
                            <svg className="h-3 w-3 text-white" viewBox="0 0 71 55" fill="currentColor">
                              <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"/>
                            </svg>
                          </div>
                          Add to Discord
                        </Link>
                      </Button>
                    )}
                  </div>
                  {/* Trust indicators for desktop */}
                  <div className="flex items-center gap-6 text-sm text-gray-400 mt-6">
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
              </div>
            </div>

            {/* Right Column - Demo Player */}
            <div className="relative mt-8 lg:mt-0 lg:col-span-6 lg:pl-8 xl:pl-10">
              <div className="relative rounded-3xl p-[2px] bg-gradient-to-br from-indigo-500/40 via-purple-500/35 to-fuchsia-500/40 shadow-[0_0_50px_-12px_rgba(139,92,246,0.45)]">
                <div className="rounded-3xl overflow-hidden bg-black/40 backdrop-blur-sm ring-1 ring-white/5">
                  <DemoPlayer demoSrc="/hero-video.mov" />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile CTA Section - Below video on mobile only */}
          <div className="lg:hidden mt-8 sm:mt-12 text-center space-y-6">
            {/* Primary CTA Button */}
            <div>
              {user ? (
                  <Button 
                  asChild 
                  size="lg"
                    variant="neutral"
                  className="text-lg"
                  aria-label="Open your BuildForMe dashboard"
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
                  className="text-lg"
                  aria-label="Add BuildForMe bot to your Discord server"
                >
                  <Link to="/auth">
                    <div className="w-5 h-5 bg-transparent rounded-lg flex items-center justify-center mr-3">
                      <svg className="h-3 w-3 text-white" viewBox="0 0 71 55" fill="currentColor">
                        <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"/>
                      </svg>
                    </div>
                    Add to Discord
                  </Link>
                </Button>
              )}
            </div>
            
            {/* Trust indicators for mobile/tablet */}
            <div className="flex items-center gap-6 text-sm text-gray-400 justify-center flex-wrap">
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
        </div>
      </div>
    </section>
  );
}; 