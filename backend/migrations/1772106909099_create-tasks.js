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
  pgm.createTable("tasks", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    title: {
      type: "varchar",
      notNull: true,
    },
    description: {
      type: "text",
    },
    status: {
      type: "varchar",
      notNull: true,
      default: "open",
    },
    priority: {
      type: "varchar",
      notNull: true,
    },
    due_date: {
      type: "date",
    },
    assigned_to: {
      type: "uuid",
      references: '"users"(id)',
    },
    created_by: {
      type: "uuid",
      notNull: true,
      references: '"users"(id)',
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    completed_at: {
      type: "timestamp",
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable("tasks");
};
