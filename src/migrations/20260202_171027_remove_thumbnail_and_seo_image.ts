import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "news" DROP CONSTRAINT "news_thumbnail_id_media_id_fk";
  
  ALTER TABLE "_news_v" DROP CONSTRAINT "_news_v_version_thumbnail_id_media_id_fk";
  
  DROP INDEX "news_thumbnail_idx";
  DROP INDEX "news_meta_meta_image_1_idx";
  DROP INDEX "_news_v_version_version_thumbnail_idx";
  DROP INDEX "_news_v_version_meta_version_meta_image_1_idx";
  ALTER TABLE "news" DROP COLUMN "thumbnail_id";
  ALTER TABLE "_news_v" DROP COLUMN "version_thumbnail_id";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "news" ADD COLUMN "thumbnail_id" integer;
  ALTER TABLE "_news_v" ADD COLUMN "version_thumbnail_id" integer;
  ALTER TABLE "news" ADD CONSTRAINT "news_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_news_v" ADD CONSTRAINT "_news_v_version_thumbnail_id_media_id_fk" FOREIGN KEY ("version_thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "news_thumbnail_idx" ON "news" USING btree ("thumbnail_id");
  CREATE INDEX "news_meta_meta_image_1_idx" ON "news_locales" USING btree ("meta_image_id","_locale");
  CREATE INDEX "_news_v_version_version_thumbnail_idx" ON "_news_v" USING btree ("version_thumbnail_id");
  CREATE INDEX "_news_v_version_meta_version_meta_image_1_idx" ON "_news_v_locales" USING btree ("version_meta_image_id","_locale");`)
}
