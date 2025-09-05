import { sqliteTable, text, integer, numeric } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').unique(),
  password: text('password'),
  role: text('role').default('guest'),
  name: text('name'),
  created_at: numeric('created_at'),
  description: text('desc'),
  is_verified: integer('is_verified').default(0),
});