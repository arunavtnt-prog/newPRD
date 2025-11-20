# Pre-Deployment Checklist

**Project**: WaveLaunch Studio
**Version**: 1.0.0
**Date**: _______________
**Deployed By**: _______________

---

## 1. Code Quality ✓

- [ ] All unit tests passing (`npm test`)
- [ ] All E2E tests passing (`npm run test:e2e`)
- [ ] Test coverage > 70% (`npm run test:coverage`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] Code linted (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors in build output
- [ ] No hardcoded secrets in code

**Notes**: _______________________________________

---

## 2. Configuration ✓

- [ ] `.env.production` file created
- [ ] All required environment variables set
- [ ] `DATABASE_URL` configured with connection pooling
- [ ] `AUTH_SECRET` set (min 32 characters)
- [ ] `NEXT_PUBLIC_APP_URL` set to production URL
- [ ] Email service configured (RESEND/SENDGRID/SMTP)
- [ ] `EMAIL_FROM` address set
- [ ] CDN URL configured (if using)
- [ ] Error tracking configured (Sentry)
- [ ] Analytics configured (Google Analytics)

**Missing Variables**: _______________________________________

---

## 3. Database ✓

- [ ] Database created on production server
- [ ] Migrations applied (`npx prisma migrate deploy`)
- [ ] Prisma Client generated (`npx prisma generate`)
- [ ] Database indexes created (see `prisma/indexes.md`)
- [ ] Connection pooling enabled (20 connections)
- [ ] Backup strategy in place
- [ ] Test data seeded (if needed)
- [ ] Database accessible from app server

**Database Host**: _______________________________________

---

## 4. Security ✓

- [ ] HTTPS enabled
- [ ] SSL certificate valid
- [ ] Security headers configured (CSP, HSTS, etc.)
- [ ] CSRF protection enabled
- [ ] Rate limiting enabled
- [ ] SQL injection prevented (using Prisma)
- [ ] XSS vulnerabilities addressed
- [ ] Sensitive data not in client bundle
- [ ] API keys in environment variables only
- [ ] File upload validation enabled
- [ ] Authentication required for protected routes

**Security Audit Date**: _______________________________________

---

## 5. Performance ✓

- [ ] Images optimized (WebP, AVIF)
- [ ] Bundle size < 200KB gzipped
- [ ] Lighthouse Performance score 90+
- [ ] Lighthouse Accessibility score 95+
- [ ] Lighthouse Best Practices score 95+
- [ ] Lighthouse SEO score 100
- [ ] Core Web Vitals passing:
  - [ ] LCP < 2.5s
  - [ ] FID < 100ms
  - [ ] CLS < 0.1
- [ ] Caching headers configured (1 year for static assets)
- [ ] CDN configured for static assets (recommended)
- [ ] Service worker tested

**Lighthouse Score**: _____ / 100

---

## 6. PWA ✓

- [ ] `manifest.json` valid
- [ ] Service worker registers successfully
- [ ] Icons generated (72px - 512px)
- [ ] Offline page created and tested
- [ ] Install prompt tested on mobile
- [ ] App installs successfully
- [ ] App runs in standalone mode
- [ ] Push notifications work (if implemented)
- [ ] Background sync tested (if implemented)

**PWA Audit Date**: _______________________________________

---

## 7. Testing ✓

### Unit Tests
- [ ] Utility functions tested (60+ tests)
- [ ] Custom hooks tested (15+ tests)
- [ ] Validation functions tested (20+ tests)
- [ ] All tests passing

### Integration Tests
- [ ] API routes tested
- [ ] Database queries tested
- [ ] Authentication flow tested
- [ ] File upload tested

### E2E Tests
- [ ] Login flow works
- [ ] Signup flow works
- [ ] Project creation works
- [ ] Approval workflow works
- [ ] File upload works
- [ ] Search works
- [ ] Navigation works

### Manual Testing
- [ ] Tested on Chrome (desktop)
- [ ] Tested on Firefox (desktop)
- [ ] Tested on Safari (desktop)
- [ ] Tested on Chrome (mobile)
- [ ] Tested on Safari (iOS)
- [ ] Tested on slow 3G connection
- [ ] Tested offline functionality

**Test Report**: _______________________________________

---

## 8. Monitoring ✓

- [ ] Error tracking setup (Sentry, DataDog, etc.)
- [ ] Analytics setup (Google Analytics, Plausible, etc.)
- [ ] Uptime monitoring (Pingdom, UptimeRobot, etc.)
- [ ] Performance monitoring (Lighthouse CI)
- [ ] Database monitoring enabled
- [ ] Alert notifications configured
- [ ] Dashboard created for metrics

**Monitoring Dashboard URL**: _______________________________________

---

## 9. Documentation ✓

- [ ] README.md updated with:
  - [ ] Project description
  - [ ] Setup instructions
  - [ ] Environment variables list
  - [ ] Deployment instructions
  - [ ] Contact information
- [ ] API documentation complete
- [ ] Deployment runbook created
- [ ] Rollback procedure documented
- [ ] Troubleshooting guide created
- [ ] User documentation prepared (if needed)

**Documentation Location**: _______________________________________

---

## 10. Backups ✓

- [ ] Database backup strategy in place
- [ ] Automated daily backups configured
- [ ] Backup retention policy defined (30 days)
- [ ] Backup restore tested successfully
- [ ] File storage backups enabled (if using cloud storage)

**Last Backup Test**: _______________________________________

---

## 11. Legal & Compliance ✓

- [ ] Privacy policy updated
- [ ] Terms of service updated
- [ ] Cookie consent implemented (if needed)
- [ ] GDPR compliance verified (if EU users)
- [ ] Data retention policy defined
- [ ] User data export functionality (if needed)
- [ ] User data deletion functionality (if needed)

**Legal Review Date**: _______________________________________

---

## 12. Business Readiness ✓

- [ ] Stakeholders notified of deployment
- [ ] User communication prepared
- [ ] Support team trained
- [ ] Feature flags configured (if using)
- [ ] Rollback plan communicated
- [ ] Go-live date confirmed: _______________________________________
- [ ] Post-deployment monitoring plan in place

---

## 13. Infrastructure ✓

- [ ] Production server provisioned
- [ ] Domain configured
- [ ] DNS records updated
- [ ] Load balancer configured (if using)
- [ ] Firewall rules configured
- [ ] SSL certificate installed
- [ ] CDN configured (if using)
- [ ] Email service configured
- [ ] File storage configured (if using)

**Infrastructure Provider**: _______________________________________

---

## 14. Post-Deployment Plan ✓

- [ ] Health check endpoint tested (`/api/health`)
- [ ] Smoke tests prepared
- [ ] Monitoring dashboard ready
- [ ] On-call rotation scheduled
- [ ] Communication plan for issues
- [ ] Rollback procedure ready
- [ ] Post-deployment retrospective scheduled

---

## Final Sign-Off

### Technical Lead
- **Name**: _______________________________________
- **Signature**: _______________________________________
- **Date**: _______________________________________

### Product Owner
- **Name**: _______________________________________
- **Signature**: _______________________________________
- **Date**: _______________________________________

### DevOps/Infrastructure
- **Name**: _______________________________________
- **Signature**: _______________________________________
- **Date**: _______________________________________

---

## Deployment Commands

```bash
# 1. Pull latest code
git pull origin main

# 2. Install dependencies
npm ci

# 3. Run database migrations
npx prisma migrate deploy

# 4. Build application
npm run build

# 5. Run smoke tests
npm run test:smoke

# 6. Deploy
# (Platform-specific command)

# 7. Verify deployment
curl https://wavelaunch.studio/api/health
```

---

## Emergency Rollback

```bash
# Vercel
vercel rollback [deployment-url]

# Docker
docker pull your-registry/wavelaunch-studio:previous-tag
docker stop wavelaunch-studio
docker run -d --name wavelaunch-studio your-registry/wavelaunch-studio:previous-tag

# Database (if needed)
npx prisma migrate resolve --rolled-back [migration_name]
```

---

## Post-Deployment Monitoring (First 24 Hours)

**Hour 1**:
- [ ] Health check passing
- [ ] No 500 errors
- [ ] Login works
- [ ] Core features work

**Hour 4**:
- [ ] Error rate < 1%
- [ ] Response times < 2s
- [ ] No critical alerts

**Hour 24**:
- [ ] User feedback collected
- [ ] Performance metrics reviewed
- [ ] Error logs reviewed
- [ ] Backup verified

---

## Notes

_Use this space for deployment notes, issues encountered, and resolutions:_

____________________________________________________________________________

____________________________________________________________________________

____________________________________________________________________________

____________________________________________________________________________

____________________________________________________________________________

---

**Deployment Status**: ⬜ Ready | ⬜ In Progress | ⬜ Complete | ⬜ Rolled Back

**Production URL**: https://wavelaunch.studio

**Deployment Date**: _______________________________________

**Deployment Duration**: _______________________________________
