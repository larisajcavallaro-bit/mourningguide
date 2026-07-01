import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as accountSchema from './schema/accounts';
import * as peopleSchema from './schema/people';
import * as vaultSchema from './schema/vault';
import * as billingSchema from './schema/billing';
import * as activationSchema from './schema/activation';
import * as adminSchema from './schema/admin';
import * as marketingSchema from './schema/marketing';

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, {
  schema: {
    ...accountSchema,
    ...peopleSchema,
    ...vaultSchema,
    ...billingSchema,
    ...activationSchema,
    ...adminSchema,
    ...marketingSchema,
  },
});

export * from './schema/accounts';
export * from './schema/people';
export * from './schema/vault';
export * from './schema/billing';
export * from './schema/activation';
export * from './schema/admin';
export * from './schema/marketing';
