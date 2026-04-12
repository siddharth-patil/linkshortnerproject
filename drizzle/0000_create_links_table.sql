CREATE TABLE "links" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"url" text NOT NULL,
	"short_code" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "short_code_unique" ON "links" USING btree ("short_code");--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "links" USING btree ("user_id");