# WaveLaunch Studio - Deployment Guide

This guide covers setting up and deploying WaveLaunch Studio with all critical features enabled.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Cloudinary account (for file uploads)
- Email service account (Resend, SendGrid, or SMTP)

## Setup Instructions

### 1. Environment Configuration

Copy the example environment file and configure your variables:

```bash
cp .env.example .env
```

Edit `.env` and configure the following required variables:

#### Database
```env
DATABASE_URL="postgresql://username:password@localhost:5432/wavelaunch_studio"
```

#### Authentication
```env
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"  # Change to your production URL
```

#### Email Service (Choose ONE)

**Option A: Resend (Recommended)**
```env
RESEND_API_KEY="re_xxxxxxxxxxxx"
EMAIL_FROM="notifications@yourdomain.com"
```

Get your API key at: https://resend.com/api-keys

**Option B: SendGrid**
```env
SENDGRID_API_KEY="SG.xxxxxxxxxxxx"
EMAIL_FROM="notifications@yourdomain.com"
```

**Option C: SMTP (Gmail, Outlook, etc.)**
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
EMAIL_FROM="your-email@gmail.com"
```

#### File Upload (Cloudinary)
```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="your-api-secret"
```

Get your credentials at: https://cloudinary.com/console

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

Run Prisma migrations to set up the database schema:

```bash
# Generate Prisma Client
npm run db:generate

# Apply migrations to database
npm run db:migrate

# Optional: Seed database with sample data
npm run db:seed
```

**Important:** If you encounter Prisma engine download errors, set this environment variable:
```bash
export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1
npm run db:generate
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. Build for Production

```bash
npm run build
npm start
```

## Critical Features Implemented

### ✅ File Upload System
- **Cloud Storage**: Cloudinary integration for reliable file hosting
- **File Validation**: Type and size validation (50MB max)
- **Thumbnail Generation**: Automatic thumbnails for images
- **Fallback Support**: Local storage fallback for development

**Supported File Types:**
- Images: JPEG, PNG, GIF, WebP, SVG
- Documents: PDF, Word (.doc, .docx), Excel (.xls, .xlsx)
- Videos: MP4, MOV, AVI

### ✅ Email Service Integration
- **Multiple Providers**: Resend, SendGrid, or SMTP
- **Email Templates**:
  - Password reset
  - Email verification
  - Welcome email
  - Project notifications
  - Approval requests
  - Weekly digest
  - And more...

### ✅ Password Reset Flow
1. User clicks "Forgot Password" on login page
2. Enters email address
3. Receives reset link via email (expires in 1 hour)
4. Creates new password
5. Confirmation email sent

**Routes:**
- `/auth/forgot-password` - Request reset link
- `/auth/reset-password?token=xxx` - Set new password

### ✅ Email Verification
1. User signs up with email/password
2. Receives verification email (expires in 24 hours)
3. Clicks verification link
4. Email marked as verified in database

**Routes:**
- `/api/auth/verify-email?token=xxx` - Verify email
- `/api/auth/resend-verification` - Resend verification email

### ✅ Enhanced Database Schema
**New User Fields:**
- `emailVerified` - Boolean flag for email verification status
- `emailVerificationToken` - Token for email verification
- `emailVerificationExpires` - Expiration timestamp
- `passwordResetToken` - Token for password reset
- `passwordResetExpires` - Expiration timestamp
- `companyName` - Optional company name for client users

**New Message Model:**
- Client-admin messaging system
- File attachments support
- Threading and read receipts
- Project-scoped conversations

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `GET /api/auth/verify-email?token=xxx` - Verify email
- `POST /api/auth/resend-verification` - Resend verification email

### File Upload
- `POST /api/upload` - Upload files to Cloudinary

## Testing

### Manual Testing Checklist

**1. User Registration**
- [ ] Register with valid email/password
- [ ] Receive welcome email
- [ ] Receive verification email
- [ ] Click verification link
- [ ] Login with verified account

**2. Password Reset**
- [ ] Click "Forgot Password" on login
- [ ] Enter email address
- [ ] Receive reset email
- [ ] Click reset link
- [ ] Set new password
- [ ] Login with new password
- [ ] Receive confirmation email

**3. File Upload**
- [ ] Upload image file
- [ ] Upload PDF document
- [ ] Upload video file
- [ ] Verify file appears in Cloudinary
- [ ] Verify thumbnail generated for images
- [ ] Verify file size validation (>50MB rejected)
- [ ] Verify file type validation

**4. Email Service**
- [ ] All emails deliver successfully
- [ ] Email templates render correctly
- [ ] Links in emails work
- [ ] Sender address correct

## Production Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

**Environment Variables to Set:**
- All variables from `.env.example`
- `DATABASE_URL` - Production database URL
- `NEXTAUTH_URL` - Production domain URL
- All email service credentials
- All Cloudinary credentials

### Database Migration in Production

```bash
npm run db:migrate:deploy
```

This command runs migrations without prompts, suitable for CI/CD.

### Health Checks

After deployment, verify:
- [ ] Application loads
- [ ] Database connection works
- [ ] File uploads work
- [ ] Emails send successfully
- [ ] Password reset works
- [ ] Email verification works

## Troubleshooting

### Prisma Client Not Generated
```bash
npm run db:generate
```

### Migration Failed
```bash
# Reset database (development only!)
npx prisma migrate reset

# Apply migrations
npm run db:migrate
```

### Emails Not Sending
1. Check email service credentials in `.env`
2. Verify `EMAIL_FROM` matches your verified domain
3. Check email service logs (Resend/SendGrid dashboard)
4. In development, emails are logged to console

### File Upload Failing
1. Verify Cloudinary credentials
2. Check file size (<50MB)
3. Verify file type is supported
4. Check Cloudinary usage limits

### Password Reset Link Expired
- Links expire after 1 hour
- User must request new reset link

### Email Verification Link Expired
- Links expire after 24 hours
- Use "Resend verification" feature

## Security Best Practices

1. **Never commit `.env` file** - It contains sensitive credentials
2. **Use strong NEXTAUTH_SECRET** - Generate with `openssl rand -base64 32`
3. **Enable HTTPS in production** - Required for secure authentication
4. **Rotate credentials regularly** - Change API keys periodically
5. **Use verified email domains** - Configure SPF/DKIM records
6. **Monitor failed login attempts** - Watch for brute force attacks

## Support

For issues or questions:
1. Check this deployment guide
2. Review error logs
3. Check database migration status
4. Verify environment variables

## Next Steps

After deployment, consider:
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure backup schedule for database
- [ ] Set up automated testing
- [ ] Configure CDN for static assets
- [ ] Enable two-factor authentication (future feature)
- [ ] Set up analytics

---

**Last Updated:** November 2024
**Version:** 1.0.0
