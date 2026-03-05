# TaskMaster - Collaborative Task Tracking System

## About

TaskMaster is a backend system for a task tracking and management application that enables team collaboration. It provides secure user authentication, task management with filtering and search capabilities, team/project collaboration, and features for comments and attachments on tasks.

**Tech Stack:**

- Node.js with Express.js
- PostgreSQL Database
- JWT Authentication
- TypeScript
- Zod for Schema Validation

## Setup Instructions

### Prerequisites

- Node.js 16+ installed
- PostgreSQL database running
- npm or yarn package manager

### Installation Steps

1. **Clone and Install Dependencies**

    ```bash
    cd backend
    npm install
    ```

2. **Environment Configuration**
    - Copy `.env.example` to `.env`
    - Update the following variables:
        - `PG_HOST`, `PG_USER`, `PG_PASSWORD`, `PG_DATABASE`
        - `ACCESS_TOKEN_SECRET` (generate a secure key)
        - `SMTP_*` (for email service)
        - `FRONTEND_URL`, `APP_URL`

3. **Database Setup**

    ```bash
    npm run migrate
    ```

4. **Start Development Server**
    ```bash
    npm run dev
    ```
    Server runs on `http://localhost:3001`

## API Endpoints

### Authentication

#### POST `/api/v1/users/register`

Register a new user account

- **Body:**
    ```json
    {
        "email": "user@example.com",
        "firstname": "John",
        "lastname": "Doe",
        "password": "password123"
    }
    ```
- **Response:** User object with access token

#### POST `/api/v1/users/login`

Login to existing account

- **Body:**
    ```json
    {
        "email": "user@example.com",
        "password": "password123"
    }
    ```
- **Response:** User object with access token

#### POST `/api/v1/users/logout`

Logout user (requires auth)

- **Headers:** `Authorization: Bearer <token>`
- **Response:** Success message

#### GET `/api/v1/users/me`

Get logged-in user details (requires auth)

- **Headers:** `Authorization: Bearer <token>`
- **Response:** Authenticated user object

#### GET `/api/v1/users/profile`

Get user profile (requires auth)

- **Headers:** `Authorization: Bearer <token>`
- **Response:** User profile with extended fields (avatar_url, bio, timezone)

#### PUT `/api/v1/users/profile`

Update user profile (requires auth)

- **Headers:** `Authorization: Bearer <token>`
- **Body:**
    ```json
    {
        "avatar_url": "https://example.com/avatar.jpg",
        "bio": "User biography",
        "timezone": "UTC"
    }
    ```
- **Response:** Updated user profile

### Tasks

#### GET `/api/v1/tasks`

Get tasks with optional filters (requires auth)

- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
    - `assignedTo`: "me" (get tasks assigned to current user)
    - `status`: "open" | "in_progress" | "completed" | "closed"
    - `search`: Search term for title/description
- **Response:** Array of task objects

#### POST `/api/v1/tasks`

Create a new task (requires auth)

- **Headers:** `Authorization: Bearer <token>`
- **Body:**
    ```json
    {
        "title": "Task Title",
        "description": "Task description",
        "priority": "high",
        "status": "open",
        "due_date": "2024-12-31",
        "assigned_to": "uuid-of-user"
    }
    ```
- **Response:** Created task object

#### PUT `/api/v1/tasks/:id`

Update a task (requires auth)

- **Headers:** `Authorization: Bearer <token>`
- **Body:**
    ```json
    {
        "title": "Updated Title",
        "status": "in_progress",
        "priority": "medium",
        "assigned_to": "uuid-of-user"
    }
    ```
- **Response:** Updated task object

### Teams

#### POST `/api/v1/teams`

Create a new team (requires auth)

- **Headers:** `Authorization: Bearer <token>`
- **Body:**
    ```json
    {
        "name": "Team Name",
        "description": "Team description"
    }
    ```
- **Response:** Created team object

#### GET `/api/v1/teams`

Get all user's teams (requires auth)

- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of team objects

#### GET `/api/v1/teams/:teamId`

Get team details (requires auth)

- **Headers:** `Authorization: Bearer <token>`
- **Response:** Team object with members

#### POST `/api/v1/teams/:teamId/invitations`

Invite user to team (requires auth)

- **Headers:** `Authorization: Bearer <token>`
- **Body:**
    ```json
    {
        "email": "user@example.com",
        "role": "member"
    }
    ```
- **Response:** Invitation object with token

#### GET `/api/v1/teams/invitations/accept`

Accept team invitation (requires auth)

- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
    - `token`: Invitation token
- **Response:** Success message and team details

### Comments

#### POST `/api/v1/comments`

Create a comment on a task (requires auth)

- **Headers:** `Authorization: Bearer <token>`
- **Body:**
    ```json
    {
        "task_id": "uuid-of-task",
        "content": "Comment text here"
    }
    ```
- **Response:** Created comment object

#### GET `/api/v1/comments/task/:taskId`

Get all comments on a task (requires auth)

- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of comment objects

#### PUT `/api/v1/comments/:commentId`

Update a comment (requires auth)

- **Headers:** `Authorization: Bearer <token>`
- **Body:**
    ```json
    {
        "content": "Updated comment text"
    }
    ```
- **Response:** Updated comment object

#### DELETE `/api/v1/comments/:commentId`

Delete a comment (requires auth)

- **Headers:** `Authorization: Bearer <token>`
- **Response:** Success message

### Attachments

#### POST `/api/v1/attachments`

Upload an attachment to a task (requires auth)

- **Headers:** `Authorization: Bearer <token>`
- **Body:**
    ```json
    {
        "task_id": "uuid-of-task",
        "file_name": "document.pdf",
        "file_url": "https://example.com/document.pdf",
        "file_size": 1024,
        "mime_type": "application/pdf"
    }
    ```
- **Response:** Created attachment object

#### GET `/api/v1/attachments/task/:taskId`

Get all attachments on a task (requires auth)

- **Headers:** `Authorization: Bearer <token>`
- **Response:** Array of attachment objects

#### GET `/api/v1/attachments/:attachmentId`

Get attachment details (requires auth)

- **Headers:** `Authorization: Bearer <token>`
- **Response:** Attachment object

#### DELETE `/api/v1/attachments/:attachmentId`

Delete an attachment (requires auth)

- **Headers:** `Authorization: Bearer <token>`
- **Response:** Success message

## Common Response Format

**Success Response:**

```json
{
    "success": true,
    "data": {
        /* response data */
    }
}
```

**Error Response:**

```json
{
    "success": false,
    "message": "Error description",
    "details": {
        /* validation errors */
    }
}
```

## Development Commands

```bash
npm run dev          # Start development server with hot reload
npm run build        # Compile TypeScript
npm run start        # Run compiled version
npm run lint         # Check code style
npm run lint:fix     # Fix linting issues
npm run type-check   # Check TypeScript types
npm run migrate      # Run database migrations
```

feedback
