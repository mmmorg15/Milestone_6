# Havenly Path

Havenly Path is a full-stack mental health support app for two audiences:
- people who need immediate self-support
- people supporting a loved one through a mental health struggle

The current version combines a React frontend, an Express API, and a PostgreSQL database. Users can create an account, log mood check-ins, save journal entries, and browse guided support content from a mobile-friendly interface.

## Current Features
- Landing page with quick access to 988, text-based crisis support, and therapist search
- Account sign up and log in flows
- Mood check-ins saved to PostgreSQL
- Therapeutic journaling with local autosave plus database persistence
- Supporter guidance for caregiver self-care, communication, and risk assessment
- Privacy, terms, and contact pages
- Express static hosting for the built frontend in deployment mode

## Tech Stack
- Frontend: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion
- Backend: Node.js, Express, CORS, dotenv
- Database: PostgreSQL
- Testing: Vitest, Testing Library

## Project Structure
```text
backend/   Express server, database connection, production static hosting
db/        PostgreSQL schema and seed scripts
frontend/  React application, UI components, tests, and build output
```

## Frontend Routes
- `/` - landing page and immediate support links
- `/auth` - sign up and log in
- `/for-me` - mood check-in, coping content, breathing exercise, and journaling
- `/supporters` - support guidance for family and friends
- `/privacy`
- `/terms`
- `/contact`

## API Routes
- `GET /api/health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/mood-logs`
- `POST /api/journal-entries`

`GET /` and the frontend route catch-all are served by Express only after the frontend has been built into `backend/public`.

## Database
The schema currently includes these tables:
- `users`
- `moods`
- `mood_logs`
- `journal_entries`
- `support_resources`

`db/seed.sql` inserts sample users, mood check-ins, journal entries, and support resources so the app has starter data after setup.

## Prerequisites
- Node.js 18+
- npm
- PostgreSQL
- `psql` available in your terminal

## Environment Setup
From the repo root, copy the example files:

```powershell
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

`backend/.env` should look like this:

```dotenv
PORT=3001
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/milestone6
```

`FRONTEND_URL` can also be a comma-separated list if you need to allow multiple frontend origins during development, or `*` if you want the API to accept requests from any origin:

```dotenv
FRONTEND_URL=http://localhost:5173,http://10.34.58.10:5173
```

`frontend/.env` should look like this for local development:

```dotenv
VITE_API_BASE_URL=http://localhost:3001
```

For deployment, set `VITE_API_BASE_URL` to the deployed backend origin before building the frontend.

## Database Setup
From the repo root:

```powershell
psql -U postgres -d postgres -c "CREATE DATABASE milestone6;"
psql -U postgres -d milestone6 -f db\schema.sql
psql -U postgres -d milestone6 -f db\seed.sql
```

Optional verification:

```powershell
psql -U postgres -d milestone6 -c "\dt"
psql -U postgres -d milestone6 -c "SELECT COUNT(*) AS users_count FROM users;"
psql -U postgres -d milestone6 -c "SELECT COUNT(*) AS moods_count FROM moods;"
```

## Local Development
Run the backend and frontend in separate terminals.

Backend:

```powershell
cd backend
npm install
npm run dev
```

Frontend:

```powershell
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

Quick verification:
- Visit `http://localhost:5173/auth` and create an account.
- Go to `/for-me`, save a mood check-in, and save a journal entry.
- Confirm the backend is healthy at `http://localhost:3001/api/health`.

## Build The Frontend For Express Hosting
If you want the backend to serve the React app directly, build the frontend and copy the generated files into `backend/public`.

From the repo root:

```powershell
cd frontend
npm run build
Remove-Item ..\backend\public -Recurse -Force -ErrorAction SilentlyContinue
New-Item ..\backend\public -ItemType Directory | Out-Null
Copy-Item dist\* ..\backend\public -Recurse -Force
```

Then run the backend:

```powershell
cd ..\backend
npm run start
```

Open `http://localhost:3001`.

## Tests
Frontend checks:

```powershell
cd frontend
npm run test
npm run lint
```

## Deployment Notes
This repo is set up to package the backend plus built frontend assets for a single deployment artifact. After copying the frontend build into `backend/public`, create the zip from inside `backend`:

```powershell
Remove-Item ..\havenly-path-backend.zip -Force -ErrorAction SilentlyContinue
tar.exe -a -c -f ..\havenly-path-backend.zip server.js db.js package.json package-lock.json public
```

That zip can be deployed to a Node-compatible host such as Elastic Beanstalk.

## Known Limitations
- Passwords are stored in plain text.
- Authentication is client-side only; current user data is stored in localStorage.
- The API trusts the client-supplied `userId` and does not enforce server-side sessions.
- Support content on the frontend is mostly hardcoded; the `support_resources` table is seeded but not yet exposed through an API.
- The backend expects a built frontend in `backend/public` when serving `/` outside split-origin development.
