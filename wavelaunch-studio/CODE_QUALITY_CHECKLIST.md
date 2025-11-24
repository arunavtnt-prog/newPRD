# Code Quality Checklist for WaveLaunch Studio

This checklist ensures consistent, error-free code. **Review this before every commit.**

---

## 🗄️ Database & Schema

### Before Writing Queries

- [ ] **Check Prisma Schema** - Open `prisma/schema.prisma` and verify:
  - Field names exist and match exactly (case-sensitive)
  - Relationship names are correct (`project` vs `Project`)
  - Enum values are valid (`CREATOR` not `CLIENT`)

### Common Schema Errors to Avoid

| ❌ Wrong | ✅ Correct | Why |
|---------|----------|-----|
| `creatorEmail` | Use `team { some: { user: { email } } }` | Field doesn't exist |
| `role: "CLIENT"` | `role: "CREATOR"` | CLIENT role doesn't exist |
| `action` | `actionType` | Activity uses actionType |
| `description` | `actionDescription` | Activity uses actionDescription |
| `_count.projectPhases` | `phases.length` | Wrong relation name |
| `include: { project }` | `include: { project }` (context dependent) | Check capitalization |

### Use Type-Safe Helpers

Instead of writing queries manually:

```typescript
// ❌ Don't do this
const projects = await prisma.project.findMany({
  where: { creatorEmail: email } // ERROR: field doesn't exist
});

// ✅ Do this
import { getProjectsForUser } from '@/lib/db-helpers';
const projects = await getProjectsForUser(userId, role);
```

**Available Helpers:**
- `getProjectsForUser(userId, role)` - Get user's projects
- `getProjectById(projectId, userId, role)` - Get project with auth check
- `getRecentActivity(userId, role, limit)` - Get activity feed
- `getDashboardStats(userId, role)` - Get dashboard metrics
- `createActivity(data)` - Log activity with correct fields
- `getRedirectPathForRole(role)` - Role-based redirects
- `getLoginPathForRole(role)` - Role-based login paths

---

## 🔐 Authentication & Roles

### User Roles

Only 3 valid roles exist:
- `ADMIN` - Full system access
- `TEAM_MEMBER` - Team member access
- `CREATOR` - Client/creator access (NOT "CLIENT"!)

### Role-Based Redirects

❌ **Don't hardcode:**
```typescript
router.push('/dashboard'); // Which dashboard?
```

✅ **Use helper:**
```typescript
import { getRedirectPathForRole } from '@/lib/db-helpers';
router.push(getRedirectPathForRole(session.user.role));
```

### Login Paths

- Admin/Team: `/auth/v2/login` → `/dashboard`
- Creators: `/client/auth/login` → `/client/dashboard`

---

## 📦 Imports

### Module Imports

| ❌ Wrong | ✅ Correct |
|---------|----------|
| `from '@/lib/prisma'` | `from '@/lib/db'` |
| `from '../../../lib/db'` | `from '@/lib/db'` (use aliases) |

Pre-commit hooks will catch `@/lib/prisma` imports automatically.

---

## 🎯 Component Data Structures

### Count vs Arrays

When you need **just the count:**
```typescript
const project = await prisma.project.findUnique({
  where: { id },
  include: {
    _count: {
      select: {
        files: true,
        team: true,
      }
    }
  }
});

// Access: project._count.files
```

When you need **actual data:**
```typescript
const project = await prisma.project.findUnique({
  where: { id },
  include: {
    files: true,
    team: true,
  }
});

// Access: project.files.length
```

❌ **Don't mix:**
```typescript
// If you include { files: true }, don't use project._count.files
// Use project.files.length instead
```

---

## 🔄 Activity Logging

Always use correct field names:

```typescript
// ✅ Correct
import { createActivity } from '@/lib/db-helpers';

await createActivity({
  projectId,
  userId,
  actionType: 'FILE_UPLOADED',  // Not 'action'
  actionDescription: 'Uploaded design.pdf',  // Not 'description'
  metadata: { fileName: 'design.pdf' }
});
```

---

## 🧪 Testing Before Commit

### Run All Checks

```bash
npm run validate  # Runs type-check + lint + format check
```

### Individual Checks

```bash
npm run type-check    # TypeScript errors
npm run lint          # ESLint errors
npm run format:check  # Prettier formatting
```

### Pre-Commit Hooks

Pre-commit hooks automatically check for:
- ✅ TypeScript type errors
- ✅ ESLint violations
- ✅ `CLIENT` role usage (warns)
- ✅ `creatorEmail` field (blocks)
- ✅ `@/lib/prisma` imports (blocks)

**If blocked:** Fix the errors shown, then try committing again.

---

## 📝 Code Review Checklist

Before submitting PR:

### Schema & Database
- [ ] All field names match Prisma schema exactly
- [ ] Relationships use correct names and capitalization
- [ ] No hardcoded queries - use helpers when possible
- [ ] Activity logs use `actionType` and `actionDescription`

### Authentication
- [ ] Correct role used (`CREATOR` not `CLIENT`)
- [ ] Role-based redirects use helper functions
- [ ] Authorization checks present for sensitive operations
- [ ] No hardcoded dashboard paths

### Imports & Structure
- [ ] All imports from `@/lib/db` not `@/lib/prisma`
- [ ] Consistent use of path aliases (`@/`)
- [ ] No circular dependencies

### Type Safety
- [ ] TypeScript `npm run type-check` passes
- [ ] No `any` types without justification
- [ ] Component props have proper interfaces

### Testing
- [ ] Manual testing completed
- [ ] No console errors in browser
- [ ] All user flows work for different roles

---

## 🚨 Common Errors & Fixes

### Error: "Field 'creatorEmail' does not exist"

**Cause:** Trying to query non-existent field

**Fix:**
```typescript
// ❌ Wrong
where: { creatorEmail: email }

// ✅ Correct
where: {
  team: {
    some: {
      user: {
        email: email
      }
    }
  }
}

// ✅ Better: Use helper
import { getProjectsForUser } from '@/lib/db-helpers';
const projects = await getProjectsForUser(userId, role);
```

### Error: "Cannot read property 'toLowerCase' of undefined"

**Cause:** Relation capitalization mismatch

**Fix:** Check schema for correct relation name
```typescript
// If schema says 'project' (lowercase):
Activity.project

// If schema says 'Project' (capital):
Activity.Project
```

### Error: "Property '_count' does not exist"

**Cause:** Forgot to include `_count` in query

**Fix:**
```typescript
include: {
  _count: {
    select: {
      files: true,
      team: true,
    }
  }
}
```

### Error: Wrong redirect after login

**Cause:** Hardcoded redirect path

**Fix:**
```typescript
import { getRedirectPathForRole } from '@/lib/db-helpers';

// After successful login:
const redirectPath = getRedirectPathForRole(session.user.role);
router.push(redirectPath);
```

---

## 🛠️ Tools & Resources

### Schema Reference
- **Prisma Schema:** `prisma/schema.prisma`
- **Schema Validator:** `src/lib/validation/schema-validator.ts`
- **Field Lists:** See `USER_FIELDS`, `PROJECT_FIELDS`, `ACTIVITY_FIELDS`

### Type-Safe Helpers
- **DB Helpers:** `src/lib/db-helpers.ts`
- **Query Helpers:** All pre-built, tested, type-safe

### Validation
- **Pre-commit Hooks:** `.husky/pre-commit`
- **ESLint Rules:** `eslint.config.mjs` + `eslint-custom-rules.mjs`
- **Type Checking:** `npm run type-check`

---

## ✅ Daily Workflow

1. **Before coding:** Review schema for fields/relations you'll use
2. **While coding:** Use helpers from `db-helpers.ts`
3. **Before commit:** Run `npm run validate`
4. **On commit:** Pre-commit hooks auto-check
5. **After commit:** Verify changes in staging/local

---

## 🎓 Learning Resources

### When Unsure:
1. Check `prisma/schema.prisma` first
2. Look at `src/lib/db-helpers.ts` for examples
3. Search codebase for similar patterns
4. Ask before creating new query patterns

### Key Files to Bookmark:
- `prisma/schema.prisma` - Source of truth
- `src/lib/db-helpers.ts` - Type-safe helpers
- `src/lib/validation/schema-validator.ts` - Validation utils
- This checklist!

---

**Remember:** Most errors are preventable with proper schema awareness and using the provided helpers! 🎯
