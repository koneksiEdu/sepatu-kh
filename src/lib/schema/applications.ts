import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { pkkpr } from "./pkkpr";

export const applications = sqliteTable("applications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pkkprId: integer("pkkpr_id").notNull().references(() => pkkpr.id),
  name: text("name").notNull(),
  phone: text("phone"),
  actAs: text("act_as"),
  location: text("location"),
  landArea: real("land_area"),
  north: text("north"),
  south: text("south"),
  east: text("east"),
  west: text("west"),
});
