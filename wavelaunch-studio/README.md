# Wavelaunch Studio

**A platform for building influencer brands faster**

Wavelaunch Studio is a comprehensive project management and asset generation platform designed to streamline the creator brand development process from 24+ weeks to 16-20 weeks.

> **Built on:** [next-shadcn-admin-dashboard](https://github.com/arhamkhnz/next-shadcn-admin-dashboard)

## 🚀 Quick Start

### Prerequisites
- Node.js 20+ ([Download](https://nodejs.org))
- Git ([Download](https://git-scm.com))

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Set up database
npm run db:push

# 3. Seed with sample data
npm run db:seed

# 4. Start development server
npm run dev
```

### Access the App

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Login Credentials (Local Testing)

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@wavelaunch.com | password123456 |
| **Team Member** | team@wavelaunch.com | password123456 |
| **Designer** | designer@wavelaunch.com | password123456 |
| **Creator** | creator@wavelaunch.com | password123456 |

---

## 📖 Documentation

- **[Getting Started Guide](./GETTING_STARTED.md)** - Complete setup guide for non-technical users
- **[Implementation Plan](../IMPLEMENTATION_PLAN.md)** - Technical architecture and development roadmap
- **[PRD](../PRD.md)** - Product requirements document

---

## 🎯 Features

### Admin Portal
- **Dashboard**: Overview of active projects, approvals, and alerts
- **Project Management**: Track 8-phase brand development lifecycle (M0-M8)
- **Asset Generation**: AI-powered logo, palette, and tagline creation
- **Approval Workflows**: Multi-step approval process with feedback
- **File Management**: Version-controlled file uploads and organization
- **Team Collaboration**: Comments, mentions, and notifications

### Client Portal
- **Simplified Dashboard**: Creator-focused view of project progress
- **Approval Interface**: Easy review and approval of brand assets
- **Brand Assets Library**: Access to all approved logos, colors, and files
- **Upload Zone**: Drag-and-drop file uploads for references and content  

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **UI Components**: shadcn/ui (50+ components)
- **Database**: SQLite (local dev) / PostgreSQL (production)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **State Management**: Zustand, TanStack Query
- **Forms**: React Hook Form + Zod validation
- **File Storage**: AWS S3 (production only)
- **Asset Generation**: nanobanana API + OpenAI (production only)

---

## 🔧 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Database
```bash
npm run db:push      # Apply schema changes to database
npm run db:generate  # Generate Prisma Client
npm run db:studio    # Open Prisma Studio (database GUI)
npm run db:seed      # Populate database with sample data
```

---

## 🌐 Database GUI (Prisma Studio)

View and edit database records in your browser:

```bash
npm run db:studio
```

Opens at [http://localhost:5555](http://localhost:5555)

---

## 📦 Current Status

### ✅ Completed
- [x] Project foundation setup
- [x] Database schema design
- [x] Sample data generation
- [x] Authentication screens (v2)
- [x] Base layout and navigation
- [x] Comprehensive documentation

### 🚧 In Progress
- [ ] Admin dashboard home page
- [ ] Project management interface
- [ ] File upload system
- [ ] Asset generation engine

### 📅 Upcoming
- [ ] Approval workflows
- [ ] Client portal
- [ ] Notifications system
- [ ] Production deployment

---

## 📄 License

Private project - All rights reserved by Wavelaunch Studio

---

**Built with ❤️ by the Wavelaunch team**

*Last updated: November 20, 2025*
