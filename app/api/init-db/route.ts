import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    // Read and execute the schema SQL file
    const schemaPath = join(process.cwd(), 'lib', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    await query(schema);

    return NextResponse.json({
      success: true,
      message: 'Database initialized successfully'
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
