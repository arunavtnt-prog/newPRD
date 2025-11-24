# System Architecture - Error Prevention System

**Technical architecture and design decisions for the WaveLaunch Studio error prevention system**

---

## 🏛️ System Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Developer writes code                  │
└────────────────────┬────────────────────────────────────┘
                     │
      ┌──────────────┴──────────────┐
      │                             │
      ▼                             ▼
┌──────────┐                  ┌──────────┐
│ ESLint   │◄─────────────────┤ VS Code  │
│ (write)  │  Auto-fix        │ Editor   │
└────┬─────┘  errors           └──────────┘
     │
     ▼
┌──────────────────────────────────┐
│   TypeScript Compiler (tsc)      │
│   Checks types against schema    │
└────┬─────────────────────────────┘
     │
     ▼
┌──────────────────────────────────┐
│   Developer runs: npm run validate│
│   - type-check                    │
│   - lint                          │
│   - format:check                  │
└────┬─────────────────────────────┘
     │
     ▼
┌──────────────────────────────────┐
│   Developer commits code          │
└────┬─────────────────────────────┘
     │
     ▼
┌──────────────────────────────────┐
│   Pre-commit Hook (.husky)        │
│   - Runs type-check               │
│   - Runs ESLint                   │
│   - Checks schema patterns        │
│   ├─ Blocks if errors found       │
│   └─ Allows if all pass           │
└────┬─────────────────────────────┘
     │
     ▼
┌──────────────────────────────────┐
│   Code Review (Human)             │
│   Uses CODE_QUALITY_CHECKLIST.md │
└────┬─────────────────────────────┘
     │
     ▼
┌──────────────────────────────────┐
│   Merge to Main → Production      │
│   Schema errors prevented! ✅     │
└──────────────────────────────────┘
```

---

## 📦 Component Architecture

### Layer 1: Type-Safe Database Helpers

**File:** `src/lib/db-helpers.ts`

**Purpose:** Provide pre-built, tested, type-safe query functions

**Design Pattern:** Repository Pattern

```typescript
// Architecture:
// 1. Accept minimal required parameters
// 2. Handle authorization internally
// 3. Use correct Prisma types
// 4. Return properly typed data

export async function getProjectsForUser(
  userId: string,      // Required: who's asking
  role: UserRole       // Required: authorization context
): Promise<ProjectWithRelations[]> {  // Typed return
  // Authorization logic
  if (role === 'CREATOR') {
    // Only creator's projects
  } else if (role === 'ADMIN') {
    // All projects
  }

  // Type-safe Prisma query
  return await prisma.project.findMany({
    where: {/* correct where clause */},
    include: {/* all needed relations */},
  });
}
```

**Key Features:**
- Authorization baked in
- Always uses correct field names from schema
- TypeScript enforces correct usage
- Single point of update when schema changes

**When to Add New Helpers:**
```typescript
// Add helper if query is:
// 1. Used in 2+ places
// 2. Has complex authorization
// 3. Prone to errors (many fields)

// Example: Complex aggregation
export async function getProjectAnalytics(
  projectId: string,
  userId: string,
  role: UserRole
) {
  // Complex query with multiple aggregations
  // Better as helper than repeated code
}
```

---

### Layer 2: Schema Validators

**File:** `src/lib/validation/schema-validator.ts`

**Purpose:** Runtime validation and schema documentation

**Design Pattern:** Validator Pattern + Type Guards

```typescript
// Architecture:
// 1. Define constants for valid values
// 2. Provide validation functions
// 3. Use TypeScript type guards

export const USER_FIELDS = [
  'id',
  'email',
  'fullName',
  // ... complete list from schema
] as const;

// Type guard with runtime check
export function isValidRole(role: string): role is UserRole {
  return ['ADMIN', 'TEAM_MEMBER', 'CREATOR'].includes(role);
}

// Field validation
export function validateField(
  model: 'User' | 'Project' | 'Activity',
  field: string
): boolean {
  const fieldMap = {
    User: USER_FIELDS,
    Project: PROJECT_FIELDS,
    Activity: ACTIVITY_FIELDS,
  };
  return fieldMap[model].includes(field);
}
```

**Key Features:**
- Single source of truth for valid fields
- TypeScript integration (type guards)
- Self-documenting (field lists)
- Easy to update when schema changes

**Usage Pattern:**
```typescript
// In code that needs validation
import { validateField, isValidRole } from '@/lib/validation/schema-validator';

// Before querying
if (!validateField('Project', fieldName)) {
  throw new Error(`Invalid field: ${fieldName}`);
}

// For role checking
if (!isValidRole(userInput)) {
  throw new Error('Invalid role');
}
```

---

### Layer 3: Custom ESLint Rules

**File:** `eslint-custom-rules.mjs`

**Purpose:** Catch errors at write-time, auto-fix when possible

**Design Pattern:** AST (Abstract Syntax Tree) Analysis

```javascript
// Architecture:
// 1. Parse code into AST
// 2. Find patterns that indicate errors
// 3. Report error or auto-fix

export default {
  rules: {
    'no-creator-email-field': {
      create(context) {
        return {
          // Visit property nodes in AST
          Property(node) {
            // Check if property is 'creatorEmail'
            if (node.key.name === 'creatorEmail') {
              context.report({
                node,
                message: 'Field "creatorEmail" does not exist. Use team relationship.',
              });
            }
          },
        };
      },
    },
  },
};
```

**How It Works:**

1. **Developer writes code:**
   ```typescript
   where: { creatorEmail: email }
   ```

2. **ESLint parses into AST:**
   ```
   Property {
     key: Identifier { name: 'creatorEmail' },
     value: Identifier { name: 'email' }
   }
   ```

3. **Rule detects pattern:**
   - Sees property named 'creatorEmail'
   - Knows this field doesn't exist
   - Reports error

4. **Developer sees red squiggly in IDE**

**Auto-Fix Example:**
```javascript
'no-client-role': {
  meta: {
    fixable: 'code',  // Enable auto-fix
  },
  create(context) {
    return {
      Literal(node) {
        if (node.value === 'CLIENT') {
          context.report({
            node,
            message: 'Use "CREATOR" instead of "CLIENT"',
            fix(fixer) {
              // Auto-replace CLIENT with CREATOR
              return fixer.replaceText(node, '"CREATOR"');
            },
          });
        }
      },
    };
  },
},
```

---

### Layer 4: Pre-Commit Hooks

**File:** `.husky/pre-commit`

**Purpose:** Prevent bad code from being committed

**Design Pattern:** Git Hook + Shell Scripting

```bash
#!/usr/bin/env sh

# Architecture:
# 1. TypeScript compilation check
# 2. ESLint validation
# 3. Custom regex patterns for schema errors
# 4. Exit 1 if errors, 0 if success

# Step 1: Type checking
npm run type-check || {
  echo "❌ TypeScript errors found"
  exit 1
}

# Step 2: Linting
npx lint-staged || {
  echo "❌ ESLint errors found"
  exit 1
}

# Step 3: Schema pattern checking
if git diff --cached | grep -E 'creatorEmail'; then
  echo "❌ creatorEmail field doesn't exist"
  exit 1
fi
```

**Execution Flow:**
```
Developer runs: git commit -m "..."
       ↓
Git triggers: .husky/pre-commit
       ↓
Hook runs checks sequentially
       ↓
    ┌─ Check 1: TypeScript ─┐
    │   Pass → Continue      │
    │   Fail → Block commit  │
    └────────────────────────┘
       ↓
    ┌─ Check 2: ESLint ─────┐
    │   Pass → Continue      │
    │   Fail → Block commit  │
    └────────────────────────┘
       ↓
    ┌─ Check 3: Schema ─────┐
    │   Pass → Continue      │
    │   Fail → Block commit  │
    └────────────────────────┘
       ↓
All checks passed → Commit succeeds ✅
Any check failed → Commit blocked ❌
```

---

## 🔄 Data Flow

### Query Execution Flow

```
User Request
    ↓
API Route Handler
    ↓
Authentication Check (NextAuth)
    ↓
Import Helper from db-helpers.ts
    ↓
Helper Function
    ├─ Authorization Check (role-based)
    ├─ Type-Safe Prisma Query
    │   ├─ Uses correct field names (from schema)
    │   ├─ Includes necessary relations
    │   └─ Returns typed data
    ↓
Data returned to API handler
    ↓
Response sent to client
```

### Example: Get Projects

```typescript
// 1. API Route
// src/app/api/projects/route.ts
export async function GET(request: Request) {
  const session = await auth();
  if (!session) return unauthorized();

  // 2. Call Helper
  const projects = await getProjectsForUser(
    session.user.id,
    session.user.role
  );

  return Response.json(projects);
}

// 3. Helper Implementation
// src/lib/db-helpers.ts
export async function getProjectsForUser(userId, role) {
  // 4. Authorization
  if (role === 'CREATOR') {
    // Only user's projects
    return await prisma.project.findMany({
      where: {
        team: {  // ✅ Correct relationship
          some: {
            userId: userId  // ✅ Correct field
          }
        }
      }
    });
  }
  // ... other roles
}
```

---

## 🔒 Security Architecture

### Authorization Layers

**Layer 1: API Route Level**
```typescript
// All API routes check authentication
const session = await auth();
if (!session?.user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

**Layer 2: Helper Function Level**
```typescript
// Helpers enforce role-based access
export async function getProjectById(projectId, userId, role) {
  const project = await prisma.project.findUnique({...});

  // CREATOR role: Check if user is team member
  if (role === 'CREATOR') {
    const isMember = project.team.some(m => m.userId === userId);
    if (!isMember) {
      throw new Error('Unauthorized');
    }
  }

  return project;
}
```

**Layer 3: Database Level**
```prisma
// Prisma schema enforces data integrity
model ProjectUser {
  userId    String
  projectId String

  @@unique([projectId, userId])  // Can't add user twice
}
```

---

## 🧩 Integration Points

### TypeScript Integration

```typescript
// Prisma generates TypeScript types from schema
import { UserRole, ProjectStatus } from '@prisma/client';

// Types are enforced at compile time
function doSomething(role: UserRole) {
  if (role === 'INVALID') {  // ❌ TypeScript error!
    // 'INVALID' is not assignable to type UserRole
  }
}
```

### ESLint Integration

```json
// eslint.config.mjs
{
  plugins: {
    'wavelaunch': customRules,  // Our custom rules
  },
  rules: {
    'wavelaunch/no-creator-email': 'error',
    'wavelaunch/no-client-role': 'error',
  }
}
```

### Git Integration

```bash
# .husky/pre-commit runs on:
git commit

# Can't bypass without:
git commit --no-verify  # DON'T DO THIS!
```

---

## 📊 Performance Considerations

### Helper Function Caching

```typescript
// Consider caching for expensive queries
const projectCache = new Map<string, Project>();

export async function getProjectById(id: string) {
  // Check cache first
  if (projectCache.has(id)) {
    return projectCache.get(id);
  }

  // Query database
  const project = await prisma.project.findUnique({...});

  // Cache result
  projectCache.set(id, project);

  return project;
}
```

### Query Optimization

```typescript
// Helpers use optimized queries
export async function getDashboardStats(userId, role) {
  // ✅ Single query with aggregations
  const stats = await prisma.project.aggregate({
    where: {/* filters */},
    _count: {
      id: true,
      files: true,
    },
  });

  // ❌ Don't do multiple queries
  // const projects = await prisma.project.findMany(...);
  // const count = projects.length;  // Inefficient!
}
```

---

## 🔧 Maintenance & Updates

### When Schema Changes

**Checklist:**
1. Update `prisma/schema.prisma`
2. Run `npm run db:generate`
3. Update `schema-validator.ts` field lists
4. Update affected helpers in `db-helpers.ts`
5. Update ESLint rules if needed
6. Update tests
7. Update documentation

**Example:**
```typescript
// 1. Schema change: Add new field
model User {
  phoneNumber String?  // New field
}

// 2. Update validator
export const USER_FIELDS = [
  ...existing,
  'phoneNumber',  // Add here
] as const;

// 3. Update helper if needed
export async function getUser(id: string) {
  return await prisma.user.findUnique({
    select: {
      ...existing,
      phoneNumber: true,  // Include new field
    }
  });
}
```

---

## 🧪 Testing Architecture

### Unit Tests (Future)

```typescript
// tests/lib/db-helpers.test.ts
describe('getProjectsForUser', () => {
  it('returns only user projects for CREATOR role', async () => {
    const projects = await getProjectsForUser(userId, 'CREATOR');
    expect(projects.every(p =>
      p.team.some(m => m.userId === userId)
    )).toBe(true);
  });
});
```

### Integration Tests

```typescript
// tests/api/projects.test.ts
describe('GET /api/projects', () => {
  it('requires authentication', async () => {
    const response = await fetch('/api/projects');
    expect(response.status).toBe(401);
  });
});
```

---

## 📈 Monitoring & Metrics

### What to Track

1. **Pre-commit hook blocks**
   - How many commits blocked
   - What errors most common

2. **ESLint violations**
   - Which rules triggered
   - Auto-fix success rate

3. **Production errors**
   - Schema-related errors (should be zero)
   - Query performance issues

### Logging

```typescript
// helpers log important events
export async function getProjectsForUser(userId, role) {
  console.log(`[DB] getProjectsForUser: ${role} user ${userId}`);

  const start = Date.now();
  const result = await prisma.project.findMany({...});
  const duration = Date.now() - start;

  console.log(`[DB] Query completed in ${duration}ms, ${result.length} results`);

  return result;
}
```

---

## 🎯 Design Decisions

### Why Helpers Over Direct Prisma?

**Considered:**
- Direct Prisma queries everywhere
- Query builders
- ORM abstraction layer

**Chose Helpers Because:**
- ✅ Simple to understand
- ✅ Easy to test
- ✅ Single point of update
- ✅ Enforces authorization
- ✅ No learning curve

### Why Pre-Commit Hooks?

**Considered:**
- CI/CD only checks
- Manual review only
- IDE-only validation

**Chose Pre-Commit Because:**
- ✅ Catches errors earliest
- ✅ Fast feedback
- ✅ Can't bypass easily
- ✅ Runs automatically

### Why Custom ESLint Rules?

**Considered:**
- Generic ESLint rules only
- Manual code review
- Documentation only

**Chose Custom Rules Because:**
- ✅ Domain-specific errors
- ✅ Auto-fix capability
- ✅ IDE integration
- ✅ Scales with team

---

## 🔮 Future Enhancements

### Planned

1. **Auto-generate helpers from schema**
   - Parse Prisma schema
   - Generate CRUD helpers automatically

2. **Real-time schema validation in IDE**
   - VS Code extension
   - Inline schema documentation

3. **Query performance analyzer**
   - Detect N+1 queries
   - Suggest optimizations

4. **AI-powered code review**
   - Learn from past errors
   - Suggest better patterns

---

**This architecture enables:**
- ✅ Type safety at every layer
- ✅ Error prevention, not just detection
- ✅ Easy maintenance and updates
- ✅ Team scalability
- ✅ Zero schema errors in production
