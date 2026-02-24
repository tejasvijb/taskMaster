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
  // Create enum type for user roles
  pgm.createType("user_role", ["user", "admin"]);

  // Create users table
  pgm.createTable(
    "users",
    {
      id: {
        type: "serial",
        primaryKey: true,
      },
      email: {
        type: "varchar(255)",
        notNull: true,
        unique: true,
      },
      firstName: {
        type: "varchar(64)",
        notNull: true,
      },
      lastName: {
        type: "varchar(64)",
        notNull: true,
      },
      password: {
        type: "varchar(255)",
        notNull: true,
      },
      role: {
        type: "user_role",
        default: "user",
        notNull: true,
      },
      createdAt: {
        type: "timestamp",
        default: pgm.func("current_timestamp"),
        notNull: true,
      },
      updatedAt: {
        type: "timestamp",
        default: pgm.func("current_timestamp"),
        notNull: true,
      },
    },
    {
      comment: "Users table for storing user information",
    },
  );

  // Create index on email for faster lookups
  pgm.createIndex("users", "email");
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  // Drop the users table
  pgm.dropTable("users", { ifExists: true });

  // Drop the enum type
  pgm.dropType("user_role", { ifExists: true });
};
