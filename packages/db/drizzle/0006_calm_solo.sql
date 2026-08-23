CREATE TABLE "category" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" varchar(60) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "code_tag" (
	"code_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "code_tag_code_id_tag_id_pk" PRIMARY KEY("code_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "tag" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"name" varchar(40) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "code" ADD COLUMN "category_id" uuid;--> statement-breakpoint
ALTER TABLE "category" ADD CONSTRAINT "category_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "code_tag" ADD CONSTRAINT "code_tag_code_id_code_id_fk" FOREIGN KEY ("code_id") REFERENCES "public"."code"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "code_tag" ADD CONSTRAINT "code_tag_tag_id_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tag" ADD CONSTRAINT "tag_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "category_user_id_name_unique" ON "category" USING btree ("user_id",lower("name"));--> statement-breakpoint
CREATE INDEX "code_tag_tag_id_idx" ON "code_tag" USING btree ("tag_id");--> statement-breakpoint
CREATE UNIQUE INDEX "tag_user_id_name_unique" ON "tag" USING btree ("user_id",lower("name"));--> statement-breakpoint
ALTER TABLE "code" ADD CONSTRAINT "code_category_id_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."category"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "code_category_id_idx" ON "code" USING btree ("category_id");