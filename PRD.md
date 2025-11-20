# Wavelaunch Studio Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** November 20, 2025  
**Status:** Draft  
**Author:** PM Agent

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-11-20 | 1.0 | Initial PRD creation | PM Agent |

---

## Goals and Background Context

### Goals

- Reduce creator brand launch timeline from 24+ weeks to 16-20 weeks through systematic automation
- Enable Wavelaunch to scale from 2-3 to 10-20 concurrent creator brand projects without proportional staff increases
- Automate 40-60% of repetitive creative and operational tasks through intelligent asset generation
- Provide a unified platform for all project communication, task management, approvals, and file handling
- Deliver a premium, agency-grade experience to creators through simplified client portal
- Create an operational command center for internal teams with industrial-strength project management
- Maintain consistent high-quality brand output across all projects through standardized workflows
- Build a robust asset generation pipeline capable of producing coordinated brand systems (logos, palettes, copy, packaging, social templates, landing pages)

### Background Context

Wavelaunch Studio builds brands for influencers across fashion, beauty, fitness, and lifestyle categories. The current manual process is time-intensive, communication-fragmented, and difficult to scale. Projects span 20-24 weeks with heavy manual creative work, scattered communication channels, and approval bottlenecks.

This platform addresses these challenges by consolidating all brand development activities into a dual-portal system: an Admin Portal for internal teams and a Client Portal for creators. The centerpiece is an Automated Asset Generation Engine that produces complete brand systems from questionnaires and references, dramatically reducing manual creative time while maintaining quality. The system is designed to support a structured 8-month lifecycle (M0-M8) covering discovery, branding, product development, manufacturing, website build, marketing, and launch phases.

---

## Requirements

### Functional Requirements

**FR1**: System shall provide role-based access control with distinct Admin and Client portal experiences  
**FR2**: Admin Portal shall support unlimited internal team members with project-based permissions  
**FR3**: Client Portal shall provide creator-specific project views with read-only access to most content  
**FR4**: System shall implement a structured 8-phase project lifecycle (M0-M8) with defined milestones and deliverables  
**FR5**: System shall track project status across phases: Onboarding, Discovery, Branding, Product Dev, Manufacturing, Website, Marketing, Launch  
**FR6**: Asset Generation Engine shall produce brand assets from 28-question creator questionnaire  
**FR7**: Asset Generation Engine shall generate 3-6 logo concept variations using nanobanana integration  
**FR8**: Asset Generation Engine shall create coordinated color palettes (primary, secondary, neutrals) with hex codes  
**FR9**: Asset Generation Engine shall recommend typography systems appropriate to brand vibe  
**FR10**: Asset Generation Engine shall generate tagline options (5-10 variations) using AI-assisted copywriting  
**FR11**: Asset Generation Engine shall produce social media templates optimized for Instagram/TikTok  
**FR12**: Asset Generation Engine shall create ad copy variants (3-5 per format) for paid campaigns  
**FR13**: Asset Generation Engine shall generate packaging rough concepts with layout rules  
**FR14**: Asset Generation Engine shall produce website hero image concepts aligned with brand direction  
**FR15**: Asset Generation Engine shall compile generated assets into downloadable brand book PDF  
**FR16**: System shall implement approval workflows with approve/request-changes actions  
**FR17**: Approval workflows shall support version history with timestamped feedback  
**FR18**: System shall provide file upload capabilities with version control and access permissions  
**FR19**: File management shall support common formats: PDF, JPG, PNG, MP4, MOV, AI, PSD, DOCX  
**FR20**: System shall implement project-based commenting with @mentions and notifications  
**FR21**: Admin Portal dashboard shall display active project count, pending approvals count, and manufacturing alerts  
**FR22**: Admin Portal shall provide "This Week at Wavelaunch" hero card with key updates  
**FR23**: Admin Portal shall include quick action buttons: Start Discovery, Upload Files, Generate Brand Assets  
**FR24**: Admin Portal shall display right-side project list with filterable status  
**FR25**: Admin Portal shall provide approvals queue with priority sorting  
**FR26**: Project workspace shall include sidebar tabs: Overview, Discovery, Branding, Product Dev, Manufacturing, Website, Marketing, Launch, Files, Finance  
**FR27**: Project workspace shall display kanban-style stage progress indicator  
**FR28**: Each project phase shall maintain a checklist of required deliverables  
**FR29**: Brand Discovery module shall capture reference uploads with tagging capability  
**FR30**: Brand Discovery module shall provide audience builder with demographic/psychographic fields  
**FR31**: Brand Discovery module shall include naming generator with availability checking suggestions  
**FR32**: Brand Discovery module shall support tone-of-voice direction selection (playful, sophisticated, bold, minimal, etc.)  
**FR33**: Brand Design module shall display logo concepts with side-by-side comparison  
**FR34**: Brand Design module shall provide color palette generator with accessibility checking  
**FR35**: Brand Design module shall auto-generate brand book with all approved assets  
**FR36**: Product Development module shall track SKUs with descriptions, pricing, and costing  
**FR37**: Product Development module shall monitor prototype status and sample tracking  
**FR38**: Manufacturing module shall maintain vendor list with contact details and capabilities  
**FR39**: Manufacturing module shall support PO creation with line-item breakdown  
**FR40**: Manufacturing module shall track production status with timeline visualization  
**FR41**: Manufacturing module shall enable QC photo uploads with approval workflow  
**FR42**: Manufacturing module shall provide shipment tracking with carrier integration readiness  
**FR43**: Website Build module shall provide theme setup configuration  
**FR44**: Website Build module shall include homepage block builder with drag-drop readiness  
**FR45**: Website Build module shall integrate copywriting assistant for page content  
**FR46**: Website Build module shall manage asset library with search and filter  
**FR47**: Website Build module shall support SEO metadata fields per page  
**FR48**: Marketing module shall provide content calendar with scheduling  
**FR49**: Marketing module shall include script generation for video content  
**FR50**: Marketing module shall coordinate UGC tracking with creator names and status  
**FR51**: Marketing module shall provide email flow builder with template selection  
**FR52**: Marketing module shall display launch timeline with countdown  
**FR53**: Finance module shall track onboarding fee payments with status  
**FR54**: Finance module shall calculate revenue share with configurable split percentages  
**FR55**: Finance module shall generate invoices with PDF export  
**FR56**: Finance module shall track expenses per project with categorization  
**FR57**: Client Portal welcome dashboard shall display active project stage (M0-M8)  
**FR58**: Client Portal shall list pending tasks/approvals with due dates  
**FR59**: Client Portal shall provide timeline view showing completed and upcoming milestones  
**FR60**: Client Portal shall include chat interface for creator-team communication  
**FR61**: Client Portal approvals page shall display pending items with visual previews  
**FR62**: Client Portal approvals shall support one-click approve or request-changes actions  
**FR63**: Client Portal brand assets library shall organize logos, colors, typography, and documents  
**FR64**: Client Portal upload zone shall support drag-drop for references, videos, photos, and notes  
**FR65**: Client Portal launch dashboard shall display basic sales and traffic metrics (Phase 2 integration)  
**FR66**: System shall send email notifications for approval requests, status changes, and mentions  
**FR67**: Admin Portal shall provide global search across projects, files, and conversations  
**FR68**: System shall maintain activity feed showing recent actions across all projects  
**FR69**: Project analytics shall track time-to-launch per phase with historical comparison  
**FR70**: Project analytics shall monitor approval turnaround time with trend analysis  
**FR71**: System shall log all asset generation attempts with success/failure status  
**FR72**: Platform shall support dark mode as default with light mode toggle

### Non-Functional Requirements

**NFR1**: System shall support 10-20 concurrent projects with 5-10 active users per project without performance degradation  
**NFR2**: Page load times shall not exceed 2 seconds for dashboard and project views under normal load  
**NFR3**: Asset generation requests shall complete within 60 seconds for standard brand package (logos, palette, taglines)  
**NFR4**: Asset generation engine shall achieve 80%+ creator approval rate on first submission  
**NFR5**: File uploads shall support files up to 500MB with progress indication  
**NFR6**: System shall maintain 99.5% uptime during business hours (9am-6pm EST, Mon-Fri)  
**NFR7**: Database shall implement automatic daily backups with 30-day retention  
**NFR8**: All user passwords shall be hashed using bcrypt with minimum 12-character requirement  
**NFR9**: File storage shall encrypt data at rest using AES-256  
**NFR10**: API endpoints shall implement rate limiting (100 requests/minute per user)  
**NFR11**: System shall be responsive across desktop (1920x1080), laptop (1440x900), and tablet (1024x768)  
**NFR12**: UI shall meet WCAG 2.1 Level AA accessibility standards  
**NFR13**: System shall support modern browsers: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+  
**NFR14**: Platform shall implement comprehensive error logging with stack traces  
**NFR15**: All user-facing errors shall display friendly messages without exposing system details  
**NFR16**: System shall gracefully handle nanobanana API failures with retry logic (3 attempts)  
**NFR17**: Database queries shall be optimized to execute in under 500ms for 95th percentile  
**NFR18**: Asset generation shall implement job queuing with Redis for concurrent request handling  
**NFR19**: System shall support horizontal scaling for web tier without code changes  
**NFR20**: Codebase shall maintain 70%+ test coverage for critical business logic

---

## User Interface Design Goals

### Overall UX Vision

**Industrial Mono (Warm) Theme**: The interface balances operational efficiency with premium creator experience. Admin Portal emphasizes density and speed—left-heavy layout with fixed sidebar navigation, search + notifications in header, hero card for weekly priorities, metrics row, and high-density project/approval lists on right. Client Portal prioritizes simplicity and calm—welcoming dashboard with clear stage indicators, minimal navigation, visual previews for approvals, and straightforward upload zones. The design language uses stone whites (#FAFAF9), greige surfaces (#E7E5E4), warm shadows, sharp black text (#0A0A0A), creating an Uber-like functional feel with soft, approachable touches for creators.

### Key Interaction Paradigms

- **Left Sidebar Navigation**: Fixed-width sidebar (280px) with collapsible sections for Admin Portal
- **Hero Card System**: Top-left quadrant features priority card ("This Week at Wavelaunch") with key updates
- **Metrics Row**: Horizontal KPI strip below hero card showing active projects, pending approvals, alerts
- **Split Workspace**: Right side dedicated to high-density lists (projects, approvals, recent activity)
- **Tab-Based Project Views**: Horizontal tab navigation within project workspace (Overview, Discovery, Branding, etc.)
- **Kanban Progress**: Visual stage indicators showing project progression through 8-month lifecycle
- **One-Click Approvals**: Approve/Request Changes buttons with inline feedback forms
- **Drag-Drop Uploads**: File zones with visual feedback and progress bars
- **Real-Time Notifications**: Toast notifications for mentions, approvals, and status changes
- **Contextual Actions**: Right-click menus and hover states for quick operations

### Core Screens and Views

**Admin Portal:**
- Dashboard (Hero card + Metrics + Project list + Approvals queue)
- Project Workspace (Tab-based with sidebar: Overview, Discovery, Branding, Product Dev, Manufacturing, Website, Marketing, Launch, Files, Finance)
- Brand Discovery Workspace (Reference upload + Market insights + Audience builder + Naming generator + Strategy doc)
- Brand Design Workspace (Logo concepts + Color palette + Typography + Packaging + Brand book generator)
- Product Development Workspace (SKU planner + Prototype tracker + Sample status + Costings + Descriptions)
- Manufacturing Workspace (Vendor list + PO creation + Production tracking + QC photos + Shipment tracking)
- Website Build Workspace (Theme setup + Homepage builder + Copywriting assistant + Asset library + SEO)
- Marketing Workspace (Content calendar + Script generator + Ad variants + UGC coordination + Email flows + Launch timeline)
- Finance View (Invoices + Onboarding fees + Revenue share + Payouts + Expense tracking)
- Asset Generation Interface (Questionnaire + Moodboard upload + Generate button + Preview + Download pack)
- Global Search Results
- Notification Center
- User Profile & Settings

**Client Portal:**
- Welcome Dashboard (Greeting + Active stage M0-M8 + Pending tasks + Timeline + Chat)
- Approvals Page (Pending items with visual previews + Approve/Request Changes + Version history)
- Brand Assets Library (Logo variations + Color palette + Typography + Brand book download + Attachments)
- Upload Zone (References + Videos + Photos + Notes with drag-drop)
- Launch Dashboard (Sales + Traffic + Inventory + First month performance - Phase 2)
- Chat with Team
- Profile & Settings

### Accessibility: WCAG 2.1 Level AA

- All interactive elements must have keyboard navigation support
- Color contrast ratios must meet minimum 4.5:1 for text, 3:1 for UI components
- All images and icons must include alt text or aria-labels
- Form inputs must have associated labels and error states
- Focus indicators must be visible and distinguishable
- Skip navigation links for screen readers
- ARIA landmarks for major page sections
- Semantic HTML5 structure throughout

### Branding

**Color System:**
- Background: Stone White (#FAFAF9)
- Surface: Greige (#E7E5E4)
- Surface Elevated: Light Greige (#D6D3D1)
- Text Primary: Near Black (#0A0A0A)
- Text Secondary: Warm Gray (#78716C)
- Accent Primary: Warm Orange (#EA580C) - for CTAs and key actions
- Accent Secondary: Deep Teal (#0F766E) - for secondary actions
- Success: Soft Green (#16A34A)
- Warning: Warm Amber (#D97706)
- Error: Rich Red (#DC2626)
- Borders: Light Border (#E7E5E4)

**Typography:**
- Primary Font: Inter (UI elements, body text, forms)
- Heading Font: Inter SemiBold/Bold (headings, labels, buttons)
- Monospace: JetBrains Mono (code, IDs, technical data)

**Spacing System (8px base):**
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

**Corner Radius:**
- sm: 4px (buttons, inputs)
- md: 8px (cards, panels)
- lg: 12px (modals, overlays)
- full: 9999px (pills, avatars)

**Shadows:**
- sm: 0 1px 2px rgba(0,0,0,0.05)
- md: 0 4px 6px rgba(0,0,0,0.07)
- lg: 0 10px 15px rgba(0,0,0,0.1)
- xl: 0 20px 25px rgba(0,0,0,0.15)

### Target Platforms

- **Primary**: Web Responsive (Desktop 1920x1080, Laptop 1440x900, Tablet Landscape 1024x768)
- **Phase 2**: Tablet Portrait (768x1024) optimization
- **Out of Scope**: Native mobile apps (users access via mobile browser)

### Performance Targets

- Initial page load: < 2 seconds
- Route transitions: < 300ms
- Asset generation preview: < 60 seconds
- File uploads (100MB): < 30 seconds with progress
- Dashboard data refresh: < 1 second
- Search results: < 500ms

---

## Technical Requirements

### Technology Stack (Recommendations)

**Frontend:**
- Next.js 14+ (App Router)
- TypeScript 5+
- TailwindCSS 3+ with custom design tokens
- Framer Motion (micro-interactions and transitions)
- React Hook Form + Zod (forms and validation)
- TanStack Query (data fetching and caching)
- Zustand or Jotai (client state management)

**Backend:**
- Node.js 20+ with TypeScript
- PostgreSQL 15+ (primary database)
- Redis 7+ (job queues, caching, session storage)
- Prisma ORM (database access)
- tRPC or REST API architecture

**File Storage:**
- AWS S3 or R2 (file storage with CDN)
- Pre-signed URLs for secure uploads/downloads
- Image optimization service (Sharp or Cloudinary-ready)

**Asset Generation:**
- nanobanana API integration (logo generation)
- OpenAI GPT-4 or Anthropic Claude (copywriting, naming)
- Stable Diffusion or DALL-E integration (imagery - Phase 2)
- Custom template engine for layouts

**Authentication:**
- NextAuth.js or Clerk
- JWT-based session management
- Role-based access control (RBAC)

**Deployment & Infrastructure:**
- AWS (EC2/ECS/Fargate) or Vercel (frontend)
- Docker containerization
- PostgreSQL RDS or managed instance
- Redis ElastiCache or managed instance
- CloudFront or Vercel CDN
- GitHub Actions or Vercel deployments (CI/CD)

**Monitoring & Logging:**
- Sentry (error tracking)
- LogRocket or Datadog (session replay - Phase 2)
- Application metrics (custom dashboard)

**Phase 2 Integrations:**
- Stripe (payments and invoicing)
- Skydo (international payments)
- Shopify/WordPress (e-commerce export)
- Klaviyo or Resend (email campaigns)
- Zoom API (live call scheduling - future)

### Database Schema Overview

**Core Entities:**
- Users (internal team + creators)
- Projects (creator brands)
- ProjectPhases (M0-M8 stages)
- Tasks (checklist items per phase)
- Assets (generated and uploaded files)
- AssetVersions (version control)
- Approvals (approval workflows)
- Comments (discussions and feedback)
- Notifications
- Invoices
- Expenses

**Key Relationships:**
- Projects → Users (many-to-many with roles)
- Projects → ProjectPhases (one-to-many)
- ProjectPhases → Tasks (one-to-many)
- Projects → Assets (one-to-many)
- Assets → AssetVersions (one-to-many)
- Assets → Approvals (one-to-many)
- Projects → Comments (one-to-many)
- Users → Notifications (one-to-many)
- Projects → Invoices (one-to-many)
- Projects → Expenses (one-to-many)

### API Architecture

**RESTful Endpoints (or tRPC procedures):**

**Authentication:**
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/register
- GET /api/auth/me

**Projects:**
- GET /api/projects (list all)
- POST /api/projects (create)
- GET /api/projects/:id (single project)
- PATCH /api/projects/:id (update)
- DELETE /api/projects/:id (archive)
- GET /api/projects/:id/phases
- GET /api/projects/:id/timeline

**Assets:**
- POST /api/assets/generate (trigger asset generation)
- GET /api/assets/:id
- POST /api/assets/upload
- GET /api/assets/:id/versions
- POST /api/assets/:id/approve

**Approvals:**
- GET /api/approvals (pending for user)
- POST /api/approvals/:id/approve
- POST /api/approvals/:id/request-changes
- GET /api/approvals/:id/history

**Comments:**
- GET /api/projects/:id/comments
- POST /api/projects/:id/comments
- PATCH /api/comments/:id
- DELETE /api/comments/:id

**Finance:**
- GET /api/invoices
- POST /api/invoices
- GET /api/invoices/:id/pdf
- GET /api/projects/:id/expenses
- POST /api/projects/:id/expenses

**Manufacturing:**
- GET /api/projects/:id/vendors
- POST /api/projects/:id/purchase-orders
- GET /api/purchase-orders/:id
- PATCH /api/purchase-orders/:id/status

**Notifications:**
- GET /api/notifications
- PATCH /api/notifications/:id/read
- PATCH /api/notifications/read-all

### Security Requirements

**Authentication & Authorization:**
- All endpoints require valid JWT token except public assets
- Role-based access control: Admin, Team Member, Creator
- Project-level permissions: Owner, Editor, Viewer
- Session timeout after 7 days of inactivity

**Data Protection:**
- All passwords hashed with bcrypt (salt rounds: 12)
- File uploads scanned for malware (ClamAV integration ready)
- Sensitive data (payment info) encrypted at rest
- HTTPS enforced for all connections
- CORS configured for known origins only

**API Security:**
- Rate limiting: 100 requests/minute per authenticated user
- Input validation on all endpoints (Zod schemas)
- SQL injection prevention (Prisma parameterized queries)
- XSS protection (Content Security Policy headers)
- CSRF tokens for state-changing operations

### Performance Optimization

**Frontend:**
- Code splitting by route
- Image lazy loading and optimization
- Asset preloading for critical resources
- Service worker for offline capability (Phase 2)
- Bundle size target: < 300KB initial JS

**Backend:**
- Database connection pooling (max 20 connections)
- Query optimization with indexes
- Redis caching for frequently accessed data (TTL: 5 minutes)
- Job queue for asset generation (prevents blocking)
- CDN for static assets with aggressive caching

**Database Indexes:**
- projects(status, created_at)
- assets(project_id, type, created_at)
- approvals(user_id, status, created_at)
- comments(project_id, created_at)
- notifications(user_id, read, created_at)

---

## Epic and Story Structure

### Phase 1: Core Platform (Launch Blocker)

#### Epic 1: Authentication & User Management

**Epic Goal**: Implement secure authentication system with role-based access control for Admin and Client portals

**Stories:**

##### Story 1.1: User Registration and Login System

**As a** system administrator  
**I want** to register internal team members and creators with role assignments  
**So that** users can securely access their respective portals with appropriate permissions

**Acceptance Criteria:**

AC1: GIVEN I am on the registration page WHEN I enter valid email, password (min 12 chars), full name, and role (Admin/Team Member/Creator) THEN a new user account is created with hashed password and assigned role

AC2: GIVEN I am a registered user WHEN I enter correct email and password on login page THEN I am authenticated and redirected to appropriate portal (Admin for Admin/Team, Client for Creator)

AC3: GIVEN I am a registered user WHEN I enter incorrect credentials THEN I see "Invalid email or password" error message without revealing which field is incorrect

AC4: GIVEN I am logged in WHEN 7 days of inactivity pass THEN my session expires and I am redirected to login page

AC5: GIVEN I click "Forgot Password" WHEN I enter my registered email THEN I receive password reset link valid for 1 hour

AC6: GIVEN I have a valid reset link WHEN I click it and enter new password (min 12 chars, confirmed) THEN my password is updated and I can login with new credentials

AC7: GIVEN I am authenticated WHEN I navigate to login page THEN I am automatically redirected to my dashboard

**Technical Notes:**
- Use NextAuth.js with Credentials provider
- JWT stored in httpOnly secure cookies
- Password validation: min 12 chars, at least 1 uppercase, 1 lowercase, 1 number
- bcrypt hashing with 12 salt rounds
- Database: User table with fields: id (UUID), email (unique), password_hash, full_name, role (enum), created_at, updated_at

---

##### Story 1.2: Role-Based Access Control and Portal Routing

**As a** platform administrator  
**I want** users to access only features appropriate to their role  
**So that** creators see simplified Client Portal and team members see full Admin Portal

**Acceptance Criteria:**

AC1: GIVEN I am logged in as Admin or Team Member WHEN I access the platform THEN I see Admin Portal dashboard with all internal features

AC2: GIVEN I am logged in as Creator WHEN I access the platform THEN I see Client Portal dashboard with creator-appropriate features only

AC3: GIVEN I am a Creator WHEN I attempt to access Admin Portal URLs directly THEN I receive 403 Forbidden and redirect to Client Portal

AC4: GIVEN I am a Team Member WHEN I access a project THEN I can view and edit based on my project-specific permissions (Owner/Editor/Viewer)

AC5: GIVEN I am a Creator WHEN I access my project THEN I have read-only access except for upload zones, approvals, and chat

AC6: GIVEN I am not authenticated WHEN I attempt to access any protected route THEN I am redirected to login page with return URL preserved

AC7: GIVEN I am an Admin WHEN I assign project roles to users THEN I can select Owner, Editor, or Viewer with appropriate permissions enforced

**Technical Notes:**
- Middleware for route protection
- Role enum: Admin, TeamMember, Creator
- Project permission enum: Owner, Editor, Viewer
- Database: ProjectUser join table with fields: project_id, user_id, role
- Permission checks in API endpoints and tRPC procedures

---

##### Story 1.3: User Profile Management

**As a** user  
**I want** to manage my profile information and preferences  
**So that** my account details are current and my experience is personalized

**Acceptance Criteria:**

AC1: GIVEN I am logged in WHEN I navigate to Profile Settings THEN I see my current: full name, email, profile photo, role (read-only), notification preferences

AC2: GIVEN I am editing my profile WHEN I update full name and save THEN changes persist and display in navigation header

AC3: GIVEN I am editing my profile WHEN I upload a profile photo (JPG/PNG, max 5MB) THEN photo is resized to 200x200px, uploaded to S3, and displayed in navigation

AC4: GIVEN I am in Profile Settings WHEN I change notification preferences (email on approvals, email on mentions, email on status changes) THEN preferences save and affect future notifications

AC5: GIVEN I am in Profile Settings WHEN I click "Change Password" THEN I enter current password, new password (min 12 chars), confirm new password, and password updates on save

AC6: GIVEN I am changing password WHEN current password is incorrect THEN I see "Current password is incorrect" error

AC7: GIVEN I am an Admin WHEN I view Users list THEN I see all users with: name, email, role, projects assigned, last login, status (Active/Inactive)

AC8: GIVEN I am an Admin WHEN I deactivate a user THEN they cannot log in and see "Account deactivated" message on login attempt

**Technical Notes:**
- Profile photo upload to S3 with CloudFront URL
- Image resizing with Sharp library
- Database: User table additions: profile_photo_url, notification_email_approvals, notification_email_mentions, notification_email_status, last_login_at, is_active
- Admin user management page with filtering and search

---

#### Epic 2: Project Management Core

**Epic Goal**: Build project creation and lifecycle management system with phase tracking and basic workspace

**Stories:**

##### Story 2.1: Project Creation and Initial Setup

**As an** internal team member  
**I want** to create new creator brand projects with basic information  
**So that** we can start the 8-month brand development lifecycle

**Acceptance Criteria:**

AC1: GIVEN I am on Admin Dashboard WHEN I click "Create New Project" THEN I see modal with fields: Creator Name, Project Name, Brand Category (dropdown: Fashion/Beauty/Fitness/Lifestyle/Other), Start Date, Expected Launch Date, Lead Strategist (user dropdown)

AC2: GIVEN I am creating a project WHEN I submit valid form THEN project is created with status "Onboarding" (M0) and all 8 phases initialized (M0-M7: Onboarding, Discovery, Branding, Product Dev, Manufacturing, Website, Marketing, Launch)

AC3: GIVEN a project is created WHEN I view it THEN I see: project header (name, creator, category, dates), phase progress bar showing current phase, assigned team members, project actions menu

AC4: GIVEN I am a Lead Strategist on a project WHEN project is created THEN I receive email notification with project details and link

AC5: GIVEN I am creating a project WHEN I select Lead Strategist THEN that user is automatically assigned as "Owner" role on the project

AC6: GIVEN a project exists WHEN I archive it THEN it moves to "Archived" status and disappears from active project lists (filterable to show archived)

AC7: GIVEN I am viewing a project WHEN I edit project details (name, dates, category) THEN changes save and reflect immediately in all views

**Technical Notes:**
- Database: Project table fields: id (UUID), project_name, creator_name, category (enum), start_date, expected_launch_date, actual_launch_date, status (enum), lead_strategist_id, created_at, updated_at
- ProjectPhase table: id, project_id, phase_name (M0-M7), phase_order, status (Not Started/In Progress/Completed), start_date, end_date, created_at
- Auto-create all 8 phases on project creation with status "Not Started"
- Status enum: Onboarding, Discovery, Branding, ProductDev, Manufacturing, Website, Marketing, Launch, Completed, Archived

---

##### Story 2.2: Project Dashboard and Phase Navigation

**As a** team member  
**I want** to view project overview and navigate between phases  
**So that** I can quickly access relevant work areas and track progress

**Acceptance Criteria:**

AC1: GIVEN I am viewing a project WHEN on Overview tab THEN I see: project summary (creator, category, dates, lead), phase progress visualization (M0-M7 with current highlighted), key metrics (days elapsed, days remaining, completion %), assigned team (names + roles), recent activity feed (last 10 actions)

AC2: GIVEN I am viewing project WHEN I see phase progress bar THEN current phase is highlighted with distinct color, completed phases show checkmarks, future phases are grayed out

AC3: GIVEN I am viewing project WHEN I click sidebar tabs (Overview, Discovery, Branding, Product Dev, Manufacturing, Website, Marketing, Launch, Files, Finance) THEN content area loads corresponding workspace

AC4: GIVEN I am in a phase workspace WHEN phase is "Not Started" THEN I see "Start Phase" button that changes phase status to "In Progress" and sets start_date to current timestamp

AC5: GIVEN I am in a phase workspace WHEN phase is "In Progress" THEN I see phase-specific checklist, file upload zone, and "Complete Phase" button

AC6: GIVEN I am completing a phase WHEN I click "Complete Phase" and all required checklist items are checked THEN phase status changes to "Completed", end_date set, and next phase status changes to "In Progress"

AC7: GIVEN I am completing a phase WHEN I click "Complete Phase" but required checklist items are unchecked THEN I see error "Cannot complete phase: X required items remaining" with list of incomplete items

AC8: GIVEN I am viewing project WHEN I click team member name in sidebar THEN I see their: role on project, email, last active timestamp, assigned tasks count

**Technical Notes:**
- Phase checklist stored as JSON in ProjectPhase table: checklist_items (array of {id, title, required, completed})
- Activity feed from separate Activity table: id, project_id, user_id, action_type, action_description, created_at
- Action types: project_created, phase_started, phase_completed, file_uploaded, approval_submitted, comment_added
- Real-time updates using Server-Sent Events or WebSocket (Phase 2)

---

##### Story 2.3: Project Team Assignment and Permissions

**As a** project lead  
**I want** to assign team members to projects with specific roles  
**So that** the right people have appropriate access to project information

**Acceptance Criteria:**

AC1: GIVEN I am a project Owner WHEN I navigate to Project Settings → Team THEN I see list of assigned team members with: name, role (Owner/Editor/Viewer), date added, "Remove" button

AC2: GIVEN I am a project Owner WHEN I click "Add Team Member" THEN I see modal with: user search/dropdown (all internal users), role selector (Owner/Editor/Viewer), optional message field

AC3: GIVEN I am adding a team member WHEN I select user, role, and click "Add" THEN user is assigned to project with selected role and receives email notification

AC4: GIVEN I am a project Owner WHEN I remove a team member THEN they lose access to project and receive email notification of removal

AC5: GIVEN I have Viewer role on a project WHEN I access project THEN I can view all content but cannot: upload files, submit approvals, edit data, add comments (can only view)

AC6: GIVEN I have Editor role on a project WHEN I access project THEN I can: view all content, upload files, submit approvals, edit data, add comments but cannot: change team assignments, archive project

AC7: GIVEN I have Owner role on a project WHEN I access project THEN I have full permissions including: team management, project settings, archival

AC8: GIVEN I am not assigned to a project WHEN I attempt to access it via URL THEN I receive 403 Forbidden error

**Technical Notes:**
- Database: ProjectUser table fields: id, project_id, user_id, role (Owner/Editor/Viewer), added_by_user_id, created_at
- Minimum 1 Owner required per project (prevent last Owner removal)
- Permission checks in middleware and API layer
- Email template for team assignment notification

---

#### Epic 3: File Management System

**Epic Goal**: Implement secure file upload, storage, versioning, and organization for project assets

**Stories:**

##### Story 3.1: File Upload and Storage

**As a** team member or creator  
**I want** to upload files to project phases  
**So that** all project assets are centralized and accessible to the team

**Acceptance Criteria:**

AC1: GIVEN I am in any project phase workspace WHEN I see file upload zone THEN I can drag-drop or click to browse files (supported: PDF, JPG, PNG, GIF, MP4, MOV, AI, PSD, DOCX, XLSX)

AC2: GIVEN I am uploading files WHEN I select/drop multiple files (max 10 at once) THEN upload progress bar shows for each file with percentage

AC3: GIVEN I am uploading a file WHEN size is under 500MB THEN file uploads to S3 with unique key, database record created with: filename, file_type, file_size, uploaded_by_user_id, project_id, phase_id, s3_url

AC4: GIVEN I am uploading a file WHEN size exceeds 500MB THEN upload is rejected with error "File size exceeds 500MB limit. Please compress or split the file."

AC5: GIVEN I uploaded a file WHEN upload completes THEN file appears in Files tab with: thumbnail (images/videos), filename, file type icon, size, uploader name, upload timestamp, download button

AC6: GIVEN I am a Creator WHEN I access upload zone THEN I can only upload to designated Creator Upload areas (References, Videos, Photos, Notes folders)

AC7: GIVEN a file is uploaded WHEN it's an image (JPG/PNG) THEN system generates thumbnail (200x200px) for preview

AC8: GIVEN I am viewing Files tab WHEN I click download button THEN pre-signed S3 URL is generated (valid 5 minutes) and file downloads to my device

**Technical Notes:**
- Direct upload to S3 using pre-signed POST URLs (prevents proxying through backend)
- Database: File table fields: id (UUID), filename, original_filename, file_type, file_size, s3_key, s3_url, thumbnail_s3_url, project_id, phase_id, folder (enum), uploaded_by_user_id, created_at
- Folder enum: Refs, Brand, Product, Manufacturing, Website, Marketing, CreatorUploads
- File type validation on both client and server
- Virus scanning with ClamAV (async job after upload)

---

##### Story 3.2: File Organization and Filtering

**As a** team member  
**I want** to organize and filter project files  
**So that** I can quickly find assets across different phases

**Acceptance Criteria:**

AC1: GIVEN I am on Files tab WHEN viewing all files THEN I see sidebar folders: All Files (count), References (count), Brand Assets (count), Product (count), Manufacturing (count), Website (count), Marketing (count), Creator Uploads (count)

AC2: GIVEN I am viewing Files WHEN I click a folder THEN files filter to show only that category with folder highlighted

AC3: GIVEN I am viewing Files WHEN I use search box THEN files filter by filename (partial match, case-insensitive) with debounced search (300ms delay)

AC4: GIVEN I am viewing Files WHEN I apply filters (file type: Images/Videos/Documents/Other, date range, uploaded by user) THEN file list updates to show matching results

AC5: GIVEN I am viewing Files WHEN I change sort order (Name A-Z, Name Z-A, Newest First, Oldest First, Largest, Smallest) THEN files re-sort accordingly

AC6: GIVEN I am viewing Files WHEN I select grid view THEN files display as thumbnail cards (3-4 per row)

AC7: GIVEN I am viewing Files WHEN I select list view THEN files display as table rows with columns: Name, Type, Size, Uploader, Date, Actions

AC8: GIVEN I am viewing Files WHEN I right-click a file THEN I see context menu: Download, Move to Folder, Delete (if I uploaded it or I'm Owner)

**Technical Notes:**
- File counts calculated with database aggregations
- Search using PostgreSQL full-text search or simple LIKE query
- Filtering logic in API endpoint with query parameters
- View preference stored in user session/local storage

---

##### Story 3.3: File Versioning and History

**As a** team member  
**I want** to upload new versions of existing files  
**So that** we maintain version history without cluttering the file list

**Acceptance Criteria:**

AC1: GIVEN I am viewing a file detail modal WHEN I click "Upload New Version" THEN I can select replacement file (same type recommended) which creates new FileVersion record

AC2: GIVEN a new version is uploaded WHEN save completes THEN file shows latest version as primary with version number incremented (v1, v2, v3...)

AC3: GIVEN a file has multiple versions WHEN I view file detail THEN I see version history list with: version number, uploaded by, upload date, download button for each version

AC4: GIVEN I am viewing version history WHEN I click a previous version THEN I can download that specific version

AC5: GIVEN I am a project Owner WHEN I view version history THEN I can "Set as Current" to revert to previous version (creates new version record as copy)

AC6: GIVEN a file has versions WHEN I delete the file THEN all versions are marked as deleted (soft delete) but remain in database for audit

AC7: GIVEN I am comparing versions WHEN I view side-by-side (images only) THEN I see current version vs selected previous version with visual diff highlighting

**Technical Notes:**
- Database: FileVersion table fields: id, file_id, version_number, s3_key, s3_url, uploaded_by_user_id, created_at
- File table addition: current_version_id (foreign key to FileVersion)
- Soft delete: is_deleted flag instead of actual deletion
- Version comparison using image diff library (pixelmatch) for images

---

#### Epic 4: Asset Generation Engine - Core

**Epic Goal**: Build the automated brand asset generation system that produces logos, palettes, taglines, and templates from creator questionnaire

**Stories:**

##### Story 4.1: Creator Questionnaire System

**As a** team member  
**I want** creators to complete a comprehensive brand questionnaire  
**So that** the asset generation engine has inputs to create personalized brand assets

**Acceptance Criteria:**

AC1: GIVEN I am in Discovery phase WHEN I click "Send Questionnaire to Creator" THEN creator receives email with link to questionnaire form

AC2: GIVEN I am a Creator WHEN I open questionnaire link THEN I see 28 questions across categories: Brand Vision (5Q), Target Audience (6Q), Aesthetic Preferences (7Q), Product Focus (5Q), Brand Personality (5Q)

AC3: GIVEN I am completing questionnaire WHEN I answer question THEN response auto-saves after 2 second delay (no manual save required)

AC4: GIVEN I am completing questionnaire WHEN I navigate away THEN progress is preserved and I can resume from same point

AC5: GIVEN I am completing questionnaire WHEN I reach final question and click "Submit" THEN questionnaire marked as "Completed" and team receives notification

AC6: GIVEN questionnaire is submitted WHEN team views it THEN responses display in readable format with: question text, creator answer, optional team notes field

AC7: GIVEN I am a team member WHEN viewing completed questionnaire THEN I see "Generate Assets" button that triggers asset generation workflow

AC8: GIVEN I am viewing questionnaire WHEN creator hasn't completed it THEN I see completion percentage and "Send Reminder" button

**Questionnaire Sample Questions:**

**Brand Vision (5Q):**
1. In one sentence, what is your brand about?
2. What problem does your brand solve for your audience?
3. What makes your brand different from others in your space?
4. What are 3 words that describe your brand's personality?
5. What is your ultimate vision for this brand in 3 years?

**Target Audience (6Q):**
6. Who is your primary audience? (Age, gender, location, interests)
7. What are their biggest pain points or desires?
8. Where does your audience spend time online? (Platforms)
9. What brands do they currently love and why?
10. What income level best describes your target customer?
11. Describe your ideal customer in 2-3 sentences

**Aesthetic Preferences (7Q):**
12. What 3 adjectives describe your dream brand aesthetic? (e.g., bold, minimal, luxurious)
13. Which existing brands have a look you admire? (List 3-5)
14. Color preferences: What colors do you love? What colors should be avoided?
15. Typography vibe: Modern/Classic, Bold/Delicate, Playful/Serious
16. Imagery style: Minimal/Detailed, Photography/Illustration, Light/Dark
17. Upload 5-10 inspirational images that capture your brand vibe
18. Is there anything you absolutely DON'T want in your branding?

**Product Focus (5Q):**
19. What product categories will you launch with? (e.g., apparel, supplements, skincare)
20. What is your target price point range?
21. Where will products be manufactured/sourced?
22. What makes your products special or unique?
23. Describe your dream product in detail

**Brand Personality (5Q):**
24. If your brand was a person, how would they speak? (Formal/Casual, Funny/Serious)
25. What values are non-negotiable for your brand? (Sustainability, inclusivity, etc.)
26. What kind of content will you create? (Educational, entertaining, aspirational)
27. Which influencer or celebrity embodies your brand energy?
28. Any specific cultural or personal elements to incorporate?

**Technical Notes:**
- Database: Questionnaire table fields: id, project_id, status (InProgress/Completed), started_at, completed_at, submitted_by_user_id
- QuestionnaireResponse table: id, questionnaire_id, question_number, question_text, response_text, response_type (text/multiselect/file), created_at, updated_at
- Auto-save implementation with debounce
- File uploads for Q17 (moodboard images) stored in Files table with special folder "QuestionnaireRefs"

---

##### Story 4.2: Logo Generation Integration (nanobanana)

**As a** team member  
**I want** the system to generate logo concepts from questionnaire responses  
**So that** we have initial design directions without manual designer work

**Acceptance Criteria:**

AC1: GIVEN questionnaire is completed WHEN I click "Generate Brand Assets" THEN system extracts key inputs (Q1, Q3, Q12, Q15, Q17 responses) and prepares nanobanana API request

AC2: GIVEN asset generation starts WHEN request is sent THEN job is queued in Redis with status "Pending" and progress indicator shows "Analyzing brand inputs..."

AC3: GIVEN nanobanana API is called WHEN request includes: brand name, brand description, aesthetic keywords (from Q12), color preferences (from Q14), inspiration images (from Q17) THEN API returns 3-6 logo concept URLs

AC4: GIVEN nanobanana returns results WHEN logos are received THEN they are downloaded from nanobanana CDN, uploaded to our S3, and saved to Files table with folder "GeneratedLogos"

AC5: GIVEN logo generation completes WHEN all logos are saved THEN job status updates to "Completed" and team receives notification "Logo concepts ready for review"

AC6: GIVEN logo generation fails WHEN nanobanana API returns error (timeout, API limit, invalid params) THEN system retries up to 3 times with exponential backoff (1s, 5s, 15s)

AC7: GIVEN all retries fail WHEN error persists THEN job status updates to "Failed" with error message logged and team notified "Logo generation failed. Please try again or create manually."

AC8: GIVEN I am viewing generated logos WHEN I open Brand Design workspace THEN logos display in gallery view with download buttons and "Select for Refinement" option

**Technical Notes:**
- nanobanana API docs: https://nanobanana.ai/docs/api (fictional - adjust to actual)
- API request payload: {brand_name, description, keywords[], colors[], inspiration_image_urls[]}
- API response: {logo_urls[], generation_id, metadata{}}
- Database: AssetGeneration table fields: id, project_id, job_type (LogoGen/PaletteGen/TaglineGen), status (Pending/Processing/Completed/Failed), input_data (JSONB), output_data (JSONB), error_message, created_at, updated_at
- Job queue using BullMQ (Redis-backed)
- Retry logic with exponential backoff

---

##### Story 4.3: Color Palette Generation

**As a** team member  
**I want** the system to generate coordinated color palettes  
**So that** we have professional color systems without manual color theory work

**Acceptance Criteria:**

AC1: GIVEN asset generation is triggered WHEN color palette generation starts THEN system analyzes: selected logo concepts (dominant colors), questionnaire color preferences (Q14), inspiration images (Q17), aesthetic keywords (Q12)

AC2: GIVEN color analysis completes WHEN palette generation algorithm runs THEN it produces: Primary colors (3), Secondary colors (3), Neutral colors (3), total 9 colors with hex codes

AC3: GIVEN palette is generated WHEN saved THEN each color includes: hex code, RGB values, color name (e.g., "Sunset Orange"), usage recommendation (backgrounds/accents/text)

AC4: GIVEN palette is generated WHEN saved to Brand Design workspace THEN colors display as swatches with: color name, hex code, copy button, accessibility contrast checker

AC5: GIVEN I am viewing palette WHEN I click contrast checker THEN system validates contrast ratios for: Primary text on background colors, Secondary text on background colors, minimum 4.5:1 ratio for AA compliance

AC6: GIVEN palette fails accessibility WHEN contrast is insufficient THEN system suggests adjusted shades with compliant ratios

AC7: GIVEN palette is approved WHEN I mark as "Final Palette" THEN colors are saved to project and available for use in all future asset generation (templates, brand book)

AC8: GIVEN I want alternate palettes WHEN I click "Generate Alternative" THEN system creates 2 additional palette variations using different algorithmic approaches

**Technical Notes:**
- Color palette algorithm using: extracted logo colors, user preferences, color harmony rules (complementary, analogous, triadic)
- Library: chroma.js or culori for color manipulation
- Contrast calculation: WCAG formula (L1 + 0.05) / (L2 + 0.05)
- Database: ColorPalette table fields: id, project_id, palette_name, is_primary (boolean), colors (JSONB array: [{name, hex, rgb, usage, luminance}])
- AssetGeneration job type "PaletteGen" with input/output tracking

---

##### Story 4.4: Tagline and Copywriting Generation (AI)

**As a** team member  
**I want** the system to generate tagline options using AI  
**So that** we have professional copy variations without manual copywriting effort

**Acceptance Criteria:**

AC1: GIVEN asset generation is triggered WHEN tagline generation starts THEN system prepares AI prompt with: brand name, brand description (Q1), brand personality (Q3, Q24), target audience (Q6, Q11), unique value prop (Q3)

AC2: GIVEN AI prompt is ready WHEN sent to OpenAI GPT-4 or Anthropic Claude THEN request includes: prompt template, temperature 0.8, max tokens 200, instruction "Generate 8 unique tagline options that capture the brand essence. Keep each under 8 words."

AC3: GIVEN AI returns response WHEN taglines are parsed THEN system extracts 8 tagline options (one per line) and saves to database

AC4: GIVEN taglines are generated WHEN saved to Brand Design workspace THEN they display as numbered list with: tagline text, character count, "Vote" button, "Edit" button

AC5: GIVEN I am viewing taglines WHEN I click "Vote" on preferred options THEN vote count increments and taglines re-sort by votes (highest first)

AC6: GIVEN I want more options WHEN I click "Generate More" THEN system sends another AI request with seed parameter to ensure variety and adds 5 new taglines to list

AC7: GIVEN taglines are approved WHEN I mark 1-3 as "Final Taglines" THEN they save to project and appear in brand book

AC8: GIVEN I want to edit a tagline WHEN I click "Edit" THEN I can modify text inline and save custom version

**Technical Notes:**
- AI integration: OpenAI GPT-4-turbo or Anthropic Claude 3.5 Sonnet
- API request: POST to /v1/chat/completions with system prompt + user prompt
- Prompt engineering: Include brand context, tone instructions, output format requirements
- Database: Tagline table fields: id, project_id, tagline_text, character_count, ai_generated (boolean), vote_count, is_final (boolean), created_at
- Rate limiting: respect AI API limits (10 requests/minute for tagline generation)
- Cost tracking: log API usage and costs per project

---

##### Story 4.5: Social Media Template Generation

**As a** team member  
**I want** the system to generate social media templates with brand assets  
**So that** creators have ready-to-use content templates for launch

**Acceptance Criteria:**

AC1: GIVEN brand assets are finalized (logo, palette, taglines) WHEN I trigger template generation THEN system creates 10 social media templates: Instagram Post (5), Instagram Story (3), TikTok Cover (2)

AC2: GIVEN template generation starts WHEN system processes THEN each template uses: approved logo, primary/secondary colors from palette, brand typography, layout rules from preset designs

AC3: GIVEN templates are generated WHEN saved THEN they are available as: PSD files (editable), PNG exports (1080x1080 posts, 1080x1920 stories), template thumbnails for preview

AC4: GIVEN I am viewing templates WHEN I access Marketing workspace → Social Templates THEN I see grid of templates with: template name, platform/format, thumbnail preview, download buttons (PSD, PNG)

AC5: GIVEN I want to customize a template WHEN I download PSD THEN file includes: organized layer groups (Logo, Text, Background, Accents), color palette as swatches, font references in layer names

AC6: GIVEN template generation uses branded assets WHEN logo is placed THEN it uses highest-resolution version, positioned per layout rules (top-left, center, bottom-right depending on template)

AC7: GIVEN I want text variations WHEN templates include text THEN taglines and sample copy are dynamically inserted from approved taglines

AC8: GIVEN templates are generated WHEN quality check runs THEN system validates: minimum resolution 1080px, color accuracy (hex matches palette), logo clarity (not pixelated)

**Technical Notes:**
- Template generation using: Puppeteer (headless browser for rendering), Canvas API, or ImageMagick
- Preset template designs stored as HTML/CSS or JSON layout definitions
- Database: Template table fields: id, project_id, template_name, platform (Instagram/TikTok), format (Post/Story/Cover), thumbnail_url, psd_url, png_url, created_at
- PSD generation: use ag-psd library or export from Canvas
- Layout rules: JSON schema defining logo position, text areas, color zones per template type

---

#### Epic 5: Approval Workflows

**Epic Goal**: Implement comprehensive approval system for brand assets, designs, and deliverables with feedback loops

**Stories:**

##### Story 5.1: Approval Submission and Routing

**As a** team member  
**I want** to submit assets for creator approval  
**So that** creators can review and approve work before we proceed

**Acceptance Criteria:**

AC1: GIVEN I am in any project phase workspace WHEN I select an asset (logo, palette, packaging mockup, etc.) THEN I see "Submit for Approval" button

AC2: GIVEN I click "Submit for Approval" WHEN modal opens THEN I can: select approvers (creator + optional team members), add message/context, set due date, attach additional reference files

AC3: GIVEN I submit for approval WHEN form is complete THEN Approval record is created with status "Pending" and approvers receive email notification with direct link

AC4: GIVEN approval is submitted WHEN creator is notified THEN email includes: asset preview/thumbnail, requester name, message, "Review Now" CTA button

AC5: GIVEN I am a creator WHEN I receive approval request THEN it appears in my Client Portal: Approvals page with "New" badge and on Welcome Dashboard under "Pending Tasks"

AC6: GIVEN I am viewing pending approval WHEN I open detail THEN I see: asset preview (image/video player), high-res download link, approval request message, version number (if applicable), submitted by, submitted date, due date

AC7: GIVEN multiple assets are submitted WHEN team bundles them THEN single approval request can contain 3-10 related assets (e.g., all logo concepts together)

AC8: GIVEN approval is overdue WHEN due date passes THEN status changes to "Overdue" and reminder email sent to approvers automatically

**Technical Notes:**
- Database: Approval table fields: id, project_id, phase_id, asset_ids (array of UUIDs), requested_by_user_id, status (Pending/Approved/ChangesRequested/Overdue), message, due_date, created_at, updated_at
- ApprovalReviewer table: id, approval_id, reviewer_user_id, status (Pending/Approved/ChangesRequested), reviewed_at
- Email template with asset preview image embedded
- Approval bundle: single Approval record with multiple asset_ids

---

##### Story 5.2: Approval Review and Decision Actions

**As a** creator  
**I want** to approve assets or request changes with feedback  
**So that** the team knows whether to proceed or revise

**Acceptance Criteria:**

AC1: GIVEN I am viewing a pending approval WHEN I click "Approve" THEN confirmation modal asks "Are you sure you want to approve?" with optional comment field

AC2: GIVEN I confirm approval WHEN submitted THEN approval status changes to "Approved", reviewed_at timestamp saved, team receives notification "Creator approved: [Asset Name]"

AC3: GIVEN I want to request changes WHEN I click "Request Changes" THEN I see form with: required feedback text area (min 10 chars), optional file attachments (reference examples), specific issues checkboxes (colors, layout, typography, concept, other)

AC4: GIVEN I submit change request WHEN form is complete THEN approval status changes to "ChangesRequested", feedback is saved, team receives notification with feedback details

AC5: GIVEN team receives change request WHEN they view it THEN they see: full feedback text, attached references, issue categories checked, creator name, timestamp

AC6: GIVEN changes are requested WHEN team revises and resubmits THEN new version is created linked to original approval, version number increments, creator receives "Revised Asset Ready for Review" notification

AC7: GIVEN I am viewing approval history WHEN I see past approvals THEN they display with: decision (Approved/ChangesRequested), reviewer name, decision date, feedback (if any), version reviewed

AC8: GIVEN approval has multiple reviewers WHEN all reviewers approve THEN overall status becomes "Approved" and project progresses

**Technical Notes:**
- Approval decision saved in ApprovalReviewer record: status, feedback_text, issue_categories (JSONB), reviewed_at
- Overall Approval status calculation: if any reviewer requests changes → "ChangesRequested", if all approve → "Approved"
- Version linking: File record has parent_file_id for revisions linked to original approval
- Notification templates for approval and change request

---

##### Story 5.3: Approval Dashboard and Filtering

**As a** team member or creator  
**I want** to see all pending approvals in one place  
**So that** I can prioritize review work and track approval status

**Acceptance Criteria:**

AC1: GIVEN I am on Admin Dashboard WHEN I view "Approvals Queue" section THEN I see pending approvals across all projects with: asset thumbnail, project name, requester, due date, status, "View" button

AC2: GIVEN I am viewing Approvals Queue WHEN I filter by status (Pending/Approved/ChangesRequested/Overdue) THEN list updates to show only matching approvals

AC3: GIVEN I am viewing Approvals Queue WHEN I sort by due date (ascending/descending) THEN approvals re-sort accordingly with overdue items highlighted in red

AC4: GIVEN I am viewing Approvals Queue WHEN I filter by project THEN dropdown shows all my assigned projects and filters to selected project's approvals

AC5: GIVEN I am a Creator WHEN I access Client Portal Approvals page THEN I see my pending approvals with: asset preview cards, approval status badge, due date, "Review" button

AC6: GIVEN I am viewing Client Portal Approvals WHEN I toggle "Show Completed" THEN past approved items display below pending with "Approved" badge and reviewed date

AC7: GIVEN I am viewing approval WHEN it's overdue THEN red "Overdue" badge displays and due date shows days past due in red text

AC8: GIVEN I am Team Member WHEN I view my approvals dashboard THEN I see two tabs: "Pending My Review" (where I'm an approver) and "Awaiting Approval" (that I submitted)

**Technical Notes:**
- Approvals Queue component with real-time count badge
- Filter logic: query Approval table with status, project_id, due_date range
- Overdue calculation: WHERE due_date < NOW() AND status IN ('Pending')
- Client Portal query: WHERE creator is in approval_reviewers
- Dashboard counters: aggregate COUNT queries by status

---

#### Epic 6: Communication and Notifications

**Epic Goal**: Build internal messaging, notifications, and activity tracking to keep teams and creators informed

**Stories:**

##### Story 6.1: Project-Based Commenting System

**As a** team member or creator  
**I want** to leave comments on projects and assets  
**So that** we can discuss work without external email/chat

**Acceptance Criteria:**

AC1: GIVEN I am viewing a project phase workspace WHEN I see comments panel on right side THEN I can view existing comments in reverse chronological order (newest first)

AC2: GIVEN I am adding a comment WHEN I type in comment box and click "Post" THEN comment is saved with: comment_text, author_user_id, project_id, phase_id, created_at, and displays immediately

AC3: GIVEN I am writing a comment WHEN I type @ followed by letters THEN autocomplete dropdown appears with matching team member names

AC4: GIVEN I mention a user WHEN I select them from dropdown and post THEN mentioned user receives in-app notification and email notification (if enabled in preferences)

AC5: GIVEN I am viewing a comment WHEN I hover over it THEN I see: author profile photo, author name, timestamp (e.g., "2 hours ago"), edit button (if I authored), delete button (if I authored or I'm Owner)

AC6: GIVEN I edit my comment WHEN I change text and save THEN comment updates with "(edited)" indicator and updated_at timestamp

AC7: GIVEN I delete my comment WHEN confirmed THEN comment is soft-deleted (is_deleted flag) and displays as "[Comment deleted]" to maintain thread context

AC8: GIVEN comment thread is long WHEN > 20 comments THEN pagination loads 20 at a time with "Load More" button

AC9: GIVEN I am viewing asset detail modal WHEN comments exist for that asset THEN asset-specific comments display below preview (separate from general project comments)

**Technical Notes:**
- Database: Comment table fields: id, project_id, phase_id, asset_id (nullable), parent_comment_id (nullable for threading), user_id, comment_text, mentions (array of user_ids), is_deleted, created_at, updated_at
- Mention parsing: regex /@(\w+)/g to extract mentions and resolve to user_ids
- Real-time comment updates using Server-Sent Events or WebSocket (Phase 2: use polling for now)
- Notification creation triggered on mention save

---

##### Story 6.2: Notification System

**As a** user  
**I want** to receive notifications for important events  
**So that** I stay informed about project updates without constantly checking

**Acceptance Criteria:**

AC1: GIVEN an event occurs (approval submitted, comment mention, phase completed, file uploaded) WHEN notification is triggered THEN Notification record is created for relevant users

AC2: GIVEN I have unread notifications WHEN I view app header THEN notification bell icon shows unread count badge (e.g., "5")

AC3: GIVEN I click notification bell WHEN dropdown opens THEN I see: last 10 notifications with icon, message, timestamp, unread indicator (blue dot), "Mark all as read" button

AC4: GIVEN I am viewing notification WHEN I click it THEN I navigate to relevant context (project, approval, comment) and notification marks as read

AC5: GIVEN I want to manage notifications WHEN I go to Notification Center page THEN I see all notifications (infinite scroll) with filters: All/Unread/Mentions/Approvals/Updates, and date range

AC6: GIVEN notification is created WHEN user has email notifications enabled THEN email is sent with: notification message, CTA button linking to context, unsubscribe link

AC7: GIVEN I am in Notification Settings WHEN I toggle preference (Approvals: email on/off, Mentions: email on/off, Status Changes: email on/off) THEN future notifications respect my preferences

AC8: GIVEN I click "Mark all as read" WHEN confirmed THEN all unread notifications update to read status and badge clears

**Notification Event Types:**
- approval_requested: "You have a new approval request for [Project Name]"
- approval_approved: "[Creator Name] approved [Asset Name]"
- approval_changes_requested: "[Creator Name] requested changes on [Asset Name]"
- comment_mention: "[User Name] mentioned you in a comment on [Project Name]"
- phase_completed: "[Phase Name] completed for [Project Name]"
- file_uploaded: "[User Name] uploaded [File Name] to [Project Name]"
- team_assigned: "You've been added to [Project Name]"

**Technical Notes:**
- Database: Notification table fields: id, user_id, event_type (enum), message, link_url, project_id, is_read, created_at
- Email queue: BullMQ job with template rendering
- Notification preferences stored in User table: notify_email_approvals, notify_email_mentions, notify_email_updates
- Unread count: SELECT COUNT(*) WHERE user_id = ? AND is_read = false

---

##### Story 6.3: Activity Feed and Audit Trail

**As a** team member  
**I want** to see recent activity across projects  
**So that** I can stay aware of team progress and changes

**Acceptance Criteria:**

AC1: GIVEN I am on Admin Dashboard WHEN I view "Recent Activity" section THEN I see last 20 actions across all my projects with: action icon, description, user who performed action, timestamp, project name

AC2: GIVEN I am viewing activity feed WHEN I filter by project THEN dropdown shows my assigned projects and filters to selected project's activities

AC3: GIVEN I am viewing activity feed WHEN I filter by action type (File Uploads, Approvals, Comments, Phase Changes, Team Changes) THEN list updates to show only matching activities

AC4: GIVEN I am viewing activity feed WHEN I filter by date range (Today, This Week, This Month, Custom) THEN list updates to show activities in range

AC5: GIVEN I am viewing project Overview tab WHEN I see project-specific activity feed THEN it shows last 30 actions for that project only (not global)

AC6: GIVEN an activity item is displayed WHEN I click it THEN I navigate to relevant context (file, comment, approval, phase)

AC7: GIVEN I want detailed history WHEN I click "View Full Activity Log" THEN I navigate to dedicated Activity Log page with infinite scroll and advanced filters

AC8: GIVEN I am a project Owner WHEN I view activity log THEN I can export as CSV with columns: Timestamp, User, Action Type, Description, Project, Phase

**Activity Types Logged:**
- project_created: "[User] created project [Project Name]"
- phase_started: "[User] started [Phase Name] for [Project]"
- phase_completed: "[User] completed [Phase Name] for [Project]"
- file_uploaded: "[User] uploaded [File Name] to [Project]"
- approval_submitted: "[User] submitted [Asset Name] for approval"
- approval_decided: "[User] approved/requested changes on [Asset Name]"
- comment_added: "[User] commented on [Project/Asset]"
- team_member_added: "[User] added [New User] to [Project]"
- team_member_removed: "[User] removed [User] from [Project]"

**Technical Notes:**
- Database: Activity table fields: id, project_id, user_id, action_type (enum), action_description, metadata (JSONB for additional context), created_at
- Activity creation: triggered by application events (middleware or service layer)
- Efficient querying: index on (project_id, created_at) and (user_id, created_at)
- CSV export: generate server-side and stream download

---

### Phase 2: External Integrations & Advanced Features (Post-Launch)

#### Epic 7: Payment Integration (Phase 2)

**Epic Goal**: Integrate Stripe and Skydo for invoice generation, payment processing, and international payouts

**Stories:**

##### Story 7.1: Stripe Payment Integration
**As an** admin  
**I want** to generate and send invoices via Stripe  
**So that** creators can pay onboarding fees securely

##### Story 7.2: Skydo International Payout Integration
**As a** finance manager  
**I want** to process international payouts via Skydo  
**So that** we can pay overseas vendors and creators efficiently

##### Story 7.3: Revenue Share Calculator
**As a** finance manager  
**I want** automated revenue share calculations  
**So that** creator payouts are accurate and transparent

---

#### Epic 8: E-Commerce Platform Integration (Phase 2)

**Epic Goal**: Export brand assets and product data to Shopify and WordPress for website builds

**Stories:**

##### Story 8.1: Shopify Theme Export
**As a** team member  
**I want** to export brand assets and product data to Shopify  
**So that** we can quickly launch creator e-commerce stores

##### Story 8.2: WordPress/WooCommerce Integration
**As a** team member  
**I want** to export brand packages to WordPress  
**So that** creators can launch custom websites

---

#### Epic 9: Email Marketing Integration (Phase 2)

**Epic Goal**: Integrate Klaviyo or Resend for creator email campaigns and customer communication

**Stories:**

##### Story 9.1: Klaviyo Email Flow Builder
**As a** marketing team member  
**I want** to design email flows in Klaviyo from our platform  
**So that** creators have automated email campaigns for launch

##### Story 9.2: Resend Transactional Email Integration
**As a** system administrator  
**I want** all system emails sent via Resend  
**So that** deliverability is high and emails are branded

---

## Checklist Results Report

_(To be completed after PRD checklist validation)_

---

## Next Steps

### UX Expert Prompt

**Context**: This PRD outlines the complete Wavelaunch Studio platform with dual portals (Admin + Client) and asset generation engine.

**Request**: Please create comprehensive frontend specifications for both Admin Portal and Client Portal, including:
- Complete component library based on Industrial Mono (Warm) design system
- Detailed screen wireframes for all core views
- Interaction patterns and micro-animations
- Responsive breakpoint specifications
- Accessibility implementation details
- State management patterns

**Priority Areas**:
1. Admin Dashboard and Project Workspace (hero card, metrics, project list)
2. Asset Generation Interface (questionnaire, preview, download)
3. Approval workflow screens (submission, review, feedback)
4. Client Portal (simplified dashboard, approvals page, brand assets library)

**Design System Foundation**:
- Colors: Stone whites, greige surfaces, warm shadows, sharp black text
- Typography: Inter (UI), JetBrains Mono (technical)
- Spacing: 8px base system (xs to 3xl)
- Components: Left sidebar nav, hero cards, kanban progress, file upload zones

Please reference the UI Design Goals section for complete branding specifications.

---

### Architect Prompt

**Context**: This PRD defines a complex full-stack application with dual portals, asset generation engine (nanobanana + AI), file management, approval workflows, and real-time collaboration features.

**Request**: Please create a comprehensive full-stack architecture document covering:
- System architecture diagram (services, data flow, integrations)
- Complete database schema with all tables and relationships
- API endpoint specifications (REST or tRPC)
- Asset generation pipeline architecture (queue system, retry logic)
- File storage strategy (S3 architecture, CDN, pre-signed URLs)
- Authentication and authorization implementation
- Caching strategy (Redis usage for sessions, job queues, data caching)
- Deployment architecture (Docker, AWS/Vercel, scaling strategy)

**Critical Considerations**:
1. Asset generation must be async with job queuing (Redis + BullMQ)
2. File uploads should use pre-signed S3 URLs (avoid proxying through backend)
3. Real-time features (notifications, comments) - suggest polling for Phase 1, WebSocket for Phase 2
4. Database must support 10-20 concurrent projects efficiently
5. Phase 2 integrations (Stripe, Shopify, Klaviyo) should have clear extension points

**Technology Preferences**:
- Frontend: Next.js 14+ (App Router), TypeScript, TailwindCSS
- Backend: Node.js + TypeScript, PostgreSQL, Redis, Prisma ORM
- Deployment: AWS or Vercel, Docker containers
- File Storage: AWS S3 or Cloudflare R2

Please provide detailed implementation guidance for development team.

---

