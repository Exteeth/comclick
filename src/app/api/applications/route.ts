import { NextResponse } from "next/server";
import { getApplications, addApplication } from "@/lib/storage";
import { getNeonSql, isNeonConfigured } from "@/lib/neon";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    // If Neon Postgres is configured, we can query Neon directly
    if (isNeonConfigured()) {
      const sql = getNeonSql();
      if (sql) {
        try {
          const rows = await sql`SELECT * FROM applications ORDER BY created_at DESC LIMIT 100`;
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
    if (!body.fullNameTh || !body.studentId || !body.firstChoiceDeptId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Save to Neon DB if connected
    if (isNeonConfigured()) {
      const sql = getNeonSql();
      if (sql) {
        try {
          const year = new Date().getFullYear();
          const randomNum = Math.floor(1000 + Math.random() * 9000);
          const id = `CC20-${year}-${randomNum}`;

          await sql`
            INSERT INTO applications (
              id, title_th, full_name_th, nickname_th, student_id, faculty, major, year,
              phone, line_id, emergency_contact, shirt_size, diet, first_choice_dept_id,
              second_choice_dept_id, reason_to_apply, past_experience, skills_and_strengths,
              problem_solving_scenario, portfolio_url
            ) VALUES (
              ${id}, ${body.titleTh}, ${body.fullNameTh}, ${body.nicknameTh}, ${body.studentId},
              ${body.faculty}, ${body.major}, ${body.year}, ${body.phone}, ${body.lineId},
              ${JSON.stringify(body.emergencyContact)}, ${body.shirtSize}, ${body.diet},
              ${body.firstChoiceDeptId}, ${body.secondChoiceDeptId}, ${body.reasonToApply},
              ${body.pastExperience || ""}, ${body.skillsAndStrengths}, ${body.problemSolvingScenario},
              ${body.portfolioUrl || ""}
            )
          `;
          return NextResponse.json({ success: true, source: "neon", id });
        } catch (dbErr) {
          console.warn("Neon insert failed, fallback to local store", dbErr);
        }
      }
    }

    const created = addApplication(body);
    return NextResponse.json({ success: true, source: "memory_store", data: created });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create application" },
      { status: 500 }
    );
  }
}
