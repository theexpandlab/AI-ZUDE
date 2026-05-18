import 'dotenv/config';
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'postgres://capture:capture@localhost:5432/capture',
  },
  strict: true,
} satisfies Config;
