// /lib/schema/email_verifications.ts
import { integer, text, sqliteTable, numeric } from 'drizzle-orm/sqlite-core';

export const emailVerifications = sqliteTable('email_verifications', {
  id: integer('id').primaryKey({ autoIncrement: true }), // bisa pakai UUID
  user_id: text('user_id').notNull(), // relasi ke users
  token: text('token').notNull(), // random token
  expires_at: numeric('expires_at' ).notNull(),
});
