/**
 * Database Seed Script
 *
 * This script populates the database with sample data for testing.
 * Run with: npm run db:seed
 */

import { PrismaClient, UserRole, ProjectCategory, ProjectStatus, PhaseStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.activity.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.approvalReviewer.deleteMany();
  await prisma.approval.deleteMany();
  await prisma.assetGeneration.deleteMany();
  await prisma.tagline.deleteMany();
  await prisma.colorPalette.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.questionnaireResponse.deleteMany();
  await prisma.questionnaire.deleteMany();
  await prisma.fileVersion.deleteMany();
  await prisma.file.deleteMany();
  await prisma.projectPhase.deleteMany();
  await prisma.projectUser.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // ========================================
  // CREATE USERS
  // ========================================
  console.log('👥 Creating users...');

  const passwordHash = await bcrypt.hash('password123456', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@wavelaunch.com',
      passwordHash,
      fullName: 'Alex Admin',
      role: UserRole.ADMIN,
      isActive: true,
      notifyEmailApprovals: true,
      notifyEmailMentions: true,
      notifyEmailUpdates: true,
    },
  });

  const teamUser1 = await prisma.user.create({
    data: {
      email: 'team@wavelaunch.com',
      passwordHash,
      fullName: 'Taylor Team',
      role: UserRole.TEAM_MEMBER,
      isActive: true,
    },
  });

  const teamUser2 = await prisma.user.create({
    data: {
      email: 'designer@wavelaunch.com',
      passwordHash,
      fullName: 'Dana Designer',
      role: UserRole.TEAM_MEMBER,
      isActive: true,
    },
  });

  const creatorUser = await prisma.user.create({
    data: {
      email: 'creator@wavelaunch.com',
      passwordHash,
      fullName: 'Sarah Creator',
      role: UserRole.CREATOR,
      isActive: true,
    },
  });

  console.log(`✅ Created ${4} users`);

  // ========================================
  // CREATE PROJECTS
  // ========================================
  console.log('📁 Creating projects...');

  const project1 = await prisma.project.create({
    data: {
      projectName: 'Luxe Beauty',
      creatorName: 'Sarah Johnson',
      category: ProjectCategory.BEAUTY,
      startDate: new Date('2025-10-01'),
      expectedLaunchDate: new Date('2026-06-01'),
      status: ProjectStatus.BRANDING,
      leadStrategistId: teamUser1.id,
    },
  });

  const project2 = await prisma.project.create({
    data: {
      projectName: 'FitFlow Athletics',
      creatorName: 'Marcus Fitness',
      category: ProjectCategory.FITNESS,
      startDate: new Date('2025-09-15'),
      expectedLaunchDate: new Date('2026-05-15'),
      status: ProjectStatus.PRODUCT_DEV,
      leadStrategistId: teamUser2.id,
    },
  });

  const project3 = await prisma.project.create({
    data: {
      projectName: 'GlowUp Skincare',
      creatorName: 'Emma Glow',
      category: ProjectCategory.BEAUTY,
      startDate: new Date('2025-11-01'),
      expectedLaunchDate: new Date('2026-07-01'),
      status: ProjectStatus.DISCOVERY,
      leadStrategistId: adminUser.id,
    },
  });

  console.log(`✅ Created ${3} projects`);

  // ========================================
  // CREATE PROJECT PHASES
  // ========================================
  console.log('📊 Creating project phases...');

  const phases = [
    { name: 'M0: Onboarding', order: 0 },
    { name: 'M1: Discovery', order: 1 },
    { name: 'M2: Branding', order: 2 },
    { name: 'M3: Product Dev', order: 3 },
    { name: 'M4: Manufacturing', order: 4 },
    { name: 'M5: Website', order: 5 },
    { name: 'M6: Marketing', order: 6 },
    { name: 'M7: Launch', order: 7 },
  ];

  for (const project of [project1, project2, project3]) {
    for (const phase of phases) {
      let status = PhaseStatus.NOT_STARTED;
      let startDate = null;
      let endDate = null;

      // Set phase status based on project status
      if (project.status === ProjectStatus.BRANDING) {
        if (phase.order < 2) {
          status = PhaseStatus.COMPLETED;
          startDate = new Date(project.startDate);
          endDate = new Date(project.startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        } else if (phase.order === 2) {
          status = PhaseStatus.IN_PROGRESS;
          startDate = new Date();
        }
      } else if (project.status === ProjectStatus.PRODUCT_DEV) {
        if (phase.order < 3) {
          status = PhaseStatus.COMPLETED;
          startDate = new Date(project.startDate);
          endDate = new Date(project.startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        } else if (phase.order === 3) {
          status = PhaseStatus.IN_PROGRESS;
          startDate = new Date();
        }
      } else if (project.status === ProjectStatus.DISCOVERY) {
        if (phase.order < 1) {
          status = PhaseStatus.COMPLETED;
          startDate = new Date(project.startDate);
          endDate = new Date(project.startDate.getTime() + 14 * 24 * 60 * 60 * 1000);
        } else if (phase.order === 1) {
          status = PhaseStatus.IN_PROGRESS;
          startDate = new Date();
        }
      }

      const checklistItems = JSON.stringify([
        { id: '1', title: 'Complete phase kickoff', required: true, completed: status === PhaseStatus.COMPLETED },
        { id: '2', title: 'Review deliverables', required: true, completed: status === PhaseStatus.COMPLETED },
        { id: '3', title: 'Get client approval', required: true, completed: status === PhaseStatus.COMPLETED },
      ]);

      await prisma.projectPhase.create({
        data: {
          projectId: project.id,
          phaseName: phase.name,
          phaseOrder: phase.order,
          status,
          startDate,
          endDate,
          checklistItems,
        },
      });
    }
  }

  console.log(`✅ Created project phases`);

  // ========================================
  // CREATE PROJECT TEAM ASSIGNMENTS
  // ========================================
  console.log('👥 Assigning team members to projects...');

  await prisma.projectUser.createMany({
    data: [
      { projectId: project1.id, userId: adminUser.id, role: 'OWNER' },
      { projectId: project1.id, userId: teamUser1.id, role: 'OWNER' },
      { projectId: project1.id, userId: teamUser2.id, role: 'EDITOR' },
      { projectId: project1.id, userId: creatorUser.id, role: 'VIEWER' },

      { projectId: project2.id, userId: adminUser.id, role: 'OWNER' },
      { projectId: project2.id, userId: teamUser2.id, role: 'OWNER' },
      { projectId: project2.id, userId: teamUser1.id, role: 'EDITOR' },

      { projectId: project3.id, userId: adminUser.id, role: 'OWNER' },
      { projectId: project3.id, userId: teamUser1.id, role: 'EDITOR' },
    ],
  });

  console.log(`✅ Created team assignments`);

  // ========================================
  // CREATE QUESTIONNAIRE
  // ========================================
  console.log('📋 Creating questionnaire...');

  const questionnaire = await prisma.questionnaire.create({
    data: {
      projectId: project1.id,
      status: 'COMPLETED',
      completedAt: new Date(),
      submittedBy: creatorUser.id,
    },
  });

  await prisma.questionnaireResponse.createMany({
    data: [
      {
        questionnaireId: questionnaire.id,
        questionNumber: 1,
        questionText: 'In one sentence, what is your brand about?',
        responseText: 'Luxe Beauty creates premium, clean beauty products for modern women who value quality and sustainability.',
        responseType: 'text',
      },
      {
        questionnaireId: questionnaire.id,
        questionNumber: 2,
        questionText: 'What problem does your brand solve for your audience?',
        responseText: 'We solve the problem of finding high-quality, sustainable beauty products that actually work.',
        responseType: 'text',
      },
      {
        questionnaireId: questionnaire.id,
        questionNumber: 12,
        questionText: 'What 3 adjectives describe your dream brand aesthetic?',
        responseText: 'Luxurious, Minimal, Sophisticated',
        responseType: 'text',
      },
    ],
  });

  console.log(`✅ Created questionnaire with responses`);

  // ========================================
  // CREATE COLOR PALETTES
  // ========================================
  console.log('🎨 Creating color palettes...');

  const palette = await prisma.colorPalette.create({
    data: {
      projectId: project1.id,
      paletteName: 'Primary Brand Palette',
      isPrimary: true,
      colors: JSON.stringify([
        { name: 'Soft Blush', hex: '#F2E5E5', rgb: 'rgb(242, 229, 229)', usage: 'backgrounds', luminance: 0.85 },
        { name: 'Rose Gold', hex: '#D4A59A', rgb: 'rgb(212, 165, 154)', usage: 'accents', luminance: 0.60 },
        { name: 'Deep Plum', hex: '#6B4C5C', rgb: 'rgb(107, 76, 92)', usage: 'text', luminance: 0.30 },
      ]),
    },
  });

  console.log(`✅ Created color palette`);

  // ========================================
  // CREATE TAGLINES
  // ========================================
  console.log('✍️ Creating taglines...');

  await prisma.tagline.createMany({
    data: [
      {
        projectId: project1.id,
        taglineText: 'Beauty That Cares',
        characterCount: 17,
        aiGenerated: true,
        voteCount: 5,
        isFinal: true,
      },
      {
        projectId: project1.id,
        taglineText: 'Luxe for the Modern Woman',
        characterCount: 26,
        aiGenerated: true,
        voteCount: 3,
        isFinal: false,
      },
      {
        projectId: project1.id,
        taglineText: 'Sustainable Elegance',
        characterCount: 21,
        aiGenerated: true,
        voteCount: 2,
        isFinal: false,
      },
    ],
  });

  console.log(`✅ Created taglines`);

  // ========================================
  // CREATE ASSETS
  // ========================================
  console.log('🎨 Creating assets...');

  const asset1 = await prisma.asset.create({
    data: {
      projectId: project1.id,
      assetName: 'Primary Logo',
      assetType: 'LOGO',
      metadata: JSON.stringify({ version: 1, dimensions: '1000x1000' }),
    },
  });

  const asset2 = await prisma.asset.create({
    data: {
      projectId: project1.id,
      assetName: 'Brand Color Palette',
      assetType: 'COLOR_PALETTE',
      metadata: JSON.stringify({ colors: 3 }),
    },
  });

  console.log(`✅ Created assets`);

  // ========================================
  // CREATE APPROVALS
  // ========================================
  console.log('✅ Creating approvals...');

  const approval = await prisma.approval.create({
    data: {
      projectId: project1.id,
      assetIds: JSON.stringify([asset1.id, asset2.id]),
      requestedById: teamUser1.id,
      message: 'Please review the logo concepts and color palette.',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'PENDING',
    },
  });

  await prisma.approvalReviewer.create({
    data: {
      approvalId: approval.id,
      reviewerId: creatorUser.id,
      status: 'PENDING',
    },
  });

  console.log(`✅ Created approval workflows`);

  // ========================================
  // CREATE COMMENTS
  // ========================================
  console.log('💬 Creating comments...');

  await prisma.comment.createMany({
    data: [
      {
        projectId: project1.id,
        userId: teamUser1.id,
        commentText: 'Great progress on the brand discovery phase! The questionnaire responses are very detailed.',
        mentions: JSON.stringify([]),
      },
      {
        projectId: project1.id,
        userId: teamUser2.id,
        commentText: 'I love the color palette direction. The rose gold adds a nice premium feel.',
        mentions: JSON.stringify([]),
      },
      {
        projectId: project2.id,
        userId: adminUser.id,
        commentText: 'We need to schedule a call to discuss the product specifications.',
        mentions: JSON.stringify([teamUser2.id]),
      },
    ],
  });

  console.log(`✅ Created comments`);

  // ========================================
  // CREATE NOTIFICATIONS
  // ========================================
  console.log('🔔 Creating notifications...');

  await prisma.notification.createMany({
    data: [
      {
        userId: creatorUser.id,
        eventType: 'APPROVAL_REQUESTED',
        message: 'You have a new approval request for Luxe Beauty',
        linkUrl: `/approvals/${approval.id}`,
        projectId: project1.id,
        isRead: false,
      },
      {
        userId: teamUser1.id,
        eventType: 'COMMENT_MENTION',
        message: 'Alex Admin mentioned you in a comment',
        linkUrl: `/projects/${project1.id}`,
        projectId: project1.id,
        isRead: false,
      },
      {
        userId: adminUser.id,
        eventType: 'PHASE_COMPLETED',
        message: 'Discovery phase completed for GlowUp Skincare',
        linkUrl: `/projects/${project3.id}`,
        projectId: project3.id,
        isRead: true,
      },
    ],
  });

  console.log(`✅ Created notifications`);

  // ========================================
  // CREATE ACTIVITIES
  // ========================================
  console.log('📝 Creating activity log...');

  await prisma.activity.createMany({
    data: [
      {
        projectId: project1.id,
        userId: teamUser1.id,
        actionType: 'PROJECT_CREATED',
        actionDescription: 'Created project Luxe Beauty',
        metadata: JSON.stringify({ category: 'BEAUTY' }),
      },
      {
        projectId: project1.id,
        userId: teamUser1.id,
        actionType: 'PHASE_STARTED',
        actionDescription: 'Started Branding phase',
        metadata: JSON.stringify({ phase: 'M2' }),
      },
      {
        projectId: project1.id,
        userId: teamUser2.id,
        actionType: 'APPROVAL_SUBMITTED',
        actionDescription: 'Submitted logo concepts for approval',
        metadata: JSON.stringify({ assetCount: 2 }),
      },
      {
        projectId: project2.id,
        userId: teamUser2.id,
        actionType: 'PROJECT_CREATED',
        actionDescription: 'Created project FitFlow Athletics',
        metadata: JSON.stringify({ category: 'FITNESS' }),
      },
    ],
  });

  console.log(`✅ Created activity log`);

  // ========================================
  // SUMMARY
  // ========================================
  console.log('\n✨ Database seeded successfully!\n');
  console.log('📊 Summary:');
  console.log(`   - Users: 4`);
  console.log(`   - Projects: 3`);
  console.log(`   - Project Phases: ${phases.length * 3}`);
  console.log(`   - Assets: 2`);
  console.log(`   - Approvals: 1`);
  console.log(`   - Comments: 3`);
  console.log(`   - Notifications: 3`);
  console.log(`   - Activities: 4\n`);

  console.log('🔐 Login Credentials:');
  console.log('   Admin:        admin@wavelaunch.com / password123456');
  console.log('   Team Member:  team@wavelaunch.com / password123456');
  console.log('   Designer:     designer@wavelaunch.com / password123456');
  console.log('   Creator:      creator@wavelaunch.com / password123456\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
