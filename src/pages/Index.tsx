import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { CTA } from "@/components/CTA";
import { botFeatures, roadmapFeatures } from "@/data/features";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-pure-black relative overflow-hidden">


      {/* Main content wrapper with professional spacing */}
      <div className="relative z-10">
        {/* Hero Section */}
        <Hero user={user} />

        {/* Features and Roadmap Section */}
        <Features liveFeatures={botFeatures} roadmapFeatures={roadmapFeatures} />

        {/* CTA Section */}
        <CTA user={user} />
      </div>
    </div>
  );
};

export default Index;
