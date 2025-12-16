'use client';

import { useState, useEffect } from 'react';

interface Teacher {
  id: number;
  name: string;
  email: string;
}

interface Subject {
  id: number;
  name: string;
}

interface Student {
  id: number;
  name: string;
  roll_number: string;
}

interface AttendanceRecord {
  studentId: number;
  status: 'present' | 'absent';
}

export default function AttendancePage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<number | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [attendance, setAttendance] = useState<Map<number, 'present' | 'absent'>>(
    new Map()
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch teachers on mount
  useEffect(() => {
    fetchTeachers();
    fetchStudents();
  }, []);

  // Fetch subjects when teacher changes
  useEffect(() => {
    if (selectedTeacher) {
      fetchSubjects(selectedTeacher);
    } else {
      setSubjects([]);
      setSelectedSubject(null);
    }
  }, [selectedTeacher]);

  // Load existing attendance when subject or date changes
  useEffect(() => {
    if (selectedSubject && selectedDate) {
      loadExistingAttendance(selectedSubject, selectedDate);
    } else {
      setAttendance(new Map());
    }
  }, [selectedSubject, selectedDate]);

  async function fetchTeachers() {
    try {
      const res = await fetch('/api/teachers');
      const data = await res.json();
      if (data.success) {
        setTeachers(data.data);
      }
    } catch (error) {
      showMessage('error', 'Failed to fetch teachers');
    }
  }

  async function fetchSubjects(teacherId: number) {
    try {
      const res = await fetch(`/api/subjects?teacherId=${teacherId}`);
      const data = await res.json();
      if (data.success) {
        setSubjects(data.data);
      }
    } catch (error) {
      showMessage('error', 'Failed to fetch subjects');
    }
  }

  async function fetchStudents() {
    try {
      const res = await fetch('/api/students');
      const data = await res.json();
      if (data.success) {
        setStudents(data.data);
      }
    } catch (error) {
      showMessage('error', 'Failed to fetch students');
    }
  }

  async function loadExistingAttendance(subjectId: number, date: string) {
    try {
      const res = await fetch(`/api/attendance?subjectId=${subjectId}&date=${date}`);
      const data = await res.json();
      if (data.success && data.data.length > 0) {
        const attendanceMap = new Map<number, 'present' | 'absent'>();
        data.data.forEach((record: any) => {
          attendanceMap.set(record.student_id, record.status);
        });
        setAttendance(attendanceMap);
      } else {
        setAttendance(new Map());
      }
    } catch (error) {
      console.error('Failed to load attendance:', error);
    }
  }

  function toggleAttendance(studentId: number) {
    const newAttendance = new Map(attendance);
    const currentStatus = newAttendance.get(studentId);

    if (currentStatus === 'present') {
      newAttendance.set(studentId, 'absent');
    } else if (currentStatus === 'absent') {
      newAttendance.delete(studentId);
    } else {
      newAttendance.set(studentId, 'present');
    }

    setAttendance(newAttendance);
  }

  async function handleSubmit() {
    if (!selectedTeacher || !selectedSubject) {
      showMessage('error', 'Please select teacher and subject');
      return;
    }

    setLoading(true);
    try {
      const attendanceRecords: AttendanceRecord[] = students.map(student => ({
        studentId: student.id,
        status: attendance.get(student.id) || 'absent'
      }));

      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: selectedTeacher,
          subjectId: selectedSubject,
          date: selectedDate,
          attendanceRecords
        })
      });

      const data = await res.json();
      if (data.success) {
        showMessage('success', 'Attendance marked successfully!');
      } else {
        showMessage('error', data.error || 'Failed to mark attendance');
      }
    } catch (error) {
      showMessage('error', 'Failed to submit attendance');
    } finally {
      setLoading(false);
    }
  }

  function showMessage(type: 'success' | 'error', text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Attendance Registry</h1>

        {message && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Teacher
              </label>
              <select
                style={{color: 'black'}}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedTeacher || ''}
                onChange={(e) => setSelectedTeacher(Number(e.target.value) || null)}
              >
                <option value="">Choose a teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Subject
              </label>
              <select
                style={{color: 'black'}}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedSubject || ''}
                onChange={(e) => setSelectedSubject(Number(e.target.value) || null)}
                disabled={!selectedTeacher}
              >
                <option value="">Choose a subject</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                style={{color: 'black'}}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {selectedSubject && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Mark Attendance
            </h2>

            <div className="space-y-2 mb-6">
              {students.map((student) => {
                const status = attendance.get(student.id);
                return (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div>
                      <div className="font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.roll_number}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const newAttendance = new Map(attendance);
                          newAttendance.set(student.id, 'present');
                          setAttendance(newAttendance);
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          status === 'present'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        onClick={() => {
                          const newAttendance = new Map(attendance);
                          newAttendance.set(student.id, 'absent');
                          setAttendance(newAttendance);
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          status === 'absent'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Present: {Array.from(attendance.values()).filter(s => s === 'present').length} / {students.length}
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Saving...' : 'Save Attendance'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
