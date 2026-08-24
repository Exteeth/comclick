import { NextResponse } from "next/server";
import { getNeonSql, isNeonConfigured } from "@/lib/neon";
import { DEPARTMENTS } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    if (!isNeonConfigured()) {
      return NextResponse.json({
        success: false,
        message: "DATABASE_URL is not configured yet. Please add it to your .env.local file.",
      }, { status: 400 });
    }

    const sql = getNeonSql();
    if (!sql) {
      return NextResponse.json({
        success: false,
        message: "Failed to initialize Neon SQL client.",
      }, { status: 500 });
    }

    // 1. Create Enums
    await sql`
      DO $$ BEGIN
        CREATE TYPE application_status AS ENUM (
          'submitted',
          'under_review',
          'interview_eligible',
          'interview_passed',
          'reserved',
          'confirmed',
          'rejected'
        );
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    // 2. Create Departments Table
    await sql`
      CREATE TABLE IF NOT EXISTS departments (
        id VARCHAR(50) PRIMARY KEY,
        name_th VARCHAR(255) NOT NULL,
        name_en VARCHAR(255) NOT NULL,
        badge VARCHAR(100) NOT NULL,
        icon VARCHAR(50) NOT NULL,
        color VARCHAR(20) NOT NULL,
        short_desc TEXT NOT NULL,
        description TEXT NOT NULL,
        responsibilities JSONB DEFAULT '[]'::jsonb,
        qualifications JSONB DEFAULT '[]'::jsonb,
        open_slots INT NOT NULL DEFAULT 10,
        tags JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 3. Create Applications Table
    await sql`
      CREATE TABLE IF NOT EXISTS applications (
        id VARCHAR(50) PRIMARY KEY,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        title_th VARCHAR(20) NOT NULL,
        full_name_th VARCHAR(255) NOT NULL,
        nickname_th VARCHAR(100) NOT NULL,
        full_name_en VARCHAR(255),
        student_id VARCHAR(50) NOT NULL,
        faculty VARCHAR(255) NOT NULL,
        major VARCHAR(255) NOT NULL,
        year VARCHAR(50) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        line_id VARCHAR(100) NOT NULL,
        facebook_or_ig VARCHAR(255),
        emergency_contact JSONB NOT NULL,
        shirt_size VARCHAR(10) NOT NULL,
        diet VARCHAR(100) NOT NULL,
        diet_note TEXT,
        medical_conditions TEXT,
        can_join_preparation BOOLEAN DEFAULT TRUE,
        can_join_camp_dates BOOLEAN DEFAULT TRUE,
        first_choice_dept_id VARCHAR(50) REFERENCES departments(id) ON DELETE SET NULL,
        second_choice_dept_id VARCHAR(50) REFERENCES departments(id) ON DELETE SET NULL,
        assigned_dept_id VARCHAR(50) REFERENCES departments(id) ON DELETE SET NULL,
        reason_to_apply TEXT NOT NULL,
        past_experience TEXT NOT NULL,
        skills_and_strengths TEXT NOT NULL,
        problem_solving_scenario TEXT NOT NULL,
        portfolio_url TEXT,
        status VARCHAR(50) DEFAULT 'submitted',
        status_notes TEXT,
        interview_date VARCHAR(255),
        interview_location VARCHAR(255)
      );
    `;

    // 4. Run ALTER TABLE Migrations for newly added columns
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS facebook_name VARCHAR(255);`;
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS facebook_url TEXT;`;
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS fallback_dept_choice TEXT;`;
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS strengths TEXT;`;
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS weaknesses TEXT;`;
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS tech_portfolio_url TEXT;`;
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS has_car VARCHAR(50);`;
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS car_type VARCHAR(100);`;
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS car_type_other VARCHAR(255);`;
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS status_notes TEXT;`;
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS interview_date VARCHAR(255);`;
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS interview_location VARCHAR(255);`;
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS assigned_dept_id VARCHAR(50);`;
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS first_choice_dept_id VARCHAR(50);`;
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS second_choice_dept_id VARCHAR(50);`;
    await sql`ALTER TABLE applications ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'submitted';`;

    // 5. Create Indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_apps_student_id ON applications(student_id);`;
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_apps_student_id_unique ON applications(student_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_apps_phone ON applications(phone);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_apps_status ON applications(status);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_apps_created_at ON applications(created_at DESC);`;

    // 5. Seed Departments into Neon DB
    for (const d of DEPARTMENTS) {
      await sql`
        INSERT INTO departments (
          id, name_th, name_en, badge, icon, color, short_desc, description,
          responsibilities, qualifications, open_slots, tags
        ) VALUES (
          ${d.id}, ${d.nameTh}, ${d.nameEn}, ${d.badge}, ${d.icon}, ${d.color},
          ${d.shortDesc}, ${d.description}, ${JSON.stringify(d.responsibilities)},
          ${JSON.stringify(d.qualifications)}, ${d.openSlots}, ${JSON.stringify(d.tags)}
        )
        ON CONFLICT (id) DO UPDATE SET
          name_th = EXCLUDED.name_th,
          name_en = EXCLUDED.name_en,
          description = EXCLUDED.description,
          short_desc = EXCLUDED.short_desc;
      `;
    }

    return NextResponse.json({
      success: true,
      message: "Neon Database tables and initial department data created successfully!",
    });
  } catch (error: any) {
    console.error("Failed to initialize database:", error);
    return NextResponse.json({
      success: false,
      error: error.message || "Failed to initialize database",
    }, { status: 500 });
  }
}
