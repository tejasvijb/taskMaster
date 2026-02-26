# Database Relationships & Cardinality

## Users ↔ Tasks

| Relationship | Cardinality | Description                         |
| ------------ | ----------- | ----------------------------------- |
| One User     | Many Tasks  | A user can create multiple tasks    |
| One Task     | One User    | A task is assigned to only one user |
| **Overall**  | **1:M**     | One-to-Many relationship            |

---

## Users ↔ Teams

| Relationship | Cardinality | Description                                  |
| ------------ | ----------- | -------------------------------------------- |
| One User     | Many Teams  | A user can be part of multiple teams         |
| One Team     | Many Users  | A team can have multiple users               |
| **Overall**  | **M:M**     | Many-to-Many relationship (via team_members) |

---

## Teams ↔ Team Members

| Relationship | Cardinality  | Description                         |
| ------------ | ------------ | ----------------------------------- |
| One Team     | Many Members | A team can have multiple members    |
| One Member   | One Team     | Each membership belongs to one team |
| **Overall**  | **1:M**      | One-to-Many relationship            |

---

## Teams ↔ Team Invitations

| Relationship   | Cardinality      | Description                          |
| -------------- | ---------------- | ------------------------------------ |
| One Team       | Many Invitations | A team can send multiple invitations |
| One Invitation | One Team         | Each invitation is for one team      |
| **Overall**    | **1:M**          | One-to-Many relationship             |
