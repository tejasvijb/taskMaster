## users

| Attribute    | Type      | Description                    |
| ------------ | --------- | ------------------------------ |
| `id`         | UUID      | Primary key, unique identifier |
| `email`      | String    | User email address             |
| `firstname`  | String    | User first name                |
| `lastname`   | String    | User last name                 |
| `password`   | String    | Hashed password                |
| `role`       | String    | User role/permission level     |
| `created_at` | Timestamp | Account creation timestamp     |
| `updated_at` | Timestamp | Last update timestamp          |
| `bio`        | String    | User biography/description     |
| `avatar_url` | String    | User profile avatar URL        |
| `timezone`   | String    | User timezone preference       |

## teams

| Attribute     | Type      | Description                    |
| ------------- | --------- | ------------------------------ |
| `id`          | UUID      | Primary key, unique identifier |
| `name`        | String    | Team name                      |
| `description` | String    | Team description               |
| `created_by`  | UUID      | User ID of team creator        |
| `created_at`  | Timestamp | Team creation timestamp        |
| `updated_at`  | Timestamp | Last update timestamp          |

## team_members

| Attribute   | Type      | Description                    |
| ----------- | --------- | ------------------------------ |
| `id`        | UUID      | Primary key, unique identifier |
| `team_id`   | UUID      | Foreign key to teams table     |
| `user_id`   | UUID      | Foreign key to users table     |
| `role`      | String    | Member role within team        |
| `joined_at` | Timestamp | When member joined the team    |

## team_invitations

| Attribute     | Type      | Description                                   |
| ------------- | --------- | --------------------------------------------- |
| `id`          | UUID      | Primary key, unique identifier                |
| `team_id`     | UUID      | Foreign key to teams table                    |
| `email`       | String    | Email address of invitee                      |
| `invited_by`  | UUID      | User ID of inviter                            |
| `token`       | String    | Unique invitation token                       |
| `status`      | String    | Invitation status (pending/accepted/rejected) |
| `expires_at`  | Timestamp | Invitation expiration timestamp               |
| `created_at`  | Timestamp | Invitation creation timestamp                 |
| `accepted_by` | UUID      | User ID of person who accepted invitation     |
| `accepted_at` | Timestamp | Timestamp when invitation was accepted        |

## tasks

| Attribute      | Type      | Description                                |
| -------------- | --------- | ------------------------------------------ |
| `id`           | UUID      | Primary key, unique identifier             |
| `title`        | String    | Task title (required)                      |
| `description`  | Text      | Detailed task description                  |
| `status`       | String    | Task status (open, in progress, completed) |
| `priority`     | String    | Task priority level (low, medium, high)    |
| `due_date`     | Date      | Task deadline date                         |
| `assigned_to`  | BIGINT    | User ID task is assigned to                |
| `created_by`   | BIGINT    | User ID of task creator (required)         |
| `created_at`   | Timestamp | Task creation timestamp                    |
| `updated_at`   | Timestamp | Last update timestamp                      |
| `completed_at` | Timestamp | Task completion timestamp                  |
