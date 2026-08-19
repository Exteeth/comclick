-- ==============================================================================
-- ComClick Camp 20 - Neon PostgreSQL Database Schema
-- Database: PostgreSQL (Neon Serverless)
-- ==============================================================================

-- 1. Create Enums
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

-- 2. Departments Table
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

-- 3. Applications Table (Streamlined 6 Core Registration Fields)
CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(50) PRIMARY KEY, -- e.g. CC20-2026-8942
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    -- 6 Core Registration Fields
    full_name_th VARCHAR(255) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    major VARCHAR(255) NOT NULL,
    first_choice_dept_id VARCHAR(50) REFERENCES departments(id) ON DELETE SET NULL,
    second_choice_dept_id VARCHAR(50) REFERENCES departments(id) ON DELETE SET NULL,
    fallback_dept_choice TEXT DEFAULT 'ยินดีรับทุกฝ่ายตามที่คณะกรรมการจัดสรร',

    -- Optional / Extended Fields
    title_th VARCHAR(20),
    nickname_th VARCHAR(100),
    full_name_en VARCHAR(255),
    faculty VARCHAR(255) DEFAULT 'คณะศึกษาศาสตร์',
    year VARCHAR(50),
    line_id VARCHAR(100),
    facebook_or_ig VARCHAR(255),
    emergency_contact JSONB,

    shirt_size VARCHAR(10),
    diet VARCHAR(100),
    diet_note TEXT,
    medical_conditions TEXT,
    can_join_preparation BOOLEAN DEFAULT TRUE,
    can_join_camp_dates BOOLEAN DEFAULT TRUE,

    reason_to_apply TEXT,
    past_experience TEXT,
    skills_and_strengths TEXT,
    problem_solving_scenario TEXT,
    portfolio_url TEXT,

    -- Status & Administrative
    status VARCHAR(50) DEFAULT 'submitted',
    status_notes TEXT,
    interview_date VARCHAR(255),
    interview_location VARCHAR(255),
    assigned_dept_id VARCHAR(50) REFERENCES departments(id) ON DELETE SET NULL
);

-- 4. Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_apps_student_id ON applications(student_id);
CREATE INDEX IF NOT EXISTS idx_apps_phone ON applications(phone);
CREATE INDEX IF NOT EXISTS idx_apps_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_apps_first_choice ON applications(first_choice_dept_id);
CREATE INDEX IF NOT EXISTS idx_apps_created_at ON applications(created_at DESC);

-- 5. Audit / Status History Log Table
CREATE TABLE IF NOT EXISTS application_logs (
    id SERIAL PRIMARY KEY,
    application_id VARCHAR(50) REFERENCES applications(id) ON DELETE CASCADE,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_by VARCHAR(100) DEFAULT 'System / Admin',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
