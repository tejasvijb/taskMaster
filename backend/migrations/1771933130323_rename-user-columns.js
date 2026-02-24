/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.renameColumn('users', 'firstName', 'firstname');
  pgm.renameColumn('users', 'lastName', 'lastname');
  pgm.renameColumn('users', 'createdAt', 'created_at');
  pgm.renameColumn('users', 'updatedAt', 'updated_at');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.renameColumn('users', 'firstname', 'firstName');
  pgm.renameColumn('users', 'lastname', 'lastName');
  pgm.renameColumn('users', 'created_at', 'createdAt');
  pgm.renameColumn('users', 'updated_at', 'updatedAt');
};
