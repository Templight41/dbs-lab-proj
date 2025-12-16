-- Teachers table
CREATE TABLE IF NOT EXISTS teachers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  teacher_id INTEGER NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  roll_number VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id SERIAL PRIMARY KEY,
  student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id INTEGER NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, subject_id, date)
);

-- Insert sample data for teachers
INSERT INTO teachers (name, email) VALUES
  ('Dr. Smith', 'smith@school.com'),
  ('Prof. Johnson', 'johnson@school.com'),
  ('Ms. Davis', 'davis@school.com')
ON CONFLICT (email) DO NOTHING;

-- Insert sample data for subjects
INSERT INTO subjects (name, teacher_id) VALUES
  ('Mathematics', 1),
  ('Physics', 1),
  ('Chemistry', 2),
  ('Biology', 2),
  ('English', 3),
  ('History', 3)
ON CONFLICT DO NOTHING;

-- Insert sample data for students
INSERT INTO students (name, roll_number) VALUES
  ('Alice Johnson', 'STU001'),
  ('Bob Smith', 'STU002'),
  ('Charlie Brown', 'STU003'),
  ('Diana Prince', 'STU004'),
  ('Ethan Hunt', 'STU005'),
  ('Fiona Apple', 'STU006'),
  ('George Martin', 'STU007'),
  ('Hannah Montana', 'STU008'),
  ('Isaac Newton', 'STU009'),
  ('Julia Roberts', 'STU010')
ON CONFLICT (roll_number) DO NOTHING;
