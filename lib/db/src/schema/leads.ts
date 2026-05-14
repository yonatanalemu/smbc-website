import { pgTable, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const prospectiveStudents2026 = pgTable("prospective_students_2026", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  contactInfo: text("contact_info").notNull(),
  sourcePage: text("source_page").default("secure_your_future_overlay"),
  guideSent: boolean("guide_sent").default(false),
  status: text("status").default("priority_waitlist"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertLeadSchema = createInsertSchema(prospectiveStudents2026).omit({
  id: true,
  createdAt: true,
  guideSent: true,
  status: true,
  sourcePage: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof prospectiveStudents2026.$inferSelect;
