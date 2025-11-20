# Automation System Documentation

The WaveLaunch Studio automation system provides email notifications, automated workflows, and webhook integrations.

## 📧 Email System

### Overview

The email system supports multiple providers and includes pre-built templates for common notifications.

### Configuration

Set environment variables for your preferred email provider:

```bash
# Option 1: Resend (Recommended)
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=notifications@wavelaunchstudio.com

# Option 2: SendGrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
EMAIL_FROM=notifications@wavelaunchstudio.com

# Option 3: SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
SMTP_SECURE=false
EMAIL_FROM=notifications@wavelaunchstudio.com
```

### Sending Emails

```typescript
import { emailService } from "@/lib/email/email-service";

// Send template email
await emailService.sendTemplateEmail({
  to: "user@example.com",
  template: "projectAssigned",
  data: {
    recipientName: "John Doe",
    projectName: "New Brand Launch",
    assignedBy: "Jane Smith",
    actionUrl: "https://app.wavelaunchstudio.com/dashboard/projects/123",
  },
  subject: "You've been assigned to New Brand Launch",
});

// Send custom email
await emailService.sendEmail({
  to: ["user1@example.com", "user2@example.com"],
  subject: "Custom Notification",
  html: "<h1>Hello World</h1>",
  text: "Hello World",
});
```

### Available Templates

- `projectAssigned` - When a user is assigned to a project
- `approvalRequested` - When approval is requested
- `approvalApproved` - When approval is approved
- `approvalChangesRequested` - When changes are requested
- `projectStatusChanged` - When project status changes
- `commentMentioned` - When user is mentioned in a comment
- `phaseCompleted` - When a phase is completed
- `projectLaunched` - When a project launches
- `weeklyDigest` - Weekly activity summary

## 🔄 Workflow Automation

### Overview

Workflows allow you to automate actions based on triggers and conditions.

### Workflow Structure

```typescript
{
  name: "Welcome New Project",
  trigger: {
    type: "PROJECT_CREATED",
    conditions: [
      {
        field: "category",
        operator: "EQUALS",
        value: "BEAUTY"
      }
    ]
  },
  actions: [
    {
      type: "SEND_EMAIL",
      config: {
        template: "projectAssigned",
        to: "{{leadStrategist.email}}"
      }
    },
    {
      type: "SEND_NOTIFICATION",
      config: {
        type: "PROJECT_ASSIGNED",
        userId: "{{leadStrategist.id}}"
      },
      delay: 5 // Wait 5 minutes before executing
    }
  ]
}
```

### Trigger Types

- `PROJECT_CREATED` - New project created
- `PROJECT_STATUS_CHANGED` - Project status updated
- `PROJECT_ASSIGNED` - Lead strategist assigned
- `APPROVAL_REQUESTED` - Approval requested
- `APPROVAL_APPROVED` - Approval approved
- `APPROVAL_REJECTED` - Approval rejected
- `PHASE_COMPLETED` - Phase completed
- `COMMENT_ADDED` - Comment added
- `FILE_UPLOADED` - File uploaded
- `DUE_DATE_APPROACHING` - Due date approaching
- `SCHEDULE` - Time-based trigger
- `WEBHOOK` - External webhook trigger

### Action Types

- `SEND_EMAIL` - Send email notification
- `SEND_NOTIFICATION` - Create in-app notification
- `UPDATE_STATUS` - Update project status
- `ASSIGN_USER` - Assign user to project
- `CREATE_TASK` - Create a task
- `SEND_WEBHOOK` - Send webhook to external URL
- `UPDATE_FIELD` - Update a field value
- `ADD_COMMENT` - Add a comment

### Conditions

```typescript
{
  field: "status",
  operator: "EQUALS", // or "NOT_EQUALS", "CONTAINS", "IN", etc.
  value: "LAUNCH"
}
```

### Template Variables

Use template variables in action configs:

- `{{projectName}}` - Project name
- `{{leadStrategist.email}}` - Lead strategist email
- `{{leadStrategist.id}}` - Lead strategist ID
- `{{reviewers[].email}}` - Array of reviewer emails
- `{{status}}` - Current status
- Custom fields from trigger data

### Triggering Workflows

```typescript
import { triggerWorkflow } from "@/lib/automation/workflow-engine";

await triggerWorkflow(
  "PROJECT_CREATED",
  {
    projectId: "123",
    projectName: "New Brand Launch",
    leadStrategist: {
      id: "user-123",
      email: "john@example.com",
      name: "John Doe",
    },
  },
  currentUserId
);
```

## 🔗 Webhook System

### Overview

Webhooks allow external systems to receive real-time notifications about events in WaveLaunch Studio.

### Creating a Webhook

```typescript
POST /api/webhooks
{
  "url": "https://your-app.com/webhooks/wavelaunch",
  "events": ["project.created", "approval.approved"],
  "description": "Integration with CRM"
}

Response:
{
  "webhook": {
    "id": "webhook-123",
    "url": "https://your-app.com/webhooks/wavelaunch",
    "events": ["project.created", "approval.approved"],
    "secret": "whsec_xxxxxxxxxxxxx", // Use to verify signatures
    "enabled": true
  }
}
```

### Webhook Events

- `project.created` - New project created
- `project.updated` - Project updated
- `project.deleted` - Project deleted
- `project.status_changed` - Project status changed
- `approval.created` - Approval requested
- `approval.approved` - Approval approved
- `approval.rejected` - Approval rejected
- `comment.created` - Comment added
- `file.uploaded` - File uploaded
- `phase.completed` - Phase completed
- `user.created` - User created
- `user.updated` - User updated

### Webhook Payload

```json
{
  "id": "evt_xxxxxxxxxxxxx",
  "event": "project.created",
  "timestamp": "2025-01-20T10:30:00Z",
  "data": {
    "id": "project-123",
    "name": "New Brand Launch",
    "status": "DISCOVERY",
    "leadStrategistId": "user-123",
    "createdBy": "user-456"
  }
}
```

### Verifying Webhook Signatures

```typescript
import { verifyWebhookSignature } from "@/lib/webhooks/webhook-service";

// In your webhook handler
const payload = await request.text();
const signature = request.headers.get("X-Webhook-Signature");
const secret = "whsec_xxxxxxxxxxxxx"; // From webhook creation

const isValid = verifyWebhookSignature(payload, signature, secret);

if (!isValid) {
  return new Response("Invalid signature", { status: 401 });
}

// Process webhook...
```

### Webhook Retries

Failed webhooks are automatically retried:
- 1st retry: After 1 minute
- 2nd retry: After 5 minutes
- 3rd retry: After 15 minutes
- After 3 failures, webhook delivery stops

### Managing Webhooks

```typescript
// List webhooks
GET /api/webhooks

// Get webhook details
GET /api/webhooks/{id}

// Update webhook
PATCH /api/webhooks/{id}
{
  "enabled": false,
  "events": ["project.created"]
}

// Delete webhook
DELETE /api/webhooks/{id}
```

## 🎯 Integration Examples

### Example 1: Project Assignment Flow

```typescript
import { onProjectAssigned } from "@/lib/integrations/automation-integration";

// When assigning a lead strategist
await onProjectAssigned(
  projectId,
  projectName,
  leadStrategistId,
  leadStrategistEmail,
  leadStrategistName,
  currentUserId,
  currentUserName
);
```

This will:
1. Send email to lead strategist
2. Create in-app notification
3. Log activity
4. Trigger workflows
5. Send webhooks

### Example 2: Approval Request Flow

```typescript
import { onApprovalRequested } from "@/lib/integrations/automation-integration";

await onApprovalRequested(
  approvalId,
  projectId,
  projectName,
  requestedById,
  requestedByName,
  reviewers, // Array of { id, email, name }
  message,
  dueDate
);
```

This will:
1. Send email to all reviewers
2. Create in-app notifications
3. Log activity
4. Trigger workflows
5. Send webhooks

## 🚀 Development Mode

In development (without email provider configured):
- Emails are logged to console
- Workflows execute normally
- Webhooks are sent if endpoints exist

## 🔒 Security

### Email Security
- All emails use secure SMTP connections
- API keys are stored in environment variables
- Rate limiting prevents spam

### Webhook Security
- HMAC SHA-256 signatures for verification
- Unique secret per endpoint
- Timestamp validation prevents replay attacks
- TLS required for webhook URLs

### Workflow Security
- Workflows are user-scoped
- Admin approval required for system-wide workflows
- Template variables are sanitized

## 📊 Monitoring

### Email Delivery
- Logs include send status and errors
- Future: Email delivery dashboard

### Workflow Execution
- Execution logs stored in database
- Track success/failure per action
- Future: Workflow analytics

### Webhook Deliveries
- Delivery logs include status codes
- Retry tracking
- Future: Webhook delivery dashboard

## 🛠️ Troubleshooting

### Emails Not Sending

1. Check environment variables are set
2. Verify API keys are valid
3. Check logs for error messages
4. Test email provider connection

### Workflows Not Triggering

1. Verify workflow is enabled
2. Check trigger conditions match
3. Review execution logs
4. Ensure user has permissions

### Webhooks Failing

1. Verify endpoint URL is accessible
2. Check webhook signature verification
3. Review webhook delivery logs
4. Test endpoint with manual request

## 📝 Best Practices

1. **Email Templates**: Customize templates for your brand
2. **Workflow Testing**: Test workflows in development first
3. **Webhook Reliability**: Implement idempotent webhook handlers
4. **Error Handling**: Always handle automation errors gracefully
5. **Monitoring**: Set up alerts for automation failures
6. **Rate Limiting**: Implement rate limiting for high-volume workflows

## 🔜 Future Enhancements

- Visual workflow builder UI
- Workflow templates marketplace
- Advanced scheduling (cron expressions)
- Workflow versioning
- A/B testing for email templates
- Webhook delivery analytics dashboard
- Workflow performance metrics
- Integration with third-party automation tools (Zapier, Make.com)
