import { NextResponse } from "next/server";
import { findApplication } from "@/lib/storage";
import { getNeonSql, isNeonConfigured } from "@/lib/neon";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || searchParams.get("query") || "";

    if (!query.trim()) {
      return NextResponse.json({ success: false, error: "Missing query" }, { status: 400 });
    }

    const clean = query.trim();
    const cleanNoDash = clean.replace(/-/g, "");

    // 1. Check Neon Serverless Postgres DB in real-time
    if (isNeonConfigured()) {
      const sql = getNeonSql();
      if (sql) {
        try {
          const rows = await sql`
            SELECT 
              id,
              full_name_th as "fullNameTh",
              student_id as "studentId",
              phone,
              major,
              faculty,
              first_choice_dept_id as "firstChoiceDeptId",
              second_choice_dept_id as "secondChoiceDeptId",
              fallback_dept_choice as "fallbackDeptChoice",
              assigned_dept_id as "assignedDeptId",
              status,
              status_notes as "statusNotes",
              interview_date as "interviewDate",
              interview_location as "interviewLocation",
              created_at as "createdAt",
              updated_at as "updatedAt"
            FROM applications
            WHERE 
              LOWER(id) = LOWER(${clean})
              OR REPLACE(student_id, '-', '') = ${cleanNoDash}
              OR student_id ILIKE ${'%' + clean + '%'}
              OR REPLACE(phone, '-', '') = ${cleanNoDash}
              OR phone ILIKE ${'%' + clean + '%'}
              OR full_name_th ILIKE ${'%' + clean + '%'}
            ORDER BY created_at DESC
            LIMIT 1
          `;

          if (rows && rows.length > 0) {
            return NextResponse.json({
              success: true,
              source: "neon_realtime",
              data: rows[0],
            }, {
              headers: {
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
              },
            });
          }
        } catch (dbErr) {
          console.warn("Neon status query failed, checking memory store:", dbErr);
        }
      }
    }

    // 2. Fallback to local memory storage
    const found = findApplication(clean);
    if (found) {
      return NextResponse.json({
        success: true,
        source: "memory_store",
        data: found,
      }, {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
    }

    return NextResponse.json({
      success: false,
      error: "Application not found",
    }, {
      status: 404,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  // Confirm rights endpoint
  try {
    const body = await request.json();
    const { id, action } = body;

    if (!id || action !== "confirm_rights") {
      return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    }

    // Update in Neon DB
    if (isNeonConfigured()) {
      const sql = getNeonSql();
      if (sql) {
        try {
          await sql`
            UPDATE applications
            SET status = 'CONFIRMED', updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
          `;
        } catch (dbErr) {
          console.warn("Neon confirm rights update failed:", dbErr);
        }
      }
    }

    return NextResponse.json({ success: true, message: "Confirmed rights successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to confirm rights" }, { status: 500 });
  }
}
