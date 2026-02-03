import * as migration_20260202_170818_localized_seo_fields from './20260202_170818_localized_seo_fields';
import * as migration_20260202_171027_remove_thumbnail_and_seo_image from './20260202_171027_remove_thumbnail_and_seo_image';

export const migrations = [
  {
    up: migration_20260202_170818_localized_seo_fields.up,
    down: migration_20260202_170818_localized_seo_fields.down,
    name: '20260202_170818_localized_seo_fields',
  },
  {
    up: migration_20260202_171027_remove_thumbnail_and_seo_image.up,
    down: migration_20260202_171027_remove_thumbnail_and_seo_image.down,
    name: '20260202_171027_remove_thumbnail_and_seo_image'
  },
];
