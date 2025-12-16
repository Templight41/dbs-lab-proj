import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { teacherId, subjectId, date, attendanceRecords } = body;

    if (!teacherId || !subjectId || !date || !attendanceRecords || !Array.isArray(attendanceRecords)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request body'
        },
        { status: 400 }
      );
    }

    // Delete existing attendance for this subject and date
    await query(
      'DELETE FROM attendance WHERE subject_id = $1 AND date = $2',
      [subjectId, date]
    );

    // Insert new attendance records
    for (const record of attendanceRecords) {
      await query(
        `INSERT INTO attendance (student_id, subject_id, teacher_id, date, status)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (student_id, subject_id, date)
         DO UPDATE SET status = EXCLUDED.status, teacher_id = EXCLUDED.teacher_id`,
        [record.studentId, subjectId, teacherId, date, record.status]
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Attendance marked successfully'
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get('subjectId');
    const date = searchParams.get('date');

    if (!subjectId || !date) {
      return NextResponse.json(
        {
          success: false,
          error: 'subjectId and date are required'
        },
        { status: 400 }
      );
    }

    const result = await query(
      `SELECT a.id, a.student_id, a.status, s.name, s.roll_number
       FROM attendance a
       JOIN students s ON a.student_id = s.id
       WHERE a.subject_id = $1 AND a.date = $2
       ORDER BY s.roll_number`,
      [subjectId, date]
    );

    return NextResponse.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
