ALTER TABLE "goals" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;