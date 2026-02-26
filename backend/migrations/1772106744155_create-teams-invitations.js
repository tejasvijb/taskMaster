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
  pgm.createTable("team_invitations", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    team_id: {
      type: "uuid",
      notNull: true,
      references: '"teams"(id)',
    },
    email: {
      type: "varchar",
      notNull: true,
    },
    invited_by: {
      type: "uuid",
      notNull: true,
      references: '"users"(id)',
    },
    token: {
      type: "varchar",
      notNull: true,
      unique: true,
    },
    status: {
      type: "varchar",
      notNull: true,
      default: "pending",
    },
    expires_at: {
      type: "timestamp",
      notNull: true,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
    accepted_by: {
      type: "uuid",
      references: '"users"(id)',
    },
    accepted_at: {
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
  pgm.dropTable("team_invitations");
};
