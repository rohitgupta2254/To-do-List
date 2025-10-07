# TaskFlow Board

## Database Setup

This project uses a MySQL database. To set up the database:

1. Create a database named `taskflow_board` (or update your `.env` and `backend/config/database.js` for a different name).
2. Run the SQL statements in `database/schema.sql` to create the required tables:

```bash
mysql -u <username> -p <database_name> < database/schema.sql
```

3. Update your `.env` file or environment variables with your database credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=taskflow_board
```

## Table Structure
See `database/schema.sql` for the full table definitions:
- `users`: Stores user credentials
- `boards`: Stores boards for each user
- `lists`: Stores lists for each board
- `cards`: Stores cards for each list

## Backend & Frontend
- Backend: Node.js/Express (see `backend/`)
- Frontend: React (see `frontend/`)

## Getting Started
1. Install dependencies in both `backend` and `frontend` folders:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```
2. Start backend:
   ```bash
   cd backend && npm run dev
   ```
3. Start frontend:
   ```bash
   cd frontend && npm start
   ```
