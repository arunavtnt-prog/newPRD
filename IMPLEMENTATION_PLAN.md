# Wavelaunch Studio - Implementation Plan
## Based on next-shadcn-admin-dashboard Template

**Date:** November 20, 2025
**Status:** Planning Phase
**Template Version:** 2.0.0 (Next.js 16 + Tailwind CSS v4)

---

## Executive Summary

This implementation plan details how to build Wavelaunch Studio by leveraging the `next-shadcn-admin-dashboard` template. The template provides a solid foundation with authentication, dashboards, sidebar navigation, and 50+ UI components. We'll extend it with:

- **Backend**: PostgreSQL + Prisma ORM + Redis
- **Authentication**: NextAuth.js with RBAC
- **File Storage**: AWS S3/R2 with pre-signed URLs
- **Asset Generation**: nanobanana API + OpenAI/Claude integration
- **Dual Portals**: Admin (internal team) + Client (creators)

---

## Template Assets & Reusability

### ✅ What We Have (Template Features)

| Feature | Template Location | Reuse Strategy |
|---------|------------------|----------------|
| **Sidebar Navigation** | `/navigation/sidebar/sidebar-items.ts` | Extend with Wavelaunch routes |
| **Dashboard Layout** | `/(main)/dashboard/layout.tsx` | Keep as base, add project header |
| **Auth Screens** | `/(main)/auth/v1/*`, `/(main)/auth/v2/*` | Use v2 screens, add role selection |
| **Data Tables** | `/components/data-table/*` | Use for files, approvals, projects |
| **Card Components** | `/components/ui/card.tsx` | Use for metrics, projects, assets |
| **Charts** | recharts integration | Use for analytics, timeline |
| **Forms** | React Hook Form + Zod | Use for questionnaire, settings |
| **Theme System** | next-themes with presets | Keep existing, brand as Wavelaunch |
| **State Management** | Zustand stores | Extend for app state |
| **UI Components** | 50+ shadcn components | Use throughout |

### 🔨 What We Need to Build

| Feature | Description | Priority |
|---------|-------------|----------|
| **Database Schema** | PostgreSQL with Prisma (Users, Projects, Assets, Approvals, etc.) | P0 |
| **API Layer** | tRPC or REST endpoints for all operations | P0 |
| **File Upload System** | S3 integration with pre-signed URLs | P0 |
| **Asset Generation Engine** | nanobanana + AI integration with job queues | P0 |
| **Approval Workflows** | Multi-step approval with versioning | P0 |
| **Project Management** | 8-phase lifecycle, phase tracking | P0 |
| **Client Portal** | Simplified creator-facing views | P0 |
| **Notification System** | In-app + email notifications | P1 |
| **Comment System** | Project-based with @mentions | P1 |
| **Activity Tracking** | Audit log and activity feed | P1 |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Next.js 16)                │
│  ┌──────────────────────┐  ┌──────────────────────┐    │
│  │   Admin Portal       │  │   Client Portal      │    │
│  │  - Dashboard         │  │  - Welcome           │    │
│  │  - Projects          │  │  - Approvals         │    │
│  │  - Asset Gen         │  │  - Brand Assets      │    │
│  │  - Approvals Queue   │  │  - Upload Zone       │    │
│  └──────────────────────┘  └──────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │          Shared Components (shadcn/ui)          │    │
│  │  Cards | Tables | Forms | Dialogs | Charts     │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  API Layer (tRPC / REST)                 │
│  Auth | Projects | Assets | Approvals | Files           │
└─────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ↓                       ↓
┌──────────────────────┐   ┌──────────────────────┐
│   PostgreSQL + Prisma│   │   Redis (Jobs/Cache) │
│   - Users            │   │   - Asset Gen Jobs   │
│   - Projects         │   │   - Session Store    │
│   - Assets           │   │   - Rate Limiting    │
│   - Approvals        │   └──────────────────────┘
│   - Files            │
│   - Comments         │
│   - Notifications    │
└──────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  External Services                       │
│  - AWS S3/R2 (File Storage)                             │
│  - nanobanana API (Logo Generation)                     │
│  - OpenAI/Claude (Taglines, Copy)                       │
│  - Email Service (Resend/SendGrid)                      │
└─────────────────────────────────────────────────────────┘
```

---

## Phase 1: Foundation Setup (Week 1)

### 1.1 Environment & Dependencies

**Tasks:**
- [ ] Copy template to new project directory
- [ ] Install additional dependencies:
  ```bash
  npm install prisma @prisma/client
  npm install next-auth @auth/prisma-adapter
  npm install @tanstack/react-query@latest
  npm install ioredis bullmq
  npm install aws-sdk @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
  npm install openai anthropic-sdk
  npm install resend nodemailer
  npm install date-fns zod
  ```
- [ ] Configure environment variables (.env.local):
  ```
  DATABASE_URL=postgresql://...
  REDIS_URL=redis://...
  NEXTAUTH_SECRET=...
  NEXTAUTH_URL=...
  AWS_ACCESS_KEY_ID=...
  AWS_SECRET_ACCESS_KEY=...
  AWS_S3_BUCKET=...
  AWS_REGION=...
  NANOBANANA_API_KEY=...
  OPENAI_API_KEY=...
  RESEND_API_KEY=...
  ```

### 1.2 Database Setup (Prisma)

**Schema Design:** `/prisma/schema.prisma`

```prisma
// Core Models
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  fullName      String
  role          UserRole  @default(TEAM_MEMBER)
  profilePhotoUrl String?
  isActive      Boolean   @default(true)
  lastLoginAt   DateTime?

  // Notification Preferences
  notifyEmailApprovals Boolean @default(true)
  notifyEmailMentions  Boolean @default(true)
  notifyEmailUpdates   Boolean @default(true)

  // Relations
  projectMemberships ProjectUser[]
  comments          Comment[]
  notifications     Notification[]
  activities        Activity[]
  createdProjects   Project[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum UserRole {
  ADMIN
  TEAM_MEMBER
  CREATOR
}

model Project {
  id                String        @id @default(cuid())
  projectName       String
  creatorName       String
  category          ProjectCategory
  startDate         DateTime
  expectedLaunchDate DateTime
  actualLaunchDate  DateTime?
  status            ProjectStatus @default(ONBOARDING)

  leadStrategistId  String
  leadStrategist    User          @relation(fields: [leadStrategistId], references: [id])

  // Relations
  phases            ProjectPhase[]
  team              ProjectUser[]
  files             File[]
  assets            Asset[]
  approvals         Approval[]
  comments          Comment[]
  activities        Activity[]
  questionnaire     Questionnaire?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum ProjectCategory {
  FASHION
  BEAUTY
  FITNESS
  LIFESTYLE
  OTHER
}

enum ProjectStatus {
  ONBOARDING
  DISCOVERY
  BRANDING
  PRODUCT_DEV
  MANUFACTURING
  WEBSITE
  MARKETING
  LAUNCH
  COMPLETED
  ARCHIVED
}

model ProjectPhase {
  id          String            @id @default(cuid())
  projectId   String
  project     Project           @relation(fields: [projectId], references: [id])

  phaseName   String            // M0, M1, M2...
  phaseOrder  Int               // 0, 1, 2...
  status      PhaseStatus       @default(NOT_STARTED)
  startDate   DateTime?
  endDate     DateTime?

  checklistItems Json           // [{id, title, required, completed}]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([projectId, phaseOrder])
}

enum PhaseStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED
}

model ProjectUser {
  id          String      @id @default(cuid())
  projectId   String
  project     Project     @relation(fields: [projectId], references: [id])
  userId      String
  user        User        @relation(fields: [userId], references: [id])
  role        ProjectRole @default(VIEWER)
  addedById   String?

  createdAt DateTime @default(now())

  @@unique([projectId, userId])
}

enum ProjectRole {
  OWNER
  EDITOR
  VIEWER
}

model File {
  id              String   @id @default(cuid())
  filename        String
  originalFilename String
  fileType        String
  fileSize        Int
  s3Key           String
  s3Url           String
  thumbnailS3Url  String?

  projectId       String
  project         Project  @relation(fields: [projectId], references: [id])
  phaseId         String?
  folder          FileFolder

  uploadedById    String
  uploadedBy      User     @relation(fields: [uploadedById], references: [id])

  currentVersionId String?
  versions        FileVersion[]

  isDeleted       Boolean  @default(false)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum FileFolder {
  REFS
  BRAND
  PRODUCT
  MANUFACTURING
  WEBSITE
  MARKETING
  CREATOR_UPLOADS
  QUESTIONNAIRE_REFS
  GENERATED_LOGOS
}

model FileVersion {
  id              String   @id @default(cuid())
  fileId          String
  file            File     @relation(fields: [fileId], references: [id])
  versionNumber   Int
  s3Key           String
  s3Url           String

  uploadedById    String

  createdAt DateTime @default(now())
}

model Asset {
  id          String   @id @default(cuid())
  assetName   String
  assetType   AssetType

  projectId   String
  project     Project  @relation(fields: [projectId], references: [id])

  fileId      String?
  metadata    Json?    // Additional asset-specific data

  approvals   Approval[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum AssetType {
  LOGO
  COLOR_PALETTE
  TAGLINE
  SOCIAL_TEMPLATE
  PACKAGING
  BRAND_BOOK
  OTHER
}

model AssetGeneration {
  id          String              @id @default(cuid())
  projectId   String
  jobType     AssetGenerationType
  status      JobStatus           @default(PENDING)

  inputData   Json                // Questionnaire data, params
  outputData  Json?               // Generated asset URLs, metadata
  errorMessage String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum AssetGenerationType {
  LOGO_GEN
  PALETTE_GEN
  TAGLINE_GEN
  TEMPLATE_GEN
}

enum JobStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

model Approval {
  id          String        @id @default(cuid())
  projectId   String
  project     Project       @relation(fields: [projectId], references: [id])
  phaseId     String?

  assetIds    String[]      // Array of asset IDs in this approval

  requestedById String
  message     String?
  dueDate     DateTime?
  status      ApprovalStatus @default(PENDING)

  reviewers   ApprovalReviewer[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum ApprovalStatus {
  PENDING
  APPROVED
  CHANGES_REQUESTED
  OVERDUE
}

model ApprovalReviewer {
  id          String        @id @default(cuid())
  approvalId  String
  approval    Approval      @relation(fields: [approvalId], references: [id])

  reviewerId  String
  status      ReviewerStatus @default(PENDING)
  feedbackText String?
  issueCategories Json?     // [colors, layout, typography, etc.]
  reviewedAt  DateTime?

  createdAt DateTime @default(now())

  @@unique([approvalId, reviewerId])
}

enum ReviewerStatus {
  PENDING
  APPROVED
  CHANGES_REQUESTED
}

model Comment {
  id          String   @id @default(cuid())
  projectId   String
  project     Project  @relation(fields: [projectId], references: [id])
  phaseId     String?
  assetId     String?
  parentId    String?  // For threading

  userId      String
  user        User     @relation(fields: [userId], references: [id])

  commentText String
  mentions    String[] // Array of user IDs

  isDeleted   Boolean  @default(false)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Notification {
  id          String           @id @default(cuid())
  userId      String
  user        User             @relation(fields: [userId], references: [id])

  eventType   NotificationEvent
  message     String
  linkUrl     String?
  projectId   String?

  isRead      Boolean          @default(false)

  createdAt DateTime @default(now())
}

enum NotificationEvent {
  APPROVAL_REQUESTED
  APPROVAL_APPROVED
  APPROVAL_CHANGES_REQUESTED
  COMMENT_MENTION
  PHASE_COMPLETED
  FILE_UPLOADED
  TEAM_ASSIGNED
}

model Activity {
  id          String       @id @default(cuid())
  projectId   String
  userId      String
  user        User         @relation(fields: [userId], references: [id])

  actionType  ActivityType
  actionDescription String
  metadata    Json?

  createdAt DateTime @default(now())
}

enum ActivityType {
  PROJECT_CREATED
  PHASE_STARTED
  PHASE_COMPLETED
  FILE_UPLOADED
  APPROVAL_SUBMITTED
  APPROVAL_DECIDED
  COMMENT_ADDED
  TEAM_MEMBER_ADDED
  TEAM_MEMBER_REMOVED
}

model Questionnaire {
  id          String                  @id @default(cuid())
  projectId   String                  @unique
  project     Project                 @relation(fields: [projectId], references: [id])

  status      QuestionnaireStatus     @default(IN_PROGRESS)
  startedAt   DateTime                @default(now())
  completedAt DateTime?
  submittedBy String?

  responses   QuestionnaireResponse[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum QuestionnaireStatus {
  IN_PROGRESS
  COMPLETED
}

model QuestionnaireResponse {
  id              String        @id @default(cuid())
  questionnaireId String
  questionnaire   Questionnaire @relation(fields: [questionnaireId], references: [id])

  questionNumber  Int
  questionText    String
  responseText    String?
  responseType    String        // text, multiselect, file

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([questionnaireId, questionNumber])
}

model ColorPalette {
  id          String   @id @default(cuid())
  projectId   String
  paletteName String
  isPrimary   Boolean  @default(false)
  colors      Json     // [{name, hex, rgb, usage, luminance}]

  createdAt DateTime @default(now())
}

model Tagline {
  id          String   @id @default(cuid())
  projectId   String
  taglineText String
  characterCount Int
  aiGenerated Boolean  @default(true)
  voteCount   Int      @default(0)
  isFinal     Boolean  @default(false)

  createdAt DateTime @default(now())
}
```

**Migrations:**
```bash
npx prisma init
npx prisma migrate dev --name init
npx prisma generate
```

### 1.3 Authentication Setup (NextAuth.js)

**File:** `/src/lib/auth.ts`

```typescript
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: "ADMIN" | "TEAM_MEMBER" | "CREATOR";
    } & DefaultSession["user"];
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/v2/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.isActive) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "TEAM_MEMBER" | "CREATOR";
      }
      return session;
    },
  },
});
```

### 1.4 Redis Setup (Job Queues)

**File:** `/src/lib/redis.ts`

```typescript
import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL!);

export const redisConnection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});
```

**File:** `/src/lib/queues.ts`

```typescript
import { Queue, Worker } from "bullmq";
import { redisConnection } from "./redis";

export const assetGenerationQueue = new Queue("asset-generation", {
  connection: redisConnection,
});

// Worker will be implemented in asset generation section
```

---

## Phase 2: Admin Portal Core (Week 2-3)

### 2.1 Update Navigation

**File:** `/src/navigation/sidebar/sidebar-items.ts`

```typescript
import {
  LayoutDashboard,
  FolderKanban,
  ImagePlus,
  CheckSquare,
  FileText,
  DollarSign,
  Bell,
  Users,
} from "lucide-react";

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Wavelaunch",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Projects",
        url: "/dashboard/projects",
        icon: FolderKanban,
      },
      {
        title: "Asset Generation",
        url: "/dashboard/asset-generation",
        icon: ImagePlus,
      },
      {
        title: "Approvals Queue",
        url: "/dashboard/approvals",
        icon: CheckSquare,
      },
      {
        title: "Files",
        url: "/dashboard/files",
        icon: FileText,
      },
    ],
  },
  {
    id: 2,
    label: "Management",
    items: [
      {
        title: "Team",
        url: "/dashboard/team",
        icon: Users,
      },
      {
        title: "Finance",
        url: "/dashboard/finance",
        icon: DollarSign,
      },
      {
        title: "Notifications",
        url: "/dashboard/notifications",
        icon: Bell,
      },
    ],
  },
];
```

### 2.2 Admin Dashboard

**File:** `/src/app/(main)/dashboard/page.tsx`

Replace default dashboard with Wavelaunch dashboard:

```typescript
import { HeroCard } from "./_components/hero-card";
import { MetricsRow } from "./_components/metrics-row";
import { ProjectsList } from "./_components/projects-list";
import { ApprovalsQueue } from "./_components/approvals-queue";
import { QuickActions } from "./_components/quick-actions";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section */}
        <div className="lg:col-span-8 space-y-6">
          <HeroCard />
          <MetricsRow />
          <QuickActions />
        </div>

        {/* Right Section */}
        <div className="lg:col-span-4 space-y-6">
          <ProjectsList />
          <ApprovalsQueue />
        </div>
      </div>
    </div>
  );
}
```

**Component:** `/src/app/(main)/dashboard/_components/hero-card.tsx`

```typescript
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function HeroCard() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">This Week at Wavelaunch</CardTitle>
            <CardDescription>Week of Nov 18-22, 2025</CardDescription>
          </div>
          <Badge variant="outline">3 priorities</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="h-2 w-2 rounded-full bg-orange-500 mt-2" />
          <div>
            <p className="font-medium">Luxe Beauty - Brand Discovery Due</p>
            <p className="text-sm text-muted-foreground">Creator questionnaire pending</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="h-2 w-2 rounded-full bg-teal-500 mt-2" />
          <div>
            <p className="font-medium">FitFlow - Manufacturing QC Review</p>
            <p className="text-sm text-muted-foreground">Sample photos uploaded</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="h-2 w-2 rounded-full bg-amber-500 mt-2" />
          <div>
            <p className="font-medium">GlowUp - Website Launch Friday</p>
            <p className="text-sm text-muted-foreground">Final testing in progress</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

**Component:** `/src/app/(main)/dashboard/_components/metrics-row.tsx`

```typescript
import { TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function MetricsRow() {
  const metrics = [
    {
      title: "Active Projects",
      value: "12",
      change: "+2 this month",
      trend: "up",
    },
    {
      title: "Pending Approvals",
      value: "8",
      change: "Requires attention",
      trend: "neutral",
    },
    {
      title: "Manufacturing Alerts",
      value: "3",
      change: "QC photos uploaded",
      trend: "up",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader>
            <CardDescription>{metric.title}</CardDescription>
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl font-semibold">{metric.value}</CardTitle>
              {metric.trend === "up" && (
                <Badge variant="outline">
                  <TrendingUp className="h-3 w-3" />
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{metric.change}</p>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
```

### 2.3 Projects List Page

**File:** `/src/app/(main)/dashboard/projects/page.tsx`

```typescript
import { ProjectsDataTable } from "./_components/projects-data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage all creator brand projects</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Project
        </Button>
      </div>

      <ProjectsDataTable />
    </div>
  );
}
```

Use the template's data-table components to build ProjectsDataTable with columns: Project Name, Creator, Category, Phase, Status, Lead, Last Updated, Actions.

### 2.4 Project Workspace

**File:** `/src/app/(main)/dashboard/projects/[id]/layout.tsx`

```typescript
import { ProjectHeader } from "./_components/project-header";
import { ProjectTabs } from "./_components/project-tabs";

export default function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <div className="space-y-6">
      <ProjectHeader projectId={params.id} />
      <ProjectTabs projectId={params.id} />
      <div className="mt-6">{children}</div>
    </div>
  );
}
```

**Component:** `/src/app/(main)/dashboard/projects/[id]/_components/project-header.tsx`

```typescript
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export function ProjectHeader({ projectId }: { projectId: string }) {
  // Fetch project data

  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Luxe Beauty</h1>
          <Badge>Branding</Badge>
        </div>
        <p className="text-muted-foreground mt-1">Creator: Sarah Johnson | Started: Oct 1, 2025</p>
      </div>
      <Button variant="ghost" size="icon">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

**Component:** `/src/app/(main)/dashboard/projects/[id]/_components/project-tabs.tsx`

```typescript
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

const tabs = [
  { label: "Overview", href: "" },
  { label: "Discovery", href: "/discovery" },
  { label: "Branding", href: "/branding" },
  { label: "Product Dev", href: "/product-dev" },
  { label: "Manufacturing", href: "/manufacturing" },
  { label: "Website", href: "/website" },
  { label: "Marketing", href: "/marketing" },
  { label: "Launch", href: "/launch" },
  { label: "Files", href: "/files" },
  { label: "Finance", href: "/finance" },
];

export function ProjectTabs({ projectId }: { projectId: string }) {
  return (
    <Tabs defaultValue="overview">
      <TabsList className="w-full justify-start overflow-x-auto">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.label} value={tab.label.toLowerCase()} asChild>
            <Link href={`/dashboard/projects/${projectId}${tab.href}`}>
              {tab.label}
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
```

---

## Phase 3: File Management (Week 3)

### 3.1 S3 Integration

**File:** `/src/lib/s3.ts`

```typescript
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function generatePresignedUploadUrl(
  key: string,
  fileType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    ContentType: fileType,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export async function generatePresignedDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 300 });
}
```

### 3.2 File Upload API

**File:** `/src/app/api/files/upload/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generatePresignedUploadUrl } from "@/lib/s3";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { filename, fileType, fileSize, projectId, folder } = await req.json();

  // Generate unique S3 key
  const s3Key = `projects/${projectId}/${folder}/${nanoid()}-${filename}`;

  // Generate pre-signed URL
  const uploadUrl = await generatePresignedUploadUrl(s3Key, fileType);

  // Create file record
  const file = await prisma.file.create({
    data: {
      filename,
      originalFilename: filename,
      fileType,
      fileSize,
      s3Key,
      s3Url: `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`,
      projectId,
      folder,
      uploadedById: session.user.id,
    },
  });

  return NextResponse.json({
    uploadUrl,
    fileId: file.id,
  });
}
```

### 3.3 File Upload Component

**File:** `/src/components/file-upload.tsx`

```typescript
"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  projectId: string;
  folder: string;
  onUploadComplete?: (file: any) => void;
}

export function FileUpload({ projectId, folder, onUploadComplete }: FileUploadProps) {
  const [uploads, setUploads] = useState<any[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const uploadId = Math.random().toString();

      setUploads((prev) => [
        ...prev,
        { id: uploadId, name: file.name, progress: 0, status: "uploading" },
      ]);

      try {
        // Get pre-signed URL
        const response = await fetch("/api/files/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: file.name,
            fileType: file.type,
            fileSize: file.size,
            projectId,
            folder,
          }),
        });

        const { uploadUrl, fileId } = await response.json();

        // Upload to S3
        await fetch(uploadUrl, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        setUploads((prev) =>
          prev.map((u) =>
            u.id === uploadId ? { ...u, progress: 100, status: "completed" } : u
          )
        );

        onUploadComplete?.({ id: fileId, name: file.name });
      } catch (error) {
        setUploads((prev) =>
          prev.map((u) => (u.id === uploadId ? { ...u, status: "error" } : u))
        );
      }
    }
  }, [projectId, folder, onUploadComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 500 * 1024 * 1024, // 500MB
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm font-medium">
          {isDragActive ? "Drop files here" : "Drag & drop files or click to browse"}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Supports PDF, JPG, PNG, MP4, AI, PSD up to 500MB
        </p>
      </div>

      {uploads.length > 0 && (
        <div className="mt-4 space-y-3">
          {uploads.map((upload) => (
            <div key={upload.id} className="flex items-center gap-3 p-3 border rounded-lg">
              <File className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{upload.name}</p>
                {upload.status === "uploading" && (
                  <Progress value={upload.progress} className="h-1 mt-2" />
                )}
                {upload.status === "completed" && (
                  <p className="text-xs text-green-600 mt-1">Upload complete</p>
                )}
                {upload.status === "error" && (
                  <p className="text-xs text-red-600 mt-1">Upload failed</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## Phase 4: Asset Generation Engine (Week 4-5)

### 4.1 Questionnaire System

**File:** `/src/app/(main)/dashboard/projects/[id]/discovery/page.tsx`

```typescript
import { QuestionnaireForm } from "./_components/questionnaire-form";
import { GenerateAssetsButton } from "./_components/generate-assets-button";

export default function DiscoveryPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Brand Discovery</h2>
        <p className="text-muted-foreground">Creator questionnaire and brand inputs</p>
      </div>

      <QuestionnaireForm projectId={params.id} />
      <GenerateAssetsButton projectId={params.id} />
    </div>
  );
}
```

**Component:** `/src/app/(main)/dashboard/projects/[id]/discovery/_components/questionnaire-form.tsx`

Use React Hook Form with Zod validation for 28-question form. Auto-save responses on debounce.

### 4.2 Asset Generation Worker

**File:** `/src/workers/asset-generation.worker.ts`

```typescript
import { Worker } from "bullmq";
import { redisConnection } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { generateLogos } from "@/lib/asset-generation/logos";
import { generateColorPalette } from "@/lib/asset-generation/palette";
import { generateTaglines } from "@/lib/asset-generation/taglines";

const worker = new Worker(
  "asset-generation",
  async (job) => {
    const { projectId, jobType, inputData } = job.data;

    try {
      await prisma.assetGeneration.update({
        where: { id: job.id },
        data: { status: "PROCESSING" },
      });

      let outputData;

      switch (jobType) {
        case "LOGO_GEN":
          outputData = await generateLogos(inputData);
          break;
        case "PALETTE_GEN":
          outputData = await generateColorPalette(inputData);
          break;
        case "TAGLINE_GEN":
          outputData = await generateTaglines(inputData);
          break;
        default:
          throw new Error(`Unknown job type: ${jobType}`);
      }

      await prisma.assetGeneration.update({
        where: { id: job.id },
        data: {
          status: "COMPLETED",
          outputData,
        },
      });

      return { success: true, outputData };
    } catch (error) {
      await prisma.assetGeneration.update({
        where: { id: job.id },
        data: {
          status: "FAILED",
          errorMessage: error.message,
        },
      });

      throw error;
    }
  },
  { connection: redisConnection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});
```

### 4.3 Logo Generation (nanobanana)

**File:** `/src/lib/asset-generation/logos.ts`

```typescript
import axios from "axios";

export async function generateLogos(inputData: any) {
  const { brandName, description, keywords, colors, inspirationImages } = inputData;

  const response = await axios.post(
    "https://api.nanobanana.ai/v1/generate-logos",
    {
      brand_name: brandName,
      description,
      keywords,
      colors,
      inspiration_image_urls: inspirationImages,
      variations: 5,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.NANOBANANA_API_KEY}`,
      },
    }
  );

  const logoUrls = response.data.logo_urls;

  // Download and upload to our S3
  const uploadedLogos = [];
  for (const url of logoUrls) {
    const logoResponse = await axios.get(url, { responseType: "arraybuffer" });
    const buffer = Buffer.from(logoResponse.data);

    // Upload to S3 logic here
    const s3Key = `logos/${brandName}-${Date.now()}.png`;
    // ... S3 upload

    uploadedLogos.push({ s3Key, url });
  }

  return { logos: uploadedLogos };
}
```

### 4.4 Tagline Generation (OpenAI)

**File:** `/src/lib/asset-generation/taglines.ts`

```typescript
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateTaglines(inputData: any) {
  const { brandName, description, personality, targetAudience, uniqueValue } = inputData;

  const prompt = `Generate 8 unique tagline options for a brand called "${brandName}".

Brand Description: ${description}
Brand Personality: ${personality}
Target Audience: ${targetAudience}
Unique Value: ${uniqueValue}

Requirements:
- Each tagline should be under 8 words
- Capture the brand essence
- Be memorable and impactful
- Vary in tone and style

Return only the 8 taglines, one per line, without numbering.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: "You are an expert brand copywriter specializing in taglines.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.8,
    max_tokens: 200,
  });

  const taglines = response.choices[0].message.content
    ?.split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => line.trim());

  return { taglines };
}
```

---

## Phase 5: Approval Workflows (Week 5-6)

### 5.1 Approval Submission

**File:** `/src/app/(main)/dashboard/projects/[id]/branding/_components/submit-for-approval-dialog.tsx`

```typescript
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";

const approvalSchema = z.object({
  message: z.string().optional(),
  dueDate: z.date().optional(),
});

export function SubmitForApprovalDialog({ assetIds, open, onOpenChange }) {
  const form = useForm({
    resolver: zodResolver(approvalSchema),
  });

  const onSubmit = async (data) => {
    await fetch("/api/approvals/submit", {
      method: "POST",
      body: JSON.stringify({
        assetIds,
        message: data.message,
        dueDate: data.dueDate,
      }),
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit for Approval</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add context for the creator..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit for Approval</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
```

### 5.2 Approvals Queue

**File:** `/src/app/(main)/dashboard/approvals/page.tsx`

```typescript
import { ApprovalsDataTable } from "./_components/approvals-data-table";

export default function ApprovalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Approvals Queue</h1>
        <p className="text-muted-foreground">Review pending creator approvals</p>
      </div>

      <ApprovalsDataTable />
    </div>
  );
}
```

Use template's DataTable component with columns: Asset, Project, Requested By, Status, Due Date, Actions.

---

## Phase 6: Client Portal (Week 6-7)

### 6.1 Client Portal Layout

**File:** `/src/app/(client)/layout.tsx`

```typescript
import { ClientSidebar } from "./_components/client-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <ClientSidebar />
      <SidebarInset>
        <div className="p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

### 6.2 Client Welcome Dashboard

**File:** `/src/app/(client)/dashboard/page.tsx`

```typescript
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ClientDashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, Sarah!</h1>
        <p className="text-muted-foreground">Your Luxe Beauty brand is in the Branding phase</p>
      </div>

      {/* Phase Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Project Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Phase progress visualization */}
          <div className="flex items-center gap-2">
            <Badge>M0: Complete</Badge>
            <Badge>M1: Complete</Badge>
            <Badge variant="default">M2: In Progress</Badge>
            <Badge variant="outline">M3: Upcoming</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Pending Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Review Logo Concepts</p>
                <p className="text-sm text-muted-foreground">3 logo variations ready</p>
              </div>
              <Button size="sm">Review</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat */}
      <Card>
        <CardHeader>
          <CardTitle>Message Your Team</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Chat interface */}
        </CardContent>
      </Card>
    </div>
  );
}
```

### 6.3 Client Approvals Page

**File:** `/src/app/(client)/approvals/page.tsx`

```typescript
import { ApprovalCard } from "./_components/approval-card";

export default function ClientApprovalsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Approvals</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Approval cards with previews */}
      </div>
    </div>
  );
}
```

---

## Phase 7: Communication & Notifications (Week 7-8)

### 7.1 Comment System

**File:** `/src/components/comments/comment-section.tsx`

```typescript
"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function CommentSection({ projectId }: { projectId: string }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const handlePostComment = async () => {
    await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({
        projectId,
        commentText: newComment,
      }),
    });

    setNewComment("");
    // Refresh comments
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src="/avatar.jpg" />
          <AvatarFallback>ME</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            placeholder="Add a comment... Use @ to mention"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button className="mt-2" onClick={handlePostComment}>
            Post Comment
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <Avatar>
              <AvatarImage src={comment.user.avatar} />
              <AvatarFallback>{comment.user.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{comment.user.name}</span>
                <span className="text-sm text-muted-foreground">{comment.timestamp}</span>
              </div>
              <p className="mt-1">{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 7.2 Notification System

**File:** `/src/components/notifications/notification-bell.tsx`

```typescript
"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export function NotificationBell() {
  const unreadCount = 5;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="p-2">
          <h3 className="font-semibold mb-2">Notifications</h3>
          {/* Notification items */}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

---

## Phase 8: Testing & Deployment (Week 8+)

### 8.1 Testing Strategy

1. **Unit Tests**: Prisma models, utility functions
2. **Integration Tests**: API endpoints, auth flows
3. **E2E Tests**: Critical user journeys (Playwright)
4. **Load Testing**: Asset generation queue handling

### 8.2 Deployment

**Docker Setup:**

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: wavelaunch
      POSTGRES_USER: wavelaunch
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  worker:
    build: .
    command: node dist/workers/asset-generation.worker.js
    env_file:
      - .env
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
```

---

## Development Workflow

### Daily Development Pattern

1. **Morning**: Review TodoWrite list, plan day's work
2. **Implementation**: Build feature using template patterns
3. **Testing**: Test feature locally with Prisma Studio
4. **Commit**: Commit to feature branch with clear message
5. **Review**: Update TodoWrite, mark completed tasks

### Code Organization

```
src/
├── app/
│   ├── (main)/          # Admin Portal routes
│   │   ├── dashboard/
│   │   │   ├── projects/
│   │   │   ├── approvals/
│   │   │   └── asset-generation/
│   │   └── auth/
│   └── (client)/        # Client Portal routes
│       ├── dashboard/
│       └── approvals/
├── components/
│   ├── ui/              # shadcn components
│   ├── file-upload.tsx
│   ├── comments/
│   └── notifications/
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   ├── redis.ts
│   ├── s3.ts
│   └── asset-generation/
├── workers/
│   └── asset-generation.worker.ts
└── types/
    └── ...
```

---

## Priority Matrix

### Must Have (P0) - MVP

- [ ] Authentication & RBAC
- [ ] Project CRUD & lifecycle management
- [ ] File upload & storage
- [ ] Basic asset generation (logos, taglines)
- [ ] Approval workflows
- [ ] Admin dashboard
- [ ] Client portal (basic)

### Should Have (P1) - Launch

- [ ] Comments & mentions
- [ ] Notifications (in-app + email)
- [ ] Activity tracking
- [ ] Advanced asset generation (palettes, templates)
- [ ] File versioning

### Nice to Have (P2) - Post-Launch

- [ ] Real-time updates (WebSocket)
- [ ] Advanced analytics
- [ ] Export features
- [ ] Mobile optimization

---

## Success Metrics

- **Technical**:
  - Page load < 2s
  - Asset generation < 60s
  - 99.5% uptime
  - 70%+ test coverage

- **Business**:
  - Support 10-20 concurrent projects
  - 80%+ first-approval rate for generated assets
  - Reduce project timeline by 25%

---

## Next Steps

1. ✅ Template exploration complete
2. 📝 Review and approve this plan
3. 🚀 Begin Phase 1: Foundation Setup
4. 📊 Set up project tracking (GitHub Projects/Linear)
5. 🔄 Weekly reviews and plan adjustments

---

*This plan will be updated as we progress through development.*
