import React from "react";
import { Link } from "react-router-dom";
import { Shield, Mail, ExternalLink } from "lucide-react";

const currentYear = new Date().getFullYear();

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-gray-800 text-gray-300 px-6 py-12 mt-16">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              <span className="logo-text">BuildForMe</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-400 max-w-md">
              Professional AI Discord Server Builder that creates, manages, and optimizes 
              your Discord server with intelligent automation.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-400">
                <Shield className="h-4 w-4" />
                <span>Secure & Reliable</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="h-4 w-4" />
                <a href="mailto:support@buildforme.xyz" className="hover:text-white transition-colors">
                  support@buildforme.xyz
                </a>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors flex items-center gap-1">
                  Pricing
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-gray-400 hover:text-white transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4 md:text-right">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wide">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-400 hover:text-white transition-colors">
                  Return Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 flex justify-center">
          <p className="text-xs text-gray-500">
            © {currentYear} BuildForMe. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export { Footer }; 