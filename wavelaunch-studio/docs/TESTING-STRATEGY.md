# Testing Strategy for WaveLaunch Studio

## Overview

Comprehensive testing strategy covering unit tests, integration tests, E2E tests, performance tests, and manual testing procedures.

---

## Testing Pyramid

```
           /\
          /  \  E2E Tests (10%)
         /    \  - Critical user flows
        /______\  - Cross-browser testing
       /        \
      /          \ Integration Tests (30%)
     /            \ - Feature testing
    /              \ - API endpoint testing
   /________________\
  /                  \
 /  Unit Tests (60%)  \ - Components
/____________________\ - Utilities
                       - Hooks
                       - Libraries
```

---

## Test Levels

### 1. Unit Tests (60% coverage target)

**Scope**: Individual components, functions, hooks, utilities

**Tools**:
- Jest + React Testing Library
- Vitest (faster alternative)

**Coverage Areas**:
- ✅ Utility functions (validation, formatting, etc.)
- ✅ Custom hooks (useMobile, usePWA, useNotifications)
- ✅ Pure components (Cards, Buttons, Forms)
- ✅ Business logic functions
- ✅ Data transformers

**Example**:
```typescript
// validation.test.ts
describe('email validation', () => {
  it('validates correct email', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
  });

  it('rejects invalid email', () => {
    expect(isValidEmail('invalid')).toBe(false);
  });
});
```

### 2. Integration Tests (30% coverage target)

**Scope**: Feature modules, API routes, database queries

**Tools**:
- Jest + MSW (Mock Service Worker)
- Supertest for API testing
- Prisma test helpers

**Coverage Areas**:
- ✅ API route handlers
- ✅ Database operations
- ✅ Authentication flows
- ✅ Form submissions
- ✅ Data fetching hooks

**Example**:
```typescript
// projects.api.test.ts
describe('Projects API', () => {
  it('fetches projects list', async () => {
    const response = await fetch('/api/projects');
    const data = await response.json();
    expect(data.projects).toBeInstanceOf(Array);
  });
});
```

### 3. End-to-End Tests (10% coverage target)

**Scope**: Critical user flows, cross-browser testing

**Tools**:
- Playwright (recommended)
- Cypress (alternative)

**Coverage Areas**:
- ✅ User authentication (login, logout, signup)
- ✅ Project creation flow
- ✅ Approval request and review flow
- ✅ File upload and management
- ✅ Dashboard navigation
- ✅ Mobile responsive flows

**Example**:
```typescript
// project-creation.spec.ts
test('create new project', async ({ page }) => {
  await page.goto('/dashboard/projects');
  await page.click('text=Create Project');
  await page.fill('[name="projectName"]', 'Test Project');
  await page.click('text=Create');
  await expect(page).toHaveURL(/\/dashboard\/projects\/\w+/);
});
```

### 4. Performance Tests

**Scope**: Page load times, bundle size, Core Web Vitals

**Tools**:
- Lighthouse CI
- WebPageTest
- Bundle analyzer

**Coverage Areas**:
- ✅ Lighthouse scores (90+ target)
- ✅ Core Web Vitals (LCP, FID, CLS)
- ✅ Bundle size (< 200KB gzipped)
- ✅ API response times
- ✅ Database query performance

### 5. Accessibility Tests

**Scope**: WCAG 2.1 AA compliance

**Tools**:
- axe-core + jest-axe
- Lighthouse accessibility audit
- WAVE browser extension

**Coverage Areas**:
- ✅ Keyboard navigation
- ✅ Screen reader compatibility
- ✅ Color contrast (4.5:1 minimum)
- ✅ Touch target size (48px minimum)
- ✅ Form labels and errors
- ✅ ARIA attributes

### 6. Mobile & Responsive Tests

**Scope**: Mobile devices, tablets, different screen sizes

**Tools**:
- Playwright device emulation
- BrowserStack (optional)

**Coverage Areas**:
- ✅ Mobile navigation
- ✅ Touch interactions
- ✅ Responsive layouts (320px - 3840px)
- ✅ Orientation changes
- ✅ Mobile forms

### 7. PWA Tests

**Scope**: Service worker, offline functionality, installability

**Tools**:
- Playwright + service worker testing
- Lighthouse PWA audit

**Coverage Areas**:
- ✅ Service worker registration
- ✅ Offline fallback page
- ✅ Cache strategies
- ✅ Install prompt
- ✅ Manifest validation

---

## Test Infrastructure

### Required Dependencies

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.1.0",
    "@testing-library/user-event": "^14.5.0",
    "@playwright/test": "^1.40.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "msw": "^2.0.0",
    "vitest": "^1.0.0",
    "@vitejs/plugin-react": "^4.2.0"
  }
}
```

### Installation

```bash
# Install testing dependencies
npm install -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install -D @playwright/test
npm install -D vitest @vitejs/plugin-react
npm install -D msw

# Install Playwright browsers
npx playwright install
```

### Configuration Files

1. **jest.config.js** - Jest configuration
2. **vitest.config.ts** - Vitest configuration (faster)
3. **playwright.config.ts** - E2E test configuration
4. **.lighthouserc.js** - Lighthouse CI configuration

---

## Test Execution

### Local Testing

```bash
# Unit tests
npm test                    # Run all unit tests
npm test -- --watch        # Watch mode
npm test -- --coverage     # With coverage report

# E2E tests
npm run test:e2e           # Run E2E tests
npm run test:e2e:ui        # E2E with UI
npm run test:e2e:debug     # Debug mode

# Performance tests
npm run test:lighthouse    # Lighthouse audit
npm run test:bundle        # Bundle size analysis
```

### CI/CD Pipeline

```bash
# Run in CI
npm run test:ci            # All tests without watch
npm run build              # Ensure build succeeds
npm run test:e2e:ci        # E2E in headless mode
```

---

## Testing Checklist

### Pre-Deployment Checklist

#### Unit Tests
- [ ] All utility functions tested
- [ ] All custom hooks tested
- [ ] All form validations tested
- [ ] All data transformers tested
- [ ] 60%+ code coverage achieved

#### Integration Tests
- [ ] API routes return correct responses
- [ ] Database queries work correctly
- [ ] Authentication flows work
- [ ] File upload works
- [ ] Email sending works (mocked)

#### E2E Tests
- [ ] User can sign up and login
- [ ] User can create project
- [ ] User can request approval
- [ ] User can review approval
- [ ] User can upload files
- [ ] User can navigate dashboard
- [ ] Mobile flows work correctly

#### Performance Tests
- [ ] Lighthouse score 90+ (all categories)
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Bundle size < 200KB gzipped
- [ ] No console errors in production

#### Accessibility Tests
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast 4.5:1+
- [ ] Touch targets 48px+
- [ ] All forms have labels
- [ ] No accessibility violations (axe)

#### Mobile Tests
- [ ] Works on iOS Safari
- [ ] Works on Android Chrome
- [ ] Touch interactions work
- [ ] Responsive layouts work
- [ ] Mobile forms work
- [ ] Swipe gestures work

#### PWA Tests
- [ ] Service worker registers
- [ ] Offline page works
- [ ] Install prompt appears
- [ ] App runs offline (cached content)
- [ ] Manifest is valid
- [ ] Icons are correct sizes

#### Security Tests
- [ ] Authentication required for protected routes
- [ ] CSRF protection enabled
- [ ] XSS vulnerabilities addressed
- [ ] SQL injection prevented (Prisma)
- [ ] Sensitive data not exposed
- [ ] API rate limiting works

#### Browser Compatibility
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS 15+)
- [ ] Mobile Chrome (Android 12+)

---

## Manual Testing Procedures

### Critical User Flows

#### 1. User Registration & Login
```
1. Navigate to /auth/v2/signup
2. Fill in registration form
3. Submit and verify redirect to dashboard
4. Logout
5. Login with credentials
6. Verify dashboard access
```

#### 2. Project Creation
```
1. Navigate to /dashboard/projects
2. Click "Create Project"
3. Fill in project details
4. Select lead strategist
5. Submit form
6. Verify project appears in list
7. Click project to view details
```

#### 3. Approval Workflow
```
1. Navigate to project details
2. Go to Approvals tab
3. Click "Request Approval"
4. Select reviewers
5. Add message and due date
6. Submit request
7. Login as reviewer
8. Review and approve/reject
9. Verify notification sent
```

#### 4. File Upload
```
1. Navigate to project details
2. Go to Files tab
3. Click "Upload File"
4. Select file from computer
5. Add description
6. Upload and verify file appears
7. Click to download
8. Verify download works
```

#### 5. Search Functionality
```
1. Click search in header (or Cmd+K)
2. Type search query
3. Verify results appear
4. Click on result
5. Verify navigation to correct page
6. Test filters
7. Verify filtered results
```

---

## Test Data Management

### Test Database Setup

```bash
# Create test database
npm run db:test:setup

# Seed test data
npm run db:test:seed

# Reset test database
npm run db:test:reset
```

### Test User Accounts

```typescript
// test-users.ts
export const TEST_USERS = {
  admin: {
    email: 'admin@test.com',
    password: 'Test123!@#',
    role: 'ADMIN',
  },
  teamMember: {
    email: 'team@test.com',
    password: 'Test123!@#',
    role: 'TEAM_MEMBER',
  },
  client: {
    email: 'client@test.com',
    password: 'Test123!@#',
    role: 'CLIENT',
  },
};
```

---

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - run: npm run test:ci
      - run: npm run test:e2e:ci
      - run: npm run test:lighthouse
```

---

## Coverage Requirements

### Minimum Coverage Targets

- **Overall**: 70%
- **Critical paths**: 90%
- **Utilities**: 80%
- **Components**: 60%
- **API routes**: 80%

### Coverage Reports

```bash
# Generate coverage report
npm test -- --coverage

# View coverage in browser
npm run test:coverage:open
```

---

## Debugging Tests

### Debug Unit Tests

```bash
# Debug specific test
npm test -- --testNamePattern="project creation"

# Debug with Node inspector
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Debug E2E Tests

```bash
# Run with UI
npm run test:e2e:ui

# Debug mode with browser
npm run test:e2e:debug

# Headed mode (see browser)
npm run test:e2e -- --headed
```

---

## Test Maintenance

### Regular Tasks

- [ ] Update test dependencies monthly
- [ ] Review and update test data
- [ ] Remove obsolete tests
- [ ] Add tests for new features
- [ ] Fix flaky tests
- [ ] Update snapshots when UI changes
- [ ] Review coverage reports

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## Next Steps

1. ✅ Set up testing infrastructure
2. ✅ Write unit tests for utilities
3. ✅ Write integration tests for APIs
4. ✅ Write E2E tests for critical flows
5. ✅ Run all tests and verify passing
6. ✅ Fix any failing tests
7. ✅ Review coverage reports
8. ✅ Manual testing on local machine
9. ✅ Deploy to staging
10. ✅ Deploy to production
