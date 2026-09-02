# Store Rating App

Full-stack store rating application using React, Express, and PostgreSQL.

## Setup

1. Create a PostgreSQL database and run `backend/schema.sql`.
2. Create `backend/.env` with `DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT`, and `JWT_SECRET`.
3. Install and start the backend:

```bash
cd backend
npm install
npm run dev
```

4. Install and start the frontend in another terminal:

```bash
cd frontend
npm install
npm run dev
```

The application supports administrator, normal user, and store owner roles. Administrators can manage users and stores; normal users can search and rate stores; store owners can review ratings for their assigned store.