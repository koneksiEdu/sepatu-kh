import { sqliteTable, integer, real, text } from "drizzle-orm/sqlite-core";
import { pkkpr } from "./pkkpr";

export const fieldVerifications = sqliteTable("field_verifications", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  pkkprId: integer("pkkpr_id").notNull().references(() => pkkpr.id),
  isVerified: integer("is_verified", { mode: "boolean" }).default(false),
  latitude: real("latitude"),
  longitude: real("longitude"),
  verifiedAt: text("verified_at"),
});