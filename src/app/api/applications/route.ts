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
              title_th as "titleTh",
              full_name_th as "fullNameTh",
              nickname_th as "nicknameTh",
              student_id as "studentId",
              faculty,
              major,
              year,
              phone,
              facebook_name as "facebookName",
              facebook_url as "facebookUrl",
              reason_to_apply as "reasonToApply",
              strengths,
              weaknesses,
              first_choice_dept_id as "firstChoiceDeptId",
              second_choice_dept_id as "secondChoiceDeptId",
              fallback_dept_choice as "fallbackDeptChoice",
              tech_portfolio_url as "techPortfolioUrl",
              has_car as "hasCar",
              car_type as "carType",
              car_type_other as "carTypeOther",
              diet,
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

    // Validate required core fields
    if (!body.fullNameTh || !body.studentId || !body.phone || !body.major || !body.firstChoiceDeptId) {
      return NextResponse.json(
        { success: false, error: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน" },
        { status: 400 }
      );
    }

    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const id = `CC20-${year}-${randomNum}`;

    const cleanFirstChoice = body.firstChoiceDeptId?.trim() || null;
    const cleanSecondChoice = body.secondChoiceDeptId?.trim() || cleanFirstChoice;
    const cleanFullName = body.fullNameTh.trim();
    const cleanNickname = body.nicknameTh?.trim() || "";
    const cleanFaculty = body.faculty?.trim() || "คณะศึกษาศาสตร์";
    const cleanMajor = body.major.trim();
    const cleanYear = body.year?.trim() || "ชั้นปีที่ 1";
    const cleanDiet = body.diet?.trim() || "ทานได้ทุกอย่าง (ไม่แพ้อาหาร)";

    // Strict Student ID Validation (10 digits -> XXXXXXXXX-X)
    const rawStudentDigits = String(body.studentId).replace(/\D/g, "");
    if (rawStudentDigits.length !== 10) {
      return NextResponse.json(
        { success: false, error: "รหัสนักศึกษาต้องเป็นตัวเลข 10 หลัก (รูปแบบ 663050123-4)" },
        { status: 400 }
      );
    }
    const cleanStudentId = `${rawStudentDigits.slice(0, 9)}-${rawStudentDigits.slice(9, 10)}`;

    // Strict Phone Number Validation (10 digits starting with 0)
    const rawPhoneDigits = String(body.phone).replace(/\D/g, "");
    if (rawPhoneDigits.length !== 10 || !rawPhoneDigits.startsWith("0")) {
      return NextResponse.json(
        { success: false, error: "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลักที่ถูกต้อง (ไม่มีขีด เช่น 0812345678)" },
        { status: 400 }
      );
    }
    const cleanPhone = rawPhoneDigits;

    // Check for existing duplicate student ID in Neon DB
    if (isNeonConfigured()) {
      const sql = getNeonSql();
      if (sql) {
        try {
          const existing = await sql`
            SELECT id, full_name_th 
            FROM applications 
            WHERE REPLACE(student_id, '-', '') = ${rawStudentDigits}
            LIMIT 1
          `;
          if (existing && existing.length > 0) {
            return NextResponse.json(
              {
                success: false,
                duplicate: true,
                existingId: existing[0].id,
                error: `รหัสนักศึกษานี้ (${cleanStudentId}) ได้ทำการส่งใบสมัครเข้าระบบเรียบร้อยแล้ว (รหัสใบสมัคร: ${existing[0].id}) สามารถตรวจสอบสถานะได้ที่เมนูตรวจสอบสถานะ`,
              },
              { status: 409 }
            );
          }
        } catch (dbCheckErr) {
          console.warn("Neon duplicate check error:", dbCheckErr);
        }
      }
    }

    // Save to Neon DB if connected
    if (isNeonConfigured()) {
      const sql = getNeonSql();
      if (sql) {
        try {
          await sql`
            INSERT INTO applications (
              id, title_th, full_name_th, nickname_th, student_id, faculty, major, year,
              phone, facebook_name, facebook_url, reason_to_apply, strengths, weaknesses,
              first_choice_dept_id, second_choice_dept_id, fallback_dept_choice,
              tech_portfolio_url, has_car, car_type, car_type_other, diet,
              status, created_at, updated_at
            ) VALUES (
              ${id},
              ${body.titleTh || "นาย"},
              ${cleanFullName},
              ${cleanNickname},
              ${cleanStudentId},
              ${cleanFaculty},
              ${cleanMajor},
              ${cleanYear},
              ${cleanPhone},
              ${body.facebookName || ""},
              ${body.facebookUrl || ""},
              ${body.reasonToApply || ""},
              ${body.strengths || ""},
              ${body.weaknesses || ""},
              ${cleanFirstChoice},
              ${cleanSecondChoice},
              ${body.fallbackDeptChoice || "ยินดีรับทุกฝ่ายตามที่คณะกรรมการจัดสรร"},
              ${body.techPortfolioUrl || ""},
              ${body.hasCar || ""},
              ${body.carType || ""},
              ${body.carTypeOther || ""},
              ${cleanDiet},
              'submitted',
              CURRENT_TIMESTAMP,
              CURRENT_TIMESTAMP
            )
          `;
          return NextResponse.json({ success: true, source: "neon", id });
        } catch (dbErr: any) {
          console.error("Neon insert error:", dbErr);
          // Fallback gracefully to memory store if schema mismatch
        }
      }
    }

    const created = addApplication({
      ...body,
      id,
      titleTh: body.titleTh || "นาย",
      fullNameTh: cleanFullName,
      nicknameTh: cleanNickname,
      studentId: cleanStudentId,
      phone: cleanPhone,
      faculty: cleanFaculty,
      major: cleanMajor,
      year: cleanYear,
      facebookName: body.facebookName || "",
      facebookUrl: body.facebookUrl || "",
      reasonToApply: body.reasonToApply || "",
      strengths: body.strengths || "",
      weaknesses: body.weaknesses || "",
      techPortfolioUrl: body.techPortfolioUrl || "",
      hasCar: body.hasCar || "",
      carType: body.carType || "",
      carTypeOther: body.carTypeOther || "",
      diet: cleanDiet,
      firstChoiceDeptId: cleanFirstChoice || "protocol",
      secondChoiceDeptId: cleanSecondChoice || "protocol",
      fallbackDeptChoice: body.fallbackDeptChoice || "ยินดีรับทุกฝ่ายตามที่คณะกรรมการจัดสรร",
    });
    return NextResponse.json({ success: true, source: "memory_store", id, data: created });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create application" },
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

    const assignedDeptIdClean = body.assignedDeptId && body.assignedDeptId.trim() !== "" ? body.assignedDeptId.trim() : null;
    const firstChoiceClean = body.firstChoiceDeptId && body.firstChoiceDeptId.trim() !== "" ? body.firstChoiceDeptId.trim() : null;
    const secondChoiceClean = body.secondChoiceDeptId && body.secondChoiceDeptId.trim() !== "" ? body.secondChoiceDeptId.trim() : null;

    // 1. Update Neon DB if configured
    if (isNeonConfigured()) {
      const sql = getNeonSql();
      if (sql) {
        try {
          await sql`
            UPDATE applications SET
              full_name_th = COALESCE(${body.fullNameTh !== undefined ? body.fullNameTh.trim() : null}, full_name_th),
              nickname_th = COALESCE(${body.nicknameTh !== undefined ? body.nicknameTh.trim() : null}, nickname_th),
              student_id = COALESCE(${body.studentId !== undefined ? body.studentId.trim() : null}, student_id),
              year = COALESCE(${body.year !== undefined ? body.year.trim() : null}, year),
              phone = COALESCE(${body.phone !== undefined ? body.phone.trim() : null}, phone),
              faculty = COALESCE(${body.faculty !== undefined ? body.faculty.trim() : null}, faculty),
              major = COALESCE(${body.major !== undefined ? body.major.trim() : null}, major),
              facebook_name = COALESCE(${body.facebookName !== undefined ? body.facebookName.trim() : null}, facebook_name),
              facebook_url = COALESCE(${body.facebookUrl !== undefined ? body.facebookUrl.trim() : null}, facebook_url),
              reason_to_apply = COALESCE(${body.reasonToApply !== undefined ? body.reasonToApply : null}, reason_to_apply),
              strengths = COALESCE(${body.strengths !== undefined ? body.strengths : null}, strengths),
              weaknesses = COALESCE(${body.weaknesses !== undefined ? body.weaknesses : null}, weaknesses),
              diet = COALESCE(${body.diet !== undefined ? body.diet.trim() : null}, diet),
              first_choice_dept_id = COALESCE(${firstChoiceClean}, first_choice_dept_id),
              second_choice_dept_id = COALESCE(${secondChoiceClean}, second_choice_dept_id),
              fallback_dept_choice = COALESCE(${body.fallbackDeptChoice !== undefined ? body.fallbackDeptChoice : null}, fallback_dept_choice),
              tech_portfolio_url = COALESCE(${body.techPortfolioUrl !== undefined ? body.techPortfolioUrl.trim() : null}, tech_portfolio_url),
              has_car = COALESCE(${body.hasCar !== undefined ? String(body.hasCar).trim() : null}, has_car),
              car_type = COALESCE(${body.carType !== undefined ? body.carType.trim() : null}, car_type),
              car_type_other = COALESCE(${body.carTypeOther !== undefined ? body.carTypeOther.trim() : null}, car_type_other),
              assigned_dept_id = ${assignedDeptIdClean},
              status = COALESCE(${body.status ? String(body.status).toLowerCase() : null}, status),
              interview_date = COALESCE(${body.interviewDate !== undefined ? body.interviewDate : null}, interview_date),
              interview_location = COALESCE(${body.interviewLocation !== undefined ? body.interviewLocation : null}, interview_location),
              status_notes = COALESCE(${body.statusNotes !== undefined ? body.statusNotes : null}, status_notes),
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
          `;
        } catch (dbErr: any) {
          console.error("Neon update error:", dbErr);
          return NextResponse.json(
            { success: false, error: dbErr.message || "Failed to update Neon DB" },
            { status: 500 }
          );
        }
      }
    }

    // 2. Update local store
    const updated = updateApplicationFull(id, {
      ...body,
      assignedDeptId: assignedDeptIdClean || undefined,
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to update application" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const all = searchParams.get("all");

    // Clear all applications
    if (all === "true" || id === "ALL") {
      if (isNeonConfigured()) {
        const sql = getNeonSql();
        if (sql) {
          try {
            await sql`DELETE FROM applications;`;
          } catch (dbErr: any) {
            console.error("Neon delete all error:", dbErr);
          }
        }
      }
      return NextResponse.json({ success: true, message: "ล้างข้อมูลผู้สมัครทั้งหมดเรียบร้อยแล้ว" });
    }

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing application id" }, { status: 400 });
    }

    // 1. Delete from Neon DB if configured
    if (isNeonConfigured()) {
      const sql = getNeonSql();
      if (sql) {
        try {
          await sql`DELETE FROM applications WHERE id = ${id}`;
        } catch (dbErr: any) {
          console.error("Neon delete error:", dbErr);
          return NextResponse.json({ success: false, error: dbErr.message }, { status: 500 });
        }
      }
    }

    // 2. Delete from local store
    deleteApplication(id);
    return NextResponse.json({ success: true, message: `Application ${id} deleted` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to delete application" }, { status: 500 });
  }
}
