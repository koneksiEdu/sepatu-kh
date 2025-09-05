// /lib/schema/password_resets.ts
import { sqliteTable, text, integer, numeric } from 'drizzle-orm/sqlite-core';

export const passwordResets = sqliteTable('password_resets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email', { length: 255 }).notNull(),
  token: text('token', { length: 255 }).notNull().unique(),
  expires_at: numeric('expires_at').notNull(),
  used: integer('used', { mode: 'boolean' }).notNull().default(false),
  created_at: numeric('created_at').notNull().default(new Date().toISOString()),
});

export type PasswordReset = typeof passwordResets.$inferSelect;
export type NewPasswordReset = typeof passwordResets.$inferInsert;