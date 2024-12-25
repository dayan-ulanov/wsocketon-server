import { sql } from 'drizzle-orm';
import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

const timestamps = {
  created_at: timestamp({ withTimezone: true, mode: 'string' })
    .default(sql`(now() AT TIME ZONE 'utc'::text)`)
    .notNull(),
  updated_at: timestamp({ withTimezone: true, mode: 'string' })
    .default(sql`(now() AT TIME ZONE 'utc'::text)`)
    .notNull()
    .$onUpdate(() => sql`(now() AT TIME ZONE 'utc'::text)`),
};

export const todos = pgTable('todos', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  title: varchar('title', { length: 256 }).notNull(),
  description: varchar('description', { length: 512 }),
  completed: boolean('completed').default(false),
  ...timestamps,
});
