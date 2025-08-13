import { LucideIcon, Wand2, Settings, Shield, Server, Zap, Bot, Brain, MessageSquare, BarChart3, Palette, Users, Clock, Sparkles, Target, Lock, Globe, Mic, Image, Bell, GitBranch, Webhook, Crown, Eye, Heart } from 'lucide-react';

export interface BotFeature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const botFeatures: BotFeature[] = [
  {
    icon: Wand2,
    title: "AI-Powered Server Setup",
    description: "Complete server setup in seconds with AI that creates channels, categories, roles, and permissions based on your theme."
  },
  {
    icon: Brain,
    title: "AI Permission Optimization",
    description: "AI analyzes and fixes permission issues automatically. Ensures proper role hierarchy and prevents common security mistakes."
  },
  {
    icon: Server,
    title: "Interactive AI Cleanup",
    description: "AI-powered server structure optimization with interactive cleanup tools. Remove unused channels and optimize roles safely."
  },
  {
    icon: Palette,
    title: "AI Theme Application",
    description: "Apply professional themes and layouts instantly. AI customizes colors, icons, and structure to match your brand and theme."
  },
  {
    icon: MessageSquare,
    title: "AI Channel Management",
    description: "Add channels with AI-powered naming and structure suggestions. Intelligent organization for optimal server layout."
  },
  {
    icon: Users,
    title: "AI Role Management",
    description: "Create roles with AI-powered naming and color suggestions. Smart role creation with intelligent hierarchy management."
  },
  {
    icon: BarChart3,
    title: "AI Analytics & Insights",
    description: "Channel summaries, sentiment analysis, topic mapping, and daily digests with AI-powered insights and trend analysis."
  },
  {
    icon: Bot,
    title: "Admin Command Hub",
    description: "Centralized admin commands for easy server management. Quick access to all moderation and setup tools."
  },
  {
    icon: Shield,
    title: "Permission Security",
    description: "Advanced permission checking and fixing tools. Ensure your server remains secure with automated security audits."
  },
  {
    icon: Settings,
    title: "Server Management",
    description: "Comprehensive server management including backup/restore, message cleanup, and server maintenance tools."
  },
  {
    icon: Users,
    title: "Basic Role Management",
    description: "Create and manage roles manually. Add categories and organize your server structure with standard tools."
  },
  {
    icon: MessageSquare,
    title: "Channel Management",
    description: "Add, remove, and organize channels manually. Protected channels ensure important areas stay safe."
  }
];

export interface RoadmapFeature {
  icon: LucideIcon;
  title: string;
  description: string;
  category: 'ai' | 'integration' | 'automation' | 'analytics';
  status: 'planned' | 'in-development' | 'beta';
}

export const roadmapFeatures: RoadmapFeature[] = [
  {
    icon: GitBranch,
    title: "Server Cloning",
    description: "Clone server structures and configurations with intelligent data collection and transfer capabilities.",
    category: 'integration',
    status: 'planned'
  },
  {
    icon: Webhook,
    title: "AI Webhook Creation",
    description: "100% custom webhook creation with AI-generated content, custom names, and personalized profiles.",
    category: 'ai',
    status: 'planned'
  },
  {
    icon: MessageSquare,
    title: "AI Chatbot Assistant",
    description: "Collaborative AI chatbot that works with users to make Discord server changes agentically.",
    category: 'ai',
    status: 'planned'
  },
  {
    icon: Eye,
    title: "Active Monitor & Moderate",
    description: "24/7 monitoring system that actively moderates content and maintains server quality automatically.",
    category: 'automation',
    status: 'planned'
  },
  {
    icon: Heart,
    title: "AI Engagement Boost",
    description: "Intelligent engagement prompts and conversation starters when server activity is slow, with configurable quiet hours.",
    category: 'ai',
    status: 'planned'
  },
  {
    icon: Palette,
    title: "AI Custom Embeds",
    description: "Personality-based embed generation that creates custom embeds matching user preferences and server themes.",
    category: 'ai',
    status: 'planned'
  },
  {
    icon: Image,
    title: "AI Image Generation",
    description: "Generate custom profile pictures, webhook avatars, and server-themed emojis using AI.",
    category: 'ai',
    status: 'planned'
  },
  {
    icon: Mic,
    title: "AI Voice & Transcription",
    description: "Voice recording capabilities with AI-powered transcription and analysis for voice channels.",
    category: 'ai',
    status: 'planned'
  },
  {
    icon: BarChart3,
    title: "Advanced AI Analytics",
    description: "Enhanced AI analysis with real-time monitoring, predictive insights, and automated reporting.",
    category: 'analytics',
    status: 'planned'
  },
  {
    icon: Bell,
    title: "AI Reminders & Scheduling",
    description: "Intelligent reminder system with scheduled searches and automated task management.",
    category: 'automation',
    status: 'planned'
  },
  {
    icon: Globe,
    title: "Cross-Server Functions",
    description: "Cross-server communication and update sharing between connected Discord communities.",
    category: 'integration',
    status: 'planned'
  },
  {
    icon: Zap,
    title: "AI APIs & External Communication",
    description: "APIs that enable communication outside of Discord servers with external services and platforms.",
    category: 'integration',
    status: 'planned'
  },
  {
    icon: Crown,
    title: "AI Role Creation",
    description: "Theme-based role creation with full analysis and intelligent role assignment systems.",
    category: 'ai',
    status: 'planned'
  },
  {
    icon: Clock,
    title: "24/7 Monitoring",
    description: "Continuous server monitoring with automated alerts and maintenance suggestions to keep your community running smoothly.",
    category: 'automation',
    status: 'planned'
  }
]; 