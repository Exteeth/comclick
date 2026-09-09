import { NextResponse } from "next/server";
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
              title_th as "titleTh",
              full_name_th as "fullNameTh",
              nickname_th as "nicknameTh",
              student_id as "studentId",
              year,
              phone,
              major,
              faculty,
              diet,
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
              kku_mail as "kkuMail",
              medical_conditions as "medicalConditions",
              drug_allergies as "drugAllergies",
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
              OR nickname_th ILIKE ${'%' + clean + '%'}
              OR facebook_name ILIKE ${'%' + clean + '%'}
            ORDER BY created_at DESC
            LIMIT 1
          `;

          if (rows && rows.length > 0) {
            return NextResponse.json(
              {
                success: true,
                source: "neon_realtime",
                data: rows[0],
              },
              {
                headers: {
                  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
                },
              }
            );
          } else {
            return NextResponse.json(
              {
                success: false,
                error: "ไม่พบข้อมูลใบสมัคร กรุณาตรวจสอบรหัสใบสมัคร รหัสนักศึกษา หรือเบอร์โทรศัพท์อีกครั้ง",
              },
              {
                status: 404,
                headers: {
                  "Cache-Control": "no-store, no-cache, must-revalidate",
                },
              }
            );
          }
        } catch (dbErr: any) {
          console.error("Neon status query error:", dbErr);
          return NextResponse.json(
            { success: false, error: "เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล กรุณาลองใหม่อีกครั้ง" },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "ไม่พบข้อมูลใบสมัครในระบบ",
      },
      {
        status: 404,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
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
    const {
      id,
      action,
      kkuMail,
      medicalConditions,
      drugAllergies,
      phone,
      facebookName,
      facebookUrl,
      nicknameTh,
      diet,
    } = body;

    if (!id || action !== "confirm_rights") {
      return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
    }

    const cleanKkuMail = kkuMail ? String(kkuMail).trim() : null;
    const cleanMedical = medicalConditions ? String(medicalConditions).trim() : "ไม่มี";
    const cleanAllergies = drugAllergies ? String(drugAllergies).trim() : "ไม่มี";

    // Optional / updated applicant details (supporting applicants added manually by admin or updating contact info)
    const cleanPhone = phone ? String(phone).replace(/\D/g, "").slice(0, 15) : null;
    const cleanFbName = facebookName !== undefined ? String(facebookName).trim() : null;
    const cleanFbUrl = facebookUrl !== undefined ? String(facebookUrl).trim() : null;
    const cleanNickname = nicknameTh !== undefined ? String(nicknameTh).trim() : null;
    const cleanDiet = diet !== undefined ? String(diet).trim() : null;

    // Update in Neon DB
    if (isNeonConfigured()) {
      const sql = getNeonSql();
      if (sql) {
        try {
          await sql`
            UPDATE applications
            SET 
              status = 'CONFIRMED',
              kku_mail = ${cleanKkuMail},
              medical_conditions = ${cleanMedical},
              drug_allergies = ${cleanAllergies},
              phone = COALESCE(${cleanPhone}, phone),
              facebook_name = COALESCE(${cleanFbName}, facebook_name),
              facebook_url = COALESCE(${cleanFbUrl}, facebook_url),
              nickname_th = COALESCE(${cleanNickname}, nickname_th),
              diet = COALESCE(${cleanDiet}, diet),
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ${id}
          `;

          // Add audit log entry if table exists
          try {
            await sql`
              INSERT INTO application_logs (application_id, previous_status, new_status, changed_by, notes)
              VALUES (${id}, 'ACCEPTED', 'CONFIRMED', 'Applicant (Self-Confirmation)', ${`KKU Mail: ${cleanKkuMail || '-'}, โทร: ${cleanPhone || '-'}, อาหาร: ${cleanDiet || '-'}, โรคประจำตัว: ${cleanMedical}, แพ้ยา: ${cleanAllergies}`})
            `;
          } catch (logErr) {
            // Ignore if log table not present
          }
        } catch (dbErr) {
          console.warn("Neon confirm rights update failed:", dbErr);
          return NextResponse.json({ success: false, error: "ไม่สามารถบันทึกข้อมูลการยืนยันสิทธิ์ลงฐานข้อมูลได้" }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: "Confirmed rights successfully",
      data: {
        kkuMail: cleanKkuMail,
        medicalConditions: cleanMedical,
        drugAllergies: cleanAllergies,
        phone: cleanPhone,
        facebookName: cleanFbName,
        facebookUrl: cleanFbUrl,
        nicknameTh: cleanNickname,
        diet: cleanDiet,
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to confirm rights" }, { status: 500 });
  }
}
