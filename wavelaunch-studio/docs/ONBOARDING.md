# Developer Onboarding Guide - WaveLaunch Studio

**Welcome to the team!** This guide will get you up to speed with our error prevention system and development workflow.

---

## 📋 Onboarding Checklist

Complete these steps in order:

- [ ] **Day 1: Environment Setup**
  - [ ] Clone repository
  - [ ] Install dependencies
  - [ ] Set up environment variables
  - [ ] Run database migrations
  - [ ] Start dev server

- [ ] **Day 1: Read Documentation**
  - [ ] This onboarding guide (ONBOARDING.md)
  - [ ] Code quality checklist (CODE_QUALITY_CHECKLIST.md)
  - [ ] Error prevention guide (ERROR_PREVENTION_GUIDE.md)
  - [ ] Architecture overview (ARCHITECTURE.md)

- [ ] **Day 2: Learn the Schema**
  - [ ] Review `prisma/schema.prisma`
  - [ ] Understand User roles (ADMIN, TEAM_MEMBER, CREATOR)
  - [ ] Understand Project structure
  - [ ] Review relationship patterns

- [ ] **Day 2: Learn the Helpers**
  - [ ] Read `src/lib/db-helpers.ts`
  - [ ] Try using helpers in a test file
  - [ ] Understand when to create new helpers

- [ ] **Day 3: First Task**
  - [ ] Pick a "good first issue"
  - [ ] Write code using helpers
  - [ ] Run `npm run validate`
  - [ ] Submit PR for review

- [ ] **Week 1: Shadow Senior Dev**
  - [ ] Pair program on a feature
  - [ ] Review PRs together
  - [ ] Ask questions about patterns

---

## 🚀 Day 1: Environment Setup

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or remote)
- Git configured
- Code editor (VS Code recommended)

### Step 1: Clone and Install

```bash
# Clone repository
git clone <repository-url>
cd wavelaunch-studio

# Install dependencies
npm install

# This will install:
# - Next.js and React
# - Prisma (database ORM)
# - ESLint and Prettier
# - Pre-commit hooks (Husky)
# - All validation tools
```

### Step 2: Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
nano .env  # or use your editor

# Required variables:
DATABASE_URL="postgresql://..."  # Your database
NEXTAUTH_SECRET="..."            # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# Email service (choose one):
RESEND_API_KEY="..."             # Recommended
# OR
SENDGRID_API_KEY="..."
# OR SMTP settings

# File uploads:
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

### Step 3: Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database with test data
npm run db:seed

# Verify database
npm run db:studio  # Opens Prisma Studio UI
```

### Step 4: Start Development Server

```bash
# Start Next.js dev server
npm run dev

# Server starts at: http://localhost:3000

# Test credentials (from seed data):
# Admin: admin@wavelaunch.com / password123456
# Creator: creator@wavelaunch.com / password123456
```

### Step 5: Verify Setup

```bash
# Run all validation checks
npm run validate

# Should output:
# ✅ TypeScript type check passed
# ✅ ESLint passed
# ✅ Prettier format check passed

# If errors: Fix them before proceeding
```

---

## 📚 Day 1: Essential Reading

### Read These Files (30-45 minutes total)

**1. CODE_QUALITY_CHECKLIST.md** (~10 min)
- What to check before every commit
- Common errors and how to avoid them
- Testing requirements

**2. ERROR_PREVENTION_GUIDE.md** (~15 min)
- How the 6-layer system works
- Why each layer exists
- Troubleshooting guide

**3. ARCHITECTURE.md** (~20 min)
- System architecture
- How components interact
- Technology stack

### Key Concepts to Understand

**1. The Schema is Source of Truth**
```bash
# Everything starts with the schema
cat prisma/schema.prisma

# If a field doesn't exist in the schema,
# you can't query it!
```

**2. Use Helpers, Don't Write Queries**
```typescript
// ❌ Don't do this:
const projects = await prisma.project.findMany({...});

// ✅ Do this:
import { getProjectsForUser } from '@/lib/db-helpers';
const projects = await getProjectsForUser(userId, role);
```

**3. Pre-Commit Hooks Protect You**
```bash
# Hooks run automatically on commit
# They will block bad code

# Can't bypass with --no-verify
# (technically can, but DON'T!)
```

---

## 🗄️ Day 2: Learning the Schema

### Interactive Schema Exploration

```bash
# 1. Open the schema
cat prisma/schema.prisma

# 2. Find the User model
cat prisma/schema.prisma | grep -A 30 "model User"

# 3. See all models
grep "^model " prisma/schema.prisma
```

### Key Models to Know

**User Model**
```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  fullName     String
  role         UserRole @default(TEAM_MEMBER)
  companyName  String?  // For CREATOR users

  // Important: Only 3 roles exist!
  // ADMIN, TEAM_MEMBER, CREATOR
  // (NOT "CLIENT"!)
}
```

**Project Model**
```prisma
model Project {
  id          String  @id @default(cuid())
  projectName String
  creatorName String  // Note: NOT creatorEmail!

  // Projects link to users via ProjectUser
  team ProjectUser[]
}
```

**Activity Model**
```prisma
model Activity {
  id                String  @id
  actionType        String  // Note: actionType (not action!)
  actionDescription String  // Note: actionDescription (not description!)
}
```

### Schema Quiz (Test Your Understanding)

**Question 1:** What field do you use to query projects by user email?
<details>
<summary>Answer</summary>

You DON'T use a direct field. Projects link to users via the `team` relationship:

```typescript
where: {
  team: {
    some: {
      user: {
        email: email
      }
    }
  }
}
```

Or better yet, use the helper:
```typescript
getProjectsForUser(userId, role)
```
</details>

**Question 2:** What are the valid user roles?
<details>
<summary>Answer</summary>

Only 3 roles exist:
- `ADMIN`
- `TEAM_MEMBER`
- `CREATOR` (NOT "CLIENT"!)
</details>

**Question 3:** How do you log an activity?
<details>
<summary>Answer</summary>

Use the helper with correct field names:
```typescript
import { createActivity } from '@/lib/db-helpers';

await createActivity({
  projectId,
  userId,
  actionType: 'FILE_UPLOADED',  // Not 'action'!
  actionDescription: 'Uploaded design.pdf',  // Not 'description'!
});
```
</details>

---

## 🛠️ Day 2: Learning the Helpers

### Helper Functions Overview

**Location:** `src/lib/db-helpers.ts`

**Why Helpers Exist:**
- Prevent schema errors
- Encapsulate common queries
- Handle authorization automatically
- Type-safe (TypeScript helps you)

### Available Helpers

```typescript
// Get user's projects (handles role-based access)
getProjectsForUser(userId: string, role: UserRole)

// Get single project with auth check
getProjectById(projectId: string, userId: string, role: UserRole)

// Get activity feed
getRecentActivity(userId: string, role: UserRole, limit?: number)

// Get dashboard statistics
getDashboardStats(userId: string, role: UserRole)

// Create activity log (correct field names guaranteed)
createActivity(data: {...})

// Role-based routing
getRedirectPathForRole(role: UserRole)  // Where to redirect after login
getLoginPathForRole(role: UserRole)     // Which login page to use
```

### Hands-On Exercise

Create a test file to practice:

```typescript
// src/test/learn-helpers.ts

import { getProjectsForUser, getDashboardStats } from '@/lib/db-helpers';

async function learnHelpers() {
  // Example: Get projects for admin
  const adminProjects = await getProjectsForUser('user-id', 'ADMIN');
  console.log('Admin can see all projects:', adminProjects.length);

  // Example: Get dashboard stats
  const stats = await getDashboardStats('user-id', 'CREATOR');
  console.log('Dashboard stats:', stats);

  // Notice: You didn't write any Prisma queries!
  // Helpers did all the work correctly.
}
```

### When to Create a New Helper

Create a helper when:
- ✅ Query is used in 2+ places
- ✅ Query has complex authorization logic
- ✅ Query is prone to errors (many fields/relations)

Don't create a helper for:
- ❌ One-off queries specific to one page
- ❌ Simple, obvious queries (find by ID only)

---

## 🎯 Day 3: Your First Task

### Finding a Good First Issue

Look for issues tagged:
- `good-first-issue`
- `beginner-friendly`
- `help-wanted`

**Recommended first tasks:**
- Add a new email template
- Fix a small UI bug
- Add a new dashboard stat
- Improve error messages

### Workflow for Your Task

**1. Create a Branch**
```bash
git checkout -b feature/your-feature-name
```

**2. Before Writing Code**
```bash
# Review what schema fields you'll need
cat prisma/schema.prisma | grep -A 20 "model YourModel"

# Check if helpers exist
cat src/lib/db-helpers.ts | grep -i "your use case"
```

**3. Write Code**
```typescript
// Always import helpers
import { getProjectsForUser } from '@/lib/db-helpers';

// Use TypeScript types
import { UserRole } from '@prisma/client';

// Use helpers instead of manual queries
const projects = await getProjectsForUser(userId, role);
```

**4. Test Locally**
```bash
# Start dev server
npm run dev

# Test in browser:
# - Load your page
# - Test as different roles (ADMIN, CREATOR, TEAM_MEMBER)
# - Check browser console for errors
# - Test error states
```

**5. Validate Before Commit**
```bash
# Run all checks (REQUIRED)
npm run validate

# Fix any errors that appear
# Don't commit until this passes!
```

**6. Commit**
```bash
# Stage changes
git add .

# Commit (pre-commit hooks run automatically)
git commit -m "feat: add your feature

- What you changed
- Why you changed it
- How to test it
"

# If blocked: Read error message and fix
# If passes: Great! Push and create PR
```

**7. Create Pull Request**
- Use PR template
- Link to issue number
- Describe what you did
- Add screenshots (if UI change)
- Request review from senior dev

---

## 👥 Week 1: Working with the Team

### Pair Programming Session

Schedule time with a senior developer to:
- Walk through a real feature together
- See their workflow in action
- Ask questions about patterns
- Understand code review expectations

### Code Review Best Practices

**When Your PR is Reviewed:**
- Read comments carefully
- Ask questions if unclear
- Make requested changes
- Don't take feedback personally (it's about the code, not you!)

**When You Review Others:**
- Be kind and constructive
- Explain WHY, not just WHAT to change
- Praise good patterns
- Use the checklist (CODE_QUALITY_CHECKLIST.md)

### Common Questions from New Devs

**Q: "Can I use `any` type in TypeScript?"**
A: Avoid it! Use proper types. If you must, add a comment explaining why.

**Q: "The pre-commit hook is slow. Can I skip it?"**
A: No. It saves more time than it costs by catching errors early.

**Q: "I found a better way to write a query. Should I use it?"**
A: Maybe! If it's truly better, update the helper and share with team.

**Q: "I'm stuck. Who do I ask?"**
A: In order:
1. Check documentation
2. Search existing code for similar patterns
3. Ask in team chat
4. Schedule time with mentor

---

## 🎓 Learning Resources

### Internal Resources

- **Prisma Docs**: https://www.prisma.io/docs/
- **Next.js Docs**: https://nextjs.org/docs
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/handbook/

### Codebase Tours

**Tour 1: Authentication Flow**
```
src/lib/auth.ts           # Auth configuration
src/app/api/auth/*        # Auth API routes
src/app/(main)/auth/*     # Auth pages
```

**Tour 2: Database Queries**
```
prisma/schema.prisma      # Schema definition
src/lib/db.ts             # Prisma client
src/lib/db-helpers.ts     # Type-safe helpers
```

**Tour 3: Error Prevention**
```
.husky/pre-commit         # Pre-commit validation
eslint-custom-rules.mjs   # Custom linting
src/lib/validation/*      # Validators
```

---

## ✅ Onboarding Complete!

You've completed onboarding when you can:

- ✅ Start dev server without errors
- ✅ Explain the 6 error prevention layers
- ✅ Find fields in the Prisma schema
- ✅ Use helpers instead of manual queries
- ✅ Run `npm run validate` before commits
- ✅ Create a PR that passes code review
- ✅ Help answer another new dev's questions

**Welcome to the team!** 🎉

---

## 📞 Getting Help

**Stuck?** Try this order:
1. Check docs in `/docs` folder
2. Search codebase for similar patterns
3. Ask in team chat
4. Schedule 1:1 with mentor

**Found a bug in docs?**
- Create PR to fix it
- Documentation is code too!

---

**Next Steps:**
- Read [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- Review [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines
- Check [WHATS_NEXT.md](WHATS_NEXT.md) for roadmap
