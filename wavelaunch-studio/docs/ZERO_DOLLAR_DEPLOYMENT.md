# $0 Production Deployment Guide

**Complete guide to deploy WaveLaunch Studio with ZERO costs using free tiers**

## 📊 Your Scale & Free Tier Fit

| Resource | Your Usage | Free Tier Limit | Status |
|----------|-----------|-----------------|--------|
| Users | 3 admins + 10 clients = 13 users | Unlimited | ✅ Perfect |
| Applications | ~100/month | Unlimited | ✅ Perfect |
| File Storage | ~5GB/year | 15GB (Google Drive) | ✅ Perfect |
| Database | ~50-100MB | 500MB (Supabase) | ✅ Perfect |
| Emails | ~500/month | 3,000/month (Resend) | ✅ Perfect |
| Bandwidth | ~2-5GB/month | 100GB/month (Vercel) | ✅ Perfect |

**Total Monthly Cost: $0** 🎉

---

## Phase 1: Google Drive Setup (Free 15GB Storage)

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "Create Project"
3. Name: "WaveLaunch Studio"
4. Click "Create"

### Step 2: Enable Google Drive API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Drive API"
3. Click "Enable"

### Step 3: Create Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Name: "wavelaunch-storage"
4. Role: "Editor" (or "Storage Admin")
5. Click "Done"

### Step 4: Generate Service Account Key

1. Click on the service account you just created
2. Go to "Keys" tab
3. Click "Add Key" → "Create New Key"
4. Choose "JSON"
5. Download the JSON file (keep it safe!)

### Step 5: Create Google Drive Folder

1. Open [Google Drive](https://drive.google.com)
2. Create a new folder: "WaveLaunch Studio Files"
3. **Share with Service Account:**
   - Right-click folder → "Share"
   - Add the service account email (from JSON file: `client_email`)
   - Give "Editor" access
4. **Get Folder ID:**
   - Open the folder
   - Copy ID from URL: `https://drive.google.com/drive/folders/[FOLDER_ID_HERE]`

### Step 6: Extract Credentials from JSON

Open the downloaded JSON file and extract:

```json
{
  "type": "service_account",
  "project_id": "your-project",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "wavelaunch-storage@your-project.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

**You need:**
- `client_email`
- `private_key`
- Folder ID from Step 5

---

## Phase 2: Free Database Setup

### Option A: Supabase (Recommended - 500MB Free)

1. Go to [Supabase](https://supabase.com)
2. Sign up with GitHub
3. Click "New Project"
4. Name: "wavelaunch-production"
5. Database Password: Generate strong password
6. Region: Choose closest to your users
7. Click "Create Project" (takes 2-3 minutes)

**Get Connection String:**
```
Settings → Database → Connection String → URI

Format: postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

### Option B: Neon (512MB Free + Generous Limits)

1. Go to [Neon](https://neon.tech)
2. Sign up with GitHub
3. Create new project: "wavelaunch-production"
4. Copy connection string

### Option C: Railway ($5 Free Credit/Month)

1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. New Project → Provision PostgreSQL
4. Copy connection string

**Recommended: Supabase** (most generous free tier + 1GB file storage bonus)

---

## Phase 3: Free Email Setup

### Option A: Resend (Recommended - 3,000 emails/month free)

1. Go to [Resend](https://resend.com)
2. Sign up
3. Create API key
4. Verify your domain (optional, or use `onboarding@resend.dev` for testing)

### Option B: Gmail SMTP (Completely Free)

1. Enable 2FA on your Gmail account
2. Generate App Password: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Use these settings:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   SMTP_FROM=your-email@gmail.com
   ```

**Recommended: Resend** (more reliable for transactional emails)

---

## Phase 4: Environment Variables

Create `.env.production.local` (for reference only, DON'T commit):

```bash
# Database (Supabase/Neon/Railway)
DATABASE_URL="postgresql://postgres:password@host:5432/database"

# Authentication
NEXTAUTH_SECRET="[generate with: openssl rand -base64 32]"
NEXTAUTH_URL="https://partners.wavelaunch.org"

# Google Drive Storage (from JSON file)
GOOGLE_DRIVE_CLIENT_EMAIL="wavelaunch-storage@your-project.iam.gserviceaccount.com"
GOOGLE_DRIVE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID="your-folder-id-from-drive-url"

# Email (Resend OR Gmail SMTP)
RESEND_API_KEY="re_..."
# OR
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
SMTP_FROM="your-email@gmail.com"

# Optional
NODE_ENV="production"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

## Phase 5: Vercel Deployment (Free Tier)

### Step 1: Push to GitHub

```bash
git add -A
git commit -m "feat: Add Google Drive integration for $0 deployment"
git push origin main
```

### Step 2: Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub (free)
3. Click "Add New" → "Project"
4. Import `arunavtnt-prog/newPRD`
5. Configure:
   - **Framework:** Next.js (auto-detected)
   - **Root Directory:** `wavelaunch-studio` ⚠️ IMPORTANT
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### Step 3: Add Environment Variables

Click "Environment Variables" and add:

```bash
DATABASE_URL = [your-supabase-connection-string]
NEXTAUTH_SECRET = [your-generated-secret]
NEXTAUTH_URL = https://partners.wavelaunch.org
GOOGLE_DRIVE_CLIENT_EMAIL = [from-json-file]
GOOGLE_DRIVE_PRIVATE_KEY = [from-json-file-with-newlines]
GOOGLE_DRIVE_FOLDER_ID = [your-folder-id]
RESEND_API_KEY = [your-resend-key]
```

**Important for GOOGLE_DRIVE_PRIVATE_KEY:**
- Copy the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Keep the `\n` characters (they're important!)

Select: ✅ Production, ✅ Preview, ✅ Development

### Step 4: Deploy

Click "Deploy" and wait 2-3 minutes.

---

## Phase 6: Database Migration

After deployment succeeds:

```bash
# Install Vercel CLI
npm i -g vercel

# Link to project
vercel link

# Pull environment variables
vercel env pull .env.production

# Run migrations
DATABASE_URL="[your-production-db-url]" npx prisma migrate deploy

# Generate Prisma client (if needed)
npx prisma generate
```

**Or run in Vercel dashboard:**
1. Go to Deployments
2. Click latest deployment
3. Open "Functions" tab
4. Can run commands in serverless function if needed

---

## Phase 7: Domain Setup

### Step 1: Add Domain in Vercel

1. Go to Project → Settings → Domains
2. Add: `partners.wavelaunch.org`
3. Vercel shows DNS records to add

### Step 2: Configure DNS

**In your DNS provider (Cloudflare/Namecheap/etc.):**

Add CNAME record:
```
Type: CNAME
Name: partners
Value: cname.vercel-dns.com
```

**Or A record:**
```
Type: A
Name: partners
Value: 76.76.21.21
```

Wait 5-30 minutes for DNS propagation.

### Step 3: SSL

- Vercel automatically provisions SSL (free)
- Certificate from Let's Encrypt
- Auto-renewal

---

## Phase 8: Verification

### Test Checklist

```bash
# Homepage
✅ https://partners.wavelaunch.org

# Admin login
✅ https://partners.wavelaunch.org/auth/v2/login

# Client login
✅ https://partners.wavelaunch.org/client/auth/login

# Register test user
✅ Create account

# Email verification
✅ Check email inbox

# File upload
✅ Upload test file (goes to Google Drive)

# Check Google Drive
✅ File appears in folder

# Database
✅ Data persists

# All features working
✅ Projects, approvals, phases, etc.
```

---

## Free Tier Limits & Monitoring

### Vercel Free Tier
- ✅ 100GB bandwidth/month
- ✅ Unlimited deployments
- ✅ Automatic HTTPS
- ❌ No analytics included
- Monitor: Vercel Dashboard → Project → Analytics

### Supabase Free Tier
- ✅ 500MB database
- ✅ 1GB file storage (bonus)
- ✅ 50,000 monthly active users
- ❌ Database pauses after 1 week inactivity (auto-wakes)
- Monitor: Supabase Dashboard → Database Size

### Google Drive Free
- ✅ 15GB storage
- ✅ Unlimited API requests (with rate limits)
- ❌ Rate limit: 1,000 requests/100 seconds/user
- Monitor: Google Drive → Storage Usage

### Resend Free
- ✅ 3,000 emails/month
- ✅ 100 emails/day
- ❌ Must verify domain for higher limits
- Monitor: Resend Dashboard → Usage

---

## Cost Breakdown

| Service | Free Tier | Paid Tier (if needed) | When to Upgrade |
|---------|-----------|----------------------|-----------------|
| **Vercel** | 100GB/month | $20/month (1TB) | >100GB bandwidth |
| **Supabase** | 500MB DB | $25/month (8GB) | >500MB database |
| **Google Drive** | 15GB | $1.99/month (100GB) | >15GB storage |
| **Resend** | 3,000/month | $20/month (50k) | >3,000 emails |

**Your scale:** All free tiers sufficient for at least 12-18 months!

---

## Maintenance

### Weekly Tasks
- ✅ Check Vercel deployments
- ✅ Monitor Google Drive storage
- ✅ Review Supabase database size

### Monthly Tasks
- ✅ Check email quota (Resend dashboard)
- ✅ Review bandwidth usage (Vercel)
- ✅ Backup database (Supabase has auto-backups)

### Quarterly Tasks
- ✅ Review and clean old files in Google Drive
- ✅ Optimize database queries if needed
- ✅ Update dependencies (`npm update`)

---

## Troubleshooting

### Google Drive Upload Fails

**Check:**
```bash
# 1. Service account has access to folder
# 2. Private key format is correct (with \n)
# 3. Folder ID is correct

# Test in Node:
node -e "console.log(process.env.GOOGLE_DRIVE_PRIVATE_KEY)"
```

### Database Connection Issues

**Fix:**
```bash
# Test connection
psql "your-database-url"

# Format must be exactly:
postgresql://user:password@host:5432/database
```

### Email Not Sending

**Resend:**
```bash
# Verify domain ownership
# Check API key is valid
# Look at Resend logs
```

**Gmail SMTP:**
```bash
# Verify 2FA enabled
# Use App Password (not regular password)
# Check "Less secure app access" is OFF
```

---

## Scaling Path (When You Grow)

**Phase 1 (0-50 clients):** Free tier - $0/month ✅ YOU ARE HERE

**Phase 2 (50-200 clients):** Paid database + keep free hosting  
- Upgrade: Supabase Pro ($25/month)
- Total: $25/month

**Phase 3 (200-500 clients):** Add paid hosting  
- Vercel Pro: $20/month
- Supabase Pro: $25/month
- Total: $45/month

**Phase 4 (500+ clients):** Enterprise tier
- Custom pricing as needed

---

## Next Steps

1. ✅ Set up Google Drive API (15 mins)
2. ✅ Create Supabase database (5 mins)
3. ✅ Get Resend API key (2 mins)
4. ✅ Deploy to Vercel (5 mins)
5. ✅ Run migrations (2 mins)
6. ✅ Configure domain (10 mins)
7. ✅ Test everything (15 mins)

**Total setup time: ~1 hour**  
**Total cost: $0/month** 🎉

---

## Support Resources

- **Vercel:** https://vercel.com/docs
- **Supabase:** https://supabase.com/docs
- **Google Drive API:** https://developers.google.com/drive/api/v3/quickstart/nodejs
- **Resend:** https://resend.com/docs
- **Your docs:** See `docs/` folder in repo

**Questions? Check the docs or create an issue!**
