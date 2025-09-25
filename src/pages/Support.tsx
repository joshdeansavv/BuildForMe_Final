import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bot, 
  MessageSquare, 
  Settings, 
  Users, 
  Shield, 
  Zap, 
  HelpCircle, 
  ChevronDown, 
  ChevronRight,
  Command,
  Sparkles,
  Crown,
  Star,
  AlertCircle,
  CheckCircle,
  Info,
  Copy,
  ExternalLink,
  BarChart3,
  Trash2,
  RotateCcw,
  Palette,
  Wrench,
  TestTube
} from "lucide-react";

const Support = () => {
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    free: true,
    ai: false,
    management: false,
    cleanup: false,
    advanced: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleKeyDown = (event: React.KeyboardEvent, section: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleSection(section);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const commandCategories = [
    {
      id: "free",
      title: "Free Commands",
      icon: HelpCircle,
      description: "Basic commands available to all users",
      badge: "Free",
      badgeColor: "bg-gray-700 text-gray-300 cursor-default",
      commands: [
        {
          command: "/help",
          description: "Show all bot commands and usage",
          usage: "/help",
          example: "Displays a comprehensive list of all available commands",
          steps: [
            "1. Run `/help` in any channel",
            "2. View all available commands organized by category",
            "3. See which commands require subscription",
            "4. Get quick access to command documentation"
          ]
        },
        {
          command: "/command-hub",
          description: "Create or show the protected admin command hub",
          usage: "/command-hub",
          example: "Creates a protected channel for safe admin commands",
          steps: [
            "1. Run `/command-hub` (requires admin permissions)",
            "2. Bot creates a protected #command-hub channel",
            "3. This channel is safe from all bot operations",
            "4. Use this channel for admin commands safely"
          ]
        },
        {
          command: "/check-permissions",
          description: "Check bot permissions and diagnose issues",
          usage: "/check-permissions",
          example: "Verifies bot has all required permissions",
          steps: [
            "1. Run `/check-permissions` (requires admin)",
            "2. Review bot's current permissions",
            "3. Check role hierarchy position",
            "4. Identify any missing permissions"
          ]
        },
        {
          command: "/admin-setup",
          description: "Create admin and mod channels/categories",
          usage: "/admin-setup [create_admin] [create_mod]",
          example: "/admin-setup true true",
          steps: [
            "1. Run `/admin-setup` with your preferences",
            "2. Choose to create admin category (default: true)",
            "3. Choose to create mod category (default: true)",
            "4. Bot creates organized admin infrastructure"
          ]
        }
      ]
    },
    {
      id: "ai",
      title: "AI Commands (Subscription Required)",
      icon: Sparkles,
      description: "Advanced AI-powered server management features",
      badge: "Premium",
      badgeColor: "bg-gray-700 text-gray-300 cursor-default",
      commands: [
        {
          command: "/setup",
          description: "AI-powered comprehensive server setup",
          usage: "/setup theme channels categories [options]",
          example: "/setup Gaming 10 3 use_ai:true custom_roles:true",
          parameters: [
            "theme: Server theme (Gaming, Study, Tech, Art, etc.)",
            "channels: Number of channels to create",
            "categories: Number of categories to create",
            "use_ai: Use AI for structure and naming (default: true)",
            "custom_roles: Create custom roles (default: true)",
            "role_count: Number of custom roles (default: 5)",
            "role_theme: Use theme-based role naming (default: true)",
            "role_colors: Color scheme (theme-based, pastels, neon, etc.)",
            "embeds: Add informational embeds (default: true)",
            "ai_embeds: Use AI for custom embed content (default: false)",
            "moderation_logs: Create moderation log channels (default: true)"
          ],
          steps: [
            "1. Run `/setup` with your desired theme and structure",
            "2. AI analyzes your requirements and creates a blueprint",
            "3. Bot creates categories, channels, and roles automatically",
            "4. Optional: AI generates custom welcome messages and rules"
          ]
        },
        {
          command: "/add-channels",
          description: "Add channels to the server (AI features available)",
          usage: "/add-channels count [names] [use_ai]",
          example: "/add-channels 5 \"gaming,chat,memes\" true",
          parameters: [
            "count: Number of channels to create",
            "names: Channel names (comma-separated, optional)",
            "use_ai: Use AI for themed naming (default: false)"
          ],
          steps: [
            "1. Specify number of channels to create",
            "2. Optionally provide channel names or let AI generate them",
            "3. Bot creates channels with proper permissions",
            "4. AI can suggest themed names based on your server"
          ]
        },
        {
          command: "/add-roles",
          description: "Add roles to the server (AI features available)",
          usage: "/add-roles names [use_ai]",
          example: "/add-roles \"Moderator,Helper,Member\" true",
          parameters: [
            "names: Role names (comma-separated)",
            "use_ai: Use AI for naming/color suggestions (default: false)"
          ],
          steps: [
            "1. Provide comma-separated role names",
            "2. Optionally enable AI for color suggestions",
            "3. Bot creates roles with appropriate colors",
            "4. AI can suggest complementary role colors"
          ]
        },
        {
          command: "/fix-permissions",
          description: "Fix server permissions with AI analysis",
          usage: "/fix-permissions [use_ai] [basic_reset]",
          example: "/fix-permissions true false",
          parameters: [
            "use_ai: Use AI to audit and auto-fix permissions (default: true)",
            "basic_reset: Reset all roles to basic permissions (default: false)"
          ],
          steps: [
            "1. AI analyzes your server's permission structure",
            "2. Identifies redundant or conflicting permissions",
            "3. Suggests and applies safe permission fixes",
            "4. Optionally resets all roles to basic permissions"
          ]
        },
        {
          command: "/theme",
          description: "Apply new theme to server",
          usage: "/theme new_theme [rename_only] [use_ai]",
          example: "/theme Cyberpunk false true",
          parameters: [
            "new_theme: New theme to apply",
            "rename_only: Only rename channels/roles without restructuring (default: false)",
            "use_ai: Use AI for theme application (default: true)"
          ],
          steps: [
            "1. Specify your new server theme",
            "2. Choose whether to restructure or just rename",
            "3. AI suggests theme-appropriate names and colors",
            "4. Bot applies the new theme across your server"
          ]
        },
        {
          command: "/ai-cleanup",
          description: "Interactive AI-powered server structure optimization",
          usage: "/ai-cleanup [analysis_depth] [focus_area]",
          example: "/ai-cleanup detailed permissions",
          parameters: [
            "analysis_depth: How deep should the AI analyze (basic, detailed, comprehensive, default: detailed)",
            "focus_area: What area to focus cleanup on (all, permissions, structure, roles, channels, default: all)"
          ],
          steps: [
            "1. AI performs comprehensive server analysis",
            "2. Identifies optimization opportunities",
            "3. Presents interactive cleanup options",
            "4. Apply fixes one by one with full control"
          ]
        }
      ]
    },
    {
      id: "management",
      title: "Server Management",
      icon: Settings,
      description: "Basic server management and organization commands",
      badge: "Free",
      badgeColor: "bg-gray-700 text-gray-300 cursor-default",
      commands: [
        {
          command: "/add-category",
          description: "Add a category to the server",
          usage: "/add-category name",
          example: "/add-category \"Gaming Channels\"",
          steps: [
            "1. Provide the category name",
            "2. Bot creates the category with proper permissions",
            "3. Category is ready for channels"
          ]
        },
        {
          command: "/remove-channels",
          description: "⚡ Remove channels from the server",
          usage: "/remove-channels [names] [all_channels]",
          example: "/remove-channels \"old-channel,test-channel\" false",
          parameters: [
            "names: Channel names (comma-separated) or 'all'",
            "all_channels: Remove all channels (default: false)"
          ],
          steps: [
            "1. Specify channel names to remove or use 'all'",
            "2. Bot safely removes specified channels",
            "3. Protected channels are never removed",
            "4. Confirmation is provided for bulk operations"
          ]
        },
        {
          command: "/remove-roles",
          description: "⚡ Remove roles from the server",
          usage: "/remove-roles [names] [all_roles]",
          example: "/remove-roles \"OldRole,TestRole\" false",
          parameters: [
            "names: Role names (comma-separated) or 'all'",
            "all_roles: Remove all roles (default: false)"
          ],
          steps: [
            "1. Specify role names to remove or use 'all'",
            "2. Bot safely removes specified roles",
            "3. Default and managed roles are protected",
            "4. Confirmation is provided for bulk operations"
          ]
        },
        {
          command: "/remove-categories",
          description: "⚡ Remove categories from the server",
          usage: "/remove-categories [names] [all_categories]",
          example: "/remove-categories \"Old Category\" false",
          parameters: [
            "names: Category names (comma-separated) or 'all'",
            "all_categories: Remove all categories (default: false)"
          ],
          steps: [
            "1. Specify category names to remove or use 'all'",
            "2. Bot safely removes specified categories",
            "3. Protected categories are never removed",
            "4. Confirmation is provided for bulk operations"
          ]
        }
      ]
    },
    {
      id: "cleanup",
      title: "Cleanup & Maintenance",
      icon: RotateCcw,
      description: "Server cleanup and maintenance commands",
      badge: "Free",
      badgeColor: "bg-gray-700 text-gray-300 cursor-default",
      commands: [
        {
          command: "/clean-messages",
          description: "Clean messages from channels",
          usage: "/clean-messages [channels] [all_channels] [limit]",
          example: "/clean-messages \"general,spam\" false 50",
          parameters: [
            "channels: Channel names (comma-separated) or 'all'",
            "all_channels: Clean all channels (default: true)",
            "limit: Number of messages to delete (max 100, default: 100)"
          ],
          steps: [
            "1. Specify channels to clean or use 'all'",
            "2. Set the number of messages to delete",
            "3. Bot removes messages safely",
            "4. Protected channels are never affected"
          ]
        },
        {
          command: "/clean-reactions",
          description: "Clean reactions from channels",
          usage: "/clean-reactions [channels] [all_channels]",
          example: "/clean-reactions \"general\" false",
          parameters: [
            "channels: Channel names (comma-separated) or 'all'",
            "all_channels: Clean all channels (default: true)"
          ],
          steps: [
            "1. Specify channels to clean or use 'all'",
            "2. Bot removes all reactions from messages",
            "3. Helps clean up spam reactions",
            "4. Protected channels are never affected"
          ]
        },
        {
          command: "/backup",
          description: "Create server backup",
          usage: "/backup",
          example: "Creates a JSON backup of your server structure",
          steps: [
            "1. Run `/backup` in any channel",
            "2. Bot creates a comprehensive backup file",
            "3. Backup includes roles, channels, and categories",
            "4. File is sent to the command hub for safekeeping"
          ]
        },
        {
          command: "/restore",
          description: "Restore from backup",
          usage: "/restore",
          example: "Upload a backup file to restore server structure",
          steps: [
            "1. Run `/restore` command",
            "2. Upload your backup JSON file",
            "3. Bot will restore the server structure",
            "4. Confirmation required before restoration"
          ]
        }
      ]
    },
    {
      id: "advanced",
      title: "Advanced & Testing",
      icon: Wrench,
      description: "Advanced commands for testing and troubleshooting",
      badge: "Free",
      badgeColor: "bg-gray-700 text-gray-300 cursor-default",
      commands: [
        {
          command: "/test-permissions",
          description: "Test bot permissions by creating a test channel",
          usage: "/test-permissions",
          example: "Creates a temporary test channel to verify permissions",
          steps: [
            "1. Run `/test-permissions` (requires admin)",
            "2. Bot creates a test channel",
            "3. Tests channel modification and deletion",
            "4. Reports success or failure of permission test"
          ]
        },
        {
          command: "/fix-bot-permissions",
          description: "Automatically fix bot role hierarchy and permissions",
          usage: "/fix-bot-permissions",
          example: "Attempts to fix common bot permission issues",
          steps: [
            "1. Run `/fix-bot-permissions` (requires admin)",
            "2. Bot analyzes current permission setup",
            "3. Attempts to fix role hierarchy issues",
            "4. Provides detailed feedback on fixes applied"
          ]
        },
        {
          command: "/nuke",
          description: "Complete server reset (DESTRUCTIVE)",
          usage: "/nuke confirmation",
          example: "/nuke \"My Server Name\"",
          parameters: [
            "confirmation: Type the exact server name to confirm"
          ],
          steps: [
            "1. Type the exact server name as confirmation",
            "2. Bot removes ALL channels, categories, and roles",
            "3. Only the command hub channel is preserved",
            "4. This action is irreversible - use with extreme caution"
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-pure-black py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-gray-800 text-gray-300 px-3 py-1 text-sm font-medium mb-6 border border-gray-700">
            <HelpCircle className="mr-2 h-3 w-3" />
            Bot Commands
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            BuildForMe <span className="gradient-text-animated">Bot Commands</span>
          </h1>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-8">
              Complete command reference for the BuildForMe Discord bot. 
              Learn how to use AI-powered features and manage your server effectively.
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
              <Badge className="bg-gray-700 text-gray-300 px-2 sm:px-3 py-1 text-xs sm:text-sm cursor-default">
                <CheckCircle className="mr-1 h-3 w-3" />
                Free Commands
              </Badge>
              <Badge className="bg-gray-700 text-gray-300 px-2 sm:px-3 py-1 text-xs sm:text-sm cursor-default">
                <Sparkles className="mr-1 h-3 w-3" />
                AI Features (Premium)
              </Badge>
              <Badge className="bg-gray-700 text-gray-300 px-2 sm:px-3 py-1 text-xs sm:text-sm cursor-default">
                <Settings className="mr-1 h-3 w-3" />
                Management
              </Badge>
            </div>
          </div>
        </div>

        {/* Command Categories */}
        <div className="space-y-8">
          {commandCategories.map((category) => (
            <Card key={category.id} className="card-dark border-gray-700">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <category.icon className="h-6 w-6 text-gray-300" />
                    <div>
                      <CardTitle className="text-white text-lg sm:text-xl">{category.title}</CardTitle>
                      <CardDescription className="text-gray-400 text-sm">{category.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={`${category.badgeColor} text-xs sm:text-sm`}>
                      {category.badge}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleSection(category.id)}
                      onKeyDown={(e) => handleKeyDown(e, category.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      {expandedSections[category.id] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {expandedSections[category.id] && (
                <CardContent className="space-y-6">
                  {category.commands.map((cmd, index) => (
                    <div key={index} className="border border-gray-700 rounded-lg p-6 bg-gray-900/50">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                            <code className="bg-gray-800 text-purple-300 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm font-mono break-all">
                              {cmd.command}
                            </code>
                            <Badge className="bg-gray-700 text-gray-300 text-xs w-fit cursor-default">
                              {cmd.parameters ? `${cmd.parameters.length} params` : 'No params'}
                            </Badge>
                          </div>
                          <p className="text-gray-300 mb-3 text-sm sm:text-base">{cmd.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(cmd.command)}
                          className="text-gray-400 hover:text-white self-start sm:self-auto"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">Usage</h4>
                          <code className="bg-gray-800 text-green-300 px-2 py-1 rounded text-xs font-mono block break-all">
                            {cmd.usage}
                          </code>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">Example</h4>
                          <code className="bg-gray-800 text-blue-300 px-2 py-1 rounded text-xs font-mono block break-all">
                            {cmd.example}
                          </code>
                        </div>
                      </div>
                      
                      {cmd.parameters && cmd.parameters.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-300 mb-2">Parameters</h4>
                          <div className="space-y-1">
                            {cmd.parameters.map((param, paramIndex) => (
                              <div key={paramIndex} className="text-xs text-gray-400">
                                • {param}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Steps</h4>
                        <div className="space-y-1">
                          {cmd.steps.map((step, stepIndex) => (
                            <div key={stepIndex} className="text-xs text-gray-400">
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <Card className="card-dark border-purple-500/20 bg-gradient-to-r from-purple-900/20 to-pink-900/20">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="h-6 w-6 text-purple-400" />
                <h3 className="text-xl font-bold text-white">Need AI Features?</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Upgrade to premium to unlock AI-powered server setup, optimization, and advanced features.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild className="btn-gradient">
                  <a href="/pricing" className="flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    View Pricing
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                  <a href="/dashboard" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Go to Dashboard
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