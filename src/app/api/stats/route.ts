import { NextResponse } from "next/server";
import { getApplications } from "@/lib/storage";
import { DEPARTMENTS, CAMP_INFO } from "@/lib/constants";
import { isNeonConfigured } from "@/lib/neon";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const apps = getApplications();
    const totalApplicants = apps.length;

    const deptCounts: Record<string, number> = {};
    DEPARTMENTS.forEach((d) => {
      deptCounts[d.id] = apps.filter(
        (a) => a.firstChoiceDeptId === d.id || a.assignedDeptId === d.id
      ).length;
    });

    const statusCounts: Record<string, number> = {};
    apps.forEach((a) => {
      statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
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
