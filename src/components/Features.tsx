import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BotFeature, RoadmapFeature } from '@/data/features';
import { ChevronRight } from 'lucide-react';

interface FeaturesProps {
  liveFeatures: BotFeature[];
  roadmapFeatures: RoadmapFeature[];
}

const SHOW_MORE_STEP = 6;

export const Features: React.FC<FeaturesProps> = ({ liveFeatures, roadmapFeatures }) => {
  const [liveCount, setLiveCount] = useState(SHOW_MORE_STEP);
  const [roadmapCount, setRoadmapCount] = useState(SHOW_MORE_STEP);

  const handleLiveClick = () => {
    setLiveCount(prev => prev >= liveFeatures.length ? SHOW_MORE_STEP : prev + SHOW_MORE_STEP);
  };

  const handleRoadmapClick = () => {
    setRoadmapCount(prev => prev >= roadmapFeatures.length ? SHOW_MORE_STEP : prev + SHOW_MORE_STEP);
  };

  return (
    <section className="w-full pt-16 sm:pt-20 lg:pt-24 pb-6 sm:pb-8 lg:pb-10 bg-black">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Powerful Features for Every Server
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            BuildForMe offers comprehensive Discord server management tools that scale with your community needs
          </p>
        </div>

        {/* Live Features Section */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveFeatures.slice(0, liveCount).map((feature, index) => (
              <Card key={index} className="shadow-sm transition-all duration-200 hover:shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    <feature.icon className="inline-block mr-2 h-5 w-5 align-[-0.1em] text-blue-400" />
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {liveFeatures.length > SHOW_MORE_STEP && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleLiveClick}
                variant="ghost"
                size="sm"
                className="gap-2 text-gray-300 hover:text-white hover:bg-transparent"
              >
                {liveCount >= liveFeatures.length ? 'Show less' : 'Show more'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Roadmap Section */}
        <div className="mb-0">
          <div className="text-center mb-12">
            <h3 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Future Roadmap Features
            </h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              These features are part of our development roadmap. Timeline and implementation may vary based on user feedback and technical feasibility.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {roadmapFeatures.slice(0, roadmapCount).map((feature, index) => (
              <Card key={index} className="shadow-sm transition-all duration-200 hover:shadow-md">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    <feature.icon className="inline-block mr-2 h-5 w-5 align-[-0.1em] text-purple-400" />
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {roadmapFeatures.length > SHOW_MORE_STEP && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleRoadmapClick}
                variant="ghost"
                size="sm"
                className="gap-2 text-gray-300 hover:text-white hover:bg-transparent"
              >
                {roadmapCount >= roadmapFeatures.length ? 'Show less' : 'Show more'}
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}; 