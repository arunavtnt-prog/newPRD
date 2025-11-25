# 🚀 Wavelaunch Studio - Deployment Checklist

## ✅ Completed Steps

### Phase 1: Google Drive Setup ✓
- [x] Google Cloud Project created: `wavelaunch-studio`
- [x] Google Drive API enabled
- [x] Service Account created: `wavelaunch-storage@wavelaunch-studio.iam.gserviceaccount.com`
- [x] JSON key downloaded: `wavelaunch-studio-e19ef67cd690.json`
- [x] Google Drive folder created: `Wavelaunch Studio Files`
- [x] Folder ID: `18Pr4Q3SO4WwHWtoNLljsTBUbPU4qr1Rp`
- [x] Service account shared with Editor access

### Phase 2: Database Setup ✓
- [x] Supabase project created: `wavelaunch-production`
- [x] Connection string obtained
- [x] Database URL: `postgresql://postgres:***@db.etethpmdruhgsecuxjln.supabase.co:5432/postgres`

### Phase 3: Email Setup ✓
- [x] Gmail SMTP configured
- [x] App password generated: `nmxi xljq aode eujn`

### Phase 4: Environment Variables ✓
- [x] NEXTAUTH_SECRET generated: `AsA/b99H8qChVa41s+mkySfcQODdIAzf+RQtfOGH74U=`
- [x] Production env file created: `.env.production.local`
- [x] Vercel env file created: `.env.vercel`

---

## 📋 Next Steps - Deployment to Vercel

### Step 1: Extract Private Key from JSON File
1. Open the file: `wavelaunch-studio-e19ef67cd690.json`
2. Find the `"private_key"` field
3. Copy the entire value (including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)
4. **Keep the `\n` characters** - they are important!

### Step 2: Update Environment Files
1. Open `.env.vercel` file
2. Replace `PASTE_PRIVATE_KEY_HERE` with the private key from Step 1
3. Replace `your-email@gmail.com` with your actual Gmail address (2 places)

### Step 3: Push to GitHub
```bash
# Make sure .env files are in .gitignore (they should be)
git add -A
git commit -m "feat: Ready for production deployment"
git push origin main
```

### Step 4: Deploy to Vercel
1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "Add New" → "Project"
4. Import repository: `arunavtnt-prog/newPRD`
5. **⚠️ IMPORTANT Settings:**
   - **Root Directory**: `wavelaunch-studio` (not root!)
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### Step 5: Add Environment Variables in Vercel
1. In Vercel project settings, click "Environment Variables"
2. Open your `.env.vercel` file
3. For each variable, add:
   - **Key**: Variable name (e.g., `DATABASE_URL`)
   - **Value**: Variable value
   - **Environments**: Select ✅ Production, ✅ Preview, ✅ Development

**Variables to add:**
- [ ] `DATABASE_URL`
- [ ] `NEXTAUTH_SECRET`
- [ ] `NEXTAUTH_URL`
- [ ] `GOOGLE_DRIVE_CLIENT_EMAIL`
- [ ] `GOOGLE_DRIVE_FOLDER_ID`
- [ ] `GOOGLE_DRIVE_PRIVATE_KEY` (⚠️ with \n characters!)
- [ ] `SMTP_HOST`
- [ ] `SMTP_PORT`
- [ ] `SMTP_USER`
- [ ] `SMTP_PASSWORD`
- [ ] `SMTP_FROM`
- [ ] `NODE_ENV`

### Step 6: Deploy
1. Click "Deploy" button
2. Wait 2-3 minutes for build to complete
3. Vercel will provide a URL: `https://your-project.vercel.app`

### Step 7: Run Database Migrations
```bash
# Install Vercel CLI
npm i -g vercel

# Link to your Vercel project
vercel link

# Run migrations on production database
DATABASE_URL="postgresql://postgres:NmWpLcL9vV6OMqS4@db.etethpmdruhgsecuxjln.supabase.co:5432/postgres" npx prisma migrate deploy

# Optional: Seed the database
DATABASE_URL="postgresql://postgres:NmWpLcL9vV6OMqS4@db.etethpmdruhgsecuxjln.supabase.co:5432/postgres" npm run db:seed
```

### Step 8: Configure Custom Domain
1. In Vercel: Project → Settings → Domains
2. Add domain: `partners.wavelaunch.org`
3. Vercel will show DNS records to add
4. In your DNS provider (Cloudflare/Namecheap/etc.):
   ```
   Type: CNAME
   Name: partners
   Value: cname.vercel-dns.com
   ```
5. Wait 5-30 minutes for DNS propagation
6. SSL certificate will be automatically provisioned

### Step 9: Test Everything
- [ ] Visit: `https://partners.wavelaunch.org`
- [ ] Admin login: `/auth/v2/login`
- [ ] Client login: `/client/auth/login`
- [ ] Create test account
- [ ] Verify email received
- [ ] Upload test file
- [ ] Check file appears in Google Drive folder
- [ ] Test all major features

---

## 🔧 Troubleshooting

### Google Drive Upload Fails
- Verify private key has `\n` characters preserved
- Check service account has Editor access to folder
- Confirm folder ID is correct

### Database Connection Error
- Test connection: `psql "postgresql://postgres:NmWpLcL9vV6OMqS4@db.etethpmdruhgsecuxjln.supabase.co:5432/postgres"`
- Verify password is correct
- Check Supabase project is active

### Email Not Sending
- Verify Gmail 2FA is enabled
- Confirm app password is correct: `nmxi xljq aode eujn`
- Check SMTP settings are correct

---

## 📊 Monitoring

### Free Tier Limits
- **Vercel**: 100GB bandwidth/month
- **Supabase**: 500MB database
- **Google Drive**: 15GB storage
- **Gmail SMTP**: 500 emails/day

### Where to Monitor
- **Vercel**: Dashboard → Analytics
- **Supabase**: Dashboard → Database → Usage
- **Google Drive**: Drive → Storage
- **Email**: Gmail sent folder

---

## 🎯 Estimated Timeline
- Step 1-2: 5 minutes
- Step 3: 1 minute
- Step 4-6: 10 minutes
- Step 7: 5 minutes
- Step 8: 30 minutes (DNS propagation)
- Step 9: 15 minutes

**Total: ~1 hour**

---

## 💰 Total Cost
**$0/month** for at least 12-18 months! 🎉

---

## 📞 Need Help?
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Google Drive API: https://developers.google.com/drive
