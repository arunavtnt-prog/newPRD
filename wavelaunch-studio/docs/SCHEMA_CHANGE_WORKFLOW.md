# Schema Change Workflow

This document outlines the complete process for making schema changes safely in WaveLaunch Studio.

## Table of Contents

- [Overview](#overview)
- [When to Use This Workflow](#when-to-use-this-workflow)
- [Schema Change Process](#schema-change-process)
- [Schema Change Template](#schema-change-template)
- [Migration Best Practices](#migration-best-practices)
- [Common Schema Changes](#common-schema-changes)
- [Rollback Procedures](#rollback-procedures)
- [Testing Migrations](#testing-migrations)

## Overview

Schema changes in WaveLaunch Studio require careful coordination between:
1. Prisma schema updates
2. Database migrations
3. Helper function updates
4. Validator updates
5. Code updates
6. Tests

This workflow ensures zero-error schema changes.

## When to Use This Workflow

Use this workflow when making any of these changes:

- Adding new models
- Adding new fields to existing models
- Modifying field types
- Adding/removing relationships
- Changing field constraints (nullable, unique, etc.)
- Renaming fields or models
- Adding indexes

## Schema Change Process

### Step 1: Plan the Change

**Use the Schema Change Template** (see below) to document:
- What change you're making
- Why you're making it
- Impact analysis
- Rollback plan

### Step 2: Update Prisma Schema

1. **Modify `prisma/schema.prisma`**

```prisma
// Example: Adding a new field
model User {
  id String @id @default(cuid())
  email String @unique
  // NEW FIELD
  phoneNumber String? // Optional field
  createdAt DateTime @default(now())
}
```

2. **Run validation**

```bash
npx prisma validate
```

### Step 3: Create Migration

1. **Generate migration**

```bash
npm run db:migrate
# or
npx prisma migrate dev --name add_phone_number_to_users
```

2. **Review generated migration** in `prisma/migrations/`

```sql
-- Migration: add_phone_number_to_users
ALTER TABLE "User" ADD COLUMN "phoneNumber" TEXT;
```

3. **Test rollback SQL** (write it now!)

```sql
-- Rollback: remove_phone_number_from_users
ALTER TABLE "User" DROP COLUMN "phoneNumber";
```

### Step 4: Update Validators

**Update `src/lib/validation/schema-validator.ts`**

```typescript
export const USER_FIELDS = [
  'id',
  'email',
  'phoneNumber', // ADD NEW FIELD
  // ... other fields
] as const;
```

### Step 5: Update Helpers (if needed)

**If the field needs helper functions, update `src/lib/db-helpers.ts`**

```typescript
export async function getUserByPhoneNumber(phoneNumber: string) {
  return await prisma.user.findFirst({
    where: { phoneNumber },
  });
}
```

### Step 6: Update Tests

1. **Update test fixtures** in `src/test/test-utils.ts`

```typescript
export const mockUsers = {
  admin: {
    // ... existing fields
    phoneNumber: '+1234567890', // ADD NEW FIELD
  },
};
```

2. **Add tests for new functionality**

```typescript
describe('getUserByPhoneNumber', () => {
  it('should find user by phone number', async () => {
    // test implementation
  });
});
```

### Step 7: Run Tests

```bash
# Run all tests
npm run test:run

# Run type check
npm run type-check

# Run validation
npm run validate
```

### Step 8: Test Migration Locally

```bash
# Reset database
npx prisma migrate reset --force

# Apply migrations
npm run db:migrate

# Seed data
npm run db:seed

# Test application
npm run dev
```

### Step 9: Commit Changes

```bash
git add prisma/schema.prisma
git add prisma/migrations/
git add src/lib/validation/schema-validator.ts
git add src/lib/db-helpers.ts
git add src/test/

git commit -m "feat(schema): add phoneNumber field to User model

- Add phoneNumber optional field
- Update validators and helpers
- Add tests for phone number functionality
- Migration: 20240324_add_phone_number_to_users"
```

### Step 10: Deploy to Staging

```bash
# Push to staging branch
git push origin feature/add-phone-number

# Wait for CI/CD to deploy
# Test on staging environment
```

### Step 11: Deploy to Production

```bash
# Merge to main
# CI/CD will automatically:
# 1. Run tests
# 2. Apply migrations
# 3. Deploy application
```

## Schema Change Template

**Copy this template for each schema change:**

```markdown
# Schema Change: [Short Description]

## Date
YYYY-MM-DD

## Author
Your Name

## Change Summary
Brief description of the change

## Motivation
Why are we making this change?

## Impact Analysis

### Database Impact
- [ ] New table/model
- [ ] New field(s)
- [ ] Modified field type
- [ ] New index
- [ ] Data migration required
- [ ] Estimated migration time: ___
- [ ] Estimated downtime: ___

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

## Migration Plan

### Forward Migration
```sql
-- SQL for forward migration
```

### Rollback Migration
```sql
-- SQL for rollback
```

### Data Migration (if needed)
```sql
-- SQL for data transformation
```

## Testing Plan

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Tested on local environment
- [ ] Tested on staging environment
- [ ] Performance tested with production data volume

## Rollback Plan

If deployment fails:
1. Revert code changes: `git revert [commit-hash]`
2. Rollback migration: `npx prisma migrate resolve --rolled-back [migration-name]`
3. Apply rollback SQL: `psql $DATABASE_URL < rollback.sql`

## Deployment Checklist

- [ ] Schema change template filled out
- [ ] Prisma schema updated
- [ ] Migration generated and reviewed
- [ ] Validators updated
- [ ] Helpers updated (if needed)
- [ ] Tests written and passing
- [ ] Rollback SQL written and tested
- [ ] Tested locally
- [ ] Deployed to staging
- [ ] Tested on staging
- [ ] Production backup taken
- [ ] Deployed to production
- [ ] Verified on production

## Notes

Any additional notes or considerations
```

## Migration Best Practices

### DO ✅

1. **Make migrations reversible**
   - Always write rollback SQL
   - Test rollbacks locally

2. **Use nullable fields for new columns**
   ```prisma
   phoneNumber String? // Optional initially
   ```

3. **Add indexes for frequently queried fields**
   ```prisma
   @@index([phoneNumber])
   ```

4. **Use transactions for complex migrations**
   ```typescript
   await prisma.$transaction([
     // multiple operations
   ]);
   ```

5. **Test with production-like data volumes**
   ```bash
   # Generate test data
   npm run db:seed -- --count=10000
   ```

### DON'T ❌

1. **Don't modify existing migrations**
   - Create new migration instead
   - Existing migrations may have already run

2. **Don't make multiple unrelated changes in one migration**
   - Keep migrations focused
   - Easier to rollback

3. **Don't skip testing on staging**
   - Always test migrations on staging first

4. **Don't deploy during peak hours**
   - Schedule maintenance windows
   - Notify users in advance

5. **Don't assume instant migrations**
   - Large tables take time
   - Plan for downtime if needed

## Common Schema Changes

### Adding a New Field

```prisma
model User {
  // Existing fields
  newField String? // Start as optional
}
```

**Helper update:**
```typescript
export const USER_FIELDS = [
  // ... existing
  'newField',
] as const;
```

### Changing Field Type

```prisma
// Before
email String

// After (requires data migration)
email String @unique
```

**Migration with data transformation:**
```sql
-- Create temp column
ALTER TABLE "User" ADD COLUMN "email_new" TEXT;

-- Copy and transform data
UPDATE "User" SET "email_new" = LOWER(TRIM("email"));

-- Drop old column
ALTER TABLE "User" DROP COLUMN "email";

-- Rename new column
ALTER TABLE "User" RENAME COLUMN "email_new" TO "email";

-- Add unique constraint
ALTER TABLE "User" ADD CONSTRAINT "User_email_key" UNIQUE ("email");
```

### Adding a Relationship

```prisma
model User {
  posts Post[]
}

model Post {
  authorId String
  author User @relation(fields: [authorId], references: [id])
}
```

**Helper update:**
```typescript
export async function getPostsForUser(userId: string) {
  return await prisma.post.findMany({
    where: { authorId: userId },
    include: { author: true },
  });
}
```

### Renaming a Field

```prisma
// Before
creatorEmail String

// After
creatorName String
```

**Migration strategy:**
```sql
-- Step 1: Add new field
ALTER TABLE "Project" ADD COLUMN "creatorName" TEXT;

-- Step 2: Copy data (may need transformation)
UPDATE "Project" SET "creatorName" = "creatorEmail";

-- Step 3: Make new field required (if needed)
ALTER TABLE "Project" ALTER COLUMN "creatorName" SET NOT NULL;

-- Step 4: Drop old field (in next migration after code update)
ALTER TABLE "Project" DROP COLUMN "creatorEmail";
```

## Rollback Procedures

### Scenario 1: Migration Failed

```bash
# Check migration status
npx prisma migrate status

# Mark migration as rolled back
npx prisma migrate resolve --rolled-back [migration-name]

# Fix issue and re-run
npm run db:migrate
```

### Scenario 2: Migration Succeeded but Code Has Issues

```bash
# Revert code
git revert [commit-hash]
git push

# Keep database as-is (new field nullable won't cause issues)
# Or rollback migration if causing problems
```

### Scenario 3: Need to Revert Production

```bash
# 1. Take database backup first!
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Apply rollback SQL
psql $DATABASE_URL < rollback_migration.sql

# 3. Revert code deployment
git revert [commit-hash]
git push origin main

# 4. Verify application works
curl https://wavelaunch.studio/health
```

## Testing Migrations

### Local Testing

```bash
# Start fresh
npx prisma migrate reset --force

# Apply all migrations
npm run db:migrate

# Seed test data
npm run db:seed

# Run application
npm run dev

# Test functionality
npm run test:run
```

### Staging Testing

```bash
# Deploy to staging
git push origin develop

# Wait for CI/CD

# Test on staging
curl https://staging.wavelaunch.studio/health

# Run integration tests
npm run test:e2e
```

### Performance Testing

```bash
# Generate large dataset
npm run db:seed -- --count=10000

# Time the migration
time npm run db:migrate

# Check query performance
EXPLAIN ANALYZE SELECT * FROM "User" WHERE "phoneNumber" = '+1234567890';
```

## Checklist for Every Schema Change

- [ ] Schema change template filled out
- [ ] Prisma schema updated
- [ ] Migration generated (`npm run db:migrate`)
- [ ] Migration reviewed (SQL inspection)
- [ ] Rollback SQL written
- [ ] Validators updated (`schema-validator.ts`)
- [ ] Helpers updated if needed (`db-helpers.ts`)
- [ ] Test fixtures updated (`test-utils.ts`)
- [ ] Tests written for new functionality
- [ ] All tests passing (`npm run test:run`)
- [ ] Type check passing (`npm run type-check`)
- [ ] Migration tested locally (reset + migrate)
- [ ] Rollback tested locally
- [ ] Changes committed with descriptive message
- [ ] Deployed to staging
- [ ] Tested on staging
- [ ] Peer reviewed
- [ ] Production backup plan ready
- [ ] Deployment scheduled (if downtime needed)
- [ ] Users notified (if downtime needed)
- [ ] Deployed to production
- [ ] Verified on production
- [ ] Monitoring active for issues

## Next Steps

1. Copy the schema change template for your change
2. Follow the step-by-step process
3. Use the checklist to ensure nothing is missed
4. Document any issues or learnings

For environment setup, see [ENVIRONMENT_MANAGEMENT.md](./ENVIRONMENT_MANAGEMENT.md)
