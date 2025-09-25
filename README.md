# BuildForMe Discord Bot

A modern Discord bot that helps users build and manage projects with AI assistance. This repository contains both the bot implementation and the official website.

## 🚀 Features

- **AI-Powered Project Building**: Get intelligent assistance for your development projects
- **Discord Integration**: Seamless interaction through Discord commands
- **Modern Web Interface**: Beautiful, responsive website with gradient animations
- **Real-time Updates**: Live status and project tracking

## 📁 Project Structure

```
buildforme/
├── src/                    # React frontend source code
├── bot/                    # Discord bot implementation
│   ├── professional_builder_bot.py
│   ├── requirements.txt
│   └── start_bot.sh
├── docs/                   # Documentation and guides
│   ├── AUTHENTICATION_GUIDE.md
│   ├── GRADIENT_SYSTEM.md
│   ├── MODERNIZATION_GUIDE.md
│   └── RESPONSIVE_IMPROVEMENTS.md
├── scripts/                # Deployment and utility scripts
│   ├── auto-deploy.sh
│   ├── deploy.sh
│   └── update.sh
├── supabase/               # Database and backend configuration
└── public/                 # Static assets
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation

### Backend
- **Supabase** for database and authentication
- **Python** for Discord bot
- **Discord.py** for bot framework

### Deployment
- **Vercel** for frontend hosting
- **Nginx** for reverse proxy
- **GitHub Actions** for CI/CD

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/bun
- Python 3.8+
- Discord Bot Token
- Supabase Project

### Frontend Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Bot Setup
```bash
# Navigate to bot directory
cd bot

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables
cp ../env_template.txt .env
# Edit .env with your Discord bot token and other configs

# Start the bot
./start_bot.sh
```

### Environment Variables
Create a `.env` file based on `env_template.txt`:
```bash
# Discord Bot
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_client_id

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Other
OPENAI_API_KEY=your_openai_api_key
```

## 📚 Documentation

- [Authentication Guide](docs/AUTHENTICATION_GUIDE.md) - User authentication flow
- [Gradient System](docs/GRADIENT_SYSTEM.md) - UI gradient implementation
- [Modernization Guide](docs/MODERNIZATION_GUIDE.md) - Code modernization details
- [Responsive Improvements](docs/RESPONSIVE_IMPROVEMENTS.md) - Mobile optimization

## 🚀 Deployment

### Frontend (Vercel)
```bash
# Deploy to Vercel
npm run build
vercel --prod
```

### Bot (Server)
```bash
# Use the deployment script
./scripts/deploy.sh
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Discord**: Join our Discord server for support
- **Issues**: Report bugs and feature requests on GitHub
- **Documentation**: Check the [docs/](docs/) directory for detailed guides

## 🔄 Recent Updates

- ✅ Unified hero section styling across all pages
- ✅ Improved mobile responsiveness
- ✅ Added keyboard accessibility
- ✅ Cleaned up project structure
- ✅ Enhanced gradient animations
- ✅ Optimized deployment scripts
