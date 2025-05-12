# ReactSparkPortfolio

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/markhazleton/ReactSparkPortfolio?tab=MIT-1-ov-file)
[![GitHub stars](https://img.shields.io/github/stars/markhazleton/ReactSparkPortfolio)](https://github.com/markhazleton/ReactSparkPortfolio/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/markhazleton/ReactSparkPortfolio)](https://github.com/markhazleton/ReactSparkPortfolio/issues)
[![Azure Static Web Apps CI/CD](https://github.com/markhazleton/ReactSparkPortfolio/workflows/Azure%20Static%20Web%20Apps%20CI/CD/badge.svg)](https://github.com/markhazleton/ReactSparkPortfolio/actions)

---

## 🚀 Project Overview

**ReactSparkPortfolio** is a modern, high-performance, and accessible developer portfolio built with React 19, TypeScript, and Vite. It demonstrates best practices in frontend engineering, serverless API integration (Azure Functions), and dual deployment (Azure Static Web Apps & GitHub Pages). The project is designed as both a personal portfolio and a reference implementation for scalable, maintainable, and extensible web apps.

- **Live Demo:** [reactspark.markhazleton.com](https://reactspark.markhazleton.com/)
- **Author:** Mark Hazleton
- **Purpose:** Showcase dynamic content, real-time features, and cloud-native deployment using modern web technologies.

---

## 📋 Table of Contents

- [ReactSparkPortfolio](#reactsparkportfolio)
  - [🚀 Project Overview](#-project-overview)
  - [📋 Table of Contents](#-table-of-contents)
  - [✨ Features](#-features)
  - [🛠️ Technology Stack](#️-technology-stack)
  - [📁 Project Structure](#-project-structure)
  - [🚀 Getting Started](#-getting-started)
    - [Environment \& Configuration](#environment--configuration)
    - [Installation](#installation)
    - [Scripts](#scripts)
    - [Development](#development)
    - [Linting \& Code Quality](#linting--code-quality)
  - [📦 Building for Production](#-building-for-production)
  - [🧪 Testing](#-testing)
  - [🌐 Deployment](#-deployment)
    - [GitHub Pages](#github-pages)
    - [Azure Static Web Apps](#azure-static-web-apps)
  - [🛡️ Maintenance \& Updating](#️-maintenance--updating)
  - [♿ Accessibility, Security \& Performance](#-accessibility-security--performance)
  - [🤝 Contributing](#-contributing)
  - [❓ FAQ \& Troubleshooting](#-faq--troubleshooting)
  - [🔍 SEO Implementation](#-seo-implementation)
  - [📝 Blog Posts](#-blog-posts)
  - [📄 License](#-license)
  - [📞 Support \& Contact](#-support--contact)

---

## ✨ Features

- **Responsive Design**: Mobile-first, accessible, and optimized for all device sizes (Bootstrap 5.3)
- **Dark/Light Mode**: Theme toggle with persistent context-based state
- **Dynamic Content**: RSS feed integration, real-time weather, jokes, and chat
- **TypeScript**: Strict type safety and modern React patterns
- **SEO Optimized**: Meta tags, Open Graph, and JSON-LD structured data
- **Serverless Backend**: Azure Functions for API/data proxying
- **Dual Deployment**: GitHub Pages & Azure Static Web Apps (with CI/CD)
- **CI/CD**: Automated builds and deployments via GitHub Actions
- **Accessibility**: Semantic HTML, ARIA, and color contrast best practices
- **Performance**: Lazy loading, code splitting, and optimized assets

## 🛠️ Technology Stack

- **Frontend**: React 19.1, TypeScript 5.8, Vite 6.3
- **Styling**: Bootstrap 5.3.5, SCSS/Sass, React Bootstrap, Bootstrap Icons
- **State Management**: React Context API
- **Routing**: React Router v7.5
- **APIs**: Axios, OpenWeather, JokeAPI, SignalR (real-time chat), XML2JS (RSS)
- **Maps**: Leaflet & React Leaflet
- **Markdown**: React Markdown
- **Date Handling**: date-fns
- **Syntax Highlighting**: Prism.js
- **Serverless**: Azure Functions (API)
- **CI/CD**: GitHub Actions
- **Deployment**: Azure Static Web Apps, GitHub Pages

## 📁 Project Structure

```
ReactSparkPortfolio/
├── public/                  # Static assets
├── src/
│   ├── assets/             # Images, SVGs
│   ├── components/         # React components (hooks/, modules/)
│   ├── contexts/           # React context providers
│   ├── css/                # Compiled CSS
│   ├── data/               # Static data (JSON, XML)
│   ├── models/             # TypeScript interfaces/types
│   ├── scss/               # SCSS source files (components/, utilities/, variables/)
│   ├── services/           # API/data services
│   ├── App.tsx             # Main app
│   └── main.tsx            # Entry point
├── api/                    # Azure Functions (serverless API)
├── docs/                   # Production build output
├── .github/                # Workflows, issue/PR templates
├── scripts/                # Utility scripts (SEO, robots.txt, etc.)
├── vite.config.ts          # Vite config
├── tsconfig.json           # TypeScript config
├── staticwebapp.config.json# Azure SWA config
├── swa-cli.config.json     # SWA CLI config
└── package.json            # Dependencies & scripts
```

## 🚀 Getting Started

### Environment & Configuration

- **Node.js**: v18 or higher
- **npm**: v9+ recommended
- **.env files**: Supports environment-specific config via `.env`, `.env.development`, `.env.production`, etc. See `vite.config.ts` for details.
- **Required Variables**: (example)
  - `VITE_BASE_URL` - Base URL for the app
  - `OPENWEATHER_API_KEY` - (if using direct weather API)
  - See `vite.config.ts` and service files for more

### Installation

```pwsh
# Clone the repository
git clone https://github.com/markhazleton/ReactSparkPortfolio.git
cd ReactSparkPortfolio

# Install dependencies
npm install
```

### Scripts

| Script                | Description                                      |
|----------------------|--------------------------------------------------|
| `npm run dev`         | Start dev server with HMR and SCSS watcher       |
| `npm run build`       | Build production bundle (outputs to `docs/`)     |
| `npm run preview`     | Preview local production build                   |
| `npm run lint`        | Lint codebase with ESLint                        |
| `npm run clean`       | Remove build artifacts and cache                 |
| `npm run build-css`   | Compile SCSS to CSS                             |
| `npm run watch-css`   | Watch and auto-compile SCSS                     |
| `npm run generate-sitemap` | Generate sitemap.xml                        |
| `npm run generate-robots`  | Generate robots.txt                         |
| `npm run generate-seo-files` | Generate all SEO files                   |

### Development

```pwsh
npm run dev
# Open http://localhost:3000
```

### Linting & Code Quality

- **Lint**: `npm run lint` (uses ESLint, see `eslint.config.js`)
- **Type Checking**: TypeScript strict mode enabled
- **Formatting**: (Recommend using Prettier or VSCode default)

## 📦 Building for Production

```pwsh
npm run build
npm run preview # (optional, to preview build)
```

- Output is in `docs/` (for GitHub Pages & Azure SWA)

## 🧪 Testing

- _No automated tests included yet._
- **Manual Testing**: Use the live demo or local preview to verify features.
- **Recommended**: Add unit/integration tests with Jest, React Testing Library, or Cypress.

## 🌐 Deployment

### GitHub Pages

1. **Build**: `npm run build` (outputs to `docs/`)
2. **Push**: Commit and push `docs/` to `main` branch
3. **Enable Pages**: In GitHub repo settings, set Pages source to `/docs` on `main`
4. **Access**: `https://<your-username>.github.io/<repository-name>/`

### Azure Static Web Apps

1. **Config Files**:
   - `staticwebapp.config.json`, `swa-cli.config.json`, `.github/workflows/azure-static-web-apps-*.yml`
2. **CI/CD**: Every push to `main` triggers GitHub Actions to build and deploy
3. **Local Dev**:

   ```pwsh
   npm install -g @azure/static-web-apps-cli
   swa start
   ```

4. **Features**:
   - Global CDN, SSL, serverless API, staging environments, advanced routing

## 🛡️ Maintenance & Updating

- **Dependencies**: Run `npm outdated` and `npm update` regularly
- **Security**: Use `npm audit` and keep dependencies patched
- **Azure Best Practices**: Use managed identity, never hardcode secrets, follow [Azure security guidance](https://learn.microsoft.com/en-us/azure/security/)
- **Accessibility**: Test with screen readers and color contrast tools
- **Performance**: Audit with Lighthouse, optimize images/assets

## ♿ Accessibility, Security & Performance

- **Accessibility**: Semantic HTML, ARIA, alt text, keyboard navigation, color contrast
- **Security**: No secrets in code, uses environment variables, follows Azure best practices
- **Performance**: Lazy loading, code splitting, optimized assets, CDN delivery

## 🤝 Contributing

Contributions are welcome!

- **Issues**: Use [GitHub Issues](https://github.com/markhazleton/ReactSparkPortfolio/issues)
- **Pull Requests**: Fork, branch, and submit PRs
- **Code Style**: Follow existing TypeScript/React patterns and lint rules
- **Templates**: See `.github/ISSUE_TEMPLATE/` for bug/feature templates

## ❓ FAQ & Troubleshooting

- **Q: Build fails on Windows?**
  - A: Ensure Node.js v18+, use PowerShell, and check for locked files in `node_modules`.
- **Q: Weather/Chat/API not working?**
  - A: Check environment variables and API keys.
- **Q: Styling issues?**
  - A: Run `npm run build-css` and ensure SCSS compiles without errors.
- **Q: How do I update dependencies?**
  - A: `npm update` and review changelogs for breaking changes.

## 🔍 SEO Implementation

- Semantic HTML5, meta tags, Open Graph, JSON-LD, canonical URLs, mobile-friendly, fast loading
- See `index.html` and SEO context for implementation details

## 📝 Blog Posts

- [Building My First React Site Using Vite and GitHub](https://markhazleton.com/articles/building-my-first-react-site-using-vite.html)
- [Adding Weather to My Profile Application](https://markhazleton.com/articles/adding-weather-component-a-typescript-learning-journey.html)
- [Using TypeScript with React: Lessons Learned](https://markhazleton.com/articles/using-typescript-with-react-lessons-learned.html)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/markhazleton/ReactSparkPortfolio/issues)
- **Pull Requests**: Welcome!
- **General Questions**: Please use GitHub Issues for all support and contact

---

Built with ❤️ by the ReactSparkPortfolio community. [Report an issue](https://github.com/markhazleton/ReactSparkPortfolio/issues/new)
