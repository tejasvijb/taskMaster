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
  // Enable uuid extension if not already enabled
  pgm.createExtension("uuid-ossp", { ifNotExists: true });

  // Add a temporary uuid id column
  pgm.addColumn("users", {
    id_new: {
      type: "uuid",
      default: pgm.func("uuid_generate_v4()"),
      notNull: true,
    },
  });

  // Copy data from old id to new id using uuid function
  pgm.sql("UPDATE users SET id_new = gen_random_uuid()");

  // Drop the old id column
  pgm.dropColumn("users", "id");

  // Rename new column to id
  pgm.renameColumn("users", "id_new", "id");

  // Add primary key constraint
  pgm.addConstraint("users", "users_pkey", {
    primaryKey: ["id"],
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  // Drop the primary key constraint
  pgm.dropConstraint("users", "users_pkey");

  // Add temporary serial id column
  pgm.addColumn("users", {
    id_new: {
      type: "serial",
      notNull: true,
    },
  });

  // Copy data from uuid id to new serial id (generate new sequence)
  pgm.sql("UPDATE users SET id_new = ROW_NUMBER() OVER (ORDER BY id)");

  // Drop the uuid id column
  pgm.dropColumn("users", "id");

  // Rename new column to id
  pgm.renameColumn("users", "id_new", "id");

  // Add primary key constraint
  pgm.addConstraint("users", "users_pkey", {
    primaryKey: ["id"],
  });

  // Drop the uuid extension
  pgm.dropExtension("uuid-ossp", { ifExists: true });
};
