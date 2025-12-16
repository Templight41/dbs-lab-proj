# Attendance Registry System - Setup Guide

A simple single-page attendance registry system built with Next.js and PostgreSQL.

## Prerequisites

- Node.js (v18 or higher)
- Docker (for PostgreSQL)
- PostgreSQL running on Docker at `localhost:5433`

## Database Setup

1. **Ensure PostgreSQL is running on Docker:**
   ```bash
   docker ps
   ```
   Make sure PostgreSQL is running on port 5433 with the credentials:
   - User: postgres
   - Password: 12abcdeF
   - Database: postgres

2. **Initialize the database schema:**
   Once the application is running, visit:
   ```
   http://localhost:3000/api/init-db
   ```
   This will create all necessary tables and insert sample data.

## Installation Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment variables are already configured in `.env.local`:**
   ```
   POSTGRES_URL="postgres://postgres:12abcdeF@localhost:5433/postgres?sslmode=disable"
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Application Features

### Teachers, Subjects, and Students
The system comes pre-loaded with:
- 3 sample teachers
- 6 subjects assigned to teachers
- 10 sample students

### How to Use

1. **Select a Teacher:** Choose from the dropdown list
2. **Select a Subject:** Based on the selected teacher, choose a subject
3. **Select Date:** Choose the date for attendance (defaults to today)
4. **Mark Attendance:**
   - Click "Present" to mark a student as present (green)
   - Click "Absent" to mark a student as absent (red)
   - Click again to toggle the status
5. **Save:** Click "Save Attendance" to submit

### Features
- Single-page application
- Real-time attendance counting
- Ability to view and edit previous attendance records
- Responsive design with Tailwind CSS

## Database Schema

### Tables
1. **teachers** - Stores teacher information
2. **subjects** - Stores subjects linked to teachers
3. **students** - Stores student information
4. **attendance** - Stores daily attendance records

## API Endpoints

- `GET /api/teachers` - Fetch all teachers
- `GET /api/subjects?teacherId={id}` - Fetch subjects by teacher
- `GET /api/students` - Fetch all students
- `GET /api/attendance?subjectId={id}&date={date}` - Get attendance for a subject and date
- `POST /api/attendance` - Submit attendance records
- `GET /api/init-db` - Initialize database schema

## Tech Stack

- **Frontend:** Next.js 16 with React 19
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL
- **Database Client:** node-postgres (pg)
- **Language:** TypeScript

## Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── attendance/route.ts    # Attendance API endpoints
│   │   ├── init-db/route.ts       # Database initialization
│   │   ├── students/route.ts      # Students API
│   │   ├── subjects/route.ts      # Subjects API
│   │   └── teachers/route.ts      # Teachers API
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main attendance page
├── lib/
│   ├── db.ts                      # Database utility functions
│   └── schema.sql                 # Database schema and sample data
└── .env.local                     # Environment variables
```

## Development Notes

- No ORM used - all database queries use raw SQL
- Reusable database utility functions in `lib/db.ts`
- Simple and clean code structure
- All API routes follow consistent error handling pattern
