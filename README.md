# ReactSparkPortfolio

[![GitHub license](https://img.shields.io/github/license/markhazleton/ReactSparkPortfolio)](https://github.com/markhazleton/ReactSparkPortfolio/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/markhazleton/ReactSparkPortfolio)](https://github.com/markhazleton/ReactSparkPortfolio/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/markhazleton/ReactSparkPortfolio)](https://github.com/markhazleton/ReactSparkPortfolio/issues)
[![Azure Static Web Apps CI/CD](https://github.com/markhazleton/ReactSparkPortfolio/workflows/Azure%20Static%20Web%20Apps%20CI/CD/badge.svg)](https://github.com/markhazleton/ReactSparkPortfolio/actions)

A modern, responsive portfolio website built with React 19, TypeScript, and Vite. This project showcases a developer portfolio with various interactive components, dynamic content fetching, and a clean, professional design.

**Live Demo:** [https://markhazleton.github.io/ReactSparkPortfolio/](https://markhazleton.github.io/ReactSparkPortfolio/)

![ReactSparkPortfolio Screenshot](public/assets/img/project-screenshot.jpg)

## 📋 Table of Contents

- [ReactSparkPortfolio](#reactsparkportfolio)
  - [📋 Table of Contents](#-table-of-contents)
  - [✨ Features](#-features)
  - [🛠️ Technology Stack](#️-technology-stack)
  - [🧩 Project Components](#-project-components)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [💻 Development](#-development)
  - [📦 Building for Production](#-building-for-production)
  - [📁 Project Structure](#-project-structure)
  - [🌐 Deployment](#-deployment)
    - [GitHub Pages](#github-pages)
    - [Azure Static Web Apps](#azure-static-web-apps)
  - [🔍 SEO Implementation](#-seo-implementation)
  - [📝 Blog Posts](#-blog-posts)
  - [📄 License](#-license)
  - [📞 Support \& Contact](#-support--contact)

## ✨ Features

- **Responsive Design**: Optimized for all device sizes using Bootstrap 5.3
- **Dark/Light Mode**: Theme toggle with context-based state management
- **Dynamic Content**: RSS feed integration with XML parsing and fallback mechanism
- **Interactive Components**: Weather forecast, jokes API, and chat functionality
- **TypeScript Support**: Type-safe code with strict type checking for better developer experience
- **SEO Optimized**: Meta tags and structured data for improved search engine visibility
- **Modern Build System**: Fast development and optimized production builds with Vite 6.3
- **Serverless Backend**: Azure Functions for API capabilities without managing infrastructure
- **Dual Deployment**: Configured for both GitHub Pages and Azure Static Web Apps
- **CI/CD Pipeline**: Automated deployments through GitHub Actions

## 🛠️ Technology Stack

- **Frontend Framework**: React 19.1
- **Language**: TypeScript 5.8 with strict type checking
- **Build Tool**: Vite 6.3
- **Styling**:
  - Bootstrap 5.3.5
  - SCSS/Sass with component-level styles
  - React Bootstrap 2.10.9
  - Bootstrap Icons 1.11.3
- **State Management**: React Context API
- **Routing**: React Router v7.5
- **HTTP Client**: Axios 1.8.4
- **APIs & Integration**:
  - OpenWeather API
  - JokeAPI
  - SignalR 8.0.7 for real-time chat
  - XML2JS 0.6.2 for RSS feed parsing
- **Maps**: Leaflet with React Leaflet wrappers
- **Markdown Rendering**: React Markdown 10.1.0
- **Date Handling**: Date-fns 4.1.0
- **Code Syntax Highlighting**: Prism.js 1.30.0
- **SEO**: Structured data and meta tags
- **Deployment**:
  - GitHub Pages (via docs folder)
  - Azure Static Web Apps with GitHub Actions

## 🧩 Project Components

The application includes several reusable components:

- **Hero**: Main landing section with profile information and quick links
- **Articles**: Dynamically fetches and displays blog posts from an RSS feed
- **Projects**: Displays project cards with details and links
- **Weather Forecast**: Interactive weather lookup with geolocation
- **Joke Generator**: Random joke fetcher with share functionality
- **Chat**: Real-time chat interface with SignalR backend integration
- **Theme Toggle**: Persistent dark/light mode switcher using context
- **Map Component**: Interactive location display using React Leaflet

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

The project uses Vite for fast development with hot module replacement (HMR) and SCSS compilation.

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

The build output is generated in the `docs` folder, ready for GitHub Pages or Azure Static Web Apps deployment.

## 📁 Project Structure

```
ReactSparkPortfolio/
├── public/                  # Static assets served as-is
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
│   │   ├── _global.scss     # Global styles
│   │   ├── _variables.scss  # SCSS variables
│   │   └── custom.scss      # Bootstrap customization
│   ├── services/            # API and data services
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Application entry point
├── api/                     # Azure Functions API
│   └── proxy-rss/           # RSS proxy function
├── docs/                    # Production build output
├── .github/                 # GitHub workflows and configs
│   └── workflows/           # CI/CD pipeline configs 
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
├── staticwebapp.config.json # Azure Static Web Apps config
├── swa-cli.config.json      # SWA CLI configuration
└── package.json             # Dependencies and scripts
```

## 🌐 Deployment

### GitHub Pages

This project is configured for GitHub Pages deployment via the `docs` folder:

1. **Build the Project**:

   ```bash
   npm run build
   ```

   This will generate the production-ready files in the `docs` folder.

2. **Push to GitHub**:
   Ensure the `docs` folder is committed and pushed to the `main` branch of your repository.

3. **Enable GitHub Pages**:
   - Go to your repository on GitHub.
   - Navigate to **Settings** > **Pages**.
   - Under "Source," select the `main` branch and set the folder to `/docs`.
   - Save the changes.

4. **Access Your Site**:
   Your site will be available at `https://<your-username>.github.io/<repository-name>/`.

### Azure Static Web Apps

This project is also configured for Azure Static Web Apps deployment with CI/CD:

1. **Configuration Files**:
   - `staticwebapp.config.json`: Defines routing, headers, and fallback behaviors
   - `swa-cli.config.json`: Configuration for the Static Web Apps CLI
   - `.github/workflows/azure-static-web-apps-*.yml`: CI/CD workflow definition

2. **Automated Deployment**:
   Every push to the `main` branch triggers the GitHub Actions workflow that:
   - Checks out the code
   - Sets up Node.js environment
   - Installs dependencies
   - Builds the application
   - Deploys to Azure Static Web Apps

3. **Key Features**:
   - **Global CDN**: Content delivered from edge locations closest to users
   - **Free SSL Certificates**: Automatic HTTPS with managed certificates
   - **Built-in API Backend**: Serverless Azure Functions integration
   - **Staging Environments**: Preview deployments for pull requests
   - **Route Customization**: Advanced routing via configuration
   - **Cost Efficiency**: Free tier available for personal projects

4. **Local Development with SWA CLI**:
   For testing the Azure Static Web Apps configuration locally:

   ```bash
   npm install -g @azure/static-web-apps-cli
   swa start
   ```

## 🔍 SEO Implementation

The project implements SEO best practices:

- Semantic HTML5 markup
- Meta tags and Open Graph data via structured JSON-LD
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

## 📞 Support & Contact

If you encounter any issues, have questions, or want to contribute to this project:

1. **Open an Issue**: Please use the [GitHub Issues](https://github.com/markhazleton/ReactSparkPortfolio/issues) page to report bugs, request features, or ask questions.
2. **Pull Requests**: Contributions are welcome! Please feel free to submit a Pull Request.

All support requests and questions should be directed through GitHub Issues rather than through direct contact.

---

Built with ❤️ by the ReactSparkPortfolio community. [Report an issue](https://github.com/markhazleton/ReactSparkPortfolio/issues/new)
