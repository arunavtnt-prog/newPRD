# Migration Checklist

Quick reference checklist for database migrations. Print this and check off items as you go!

## Pre-Migration

### 1. Planning
- [ ] Schema change template filled out (`.github/SCHEMA_CHANGE_TEMPLATE.md`)
- [ ] Change motivation documented
- [ ] Impact analysis completed
- [ ] Breaking changes identified
- [ ] Rollback plan written

### 2. Schema Updates
- [ ] `prisma/schema.prisma` updated
- [ ] Schema validated (`npx prisma validate`)
- [ ] New fields are nullable (if adding to existing table)
- [ ] Indexes added for queried fields
- [ ] Relations properly defined

### 3. Migration Generation
- [ ] Migration generated (`npm run db:migrate`)
- [ ] Migration name is descriptive
- [ ] Migration SQL reviewed and correct
- [ ] Rollback SQL written
- [ ] Data migration script ready (if needed)

### 4. Code Updates
- [ ] `src/lib/validation/schema-validator.ts` updated
- [ ] Field constants updated (USER_FIELDS, PROJECT_FIELDS, etc.)
- [ ] `src/lib/db-helpers.ts` updated (if needed)
- [ ] New helper functions added
- [ ] Existing helpers modified
- [ ] Type definitions updated

### 5. Testing Updates
- [ ] `src/test/test-utils.ts` fixtures updated
- [ ] New unit tests written
- [ ] Existing tests updated
- [ ] Integration tests added (if needed)

### 6. Local Testing
- [ ] Database reset and migrated (`npx prisma migrate reset`)
- [ ] Migrations applied successfully
- [ ] Seed data loaded (`npm run db:seed`)
- [ ] Tests passing (`npm run test:run`)
- [ ] Type check passing (`npm run type-check`)
- [ ] Lint passing (`npm run lint`)
- [ ] Application runs (`npm run dev`)
- [ ] Manual testing completed

### 7. Rollback Testing
- [ ] Rollback SQL tested locally
- [ ] Database successfully rolled back
- [ ] Application works after rollback
- [ ] Data integrity maintained

## Staging Deployment

### 8. Prepare Staging
- [ ] Staging environment variables set
- [ ] Staging database backed up
- [ ] Team notified of staging deployment

### 9. Deploy to Staging
- [ ] Code pushed to staging branch
- [ ] CI/CD pipeline passed
- [ ] Migrations applied on staging
- [ ] Staging application deployed
- [ ] Health check passed

### 10. Test on Staging
- [ ] All features tested
- [ ] New functionality verified
- [ ] Performance tested
- [ ] Edge cases tested
- [ ] Error handling tested
- [ ] Rollback tested on staging (if possible)

### 11. Staging Sign-off
- [ ] QA approved
- [ ] Product team approved (if needed)
- [ ] Performance acceptable
- [ ] No critical issues found

## Production Deployment

### 12. Pre-Production
- [ ] Production database backed up
- [ ] Rollback plan reviewed
- [ ] Team on standby
- [ ] Monitoring alerts configured
- [ ] Users notified (if downtime expected)
- [ ] Maintenance window scheduled (if needed)

### 13. Production Deployment
- [ ] Code merged to main branch
- [ ] CI/CD pipeline running
- [ ] Migrations applying...
- [ ] Migration completed successfully
- [ ] Application deploying...
- [ ] Application deployed successfully

### 14. Post-Deployment Verification
- [ ] Health check passed (`curl /health`)
- [ ] Smoke tests passed
- [ ] Database queries working
- [ ] No error spikes in logs
- [ ] Performance metrics normal
- [ ] User-facing features working

### 15. Monitoring (First Hour)
- [ ] Error rates normal
- [ ] Response times acceptable
- [ ] Database performance good
- [ ] No alerts triggered
- [ ] User reports monitored

## Rollback Procedure (If Needed)

### 16. Emergency Rollback
- [ ] Issue identified and documented
- [ ] Team notified
- [ ] Database backup ready
- [ ] Code reverted (`git revert [hash]`)
- [ ] Code redeployed
- [ ] Migration rolled back (if needed)
- [ ] Rollback SQL applied (if needed)
- [ ] Application verified working
- [ ] Postmortem scheduled

## Post-Migration

### 17. Cleanup
- [ ] Deployment successful confirmed
- [ ] Team notified of completion
- [ ] Users notified (if there was downtime)
- [ ] Documentation updated
- [ ] Schema change template archived

### 18. Monitoring (First 24 Hours)
- [ ] No elevated error rates
- [ ] Performance stable
- [ ] User feedback positive
- [ ] Database indexes being used
- [ ] Query performance good

### 19. Review
- [ ] What went well?
- [ ] What could be improved?
- [ ] Any issues encountered?
- [ ] Update process documentation
- [ ] Share learnings with team

---

## Quick Command Reference

```bash
# Validate schema
npx prisma validate

# Generate migration
npm run db:migrate
# or: npx prisma migrate dev --name descriptive_name

# Reset and migrate (local only!)
npx prisma migrate reset --force

# Deploy migrations (staging/production)
npm run db:migrate:deploy
# or: npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Resolve rolled-back migration
npx prisma migrate resolve --rolled-back [name]

# Run tests
npm run test:run

# Type check
npm run type-check

# Full validation
npm run validate

# Database backup (PostgreSQL)
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database (PostgreSQL)
psql $DATABASE_URL < backup_file.sql
```

## Red Flags 🚨

Stop and review if you encounter:

- [ ] Migration taking longer than expected (>5 minutes)
- [ ] Migration errors in logs
- [ ] Tests failing after migration
- [ ] Type errors after migration
- [ ] Performance degradation
- [ ] Error rate increase
- [ ] Database CPU spike
- [ ] User reports of issues

**When in doubt, ROLLBACK!**

## Emergency Contacts

- Tech Lead: _______________
- Database Admin: _______________
- DevOps: _______________
- On-call: _______________

## Notes

Use this space for deployment-specific notes:

---

**Print this checklist and check off items during deployment!**
