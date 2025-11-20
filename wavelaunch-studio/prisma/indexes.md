# Database Index Recommendations

## Overview

This document outlines recommended database indexes for optimal query performance in WaveLaunch Studio.

## Indexes to Add

### User Table

```prisma
model User {
  @@index([email])           // Fast email lookup for authentication
  @@index([role, isActive])  // Filter by role and active status
  @@index([createdAt])       // Sort by creation date
}
```

### Project Table

```prisma
model Project {
  @@index([status])                    // Filter by status
  @@index([leadStrategistId])          // Filter by lead strategist
  @@index([createdAt])                 // Sort by creation date
  @@index([updatedAt])                 // Sort by last update
  @@index([status, leadStrategistId])  // Composite for team projects
  @@index([category])                  // Filter by category
  @@fulltext([projectName, description]) // Full-text search
}
```

### Phase Table

```prisma
model Phase {
  @@index([projectId])              // Join with projects
  @@index([status])                 // Filter by status
  @@index([projectId, phaseOrder])  // Order phases within project
  @@index([dueDate])                // Filter by due date
}
```

### Approval Table

```prisma
model Approval {
  @@index([projectId])         // Join with projects
  @@index([requestedById])     // Filter by requester
  @@index([status])            // Filter by status
  @@index([dueDate])           // Filter by due date
  @@index([createdAt])         // Sort by creation
}
```

### ApprovalReviewer Table

```prisma
model ApprovalReviewer {
  @@index([approvalId])           // Join with approvals
  @@index([reviewerId])           // Filter by reviewer
  @@index([status])               // Filter by review status
  @@index([reviewerId, status])   // Composite for pending reviews
}
```

### Comment Table

```prisma
model Comment {
  @@index([projectId])        // Join with projects
  @@index([authorId])         // Filter by author
  @@index([createdAt])        // Sort by creation
  @@index([projectId, createdAt]) // Comments in project timeline
}
```

### File Table

```prisma
model File {
  @@index([projectId])        // Join with projects
  @@index([uploadedById])     // Filter by uploader
  @@index([fileType])         // Filter by type
  @@index([createdAt])        // Sort by upload date
}
```

### Notification Table

```prisma
model Notification {
  @@index([userId])                 // Filter by user
  @@index([isRead])                 // Filter by read status
  @@index([userId, isRead])         // Composite for unread notifications
  @@index([createdAt])              // Sort by creation
  @@index([userId, createdAt])      // User notifications timeline
}
```

### ActivityLog Table

```prisma
model ActivityLog {
  @@index([projectId])        // Filter by project
  @@index([userId])           // Filter by user
  @@index([entityType])       // Filter by entity type
  @@index([actionType])       // Filter by action type
  @@index([createdAt])        // Sort by date
  @@index([projectId, createdAt]) // Project activity timeline
}
```

## Query Optimization Tips

### 1. Use Select to Limit Fields

```typescript
// ❌ Bad - fetches all fields
const user = await prisma.user.findUnique({ where: { id } });

// ✅ Good - only fetches needed fields
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, fullName: true, email: true },
});
```

### 2. Use Include Wisely

```typescript
// ❌ Bad - fetches all related data
const project = await prisma.project.findUnique({
  where: { id },
  include: { phases: true, comments: true, files: true },
});

// ✅ Good - only includes what you need
const project = await prisma.project.findUnique({
  where: { id },
  include: {
    phases: {
      where: { status: "IN_PROGRESS" },
      take: 5,
    },
  },
});
```

### 3. Use Pagination

```typescript
// ❌ Bad - fetches all records
const projects = await prisma.project.findMany();

// ✅ Good - paginated
const projects = await prisma.project.findMany({
  take: 20,
  skip: (page - 1) * 20,
});
```

### 4. Use Cursor-Based Pagination for Large Datasets

```typescript
const projects = await prisma.project.findMany({
  take: 20,
  skip: 1,
  cursor: { id: lastProjectId },
  orderBy: { createdAt: "desc" },
});
```

### 5. Use Aggregations Efficiently

```typescript
// ❌ Bad - fetches all, counts in JS
const projects = await prisma.project.findMany();
const count = projects.length;

// ✅ Good - database-level count
const count = await prisma.project.count({
  where: { status: "ACTIVE" },
});
```

### 6. Batch Queries with findMany

```typescript
// ❌ Bad - N+1 query problem
for (const userId of userIds) {
  await prisma.user.findUnique({ where: { id: userId } });
}

// ✅ Good - single query
const users = await prisma.user.findMany({
  where: { id: { in: userIds } },
});
```

### 7. Use Transactions for Related Operations

```typescript
await prisma.$transaction([
  prisma.project.create({ data: projectData }),
  prisma.phase.createMany({ data: phasesData }),
  prisma.activityLog.create({ data: logData }),
]);
```

## Monitoring Query Performance

### Enable Query Logging

```typescript
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  log      = ["query", "info", "warn", "error"]
}
```

### Use Prisma Studio for Query Analysis

```bash
npx prisma studio
```

### Monitor Slow Queries

```typescript
// In production, log queries that take > 1s
prisma.$on("query", (e) => {
  if (e.duration > 1000) {
    console.warn("Slow query detected:", {
      query: e.query,
      duration: e.duration,
      params: e.params,
    });
  }
});
```

## Migration Commands

### Generate Migration

```bash
npx prisma migrate dev --name add_indexes
```

### Apply Migration

```bash
npx prisma migrate deploy
```

### Verify Indexes

```sql
-- PostgreSQL
SELECT
    tablename,
    indexname,
    indexdef
FROM
    pg_indexes
WHERE
    schemaname = 'public'
ORDER BY
    tablename,
    indexname;
```

## Performance Targets

- **Simple queries**: < 10ms
- **Complex joins**: < 100ms
- **Full-text search**: < 200ms
- **Aggregations**: < 500ms
- **Bulk operations**: < 2s

## Maintenance

### Analyze Tables (PostgreSQL)

```sql
ANALYZE VERBOSE your_table_name;
```

### Vacuum (PostgreSQL)

```sql
VACUUM ANALYZE your_table_name;
```

### Update Statistics

Run after significant data changes to update query planner statistics.

## Connection Pooling

### Recommended Settings

```env
# .env
DATABASE_URL="postgresql://user:password@localhost:5432/db?connection_limit=20&pool_timeout=20"
```

- **Connection limit**: 20-50 for most apps
- **Pool timeout**: 20 seconds
- **Use connection pooling** (PgBouncer for PostgreSQL)

## Caching Strategy

1. **Application-level cache**: Redis/Memcached
2. **Query result cache**: Prisma with TTL
3. **CDN cache**: Static assets
4. **Browser cache**: API responses

---

For more information:
- [Prisma Performance Guide](https://www.prisma.io/docs/guides/performance-and-optimization)
- [PostgreSQL Index Documentation](https://www.postgresql.org/docs/current/indexes.html)
