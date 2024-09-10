ALTER TABLE "goals" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "goals" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "goals" ADD COLUMN "deleted_at" timestamp with time zone;