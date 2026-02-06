# S65-0126-Orange-Full-Stack-With-NextjsAnd-AWS-Azure-SegreGate

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

