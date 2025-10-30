# Disney Plus Clone

A modern streaming platform clone built with Next.js, TypeScript, and Express.js in a monorepo structure.

## 🚀 Project Structure

```
disney-plus/
├── frontend/          # Next.js 15 + Tailwind + shadcn/ui
├── backend/           # Express.js + TypeScript API
├── CLAUDE.md         # AI assistant guidance
├── BRANCHING_STRATEGY.md  # Git workflow
└── package.json      # Workspace configuration
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **UI Components**: shadcn/ui (Radix UI)
- **Testing**: Jest + React Testing Library

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Testing**: Vitest

## 📋 Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0

## 🚦 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd disney-plus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Frontend
   cp frontend/.env.example frontend/.env.local

   # Backend
   cp backend/.env.example backend/.env
   ```

4. **Start development servers**
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001

## 📜 Available Scripts

### Root Level
```bash
npm run dev              # Run both frontend and backend
npm run build            # Build both workspaces
npm test                 # Run all tests
npm run dev:frontend     # Run frontend only
npm run dev:backend      # Run backend only
```

### Frontend
```bash
cd frontend
npm run dev              # Start dev server with Turbopack
npm run build            # Build for production
npm test                 # Run tests
npm run lint             # Lint code
```

### Backend
```bash
cd backend
npm run dev              # Start dev server with hot reload
npm run build            # Build TypeScript
npm test                 # Run tests
```

## 🧪 Testing

All components and features must have unit tests. Run tests before committing:

```bash
npm test
```

## 🌿 Git Workflow

We use **Git Flow** with **CodeRabbit AI** for code review.

### Branch Structure
- `main` - Production (protected)
- `develop` - Development (default branch)
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Creating a Feature
```bash
git checkout develop
git pull
git checkout -b feature/frontend/video-player
# Make changes
git add .
git commit -m "feat(frontend): add video player component"
git push origin feature/frontend/video-player
gh pr create --base develop  # Triggers CodeRabbit review
```

See [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) for detailed workflow.

## 🤖 CodeRabbit Integration

CodeRabbit automatically reviews all pull requests for:
- Code quality and best practices
- Security vulnerabilities
- Test coverage
- TypeScript type safety
- Performance issues

**Best Practice**: Open PRs early (even as drafts) to get immediate feedback.

## 📚 Documentation

- [CLAUDE.md](./CLAUDE.md) - Detailed project documentation for AI assistants
- [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) - Git workflow and conventions

## 🔧 Development Guidelines

### Code Quality
- ✅ Write tests for all components and features
- ✅ Use TypeScript strict mode
- ✅ Follow conventional commit format
- ✅ Create feature branches and PRs
- ✅ Wait for CodeRabbit approval

### Commit Format
```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore
Scopes: frontend, backend, shared, root
```

Examples:
```bash
feat(frontend): add video player component
fix(backend): resolve CORS issue
test(frontend): add button component tests
```

## 📦 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
```

### Backend (Railway/Render)
```bash
cd backend
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a PR for CodeRabbit review
5. Address feedback
6. Merge when approved

## 📄 License

MIT

## 👤 Author

Your Name

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- shadcn for the beautiful UI components
- Vercel for hosting and deployment
