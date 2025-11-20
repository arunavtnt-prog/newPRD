# WaveLaunch Studio - Deployment Guide

## Overview

Complete guide for deploying WaveLaunch Studio to production with pre-deployment checklist, deployment steps, and post-deployment verification.

---

## Pre-Deployment Checklist

### ✅ Code Quality

- [ ] All tests passing (`npm test`)
- [ ] E2E tests passing (`npm run test:e2e`)
- [ ] No console errors in build
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] Code linted (`npm run lint`)
- [ ] Build succeeds (`npm run build`)

### ✅ Configuration

- [ ] Environment variables configured
- [ ] Database connection string set
- [ ] Authentication secrets configured
- [ ] Email service configured (if using)
- [ ] File storage configured (if using)
- [ ] CDN configured (optional)
- [ ] Error tracking configured (Sentry, etc.)

### ✅ Database

- [ ] Migrations applied (`npx prisma migrate deploy`)
- [ ] Seed data loaded (if needed)
- [ ] Database indexes created
- [ ] Connection pooling configured
- [ ] Backup strategy in place

### ✅ Performance

- [ ] Images optimized
- [ ] Bundle size < 200KB gzipped
- [ ] Lighthouse score 90+ (all categories)
- [ ] Core Web Vitals passing
- [ ] Caching headers configured
- [ ] CDN for static assets (recommended)

### ✅ Security

- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] CSRF protection enabled
- [ ] Rate limiting enabled
- [ ] SQL injection prevented (Prisma)
- [ ] XSS vulnerabilities addressed
- [ ] Sensitive data not in client bundle
- [ ] API keys in environment variables

### ✅ PWA

- [ ] Service worker configured
- [ ] Manifest.json valid
- [ ] Icons generated (72px - 512px)
- [ ] Offline page created
- [ ] Install prompt tested

### ✅ Monitoring

- [ ] Error tracking setup (Sentry, DataDog)
- [ ] Analytics setup (Google Analytics, Plausible)
- [ ] Uptime monitoring (Pingdom, UptimeRobot)
- [ ] Performance monitoring (Lighthouse CI)
- [ ] Database monitoring

### ✅ Documentation

- [ ] README updated
- [ ] API documentation complete
- [ ] Deployment runbook created
- [ ] Rollback procedure documented

---

## Environment Variables

Create `.env.production` file:

```env
# App
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://wavelaunch.studio
NEXT_TELEMETRY_DISABLED=1

# Database (with connection pooling)
DATABASE_URL="postgresql://user:password@host:5432/db?connection_limit=20&pool_timeout=20"

# Authentication
AUTH_SECRET=your_super_secret_key_min_32_characters
AUTH_TRUST_HOST=true

# Email (choose one)
RESEND_API_KEY=re_xxxxxxxxxxxxx
# OR
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
# OR
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password

EMAIL_FROM=notifications@wavelaunchstudio.com

# File Upload (optional)
UPLOADTHING_SECRET=sk_xxxxxxxxxxxxx
UPLOADTHING_APP_ID=xxxxxxxxxxxxx

# CDN (optional)
NEXT_PUBLIC_CDN_URL=https://cdn.wavelaunch.studio

# Error Tracking (optional)
SENTRY_DSN=https://xxxxxxxxxxxxx@sentry.io/xxxxxxxxxxxxx

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Push Notifications (optional)
VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
```

---

## Deployment Platforms

### Option 1: Vercel (Recommended for Next.js)

#### Prerequisites
- Vercel account
- GitHub repository

#### Steps

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel

   # Login
   vercel login

   # Deploy
   vercel --prod
   ```

2. **Configure Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.production`

3. **Configure Database**
   - Use Vercel Postgres, Supabase, or external provider
   - Add `DATABASE_URL` to environment variables

4. **Deploy**
   ```bash
   git push origin main
   # Vercel auto-deploys on push
   ```

### Option 2: Docker + Cloud Provider

#### Prerequisites
- Docker installed
- Cloud provider account (AWS, GCP, Azure, DigitalOcean)

#### Create Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js app
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Build and Deploy

```bash
# Build Docker image
docker build -t wavelaunch-studio .

# Run locally to test
docker run -p 3000:3000 --env-file .env.production wavelaunch-studio

# Push to container registry
docker tag wavelaunch-studio:latest your-registry/wavelaunch-studio:latest
docker push your-registry/wavelaunch-studio:latest

# Deploy to cloud provider
# (Follow provider-specific instructions)
```

### Option 3: VPS (Ubuntu)

#### Prerequisites
- Ubuntu 22.04 server
- Domain name
- SSH access

#### Setup Script

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone https://github.com/your-org/wavelaunch-studio.git
cd wavelaunch-studio

# Install dependencies
npm ci

# Build app
npm run build

# Start with PM2
pm2 start npm --name "wavelaunch" -- start
pm2 save
pm2 startup

# Configure Nginx
sudo nano /etc/nginx/sites-available/wavelaunch

# Add configuration:
server {
    listen 80;
    server_name wavelaunch.studio;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/wavelaunch /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install SSL certificate
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d wavelaunch.studio -d www.wavelaunch.studio
```

---

## Database Migration

### Before First Deploy

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed initial data (optional)
npx prisma db seed
```

### For Updates

```bash
# Create migration
npx prisma migrate dev --name your_migration_name

# Deploy to production
npx prisma migrate deploy
```

---

## Post-Deployment Verification

### Automated Checks

```bash
# Health check endpoint
curl https://wavelaunch.studio/api/health

# Test API endpoints
curl https://wavelaunch.studio/api/projects

# Run smoke tests
npm run test:smoke
```

### Manual Verification

1. **Authentication**
   - [ ] Can login with credentials
   - [ ] Can logout
   - [ ] Protected routes require auth

2. **Core Features**
   - [ ] Can create project
   - [ ] Can view project details
   - [ ] Can request approval
   - [ ] Can review approval
   - [ ] Can upload files
   - [ ] Can search

3. **Performance**
   - [ ] Pages load < 3s
   - [ ] No console errors
   - [ ] Images lazy load
   - [ ] Service worker registers

4. **PWA**
   - [ ] Install prompt appears
   - [ ] App works offline (cached pages)
   - [ ] Icons display correctly
   - [ ] Manifest is valid

5. **Mobile**
   - [ ] Responsive on mobile
   - [ ] Touch interactions work
   - [ ] Mobile navigation works

---

## Monitoring Setup

### Error Tracking (Sentry)

```bash
# Install Sentry
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard -i nextjs

# Configure in next.config.js
```

### Analytics (Google Analytics)

```typescript
// app/layout.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
      <GoogleAnalytics gaId="G-XXXXXXXXXX" />
    </html>
  )
}
```

### Uptime Monitoring

- **Pingdom**: https://www.pingdom.com/
- **UptimeRobot**: https://uptimerobot.com/
- **Better Uptime**: https://betteruptime.com/

Configure checks for:
- Homepage (/)
- API health endpoint (/api/health)
- Authentication endpoint
- Critical user flows

---

## Rollback Procedure

### Vercel

```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

### Docker

```bash
# Pull previous image
docker pull your-registry/wavelaunch-studio:previous-tag

# Stop current container
docker stop wavelaunch-studio

# Start with previous image
docker run -d --name wavelaunch-studio your-registry/wavelaunch-studio:previous-tag
```

### Database Rollback

```bash
# Revert last migration
npx prisma migrate resolve --rolled-back [migration_name]

# Apply previous migrations
npx prisma migrate deploy
```

---

## Performance Optimization

### CDN Configuration

Use Cloudflare, AWS CloudFront, or similar for:
- Static assets (`/_next/static/*`)
- Images
- Fonts

### Caching Strategy

```nginx
# Nginx caching
location /_next/static/ {
    expires 365d;
    add_header Cache-Control "public, immutable";
}

location /images/ {
    expires 365d;
    add_header Cache-Control "public, immutable";
}
```

### Database Optimization

```bash
# Add indexes
npx prisma migrate dev --name add_performance_indexes

# Connection pooling
DATABASE_URL="postgresql://...?connection_limit=20&pool_timeout=20"

# Enable query logging (development only)
npx prisma studio
```

---

## Backup & Disaster Recovery

### Database Backups

```bash
# PostgreSQL backup
pg_dump -U username -d database_name > backup.sql

# Restore
psql -U username -d database_name < backup.sql

# Automated daily backups (cron)
0 2 * * * pg_dump -U username -d database_name > /backups/backup_$(date +\%Y\%m\%d).sql
```

### File Backups

- Use cloud storage with versioning (S3, Google Cloud Storage)
- Enable automatic backups
- Test restore procedure regularly

---

## Scaling Considerations

### Horizontal Scaling

- Use load balancer (Nginx, AWS ALB)
- Deploy multiple app instances
- Session storage in Redis/database
- File storage in cloud (S3, etc.)

### Database Scaling

- Connection pooling (PgBouncer)
- Read replicas for read-heavy workloads
- Vertical scaling (more CPU/RAM)
- Consider managed database (RDS, Supabase)

---

## Troubleshooting

### Common Issues

**Build Fails**
```bash
# Clear cache
rm -rf .next node_modules
npm ci
npm run build
```

**Database Connection Issues**
```bash
# Test connection
npx prisma db pull

# Check environment variables
echo $DATABASE_URL

# Verify database is accessible
psql $DATABASE_URL
```

**Service Worker Issues**
```bash
# Clear browser cache
# Unregister service worker in DevTools
# Rebuild and test
```

---

## Support & Maintenance

### Weekly Tasks
- [ ] Review error logs
- [ ] Check uptime reports
- [ ] Review performance metrics
- [ ] Update dependencies (security patches)

### Monthly Tasks
- [ ] Review analytics
- [ ] Update documentation
- [ ] Test backups
- [ ] Review user feedback
- [ ] Plan feature updates

---

## Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

## Emergency Contacts

**Technical Issues**
- Primary: [Your Name] - [email]
- Secondary: [Backup Contact] - [email]

**Infrastructure**
- Hosting Provider Support
- Database Provider Support

**Business**
- Product Owner: [Name] - [email]
- Stakeholders: [Names] - [emails]
