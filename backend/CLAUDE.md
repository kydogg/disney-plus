# Backend CLAUDE.md

This file provides backend-specific guidance to Claude Code when working in the backend workspace.

## Backend Overview

This is the **Disney Plus Clone Backend** - an Express.js REST API built with TypeScript.

**Location**: `/backend` directory in the monorepo
**Repository**: https://github.com/kydogg/disney-plus

## Quick Start

```bash
# From backend directory
npm install
npm run dev          # Start dev server (http://localhost:3001)
npm test             # Run tests
npm run build        # Build TypeScript
npm start            # Start production server
```

## Tech Stack

### Core
- **Runtime**: Node.js 20+
- **Framework**: Express.js 4.18
- **Language**: TypeScript 5.x with strict mode
- **Development**: tsx (TypeScript Execute with hot reload)

### Middleware
- **CORS**: Cross-Origin Resource Sharing for frontend
- **express.json()**: JSON body parsing
- **dotenv**: Environment variable management

### Testing
- **Vitest**: Fast unit test framework
- **Test Location**: `test/` directory

### Development Tools
- **tsx watch**: Hot reload during development
- **TypeScript**: Compile-time type safety

## Project Structure

```
backend/
├── src/
│   ├── index.ts                 # Main Express app entry point
│   ├── routes/                  # API route handlers
│   │   ├── movies.ts           # Movie routes
│   │   ├── users.ts            # User routes
│   │   └── auth.ts             # Authentication routes
│   ├── controllers/             # Business logic
│   │   ├── movieController.ts
│   │   ├── userController.ts
│   │   └── authController.ts
│   ├── middleware/              # Custom middleware
│   │   ├── auth.ts             # Authentication middleware
│   │   ├── errorHandler.ts    # Error handling
│   │   └── validation.ts       # Request validation
│   ├── models/                  # Data models/types
│   │   ├── Movie.ts
│   │   ├── User.ts
│   │   └── types.ts
│   ├── services/                # External services
│   │   ├── database.ts         # Database connection
│   │   └── storage.ts          # File storage
│   └── utils/                   # Utility functions
│       ├── logger.ts
│       └── helpers.ts
├── test/
│   ├── routes/                  # Route tests
│   ├── controllers/             # Controller tests
│   └── utils/                   # Utility tests
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
└── CLAUDE.md                    # This file
```

## Development Guidelines

### 1. Creating API Routes

#### Basic Route Structure
```typescript
// src/routes/movies.ts
import express, { Request, Response } from 'express';

const router = express.Router();

// GET /api/movies
router.get('/', async (req: Request, res: Response) => {
  try {
    const movies = await getMovies();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

// GET /api/movies/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const movie = await getMovieById(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie' });
  }
});

// POST /api/movies
router.post('/', async (req: Request, res: Response) => {
  try {
    const movie = await createMovie(req.body);
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create movie' });
  }
});

export default router;
```

#### Registering Routes
```typescript
// src/index.ts
import movieRoutes from './routes/movies';
import userRoutes from './routes/users';

app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);
```

### 2. Type Safety with TypeScript

#### Request/Response Types
```typescript
// src/models/Movie.ts
export interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  releaseDate: Date;
  genre: string[];
  rating: number;
}

export interface CreateMovieDto {
  title: string;
  description: string;
  videoUrl: string;
  genre: string[];
}

// src/controllers/movieController.ts
import { Movie, CreateMovieDto } from '../models/Movie';

export async function getMovies(): Promise<Movie[]> {
  // Implementation
}

export async function createMovie(data: CreateMovieDto): Promise<Movie> {
  // Validation and creation logic
}
```

#### Express Request with Types
```typescript
import { Request, Response } from 'express';

interface MovieRequest extends Request {
  body: CreateMovieDto;
}

router.post('/', async (req: MovieRequest, res: Response) => {
  const movie = await createMovie(req.body);
  res.status(201).json(movie);
});
```

### 3. Middleware

#### Authentication Middleware
```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
}

export async function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token and extract user ID
    const userId = await verifyToken(token);
    req.userId = userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Usage
router.get('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  const user = await getUserById(req.userId!);
  res.json(user);
});
```

#### Error Handling Middleware
```typescript
// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
}

// Register last in src/index.ts
app.use(errorHandler);
```

#### Validation Middleware
```typescript
// src/middleware/validation.ts
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod'; // Optional: Use Zod for validation

export function validateBody<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({ error: 'Invalid request body' });
    }
  };
}

// Usage
const createMovieSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  videoUrl: z.string().url(),
});

router.post('/', validateBody(createMovieSchema), async (req, res) => {
  // req.body is validated and typed
});
```

### 4. Environment Variables

```env
# .env (not committed)
PORT=3001
NODE_ENV=development

# Database (when added)
DATABASE_URL=postgresql://...

# API Keys (when added)
API_KEY=your-api-key

# CORS
FRONTEND_URL=http://localhost:3000
```

```typescript
// src/config.ts
export const config = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
};
```

### 5. CORS Configuration

```typescript
// src/index.ts
import cors from 'cors';

// Development - Allow all origins
app.use(cors());

// Production - Restrict origins
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
```

### 6. Testing with Vitest

**CRITICAL**: Every route and controller must have tests.

```typescript
// test/routes/movies.test.ts
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/index';

describe('GET /api/movies', () => {
  it('returns list of movies', async () => {
    const response = await request(app).get('/api/movies');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('returns 404 for non-existent movie', async () => {
    const response = await request(app).get('/api/movies/non-existent-id');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error');
  });
});

describe('POST /api/movies', () => {
  it('creates a new movie', async () => {
    const newMovie = {
      title: 'Test Movie',
      description: 'Test Description',
      videoUrl: 'http://example.com/video.mp4',
      genre: ['Action'],
    };

    const response = await request(app)
      .post('/api/movies')
      .send(newMovie);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.title).toBe(newMovie.title);
  });

  it('returns 400 for invalid data', async () => {
    const response = await request(app)
      .post('/api/movies')
      .send({ invalid: 'data' });

    expect(response.status).toBe(400);
  });
});
```

### Running Tests
```bash
npm test                    # Run all tests
npm test -- --watch        # Watch mode
npm test movies            # Run specific test file
npm test -- --coverage     # Coverage report
```

## API Design Best Practices

### RESTful Conventions
```
GET    /api/movies          # List all movies
GET    /api/movies/:id      # Get specific movie
POST   /api/movies          # Create new movie
PUT    /api/movies/:id      # Update movie (full)
PATCH  /api/movies/:id      # Update movie (partial)
DELETE /api/movies/:id      # Delete movie
```

### Response Formats

#### Success Response
```json
{
  "id": "123",
  "title": "Movie Title",
  "description": "Description",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### Error Response
```json
{
  "error": "Resource not found",
  "code": "NOT_FOUND",
  "details": {}
}
```

#### List Response (with pagination)
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### HTTP Status Codes
- `200 OK` - Successful GET/PUT/PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Not authorized
- `404 Not Found` - Resource doesn't exist
- `500 Internal Server Error` - Server error

## Database Integration (Future)

### Example with Prisma
```typescript
// prisma/schema.prisma
model Movie {
  id          String   @id @default(uuid())
  title       String
  description String
  videoUrl    String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

// src/services/database.ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

// src/controllers/movieController.ts
import { prisma } from '../services/database';

export async function getMovies() {
  return prisma.movie.findMany();
}

export async function createMovie(data: CreateMovieDto) {
  return prisma.movie.create({ data });
}
```

## Logging

```typescript
// src/utils/logger.ts
export const logger = {
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${message}`, meta || '');
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error || '');
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${message}`, meta || '');
  },
};

// Usage
import { logger } from './utils/logger';

logger.info('Server started', { port: 3001 });
logger.error('Database connection failed', error);
```

## Common Commands

```bash
# Development
npm run dev                 # Start dev server with hot reload
npm run build              # Build TypeScript to dist/
npm start                  # Start production server

# Testing
npm test                   # Run tests
npm test -- --watch       # Watch mode
npm test -- --coverage    # Coverage report

# Database (when added)
npx prisma migrate dev    # Run migrations
npx prisma studio         # Database GUI
```

## Git Workflow (Backend-Specific)

```bash
# Create feature branch
git checkout -b feature/backend/movie-api

# Make changes
# 1. Create route: src/routes/movies.ts
# 2. Create controller: src/controllers/movieController.ts
# 3. Write tests: test/routes/movies.test.ts
# 4. Run tests: npm test

# Commit with tests
git add .
git commit -m "feat(backend): add movie API endpoints"
git commit -m "test(backend): add movie API tests"

# Push and create PR
git push origin feature/backend/movie-api
gh pr create --base develop
```

## Security Best Practices

### 1. Input Validation
- Always validate and sanitize user input
- Use validation libraries (Zod, Joi, etc.)
- Never trust client data

### 2. Authentication
- Use JWT or session-based auth
- Implement token refresh mechanism
- Hash passwords with bcrypt

### 3. Authorization
- Check user permissions before operations
- Implement role-based access control (RBAC)
- Use middleware for auth checks

### 4. Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 5. Environment Variables
- Never commit `.env` files
- Use `.env.example` for documentation
- Validate required env vars on startup

## Deployment

### Railway / Render / Heroku
```bash
# Build command
npm run build

# Start command
npm start

# Environment variables
PORT=3001
NODE_ENV=production
DATABASE_URL=...
```

### Docker (Optional)
```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3001

CMD ["npm", "start"]
```

## Troubleshooting

### Common Issues

**1. Port already in use**
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

**2. TypeScript errors**
- Check `tsconfig.json` configuration
- Verify type imports
- Run `npm run build` to see detailed errors

**3. CORS errors**
- Verify CORS middleware is configured
- Check frontend URL matches CORS origin
- Ensure credentials are handled correctly

**4. Tests failing**
- Check test environment setup
- Verify imports are correct
- Use `console.log` for debugging test data

## Backend Checklist

Before pushing any backend code:
- [ ] API endpoints implemented with TypeScript types
- [ ] Unit tests written and passing
- [ ] Error handling implemented
- [ ] Input validation added
- [ ] No sensitive data in logs
- [ ] Environment variables documented in `.env.example`
- [ ] CORS configured correctly
- [ ] No `console.log` in production code (use logger)
- [ ] Feature branch created from develop
- [ ] PR opened for CodeRabbit review

## Current Status

- ✅ Express.js with TypeScript configured
- ✅ CORS middleware enabled
- ✅ JSON body parsing enabled
- ✅ Health check endpoint (`/health`)
- ✅ Basic error handling
- ✅ Development with hot reload (tsx watch)
- ✅ Vitest testing framework configured
- ✅ TypeScript strict mode enabled
- ⏳ Ready for API development

## Next Steps

1. **Add Database** - Prisma, MongoDB, PostgreSQL
2. **Implement Authentication** - JWT, sessions
3. **Create API Endpoints** - Movies, users, playlists
4. **Add Validation** - Request validation middleware
5. **Implement File Upload** - For video/image uploads
6. **Add Logging** - Structured logging (Winston, Pino)
7. **Error Tracking** - Sentry integration
8. **API Documentation** - Swagger/OpenAPI

**You are all set to build the Disney Plus Clone backend!** 🚀
