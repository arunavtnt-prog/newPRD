# Contributing to WaveLaunch Studio

**Thank you for contributing!** This guide will help you contribute effectively.

---

## 📋 Quick Contribution Checklist

Before submitting a PR, ensure:

- [ ] Code uses helpers from `db-helpers.ts` (no manual Prisma queries)
- [ ] All tests pass: `npm run validate`
- [ ] Pre-commit hooks pass
- [ ] Documentation updated (if applicable)
- [ ] Code reviewed against `CODE_QUALITY_CHECKLIST.md`
- [ ] Tested locally in browser
- [ ] Tested for all relevant user roles
- [ ] PR description explains what/why/how

---

## 🚀 Getting Started

### 1. Fork & Clone

```bash
# Fork repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/wavelaunch-studio.git
cd wavelaunch-studio

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL/wavelaunch-studio.git
```

### 2. Set Up Development Environment

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your credentials

# Set up database
npm run db:generate
npm run db:migrate
npm run db:seed

# Start dev server
npm run dev
```

### 3. Create a Branch

```bash
# Update main
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes:
git checkout -b fix/bug-description
```

---

## 📝 Code Standards

### Use Type-Safe Helpers

❌ **Don't:**
```typescript
const projects = await prisma.project.findMany({
  where: { creatorEmail: email }  // Error-prone!
});
```

✅ **Do:**
```typescript
import { getProjectsForUser } from '@/lib/db-helpers';
const projects = await getProjectsForUser(userId, role);
```

### Follow TypeScript Best Practices

```typescript
// ✅ Always type function parameters and returns
export async function myFunction(
  userId: string,
  role: UserRole
): Promise<Project[]> {
  // ...
}

// ❌ Don't use 'any'
const data: any = await fetchData();  // Bad

// ✅ Use proper types
const data: Project[] = await getProjects();  // Good
```

### Code Style

```typescript
// Use consistent formatting (Prettier handles this)
// Run before commit:
npm run format

// Follow naming conventions:
// - camelCase for variables/functions
// - PascalCase for components/types
// - SCREAMING_SNAKE_CASE for constants

const userId = "123";              // ✅
const UserComponent = () => {...}; // ✅
const MAX_RETRIES = 3;             // ✅
```

---

## 🗄️ Working with Database

### Schema Changes

**Never modify schema directly in PRs unless discussed first!**

If you need schema changes:

1. **Discuss in issue first**
2. **Document the change**
3. **Update all related files:**
   ```
   prisma/schema.prisma         # The schema
   src/lib/validation/schema-validator.ts  # Field lists
   src/lib/db-helpers.ts        # Affected helpers
   docs/SCHEMA_CHANGES.md       # Migration notes
   ```

4. **Create migration:**
   ```bash
   npm run db:migrate
   ```

### Adding New Helpers

**When to add:**
- Query used in 2+ places
- Complex authorization logic
- Prone to errors (many fields/relations)

**Template:**
```typescript
/**
 * [Description of what this helper does]
 *
 * @param userId - User making the request
 * @param role - User's role for authorization
 * @param ...otherParams - Other parameters
 * @returns Description of return value
 *
 * @example
 * const data = await myHelper(userId, 'ADMIN', projectId);
 */
export async function myHelper(
  userId: string,
  role: UserRole,
  ...otherParams: any
): Promise<ReturnType> {
  // 1. Authorization check
  if (role === 'CREATOR') {
    // Creator-specific logic
  }

  // 2. Type-safe Prisma query
  return await prisma.model.findMany({
    where: {
      // Use correct field names from schema
    },
    include: {
      // Include needed relations
    },
  });
}
```

**Don't forget:**
- Add TypeDoc comments
- Include example usage
- Add to exports
- Update documentation

---

## 🧪 Testing

### Before Submitting PR

```bash
# 1. Run all validation
npm run validate

# 2. Test in browser
npm run dev
# - Load relevant pages
# - Test as ADMIN, TEAM_MEMBER, CREATOR roles
# - Check browser console for errors
# - Test error states

# 3. Check pre-commit hooks work
git add .
git commit -m "test commit"
# Should run checks and either pass or show errors
```

### Manual Testing Checklist

For UI changes:
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested on mobile viewport
- [ ] Tested dark mode (if applicable)
- [ ] Tested with slow network
- [ ] Screenshots added to PR

For API changes:
- [ ] Tested with valid data
- [ ] Tested with invalid data
- [ ] Tested authorization (different roles)
- [ ] Tested error responses
- [ ] API docs updated

For Database changes:
- [ ] Migration works on fresh database
- [ ] Migration works with existing data
- [ ] Rollback tested
- [ ] Performance acceptable

---

## 📤 Submitting a Pull Request

### PR Title Format

```
<type>: <description>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation only
- style: Formatting, no code change
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance tasks
```

**Examples:**
```
feat: add project export functionality
fix: resolve login redirect for CREATOR role
docs: update helper usage examples
```

### PR Description Template

```markdown
## What does this PR do?

Brief description of changes.

## Why are we making this change?

Link to issue or explain problem being solved.

## How was this tested?

- [ ] Tested locally
- [ ] Tested as ADMIN role
- [ ] Tested as CREATOR role
- [ ] Tested error states
- [ ] Screenshots attached (if UI change)

## Checklist

- [ ] Code uses helpers (no manual queries)
- [ ] `npm run validate` passes
- [ ] Pre-commit hooks pass
- [ ] Documentation updated
- [ ] Tested in browser
- [ ] Ready for review

## Screenshots (if applicable)

[Add screenshots here]

## Additional Notes

Any other context or considerations.
```

### PR Review Process

1. **Submit PR** - Include all checklist items
2. **Automated checks run** - Must pass
3. **Code review** - Senior dev reviews
4. **Address feedback** - Make requested changes
5. **Approval** - Once approved, will be merged
6. **Merge** - Squash and merge to main

### Responding to Review Feedback

```markdown
✅ Good responses:
- "Fixed in commit abc123"
- "Good catch! Updated to use helper instead."
- "I disagree because [reason]. What do you think?"

❌ Avoid:
- "Done" (be specific)
- Arguing without technical reasoning
- Ignoring feedback
```

---

## 🎨 UI/UX Contributions

### Component Guidelines

```typescript
// Use TypeScript for components
interface Props {
  userId: string;
  onUpdate: (data: Project) => void;
}

export function MyComponent({ userId, onUpdate }: Props) {
  // ...
}

// Use Tailwind CSS for styling
<div className="flex items-center gap-4 p-4 rounded-lg bg-gray-100">
  {/* content */}
</div>

// Follow existing patterns
// - Check similar components in codebase
// - Use design system components from /components/ui
// - Match existing spacing/colors
```

### Accessibility

Ensure components are accessible:

```tsx
// ✅ Good
<button
  aria-label="Close dialog"
  onClick={handleClose}
>
  <X className="h-4 w-4" />
</button>

<input
  type="text"
  id="email"
  aria-describedby="email-error"
  aria-invalid={!!error}
/>

// ❌ Bad
<div onClick={handleClick}>Click me</div>  // Should be button
<input type="text" />  // Missing label
```

---

## 📚 Documentation Contributions

### Updating Documentation

When you change code, update docs:

```
Code change → Update related docs

Examples:
- New helper → Add to db-helpers.ts docstrings
- Schema change → Update SCHEMA_CHANGES.md
- New feature → Update relevant guide
- Fix bug → Update troubleshooting if helpful
```

### Writing Good Documentation

```markdown
✅ Good documentation:
- Clear and concise
- Includes examples
- Explains why, not just what
- Updated when code changes

❌ Avoid:
- Vague descriptions
- Outdated information
- No examples
- Assuming reader knowledge
```

### Documentation Structure

```
docs/
├── ONBOARDING.md          # New developer guide
├── ARCHITECTURE.md        # Technical architecture
├── CONTRIBUTING.md        # This file
├── WHATS_NEXT.md          # Roadmap
├── SCHEMA_CHANGES.md      # Schema change log
└── TROUBLESHOOTING.md     # Common issues

Root level:
├── CODE_QUALITY_CHECKLIST.md   # Pre-commit review
├── ERROR_PREVENTION_GUIDE.md   # System overview
└── DEPLOYMENT.md               # Production deployment
```

---

## 🐛 Bug Reports

### Creating Good Bug Reports

Include:

1. **Description**: What's broken?
2. **Steps to reproduce**: How to trigger the bug?
3. **Expected behavior**: What should happen?
4. **Actual behavior**: What actually happens?
5. **Environment**: Browser, OS, etc.
6. **Screenshots**: If applicable
7. **Error messages**: Console errors, stack traces

**Template:**
```markdown
## Bug Description
Brief description of the issue.

## Steps to Reproduce
1. Go to [page]
2. Click [button]
3. See error

## Expected Behavior
Should do X.

## Actual Behavior
Does Y instead.

## Environment
- Browser: Chrome 120
- OS: macOS 14
- User role: CREATOR

## Screenshots
[Add screenshots]

## Console Errors
[Paste error messages]
```

---

## 💡 Feature Requests

### Proposing Features

1. **Check if it exists** - Search issues first
2. **Explain the problem** - What user need does this solve?
3. **Propose solution** - How would it work?
4. **Consider alternatives** - Other ways to solve it?
5. **Discuss first** - Get feedback before coding

**Template:**
```markdown
## Problem
Users can't [do something].

## Proposed Solution
Add a feature that [does this].

## Alternatives Considered
- Option A: [pros/cons]
- Option B: [pros/cons]

## Additional Context
[Any other info]
```

---

## 🎯 First Contribution Ideas

Good first issues:

- 🐛 **Fix documentation typos**
  - Easy
  - Learn docs structure

- ✨ **Add new email template**
  - Use existing patterns
  - Clear structure

- 🎨 **Improve error messages**
  - Better user experience
  - Learn codebase

- 📝 **Add code examples**
  - Help others learn
  - Reinforce your learning

Look for issues tagged:
- `good-first-issue`
- `beginner-friendly`
- `help-wanted`
- `documentation`

---

## 📜 Code of Conduct

### Be Kind and Professional

- ✅ Respectful communication
- ✅ Constructive feedback
- ✅ Welcoming to newcomers
- ✅ Focus on code, not people

### Unacceptable Behavior

- ❌ Personal attacks
- ❌ Harassment
- ❌ Discrimination
- ❌ Unprofessional conduct

**Violations will result in removal from project.**

---

## ❓ Questions?

### Getting Help

1. **Check docs** - Start here
2. **Search issues** - Someone may have asked before
3. **Ask in discussions** - GitHub Discussions
4. **Ask team chat** - For contributors

### Contact

- **Issues**: https://github.com/[repo]/issues
- **Discussions**: https://github.com/[repo]/discussions
- **Email**: dev@wavelaunchstudio.com

---

## 🙏 Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!

**Happy coding!** 🚀
