import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { fieldVerifications } from "./field_verifications";
import { staff } from "./staff";

export const fieldVerificationTeam = sqliteTable("field_verification_team", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fieldVerificationId: integer("field_verification_id")
    .notNull()
    .references(() => fieldVerifications.id),
  staffId: integer("staff_id").notNull().references(() => staff.id),
});