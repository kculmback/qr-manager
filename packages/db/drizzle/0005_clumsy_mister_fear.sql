CREATE TABLE "code" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"medium" text DEFAULT 'qr' NOT NULL,
	"type" text NOT NULL,
	"mode" text NOT NULL,
	"name" varchar(120) NOT NULL,
	"slug" text NOT NULL,
	"payload" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "code_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "code" ADD CONSTRAINT "code_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "code_user_id_idx" ON "code" USING btree ("user_id");