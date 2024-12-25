ALTER TABLE "todos" ALTER COLUMN "created_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "todos" ALTER COLUMN "created_at" SET DEFAULT (now() AT TIME ZONE 'utc'::text);--> statement-breakpoint
ALTER TABLE "todos" ALTER COLUMN "updated_at" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "todos" ALTER COLUMN "updated_at" SET DEFAULT (now() AT TIME ZONE 'utc'::text);--> statement-breakpoint
ALTER TABLE "todos" ALTER COLUMN "updated_at" SET NOT NULL;