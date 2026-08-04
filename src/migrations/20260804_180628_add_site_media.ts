import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_media_slots" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"label" varchar,
  	"media_id" integer
  );

  CREATE TABLE "site_media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  ALTER TABLE "site_media_slots" ADD CONSTRAINT "site_media_slots_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_media_slots" ADD CONSTRAINT "site_media_slots_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_media_slots_order_idx" ON "site_media_slots" USING btree ("_order");
  CREATE INDEX "site_media_slots_parent_id_idx" ON "site_media_slots" USING btree ("_parent_id");
  CREATE INDEX "site_media_slots_media_idx" ON "site_media_slots" USING btree ("media_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_media_slots" CASCADE;
  DROP TABLE "site_media" CASCADE;`)
}
