# VoCo - Multilingual Vocabulary Learning App

<div align="center">
  <img src="public/voco-icon.svg" alt="VoCo Logo" width="120" height="120">
  
  ![Next.js](https://img.shields.io/badge/Next.js-15.2-black?style=for-the-badge&logo=next.js)
  ![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
  ![Capacitor](https://img.shields.io/badge/Capacitor-7.4-blue?style=for-the-badge&logo=capacitor)
</div>

A modern, AI-powered vocabulary learning application that helps users master new languages through intelligent spaced repetition, interactive exercises, and advanced audio features.

## ✨ Features

### 🌍 Core Learning Features
- **Multilingual Support**: Learn vocabulary in 15+ languages
- **Smart Learning**: AI-powered spaced repetition algorithm
- **Audio Pronunciation**: High-quality text-to-speech in multiple languages
- **Progress Tracking**: Detailed analytics and learning insights
- **Interactive Exercises**: Multiple game modes and quizzes

### 📱 Modern App Experience
- **Progressive Web App (PWA)**: Install on any device
- **Mobile Native Apps**: iOS and Android support via Capacitor
- **Offline Support**: Learn without internet connection
- **Responsive Design**: Optimized for all screen sizes
- **Dark/Light Themes**: Comfortable learning environment

### 🤖 AI-Powered Features
- **Smart Translations**: Context-aware AI translations
- **Difficulty Assessment**: Automatic vocabulary difficulty rating
- **Personalized Learning**: Adaptive learning paths
- **Vocabulary Generation**: AI-generated practice content

### 💎 Premium Features
- **Unlimited Vocabulary Lists**: Create custom learning sets
- **Advanced Analytics**: Detailed progress insights
- **Priority Support**: Get help when you need it
- **Ad-Free Experience**: Distraction-free learning

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/voco.git
   cd voco
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your API keys to `.env.local`:
   ```env
   # Required for full functionality
   DATABASE_URL="your-database-url"
   NEXTAUTH_SECRET="your-nextauth-secret"
   STRIPE_PUBLISHABLE_KEY="your-stripe-key"
   OPENAI_API_KEY="your-openai-key"
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Mobile Development

### iOS Setup
```bash
npm install -g @ionic/cli
npx cap add ios
npx cap sync ios
npx cap open ios
```

### Android Setup
```bash
npx cap add android
npx cap sync android
npx cap open android
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15.2 with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Icons**: Lucide React + Iconify
- **State Management**: React Hooks + Context API

### Backend & Database
- **API**: Next.js API Routes
- **Database**: SQLite with TypeScript integration
- **Authentication**: NextAuth.js
- **File Storage**: Vercel Blob

### Mobile & PWA
- **Cross-Platform**: Capacitor for iOS/Android
- **PWA**: Next-PWA with offline support
- **Audio**: Web Speech API + Cloud TTS services

### AI & Services
- **AI**: OpenAI GPT integration
- **TTS**: Google Cloud Text-to-Speech
- **Payments**: Stripe for subscriptions
- **Analytics**: Built-in progress tracking

## 📁 Project Structure

```
voco/
├── app/                    # Next.js App Router pages
├── components/             # Reusable React components
│   ├── ui/                # Shadcn/ui components
│   ├── auth/              # Authentication components
│   ├── vocabulary/        # Learning components
│   └── ...
├── lib/                   # Utility functions and services
├── public/                # Static assets and data
│   ├── data/             # Vocabulary and topic data
│   └── icons/            # PWA icons
├── ios/                   # iOS Capacitor project
├── android/               # Android Capacitor project
└── styles/                # Global styles
```

## 🎯 Learning Modes

1. **Flashcards**: Traditional spaced repetition learning
2. **Multiple Choice**: Quick recognition exercises  
3. **Audio Practice**: Pronunciation and listening
4. **Writing Mode**: Spelling and memory reinforcement
5. **Speed Round**: Fast-paced vocabulary challenges

## 🌐 Supported Languages

- **Primary**: English, Spanish, French, German, Italian
- **Additional**: Portuguese, Dutch, Russian, Chinese, Japanese, Korean, Arabic, Turkish, Polish, Swedish

## 📊 Performance Features

- **Optimized Bundle Size**: Code splitting and lazy loading
- **Fast Rendering**: React 19 concurrent features
- **Efficient Caching**: Smart data fetching and storage
- **Offline Capability**: Service worker implementation

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Shadcn/ui** for the beautiful component library
- **OpenAI** for AI-powered features
- **Google Cloud** for text-to-speech services
- **Capacitor** for mobile app capabilities
- **Vercel** for hosting and deployment

## 📞 Support

- 📧 Email: support@vocabworld.app
- 🐛 Issues: [GitHub Issues](https://github.com/YOUR_USERNAME/voco/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/YOUR_USERNAME/voco/discussions)

---

<div align="center">
  Made with ❤️ for language learners worldwide
  
  **[Try VoCo Now](https://voco-app.vercel.app) | [Download Mobile App](#) | [Documentation](https://docs.vocabworld.app)**
</div>