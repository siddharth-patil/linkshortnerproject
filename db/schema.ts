import { pgTable, text, timestamp, uniqueIndex, index, integer } from 'drizzle-orm/pg-core';

export const links = pgTable(
  'links',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    userId: text('user_id').notNull(),
    url: text('url').notNull(),
    shortCode: text('short_code').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    shortCodeUniqueIndex: uniqueIndex('short_code_unique').on(table.shortCode),
    userIdIndex: index('user_id_idx').on(table.userId),
  })
);

export type Link = typeof links.$inferSelect;
export type LinkInsert = typeof links.$inferInsert;
