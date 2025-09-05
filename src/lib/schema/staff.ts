import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const staff = sqliteTable("staff", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  position: text("position"),
});
