import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PageHeader from "@/components/PageHeader";
import { 
  Bot, 
  Users, 
  Zap, 
  Shield, 
  Target, 
  Heart, 
  Sparkles,
  CheckCircle,
  Code,
  Server,
  Clock,
  Star
} from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-pure-black px-4">
      <div className="container mx-auto max-w-4xl">
        <PageHeader
          title="Revolutionizing"
          highlight="Discord Server"
          subtitle="We're on a mission to make Discord server creation and management accessible to everyone, powered by cutting-edge AI technology."
        />

        {/* Mission Section */}
        <Card className="card-dark mb-12">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">Our Mission</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-lg leading-relaxed">
              BuildForMe was created to solve a simple problem: setting up and managing Discord servers 
              shouldn't require hours of manual work. We believe that anyone should be able to create 
              professional, well-organized Discord communities in seconds, not hours.
            </p>
          </CardContent>
        </Card>

        {/* Story Section */}
        <Card className="card-dark mb-12">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">Our Story</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Founded by Discord server owners who experienced the pain of manual server setup firsthand, 
              BuildForMe emerged from countless hours spent creating channels, setting permissions, 
              and organizing communities.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              We realized that with the power of AI, we could automate these repetitive tasks and 
              let community builders focus on what really matters: building amazing communities.
            </p>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="card-dark">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Speed</h3>
                </div>
                <p className="text-gray-300">
                  We believe time is precious. Our AI can set up complex Discord servers in 30 seconds 
                  instead of hours.
                </p>
              </CardContent>
            </Card>

            <Card className="card-dark">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Community</h3>
                </div>
                <p className="text-gray-300">
                  Discord is about bringing people together. We make it easier to create spaces 
                  where communities can thrive.
                </p>
              </CardContent>
            </Card>

            <Card className="card-dark">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                    <Code className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Innovation</h3>
                </div>
                <p className="text-gray-300">
                  We're constantly pushing the boundaries of what's possible with AI-powered 
                  automation for Discord.
                </p>
              </CardContent>
            </Card>

            <Card className="card-dark">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Security</h3>
                </div>
                <p className="text-gray-300">
                  Your Discord server's security is our priority. We follow best practices 
                  and never compromise on safety.
                </p>
              </CardContent>
            </Card>

            <Card className="card-dark">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Reliability</h3>
                </div>
                <p className="text-gray-300">
                  We build robust systems that you can depend on. When you need your server 
                  set up, we're there.
                </p>
              </CardContent>
            </Card>

            <Card className="card-dark">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                    <Star className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Excellence</h3>
                </div>
                <p className="text-gray-300">
                  We're committed to delivering the best possible experience for Discord 
                  server owners and their communities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <Card className="card-dark mb-12">
          <CardHeader>
            <CardTitle className="text-2xl text-white text-center mb-8">By the Numbers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">10,000+</div>
                <div className="text-gray-400">Servers Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">30s</div>
                <div className="text-gray-400">Average Setup Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-gray-400">Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">15+</div>
                <div className="text-gray-400">AI Commands</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technology Section */}
        <Card className="card-dark mb-12">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                <Server className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">Our Technology</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              BuildForMe leverages advanced AI algorithms to understand your server needs and 
              automatically configure channels, roles, permissions, and moderation systems. 
              Our technology stack includes:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold mb-1">AI-Powered Automation</h4>
                  <p className="text-gray-400">Machine learning models that understand Discord best practices</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Real-time Processing</h4>
                  <p className="text-gray-400">Instant server setup and configuration changes</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Cloud Infrastructure</h4>
                  <p className="text-gray-400">Scalable and reliable hosting for consistent performance</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-semibold mb-1">Discord Integration</h4>
                  <p className="text-gray-400">Deep integration with Discord's API and features</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Future Vision */}
        <Card className="card-dark">
          <CardHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">Looking Forward</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 text-lg leading-relaxed">
              As Discord continues to evolve, so do we. We're constantly working on new features, 
              improving our AI capabilities, and finding new ways to make Discord server management 
              even easier. Our goal is to become the go-to solution for anyone who wants to create 
              and manage professional Discord communities without the technical complexity.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About; 