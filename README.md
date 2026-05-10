# ⚡ Kairos Engine

> A Perplexity AI–inspired research engine powered by real-time web search and AI summarization.

![JavaScript](https://img.shields.io/badge/JavaScript-98.8%25-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=flat&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=flat&logo=react&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat)

---

## 📖 Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Environment Variables](#environment-variables)
- [Building for Production](#building-for-production)
- [Deploying to Render](#deploying-to-render)
  - [Deploy the Backend](#deploy-the-backend)
  - [Deploy the Frontend](#deploy-the-frontend)
  - [Localhost → Render URL Replacement](#localhost--render-url-replacement)
- [Contributing](#contributing)

---

## ✨ Features

- 🔍 Real-time web search with AI-generated summaries
- 💬 Follow-up question suggestions
- 🌐 Source citations with links
- ⚡ Fast, responsive React frontend
- 🔒 Secure API key management via environment variables

---

## 🗂 Project Structure

```
Kairos-Engine/
├── Backend/
│   ├── index.js          # Express server entry point
│   ├── routes/           # API route handlers
│   ├── .env              # Backend environment variables (gitignored)
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.jsx       # Root component
│   │   └── main.jsx      # Vite entry point
│   ├── .env              # Frontend environment variables (gitignored)
│   └── package.json
└── README.md
```

---

## 🛠 Prerequisites

Make sure you have the following installed before you begin:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18+ | https://nodejs.org |
| npm | v9+ | Comes with Node.js |
| Git | Latest | https://git-scm.com |

---

## 💻 Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/shayaan-git/Kairos-Engine.git
cd Kairos-Engine
```

---

### 2. Backend Setup

```bash
# Navigate to the Backend directory
cd Backend

# Install all dependencies
npm install

# Create your environment file
cp .env.example .env   # or manually create a .env file (see Environment Variables section)

# Start the development server
npm run dev
```

The backend will start at **http://localhost:3000** (or your configured `PORT`).

---

### 3. Frontend Setup

Open a **new terminal window** (keep the backend running):

```bash
# Navigate to the Frontend directory
cd Frontend

# Install all dependencies
npm install

# Create your environment file
cp .env.example .env   # or manually create a .env file

# Start the Vite development server
npm run dev
```

The frontend will start at **http://localhost:5173** and auto-open in your browser.

---

## 🔑 Environment Variables

### Backend — `Backend/.env`

```env
PORT=3000

# Search API (e.g. Tavily, SerpAPI, or Brave Search)
SEARCH_API_KEY=your_search_api_key_here

# AI Provider (e.g. OpenAI, Google Gemini, or Groq)
AI_API_KEY=your_ai_api_key_here

# (Optional) CORS origin for production
CORS_ORIGIN=http://localhost:5173
```

### Frontend — `Frontend/.env`

```env
# Points to your running backend server
VITE_API_URL=http://localhost:3000
```

> **Important:** Never commit `.env` files. They are already listed in `.gitignore`.

---

## 🏗 Building for Production

### Build the Frontend

```bash
cd Frontend
npm run build
```

This generates an optimized static bundle inside `Frontend/dist/`. You can preview it locally with:

```bash
npm run preview
```

### Prepare the Backend

The backend doesn't need a separate "build" step for Node.js/Express projects. Just ensure all dependencies are installed:

```bash
cd Backend
npm install --omit=dev   # install production deps only
```

Start the production backend with:

```bash
node index.js
# or if you have a start script:
npm start
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/shayaan-git">shayaan-git</a></p>
</div>