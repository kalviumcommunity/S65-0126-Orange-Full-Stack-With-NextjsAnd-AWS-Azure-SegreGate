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

