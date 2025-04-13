# ReactSparkPortfolio

[![GitHub license](https://img.shields.io/github/license/markhazleton/ReactSparkPortfolio)](https://github.com/markhazleton/ReactSparkPortfolio/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/markhazleton/ReactSparkPortfolio)](https://github.com/markhazleton/ReactSparkPortfolio/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/markhazleton/ReactSparkPortfolio)](https://github.com/markhazleton/ReactSparkPortfolio/issues)

A modern, responsive portfolio website built with React, TypeScript, and Vite. This project showcases a developer portfolio with various interactive components, dynamic content fetching, and a clean, professional design.

**Live Demo:** [https://markhazleton.github.io/ReactSparkPortfolio/](https://markhazleton.github.io/ReactSparkPortfolio/)

![ReactSparkPortfolio Screenshot](public/assets/img/project-screenshot.jpg)

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Components](#-project-components)
- [Getting Started](#-getting-started)
- [Development](#-development)
- [Building for Production](#-building-for-production)
- [Project Structure](#-project-structure)
- [SEO Implementation](#-seo-implementation)
- [Blog Posts](#-blog-posts)
- [License](#-license)

## ✨ Features

- **Responsive Design**: Optimized for all device sizes using Bootstrap 5
- **Dark/Light Mode**: Theme toggle with context-based state management
- **Dynamic Content**: RSS feed integration with fallback mechanism
- **Interactive Components**: Weather forecast, jokes API, and chat functionality
- **TypeScript Support**: Type-safe code for better developer experience
- **SEO Optimized**: Meta tags and structured data for improved search engine visibility
- **Modern Build System**: Fast development and optimized production builds with Vite

## 🛠️ Technology Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**:
  - Bootstrap 5
  - SCSS/Sass
  - Custom utility classes
- **State Management**: React Context API
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **APIs & Integration**:
  - OpenWeather API
  - JokeAPI
  - SignalR for real-time chat
  - RSS Feed parser
- **Maps**: Leaflet with React wrappers
- **SEO**: React Helmet Async
- **Deployment**: GitHub Pages

## 🧩 Project Components

The application includes several reusable components:

- **Hero**: Main landing section with profile information and quick links
- **Articles**: Dynamically fetches and displays blog posts from an RSS feed
- **Projects**: Displays project cards with details and links
- **Weather Forecast**: Interactive weather lookup with geolocation
- **Joke Generator**: Random joke fetcher with share functionality
- **Chat**: Real-time chat interface with SignalR backend integration
- **Theme Toggle**: Persistent dark/light mode switcher

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/markhazleton/ReactSparkPortfolio.git
   cd ReactSparkPortfolio
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## 💻 Development

The project uses Vite for fast development with hot module replacement (HMR).

```bash
# Start development server with SCSS watcher
npm run dev

# Lint the codebase
npm run lint
```

## 📦 Building for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

The build output is generated in the `docs` folder, ready for GitHub Pages deployment.

## 📁 Project Structure

```
ReactSparkPortfolio/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Local images and SVGs
│   ├── components/          # React components
│   │   ├── hooks/           # Custom React hooks
│   │   └── modules/         # Component modules
│   ├── contexts/            # React context providers
│   ├── css/                 # Compiled CSS files
│   ├── data/                # Static data (JSON, XML)
│   ├── models/              # TypeScript interfaces/types
│   ├── scss/                # SCSS source files
│   │   ├── components/      # Component-specific styles
│   │   ├── sections/        # Section styles
│   │   ├── utilities/       # Utility classes
│   │   └── variables/       # SCSS variables
│   ├── services/            # API and data services
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Application entry point
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## 🔍 SEO Implementation

The project implements SEO best practices:

- Semantic HTML5 markup
- Meta tags and Open Graph data via React Helmet Async
- Proper heading hierarchy
- Accessible alt text for images
- Structured data for rich search results
- Canonical URLs
- Mobile-friendly responsive design
- Fast loading with optimized assets

## 📝 Blog Posts

Learn more about this project from these detailed blog posts:

- [Building My First React Site Using Vite and GitHub](https://markhazleton.com/articles/building-my-first-react-site-using-vite.html)
- [Adding Weather to My Profile Application](https://markhazleton.com/articles/adding-weather-component-a-typescript-learning-journey.html)
- [Using TypeScript with React: Lessons Learned](https://markhazleton.com/articles/using-typescript-with-react-lessons-learned.html)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by [Mark Hazleton](https://markhazleton.com)
