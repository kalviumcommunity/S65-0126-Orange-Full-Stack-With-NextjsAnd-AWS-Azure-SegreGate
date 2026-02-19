# S65-0126-Orange-Full-Stack-With-NextjsAnd-AWS-Azure-SegreGate

A Next.js application demonstrating advanced data fetching and rendering techniques with different rendering modes (Static, SSG, SSR, ISR) for optimal performance across various page types.

## Folder Structure

- `app/` - Next.js App Router directory containing pages and layouts
- `public/` - Static assets served by Next.js
- `package.json` - Project dependencies and scripts
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- Config files: `eslint.config.mjs`, `postcss.config.mjs`, etc.

## Setup Instructions

### Installation

1. Ensure you have Node.js (version 18 or later) and pnpm installed
2. Clone the repository
3. Install dependencies:
   ```bash
   pnpm install
   ```

### Local Development

To run the application in development mode:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Build and Run

To build for production:

```bash
pnpm build
```

To start the production build:

```bash
pnpm start
```

## Advanced Data Fetching & Rendering 

### Rendering Modes Used

| Page | Rendering Type | Reason |
|-----|---------------|--------|
| Home (`/`) | Static | Landing page, no dynamic data |
| About (`/about`) | SSG | Informational, rarely changes |
| Dashboard (`/dashboard`) | SSR | Real-time data per request |
| News (`/news`) | ISR | Semi-dynamic content |

### Why These Choices?

- Static rendering improves performance and reduces server cost
- SSR ensures real-time data for user-specific dashboards
- ISR balances freshness and speed by regenerating pages periodically

### Performance Reflection

If the app had **10x more users**, using SSR everywhere would:
- Increase server load, costs, and latency
- Better strategy: Static + ISR for most pages, SSR only for user-specific data

---

## Environment-Aware Builds

This project supports separate builds for **development**, **staging**, and **production** environments.

### Environment Files

- `.env.development` - Local development (debug enabled)
- `.env.staging` - Staging environment (production-like)
- `.env.production` - Production (minimal logging)
- `.env.example` - Template (tracked in Git)

### Example `.env.example`

Copy `.env.example` to create your local file (e.g. `.env.local`) and replace placeholders with real values. Server-only variables must NOT be prefixed with `NEXT_PUBLIC_` — only those prefixed that way are exposed to the browser.

```env
# Server-side (never expose to the browser)
DATABASE_URL=postgres://username:password@localhost:5432/segregate_db
JWT_SECRET=replace-with-a-strong-secret

# Client-safe (visible to browser)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
```

How to use locally:

```bash
cp .env.example .env.local
# then edit .env.local with your local credentials
pnpm install
pnpm dev
```

### Safe `process.env` usage (short examples)

- Server-only (do this inside API routes / server components):

```ts
// server-only example
const dbUrl = process.env.DATABASE_URL; // OK on server
if (!dbUrl) throw new Error('Missing DATABASE_URL');
```

- Client-safe (only use `NEXT_PUBLIC_` prefixed variables in client code):

```ts
// client example (can be imported in browser code)
const apiBase = process.env.NEXT_PUBLIC_API_URL;
```

> ⚠️ Never reference server-only variables from client components/hooks — Next.js will fail the build or leak secrets.

### Build Commands

```bash
npm run dev                    # Development with hot reload
npm run build:development      # Build for development
npm run build:staging          # Build for staging
npm run build:production       # Build for production
npm run start:staging          # Run staging build
npm run start:production       # Run production build
```

### Environment Differences

| Feature | Development | Staging | Production |
|---------|-------------|---------|------------|
| API URL | localhost:3001 | staging-api.example.com | api.example.com |
| Debug Mode | ✅ Enabled | ❌ Disabled | ❌ Disabled |
| Analytics | ❌ Off | ✅ On | ✅ On |
| Logging | Debug | Info | Warn |

### Setup

```bash
cp .env.example .env.development
pnpm install
npm run dev
```

## Secure Secret Management

### Key Principles

1. **Never commit secrets** - Only `.env.example` is tracked in Git
2. **Environment variables** - All secrets injected at build time
3. **Public vs Private** - Only `NEXT_PUBLIC_*` variables are safe for browser

### Secrets Storage

**Development:**
- No secrets required locally

**Staging/Production:**
- Store secrets in **GitHub Secrets** (Settings → Secrets and variables → Actions)
- Reference in environment files or CI/CD pipeline

### GitHub Secrets to Create

```
DATABASE_URL_STAGING
DATABASE_URL_PRODUCTION
STRIPE_SECRET_KEY_STAGING
STRIPE_SECRET_KEY_PRODUCTION
JWT_SECRET_STAGING
JWT_SECRET_PRODUCTION
```

### Why Multi-Environment Matters

✅ **Configuration Isolation** - Each environment uses correct API endpoints and credentials  
✅ **Build Reproducibility** - Same code, different config per environment  
✅ **Secret Safety** - Credentials never appear in git history or logs  
✅ **Staged Deployment** - Test in staging before production  
✅ **Compliance** - Meets SOC 2, HIPAA, PCI DSS standards

---

## Docker & Containerized Local Development

This project uses Docker and Docker Compose to containerize the entire application stack — Next.js app, PostgreSQL database, and Redis cache. This ensures a consistent development environment across all machines and eliminates "it works on my machine" issues.

### Prerequisites

- Docker and Docker Compose installed
  - Windows/Mac: [Docker Desktop](https://www.docker.com/products/docker-desktop)
  - Linux: [Docker Engine](https://docs.docker.com/engine/install/) + [Docker Compose](https://docs.docker.com/compose/install/)

### Quick Start

```bash
# Build and start all services
docker-compose up --build

# In a new terminal, verify all containers are running
docker ps
```

The app will be available at `http://localhost:3000`.

### Services Explained

**Dockerfile (Next.js App)**
- Multi-stage build for optimized image size
- Stage 1: Builds Next.js app with all dev dependencies
- Stage 2: Runs only the compiled app with prod dependencies
- Healthcheck every 10s to ensure app is running

**docker-compose.yml Services:**

| Service | Image | Port | Purpose |
|---------|-------|------|---------|
| `app` | Custom (Dockerfile) | 3000 | Next.js frontend/API |
| `db` | postgres:15-alpine | 5432 | PostgreSQL database |
| `redis` | redis:7-alpine | 6379 | Redis caching layer |

### Networks & Volumes

- **Network:** All services connect via a custom `localnet` bridge network, allowing them to communicate using service names (e.g., `db:5432` instead of `localhost:5432` inside containers).
- **Volume:** `db_data` persists PostgreSQL data across container restarts.
- **Mounts:** App code (`app/`, `public/`) are mounted for hot-reload during development.

### Environment Variables in Docker

The `docker-compose.yml` sets these env vars in the `app` service:

```yaml
DATABASE_URL: postgres://postgres:postgres@db:5432/segregate_db
REDIS_URL: redis://redis:6379
NEXT_PUBLIC_API_URL: http://localhost:3001
```

Inside the container, these are different from your local `.env.local`:
- Database hostname is `db` (not `localhost`) — Docker's internal DNS resolves the service name
- Redis hostname is `redis` (not `localhost`)

For local development *without* Docker, use `localhost` in `.env.local`.

### Common Commands

```bash
# View logs from all services
docker-compose logs -f

# View logs from a specific service
docker-compose logs -f app
docker-compose logs -f db
docker-compose logs -f redis

# Stop all services (but keep data)
docker-compose stop

# Remove all containers and networks (keeps volumes)
docker-compose down

# Remove everything including volumes (data lost)
docker-compose down -v

# Rebuild image (if Dockerfile changes)
docker-compose build

# Run a one-off command in a service
docker-compose exec app pnpm lint
docker-compose exec db psql -U postgres -d segregate_db
```

### Troubleshooting

**Port already in use**
```bash
# Find process using port 3000, 5432, or 6379
lsof -i :3000
lsof -i :5432
lsof -i :6379

# Kill the process or change ports in docker-compose.yml
```

**Database won't connect**
- Wait a few seconds for PostgreSQL to fully start (healthcheck takes ~5s)
- Check if `db_data` volume exists: `docker volume ls`
- Verify `.env.local` uses `localhost`, not `db` (only Docker uses `db`)

**Build fails with "pnpm lock file missing"**
- Ensure `pnpm-lock.yaml` exists in the repo
- If missing: `pnpm install` locally first, then commit the lock file

**Container exits immediately**
```bash
# Check logs for error messages
docker-compose logs app
```

### Why Containerization Matters

✅ **Environment Parity** — Dev, staging, and prod run identical containers  
✅ **Onboarding** — New team members run `docker-compose up` instead of installing 5+ dependencies  
✅ **Isolation** — No conflicts with other projects' dependencies  
✅ **CI/CD Ready** — GitHub Actions and cloud platforms use the same Dockerfile  
✅ **Scalability** — Easy to add more services (Job workers, etc.) to Compose  

---

## PostgreSQL Schema Design (Prisma ORM)

### Database Architecture

The SegreGate application uses PostgreSQL with Prisma ORM to manage normalized, scalable database operations. The schema is designed around four core entities:

**Core Models:**

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  role      String   @default("user")
  createdAt DateTime @default(now())

  projects  Project[]
  reports   Report[]
}

model Project {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  createdAt   DateTime @default(now())
  ownerId     Int
  owner       User     @relation(fields: [ownerId], references: [id], onDelete: Cascade)

  tasks       Task[]
}

model Task {
  id        Int      @id @default(autoincrement())
  title     String
  status    String   @default("todo")
  projectId Int
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())

  @@index([projectId])
}

model Report {
  id         Int      @id @default(autoincrement())
  userId     Int
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  photoUrl   String?
  location   String?
  status     String   @default("pending")
  createdAt  DateTime @default(now())

  @@index([userId])
}
```

### Schema Design Principles

**Normalization (3NF Compliance):**
- No data duplication: User data is stored once, referenced via foreign keys
- Atomic attributes: Each column stores a single value (no comma-separated lists)
- No transitive dependencies: `Task` depends directly on `Project`, not on `User`

**Key Constraints:**
- **Primary Keys**: Auto-incrementing integers (`@id @default(autoincrement())`)
- **Foreign Keys**: Relations with `@relation()` and `fields: [ownerId], references: [id]`
- **Unique Constraints**: `email` is unique to prevent duplicate registrations
- **Cascading Deletes**: `onDelete: Cascade` ensures orphaned records are cleaned up

**Performance Indexes:**
- `@@index([projectId])` on Task speeds up queries filtering by project
- `@@index([userId])` on Report speeds up lookups by user

### Scalability & Query Patterns

**Why This Design Scales:**
- Normalized structure minimizes data redundancy (smaller database size)
- Indexes on foreign keys enable fast joins
- Clear relationships are easy to query and maintain

**Common Query Patterns:**
- Get all projects for a user → indexed join on `User.id = Project.ownerId`
- Get all tasks in a project → indexed join on `Project.id = Task.projectId`
- Get all reports by a user → indexed join on `User.id = Report.userId`

---

## Prisma ORM Setup & Client Initialisation

### Installation & Configuration

Prisma is installed as a dev dependency alongside `@prisma/client` (production):

```bash
pnpm install -D prisma @prisma/client ts-node
```

The schema file is located at `prisma/schema.prisma` and defines all models, relationships, and database configuration:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### Prisma Client Singleton

To avoid multiple Prisma client instances in development (which can cause hot-reload issues), we use a singleton pattern in `src/lib/prisma.ts`:

```typescript
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient = global.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
```

**Import in API routes or server components:**

```ts
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const users = await prisma.user.findMany();
  return Response.json(users);
}
```

### Client Generation

Generate the Prisma client after schema changes:

```bash
pnpm exec prisma generate
```

This creates type-safe queries based on your schema — IDE autocomplete catches errors at development time.

---

## Database Migrations & Seed Scripts

### Running Migrations

Migrations apply schema changes to your PostgreSQL database:

```bash
# Create and apply a migration
pnpm exec prisma migrate dev --name init_schema

# View all migrations
ls prisma/migrations/

# Rollback to a previous migration (development only)
pnpm exec prisma migrate reset
```

**Migration Workflow:**
1. Edit `prisma/schema.prisma` (add/modify models)
2. Run `prisma migrate dev --name <description>` (auto-generates SQL migration files)
3. Review generated SQL in `prisma/migrations/<timestamp>_<name>/migration.sql`
4. Apply to database (Prisma updates `.env` and runs migration)

### Seeding Your Database

The `prisma/seed.ts` script inserts initial sample data:

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.user.createMany({
    data: [
      { name: 'Alice', email: 'alice@example.com', role: 'admin' },
      { name: 'Bob', email: 'bob@example.com', role: 'user' },
    ],
    skipDuplicates: true,
  });

  // ... create projects, tasks, reports ...

  console.log('Seeding complete');
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
```

Run the seed script:

```bash
pnpm exec prisma db seed
```

**Seed Script Benefits:**
- **Idempotency**: Uses `skipDuplicates: true` to prevent duplicate inserts when re-seeding
- **Reproducibility**: All team members get identical test data
- **Documentation**: Seed file acts as example of each model's structure

### Resetting the Database (Development Only)

```bash
# Reset database, re-run all migrations, and seed
pnpm exec prisma migrate reset
```

⚠️ **Warning:** This deletes all data. Use only in development.

### Production Migrations

For production, store secrets in GitHub Actions and run:

```bash
pnpm exec prisma migrate deploy
```

This applies pending migrations without prompting for new migration creation.

---

## Transactions & Query Optimisation

### Database Transactions

Transactions ensure atomicity: multiple operations either all succeed or all fail. Example: creating a report and updating statistics in one atomic operation.

**Using Prisma Transactions:**

```typescript
import { prisma } from '@/lib/prisma';

export async function submitReportWithStats(userId: number, location: string) {
  try {
    const [report, stats] = await prisma.$transaction([
      // Operation 1: Create the report
      prisma.report.create({
        data: {
          userId,
          location,
          status: 'pending',
        },
      }),
      
      // Operation 2: Update user's report count
      prisma.user.update({
        where: { id: userId },
        data: {
          reportCount: { increment: 1 },
        },
      }),
    ]);

    console.log('Transaction successful:', report, stats);
    return { report, stats };
  } catch (error) {
    console.error('Transaction failed. Rolling back.', error);
    throw error;
  }
}
```

**Transaction Guarantees:**
- If either operation fails, both are rolled back (no partial writes)
- Database consistency is maintained even under concurrent load
- Perfect for operations with dependencies

### Query Optimisation

**1. Avoid Over-fetching (select fields you need):**

```typescript
// ❌ Inefficient: fetches all user data
const users = await prisma.user.findMany();

// ✅ Optimized: fetch only needed fields
const users = await prisma.user.findMany({
  select: { id: true, name: true, email: true },
});
```

**2. Batch Operations (insert/update multiple records):**

```typescript
// ✅ Efficient: single query
await prisma.report.createMany({
  data: [
    { userId: 1, location: 'Zone A' },
    { userId: 2, location: 'Zone B' },
    { userId: 3, location: 'Zone C' },
  ],
});
```

**3. Pagination (avoid fetching entire tables):**

```typescript
// ✅ Efficient: limit + offset
const reports = await prisma.report.findMany({
  skip: 0,
  take: 10,
  orderBy: { createdAt: 'desc' },
});
```

**4. Use Indexes for Frequently Queried Columns:**

Already applied in schema:
```prisma
model Report {
  @@index([userId])  // Fast lookup by user
  @@index([status])  // Fast filtering by status
}
```

### Monitoring & Debugging

**Enable Query Logging:**

```bash
DEBUG="prisma:query" pnpm dev
```

This logs all SQL queries to console — identify slow queries and optimize with indexes.

**Prisma Studio (GUI Inspector):**

```bash
pnpm exec prisma studio
```

Opens a web UI to browse, create, update, and delete records.

### Anti-patterns Avoided

- ❌ **N+1 Queries**: Avoided by using `select` and pre-fetching related data
- ❌ **Full Table Scans**: Avoided by adding indexes on `userId`, `status`, `projectId`
- ❌ **Missing Constraints**: Enforced with `@unique`, `onDelete: Cascade`
- ❌ **Concurrent Update Conflicts**: Mitigated with transactions

### Production Reflection

**Monitoring & Logging:**
- Track query execution time with `DEBUG="prisma:query"`
- Use RDS Performance Insights (AWS) or Query Performance Insights (Azure) to identify bottlenecks
- Set up alerts for slow queries (> 1s)
- Monitor database connection pool usage

**Backup & Recovery:**
- Enable automated PostgreSQL backups (AWS RDS, Azure Database for PostgreSQL)
- Test restore procedures quarterly
- Keep transaction logs for point-in-time recovery

**Scaling Strategies:**
- Add read replicas for read-heavy workloads
- Use Redis caching layer for frequently accessed data (user sessions, report counts)
- Partition large tables (e.g., reports by date range) as data grows

---

## Core Backend API Foundation

### API Route Structure

All API endpoints are organized under `app/api/` using Next.js file-based routing:

```
app/api/
 ├── reports/
 │   ├── route.ts          # GET all, POST create
 │   └── [id]/route.ts     # GET by id, PUT update
 └── users/
     ├── route.ts          # GET all, POST create
     └── [id]/route.ts     # GET by id
```

**Naming Conventions:**
- Use plural resource names: `/api/reports`, not `/api/report`
- Use nouns (resources), not verbs: `/api/reports`, not `/api/getReports`
- HTTP verbs (GET, POST, PUT) define the action

| HTTP Verb | Route | Purpose |
|-----------|-------|---------|
| GET | `/api/reports` | Fetch all reports (paginated) |
| POST | `/api/reports` | Create new report |
| GET | `/api/reports/:id` | Fetch report by ID |
| PUT | `/api/reports/:id` | Update report status/location |
| GET | `/api/users` | Fetch all users (paginated) |
| POST | `/api/users` | Create new user |
| GET | `/api/users/:id` | Fetch user by ID |

### Unified Response Format

Every API endpoint returns a consistent JSON structure for success and error responses:

**Success Response (200, 201):**
```json
{
  "success": true,
  "message": "Reports fetched successfully",
  "data": [
    { "id": 1, "userId": 2, "location": "Zone A", "status": "pending", "createdAt": "2025-10-30T10:00:00Z" }
  ],
  "timestamp": "2025-10-30T10:00:00Z"
}
```

**Error Response (400, 404, 500):**
```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      { "field": "location", "message": "Location must be at least 3 characters" }
    ]
  },
  "timestamp": "2025-10-30T10:00:00Z"
}
```

**Response Handler Implementation:**
- Centralized in `src/lib/responseHandler.ts`
- All routes use `sendSuccess()` and `sendError()` for consistency
- Ensures DX improvements: predictable shape, easy error handling

### Input Validation with Zod

API endpoints validate all POST/PUT request bodies using Zod schemas:

**User Schema:**
```typescript
const userCreateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  email: z.string().email('Invalid email address'),
  role: z.enum(['user', 'volunteer', 'admin']).default('user'),
});
```

**Report Schema:**
```typescript
const reportCreateSchema = z.object({
  userId: z.number().int().positive('User ID must be a positive integer'),
  location: z.string().min(3, 'Location must be at least 3 characters').max(255),
  photoUrl: z.string().url('Invalid photo URL').optional(),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
});
```

**Validation Flow:**
1. Request body is parsed
2. Zod schema validates structure and types
3. If invalid, return structured error with field-level details
4. If valid, proceed with business logic

**Example Validation Error:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"A","email":"bademail"}'
```

Response (400):
```json
{
  "success": false,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      { "field": "name", "message": "Name must be at least 2 characters" },
      { "field": "email", "message": "Invalid email address" }
    ]
  }
}
```

### Error Handling Middleware

Centralized error handling ensures:
- Consistent error responses across all routes
- Stack traces exposed in dev, hidden in prod
- Structured logging for observability

**Development Mode:**
```json
{
  "success": false,
  "message": "Database connection failed",
  "stack": "Error: Database connection failed at line 45..."
}
```

**Production Mode:**
```json
{
  "success": false,
  "message": "Something went wrong. Please try again later."
}
```

Detailed errors are logged server-side for debugging without exposing to clients.

### Example API Usage

**Create a Report:**
```bash
curl -X POST http://localhost:3000/api/reports \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "location": "Zone A", "photoUrl": "https://example.com/photo.jpg"}'
```

**Get All Reports (Paginated):**
```bash
curl "http://localhost:3000/api/reports?page=1&limit=10"
```

**Update Report Status:**
```bash
curl -X PUT http://localhost:3000/api/reports/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'
```

**Get User by ID:**
```bash
curl "http://localhost:3000/api/users/1"
```

### Why Consistency Matters

✅ **Reduced Integration Errors** — Frontend knows what every response looks like  
✅ **Faster Onboarding** — New team members understand the API instantly  
✅ **Reliable Error Handling** — Structured errors enable graceful degradation  
✅ **Production-Ready** — Security (hidden stack traces) + observability (logs) built-in  
✅ **Maintainability** — Adding new endpoints is predictable and scalable

---

## Authentication & Authorization

### JWT Structure & Token Management

SegreGate uses **JSON Web Tokens (JWT)** for stateless, secure authentication. A JWT consists of three parts separated by dots (`.`):

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiYWxpY2VAZXhhbXBsZS5jb20iLCJyb2xlIjoiYWRtaW4ifQ.signature
     header                                          payload                                           signature
```

**Decoded Structure:**
```json
{
  "header": { "alg": "HS256", "typ": "JWT" },
  "payload": { "userId": 1, "email": "alice@example.com", "role": "admin", "exp": 1715120000 },
  "signature": "hashed-verification-string"
}
```

- **Header**: Algorithm (HS256) and token type
- **Payload**: User info (userId, email, role) + expiry time
- **Signature**: Ensures token hasn't been tampered with

### Access vs Refresh Tokens

Two tokens are issued on successful login for security and usability:

| Token | Lifespan | Purpose | Storage | Security |
|-------|----------|---------|---------|----------|
| **Access Token** | 15 minutes | Make API requests | Response body | Short-lived, exposed to JavaScript |
| **Refresh Token** | 7 days | Obtain new access token | HTTP-only cookie | Long-lived, protected from XSS |

**Token Flow Diagram:**
```
┌─────────────────────────────────────────────────────────────┐
│ 1. User Signup/Login                                        │
│    POST /api/auth/signup or POST /api/auth/login            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. Server Issues Tokens                                     │
│    Access Token (15 min) + Refresh Token (7 days)           │
└──────────────────────┬──────────────────────────────────────┘
                       │
    ┌──────────────────┴──────────────────┐
    │                                     │
    ▼                                     ▼
┌──────────────────┐          ┌──────────────────────┐
│ Response Body    │          │ HTTP-Only Cookie     │
│ accessToken      │          │ refreshToken (secure)│
└──────────────────┘          └──────────────────────┘
    │                                     │
    └──────────────────┬──────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. Client Makes API Requests                                │
│    Authorization: Bearer <accessToken>                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
     ✅ Valid                   ⏰ Expired (401)
        │                             │
        │                             ▼
        │                  ┌──────────────────────┐
        │                  │ 4. Refresh Token     │
        │                  │ POST /api/auth/refresh│
        │                  │ (refreshToken cookie)│
        │                  └──────┬───────────────┘
        │                         │
        │                         ▼
        │                  ┌──────────────────────┐
        │                  │ New Access Token     │
        │                  │ (15 min)             │
        │                  └──────┬───────────────┘
        │                         │
        └─────────────────┬───────┘
                          │
                          ▼
                  ✅ Retry Original Request
```

### Authentication Endpoints

**Signup: Create New User**
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "password": "SecurePassword123",
    "role": "user"
  }'
```

Response (201):
```json
{
  "success": true,
  "message": "User registered successfully. Please log in.",
  "data": {
    "id": 1,
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "role": "user",
    "createdAt": "2025-10-30T10:00:00Z"
  },
  "timestamp": "2025-10-30T10:00:00Z"
}
```

**Login: Authenticate & Get Tokens**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "SecurePassword123"
  }'
```

Response (200) with HTTP-only cookie:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "role": "user"
    }
  },
  "timestamp": "2025-10-30T10:00:00Z"
}
```

HTTP Header also sets:
```
Set-Cookie: refreshToken=<7daytoken>; HttpOnly; Secure; SameSite=Strict; Path=/
```

**Refresh Token: Get New Access Token**
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Cookie: refreshToken=<7daytoken>"
```

Response (200):
```json
{
  "success": true,
  "message": "Access token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "Alice Johnson",
      "email": "alice@example.com",
      "role": "user"
    }
  },
  "timestamp": "2025-10-30T10:00:00Z"
}
```

### Protected API Routes

All protected routes require a valid access token in the `Authorization` header:

**Access Protected Route:**
```bash
curl -X GET http://localhost:3000/api/reports \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Missing Token (401):**
```json
{
  "success": false,
  "message": "Unauthorized: Missing authentication token",
  "error": { "code": "MISSING_TOKEN" },
  "timestamp": "2025-10-30T10:00:00Z"
}
```

**Invalid/Expired Token (401):**
```json
{
  "success": false,
  "message": "Unauthorized: Invalid or expired token",
  "error": { "code": "INVALID_TOKEN" },
  "timestamp": "2025-10-30T10:00:00Z"
}
```

### Role-Based Access Control (RBAC)

Three user roles with different permissions:

| Role | Permissions | Use Case |
|------|-------------|----------|
| **user** | Create own reports, view own reports | Household members reporting waste segregation |
| **volunteer** | Create/verify reports, view local reports | Community volunteers verifying submissions |
| **admin** | Full access (create, read, update, delete, verify) | Municipal authorities managing system |

**Permission Mapping:**

```typescript
{
  admin: [
    'create_user', 'read_user', 'update_user', 'delete_user',
    'create_report', 'read_report', 'update_report', 'delete_report',
    'verify_report', 'view_all_reports', 'access_analytics', 'manage_roles'
  ],
  volunteer: [
    'read_user', 'create_report', 'read_report', 'update_report',
    'verify_report', 'view_local_reports'
  ],
  user: [
    'read_user', 'create_report', 'read_report', 'update_report', 'view_own_reports'
  ]
}
```

**Middleware Authorization Check:**

Global `app/middleware.ts` validates tokens for all protected routes:
1. Extract JWT from `Authorization: Bearer <token>` header
2. Verify token signature and expiry
3. For admin routes, check if user role is `admin`
4. Attach user info (`x-user-id`, `x-user-email`, `x-user-role`) to request
5. Block unauthorized requests with 403 Forbidden

**Admin-Only Route Example:**
```bash
# Regular user attempting admin access
curl -X GET http://localhost:3000/api/admin \
  -H "Authorization: Bearer <user-token>"
```

Response (403):
```json
{
  "success": false,
  "message": "Forbidden: Admin access required",
  "error": { "code": "ADMIN_ACCESS_REQUIRED" },
  "timestamp": "2025-10-30T10:00:00Z"
}
```

### Security Best Practices

**Token Storage:**
- ✅ Access tokens → Response body (frontend stores in memory)
- ✅ Refresh tokens → HTTP-only cookies (protected from XSS)
- ❌ Never store sensitive tokens in `localStorage` (vulnerable to XSS)

**Password Security:**
- Passwords hashed with bcrypt (10 salt rounds) before storage
- Never stored in plain text or returned in API responses
- Compared using `bcrypt.compare()` to prevent timing attacks

**Token Expiry & Rotation:**
- Access tokens expire in 15 minutes (minimal exposure window)
- Refresh tokens expire in 7 days (require re-login for long-term access)
- Tokens are rotated on each refresh for additional security

**HTTPS & Cookies:**
- Access tokens sent in request body (can work over HTTP in dev)
- Refresh tokens use `Secure` flag (HTTPS only in production)
- `SameSite=Strict` prevents CSRF attacks
- `HttpOnly` flag prevents JavaScript access (XSS protection)

**Environment Variables:**
Store these securely (never commit):
```env
JWT_SECRET=your-long-random-secret-key-minimum-32-chars
REFRESH_TOKEN_SECRET=your-long-random-refresh-secret-key
```

---

## Frontend Architecture Foundation

### Page Routing & Dynamic Routes

SegreGate uses Next.js 13+ App Router with file-based routing for intuitive page structure and dynamic parameters.

**Route Structure:**
```
app/
 ├── page.tsx                    → Home (public)
 ├── login/page.tsx              → Login page
 ├── dashboard/page.tsx          → Dashboard (protected)
 ├── users/
 │   └── [id]/page.tsx           → Dynamic user profile
 ├── not-found.tsx               → Custom 404 page
 └── layout.tsx                  → Global layout wrapper
```

**Public Routes:**
- `/` — Home page (everyone)
- `/login` — Login page (unauthenticated users)
- `/not-found` — Custom 404 error page

**Protected Routes:**
- `/dashboard` — User dashboard (requires authentication)
- `/users/[id]` — Dynamic user profile (requires authentication)

**Dynamic Routes Example:**
```bash
# Visit any user profile with dynamic [id] parameter
curl http://localhost:3000/users/1
curl http://localhost:3000/users/42
```

### Component Architecture

Reusable component structure ensures consistency, maintainability, and scalability:

**Folder Structure:**
```
components/
 ├── layout/
 │   ├── Header.tsx              → Navigation header
 │   ├── Sidebar.tsx             → Navigation sidebar
 │   └── LayoutWrapper.tsx        → Layout container
 └── ui/
     └── Button.tsx              → Reusable button
```

**Component Hierarchy:**
```
LayoutWrapper
 ├── Header (navigation, user info, logout)
 ├── Sidebar (dynamic links based on role)
 └── Main Content (page children)
```

**Key Components:**

1. **Header** (`components/layout/Header.tsx`)
   - Sticky navigation at top
   - User info and logout button
   - Responsive burger menu toggle
   - Theme toggle button

2. **Sidebar** (`components/layout/Sidebar.tsx`)
   - Dynamic navigation links based on authentication and role
   - Public links (Home)
   - Authenticated links (Dashboard, Reports, Profile)
   - Admin-only links (conditionally rendered)
   - Collapsible on mobile, always visible on desktop

3. **LayoutWrapper** (`components/layout/LayoutWrapper.tsx`)
   - Composes Header + Sidebar + Main content
   - Applied globally via `app/layout.tsx`
   - Ensures consistent UI across all pages

4. **Button** (`components/ui/Button.tsx`)
   - Reusable with variants: `primary`, `secondary`, `danger`
   - Supports disabled state, custom classes, and event handlers
   - Tailwind-based styling for consistency

### State Management with Context & Hooks

Global state management using React Context API and custom hooks eliminates prop-drilling and centralizes logic.

**Architecture:**
```
AuthProvider (app/layout.tsx)
 └── AuthContext (context/AuthContext.tsx)
      └── Custom Hook: useAuth()

UIProvider (app/layout.tsx)
 └── UIContext (context/UIContext.tsx)
      └── Custom Hook: useUI()
```

**AuthContext** (`context/AuthContext.tsx`)
```typescript
interface AuthContextType {
  user: User | null;                    // Currently logged-in user
  isAuthenticated: boolean;               // Login status
  login: (user: User) => void;           // Set user and auth state
  logout: () => void;                    // Clear user and auth state
}
```

**UIContext** (`context/UIContext.tsx`)
```typescript
interface UIContextType {
  theme: "light" | "dark";               // Current theme
  toggleTheme: () => void;               // Switch theme
  sidebarOpen: boolean;                  // Sidebar visibility
  toggleSidebar: () => void;             // Toggle sidebar
}
```

**Custom Hooks:**

1. **useAuth()** (`hooks/useAuth.ts`)
   - Provides access to authentication state
   - Usage: `const { user, isAuthenticated, login, logout } = useAuth();`
   - Access user data, check login status, trigger login/logout

2. **useUI()** (`hooks/useUI.ts`)
   - Provides access to UI state (theme, sidebar)
   - Usage: `const { theme, toggleTheme, sidebarOpen, toggleSidebar } = useUI();`
   - Theme switching, sidebar toggle for responsive design

**Example Usage in Components:**
```tsx
"use client";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <p>Please log in to access dashboard</p>;
  }

  return <div>Welcome, {user?.name}!</div>;
}
```

**Provider Setup** (`app/layout.tsx`):
```tsx
<AuthProvider>
  <UIProvider>
    <LayoutWrapper>{children}</LayoutWrapper>
  </UIProvider>
</AuthProvider>
```

### Routing with Middleware (Authentication)

Global middleware (`app/middleware.ts`) from PR-5 protects routes:
- Validates JWT tokens from `Authorization` headers
- Enforces admin-only route access (403 Forbidden)
- Attaches user info (`x-user-*` headers) for route handlers

Protected routes in **app/middleware.ts**:
```typescript
const PROTECTED_ROUTES = ["/api/reports", "/api/users"];
const ADMIN_ONLY_ROUTES = ["/api/admin"];
```

### Layout Features

- **Responsive Design**: Sidebar collapses on mobile, visible on desktop
- **Dark Mode**: Toggle between light/dark themes via UIContext
- **Dynamic Navigation**: Links change based on authentication and role
- **Consistent Styling**: Tailwind CSS for unified look and feel

---

## Team Branching & PR Workflow

### Branch Naming Conventions

All branches must follow one of these patterns for consistency and traceability:

- `feature/<feature-name>` — New feature work (e.g., `feature/user-authentication`)
- `fix/<bug-name>` — Bug fixes (e.g., `fix/navbar-styling`)
- `chore/<task-name>` — Maintenance, config, dependency updates (e.g., `chore/upgrade-next-js`)
- `docs/<update-name>` — Documentation updates (e.g., `docs/api-guide`)

**Why:** Consistent naming helps everyone quickly understand branch purpose, improves git history readability, and enables automated tooling.

### Creating & Pushing a Branch

```bash
# Create and switch to a new branch
git checkout -b feature/my-feature

# Make your changes
# ... edit files ...

# Stage and commit
git add .
git commit -m "feat: add login page with email/password validation"

# Push to GitHub (sets upstream)
git push -u origin feature/my-feature

# Go to GitHub and open a Pull Request
```

### Pull Request Process

1. **Open PR** — Push your branch and create a PR on GitHub
2. **Auto-checks** — Lint, build, and test workflows run automatically
3. **Code Review** — At least one teammate reviews using the checklist below
4. **Address Feedback** — Commit changes, push again (no need to re-open PR)
5. **Merge** — Once approved and checks pass, merge and delete the branch

**PR Template:** See [.github/pull_request_template.md](.github/pull_request_template.md) for the required format in every PR.

### Code Review Checklist

Every reviewer should verify:

- ✅ **Code Quality**
  - Code follows naming and folder structure conventions
  - No TODO comments left unresolved
  - Comments explain *why*, not just *what*
  - No hardcoded values (use env vars instead)

- ✅ **Testing & Build**
  - Code builds: `pnpm build`
  - Lint passes: `pnpm lint`
  - No console errors or warnings when testing locally
  - Changes verified in browser/device if UI-related

- ✅ **Security & Secrets**
  - No credentials, API keys, or secrets in code
  - Only `.env.example` committed, never `.env.local`
  - No sensitive console logs

- ✅ **Documentation**
  - Meaningful git commit messages
  - README updated if setup/workflow changed
  - Complex logic has JSDoc comments

- ✅ **Git Hygiene**
  - Branch is up to date with `main`
  - Commit history is clean and logical

### Branch Protection Rules (GitHub Settings)

The `main` branch is protected with these rules (configured in repo settings):

1. ✅ Require pull request reviews before merging
2. ✅ Require at least 1 approval
3. ✅ Require status checks to pass (build, lint, test)
4. ✅ Require branches to be up to date before merging

> **How to view/modify:** Go to **Settings → Branches → Branch protection rules → main**

### Why This Workflow Works

- **Quality** — Code reviews catch issues before they reach production
- **Traceability** — Clear branch names and PR descriptions make history searchable
- **Team Knowledge** — Reviews spread expertise and reduce silos
- **Safety** — Protected `main` means all changes are vetted
- **Velocity** — Clear process removes ambiguity; no "what should I do?" delays
- **Trust** — Everyone follows the same rules; fairness and consistency build team momentum

This workflow mirrors real-world teams at startups and large companies — learning it now sets you up for professional work.

---

## Security Hardening (PR-10)

### Input Sanitization & OWASP Compliance

**2.36 — Input Sanitization & OWASP Compliance**

SegreGate implements comprehensive input sanitization to prevent XSS, SQL Injection, and other injection attacks.

**Sanitization Library:** `src/lib/sanitize.ts`
- ✅ `sanitizeHtmlInput()` — Removes HTML tags from text inputs
- ✅ `sanitizeEmail()` — Validates and normalizes email addresses
- ✅ `sanitizeUrl()` — Validates URLs and blocks javascript: / data: URLs
- ✅ `isInputSafe()` — Detects common attack patterns (SQL injection, XSS)
- ✅ `escapeHtml()` — Safely escapes HTML entities

**Applied To:**
- `/api/reports` — Sanitizes location, description, photoUrl
- `/api/users` — Sanitizes name, email
- All forms use React Hook Form + Zod validation

**OWASP Top 10 Compliance:**
| Risk | Mitigation |
|------|-----------|
| A3: Injection | Parameterized Prisma queries + input sanitization |
| A7: XSS | HTML sanitization + React auto-escaping |
| A5: Broken Access | Role-based authorization + JWT validation |
| A1: Auth Bypass | Secure token management + bcrypt hashing |

**Example Attack Prevention:**
```typescript
// User uploads malicious input
Input: "<script>alert('XSS')</script>"

// After sanitization
Stored: "alert('XSS')"  // Tags removed, safe to display

// Rendered safely
Output: <div>alert('XSS')</div>  // No script execution
```

### HTTPS Enforcement & Secure Headers

**2.37 — HTTPS Enforcement and Secure Headers**

Security headers are configured globally in `src/lib/security-headers.ts` and applied to all responses via `next.config.ts`.

**Security Headers Implemented:**

| Header | Purpose | Value |
|--------|---------|-------|
| **HSTS** | Force HTTPS connections | `max-age=63072000; includeSubDomains; preload` |
| **CSP** | Restrict script sources (prevent XSS) | `default-src 'self'; script-src 'self' ...` |
| **X-Frame-Options** | Prevent clickjacking | `SAMEORIGIN` |
| **X-Content-Type-Options** | Prevent MIME sniffing | `nosniff` |
| **Referrer-Policy** | Control referrer sharing | `strict-origin-when-cross-origin` |
| **Permissions-Policy** | Disable sensitive APIs | Block geolocation, microphone, camera |

**CORS Security:**
```typescript
// Only these origins can access the API
ALLOWED_ORIGINS = [
  'https://segregate.example.com',      // Production
  'https://admin.segregate.example.com',  // Admin
  'http://localhost:3000',              // Local dev
]
```

- ✅ Blocks unauthorized cross-origin requests
- ✅ Prevents CSRF attacks
- ✅ Validates origins in middleware

**Verify Headers Locally:**
```bash
# Command line
curl -I http://localhost:3000

# Or use DevTools
# Network → Click any request → Response Headers
# Look for: Strict-Transport-Security, Content-Security-Policy, etc.
```

**Security Scanner:**
- Run [securityheaders.com](https://securityheaders.com) scan
- Enter deployment domain
- Get security score and recommended fixes

### Testing Security Features

**Test XSS Prevention:**
1. Go to `/reports/new`
2. Try submitting: `<script>alert('XSS')</script>`
3. Verify: Input is sanitized, no alert appears

**Test CSRF/CORS:**
1. Open browser DevTools Console
2. Try API request from different domain:
   ```javascript
   fetch('http://localhost:3000/api/users', {
     credentials: 'include',
   })
   ```
3. Verify: CORS error in console (expected)

**Test SQL Injection:**
1. Try submitting: `' OR '1'='1`
2. Verify: Treated as literal text (Prisma uses parameterized queries)

**Test Security Headers:**
1. Check DevTools Network tab
2. Verify headers present on every response
3. Use securityheaders.com for detailed analysis

### Continuous Security

**Practices:**
- Never commit secrets or credentials
- Always sanitize before saving user input
- Validate and escape output before rendering
- Keep dependencies updated: `pnpm audit`, `pnpm update`
- Review logs for suspicious activity

**Future Improvements:**
- [ ] Add rate limiting middleware
- [ ] Implement request/response logging
- [ ] Add OWASP CSP hardening for production
- [ ] Implement database query audit logs
- [ ] Add intrusion detection for suspicious patterns

---

**For detailed security implementation:**
See [SECURITY.md](./SECURITY.md) — Complete guide with examples, testing, and recommendations.

