# Finance Data Processing and Access Control Backend

A backend system for managing financial records with role-based access control. Built as part of a backend assessment for Zorvyn FinTech.

---

## Live API

```
https://finance-backend-ipaf.onrender.com
```

---

## What This Project Does

This backend powers a finance dashboard where different types of users can interact with financial data based on their role. An admin can create and manage records, an analyst can view and analyze them, and a viewer can only see the dashboard.

---

## Tech Stack

- **Node.js** with **Express** — server and routing
- **MongoDB Atlas** — cloud database
- **Mongoose** — data modeling
- **JWT** — authentication
- **express-validator** — input validation

---

## Project Structure

```
finance-backend/
├── config/         → Database connection
├── controllers/    → Request and response handling
├── middleware/     → Auth, role check, validation, error handling
├── models/         → Mongoose schemas
├── routes/         → API route definitions
├── services/       → Business logic
└── server.js       → App entry point
```

---

## Roles and Permissions

| Action                 | Viewer | Analyst | Admin |
| ---------------------- | ------ | ------- | ----- |
| View records           | ✅     | ✅      | ✅    |
| View recent activity   | ✅     | ✅      | ✅    |
| View dashboard summary | ❌     | ✅      | ✅    |
| View category totals   | ❌     | ✅      | ✅    |
| View monthly trends    | ❌     | ✅      | ✅    |
| Create records         | ❌     | ❌      | ✅    |
| Update records         | ❌     | ❌      | ✅    |
| Delete records         | ❌     | ❌      | ✅    |
| Manage users           | ❌     | ❌      | ✅    |

---

## Getting Started Locally

**1. Clone the repo**

```bash
git clone https://github.com/sd-silentroot/finance-backend.git
cd finance-backend
```

**2. Install dependencies**

```bash
npm install
```

**3. Create a `.env` file in the root**

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
NODE_ENV=development
```

**4. Start the server**

```bash
npm run dev
```

Server will run at `http://localhost:5000`

---

## API Reference

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_token>
```

---

### Auth

#### Register

```
POST /api/auth/register
```

```json
{
  "name": "Rahul",
  "email": "Rahul@example.com",
  "password": "123456",
  "role": "admin"
}
```

#### Login

```
POST /api/auth/login
```

```json
{
  "email": "sahil@example.com",
  "password": "123456"
}
```

#### Get Current User

```
GET /api/auth/me
Authorization: Bearer <token>
```

---

### Financial Records

#### Create a Record — Admin only

```
POST /api/records
Authorization: Bearer <token>
```

```json
{
  "amount": 5000,
  "type": "income",
  "category": "Salary",
  "date": "2026-04-01",
  "notes": "Monthly salary"
}
```

#### Get All Records — All roles

```
GET /api/records
Authorization: Bearer <token>
```

Supports filtering via query params:

```
GET /api/records?type=income
GET /api/records?category=salary
GET /api/records?startDate=2026-01-01&endDate=2026-04-01
GET /api/records?search=salary
GET /api/records?page=1&limit=10
```

#### Get Single Record — All roles

```
GET /api/records/:id
Authorization: Bearer <token>
```

#### Update a Record — Admin only

```
PUT /api/records/:id
Authorization: Bearer <token>
```

```json
{
  "amount": 6000,
  "notes": "Updated salary"
}
```

#### Delete a Record — Admin only

```
DELETE /api/records/:id
Authorization: Bearer <token>
```

> Records are soft deleted — they are marked as deleted and not removed from the database.

---

### Dashboard

#### Summary — Analyst, Admin

```
GET /api/dashboard/summary
Authorization: Bearer <token>
```

Returns total income, total expenses, and net balance.

#### Category Totals — Analyst, Admin

```
GET /api/dashboard/categories
Authorization: Bearer <token>
```

Returns total amount grouped by category and type.

#### Monthly Trends — Analyst, Admin

```
GET /api/dashboard/trends
Authorization: Bearer <token>
```

Returns monthly income and expense totals.

#### Recent Activity — All roles

```
GET /api/dashboard/recent
Authorization: Bearer <token>
```

Returns the 5 most recent records. Pass `?limit=10` to change the count.

---

### User Management — Admin only

#### Get All Users

```
GET /api/users
Authorization: Bearer <token>
```

#### Get Single User

```
GET /api/users/:id
Authorization: Bearer <token>
```

#### Update User Role

```
PATCH /api/users/:id/role
Authorization: Bearer <token>
```

```json
{
  "role": "analyst"
}
```

#### Update User Status

```
PATCH /api/users/:id/status
Authorization: Bearer <token>
```

```json
{
  "status": "inactive"
}
```

---

## How to Test

The easiest way to test this API is using [Postman](https://www.postman.com) or any API client.

**Recommended flow:**

1. Register an admin user via `POST /api/auth/register`
2. Login via `POST /api/auth/login` and copy the token
3. Use the token in the Authorization header for all further requests
4. Create a few financial records
5. Test the dashboard endpoints
6. Register a viewer or analyst and test that access restrictions work

---

## Assumptions

- A user can only have one role at a time.
- Roles are assigned at registration and can be updated by an admin later.
- Deleted records are soft deleted — the `isDeleted` flag is set to true and they no longer appear in any listing or summary.
- Dashboard summary calculations only include active (non-deleted) records.
- Any user with an inactive status cannot log in.

---

## Tradeoffs

- Chose MongoDB over a relational database because financial records here are document-like and do not require complex joins.
- Kept authentication simple using JWT instead of sessions — suitable for a stateless REST API.
- Skipped rate limiting to keep the implementation clean for assessment purposes, but it would be an important addition in production.
