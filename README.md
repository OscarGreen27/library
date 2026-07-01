# Library REST API

A REST API for managing a book library. Supports user authentication, book and author management, and cover image uploads.

## Tech Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express 5
- **Database:** PostgreSQL (`pg`)
- **Session storage:** MongoDB (`connect-mongo`)
- **Validation:** Zod
- **Password hashing:** bcrypt-ts
- **File uploads:** Multer

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- MongoDB

### Installation

```bash
git clone <repo-url>
cd library
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable                  | Description                              | Default    |
|---------------------------|------------------------------------------|------------|
| `APP_PORT`                | Server port                              | `3000`     |
| `SESSION_SECRET`          | Secret for signing session cookies       | —          |
| `MONGO_URL`               | MongoDB connection URL                   | —          |
| `SESSION_DB_NAME`         | MongoDB database name for sessions       | —          |
| `SESSION_COLLECTION_NAME` | MongoDB collection name for sessions     | —          |
| `DB_HOST`                 | PostgreSQL host                          | `localhost` |
| `DB_PORT`                 | PostgreSQL port                          | `5432`     |
| `DB_NAME`                 | PostgreSQL database name                 | —          |
| `DB_USER`                 | PostgreSQL user                          | —          |
| `DB_PASS`                 | PostgreSQL password                      | —          |
| `SALT`                    | bcrypt salt rounds (e.g. `10` or `12`)   | —          |
| `TEMP_UPLOADS_PATH`       | Temporary directory for uploaded files   | —          |
| `MAIN_UPLOADS_PATH`       | Permanent directory for cover images     | —          |
| `FILE_SIZE`               | Max upload size in MB                    | `5`        |
| `FILES`                   | Max number of files per request          | `1`        |
| `FIELDS`                  | Max number of fields per request         | `0`        |
| `PARTS`                   | Max total parts per request              | `2`        |
| `FIELD_NAME_SIZE`         | Max field name length in bytes           | `15`       |

### Database Setup

The `backup/` directory contains SQL dump files for creating all required tables. Apply them in numerical order using `psql`:

```bash
psql -U <DB_USER> -d <DB_NAME> -f backup/1.books.sql
psql -U <DB_USER> -d <DB_NAME> -f backup/2.authors.sql
psql -U <DB_USER> -d <DB_NAME> -f backup/3.book_author.sql
psql -U <DB_USER> -d <DB_NAME> -f backup/4.clicks.sql
psql -U <DB_USER> -d <DB_NAME> -f backup/5.want.sql
psql -U <DB_USER> -d <DB_NAME> -f backup/6.users.sql
```



The database schema consists of the following tables:

| File | Table | Description |
|------|-------|-------------|
| `1.books.sql` | `books` | Book records |
| `2.authors.sql` | `authors` | Author records |
| `3.book_author.sql` | `book_author` | Many-to-many relation between books and authors |
| `4.clicks.sql` | `clicks` | Click counter per book |
| `5.want.sql` | `want` | "Want to read" counter per book |
| `6.users.sql` | `users` | User accounts |

> **Note:** The `users` table uses a custom PostgreSQL enum type `role` (`'user'`, `'admin'`). Make sure to create it before applying `6.users.sql`:
> ```sql
> CREATE TYPE public.role AS ENUM ('user', 'admin');
> ```

### Running

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

## API Reference

Base URL: `/api/v1`

### Authentication

#### `POST /user/singup`
Register a new user.

**Request body:**
```json
{
  "name": "string (3–16 chars)",
  "email": "valid email",
  "password": "string (4–32 chars)"
}
```

**Responses:**
| Status | Description |
|--------|-------------|
| `201`  | User created successfully |
| `409`  | Email already in use |
| `422`  | Validation error |

---

#### `POST /user/login`
Log in with email and password. Sets a session cookie.

**Request body:**
```json
{
  "email": "valid email",
  "password": "string (3–32 chars)"
}
```

**Responses:**
| Status | Description |
|--------|-------------|
| `200`  | Logged in successfully |
| `401`  | Invalid email or password |
| `422`  | Validation error |

---

#### `POST /user/logout`
End the current session.

**Responses:**
| Status | Description |
|--------|-------------|
| `200`  | Logged out successfully |

---

### Books

> All book endpoints require an active session (`user` or `admin` role), except where noted.

#### `GET /book/all`
Get a list of all books.

**Roles:** `user`, `admin`

**Query params:**
| Param    | Type   | Description |
|----------|--------|-------------|
| `offset` | number | Number of records to skip |
| `limit`  | number | Number of records to return |

**Responses:**
| Status | Description |
|--------|-------------|
| `200`  | Array of books |
| `401`  | Not authenticated |

---

#### `GET /book/:id`
Get a single book by ID.

**Roles:** `user`, `admin`

**Responses:**
| Status | Description |
|--------|-------------|
| `200`  | Book object |
| `404`  | Book not found |
| `401`  | Not authenticated |

---

#### `PUT /book/want/:id`
Increment the "want to read" counter for a book.

**Roles:** `user`, `admin`

**Responses:**
| Status | Description |
|--------|-------------|
| `200`  | Updated want count |
| `404`  | Book not found |
| `401`  | Not authenticated |

---

#### `POST /book/add`
Add a new book.

**Roles:** `admin` only

**Request body:**
```json
{
  "title": "string (1–64 chars)",
  "year": "positive integer",
  "authors": "[array of author IDs]",
  "pages": "positive integer",
  "isbn": "13-digit integer",
  "description": "string (max 300 chars)"
}
```

**Responses:**
| Status | Description |
|--------|-------------|
| `201`  | Book created, returns new book ID |
| `401`  | Not authenticated |
| `403`  | Insufficient permissions |
| `422`  | Validation error |

---

#### `DELETE /book/delete/:id`
Delete a book by ID.

**Roles:** `admin` only

**Responses:**
| Status | Description |
|--------|-------------|
| `200`  | Book deleted |
| `404`  | Book not found |
| `401`  | Not authenticated |
| `403`  | Insufficient permissions |

---

### Authors

#### `GET /author/all`
Get a list of all authors.

**Roles:** `user`, `admin`

**Responses:**
| Status | Description |
|--------|-------------|
| `200`  | Array of authors |
| `401`  | Not authenticated |

---

#### `GET /author/:id`
Get a single author by ID.

**Roles:** `user`, `admin`

**Responses:**
| Status | Description |
|--------|-------------|
| `200`  | Author object |
| `404`  | Author not found |
| `401`  | Not authenticated |

---

#### `POST /author/add`
Add a new author.

**Roles:** `admin` only

**Request body:**
```json
{
  "name": "string (3–32 chars)"
}
```

**Responses:**
| Status | Description |
|--------|-------------|
| `201`  | Author created |
| `401`  | Not authenticated |
| `403`  | Insufficient permissions |
| `422`  | Validation error |

---

#### `DELETE /author/delete/:id`
Delete an author by ID.

**Roles:** `admin` only

**Responses:**
| Status | Description |
|--------|-------------|
| `200`  | Author deleted |
| `404`  | Author not found |
| `401`  | Not authenticated |
| `403`  | Insufficient permissions |

---

### Covers

#### `GET /cover`
Get the cover image for a book.

**Roles:** `user`, `admin`

**Query params:**
| Param | Type   | Description |
|-------|--------|-------------|
| `id`  | number | Book ID |

**Responses:**
| Status | Description |
|--------|-------------|
| `200`  | Image file (streamed) |
| `404`  | Cover not found |
| `401`  | Not authenticated |

---

#### `POST /cover/upload`
Upload a cover image for a book.

**Roles:** `admin` only

**Form data:**
| Field   | Type   | Description |
|---------|--------|-------------|
| `cover` | file   | Image file (max size set by `FILE_SIZE` env var) |
| `id`    | number | Book ID |

**Responses:**
| Status | Description |
|--------|-------------|
| `201`  | Cover uploaded |
| `400`  | Invalid file or fields |
| `404`  | Book not found |
| `401`  | Not authenticated |
| `403`  | Insufficient permissions |
| `413`  | File too large |

---

#### `DELETE /cover/delete`
Delete the cover image for a book.

**Roles:** `admin` only

**Query params:**
| Param | Type   | Description |
|-------|--------|-------------|
| `id`  | number | Book ID |

**Responses:**
| Status | Description |
|--------|-------------|
| `200`  | Cover deleted |
| `404`  | Book not found |
| `401`  | Not authenticated |
| `403`  | Insufficient permissions |

---

## Error Format

All errors return JSON in the following format:

```json
{
  "error": true,
  "message": "Description of the error"
}
```

| Status | Meaning |
|--------|---------|
| `400`  | Bad request (invalid file or fields) |
| `401`  | Not authenticated |
| `403`  | Authenticated but insufficient permissions |
| `404`  | Resource not found |
| `409`  | Conflict (e.g. email already in use) |
| `413`  | Payload too large |
| `422`  | Validation error |
| `500`  | Internal server error |