# Error Prevention System - WaveLaunch Studio

This guide explains how we prevent errors like the ones found in the recent dev report.

---

## 🎯 Problem Summary

Recent issues found:
1. ❌ Module import mismatches (`@/lib/prisma` vs `@/lib/db`)
2. ❌ Role mismatch (`CLIENT` vs `CREATOR`)
3. ❌ Non-existent fields (`creatorEmail`)
4. ❌ Schema relationship errors
5. ❌ Hardcoded redirects
6. ❌ Field name mismatches (`action` vs `actionType`)
7. ❌ Data structure confusion (`_count` vs array lengths)

**Root Cause:** Lack of type safety, schema awareness, and automated validation

**Solution:** Multi-layer error prevention system (implemented below)

---

## 🛡️ Error Prevention Layers

### Layer 1: Type Safety (TypeScript)

**What:** Strict TypeScript configuration with compile-time checks

**How it helps:**
- Catches type mismatches before runtime
- Enforces correct field names from Prisma types
- Prevents accessing non-existent properties

**Usage:**
```bash
npm run type-check  # Run before every commit
```

**Automatic:** Pre-commit hook runs `type-check` automatically

---

### Layer 2: Schema Validation

**What:** Utilities that validate code against Prisma schema

**Location:** `src/lib/validation/schema-validator.ts`

**What it provides:**
- Valid field lists for each model
- Role and status validation
- Common query mistake reference

**Example:**
```typescript
import { validateField, isValidRole } from '@/lib/validation/schema-validator';

// Check if field exists
if (!validateField('Project', 'creatorEmail')) {
  // Error: field doesn't exist
}

// Validate role
if (!isValidRole('CLIENT')) {
  // Error: use CREATOR instead
}
```

---

### Layer 3: Type-Safe Database Helpers

**What:** Pre-built, tested query functions that always use correct fields

**Location:** `src/lib/db-helpers.ts`

**Available Functions:**

| Function | Purpose | Prevents |
|----------|---------|----------|
| `getProjectsForUser()` | Get user's projects | creatorEmail errors, wrong relationships |
| `getProjectById()` | Get single project | Unauthorized access, field errors |
| `getRecentActivity()` | Get activity feed | actionType vs action confusion |
| `getDashboardStats()` | Get metrics | Count vs array confusion |
| `createActivity()` | Log activity | Wrong field names |
| `getRedirectPathForRole()` | Get redirect URL | Hardcoded paths |

**Example:**
```typescript
// ❌ Error-prone manual query
const projects = await prisma.project.findMany({
  where: { creatorEmail: email }  // FIELD DOESN'T EXIST!
});

// ✅ Type-safe helper (always correct)
import { getProjectsForUser } from '@/lib/db-helpers';
const projects = await getProjectsForUser(userId, role);
```

**Rule:** If a helper exists for your use case, **always use it** instead of manual queries.

---

### Layer 4: ESLint Rules

**What:** Custom linting rules that catch schema errors

**Location:** `eslint-custom-rules.mjs`

**What it catches:**

1. **CLIENT role usage**
   ```typescript
   // Detected and auto-fixed to CREATOR
   role: "CLIENT"
   ```

2. **creatorEmail field**
   ```typescript
   // Blocked with error message
   where: { creatorEmail: email }
   ```

3. **Wrong Activity fields**
   ```typescript
   // Auto-fixed
   item.action → item.actionType
   ```

4. **Hardcoded redirects**
   ```typescript
   // Warning: use getRedirectPathForRole() instead
   router.push('/dashboard')
   ```

5. **Wrong imports**
   ```typescript
   // Auto-fixed
   from '@/lib/prisma' → from '@/lib/db'
   ```

**Runs automatically:**
- On file save (if IDE configured)
- On commit (pre-commit hook)
- In CI/CD pipeline

---

### Layer 5: Pre-Commit Hooks

**What:** Automated checks before code is committed

**Location:** `.husky/pre-commit`

**What it checks:**

1. ✅ **TypeScript Errors**
   - Runs `npm run type-check`
   - Blocks commit if errors found

2. ✅ **ESLint Violations**
   - Runs `npx lint-staged`
   - Auto-fixes when possible

3. ✅ **Schema Errors** (Regex checks)
   - Detects `CLIENT` role usage (warns)
   - Detects `creatorEmail` field (blocks)
   - Detects `@/lib/prisma` imports (blocks)

**Output Example:**
```bash
🔍 Running pre-commit checks...
📘 Running TypeScript type check...
✅ No type errors

🔧 Running ESLint...
✅ All files pass

🗄️  Checking for schema errors...
❌ Error: Found 'creatorEmail' field which doesn't exist in schema.
Use project.team relationship to access user emails.
```

**Can't commit until errors are fixed!**

---

### Layer 6: Code Quality Checklist

**What:** Human review checklist for every PR

**Location:** `CODE_QUALITY_CHECKLIST.md`

**When to use:** Before submitting pull request

**Covers:**
- Database field verification
- Role usage validation
- Import consistency
- Type safety
- Testing requirements

---

## 🔄 Development Workflow

### Daily Workflow (Prevents Errors)

```
1. Pull latest changes
   ↓
2. Check Prisma schema for fields you'll use
   ↓
3. Write code using type-safe helpers
   ↓
4. Run 'npm run validate' before commit
   ↓
5. Commit (pre-commit hooks auto-check)
   ↓
6. Review CODE_QUALITY_CHECKLIST.md
   ↓
7. Submit PR
```

### Before Writing Queries

```
1. Open prisma/schema.prisma
   ↓
2. Find the model (User, Project, Activity, etc.)
   ↓
3. Verify field names exist
   ↓
4. Check relationship names & capitalization
   ↓
5. Look for existing helper in db-helpers.ts
   ↓
6. Use helper if available, or create type-safe query
```

---

## 🚀 Quick Start Guide

### For New Developers

1. **Read These Files First:**
   ```
   - CODE_QUALITY_CHECKLIST.md (this one!)
   - ERROR_PREVENTION_GUIDE.md
   - prisma/schema.prisma
   - src/lib/db-helpers.ts
   ```

2. **Bookmark Schema Fields:**
   - Open `src/lib/validation/schema-validator.ts`
   - Review `USER_FIELDS`, `PROJECT_FIELDS`, `ACTIVITY_FIELDS`

3. **Install IDE Extensions:**
   - ESLint
   - Prettier
   - Prisma (syntax highlighting)

4. **Configure IDE:**
   - Enable "Format on Save"
   - Enable "ESLint Auto Fix on Save"

5. **Before First Commit:**
   ```bash
   npm run validate  # Make sure everything passes
   ```

---

## 🔍 How to Diagnose Errors

### "Field doesn't exist" Error

1. **Check schema:**
   ```bash
   cat prisma/schema.prisma | grep -A 20 "model Project"
   ```

2. **Look at validator:**
   ```typescript
   import { PROJECT_FIELDS } from '@/lib/validation/schema-validator';
   console.log(PROJECT_FIELDS);
   ```

3. **Search codebase:**
   ```bash
   git grep "fieldName" -- "*.ts" "*.tsx"
   ```

### "Cannot read property X of undefined" Error

**Common Cause:** Relation capitalization

1. Check schema: Is it `project` or `Project`?
2. Check if relation was included in query
3. Add null check: `data?.relation?.field`

### "Role/Status Invalid" Error

1. Check: `src/lib/validation/schema-validator.ts`
2. Valid roles: `ADMIN`, `TEAM_MEMBER`, `CREATOR`
3. Valid statuses listed in `PROJECT_STATUSES`

---

## 🧪 Testing Strategy

### Unit Tests (Coming Soon)

Test type-safe helpers:
```typescript
describe('getProjectsForUser', () => {
  it('should return projects for CREATOR role', async () => {
    const projects = await getProjectsForUser(userId, 'CREATOR');
    expect(projects).toBeDefined();
  });
});
```

### Integration Tests

Test critical flows:
- User registration → email verification → login
- File upload → storage → retrieval
- Project creation → team assignment → access

### Manual Testing

Before every PR:
1. Test in browser
2. Check different user roles
3. Verify no console errors
4. Test error states

---

## 📊 Metrics & Monitoring

### What We Track

1. **Pre-commit blocks**
   - How many commits blocked
   - What errors caught

2. **ESLint violations**
   - Which rules triggered most
   - Auto-fix success rate

3. **TypeScript errors**
   - Type errors over time
   - Most common type issues

4. **Production errors**
   - Schema-related errors in logs
   - User-reported issues

### Goal

- Zero schema-related production errors
- 100% pre-commit hook pass rate
- <5% manual intervention needed

---

## 🎓 Training & Resources

### Quick Reference

| Need | Resource |
|------|----------|
| Valid fields | `src/lib/validation/schema-validator.ts` |
| Query examples | `src/lib/db-helpers.ts` |
| Schema | `prisma/schema.prisma` |
| Checklist | `CODE_QUALITY_CHECKLIST.md` |
| Common errors | This file (ERROR_PREVENTION_GUIDE.md) |

### Learning Path

1. **Week 1:** Read all docs, review schema
2. **Week 2:** Use helpers for all queries
3. **Week 3:** Contribute new helpers if needed
4. **Ongoing:** Review checklist before every PR

---

## 🔧 Maintenance

### Monthly Review

1. **Check pre-commit logs**
   - What errors are being caught?
   - Do we need new rules?

2. **Review new helpers needed**
   - Common query patterns
   - Repeated code

3. **Update documentation**
   - New fields in schema
   - New helpers added

### After Schema Changes

1. Run: `npm run db:generate`
2. Update `schema-validator.ts` field lists
3. Update `db-helpers.ts` if needed
4. Update documentation
5. Test all affected queries

---

## ✅ Success Criteria

You're following the system correctly when:

- ✅ Zero pre-commit hook blocks (all checks pass first try)
- ✅ Using helpers from `db-helpers.ts` instead of manual queries
- ✅ No hardcoded role checks or redirects
- ✅ TypeScript errors caught before commit
- ✅ Schema errors caught by ESLint
- ✅ Code reviews focus on logic, not field names

---

## 🆘 Getting Help

### Error Not Covered?

1. Check schema first: `prisma/schema.prisma`
2. Check if helper exists: `src/lib/db-helpers.ts`
3. Search codebase for similar patterns
4. Create issue with:
   - Error message
   - What you tried
   - Schema context

### Contributing

Found a common error pattern?
1. Add ESLint rule in `eslint-custom-rules.mjs`
2. Add helper in `db-helpers.ts`
3. Update this documentation
4. Add to pre-commit checks if needed

---

## 📈 Future Improvements

### Planned

- [ ] Automated tests for all helpers
- [ ] Schema change detection in CI
- [ ] Performance monitoring for queries
- [ ] Query optimization suggestions

### Ideas

- AI-powered schema validation
- Auto-generate helpers from schema
- Real-time schema docs in IDE
- Query performance profiler

---

**Remember:** This system is only effective if everyone uses it! Make it part of your daily workflow. 🎯
