# Wavelaunch Studio - Setup Checklist

**Quick Start Guide for Testing Locally**

---

## ✅ Before You Start

Make sure you have installed:
- [ ] Node.js 20+ ([Download here](https://nodejs.org))
- [ ] Git ([Download here](https://git-scm.com))

---

## 📋 Setup Steps (5-10 minutes)

### Step 1: Open Terminal/Command Prompt

**Mac**: Press `Cmd + Space`, type "Terminal"
**Windows**: Press `Win + R`, type "cmd", press Enter

### Step 2: Navigate to Project

```bash
cd path/to/wavelaunch-studio
```

### Step 3: Install Dependencies

```bash
npm install
```

⏱️ **Wait**: This takes 2-5 minutes. You'll see a progress bar.

### Step 4: Set Up PostgreSQL Database

**Option A: Cloud Database (Recommended - No Installation)**
1. Sign up at [Neon](https://neon.tech) or [Supabase](https://supabase.com) (free tier)
2. Create a new project/database
3. Copy the connection string
4. Update `.env.local` with your DATABASE_URL

**Option B: Local PostgreSQL**
- Mac: `brew install postgresql@16 && brew services start postgresql@16`
- Windows: Install from [postgresql.org](https://www.postgresql.org/download/)
- Create DB: `createdb wavelaunch_studio`

Then initialize:

```bash
npm run db:push
# or: npm run db:migrate
```

✅ **Success**: You'll see "Your database is now in sync with your schema"

See `POSTGRESQL_MIGRATION.md` for detailed instructions.

### Step 5: Add Sample Data

```bash
npm run db:seed
```

✅ **Success**: You'll see login credentials printed

### Step 6: Start the App

```bash
npm run dev
```

✅ **Success**: You'll see "Ready on http://localhost:3000"

---

## 🌐 Test the App

### 1. Open Browser

Go to: **http://localhost:3000**

You should see the Wavelaunch Studio login page.

### 2. Login

Try these accounts:

| Email | Password | Role |
|-------|----------|------|
| admin@wavelaunch.com | password123456 | Admin |
| team@wavelaunch.com | password123456 | Team Member |
| designer@wavelaunch.com | password123456 | Designer |
| creator@wavelaunch.com | password123456 | Creator |

### 3. Explore

After login, you should see:
- ✅ Wavelaunch Studio branding
- ✅ Sidebar with menu items
- ✅ Dashboard (template version for now)
- ✅ Theme switcher (top right)
- ✅ User menu (top right)

---

## 🗄️ View Database (Optional)

To see what's stored in the database:

```bash
npm run db:studio
```

Opens at: **http://localhost:5555**

You can:
- Browse all tables
- See sample projects
- View user data
- Edit records

---

## 🐛 Troubleshooting

### "Port 3000 is already in use"

```bash
# Mac/Linux
lsof -ti:3000 | xargs kill

# Windows
netstat -ano | findstr :3000
taskkill /PID [number] /F
```

### "Cannot find module @prisma/client"

```bash
npm run db:generate
```

### "npm install fails"

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Reset Database

```bash
# Reset and recreate database
npx prisma migrate reset

# Or manually drop and recreate:
# dropdb wavelaunch_studio && createdb wavelaunch_studio
npm run db:push
npm run db:seed
```

---

## ✅ Success Checklist

Before reporting completion, verify:

- [ ] `npm install` completed without errors
- [ ] `npm run db:push` created database successfully
- [ ] `npm run db:seed` added sample data
- [ ] `npm run dev` starts without errors
- [ ] Login page loads at http://localhost:3000
- [ ] Can login with admin@wavelaunch.com
- [ ] See Wavelaunch Studio branding
- [ ] Sidebar shows correct menu items
- [ ] Can switch between light/dark themes

---

## 📞 Need Help?

See:
- [GETTING_STARTED.md](./GETTING_STARTED.md) - Comprehensive guide
- [PROGRESS_SUMMARY.md](./PROGRESS_SUMMARY.md) - What's been built
- [README.md](./README.md) - Quick reference

---

**Estimated Time**: 5-10 minutes
**Status**: ✅ Ready to test!
