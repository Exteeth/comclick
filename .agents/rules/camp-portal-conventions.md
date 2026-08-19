# Camp Portal Design & Architecture Conventions

This rule defines project-specific guidelines, UI patterns, database workflows, and export standards for the Comclick Camp portal and similar registration systems.

---

## 1. Thai Form & Input Standards

### A. Title Prefix & Name Input
* For university student registrations, use an inline single-line dropdown with choices: `นาย` and `นางสาว` (exclude `นาง`).
* Place the prefix dropdown in the same row as the name input field.
* Automatically sanitize and strip typed prefixes before concatenating into `fullNameTh`.

### B. Phone Number Input
* Placeholders must be unhyphenated (e.g. `0891234567`).
* Strip dashes and spaces before storing in the database.

---

## 2. Admin Evaluation & Department Roster Management

### A. 3-Status Lifecycle
Always use these 3 simplified statuses:
1. `รอดำเนินการ (SUBMITTED)`
2. `ผ่านการคัดเลือก (ACCEPTED)`
3. `ไม่ผ่านการคัดเลือก (REJECTED)`

### B. Cross-Department Assignments (ย้ายฝ่าย)
When an applicant is assigned to a department different from Choice 1 or 2:
* **In Assigned Department Roster**: Display them under the official roster (**สตาฟตัวจริง**) with an origin tag (e.g. `ย้ายมาจากอันดับ 1 (ฝ่ายวิชาการ)`).
* **In Applied Department List**: Display their status clearly as `ย้ายไป: ฝ่ายพยาบาล` to prevent confusing leftover choices.

### C. User-Facing Status Checking
* For accepted applicants, display the **Final Assigned Department** as the primary hero card with a confirmation badge.
* Original applied choices (Choice 1 & 2) should remain only as historical reference text.

---

## 3. Thai CSV / Excel Export Invariants

When exporting application data to CSV:
1. **UTF-8 BOM**: Always prepend `\uFEFF` to the CSV string to ensure Thai text displays correctly in Microsoft Excel.
2. **Leading Zero Preservation**: Prefix `studentId` and `phone` with a tab character (`\t`) to prevent Excel from stripping leading zeros or converting numbers into scientific notation.
3. **Thai Name Resolution**: Map all department IDs (e.g. `academic` ➔ `ฝ่ายวิชาการ`) to full Thai names.

---

## 4. Next.js & Serverless Database Invariants

1. **Metadata Base**: Always set `metadataBase` in `src/app/layout.tsx` using `NEXT_PUBLIC_SITE_URL` / `VERCEL_URL` fallback to resolve OpenGraph images and eliminate build/dev warnings.
2. **Connection Pooling**: Use Neon's `-pooler` connection string (`channel_binding=require`) to handle high concurrent traffic with sub-millisecond response times.
