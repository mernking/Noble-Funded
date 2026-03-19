ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "provider" varchar(20) DEFAULT 'email';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "supabase_user_id" varchar(255);