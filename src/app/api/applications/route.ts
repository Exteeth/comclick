import { NextResponse } from "next/server";
import {
  getApplications,
  addApplication,
  updateApplicationFull,
  deleteApplication,
} from "@/lib/storage";
import { getNeonSql, isNeonConfigured } from "@/lib/neon";
import { CAMP_INFO } from "@/lib/constants";

export async function GET(request: Request) {
  try {
    // If Neon Postgres is configured, query Neon directly
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
              diet,
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
            ORDER BY created_at DESC 
            LIMIT 500
          `;
          return NextResponse.json({ success: true, source: "neon", data: rows });
        } catch (dbErr) {
          console.warn("Neon query failed, falling back to local store:", dbErr);
        }
      }
    }

    const apps = getApplications();
    return NextResponse.json({
      success: true,
      source: "memory_store",
      count: apps.length,
      data: apps,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.fullNameTh || !body.studentId || !body.phone || !body.major || !body.firstChoiceDeptId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const id = `CC20-${year}-${randomNum}`;

    // Save to Neon DB if connected
    if (isNeonConfigured()) {
      const sql = getNeonSql();
      if (sql) {
        try {
          await sql`
            INSERT INTO applications (
              id, title_th, full_name_th, nickname_th, student_id, faculty, major, year,
              phone, line_id, emergency_contact, shirt_size, diet, first_choice_dept_id,
              second_choice_dept_id, fallback_dept_choice, reason_to_apply, past_experience,
              skills_and_strengths, problem_solving_scenario, portfolio_url
            ) VALUES (
              ${id},
              ${body.titleTh || "คุณ"},
              ${body.fullNameTh},
              ${body.nicknameTh || body.fullNameTh.split(" ")[0] || "พี่ค่าย"},
              ${body.studentId},
              ${body.faculty || "คณะศึกษาศาสตร์"},
              ${body.major},
              ${body.year || "ไม่ระบุ"},
              ${body.phone},
              ${body.lineId || "-"},
              ${JSON.stringify(body.emergencyContact || { name: "-", relation: "-", phone: "-" })},
              ${body.shirtSize || "L"},
              ${body.diet || "ทั่วไป (อาหารปกติ)"},
              ${body.firstChoiceDeptId},
              ${body.secondChoiceDeptId || body.firstChoiceDeptId},
              ${body.fallbackDeptChoice || "ยินดีรับทุกฝ่ายตามที่คณะกรรมการจัดสรร"},
              ${body.reasonToApply || "สมัครเข้าร่วมเป็นพี่ค่าย ComClick Camp 20"},
              ${body.pastExperience || ""},
              ${body.skillsAndStrengths || ""},
              ${body.problemSolvingScenario || ""},
              ${body.portfolioUrl || ""}
            )
          `;
          return NextResponse.json({ success: true, source: "neon", id });
        } catch (dbErr) {
          console.warn("Neon insert failed, fallback to local store", dbErr);
        }
      }
    }

    const created = addApplication({
      ...body,
      fallbackDeptChoice: body.fallbackDeptChoice || "ยินดีรับทุกฝ่ายตามที่คณะกรรมการจัดสรร",
    });
    return NextResponse.json({ success: true, source: "memory_store", data: created });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create application" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing application id" }, { status: 400 });
    }

    // 1. Update Neon DB if configured
    if (isNeonConfigured()) {
      const sql = getNeonSql();
      if (sql) {
        try {
          await sql`
            UPDATE applications SET
              full_name_th = COALESCE(${body.fullNameTh}, full_name_th),
              student_id = COALESCE(${body.studentId}, student_id),
              phone = COALESCE(${body.phone}, phone),
              major = COALESCE(${body.major}, major),
              diet = COALESCE(${body.diet}, diet),
              first_choice_dept_id = COALESCE(${body.firstChoiceDeptId}, first_choice_dept_id),
              second_choice_dept_id = COALESCE(${body.secondChoiceDeptId}, second_choice_dept_id),
              fallback_dept_choice = COALESCE(${body.fallbackDeptChoice}, fallback_dept_choice),
              assigned_dept_id = COALESCE(${body.assignedDeptId}, assigned_dept_id),
              status = COALESCE(${body.status}, status),
              interview_date = COALESCE(${body.interviewDate}, interview_date),
              interview_location = COALESCE(${body.interviewLocation}, interview_location),
              status_notes = COALESCE(${body.statusNotes}, status_notes),
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
          `;
        } catch (dbErr) {
          console.warn("Neon update failed:", dbErr);
        }
      }
    }

    // 2. Update local store
    const updated = updateApplicationFull(id, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update application" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing application id" }, { status: 400 });
    }

    // 1. Delete from Neon DB if configured
    if (isNeonConfigured()) {
      const sql = getNeonSql();
      if (sql) {
        try {
          await sql`DELETE FROM applications WHERE id = ${id}`;
        } catch (dbErr) {
          console.warn("Neon delete failed:", dbErr);
        }
      }
    }

    // 2. Delete from local store
    deleteApplication(id);
    return NextResponse.json({ success: true, message: `Application ${id} deleted` });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete application" }, { status: 500 });
  }
}
