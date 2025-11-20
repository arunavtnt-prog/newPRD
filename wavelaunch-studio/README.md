# Wavelaunch Studio

**A comprehensive platform for building influencer brands faster**

Wavelaunch Studio is an end-to-end project management and brand development platform designed to streamline the creator brand development process from 24+ weeks to 16-20 weeks. Built for influencers, creators, and brand managers to manage everything from brand identity to product launch in one unified workspace.

> **Built on:** [next-shadcn-admin-dashboard](https://github.com/arhamkhnz/next-shadcn-admin-dashboard)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js 20+** ([Download](https://nodejs.org))
- **PostgreSQL Database** (Local or Cloud)
- **Git** ([Download](https://git-scm.com))

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd wavelaunch-studio

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# 4. Set up PostgreSQL database
# Option A: Use cloud PostgreSQL (Neon, Supabase) - recommended
# Option B: Install PostgreSQL locally
# Update .env.local with your DATABASE_URL

# 5. Initialize database
npm run db:push
# or for production: npm run db:migrate

# 6. Seed with sample data
npm run db:seed

# 7. Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/wavelaunch"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32

# Optional: File Storage (S3)
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="wavelaunch-assets"

# Optional: AI Asset Generation
OPENAI_API_KEY="sk-your-openai-key"
NANOBANANA_API_KEY="your-nanobanana-key"
```

> **Note:** See [POSTGRESQL_MIGRATION.md](./POSTGRESQL_MIGRATION.md) for detailed database setup instructions.

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

## 🎯 Complete Feature List

Wavelaunch Studio implements a comprehensive 8-phase product lifecycle (M0-M8) with specialized workspaces for each phase:

### **M0: Project Foundation & Team Management**

#### Projects Module
- **Project Creation & Configuration**
  - Multi-step project wizard with brand details
  - Project type selection (Physical Product, Digital Product, Service, Hybrid)
  - Target market and timeline configuration
  - Budget tracking and allocation
- **Project Dashboard**
  - Phase progress tracking with completion percentages
  - Activity timeline and notifications
  - Quick access to all project assets
  - Team member overview

#### Teams & Collaboration
- **Team Management**
  - Role-based access control (Admin, Team Member, Designer, Creator)
  - Team member invitation and onboarding
  - Skill tagging and expertise tracking
  - Department organization
- **Activity System**
  - Real-time activity feed across all phases
  - Filterable by action type and team member
  - Detailed activity metadata and context
  - 50+ distinct action types tracked

---

### **M1: Typography System**

#### Font Management
- **Font Pairing Engine**
  - Primary and secondary font selection
  - Web-safe and Google Fonts integration
  - Font style variants (weights, italics)
  - Preview in multiple sizes and contexts
- **Typography Hierarchy**
  - Heading styles (H1-H6) configuration
  - Body text styles and line heights
  - Display and accent typography
  - Responsive typography scaling

#### Usage Guidelines
- **Typography Documentation**
  - Font usage rules and best practices
  - Character limits and spacing guidelines
  - Accessibility considerations
  - Export as PDF/CSS

---

### **M2: Brand Book**

#### Brand Identity
- **Logo Management**
  - Logo variant uploads (Primary, Secondary, Icon, Wordmark)
  - Clear space and minimum size specifications
  - Correct/incorrect usage examples
  - Format requirements and downloads
- **Color System**
  - Primary, secondary, and neutral palettes
  - Color psychology and usage notes
  - Accessibility compliance (WCAG)
  - Hex, RGB, CMYK color codes
  - Tint and shade variations

#### Brand Voice & Tone
- **Messaging Framework**
  - Brand voice definition and characteristics
  - Tone guidelines for different contexts
  - Key messaging pillars
  - Do's and don'ts examples
- **Taglines & Slogans**
  - Tagline generation and storage
  - Variation testing and approval
  - Usage context guidelines

#### Brand Guidelines Export
- **Document Generation**
  - PDF brand book export
  - Interactive web guidelines
  - Presentation-ready formats
  - Version control and updates

---

### **M3: Product Development**

#### Product Information Management
- **Product Details**
  - Product name and category
  - Detailed descriptions (short, long, marketing copy)
  - Feature lists and highlights
  - Target audience definition
- **Specifications**
  - Dimensions, weight, materials
  - Technical specifications
  - Compliance and certifications
  - Warranty information

#### SKU Management
- **Product Variants**
  - SKU creation and organization
  - Variant attributes (size, color, material, flavor)
  - Pricing per variant
  - Inventory planning
- **Cost Analysis**
  - Per-unit cost tracking
  - Margin calculations
  - Pricing strategy tools

#### Prototype Tracking
- **Sample Management**
  - Prototype version tracking (V1, V2, V3, etc.)
  - Sample types (First Sample, Revised Sample, Pre-Production, Production Run)
  - Order and receipt date tracking
  - Feedback and revision notes
- **Status Workflow**
  - ORDERED → IN_TRANSIT → RECEIVED → UNDER_REVIEW → APPROVED/REJECTED
  - Status update buttons with activity logging
  - Approval date tracking
  - Multiple iterations per SKU

---

### **M4: Packaging Design**

#### Packaging Components
- **Package Types**
  - Primary packaging (product container)
  - Secondary packaging (retail box/bag)
  - Tertiary packaging (shipping materials)
- **Design Specifications**
  - Dimensions and materials
  - Print specifications
  - Barcode and regulatory requirements
  - Unboxing experience design

#### Mockups & Approvals
- **Visual Mockups**
  - 3D renderings and flat layouts
  - Material samples
  - Print-ready files
- **Approval Workflow**
  - Multi-stakeholder review
  - Feedback collection
  - Revision tracking

---

### **M5: Asset Generation (AI-Powered)**

#### Logo Generation
- **AI Logo Designer**
  - Prompt-based logo generation
  - Multiple concept variations
  - Style customization (modern, vintage, minimal, etc.)
  - Iteration and refinement
- **Logo Formats**
  - Vector formats (SVG, AI, EPS)
  - Raster formats (PNG with transparency)
  - Social media variants
  - Favicon generation

#### Brand Asset Creation
- **Color Palette Generator**
  - AI-suggested color schemes
  - Psychology-based recommendations
  - Industry-specific palettes
  - Accessibility testing
- **Tagline Generator**
  - AI-powered tagline suggestions
  - Tone and style variations
  - A/B testing recommendations

---

### **M6: Manufacturing & Production**

#### Vendor Management
- **Vendor Database**
  - Vendor profiles and contact information
  - Specializations and capabilities
  - Rating and review system
  - Communication history
- **RFQ System**
  - Request for Quote creation
  - Multi-vendor quote comparison
  - Lead time tracking
  - Terms negotiation

#### Purchase Orders
- **PO Creation & Management**
  - Dynamic line item management
  - Add/remove items with real-time calculations
  - Vendor selection and terms
  - Expected ship and delivery dates
- **PO Line Items**
  - Product description and specifications
  - Quantity and unit pricing
  - SKU linking
  - Subtotal calculations per item
  - Total with shipping and tax
- **PO Status Workflow**
  - DRAFT → SENT → CONFIRMED → IN_PRODUCTION → READY_TO_SHIP → SHIPPED → DELIVERED
  - Status update buttons with automatic date stamping
  - Tracking number integration
  - Activity logging for each status change

#### Quality Control
- **QC Checkpoints**
  - Pre-production inspection
  - During production checks
  - Final inspection
  - Third-party QC integration
- **Defect Tracking**
  - Issue documentation
  - Severity classification
  - Resolution tracking

---

### **M7: Website Build & Content**

#### Website Page Management
- **Page Builder**
  - Page creation wizard (Home, About, Product, Collection, Contact, Blog, Custom)
  - Page metadata (title, slug, SEO)
  - Draft and published states
  - Page-level settings

#### Section Management (NEW)
- **Section Types**
  - 10 section types: Hero, Features, Product Grid, Testimonials, CTA, FAQ, About Story, Gallery, Contact Form, Custom HTML
  - Visual section icons
  - Section visibility controls
- **Section CRUD Operations**
  - Create new sections with type selection
  - Edit section name and type
  - Delete sections with confirmation
  - Real-time section count per page
- **Section Reordering**
  - Up/Down arrow controls
  - Visual drag handle indicators
  - Transaction-based order updates
  - Disabled buttons at list boundaries

#### Theme Selection
- **Shopify Theme Integration**
  - Theme recommendation engine
  - Industry-specific templates
  - Customization options
  - Theme installation

#### Content Management
- **Copywriting Assistant**
  - AI-powered content suggestions
  - SEO optimization
  - Tone and voice alignment
  - Character count tracking
- **Media Library**
  - Product photography management
  - Lifestyle imagery
  - Video content organization
  - Asset optimization

---

### **M8: Marketing & Launch**

#### Campaign Management (NEW)
- **Campaign Creation**
  - Campaign name and type (Product Launch, Brand Awareness, Lead Generation, Sales Promotion, Engagement, Retargeting)
  - Objective and budget setting
  - Start and end date scheduling
  - Campaign status workflow
- **Campaign Operations**
  - Full CRUD functionality (Create, Read, Update, Delete)
  - Pause/Resume campaign controls
  - Campaign editing with all fields
  - Cascade delete protection (prevents deletion with linked content/ads)
- **Campaign Metrics**
  - Impressions, clicks, conversions tracking
  - Spend monitoring
  - ROI calculations
  - Performance dashboard

#### Content Calendar
- **Post Scheduling**
  - Multi-platform post planning
  - Platform selection (Instagram, Facebook, TikTok, Twitter, LinkedIn, Pinterest, YouTube, Snapchat)
  - Post type (Image, Video, Carousel, Story, Reel)
  - Scheduled publish dates
- **Content Organization**
  - Campaign linking
  - Caption and hashtag management
  - Approval workflow
  - Status tracking (DRAFT, SCHEDULED, PUBLISHED, FAILED)

#### Ad Creative Manager
- **Ad Creation**
  - Platform-specific ad formats (Facebook, Instagram, Google, TikTok, Pinterest)
  - Format selection (Single Image, Carousel, Video, Collection, Stories, Reels)
  - Headline and primary text
  - Call-to-action configuration
  - A/B testing variants
- **Ad CRUD Operations (NEW)**
  - Create new ad creatives
  - Edit existing ads
  - Delete ads with confirmation
  - Status management (DRAFT, ACTIVE, PAUSED, COMPLETED)
- **Performance Tracking**
  - Impressions, clicks, conversions per ad
  - Cost per acquisition
  - Visual metrics dashboard

#### Influencer & Partnership Management (NEW)
- **Influencer Database**
  - Influencer profiles with platform details
  - Handle and contact information
  - Follower count and engagement rate tracking
  - Niche categorization
- **Influencer CRUD**
  - Add new influencers
  - Edit influencer details
  - Delete influencer records
  - Search and filter capabilities
- **Partnership Workflow**
  - Status progression: PROSPECTING → CONTACTED → NEGOTIATING → CONTRACTED → CONTENT_PENDING → POSTED → COMPLETED → DECLINED
  - Partnership type (Gifted Product, Paid Post, Affiliate, Brand Ambassador, Event Collaboration)
  - Rate negotiation tracking
  - Contract and deliverable management
- **UGC Management**
  - User-generated content collection
  - Content approval workflow
  - Rights and licensing tracking

#### Launch Checklist
- **Pre-Launch Tasks**
  - Website launch readiness
  - Inventory confirmation
  - Marketing materials prepared
  - Team training completed
- **Launch Day Tasks**
  - Go-live procedures
  - Monitoring dashboard
  - Emergency protocols
- **Post-Launch Tasks**
  - Performance review
  - Customer feedback collection
  - Iteration planning

---

### **Launch Dashboard**

#### Readiness Scoring
- **Comprehensive Score (0-100%)**
  - 12-item checklist across all phases
  - Real-time completion percentage
  - Visual progress indicators
  - Phase-by-phase breakdown

#### Launch Countdown
- **Timeline Management**
  - Days until launch counter
  - Target launch date configuration
  - Milestone tracking
  - Critical path visualization

#### Phase Completion Tracker
- **8-Phase Status**
  - M0: Foundation - Team setup and project initialization
  - M1: Typography - Font system configuration
  - M2: Brand Book - Logo and brand identity
  - M3: Product Development - SKUs and prototypes
  - M4: Packaging - Design and specifications
  - M5: Asset Generation - AI-powered brand assets
  - M6: Manufacturing - POs and production tracking
  - M7: Website - Pages and sections published
  - M8: Marketing - Campaigns and influencer partnerships

#### Metrics Dashboard
- **Key Performance Indicators**
  - Total campaigns active
  - Total marketing spend
  - Influencer partnerships
  - Content scheduled
  - Inventory status
  - Website visitors (if integrated)

#### Smart Launch Actions
- **Readiness-Based Recommendations**
  - 0-39%: Focus on foundation setup
  - 40-69%: Complete critical deliverables
  - 70-89%: Final preparations and testing
  - 90-100%: Ready to launch

---

## 📦 Additional Features

### File Management
- **Upload System**
  - Drag-and-drop file uploads
  - Multiple file format support
  - File categorization and tagging
  - Version control
- **File Organization**
  - Folder structure per phase
  - Search and filter capabilities
  - File permissions and sharing
  - Download and export options

### Notifications & Activity
- **Real-Time Notifications**
  - In-app notification center
  - Email notifications (configurable)
  - Push notifications (web)
  - Notification preferences
- **Activity Logging**
  - Comprehensive audit trail
  - 50+ tracked action types
  - User attribution
  - Timestamp and metadata

### Reports & Analytics
- **Project Reports**
  - Phase completion reports
  - Budget vs. actual spending
  - Timeline adherence
  - Team productivity metrics
- **Export Options**
  - PDF reports
  - CSV data exports
  - Custom report builder

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui (50+ components)
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand, TanStack Query
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js 20+
- **Database**: PostgreSQL 15+
- **ORM**: Prisma 5.x
- **Authentication**: NextAuth.js v5 (beta)
- **API**: Next.js API Routes (REST)

### Database Schema Highlights
- **20+ Core Models**: Projects, Teams, Activities, Fonts, Colors, Logos, Products, SKUs, Prototypes, Vendors, Purchase Orders, PO Line Items, Website Pages, Page Sections, Campaigns, Content Posts, Ad Creatives, Influencers, UGC Submissions, Launch Tasks
- **Relationships**: Complex relational structure with cascade deletes
- **Data Types**: Enums, Decimals, JSON fields, DateTime tracking

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Git Hooks**: Husky (optional)
- **Database GUI**: Prisma Studio

### Optional Integrations
- **File Storage**: AWS S3
- **AI Services**: OpenAI API, nanobanana API
- **Email**: SendGrid/Resend
- **Analytics**: PostHog, Google Analytics

---

## 🔧 Available Scripts

### Development
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript type checking
```

### Database Management
```bash
# Development
npm run db:push             # Apply schema changes (quick, no migrations)
npm run db:studio           # Open Prisma Studio GUI (http://localhost:5555)
npm run db:seed             # Populate with sample data

# Production
npm run db:migrate          # Create new migration
npm run db:migrate:deploy   # Deploy migrations to production
npm run db:generate         # Regenerate Prisma Client

# Utilities
npm run db:reset            # Reset database (WARNING: deletes all data)
npm run db:validate         # Validate Prisma schema
```

### Testing
```bash
npm run test              # Run all tests
npm run test:watch        # Run tests in watch mode
npm run test:coverage     # Generate coverage report
```

---

## 🌐 Database GUI (Prisma Studio)

View and edit database records in your browser:

```bash
npm run db:studio
```

Opens at [http://localhost:5555](http://localhost:5555)

**Features:**
- Visual data editor for all tables
- Relationship navigation
- Query builder
- Data filtering and sorting
- Record creation and deletion

---

## 📚 API Endpoints

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project details
- `PATCH /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Campaigns (M8)
- `POST /api/projects/[id]/campaigns` - Create campaign
- `GET /api/projects/[id]/campaigns` - List campaigns
- `PATCH /api/projects/[id]/campaigns/[campaignId]` - Update campaign
- `DELETE /api/projects/[id]/campaigns/[campaignId]` - Delete campaign

### Influencers (M8)
- `POST /api/projects/[id]/influencers` - Add influencer
- `GET /api/projects/[id]/influencers` - List influencers
- `PATCH /api/projects/[id]/influencers/[influencerId]` - Update influencer
- `DELETE /api/projects/[id]/influencers/[influencerId]` - Delete influencer

### Ad Creatives (M8)
- `POST /api/projects/[id]/ads` - Create ad
- `GET /api/projects/[id]/ads` - List ads
- `PATCH /api/projects/[id]/ads/[adId]` - Update ad
- `DELETE /api/projects/[id]/ads/[adId]` - Delete ad

### Purchase Orders (M6)
- `POST /api/projects/[id]/purchase-orders` - Create PO with line items
- `GET /api/projects/[id]/purchase-orders` - List POs
- `PATCH /api/projects/[id]/purchase-orders/[poId]/status` - Update PO status

### Website Pages (M7)
- `POST /api/projects/[id]/pages` - Create page
- `GET /api/projects/[id]/pages` - List pages
- `PATCH /api/projects/[id]/pages/[pageId]` - Update page
- `DELETE /api/projects/[id]/pages/[pageId]` - Delete page

### Page Sections (M7)
- `POST /api/projects/[id]/pages/[pageId]/sections` - Create section
- `PATCH /api/projects/[id]/pages/[pageId]/sections/[sectionId]` - Update section
- `DELETE /api/projects/[id]/pages/[pageId]/sections/[sectionId]` - Delete section
- `POST /api/projects/[id]/pages/[pageId]/sections/reorder` - Reorder sections

### Prototypes (M3)
- `POST /api/projects/[id]/skus/[skuId]/prototypes` - Create prototype
- `PATCH /api/projects/[id]/prototypes/[prototypeId]/status` - Update prototype status

*See full API documentation for complete endpoint list*

---

## 📖 Documentation

- **[Getting Started Guide](./GETTING_STARTED.md)** - Complete setup guide for non-technical users
- **[PostgreSQL Migration Guide](./POSTGRESQL_MIGRATION.md)** - Database setup and migration instructions
- **[Setup Checklist](./SETUP_CHECKLIST.md)** - Quick 5-10 minute setup guide
- **[Implementation Plan](../IMPLEMENTATION_PLAN.md)** - Technical architecture and development roadmap
- **[PRD](../PRD.md)** - Product requirements document

---

## 🚀 Deployment

### Prerequisites
- PostgreSQL database (Neon, Supabase, or self-hosted)
- Node.js hosting platform (Vercel, Railway, DigitalOcean)
- Environment variables configured

### Deployment Checklist
1. ✅ Set up production PostgreSQL database
2. ✅ Configure environment variables
3. ✅ Run database migrations (`npm run db:migrate:deploy`)
4. ✅ Build the application (`npm run build`)
5. ✅ Deploy to hosting platform
6. ✅ Test all critical workflows
7. ✅ Configure custom domain (optional)

### Recommended Platforms
- **Vercel**: Best for Next.js deployments (one-click deploy)
- **Railway**: Good for full-stack apps with PostgreSQL
- **DigitalOcean App Platform**: Flexible and cost-effective
- **AWS/GCP/Azure**: Enterprise-grade infrastructure

---

## 📦 Current Status

### ✅ Completed (100%)
- [x] **M0**: Project Foundation & Teams
- [x] **M1**: Typography System
- [x] **M2**: Brand Book (Logo, Colors, Voice)
- [x] **M3**: Product Development (Products, SKUs, Prototypes)
- [x] **M4**: Packaging Design
- [x] **M5**: Asset Generation (AI-Powered)
- [x] **M6**: Manufacturing (Vendors, POs, QC)
- [x] **M7**: Website Build (Pages, Sections with CRUD)
- [x] **M8**: Marketing & Launch (Campaigns, Influencers, Ads, Content)
- [x] **Launch Dashboard** (Readiness Scoring, Phase Tracking)
- [x] **API Endpoints** (All phases)
- [x] **Database Schema** (Complete with 20+ models)
- [x] **Authentication** (NextAuth v5)
- [x] **Activity Logging** (50+ action types)
- [x] **File Upload System**
- [x] **Comprehensive Documentation**

### 🎉 Recently Completed (November 2025)
- [x] Campaign Management CRUD
- [x] Influencer Partnership Tracking
- [x] Status Update Workflows (Prototypes, POs, Ads)
- [x] PO Line Items UI & Workflow
- [x] Section Edit/Delete/Reorder

### 📅 Potential Future Enhancements
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Email marketing integration
- [ ] Social media auto-posting
- [ ] E-commerce platform integration (Shopify, WooCommerce)
- [ ] Multi-language support
- [ ] White-label customization
- [ ] API webhooks

---

## 🤝 Contributing

This is a private project. If you're part of the Wavelaunch team and want to contribute:

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes following the code style
3. Test thoroughly
4. Commit with descriptive messages: `git commit -m "Add feature: description"`
5. Push to your branch: `git push origin feature/your-feature-name`
6. Create a Pull Request

---

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
```
Error: Can't reach database server
```
**Solution**: Check your `DATABASE_URL` in `.env.local` and ensure PostgreSQL is running.

**Prisma Client Out of Sync**
```
Error: Prisma Client is not up to date
```
**Solution**: Run `npm run db:generate` to regenerate Prisma Client.

**Port Already in Use**
```
Error: Port 3000 is already in use
```
**Solution**: Kill the process using port 3000 or change the port in `package.json`.

**Missing Environment Variables**
```
Error: NEXTAUTH_SECRET is required
```
**Solution**: Ensure all required environment variables are set in `.env.local`.

---

## 📧 Support

For technical support or questions:
- **Documentation**: Check the docs folder
- **Issues**: Report bugs on GitHub Issues
- **Team Chat**: Internal Slack/Discord channel

---

## 📄 License

Private project - All rights reserved by Wavelaunch Studio

---

**Built with ❤️ by the Wavelaunch team**

*Last updated: November 20, 2025*

**Current Version**: 1.0.0
**Commit**: `4a30c4c` - Complete 5 missing features
