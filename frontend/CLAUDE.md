# Frontend CLAUDE.md

This file provides frontend-specific guidance to Claude Code when working in the frontend workspace.

## Frontend Overview

This is the **Disney Plus Clone Frontend** - a Next.js 15 application with App Router, Tailwind CSS, and shadcn/ui components.

**Location**: `/frontend` directory in the monorepo
**Repository**: https://github.com/kydogg/disney-plus

## Quick Start

```bash
# From frontend directory
npm install
npm run dev          # Start dev server (http://localhost:3000)
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run lint         # Lint code
npm run build        # Build for production
```

## Tech Stack

### Core
- **Framework**: Next.js 15.0.0 with App Router
- **React**: 19.0.0 (latest)
- **TypeScript**: 5.x with strict mode
- **Build Tool**: Turbopack (Next.js 15 default)

### Styling
- **Tailwind CSS**: 3.4.0 - Utility-first CSS framework
- **PostCSS**: For CSS processing
- **CSS Variables**: For theming and design tokens
- **shadcn/ui**: Beautifully designed components built with Radix UI
- **class-variance-authority**: Type-safe component variants
- **tailwind-merge**: Efficient className merging
- **tailwindcss-animate**: Animation utilities

### UI Components
- **shadcn/ui Components**: Pre-built accessible components
- **Radix UI Primitives**: Underlying primitives for shadcn/ui
- **Lucide React**: Icon library
- **Style**: "new-york" variant of shadcn/ui

### Testing
- **Jest**: 29.7.0 - Testing framework
- **React Testing Library**: 14.1.2 - Component testing
- **@testing-library/jest-dom**: Custom matchers

### Development
- **ESLint**: Next.js ESLint config with TypeScript
- **next/font**: Optimized font loading (Geist Sans & Mono)

## Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout (fonts, metadata)
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles, Tailwind, CSS vars
│   └── [feature]/               # Feature-based routes
├── components/
│   ├── ui/                      # shadcn/ui components
│   │   └── button.tsx           # Example: Button component
│   ├── [feature]/               # Feature-specific components
│   └── shared/                  # Shared components
├── lib/
│   └── utils.ts                 # Utility functions (cn helper)
├── __tests__/
│   ├── components/              # Component tests
│   └── lib/                     # Utility tests
├── public/                      # Static assets
├── components.json              # shadcn/ui configuration
├── tailwind.config.ts           # Tailwind configuration
├── jest.config.js               # Jest configuration
├── jest.setup.js                # Jest setup (test-environment)
├── tsconfig.json                # TypeScript configuration
├── next.config.ts               # Next.js configuration
└── package.json                 # Dependencies and scripts
```

## Development Guidelines

### 1. Creating New Components

#### Feature Components
```tsx
// components/video/VideoPlayer.tsx
'use client'; // Only if client-side interactivity needed

import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  src: string;
  title: string;
  className?: string;
}

export function VideoPlayer({ src, title, className }: VideoPlayerProps) {
  return (
    <div className={cn("relative aspect-video", className)}>
      {/* Implementation */}
    </div>
  );
}
```

#### shadcn/ui Components
```bash
# Install new shadcn/ui components
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
```

Components are added to `components/ui/` and can be customized.

### 2. Writing Tests

**CRITICAL**: Every component must have tests before pushing.

```tsx
// __tests__/components/video/VideoPlayer.test.tsx
import { render, screen } from '@testing-library/react';
import { VideoPlayer } from '@/components/video/VideoPlayer';

describe('VideoPlayer', () => {
  it('renders with correct title', () => {
    render(<VideoPlayer src="/test.mp4" title="Test Video" />);
    expect(screen.getByText('Test Video')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <VideoPlayer src="/test.mp4" title="Test" className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
```

### 3. Styling Best Practices

#### Use Tailwind Classes
```tsx
// ✅ Good - Tailwind utility classes
<div className="flex items-center gap-4 rounded-lg bg-card p-4 shadow-lg">
  <h2 className="text-2xl font-bold">Title</h2>
</div>
```

#### Use cn() for Conditional Classes
```tsx
// ✅ Good - Using cn() helper
import { cn } from "@/lib/utils";

<button
  className={cn(
    "rounded-md px-4 py-2",
    isActive && "bg-primary text-primary-foreground",
    !isActive && "bg-secondary text-secondary-foreground"
  )}
/>
```

#### Use CSS Variables for Theming
```tsx
// globals.css defines CSS variables
// Use semantic color names
<div className="bg-background text-foreground border-border">
  <Card className="bg-card text-card-foreground">
    <Button variant="destructive">Delete</Button>
  </Card>
</div>
```

### 4. Next.js App Router Patterns

#### Server Components (Default)
```tsx
// app/movies/page.tsx
// Server Component by default - no 'use client'
async function MoviesPage() {
  const movies = await fetchMovies(); // Direct API calls

  return (
    <div>
      {movies.map(movie => <MovieCard key={movie.id} movie={movie} />)}
    </div>
  );
}
```

#### Client Components
```tsx
// components/interactive/LikeButton.tsx
'use client'; // Required for interactivity

import { useState } from 'react';

export function LikeButton() {
  const [liked, setLiked] = useState(false);

  return (
    <button onClick={() => setLiked(!liked)}>
      {liked ? '❤️' : '🤍'}
    </button>
  );
}
```

#### Layouts
```tsx
// app/movies/layout.tsx
export default function MoviesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto p-4">
      <nav>{/* Movie navigation */}</nav>
      {children}
    </div>
  );
}
```

### 5. Type Safety

```tsx
// types/movie.ts
export interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  releaseDate: string;
}

// components/MovieCard.tsx
interface MovieCardProps {
  movie: Movie; // Use typed interface
}

export function MovieCard({ movie }: MovieCardProps) {
  // TypeScript ensures type safety
}
```

### 6. API Integration

```tsx
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getMovies(): Promise<Movie[]> {
  const response = await fetch(`${API_URL}/movies`);
  if (!response.ok) throw new Error('Failed to fetch movies');
  return response.json();
}

// app/movies/page.tsx (Server Component)
import { getMovies } from '@/lib/api';

export default async function MoviesPage() {
  const movies = await getMovies();
  return <MovieList movies={movies} />;
}
```

### 7. Environment Variables

```env
# .env.local (not committed)
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Important**:
- Prefix with `NEXT_PUBLIC_` for client-side access
- Server-only vars don't need prefix
- Never commit `.env.local`
- Restart dev server after changing env vars

## shadcn/ui Configuration

Current configuration in `components.json`:
- **Style**: new-york (modern, clean design)
- **Base Color**: neutral
- **CSS Variables**: Enabled (for theming)
- **RSC**: Enabled (React Server Components)
- **Aliases**:
  - `@/components` → components directory
  - `@/lib` → lib directory
  - `@/ui` → components/ui directory

### Adding Components
```bash
# Add individual components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add form
npx shadcn@latest add input
npx shadcn@latest add select
npx shadcn@latest add textarea

# Components are added to components/ui/ and can be customized
```

## Testing Requirements

### Test Coverage Rules
1. **All components must have tests** - No exceptions
2. **Test user interactions** - Click, input, keyboard navigation
3. **Test edge cases** - Empty states, errors, loading states
4. **Test accessibility** - ARIA labels, keyboard navigation
5. **Aim for 80%+ coverage** - Run `npm test -- --coverage`

### Running Tests
```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm test -- --coverage     # With coverage report
npm test Button            # Run specific test
```

## Performance Optimization

### Image Optimization
```tsx
import Image from 'next/image';

<Image
  src="/poster.jpg"
  alt="Movie poster"
  width={300}
  height={450}
  priority // For above-the-fold images
/>
```

### Font Optimization
```tsx
// Already configured in app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
```

### Code Splitting
```tsx
// Dynamic imports for heavy components
import dynamic from 'next/dynamic';

const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), {
  loading: () => <p>Loading player...</p>,
  ssr: false, // Don't render on server
});
```

## Common Patterns

### Loading States
```tsx
// app/movies/loading.tsx
export default function Loading() {
  return <div className="animate-pulse">Loading movies...</div>;
}
```

### Error Handling
```tsx
// app/movies/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### Not Found
```tsx
// app/movies/[id]/not-found.tsx
export default function NotFound() {
  return <div>Movie not found</div>;
}
```

## Accessibility

### Always Include:
- `alt` text for images
- `aria-label` for icon buttons
- Semantic HTML (`<nav>`, `<main>`, `<article>`)
- Keyboard navigation support
- Focus states (Tailwind: `focus:ring-2`)

```tsx
// ✅ Good - Accessible button
<button
  aria-label="Play video"
  className="focus:ring-2 focus:ring-primary"
>
  <PlayIcon />
</button>
```

## Git Workflow (Frontend-Specific)

### Feature Branch Example
```bash
# Create feature branch
git checkout -b feature/frontend/video-player

# Make changes
# 1. Create component: components/video/VideoPlayer.tsx
# 2. Write tests: __tests__/components/video/VideoPlayer.test.tsx
# 3. Run tests: npm test

# Commit with tests
git add .
git commit -m "feat(frontend): add video player component"
git commit -m "test(frontend): add video player tests"

# Push and create PR
git push origin feature/frontend/video-player
gh pr create --base develop
```

## Common Commands

```bash
# Development
npm run dev                 # Start dev server with Turbopack
npm run build              # Production build
npm start                  # Start production server

# Testing
npm test                   # Run tests
npm run test:watch         # Watch mode
npm test -- --coverage     # Coverage report

# Code Quality
npm run lint               # ESLint
npm run lint -- --fix      # Auto-fix issues

# shadcn/ui
npx shadcn@latest add [component]    # Add component
npx shadcn@latest diff [component]   # Check for updates
```

## Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Set root directory to `frontend`
3. Framework preset: Next.js
4. Build command: `npm run build`
5. Output directory: `.next`
6. Environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend URL

### Environment Variables for Production
```env
NEXT_PUBLIC_API_URL=https://your-backend.com
```

## Troubleshooting

### Common Issues

**1. "Module not found" errors**
- Check `tsconfig.json` paths configuration
- Verify imports use `@/` prefix
- Restart dev server

**2. Tailwind classes not working**
- Check `tailwind.config.ts` content paths
- Verify class names are correct (no typos)
- Restart dev server after config changes

**3. Tests failing**
- Check `jest.setup.js` is imported
- Verify `@testing-library/jest-dom` is imported
- Use `screen.debug()` to see rendered output

**4. Environment variables not working**
- Must start with `NEXT_PUBLIC_` for client-side
- Restart dev server after changes
- Check `.env.local` is in frontend directory

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [React Testing Library](https://testing-library.com/react)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

## Frontend Checklist

Before pushing any frontend code:
- [ ] Component implemented with TypeScript types
- [ ] Unit tests written and passing
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Accessibility checked (keyboard nav, ARIA labels)
- [ ] No console.logs or debugging code
- [ ] ESLint passing
- [ ] Uses Tailwind classes (no inline styles)
- [ ] Images optimized with next/image
- [ ] Feature branch created from develop
- [ ] PR opened for CodeRabbit review

## Current Status

- ✅ Next.js 15 with App Router configured
- ✅ Tailwind CSS with design tokens configured
- ✅ shadcn/ui installed (Button component example)
- ✅ Jest + React Testing Library configured
- ✅ TypeScript strict mode enabled
- ✅ ESLint configured
- ✅ Basic app structure (layout, home page)
- ⏳ Ready for feature development

**You are all set to build the Disney Plus Clone frontend!** 🚀
