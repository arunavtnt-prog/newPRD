# Wavelaunch Studio - Getting Started Guide

**For Product Managers & Non-Technical Users**

Welcome to Wavelaunch Studio! This guide will help you understand the project structure, how to run it locally, and what's been built.

---

## 📋 What is Wavelaunch Studio?

Wavelaunch Studio is a platform that helps your team build brands for influencers faster and more efficiently. It includes:

- **Admin Portal**: For your internal team to manage projects, generate brand assets, and track progress
- **Client Portal**: A simplified view for creators to review work, approve designs, and upload files
- **Automated Asset Generation**: AI-powered tools to create logos, color palettes, taglines, and more
- **Project Management**: Track 8-month brand development lifecycle from discovery to launch

---

## 🖥️ System Requirements

To run Wavelaunch Studio locally on your Mac or Windows computer, you need:

### Required Software

1. **Node.js** (version 20 or higher)
   - **Mac**: Download from [nodejs.org](https://nodejs.org) or use `brew install node`
   - **Windows**: Download installer from [nodejs.org](https://nodejs.org)
   - Test installation: Open Terminal/Command Prompt and type `node --version`

2. **Git** (for version control)
   - **Mac**: Usually pre-installed, or use `brew install git`
   - **Windows**: Download from [git-scm.com](https://git-scm.com)
   - Test installation: Type `git --version`

3. **Code Editor** (optional but recommended)
   - [Visual Studio Code](https://code.visualstudio.com) - Free and excellent for viewing code

---

## 🚀 Quick Start (Step-by-Step)

### Step 1: Open Terminal/Command Prompt

- **Mac**: Press `Cmd + Space`, type "Terminal", press Enter
- **Windows**: Press `Win + R`, type "cmd", press Enter

### Step 2: Navigate to Project Folder

```bash
cd path/to/wavelaunch-studio
```

### Step 3: Install Dependencies

This downloads all the required libraries and tools:

```bash
npm install
```

**What happens**: This reads `package.json` and downloads ~30 libraries that make the app work. Takes 2-5 minutes.

### Step 4: Set Up Database

We use PostgreSQL database. You have two options:

**Option A: Cloud Database (Easiest - No Installation)**
1. Sign up for free at [Neon](https://neon.tech) or [Supabase](https://supabase.com)
2. Create a new database project
3. Copy the connection string
4. Update `.env.local` file with your connection string

**Option B: Local PostgreSQL**
- **Mac**: `brew install postgresql@16 && brew services start postgresql@16`
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
- Create database: `createdb wavelaunch_studio`

Then push the schema:

```bash
npm run db:push
# or for production: npm run db:migrate
```

**What happens**: Creates database tables for Users, Projects, Files, etc.

See `POSTGRESQL_MIGRATION.md` for detailed setup instructions.

### Step 5: Add Sample Data (Optional)

To test the app with realistic data:

```bash
npm run db:seed
```

**What happens**: Creates:
- 3 sample users (Admin, Team Member, Creator)
- 2 sample projects (Luxe Beauty, FitFlow)
- Sample files and approvals

### Step 6: Start the Development Server

```bash
npm run dev
```

**What happens**:
- App starts running on your computer
- You'll see: `✓ Ready on http://localhost:3000`
- Keep this terminal window open!

### Step 7: Open in Browser

1. Open your web browser (Chrome, Firefox, Safari)
2. Go to: `http://localhost:3000`
3. You should see the Wavelaunch Studio login page

---

## 🔐 Login Credentials (Local Testing)

After running `npm run db:seed`, you can login with these accounts:

### Admin Account
- **Email**: `admin@wavelaunch.com`
- **Password**: `admin123456`
- **Access**: Full admin portal with all features

### Team Member Account
- **Email**: `team@wavelaunch.com`
- **Password**: `team123456`
- **Access**: Admin portal, can manage assigned projects

### Creator Account
- **Email**: `creator@wavelaunch.com`
- **Password**: `creator123456`
- **Access**: Client portal (simplified view)

---

## 📁 Project Structure (Simplified)

```
wavelaunch-studio/
│
├── src/                          # All application code
│   ├── app/                      # Pages and routes
│   │   ├── (main)/              # Admin Portal pages
│   │   │   ├── dashboard/       # Dashboard home
│   │   │   ├── projects/        # Project management
│   │   │   ├── approvals/       # Approval queue
│   │   │   └── auth/            # Login/Register (v2 only)
│   │   └── (client)/            # Client Portal pages
│   │       ├── dashboard/       # Creator dashboard
│   │       └── approvals/       # Creator approvals view
│   │
│   ├── components/              # Reusable UI pieces
│   │   └── ui/                  # Buttons, Cards, Forms, etc.
│   │
│   ├── lib/                     # Helper functions
│   │   ├── auth.ts             # Authentication logic
│   │   ├── db.ts               # Database connection
│   │   └── utils.ts            # Utility functions
│   │
│   └── navigation/              # Sidebar menus
│
├── prisma/                      # Database configuration
│   ├── schema.prisma           # Database structure definition
│   └── seed.ts                 # Sample data generator
│
├── public/                      # Static files (images, icons)
│
├── package.json                 # Dependencies list
└── .env.local                   # Environment variables (secrets)
```

---

## 🛠️ Common Commands

### Development

```bash
# Start the app locally
npm run dev

# Build for production
npm run build

# Run production build locally
npm run start
```

### Database

```bash
# View database in browser GUI
npm run db:studio

# Apply database changes
npm run db:push

# Generate TypeScript types
npm run db:generate

# Add sample data
npm run db:seed
```

### Code Quality

```bash
# Format code
npm run format

# Check for errors
npm run lint
```

---

## 🎨 Key Features (What's Built)

### ✅ Phase 1: Foundation (COMPLETE)

- [x] **Authentication System**
  - Login/Register with v2 design
  - Role-based access (Admin, Team Member, Creator)
  - Secure password hashing

- [x] **Database Structure**
  - Users, Projects, Phases
  - Files, Assets, Approvals
  - Comments, Notifications
  - SQLite for local dev (will switch to PostgreSQL for production)

- [x] **Admin Portal Layout**
  - Collapsible sidebar navigation
  - Theme switcher (light/dark mode)
  - Responsive design (desktop, tablet)

### 🚧 Phase 2: Core Features (IN PROGRESS)

- [ ] **Dashboard Home**
  - "This Week at Wavelaunch" hero card
  - Metrics: Active Projects, Pending Approvals, Alerts
  - Quick Actions: Start Discovery, Upload Files, Generate Assets
  - Project list with filters
  - Approvals queue

- [ ] **Project Management**
  - Create new projects
  - 8-phase lifecycle tracking (M0-M8)
  - Project workspace with tabs
  - Team assignment
  - Phase checklist

- [ ] **File Management**
  - Drag-and-drop file upload
  - File versioning
  - File organization (folders)
  - Preview and download

### 📅 Phase 3: Asset Generation (UPCOMING)

- [ ] Brand questionnaire (28 questions)
- [ ] Logo generation (nanobanana API)
- [ ] Color palette generator
- [ ] Tagline generation (AI)
- [ ] Social media templates

### 📅 Phase 4: Approvals & Client Portal (UPCOMING)

- [ ] Submit assets for approval
- [ ] Approval workflows
- [ ] Client portal dashboard
- [ ] Creator approval interface

---

## 🐛 Troubleshooting

### Port 3000 Already in Use

**Problem**: You see "Port 3000 is already in use"

**Solution**:
```bash
# Kill the process using port 3000
# Mac/Linux:
lsof -ti:3000 | xargs kill

# Windows:
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

Or use a different port:
```bash
PORT=3001 npm run dev
```

### Database Errors

**Problem**: "Cannot find module '@prisma/client'"

**Solution**:
```bash
npm run db:generate
```

**Problem**: Database schema changes not applying

**Solution**:
```bash
# Delete database and recreate
rm prisma/dev.db
npm run db:push
npm run db:seed
```

### npm install Fails

**Problem**: Errors during `npm install`

**Solution**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Viewing the Database

To see what's stored in your local database:

1. Run: `npm run db:studio`
2. Browser opens at `http://localhost:5555`
3. Browse tables: Users, Projects, Files, etc.
4. Edit data directly in the GUI
5. Press Ctrl+C in terminal to stop Prisma Studio

**Use Cases**:
- Check if users were created correctly
- See sample projects
- Verify file uploads
- Debug data issues

---

## 🔄 Development Workflow

### For Developers

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Make Changes**
   - Edit files in `src/` folder
   - Changes auto-reload in browser (Hot Module Replacement)

3. **View Changes**
   - Browser updates automatically
   - Check console for errors (F12)

4. **Database Changes**
   - Edit `prisma/schema.prisma`
   - Run `npm run db:push`
   - Run `npm run db:generate`

### For Product Managers

1. **Test Features**
   - Login with different user roles
   - Click through all pages
   - Try creating projects, uploading files
   - Report bugs with screenshots

2. **Give Feedback**
   - Note what's confusing
   - Suggest UI improvements
   - Request missing features

3. **Access Database**
   - Use `npm run db:studio` to see data
   - Verify features are saving correctly

---

## 🌐 When to Deploy (Production)

**Local Development** (Current Phase):
- SQLite database (single file)
- Runs on your computer only
- Perfect for testing and development
- No cost, no external services

**Production Deployment** (Later):
- PostgreSQL database (cloud-hosted)
- Deployed to Vercel/AWS
- Accessible from anywhere
- Requires environment setup

We'll deploy when:
- [x] All core features tested locally
- [x] No major bugs
- [x] PM approves for production
- [ ] Database credentials configured
- [ ] File storage (S3) configured
- [ ] API keys added (nanobanana, OpenAI)

---

## 📝 Environment Variables

The file `.env.local` stores sensitive configuration (not in git):

```env
# Database (local SQLite for now)
DATABASE_URL="file:./dev.db"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# File Storage (will add for production)
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=
# AWS_S3_BUCKET=
# AWS_REGION=

# External APIs (will add for production)
# NANOBANANA_API_KEY=
# OPENAI_API_KEY=
```

**For Local Development**: Only `DATABASE_URL`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` are needed.

**For Production**: All variables required (added before deployment).

---

## 🎯 Next Steps

1. **Get Familiar**
   - Login with sample accounts
   - Explore admin portal navigation
   - Try creating a project (when feature is ready)

2. **Provide Feedback**
   - Test on Mac and Windows
   - Report any bugs or confusing UI
   - Suggest improvements

3. **Approve Progress**
   - Review each completed feature
   - Sign off before moving to next phase

4. **Prepare for Production**
   - Get AWS credentials (for file storage)
   - Get nanobanana API key
   - Get OpenAI API key
   - Choose hosting provider

---

## 📞 Need Help?

### Common Questions

**Q: Can I test on my phone?**
A: Yes! While `npm run dev` is running, find your computer's IP address and visit `http://[YOUR_IP]:3000` on your phone (must be same WiFi network).

**Q: Will my data be lost when I close the terminal?**
A: No! Data is saved in `prisma/dev.db` file. Only lost if you delete this file.

**Q: How do I reset everything?**
A: Delete `prisma/dev.db`, then run `npm run db:push` and `npm run db:seed`.

**Q: Can two people test at the same time?**
A: Not on the same local instance. Each person needs to run `npm run dev` on their own computer.

**Q: Is this the final design?**
A: UI follows the template design system. We can customize colors, fonts, and layouts as needed.

---

## 🎓 Learning Resources

### For Non-Technical Users

- [What is a Database?](https://www.youtube.com/watch?v=Tk1t3WKK-ZY) (5 min video)
- [How Web Apps Work](https://www.youtube.com/watch?v=hJHvdBlSxug) (10 min video)
- [Understanding APIs](https://www.youtube.com/watch?v=s7wmiS2mSXY) (8 min video)

### For Technical Users

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

---

## ✅ Pre-Deployment Checklist

Before we deploy to production:

- [ ] All Phase 1 features tested and approved
- [ ] All Phase 2 features tested and approved
- [ ] Asset generation working (Phase 3)
- [ ] Client portal functional (Phase 4)
- [ ] No critical bugs
- [ ] Tested on Mac, Windows, and mobile browsers
- [ ] AWS credentials obtained
- [ ] API keys obtained (nanobanana, OpenAI)
- [ ] Production database configured (PostgreSQL)
- [ ] Environment variables configured
- [ ] Deployment platform chosen (Vercel/AWS)

---

**Last Updated**: November 20, 2025
**Version**: 1.0.0
**Status**: Local Development Phase
