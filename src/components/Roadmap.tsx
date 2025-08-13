import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoadmapFeature } from '@/data/features';
import { 
  ChevronDown, 
  ChevronRight, 
  AlertTriangle, 
  Zap, 
  Globe, 
  BarChart3,
  Brain,
  GitBranch,
  Webhook,
  MessageSquare,
  Eye,
  Heart,
  Palette,
  Image,
  Mic,
  Bell,
  Crown
} from "lucide-react";

interface RoadmapProps {
  features: RoadmapFeature[];
}

const categoryIcons = {
  ai: Brain,
  integration: Globe,
  automation: Zap,
  analytics: BarChart3
};

const categoryColors = {
  ai: "bg-purple-600/20 text-purple-400 border-purple-500/30",
  integration: "bg-blue-600/20 text-blue-400 border-blue-500/30",
  automation: "bg-green-600/20 text-green-400 border-green-500/30",
  analytics: "bg-orange-600/20 text-orange-400 border-orange-500/30"
};

const statusColors = {
  planned: "bg-gray-600/20 text-gray-400 border-gray-500/30",
  'in-development': "bg-yellow-600/20 text-yellow-400 border-yellow-500/30",
  beta: "bg-blue-600/20 text-blue-400 border-blue-500/30"
};

export const Roadmap: React.FC<RoadmapProps> = ({ features }) => {
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    ai: true,
    integration: true,
    automation: true,
    analytics: true
  });

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const groupedFeatures = features.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as { [key: string]: RoadmapFeature[] });

  return (
    <section className="py-16 sm:py-20 lg:py-24 xl:py-28">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              What We're <span className="gradient-text">Working On</span>
            </h2>
            <p className="text-gray-400 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
              Exciting new features we're developing to make Discord server management even more powerful
            </p>
            
            {/* Important Disclaimer */}
            <Card className="bg-amber-900/20 border-amber-500/30 max-w-4xl mx-auto mb-8">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-6 w-6 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-amber-400 font-semibold mb-2">Important Notice</h3>
                    <p className="text-amber-200 text-sm leading-relaxed">
                      These features are currently in development or planned for future release. 
                      <strong> They may not become available</strong> and are subject to change based on 
                      technical feasibility, user demand, and development priorities. We appreciate your 
                      understanding as we work to bring these features to life.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Roadmap Categories */}
          <div className="space-y-6">
            {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => {
              const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];
              const categoryColor = categoryColors[category as keyof typeof categoryColors];
              
              return (
                <Card key={category} className="backdrop-blur-sm">
                  <CardHeader>
                    <Button
                      variant="ghost"
                      className="w-full p-0 h-auto justify-between text-left hover:bg-transparent"
                      onClick={() => toggleCategory(category)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${categoryColor}`}>
                          <CategoryIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-xl text-white capitalize">
                            {category === 'ai' ? 'AI Features' : 
                             category === 'integration' ? 'Integrations' :
                             category === 'automation' ? 'Automation' : 'Analytics'}
                          </CardTitle>
                          <p className="text-gray-400 text-sm">
                            {categoryFeatures.length} feature{categoryFeatures.length !== 1 ? 's' : ''} planned
                          </p>
                        </div>
                      </div>
                      {expandedCategories[category] ? (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      )}
                    </Button>
                  </CardHeader>
                  
                  {expandedCategories[category] && (
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categoryFeatures.map((feature, index) => {
                          const statusColor = statusColors[feature.status];
                          
                          return (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3 mb-3">
                                  <div className="p-2 rounded-lg bg-gray-700/50">
                                    <feature.icon className="h-4 w-4 text-gray-300" />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-white font-medium mb-1">{feature.title}</h4>
                                    <p className="text-gray-400 text-sm leading-relaxed mb-3">
                                      {feature.description}
                                    </p>
                                    {/* badges removed */}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>


        </div>
      </div>
    </section>
  );
}; 