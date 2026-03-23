import * as migration_20260323_093409_add_category_field from './20260323_093409_add_category_field';

export const migrations = [
  {
    up: migration_20260323_093409_add_category_field.up,
    down: migration_20260323_093409_add_category_field.down,
    name: '20260323_093409_add_category_field'
  },
];
