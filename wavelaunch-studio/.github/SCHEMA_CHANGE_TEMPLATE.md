# Schema Change: [Short Description]

## Date
YYYY-MM-DD

## Author
Your Name

## Change Summary
Brief description of the change (1-2 sentences)

## Motivation
Why are we making this change?
- Business requirement?
- Performance improvement?
- Bug fix?
- Technical debt?

## Impact Analysis

### Database Impact
- [ ] New table/model
- [ ] New field(s)
- [ ] Modified field type
- [ ] New index
- [ ] Data migration required
- [ ] Estimated migration time: ___
- [ ] Estimated downtime: ___
- [ ] Affects X rows in production

### Code Impact
- [ ] New helper functions needed
- [ ] Existing helpers need updates
- [ ] Validator updates needed
- [ ] API routes need changes
- [ ] Frontend components need changes

### Breaking Changes
- [ ] None
- [ ] API changes (list below)
- [ ] Data structure changes (list below)

List any breaking changes:
- ...

## Schema Changes

### Before
```prisma
// Current schema
model User {
  id String @id
  email String @unique
}
```

### After
```prisma
// Updated schema
model User {
  id String @id
  email String @unique
  phoneNumber String? // NEW FIELD
}
```

## Migration Plan

### Forward Migration
```sql
-- Add phone number field to User table
ALTER TABLE "User" ADD COLUMN "phoneNumber" TEXT;
```

### Rollback Migration
```sql
-- Remove phone number field from User table
ALTER TABLE "User" DROP COLUMN "phoneNumber";
```

### Data Migration (if needed)
```sql
-- Example: Populate new field from existing data
-- UPDATE "User" SET "phoneNumber" = '+1' || "oldPhoneField";
```

## Code Updates

### Validator Updates
```typescript
// src/lib/validation/schema-validator.ts
export const USER_FIELDS = [
  'id',
  'email',
  'phoneNumber', // ADD THIS
  // ...
] as const;
```

### Helper Updates
```typescript
// src/lib/db-helpers.ts (if needed)
export async function getUserByPhoneNumber(phoneNumber: string) {
  return await prisma.user.findFirst({
    where: { phoneNumber },
  });
}
```

### Test Updates
```typescript
// src/test/test-utils.ts
export const mockUsers = {
  admin: {
    // ...existing fields
    phoneNumber: '+1234567890', // ADD THIS
  },
};
```

## Testing Plan

### Unit Tests
- [ ] Test validator accepts new field
- [ ] Test helper functions work correctly
- [ ] Test edge cases (null, invalid format, etc.)

### Integration Tests
- [ ] Test API endpoints with new field
- [ ] Test database queries
- [ ] Test relationships (if applicable)

### Manual Testing
- [ ] Tested on local environment
- [ ] Tested with seed data
- [ ] Tested with production-like data volume
- [ ] Tested on staging environment
- [ ] Performance tested (query time < X ms)

## Rollback Plan

### If deployment fails:

1. **Revert code changes:**
   ```bash
   git revert [commit-hash]
   git push origin main
   ```

2. **Rollback migration:**
   ```bash
   npx prisma migrate resolve --rolled-back [migration-name]
   ```

3. **Apply rollback SQL:**
   ```bash
   psql $DATABASE_URL < rollback.sql
   ```

4. **Verify rollback:**
   ```bash
   # Test application
   curl https://wavelaunch.studio/health
   
   # Check database
   psql $DATABASE_URL -c "\d \"User\""
   ```

### Rollback tested?
- [ ] Rollback SQL written
- [ ] Rollback tested locally
- [ ] Rollback documented above

## Performance Impact

### Query Performance
- Expected query time: ___ ms
- Tested with ___ rows
- Index needed? [ ] Yes [ ] No

### Storage Impact
- Estimated storage increase: ___ MB/GB
- Acceptable? [ ] Yes [ ] No

## Deployment Checklist

### Pre-Deployment
- [ ] Schema change template filled out
- [ ] Prisma schema updated
- [ ] Migration generated and reviewed
- [ ] Validators updated
- [ ] Helpers updated (if needed)
- [ ] Tests written and passing
- [ ] Rollback SQL written and tested
- [ ] Peer review completed
- [ ] Tested locally (migrate reset + migrate)
- [ ] Deployed to staging
- [ ] Tested on staging
- [ ] Performance verified on staging

### Production Preparation
- [ ] Backup plan documented
- [ ] Rollback plan documented and tested
- [ ] Downtime scheduled (if needed)
- [ ] Users notified (if downtime needed)
- [ ] Monitoring alerts configured
- [ ] Team notified of deployment

### Post-Deployment
- [ ] Migration applied successfully
- [ ] Application deployed
- [ ] Health check passed
- [ ] Smoke tests passed
- [ ] Performance monitoring active
- [ ] No error spikes in logs
- [ ] Database queries performing as expected

## Monitoring Plan

### Metrics to Watch
- [ ] Migration execution time
- [ ] Query performance for affected tables
- [ ] Error rates
- [ ] Response times
- [ ] Database CPU/memory usage

### Alert Thresholds
- Error rate > X%
- Response time > X ms
- Database CPU > X%

## Communication Plan

### Stakeholders to Notify
- [ ] Development team
- [ ] QA team
- [ ] Product team
- [ ] End users (if downtime)

### Notification Template
```
🚀 Schema Change Deployment

What: [Brief description]
When: [Date and time]
Impact: [None/Minor/Moderate]
Downtime: [None/X minutes]
Actions Required: [None/List any]

Contact: [Your name/team]
```

## Notes and Learnings

Any additional notes, issues encountered, or learnings from this change:

- ...

## Sign-off

### Developer
- [ ] I have tested this change thoroughly
- [ ] I have written rollback procedures
- [ ] I am confident this change is safe

Name: _______________  Date: _______________

### Reviewer
- [ ] I have reviewed the schema changes
- [ ] I have reviewed the migration SQL
- [ ] I have reviewed the rollback plan
- [ ] I approve this change for deployment

Name: _______________  Date: _______________

---

**Reference Documents:**
- [Schema Change Workflow](../docs/SCHEMA_CHANGE_WORKFLOW.md)
- [Environment Management](../docs/ENVIRONMENT_MANAGEMENT.md)
- [Error Prevention Guide](../ERROR_PREVENTION_GUIDE.md)
