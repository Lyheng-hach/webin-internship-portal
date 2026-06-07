# WEBIN — Internship Job Portal

A full-stack internship management system built with **FastAPI**, **MySQL**, and **React + Vite + Tailwind CSS**. Students can browse and apply for internship positions, companies manage applications, supervisors oversee interns, and admins control the entire platform.

---

## Tech Stack

| Layer     | Technology                              |
|-----------|-----------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS v4         |
| Backend   | FastAPI, SQLAlchemy ORM, Pydantic v2    |
| Database  | MySQL                                   |
| Auth      | JWT (python-jose), bcrypt               |
| API Proxy | Vite `/api` proxy → FastAPI port 8000   |

---

## Project Structure

```
Job portal/
├── backend/                  # FastAPI backend
│   ├── core/                 # Config, security, role dependencies
│   ├── models/               # SQLAlchemy ORM models
│   ├── routers/              # API route handlers
│   ├── schemas/              # Pydantic request/response schemas
│   ├── main.py               # App entry point, router registration
│   ├── database.py           # DB session setup
│   ├── requirements.txt      # Python dependencies
│   ├── seed.py               # (optional) seed script
│   └── .env.example          # Environment variable template
│
├── Webin/                    # React frontend
│   ├── src/
│   │   ├── assets/           # Helpers, NavItems, shared UI atoms
│   │   ├── components/
│   │   │   ├── Student/      # Student dashboard & pages
│   │   │   ├── Company/      # Company dashboard & pages
│   │   │   ├── Supervisor/   # Supervisor dashboard & pages
│   │   │   ├── Admin/        # Admin dashboard & pages
│   │   │   └── Default/      # Landing page components
│   │   ├── pages/            # Login, Register pages
│   │   └── App.jsx           # Root router
│   ├── package.json
│   └── vite.config.js
│
└── DataBase1/
    ├── Project database.sql           # Full schema (CREATE TABLE)
    ├── Project database optimized.sql # Schema with indexes
    ├── Seeding Uni and skill.sql      # University & skill seed data
    └── Truncate Data.sql              # Clear all tables (for re-seeding)
```

---

## Database Setup

1. Open **MySQL Workbench** and connect to your local server.

2. Create the database:
   ```sql
   CREATE DATABASE webin;
   USE webin;
   ```

3. Run the schema file to create all tables:
   ```
   File → Open SQL Script → DataBase1/Project database optimized.sql → Execute
   ```

4. Run the seed file for universities and skills:
   ```
   File → Open SQL Script → DataBase1/Seeding Uni and skill.sql → Execute
   ```

> To reset all data and start fresh, run `DataBase1/Truncate Data.sql` first, then re-run the seed file.

---

## Backend Setup

### 1. Navigate to the backend folder

```bash
cd backend
```

### 2. Create and activate a virtual environment (recommended)

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Copy `.env.example` to `.env` and fill in your MySQL credentials:

```bash
cp .env.example .env
```

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=webin
DB_USER=root
DB_PASSWORD=your_mysql_password

SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

APP_ENV=development
```

### 5. Start the backend server

```bash
uvicorn main:app --reload
```

The API will be available at: `http://localhost:8000`
Interactive docs (Swagger UI): `http://localhost:8000/docs`

---

## Frontend Setup

### 1. Navigate to the frontend folder

```bash
cd Webin
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The app will be available at: `http://localhost:5173`

> The Vite dev server proxies all `/api` requests to `http://localhost:8000`, so both servers must be running at the same time.

---

## User Roles

| Role       | Description                                                      |
|------------|------------------------------------------------------------------|
| Student    | Browse positions, apply with documents, track applications       |
| Company    | Post internship positions, review and manage applications        |
| Supervisor | Monitor interns, submit evaluations, handle supervision requests |
| Admin      | Manage all users, verify companies, view audit logs              |

---

## Features by Role

### Student
- Register and build a profile (university, GPA, skills)
- Upload documents (resume, transcript, cover letter, etc.)
- Browse open internship positions (expired positions hidden automatically)
- Apply to positions and track application status
- View scheduled interviews with countdown timer
- Receive notifications (accepted, rejected, reviewed, deadline alerts)
- Send supervision requests to supervisors

### Company
- Register and await admin verification
- Post internship positions with deadlines and required skills
- Review incoming applications and attached documents
- Schedule interviews for applicants
- Update application status (accept / reject / review)
- Receive notifications when students apply

### Supervisor
- View and respond to student supervision requests
- Monitor assigned interns' progress
- Submit evaluations with scores and feedback
- Receive supervisor notifications

### Admin
- View and manage all user accounts
- Verify or reject company registrations
- View full audit log of system actions (create, update, delete)
- Access platform-wide statistics

---

## API Endpoints Summary

| Prefix                        | Description                     |
|-------------------------------|---------------------------------|
| `/api/auth`                   | Register, login, token refresh  |
| `/api/students`               | Student profile management      |
| `/api/companies`              | Company profile management      |
| `/api/supervisors`            | Supervisor profile management   |
| `/api/positions`              | Internship position CRUD        |
| `/api/applications`           | Apply, review, update status    |
| `/api/interviews`             | Schedule and view interviews    |
| `/api/evaluations`            | Submit and view evaluations     |
| `/api/notifications`          | Student & company notifications |
| `/api/documents`              | Upload and manage documents     |
| `/api/interns`                | Active intern records           |
| `/api/supervision-requests`   | Request and respond to supervision |
| `/api/supervisor-notifications` | Supervisor notification feed  |
| `/api/universities`           | University list                 |
| `/api/skills`                 | Skill list                      |
| `/api/admin`                  | Admin controls and audit log    |

---

## Database Schema Overview

The database contains **16 tables**:

| Table                  | Purpose                                      |
|------------------------|----------------------------------------------|
| `UserAccount`          | Authentication — stores role, email, password hash |
| `Student`              | Student profile linked to UserAccount        |
| `Company`              | Company profile with verification status     |
| `Supervisor`           | Supervisor profile                           |
| `Admin`                | Admin profile                                |
| `University`           | University reference data                    |
| `Skill`                | Skill reference data                         |
| `InternPosition`       | Internship job postings                      |
| `PositionSkill`        | Junction table — position ↔ required skills  |
| `Application`          | Student applications to positions            |
| `ApplicationDocument`  | Junction table — application ↔ documents     |
| `Document`             | Student uploaded documents                   |
| `Interview`            | Scheduled interviews per application         |
| `InternInfo`           | Intern records for accepted students         |
| `Evaluation`           | Supervisor evaluations of interns            |
| `Notification`         | System notifications for students & companies |
| `SupervisionRequest`   | Student ↔ supervisor supervision requests    |
| `SupervisorNotification` | Notifications for supervisors              |
| `AuditLog`             | Admin-level record of all data changes       |

---

## Common Errors

| Error | Fix |
|-------|-----|
| `uvicorn: command not found` | Make sure your virtual environment is activated |
| `Access denied for user 'root'` | Check `DB_PASSWORD` in your `.env` file |
| `Table doesn't exist` | Run the schema SQL in MySQL Workbench first |
| CORS error in browser | Make sure the backend is running on port 8000 |
| `npm: command not found` | Install Node.js from https://nodejs.org |

---

## Course

This project was developed as a **Database Systems** course project, demonstrating:
- Relational database design with normalization
- Entity-Relationship (ER) modeling
- SQL query design (SELECT, JOIN, aggregate functions)
- Index optimization for query performance
- Junction/many-to-many table design
- ORM mapping with SQLAlchemy

---

*Built with FastAPI · MySQL · React · Vite · Tailwind CSS*
