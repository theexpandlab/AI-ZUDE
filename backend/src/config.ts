import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  LOG_LEVEL: z.string().default('info'),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 chars'),
  JWT_ACCESS_TTL: z.string().default('15m'),
  JWT_REFRESH_TTL: z.string().default('30d'),

  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),

  STORAGE_DRIVER: z.enum(['local', 's3']).default('local'),
  LOCAL_STORAGE_DIR: z.string().default('./var/storage'),
  LOCAL_STORAGE_BASE_URL: z.string().default('http://localhost:4000'),

  S3_REGION: z.string().default('us-east-1'),
  S3_BUCKET: z.string().default('capture-chunks'),
  S3_ENDPOINT: z.string().optional().or(z.literal('')),
  S3_FORCE_PATH_STYLE: z.coerce.boolean().default(true),
  S3_ACCESS_KEY_ID: z.string().optional().or(z.literal('')),
  S3_SECRET_ACCESS_KEY: z.string().optional().or(z.literal('')),
  S3_KMS_KEY_ID: z.string().optional().or(z.literal('')),

  OPENAI_API_KEY: z.string().optional().or(z.literal('')),
  WHISPER_MODEL: z.string().default('whisper-1'),

  RAW_RETENTION_DAYS: z.coerce.number().default(30),
  PROCESSED_RETENTION_DAYS: z.coerce.number().default(90),
  DELETION_SLA_HOURS: z.coerce.number().default(24),
});

export type Env = z.infer<typeof envSchema>;

export function loadConfig(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('Invalid environment configuration:');
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
  }
  return parsed.data;
}

export const config: Env = loadConfig();
