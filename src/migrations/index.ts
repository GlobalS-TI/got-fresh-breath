import * as migration_20260804_180628_add_site_media from './20260804_180628_add_site_media';

export const migrations = [
  {
    up: migration_20260804_180628_add_site_media.up,
    down: migration_20260804_180628_add_site_media.down,
    name: '20260804_180628_add_site_media'
  },
];
