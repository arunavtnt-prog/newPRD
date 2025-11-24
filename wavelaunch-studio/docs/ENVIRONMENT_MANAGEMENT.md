# Environment Management Guide

This guide explains how to manage different environments (development, staging, production) for WaveLaunch Studio.

## Table of Contents

- [Environment Overview](#environment-overview)
- [Environment Variables](#environment-variables)
- [Setting Up Environments](#setting-up-environments)
- [CI/CD Environment Configuration](#cicd-environment-configuration)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Environment Overview

WaveLaunch Studio supports three environments:

### 1. Development Environment
- **Purpose**: Local development and testing
- **Database**: Local PostgreSQL
- **URL**: `http://localhost:3000`
- **File**: `.env.local` (gitignored)

### 2. Staging Environment
- **Purpose**: Pre-production testing and QA
- **Database**: Staging PostgreSQL (cloud-hosted)
- **URL**: `https://staging.wavelaunch.studio`
- **File**: Environment variables set in hosting platform

### 3. Production Environment
- **Purpose**: Live application for end users
- **Database**: Production PostgreSQL (cloud-hosted)
- **URL**: `https://wavelaunch.studio`
- **File**: Environment variables set in hosting platform

## Environment Variables

### Required Variables (All Environments)

```bash
# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Authentication (NextAuth.js)
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Cloudinary (File Upload)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Email Service (Resend)
RESEND_API_KEY="your-resend-api-key"
```

### Optional Variables

```bash
# Email Service (Alternative - SendGrid)
SENDGRID_API_KEY="your-sendgrid-api-key"
SENDGRID_FROM_EMAIL="noreply@wavelaunch.studio"

# Email Service (Alternative - SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="noreply@wavelaunch.studio"

# Feature Flags
ENABLE_ANALYTICS="true"
ENABLE_DEBUG_LOGGING="false"
```

## Setting Up Environments

### Development Environment Setup

1. **Create `.env.local` file** in project root:

```bash
cp .env.example .env.local
```

2. **Fill in development values**:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/wavelaunch_dev"
NEXTAUTH_SECRET="development-secret-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
CLOUDINARY_CLOUD_NAME="your-dev-cloud"
CLOUDINARY_API_KEY="your-dev-key"
CLOUDINARY_API_SECRET="your-dev-secret"
RESEND_API_KEY="your-dev-resend-key"
```

3. **Run database setup**:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

4. **Start development server**:

```bash
npm run dev
```

### Staging Environment Setup

1. **Set up staging database** (e.g., on Railway, Supabase, or Neon):

```bash
# Example on Railway
railway login
railway new
railway add postgres
railway variables
```

2. **Configure environment variables** in your hosting platform (Vercel/Railway/etc.):

```bash
DATABASE_URL="<staging-database-url>"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"
NEXTAUTH_URL="https://staging.wavelaunch.studio"
CLOUDINARY_CLOUD_NAME="<staging-cloud>"
CLOUDINARY_API_KEY="<staging-key>"
CLOUDINARY_API_SECRET="<staging-secret>"
RESEND_API_KEY="<staging-resend-key>"
```

3. **Run migrations on staging**:

```bash
# If using Vercel
vercel env pull .env.staging
DATABASE_URL="<staging-url>" npm run db:migrate:deploy
```

### Production Environment Setup

1. **Set up production database** with proper backups and monitoring

2. **Configure environment variables** with production values:

```bash
DATABASE_URL="<production-database-url>"
NEXTAUTH_SECRET="<strong-production-secret>"
NEXTAUTH_URL="https://wavelaunch.studio"
CLOUDINARY_CLOUD_NAME="<production-cloud>"
CLOUDINARY_API_KEY="<production-key>"
CLOUDINARY_API_SECRET="<production-secret>"
RESEND_API_KEY="<production-resend-key>"
```

3. **Run production migrations**:

```bash
DATABASE_URL="<production-url>" npm run db:migrate:deploy
```

## CI/CD Environment Configuration

### GitHub Actions Secrets

Configure these secrets in GitHub repository settings:

**Development/Testing:**
- `TEST_DATABASE_URL`

**Staging:**
- `STAGING_DATABASE_URL`
- `STAGING_NEXTAUTH_SECRET`
- `STAGING_NEXTAUTH_URL`

**Production:**
- `PRODUCTION_DATABASE_URL`
- `PRODUCTION_NEXTAUTH_SECRET`
- `PRODUCTION_NEXTAUTH_URL`

**Shared:**
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `RESEND_API_KEY`

**Deployment:**
- `VERCEL_TOKEN` (if using Vercel)
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

### Setting GitHub Secrets

```bash
# Using GitHub CLI
gh secret set PRODUCTION_DATABASE_URL

# Or via GitHub UI:
# Settings > Secrets and variables > Actions > New repository secret
```

## Best Practices

### 1. Secret Management

- **NEVER commit `.env.local` or `.env`** to git
- Use strong, unique secrets for each environment
- Rotate secrets regularly (every 90 days)
- Use different API keys for each environment

### 2. Database Management

- **Development**: Use local database or dev cloud instance
- **Staging**: Use separate database from production
- **Production**: Enable backups, monitoring, and point-in-time recovery

### 3. Migration Strategy

- **Always test migrations on staging first**
- Run migrations before deploying code
- Keep migration rollback plans ready
- Never modify existing migrations

### 4. Environment Separation

- Use different Cloudinary folders per environment
- Use different email "from" addresses per environment
- Use separate analytics/monitoring per environment
- Tag resources with environment labels

### 5. Debugging

**Development:**
```bash
ENABLE_DEBUG_LOGGING=true
```

**Staging:**
```bash
ENABLE_DEBUG_LOGGING=true
ENABLE_ANALYTICS=false
```

**Production:**
```bash
ENABLE_DEBUG_LOGGING=false
ENABLE_ANALYTICS=true
```

## Troubleshooting

### Issue: Environment variables not loading

**Solution:**
```bash
# Verify .env.local exists
ls -la .env.local

# Restart dev server
npm run dev
```

### Issue: Database connection fails

**Solution:**
```bash
# Test connection
psql $DATABASE_URL

# Verify DATABASE_URL format
echo $DATABASE_URL
# Should be: postgresql://user:pass@host:5432/dbname
```

### Issue: Prisma client out of sync

**Solution:**
```bash
# Regenerate Prisma client
npm run db:generate

# If still failing
rm -rf node_modules/.prisma
npm run db:generate
```

### Issue: Different behavior between environments

**Checklist:**
- [ ] Same Node.js version?
- [ ] Same dependencies (check package-lock.json)?
- [ ] All environment variables set?
- [ ] Database migrations applied?
- [ ] Prisma client regenerated?

### Issue: Secrets exposed in logs

**Solution:**
```bash
# Never log environment variables
# Use redaction:
console.log('DB URL:', DATABASE_URL.replace(/:[^@]+@/, ':****@'))

# In production, disable console logging
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
}
```

## Environment-Specific Configuration

### Next.js Config

```javascript
// next.config.mjs
const config = {
  // Environment-specific settings
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXTAUTH_URL,
  },
  
  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    compiler: {
      removeConsole: true,
    },
  }),
};
```

### Prisma Config

```prisma
// schema.prisma
generator client {
  provider = "prisma-client-js"
  // Use binary targets for deployment
  binaryTargets = ["native", "rhel-openssl-1.0.x"]
}
```

## Monitoring & Alerts

### Recommended Setup

**Development:**
- Console logging
- Local error boundaries

**Staging:**
- Sentry (development mode)
- Performance monitoring
- Error tracking

**Production:**
- Sentry (production mode)
- Uptime monitoring (UptimeRobot)
- Database performance monitoring
- Log aggregation (Logtail, Datadog)

## Next Steps

1. Set up environment variables for your hosting platform
2. Configure CI/CD secrets in GitHub
3. Run staging deployment and test
4. Document any custom environment variables
5. Set up monitoring and alerts

For schema changes, see [SCHEMA_CHANGE_WORKFLOW.md](./SCHEMA_CHANGE_WORKFLOW.md)
