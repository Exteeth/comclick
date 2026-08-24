import { NextResponse } from "next/server";
import { DEPARTMENTS, CAMP_INFO } from "@/lib/constants";
import { getNeonSql, isNeonConfigured } from "@/lib/neon";
import { Application } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    let apps: Application[] = [];

    // Query live from Neon Database
    if (isNeonConfigured()) {
      const sql = getNeonSql();
      if (sql) {
        try {
          const rows = await sql`
            SELECT 
              id,
              first_choice_dept_id as "firstChoiceDeptId",
              second_choice_dept_id as "secondChoiceDeptId",
              assigned_dept_id as "assignedDeptId",
              status
            FROM applications
          `;
          apps = (rows || []) as Application[];
        } catch (dbErr: any) {
          console.error("Neon stats query error:", dbErr);
          return NextResponse.json(
            { success: false, error: "Failed to query database statistics" },
            { status: 500 }
          );
        }
      }
    }

    const totalApplicants = apps.length;

    const deptCounts: Record<string, number> = {};
    DEPARTMENTS.forEach((d) => {
      deptCounts[d.id] = apps.filter(
        (a) => a.firstChoiceDeptId === d.id || a.assignedDeptId === d.id
      ).length;
    });

    const statusCounts: Record<string, number> = {
      SUBMITTED: 0,
      INTERVIEW_ELIGIBLE: 0,
      ACCEPTED: 0,
      REJECTED: 0,
    };

    apps.forEach((a) => {
      const rawStatus = (a.status || "submitted").toUpperCase();
      if (rawStatus === "ACCEPTED" || rawStatus === "CONFIRMED" || rawStatus === "INTERVIEW_PASSED") {
        statusCounts.ACCEPTED = (statusCounts.ACCEPTED || 0) + 1;
      } else if (
        rawStatus === "INTERVIEW_ELIGIBLE" ||
        rawStatus === "INTERVIEW" ||
        rawStatus === "INTERVIEW_SCHEDULED" ||
        rawStatus === "DOCUMENT_PASSED"
      ) {
        statusCounts.INTERVIEW_ELIGIBLE = (statusCounts.INTERVIEW_ELIGIBLE || 0) + 1;
      } else if (rawStatus === "REJECTED") {
        statusCounts.REJECTED = (statusCounts.REJECTED || 0) + 1;
      } else {
        statusCounts.SUBMITTED = (statusCounts.SUBMITTED || 0) + 1;
      }
    });

    return NextResponse.json(
      {
        success: true,
        camp: CAMP_INFO.shortName,
        isNeonConnected: isNeonConfigured(),
        totalApplicants,
        deptCounts,
        statusCounts,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=15, stale-while-revalidate=45",
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to generate stats" },
      { status: 500 }
    );
  }
}
