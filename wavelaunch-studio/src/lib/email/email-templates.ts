/**
 * Email Templates
 *
 * HTML email templates for various notification types
 */

interface EmailTemplateProps {
  recipientName: string;
  actionUrl?: string;
  [key: string]: any;
}

const baseTemplate = (content: string, preheader?: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  ${preheader ? `<meta name="x-apple-disable-message-reformatting">
  <style type="text/css">
    /* Hide preheader text */
    .preheader { display: none !important; visibility: hidden; mso-hide: all; font-size: 1px; line-height: 1px; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; }
  </style>` : ''}
  <title>WaveLaunch Studio Notification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background-color: #f5f5f5;
      color: #1f2937;
      line-height: 1.6;
    }
    .email-wrapper {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .email-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 32px 24px;
      text-align: center;
    }
    .email-logo {
      color: #ffffff;
      font-size: 24px;
      font-weight: bold;
      margin: 0;
    }
    .email-body {
      padding: 32px 24px;
    }
    .email-footer {
      background-color: #f9fafb;
      padding: 24px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 16px 0;
    }
    .button:hover {
      opacity: 0.9;
    }
    h1 {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 16px 0;
      color: #111827;
    }
    h2 {
      font-size: 18px;
      font-weight: 600;
      margin: 24px 0 12px 0;
      color: #374151;
    }
    p {
      margin: 0 0 16px 0;
      color: #4b5563;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background-color: #e5e7eb;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      color: #374151;
    }
    .info-box {
      background-color: #f3f4f6;
      border-left: 4px solid #667eea;
      padding: 16px;
      margin: 16px 0;
      border-radius: 4px;
    }
    .divider {
      height: 1px;
      background-color: #e5e7eb;
      margin: 24px 0;
    }
  </style>
</head>
<body>
  ${preheader ? `<div class="preheader">${preheader}</div>` : ''}
  <div class="email-wrapper">
    <div class="email-header">
      <h1 class="email-logo">🌊 WaveLaunch Studio</h1>
    </div>
    <div class="email-body">
      ${content}
    </div>
    <div class="email-footer">
      <p>This is an automated notification from WaveLaunch Studio.</p>
      <p>© ${new Date().getFullYear()} WaveLaunch Studio. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

export const emailTemplates = {
  projectAssigned: ({
    recipientName,
    projectName,
    assignedBy,
    actionUrl,
  }: EmailTemplateProps) => {
    const content = `
      <h1>You've been assigned to a project! 🎯</h1>
      <p>Hi ${recipientName},</p>
      <p><strong>${assignedBy}</strong> has assigned you as the lead strategist for:</p>
      <div class="info-box">
        <h2>${projectName}</h2>
      </div>
      <p>You can now manage this project, track progress, and collaborate with the team.</p>
      ${actionUrl ? `<a href="${actionUrl}" class="button">View Project</a>` : ''}
      <div class="divider"></div>
      <p>Need help? Check out our documentation or contact support.</p>
    `;
    return baseTemplate(content, `You've been assigned to ${projectName}`);
  },

  approvalRequested: ({
    recipientName,
    projectName,
    requestedBy,
    message,
    dueDate,
    actionUrl,
  }: EmailTemplateProps) => {
    const content = `
      <h1>Approval Requested 📋</h1>
      <p>Hi ${recipientName},</p>
      <p><strong>${requestedBy}</strong> is requesting your approval for:</p>
      <div class="info-box">
        <h2>${projectName}</h2>
        ${message ? `<p>${message}</p>` : ''}
        ${dueDate ? `<p><strong>Due:</strong> ${new Date(dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>` : ''}
      </div>
      <p>Please review and provide your feedback.</p>
      ${actionUrl ? `<a href="${actionUrl}" class="button">Review Now</a>` : ''}
      <div class="divider"></div>
      <p>Your timely review helps keep projects on track!</p>
    `;
    return baseTemplate(content, `Approval requested for ${projectName}`);
  },

  approvalApproved: ({
    recipientName,
    projectName,
    approvedBy,
    feedback,
    actionUrl,
  }: EmailTemplateProps) => {
    const content = `
      <h1>Approval Approved ✅</h1>
      <p>Hi ${recipientName},</p>
      <p>Great news! <strong>${approvedBy}</strong> has approved your request for:</p>
      <div class="info-box">
        <h2>${projectName}</h2>
        ${feedback ? `<p><strong>Feedback:</strong> ${feedback}</p>` : ''}
      </div>
      <p>You can now proceed with the next steps.</p>
      ${actionUrl ? `<a href="${actionUrl}" class="button">View Project</a>` : ''}
      <div class="divider"></div>
      <p>Keep up the great work!</p>
    `;
    return baseTemplate(content, `Your approval for ${projectName} was approved`);
  },

  approvalChangesRequested: ({
    recipientName,
    projectName,
    reviewedBy,
    feedback,
    actionUrl,
  }: EmailTemplateProps) => {
    const content = `
      <h1>Changes Requested 🔄</h1>
      <p>Hi ${recipientName},</p>
      <p><strong>${reviewedBy}</strong> has requested changes for:</p>
      <div class="info-box">
        <h2>${projectName}</h2>
        ${feedback ? `<p><strong>Feedback:</strong> ${feedback}</p>` : ''}
      </div>
      <p>Please review the feedback and make the necessary updates.</p>
      ${actionUrl ? `<a href="${actionUrl}" class="button">View Feedback</a>` : ''}
      <div class="divider"></div>
      <p>Address the feedback to move forward with your project.</p>
    `;
    return baseTemplate(content, `Changes requested for ${projectName}`);
  },

  projectStatusChanged: ({
    recipientName,
    projectName,
    oldStatus,
    newStatus,
    changedBy,
    actionUrl,
  }: EmailTemplateProps) => {
    const content = `
      <h1>Project Status Updated 🔄</h1>
      <p>Hi ${recipientName},</p>
      <p><strong>${changedBy}</strong> has updated the status of:</p>
      <div class="info-box">
        <h2>${projectName}</h2>
        <p>
          <span class="badge">${oldStatus.replace('_', ' ')}</span>
          →
          <span class="badge">${newStatus.replace('_', ' ')}</span>
        </p>
      </div>
      <p>Check the project to see the latest updates.</p>
      ${actionUrl ? `<a href="${actionUrl}" class="button">View Project</a>` : ''}
    `;
    return baseTemplate(content, `${projectName} status changed to ${newStatus}`);
  },

  commentMentioned: ({
    recipientName,
    projectName,
    authorName,
    commentText,
    actionUrl,
  }: EmailTemplateProps) => {
    const content = `
      <h1>You were mentioned 💬</h1>
      <p>Hi ${recipientName},</p>
      <p><strong>${authorName}</strong> mentioned you in a comment on:</p>
      <div class="info-box">
        <h2>${projectName}</h2>
        <p>"${commentText.substring(0, 200)}${commentText.length > 200 ? '...' : ''}"</p>
      </div>
      ${actionUrl ? `<a href="${actionUrl}" class="button">View Comment</a>` : ''}
      <div class="divider"></div>
      <p>Click the button above to join the conversation.</p>
    `;
    return baseTemplate(content, `${authorName} mentioned you in ${projectName}`);
  },

  phaseCompleted: ({
    recipientName,
    projectName,
    phaseName,
    nextPhase,
    actionUrl,
  }: EmailTemplateProps) => {
    const content = `
      <h1>Phase Completed 🎉</h1>
      <p>Hi ${recipientName},</p>
      <p>Congratulations! The <strong>${phaseName}</strong> phase has been completed for:</p>
      <div class="info-box">
        <h2>${projectName}</h2>
        ${nextPhase ? `<p><strong>Next Phase:</strong> ${nextPhase}</p>` : ''}
      </div>
      <p>Great progress! Keep the momentum going.</p>
      ${actionUrl ? `<a href="${actionUrl}" class="button">View Project</a>` : ''}
    `;
    return baseTemplate(content, `${phaseName} completed for ${projectName}`);
  },

  projectLaunched: ({
    recipientName,
    projectName,
    launchDate,
    teamMembers,
    actionUrl,
  }: EmailTemplateProps) => {
    const content = `
      <h1>Project Launched! 🚀</h1>
      <p>Hi ${recipientName},</p>
      <p>Exciting news! <strong>${projectName}</strong> has officially launched!</p>
      <div class="info-box">
        <h2>${projectName}</h2>
        <p><strong>Launch Date:</strong> ${new Date(launchDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        ${teamMembers ? `<p><strong>Team Size:</strong> ${teamMembers} members</p>` : ''}
      </div>
      <p>Thank you for your hard work and dedication to make this launch successful!</p>
      ${actionUrl ? `<a href="${actionUrl}" class="button">View Project</a>` : ''}
      <div class="divider"></div>
      <p>🎊 Congratulations to the entire team!</p>
    `;
    return baseTemplate(content, `${projectName} has launched!`);
  },

  weeklyDigest: ({
    recipientName,
    projectsCount,
    approvalsCount,
    completedTasksCount,
    actionUrl,
  }: EmailTemplateProps) => {
    const content = `
      <h1>Your Weekly Digest 📊</h1>
      <p>Hi ${recipientName},</p>
      <p>Here's a summary of your activity this week:</p>
      <div class="info-box">
        <h2>This Week's Stats</h2>
        <p>📁 <strong>${projectsCount}</strong> active projects</p>
        <p>✅ <strong>${approvalsCount}</strong> approvals pending</p>
        <p>🎯 <strong>${completedTasksCount}</strong> tasks completed</p>
      </div>
      ${actionUrl ? `<a href="${actionUrl}" class="button">View Dashboard</a>` : ''}
      <div class="divider"></div>
      <p>Keep up the great work! 💪</p>
    `;
    return baseTemplate(content, 'Your weekly digest from WaveLaunch Studio');
  },

  emailVerification: ({
    recipientName,
    actionUrl,
    expiresIn,
  }: EmailTemplateProps) => {
    const content = `
      <h1>Verify Your Email Address ✉️</h1>
      <p>Hi ${recipientName},</p>
      <p>Welcome to WaveLaunch Studio! Please verify your email address to get started.</p>
      <div class="info-box">
        <p>Click the button below to verify your email address:</p>
      </div>
      ${actionUrl ? `<a href="${actionUrl}" class="button">Verify Email</a>` : ''}
      <div class="divider"></div>
      <p><strong>This link will expire in ${expiresIn || '24 hours'}.</strong></p>
      <p>If you didn't create an account with WaveLaunch Studio, you can safely ignore this email.</p>
    `;
    return baseTemplate(content, 'Verify your email address');
  },

  passwordReset: ({
    recipientName,
    actionUrl,
    expiresIn,
  }: EmailTemplateProps) => {
    const content = `
      <h1>Reset Your Password 🔐</h1>
      <p>Hi ${recipientName},</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      ${actionUrl ? `<a href="${actionUrl}" class="button">Reset Password</a>` : ''}
      <div class="divider"></div>
      <p><strong>This link will expire in ${expiresIn || '1 hour'}.</strong></p>
      <p>If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.</p>
      <div class="info-box">
        <p><strong>Security Tip:</strong> Never share your password with anyone. WaveLaunch Studio will never ask for your password via email.</p>
      </div>
    `;
    return baseTemplate(content, 'Reset your password');
  },

  passwordResetSuccess: ({
    recipientName,
    actionUrl,
  }: EmailTemplateProps) => {
    const content = `
      <h1>Password Changed Successfully ✅</h1>
      <p>Hi ${recipientName},</p>
      <p>Your password has been successfully changed.</p>
      <div class="info-box">
        <p>If you didn't make this change, please contact our support team immediately.</p>
      </div>
      ${actionUrl ? `<a href="${actionUrl}" class="button">Sign In</a>` : ''}
      <div class="divider"></div>
      <p>For your security, we recommend:</p>
      <ul>
        <li>Using a unique password for your WaveLaunch Studio account</li>
        <li>Enabling two-factor authentication in your security settings</li>
        <li>Never sharing your password with anyone</li>
      </ul>
    `;
    return baseTemplate(content, 'Password changed successfully');
  },

  welcomeEmail: ({
    recipientName,
    actionUrl,
  }: EmailTemplateProps) => {
    const content = `
      <h1>Welcome to WaveLaunch Studio! 🎉</h1>
      <p>Hi ${recipientName},</p>
      <p>Thank you for joining WaveLaunch Studio! We're excited to help you bring your brand to life.</p>
      <div class="info-box">
        <h2>Get Started</h2>
        <p>Here's what you can do next:</p>
        <ul>
          <li>📋 Complete your brand questionnaire</li>
          <li>🎨 Explore our design tools</li>
          <li>👥 Invite your team members</li>
          <li>📁 Upload your reference files</li>
        </ul>
      </div>
      ${actionUrl ? `<a href="${actionUrl}" class="button">Get Started</a>` : ''}
      <div class="divider"></div>
      <p>Need help? Our team is here to support you every step of the way.</p>
    `;
    return baseTemplate(content, 'Welcome to WaveLaunch Studio');
  },
};

export type EmailTemplateType = keyof typeof emailTemplates;
