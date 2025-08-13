import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import { Link } from "react-router-dom";
import { 
  MessageSquare, 
  Mail, 
  HelpCircle, 
  BookOpen,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  MessageCircle,
  Github,
  Twitter
} from "lucide-react";

const Support = () => {
  return (
    <div className="min-h-screen bg-pure-black px-4">
      <div className="container mx-auto max-w-6xl">
        <PageHeader
          title="Need Help?"
          highlight=""
          subtitle="We're here to help you get the most out of BuildForMe. Find answers, get support, and connect with our team."
        />

        {/* Support Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {/* Commands */}
                     <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <BookOpen className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Commands</CardTitle>
                  <CardDescription className="text-gray-400">Complete bot command reference</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Learn how to use all bot commands, from basic setup to advanced AI features.
              </p>
              <Button asChild className="w-full" variant="neutral">
                <Link to="/commands" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  View Commands
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Discord Support */}
                     <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Discord Community</CardTitle>
                  <CardDescription className="text-gray-400">Join our support server</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Get real-time help from our community and support team on Discord.
              </p>
              <Button asChild className="w-full" variant="neutral">
                <a href="https://discord.gg/ydFSsedjvp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Join Discord
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Email Support */}
                     <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Mail className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Email Support</CardTitle>
                  <CardDescription className="text-gray-400">Direct support contact</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Send us an email for technical issues, billing questions, or feature requests.
              </p>
              <Button asChild className="w-full" variant="neutral">
                <a href="mailto:buildformeapp@gmail.com" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Send Email
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 text-lg">
              Quick answers to common questions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-dark">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-2">How do I get started?</h3>
                    <p className="text-gray-400 text-sm">
                      Invite the bot to your server, run `/help` to see available commands, and start with `/admin-setup` to create your admin infrastructure. For AI features, upgrade to premium.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

          <Card className="card-dark">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-2">What permissions does the bot need?</h3>
                    <p className="text-gray-400 text-sm">
                      The bot requires Administrator permissions to manage channels, roles, and categories. Use `/check-permissions` to verify setup.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

          <Card className="card-dark">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-2">How do I upgrade to premium?</h3>
                    <p className="text-gray-400 text-sm">
                      Visit your dashboard and click "Upgrade to Premium" to access AI-powered features, analytics, channel summaries, and advanced server management tools.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

          <Card className="card-dark">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-white font-semibold mb-2">Is my data safe?</h3>
                    <p className="text-gray-400 text-sm">
                      Yes! We only store essential account information. Server data is processed securely and never stored permanently.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Information */}
        <div className="text-center">
          <Card className="card-dark border-purple-500/20">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <MessageSquare className="h-6 w-6 text-purple-400" />
                <h3 className="text-xl font-bold text-white">Still Need Help?</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Our support team is available to help you with any questions or issues.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="neutral">
                  <a href="mailto:buildformeapp@gmail.com" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Contact Support
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  <a href="https://discord.gg/ydFSsedjvp" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Join Discord
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support; 