import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Crown, 
  Settings, 
  HelpCircle, 
  CheckCircle,
  Shield,
  Zap
} from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 border-t border-gray-800/50" role="contentinfo">
      <div className="container mx-auto max-w-7xl px-4 py-10 sm:py-12 lg:py-14">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mb-8 sm:mb-10">
          {/* Column 1: Brand & Description */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <span className="logo-text text-xl sm:text-2xl font-bold">BuildForMe</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed text-base sm:text-lg">
              AI-powered Discord bot that helps you create, manage, and optimize 
              professional Discord servers in seconds.
            </p>
          </div>

          {/* Column 2: Product */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg">Product</h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/pricing" 
                  className="text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-3 group"
                >
                  <Crown className="h-4 w-4 flex-shrink-0" />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Pricing</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/dashboard" 
                  className="text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-3 group"
                >
                  <Settings className="h-4 w-4 flex-shrink-0" />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/commands" 
                  className="text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-3 group"
                >
                  <Bot className="h-4 w-4 flex-shrink-0" />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Commands</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/support" 
                  className="text-gray-400 hover:text-white transition-all duration-200 flex items-center gap-3 group"
                >
                  <HelpCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="group-hover:translate-x-1 transition-transform duration-200">Support</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company & Legal */}
          <div>
            <h3 className="text-white font-semibold mb-6 text-lg">Company</h3>
            <ul className="space-y-4 mb-6">
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-400 hover:text-white transition-all duration-200 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">About Us</span>
                </Link>
              </li>
            </ul>

            <h3 className="text-white font-semibold mb-6 text-lg">Legal</h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/privacy" 
                  className="text-gray-400 hover:text-white transition-all duration-200 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-gray-400 hover:text-white transition-all duration-200 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">Terms of Service</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/returns" 
                  className="text-gray-400 hover:text-white transition-all duration-200 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">Return Policy</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 pt-6 sm:pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-gray-400 text-sm sm:text-base">
              © {currentYear} BuildForMe. All rights reserved.
            </div>
            
            <div className="flex items-center gap-4 sm:gap-6 text-sm" />
          </div>
        </div>
      </div>
    </footer>
  );
}; 