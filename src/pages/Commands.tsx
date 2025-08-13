import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Crown, Settings } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const Commands = () => {
  const { subscription } = useAuth();

  const commands = [
    "/help",
    "/command-hub",
    "/check-permissions",
    "/admin-setup",
    "/subscription-status",
    "/setup",
    "/add-channels",
    "/add-roles",
    "/add-category",
    "/theme",
    "/remove-channels",
    "/remove-roles",
    "/remove-categories",
    "/fix-permissions",
    "/ai-cleanup",
    "/test-permissions",
    "/fix-bot-permissions",
    "/backup",
    "/clean-messages",
    "/clean-reactions",
    "/nuke",
  ];

  return (
    <div className="min-h-screen bg-pure-black py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <PageHeader
          title="BuildForMe"
          highlight="Commands"
          subtitle="Complete command reference for the BuildForMe Discord bot."
        />

        <div className="max-w-2xl mx-auto">
          <ul className="space-y-2 text-center">
            {commands.map((command, index) => (
              <li key={index} className="text-xl sm:text-2xl text-white font-mono">
                {command}
              </li>
            ))}
          </ul>
        </div>

        {!subscription?.subscribed && (
          <div className="text-center mt-16">
            <Card className="card-dark">
              <CardContent className="p-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Sparkles className="h-6 w-6 text-purple-400" />
                  <h3 className="text-xl font-bold text-white">Need AI Features?</h3>
                </div>
                <p className="text-gray-400 mb-4">
                  Upgrade to premium to unlock advanced, AI-powered server building and optimization.
                </p>
                <ul className="text-gray-300 text-sm sm:text-base list-disc pl-6 text-left max-w-xl mx-auto space-y-1 mb-6">
                  <li>AI-powered server setup and structure generation</li>
                  <li>One‑click optimization and cleanup tools</li>
                  <li>Advanced permission fixes and diagnostics</li>
                  <li>Premium templates and best‑practice presets</li>
                  <li>Priority support</li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" variant="gray" className="!transition-none hover:translate-y-0 hover:shadow-none">
                    <Link to="/pricing" className="flex items-center gap-2">
                      <Crown className="h-4 w-4" /> View Pricing
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" /> Go to Dashboard
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Commands;