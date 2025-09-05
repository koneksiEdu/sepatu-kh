import { sqliteTable, text, integer, numeric } from "drizzle-orm/sqlite-core";

export const pkkpr = sqliteTable("pkkpr", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  createdAt: numeric('created_at').notNull().default(new Date().toISOString()),
  type: text("type").notNull(),
  status: text("status").notNull(),
});
