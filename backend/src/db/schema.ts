import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  bigint,
  jsonb,
  boolean,
  pgEnum,
  index,
  unique,
  real,
} from 'drizzle-orm/pg-core';

export const userRole = pgEnum('user_role', ['operator', 'client']);
export const engagementStatus = pgEnum('engagement_status', [
  'pending',
  'active',
  'paused',
  'ended',
]);
export const chunkKind = pgEnum('chunk_kind', ['video', 'audio', 'screenshot', 'events']);
export const chunkStatus = pgEnum('chunk_status', [
  'uploading',
  'finalized',
  'processing',
  'processed',
  'failed',
]);
export const sessionType = pgEnum('session_type', [
  'deep_work',
  'meeting',
  'communication',
  'admin',
  'break',
]);
export const eventType = pgEnum('event_type', [
  'input_summary',
  'app_focus',
  'url_change',
  'file_event',
  'tab_focus',
  'scroll',
  'form_interaction',
  'link_click',
]);
export const deletionStatus = pgEnum('deletion_status', [
  'requested',
  'in_progress',
  'completed',
  'failed',
]);

export const organizations = pgTable('organizations', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  // ARN of a per-org KMS key for server-side S3 encryption (spec §9).
  kmsKeyArn: text('kms_key_arn'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id').references(() => organizations.id),
    email: text('email').notNull(),
    passwordHash: text('password_hash').notNull(),
    role: userRole('role').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    emailUniq: unique('users_email_unique').on(t.email),
  })
);

export const engagements = pgTable('engagements', {
  id: uuid('id').primaryKey().defaultRandom(),
  clientId: uuid('client_id')
    .references(() => users.id)
    .notNull(),
  operatorId: uuid('operator_id')
    .references(() => users.id)
    .notNull(),
  status: engagementStatus('status').notNull().default('pending'),
  startsAt: timestamp('starts_at', { withTimezone: true }),
  endsAt: timestamp('ends_at', { withTimezone: true }),
  // Scheduled work hours window. Outside of this, the agent does not record (spec §5.2).
  workHours: jsonb('work_hours').$type<{
    tz: string;
    days: { day: number; start: string; end: string }[];
  }>(),
  appBlocklist: jsonb('app_blocklist').$type<string[]>().default([]),
  urlBlocklist: jsonb('url_blocklist').$type<string[]>().default([]),
  retentionDays: integer('retention_days').default(90),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const devices = pgTable('devices', {
  id: uuid('id').primaryKey().defaultRandom(),
  engagementId: uuid('engagement_id')
    .references(() => engagements.id)
    .notNull(),
  platform: text('platform').notNull(),
  agentVersion: text('agent_version'),
  hostname: text('hostname'),
  // Pre-shared secret hash used for device auth (separate from user JWTs).
  tokenHash: text('token_hash').notNull(),
  lastHeartbeatAt: timestamp('last_heartbeat_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const chunks = pgTable(
  'chunks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    engagementId: uuid('engagement_id')
      .references(() => engagements.id)
      .notNull(),
    deviceId: uuid('device_id').references(() => devices.id),
    kind: chunkKind('kind').notNull(),
    startTs: timestamp('start_ts', { withTimezone: true }).notNull(),
    endTs: timestamp('end_ts', { withTimezone: true }).notNull(),
    displayId: integer('display_id'),
    durationMs: integer('duration_ms'),
    sizeBytes: bigint('size_bytes', { mode: 'number' }),
    sha256: text('sha256'),
    storageKey: text('storage_key').notNull(),
    storageBucket: text('storage_bucket'),
    contentType: text('content_type'),
    status: chunkStatus('status').notNull().default('uploading'),
    isSilent: boolean('is_silent').default(false),
    uploadedAt: timestamp('uploaded_at', { withTimezone: true }),
    processedAt: timestamp('processed_at', { withTimezone: true }),
    processingError: text('processing_error'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    byEngagementTime: index('chunks_engagement_time_idx').on(t.engagementId, t.startTs),
    shaUniq: unique('chunks_sha_unique').on(t.engagementId, t.kind, t.sha256),
  })
);

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    engagementId: uuid('engagement_id')
      .references(() => engagements.id)
      .notNull(),
    startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
    endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
    type: sessionType('type').notNull(),
    focusScore: real('focus_score'),
    primaryApp: text('primary_app'),
    meta: jsonb('meta'),
  },
  (t) => ({
    byEngagementTime: index('sessions_engagement_time_idx').on(t.engagementId, t.startsAt),
  })
);

export const events = pgTable(
  'events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    engagementId: uuid('engagement_id')
      .references(() => engagements.id)
      .notNull(),
    deviceId: uuid('device_id').references(() => devices.id),
    ts: timestamp('ts', { withTimezone: true }).notNull(),
    type: eventType('type').notNull(),
    appName: text('app_name'),
    windowTitle: text('window_title'),
    url: text('url'),
    domain: text('domain'),
    payload: jsonb('payload'),
  },
  (t) => ({
    byEngagementTime: index('events_engagement_time_idx').on(t.engagementId, t.ts),
    byType: index('events_type_idx').on(t.engagementId, t.type, t.ts),
  })
);

export const transcripts = pgTable(
  'transcripts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    engagementId: uuid('engagement_id')
      .references(() => engagements.id)
      .notNull(),
    chunkId: uuid('chunk_id')
      .references(() => chunks.id)
      .notNull(),
    startTs: timestamp('start_ts', { withTimezone: true }).notNull(),
    endTs: timestamp('end_ts', { withTimezone: true }).notNull(),
    speaker: text('speaker'),
    text: text('text').notNull(),
    confidence: real('confidence'),
    language: text('language'),
  },
  (t) => ({
    byEngagementTime: index('transcripts_engagement_time_idx').on(t.engagementId, t.startTs),
    byChunk: index('transcripts_chunk_idx').on(t.chunkId),
  })
);

export const screenText = pgTable(
  'screen_text',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    engagementId: uuid('engagement_id')
      .references(() => engagements.id)
      .notNull(),
    chunkId: uuid('chunk_id')
      .references(() => chunks.id)
      .notNull(),
    ts: timestamp('ts', { withTimezone: true }).notNull(),
    region: jsonb('region').$type<{ x: number; y: number; w: number; h: number }>(),
    text: text('text').notNull(),
    confidence: real('confidence'),
  },
  (t) => ({
    byEngagementTime: index('screen_text_engagement_time_idx').on(t.engagementId, t.ts),
  })
);

export const meetings = pgTable('meetings', {
  id: uuid('id').primaryKey().defaultRandom(),
  engagementId: uuid('engagement_id')
    .references(() => engagements.id)
    .notNull(),
  startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
  endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
  title: text('title'),
  attendees: jsonb('attendees').$type<string[]>(),
  source: text('source'),
  externalId: text('external_id'),
  meta: jsonb('meta'),
});

export const applications = pgTable(
  'applications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    engagementId: uuid('engagement_id')
      .references(() => engagements.id)
      .notNull(),
    day: text('day').notNull(),
    appName: text('app_name').notNull(),
    category: text('category'),
    secondsActive: integer('seconds_active').notNull().default(0),
  },
  (t) => ({
    uniq: unique('applications_unique').on(t.engagementId, t.day, t.appName),
  })
);

export const categories = pgTable(
  'categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    engagementId: uuid('engagement_id')
      .references(() => engagements.id)
      .notNull(),
    day: text('day').notNull(),
    category: text('category').notNull(),
    secondsActive: integer('seconds_active').notNull().default(0),
  },
  (t) => ({
    uniq: unique('categories_unique').on(t.engagementId, t.day, t.category),
  })
);

export const flags = pgTable('flags', {
  id: uuid('id').primaryKey().defaultRandom(),
  engagementId: uuid('engagement_id')
    .references(() => engagements.id)
    .notNull(),
  kind: text('kind').notNull(),
  detectedAt: timestamp('detected_at', { withTimezone: true }).defaultNow().notNull(),
  payload: jsonb('payload'),
});

export const deletionRequests = pgTable('deletion_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  engagementId: uuid('engagement_id')
    .references(() => engagements.id)
    .notNull(),
  requestedBy: uuid('requested_by')
    .references(() => users.id)
    .notNull(),
  status: deletionStatus('status').notNull().default('requested'),
  dueAt: timestamp('due_at', { withTimezone: true }).notNull(),
  certificate: jsonb('certificate'),
  requestedAt: timestamp('requested_at', { withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});

export const heartbeats = pgTable(
  'heartbeats',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    deviceId: uuid('device_id')
      .references(() => devices.id)
      .notNull(),
    ts: timestamp('ts', { withTimezone: true }).defaultNow().notNull(),
    isRecording: boolean('is_recording').notNull().default(true),
    bufferBytes: bigint('buffer_bytes', { mode: 'number' }),
    pendingChunks: integer('pending_chunks'),
    agentVersion: text('agent_version'),
  },
  (t) => ({
    byDeviceTime: index('heartbeats_device_time_idx').on(t.deviceId, t.ts),
  })
);

export const dataAccessLog = pgTable(
  'data_access_log',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    actorId: uuid('actor_id')
      .references(() => users.id)
      .notNull(),
    engagementId: uuid('engagement_id').references(() => engagements.id),
    action: text('action').notNull(),
    resourceType: text('resource_type').notNull(),
    resourceId: text('resource_id'),
    justification: text('justification'),
    ts: timestamp('ts', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    byActorTime: index('data_access_actor_idx').on(t.actorId, t.ts),
  })
);
