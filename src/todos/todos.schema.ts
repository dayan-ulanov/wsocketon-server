import { sql } from 'drizzle-orm';
import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const todos = pgTable('todos', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  title: varchar('title', { length: 256 }).notNull(),
  description: varchar('description', { length: 512 }),
  completed: boolean('completed').default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
