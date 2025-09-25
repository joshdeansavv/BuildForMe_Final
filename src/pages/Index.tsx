import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Bot, Zap, Settings, Crown, ArrowRight, Sparkles, Server, Shield, Wand2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-pure-black relative overflow-hidden">
      {/* Subtle background gradients */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-900/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-l from-red-900/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-orange-900/20 to-transparent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-6xl py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="bg-gray-800 text-gray-300 px-3 py-1 text-sm font-medium mb-6 border border-gray-700">
            <Sparkles className="mr-2 h-3 w-3" />
            AI-Powered Discord Bot
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
            Build Discord servers
            <span className="gradient-text-animated">
              {" "}in seconds
            </span>
          </h1>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-8">
              Professional Discord Server Bot that helps you create, manage, and optimize 
              your servers with intelligent automation.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
              {user ? (
                <Button 
                  asChild 
                  className="btn btn-gradient px-6 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  <Link to="/dashboard">
                    <Settings className="mr-2 h-4 w-4" />
                    Open Dashboard
                  </Link>
                </Button>
              ) : (
                <Button 
                  asChild 
                  className="btn btn-gradient px-6 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  <Link to="/auth">
                    <svg className="mr-2 w-4 h-4" viewBox="0 0 71 55" fill="currentColor">
                      <g clipPath="url(#clip0)">
                        <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z" fill="currentColor"/>
                      </g>
                      <defs>
                        <clipPath id="clip0">
                          <rect width="71" height="55" fill="white"/>
                        </clipPath>
                      </defs>
                    </svg>
                    Sign in with Discord
                  </Link>
                </Button>
              )}
              
              <Button 
                asChild
                variant="outline" 
                className="btn btn-primary px-6 py-3 text-base font-medium transition-all"
              >
                <Link to="/pricing">
                  <Crown className="mr-2 h-4 w-4" />
                  View Pricing
                </Link>
              </Button>
            </div>

            {/* Features preview */}
            <div className="text-gray-400 text-sm">
              Free tier available • Impress your friends & fast• Better with premium
            </div>
          </div>
        </div>
      </div>

      {/* Bot Features Section */}
      <section className="relative py-8 sm:py-12 bg-gradient-to-b from-transparent via-gray-900/10 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-heading text-white mb-6">
              What BuildForMe Can Do
            </h2>
            <p className="text-subheading max-w-3xl mx-auto">
              Our AI bot handles everything from server setup to optimization, 
              so you can focus on building your community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {botFeatures.map((feature, index) => (
              <Card key={index} className="bg-gray-900 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-gray-700">
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    {feature.premium && (
                      <Badge className="badge badge-gradient text-white text-xs">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-heading text-white mb-6">
            Ready to transform your Discord server?
          </h2>
          <p className="text-subheading max-w-3xl mx-auto mb-8">
            Join thousands of server owners using BuildForMe to create 
            professional Discord communities in minutes, not hours.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            {user ? (
              <Button 
                asChild 
                className="btn btn-gradient px-6 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all w-auto"
              >
                <Link to="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button 
                asChild 
                className="btn btn-gradient px-6 py-3 text-base font-medium shadow-lg hover:shadow-xl transition-all w-auto"
              >
                <Link to="/auth">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

// Bot features based on professional_builder_bot.py
const botFeatures = [
  {
    icon: Wand2,
    title: "AI-Powered Server Setup",
    description: "Complete server setup in seconds with AI that creates channels, categories, roles, and permissions based on your theme.",
    color: "bg-gray-700",
    premium: true
  },
  {
    icon: Settings,
    title: "Smart Channel Management", 
    description: "Add, remove, and organize channels with intelligent naming and structure. Protected channels ensure important areas stay safe.",
    color: "bg-gray-700",
    premium: false
  },
  {
    icon: Shield,
    title: "Permission Optimization",
    description: "AI analyzes and fixes permission issues automatically. Ensures proper role hierarchy and prevents common security mistakes.",
    color: "bg-gray-700",
    premium: true
  },
  {
    icon: Server,
    title: "Server Cleanup & Analysis",
    description: "Interactive cleanup tools identify unused channels, optimize structure, and provide detailed server health reports.",
    color: "bg-gray-700", 
    premium: true
  },
  {
    icon: Zap,
    title: "Theme Application",
    description: "Instantly transform your server with professionally designed themes. Renames channels, roles, and restructures as needed.",
    color: "bg-gray-700",
    premium: true
  },
  {
    icon: Bot,
    title: "Admin Command Hub",
    description: "Protected admin channels and comprehensive permission checking. Works seamlessly with your existing moderation tools.",
    color: "bg-gray-700",
    premium: false
  }
];

export default Index;
