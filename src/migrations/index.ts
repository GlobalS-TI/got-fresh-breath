import * as migration_20260804_180628_add_site_media from './20260804_180628_add_site_media';
import * as migration_20261021_164355_users_telefono_datos_fiscales from './20261021_164355_users_telefono_datos_fiscales';
import * as migration_20261021_174533_productos_consultorios from './20261021_174533_productos_consultorios';
import * as migration_20261021_220612_productos_consultorios_imagen_estatica from './20261021_220612_productos_consultorios_imagen_estatica';

export const migrations = [
  {
    up: migration_20260804_180628_add_site_media.up,
    down: migration_20260804_180628_add_site_media.down,
    name: '20260804_180628_add_site_media',
  },
  {
    up: migration_20261021_164355_users_telefono_datos_fiscales.up,
    down: migration_20261021_164355_users_telefono_datos_fiscales.down,
    name: '20261021_164355_users_telefono_datos_fiscales',
  },
  {
    up: migration_20261021_174533_productos_consultorios.up,
    down: migration_20261021_174533_productos_consultorios.down,
    name: '20261021_174533_productos_consultorios',
  },
  {
    up: migration_20261021_220612_productos_consultorios_imagen_estatica.up,
    down: migration_20261021_220612_productos_consultorios_imagen_estatica.down,
    name: '20261021_220612_productos_consultorios_imagen_estatica'
  },
];
