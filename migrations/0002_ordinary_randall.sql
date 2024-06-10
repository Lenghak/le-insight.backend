DO $$ BEGIN
 CREATE TYPE "public"."sensitivity_perspectiveness" AS ENUM('POSITIVE', 'NEGATIVE', 'NEUTRAL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."sensitivity_age_range" AS ENUM('GENERAL_AUDIENCE', 'TEENAGERS', 'YOUNG_ADULTS', 'ADULTS', 'MATURE_ADULTS');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."sensitivity_status" AS ENUM('ACTIVE', 'INACTIVE', 'PENDING', 'REVOKED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "articles_sensitivities" (
	"article_id" uuid NOT NULL,
	"sensitivity_id" uuid NOT NULL,
	"perspectiveness" "sensitivity_perspectiveness",
	CONSTRAINT "articles_sensitivities_article_id_sensitivity_id_pk" PRIMARY KEY("article_id","sensitivity_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sensitivities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"label" varchar(100),
	"assigned_count" integer DEFAULT 0,
	"generated_count" integer DEFAULT 0,
	"sensitivity_status" "sensitivity_status" DEFAULT 'INACTIVE',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "articles_sensitivities" ADD CONSTRAINT "articles_sensitivities_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "articles_sensitivities" ADD CONSTRAINT "articles_sensitivities_sensitivity_id_sensitivities_id_fk" FOREIGN KEY ("sensitivity_id") REFERENCES "public"."sensitivities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
