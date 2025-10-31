# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Disney Plus Clone** streaming platform built as a **monorepo** with separate frontend and backend workspaces. The frontend is a Next.js 15 application with modern UI components, while the backend is an Express.js API.

**GitHub Repository**: https://github.com/kydogg/disney-plus
**Current Branch**: develop (default development branch)

### Workspace-Specific Documentation

For detailed workspace-specific guidance:
- **Frontend**: See `frontend/CLAUDE.md` for Next.js, React, and UI development
- **Backend**: See `backend/CLAUDE.md` for Express.js, API, and server development
- **Root**: This file (monorepo structure, workflows, deployment)

## Monorepo Structure

```
disney-plus/
├── frontend/                      # Next.js 15 app with App Router
│   ├── app/                      # Next.js pages (App Router)
│   ├── components/               # React components
│   │   └── ui/                  # shadcn/ui components
│   ├── lib/                      # Utility functions
│   ├── __tests__/                # Jest tests
│   ├── public/                   # Static assets
│   ├── CLAUDE.md                # Frontend-specific docs
│   └── package.json             # Frontend dependencies
├── backend/                       # Express.js API
│   ├── src/                      # Source code
│   │   └── index.ts            # Main entry point
│   ├── test/                     # Vitest tests
│   ├── CLAUDE.md                # Backend-specific docs
│   └── package.json             # Backend dependencies
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              # CI/CD pipeline
│   │   └── coderabbit.yml      # CodeRabbit AI integration
│   └── pull_request_template.md
├── CLAUDE.md                     # This file (root documentation)
├── BRANCHING_STRATEGY.md        # Git Flow workflow guide
├── README.md                     # Project quick start
├── .gitignore                    # Root gitignore
└── package.json                  # Root workspace configuration
```

This is an **npm workspaces** monorepo. Each workspace has its own package.json and can be developed independently. All dependencies are hoisted to the root `node_modules` for efficiency.

## Commands

### Frontend (Next.js)

Run from the **frontend** directory:

```bash
# Development server (with Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint
```

### Backend (Express.js)

Run from the **backend** directory:

```bash
# Development server (with hot reload)
npm run dev

# Build TypeScript
npm run build

# Start production server
npm start

# Run tests
npm test
```

### Root-level Commands

Run from the **monorepo root** (`/disney-plus`):

```bash
# Install all dependencies for both workspaces
npm install

# Run both frontend and backend concurrently
npm run dev

# Run frontend only
npm run dev:frontend

# Run backend only
npm run dev:backend

# Build frontend for production
npm run build:frontend

# Build backend for production
npm run build:backend

# Lint frontend
npm run lint:frontend

# Run all tests
npm test
```

## Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3, shadcn/ui components
- **Testing**: Jest with React Testing Library
- **State Management**: React hooks
- **UI Components**: Radix UI primitives via shadcn/ui

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Testing**: Vitest
- **Development**: tsx (TypeScript Execute)

## Architecture

### Frontend Architecture

#### Routing
- **App Router**: Next.js 15 App Router with server components
- **Pages**: Located in `frontend/app/`
- **Layouts**: Nested layouts in `frontend/app/layout.tsx`

#### Components Structure
- **UI Components**: shadcn/ui components in `components/ui/`
- **Feature Components**: Custom components in `components/`
- **Utilities**: Helper functions in `lib/`

#### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **CSS Variables**: Design tokens for theming
- **Dark Mode**: Built-in support via Tailwind
- **Component Variants**: class-variance-authority for component variants

### Backend Architecture

- **Entry Point**: `src/index.ts` - Express app with CORS middleware
- **Routes**: RESTful API endpoints
- **Middleware**: CORS, JSON parsing, error handling

### Data Model
To be implemented based on project requirements.

## Testing Strategy

### Frontend Testing
- **Unit Tests**: Jest + React Testing Library
- **Location**: `frontend/__tests__/`
- **Coverage**: All components and utilities must have tests
- **Convention**: `ComponentName.test.tsx` or `functionName.test.ts`

### Backend Testing
- **Unit Tests**: Vitest
- **Location**: `backend/test/`
- **Coverage**: All routes and business logic must have tests
- **Convention**: `feature.test.ts`

### Test Requirements
**IMPORTANT**: Every component and feature MUST have corresponding unit tests written before pushing to any branch. This ensures:
1. High code quality
2. Regression prevention
3. Better code design
4. Faster debugging

## Git Workflow

This project follows a **Git Flow** branching strategy (see `BRANCHING_STRATEGY.md`):

- **`main`** - Production releases (tagged, protected)
- **`develop`** - Active development (default branch, current)
- **`feature/*`** - For new features
- **`bugfix/*`** - For bug fixes
- **`hotfix/*`** - For urgent production fixes

### Commit Format
```
<type>(<scope>): <description>

Types: feat, fix, docs, style, refactor, test, chore
Scopes: frontend, backend, shared, root
```

Examples:
- `feat(frontend): add video player component`
- `fix(backend): resolve CORS issue`
- `test(frontend): add button component tests`
- `chore(root): update dependencies`

### CodeRabbit Integration
**CodeRabbit AI** automatically reviews all pull requests to `develop` and `main` branches.

**Best Practices for CodeRabbit:**
1. Create a feature branch immediately when starting new work
2. Open a PR as soon as you have initial code (even if not complete)
3. CodeRabbit will provide real-time feedback on:
   - Code quality
   - Potential bugs
   - Security issues
   - Best practices
   - Test coverage
4. Address CodeRabbit's feedback before requesting human review

### Feature Branch Workflow
```bash
# Create feature branch from develop
git checkout develop
git pull
git checkout -b feature/frontend/video-player

# Make changes and commit
git add .
git commit -m "feat(frontend): add video player component"

# Push and create PR
git push origin feature/frontend/video-player
gh pr create --base develop

# CodeRabbit will automatically review
# Address feedback, make changes, push again
# Merge when approved
```

### When to Use Feature Branches

✅ **Always use feature branch + PR:**
- Any new feature (regardless of size)
- Bug fixes
- Refactors
- Dependency updates
- Any code you want reviewed

⚠️ **Direct commits to develop only for:**
- Emergency hotfixes (followed by immediate PR to main)
- Documentation updates (README, CLAUDE.md, etc.)

### Quick Commands
```bash
# Create feature branch
git checkout -b feature/frontend/component-name

# Create PR to develop (triggers CodeRabbit)
gh pr create --base develop

# Merge develop to main for release
gh pr create --base main --head develop --title "Release v1.0.0"
```

## Environment Configuration

### Frontend Environment (`.env.local`)
```env
# Add environment variables here as needed
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend Environment (`.env`)
```env
PORT=3001
NODE_ENV=development
```

**Important**: Never commit `.env` or `.env.local` files. Use `.env.example` for documentation.

## Development Workflow

1. **Install dependencies** (from root): `npm install`
2. **Start dev servers** (from root): `npm run dev`
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3001
3. **Make changes** in either workspace
4. **Write tests** for all new code
5. **Run tests** before committing
6. **Create feature branch and PR** for CodeRabbit review
7. **Commit using conventional commits**

## Important Implementation Details

### Frontend
- **Routing**: Next.js App Router with Server Components where possible
- **Styling**: Tailwind CSS with design tokens via CSS variables
- **Components**: shadcn/ui for consistent, accessible UI components
- **Type Safety**: Full TypeScript coverage with strict mode
- **Testing**: Jest + React Testing Library for all components

### Backend
- **API Design**: RESTful API with proper HTTP methods
- **Error Handling**: Centralized error handling middleware
- **Type Safety**: Full TypeScript coverage
- **CORS**: Configured for frontend origin
- **Testing**: Vitest for API endpoint testing

## Key Files

### Frontend
- `app/layout.tsx` - Root layout with global styles
- `app/page.tsx` - Home page
- `components/ui/` - shadcn/ui components
- `lib/utils.ts` - Utility functions
- `tailwind.config.ts` - Tailwind configuration
- `jest.config.js` - Jest configuration
- `components.json` - shadcn/ui configuration

### Backend
- `src/index.ts` - Main Express app
- `tsconfig.json` - TypeScript configuration

### Root
- `package.json` - Workspace configuration
- `CLAUDE.md` - This file (guidance for Claude Code)
- `BRANCHING_STRATEGY.md` - Git workflow documentation
- `.github/workflows/` - GitHub Actions workflows

## Code Quality Standards

### All Code Must:
1. **Have tests** - No exceptions
2. **Pass linting** - Run `npm run lint` before committing
3. **Be typed** - No `any` types unless absolutely necessary
4. **Follow conventions** - Use established patterns
5. **Be reviewed** - All changes go through PR + CodeRabbit review

### Component Checklist
Before pushing any component:
- [ ] Component implementation complete
- [ ] Unit tests written and passing
- [ ] TypeScript types defined
- [ ] Accessible (ARIA labels, keyboard navigation)
- [ ] Responsive design
- [ ] Documentation comments
- [ ] Feature branch created
- [ ] PR opened for CodeRabbit review

## CodeRabbit Configuration

CodeRabbit is configured to:
- Review all PRs to `develop` and `main`
- Check code quality and best practices
- Verify test coverage
- Identify security issues
- Suggest improvements
- Enforce conventional commits

**To get the most from CodeRabbit:**
1. Open PRs early (draft PRs are fine)
2. Keep PRs focused and reasonably sized
3. Respond to feedback constructively
4. Use CodeRabbit's suggestions to learn

## Deployment

### Frontend
- **Platform**: Vercel (recommended) or other Next.js hosting
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Environment Variables**: Set in platform dashboard

### Backend
- **Platform**: Railway, Render, or other Node.js hosting
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Environment Variables**: Set in platform dashboard

## Project Status

### Completed ✅
- [x] Monorepo structure with npm workspaces
- [x] Frontend: Next.js 15 + Tailwind CSS + shadcn/ui
- [x] Backend: Express.js + TypeScript
- [x] Testing frameworks (Jest + Vitest)
- [x] Git Flow with develop branch
- [x] GitHub Actions CI/CD pipeline
- [x] CodeRabbit integration configured
- [x] Comprehensive documentation
- [x] Repository pushed to GitHub

### In Progress 🚧
- [ ] Implement database layer (Prisma/MongoDB)
- [ ] Add authentication system
- [ ] Create movie API endpoints
- [ ] Build video player component
- [ ] Design homepage layout

### Planned 📋
- [ ] Add E2E tests with Playwright
- [ ] Set up error tracking (Sentry)
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Implement file upload for videos/images
- [ ] Add user profiles and watchlists
- [ ] Implement search functionality
- [ ] Add video streaming optimization
- [ ] Deploy to production (Vercel + Railway/Render)

## Getting Help

- Check this file first for project-specific guidance
- Review `BRANCHING_STRATEGY.md` for git workflow
- Check GitHub issues for known problems
- Use CodeRabbit feedback to improve code quality

## Development Principles

### Code Quality Standards
1. **Test-Driven Development**: Write tests BEFORE or WITH implementation
2. **Type Safety**: Use TypeScript strictly, avoid `any` types
3. **Code Review**: All code goes through PR + CodeRabbit review
4. **Clean Code**: Follow SOLID principles, keep functions small
5. **Documentation**: Document complex logic with comments

### Performance Principles
1. **Frontend**: Server Components by default, Client Components only when needed
2. **Backend**: Implement caching strategies for frequently accessed data
3. **Images**: Always use Next.js Image component for optimization
4. **Database**: Index frequently queried fields, use connection pooling
5. **API**: Implement pagination for list endpoints

### Security Principles
1. **Input Validation**: Always validate and sanitize user input
2. **Authentication**: Implement secure token-based authentication
3. **Authorization**: Check permissions before operations
4. **Environment Variables**: Never commit secrets, use environment variables
5. **CORS**: Configure CORS properly for production

## Recent Changes

**October 30, 2024**
- ✅ Initial monorepo setup complete
- ✅ Frontend: Next.js 15 + Tailwind + shadcn/ui configured
- ✅ Backend: Express.js + TypeScript configured
- ✅ Testing frameworks configured (Jest + Vitest)
- ✅ Git Flow with develop branch established
- ✅ GitHub repository created and pushed
- ✅ CI/CD pipeline configured with GitHub Actions
- ✅ CodeRabbit integration set up
- ✅ Comprehensive documentation (3 CLAUDE.md files)
- ✅ PR template and workflows configured
- Remember the processing of establishing the entire workflow of this app when all checks pass and all github actions pass