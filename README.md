# Description

This is a mental-health support app. Its goal is to provide resources for those that are supporting someone dealing with mental health challenges such as being suicidal as well as providing resources to support the struggling individual themself. It allows users them to check in on their mood, journal safely, and access support resources for themselves or for loved ones. The problem that it solves is mainly the lack of easy access to simple and helpful resources and plans that can make a real quick differences in the lives of supporters. The primary user would be someone who is supporting a struggling family member or friend. The project demonstrates a complete frontend + backend + PostgreSQL workflow with persistent data.


The current version combines a React frontend, an Express API, and a PostgreSQL database. Users can create an account, log mood check-ins, save journal entries, and browse guided support content from a mobile-friendly interface.

## Current Features
- Landing page with quick access to 988, text-based crisis support, and therapist search
- Account sign up and log in flows
- Mood check-ins saved to PostgreSQL
- Therapeutic journaling with local autosave plus database persistence
- The journaling allows for viewing past journal entries, editing them, and deleting them if desired
- Supporter guidance for caregiver self-care, communication, and risk assessment
- Privacy, terms, and contact pages
- Express static hosting for the built frontend in deployment mode

## Ears Requirements

### Ubiquitous requirements

- The system shall provide plain-language mental health education for non-experts.

- The system shall maintain user privacy by not storing personal mental health data
### Event-Driven requirements 

- When a user indicates uncertainty about their friend’s condition, the system shall display warning signs and escalation guidance.

- When a user indicates persistent or worsening distress, the system shall display escalation guidance and professional help options.

- When a user requests professional support options, the system shall display external service links.

- When a user selects a support situation, the system shall recommend appropriate conversation prompts.

- When a user selects a crisis scenario, the system shall immediately display emergency resources.

### State-Driven requirements 

- While the user is reviewing escalation guidance, the system shall clearly differentiate “support actions” from “professional treatment.”

- While the user is viewing situational guidance, the system shall present steps in short, actionable bullets.

- While the user is in a self-care/boundaries section, the system shall emphasize sustainable support behaviors and burnout prevention.


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

## Architecture
```mermaid
flowchart LR
  USER[User] --> A[React Frontend\nfrontend]

  A -->|HTTP /api| B[Express API\nbackend/server.js]
  B --> C[(PostgreSQL\nmilestone6)]

  subgraph DB Tables
    U[users]
    M[moods]
    ML[mood_logs]
    J[journal_entries]
    R[support_resources]
  end

  C --- U
  C --- M
  C --- ML
  C --- J
  C --- R
```


## Database Design
The schema contains 5 tables:
1. `users`
2. `moods`
3. `mood_logs`
4. `journal_entries`
5. `support_resources`


## Prerequisites
- Node.js 18+ Installation: https://nodejs.org/en/download
    - Installation verification command: node -v
- PostgreSQL installed and running. Installation: https://www.postgresql.org/download/
    - Installation verification command: psql --version
- `psql` CLI available in your terminal

## Environment Setup
From repo root:

```powershell
Copy-Item backend\.env.example backend\.env
Copy-Item frontend\.env.example frontend\.env
```

Or in bash:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

`backend/.env` should point to your local DB credentials (default DB name used here is `milestone6`).
(If the .env file in the backend doesn't have your correct DB_PASSWORD and other credentials, it won't work!)

## Recreate Database (Exact Steps)
From repo root:

```powershell
cd db
psql -U postgres -c "CREATE DATABASE milestone6;"
psql -U postgres -d milestone6 -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
psql -U postgres -d milestone6 -f schema.sql
psql -U postgres -d milestone6 -f seed.sql
```

Quick DB verification:

```powershell
psql -U postgres -d milestone6 -c "\dt"
psql -U postgres -d milestone6 -c "SELECT COUNT(*) AS users_count FROM users;"
psql -U postgres -d milestone6 -c "SELECT COUNT(*) AS moods_count FROM moods;"
psql -U postgres -d milestone6 -c "SELECT * FROM users;"
```

## Run the App Locally
Use two terminals.

Terminal 1 (Backend):
Navigate to the project directory
```powershell
cd backend
npm install
npm run dev
```

Terminal 2 (Frontend):
Navigate to the project directory
```powershell
cd frontend
npm install
npm run dev
```
The frontend installation might take a while. If running dev errors out, try deleting the front-end node_modules and package-lock.json, clearing terminal cache, and re-running the install and run dev commands.

Open the frontend URL shown by Vite (typically `http://localhost:5173` or possibly port 8080).

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
