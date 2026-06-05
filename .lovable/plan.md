## Goal
Keep my current visual design (Ocean Deep + Space Grotesk + sidebar shell) but rebuild the **features, role-based access, modules, forms, and validations** to match the original Facet LMS exactly.

## Major gaps to fix

### 1. Roles — 4 roles, not 3
Original has: **Management** (admin), **Counsellor**, **Caller**, **Accountant**. I'm missing Accountant entirely.

### 2. Role-based navigation (must restrict exactly)
| Role | Nav items |
|---|---|
| Management | Dashboard · Users · Courses · Ads · Leads · Follow Up · Admission · Reports |
| Counsellor | Dashboard · Leads · Follow Up · Admission |
| Caller | **Follow Up only** (mine wrongly shows Dashboard + Leads) |
| Accountant | TBD — needs confirmation (likely Admission + payments view) |

### 3. Leads module — tabbed by source
Original has 5 tabs: **Walk-in · Incoming · Website · AD · Event/Outreach**. Each tab is its own filtered list. Mine is one flat list.

### 4. Lead status vocabulary (14 values)
Replace my 5 statuses with: Dead, Interested, Expensive Fee, Incoming Call Blocked, CNR, Not Interested, Joined Another College, Will Revisit, Will Visit College, Follow-up Required, Want Detail in WhatsApp, Admitted, Will Apply for Next Intake, CSV Upload.

### 5. Lead Registration form
Required fields: Full Name, Gender, Email, Phone, Address, Alternate Phone, Qualification (+2/Bachelors), Institution, GPA, Interested Course, Friends 1/2/3 (name & number), Marketing Ads source.

### 6. User Registration form
First Name, Last Name, Username, System Role (4 options), Email, Password, Confirm Password (match validation).

### 7. Courses module
Simple list (just Course Name) with Add / Edit / Delete. Seed with the 10 real programs: BBA, BSAI, BScIT, BSCS, BSSWE, MBA, MBA-Data Analytics, MBA-Finance & Economics, MBA-IT, MScIT.

### 8. Ads (Marketing Sources)
Simple list of ad source names with CRUD. Seed: AI Chatbox, College Nepal, EduSanjal, Facebook, Hoarding Board, Instagram, NPL, Others, Pole Branding, TikTok.

### 9. Follow Up module
Columns: Name · Number · Attempts (x/5 badge) · Type (EVENT/OUTREACH etc.). Caller sees only their assigned subset; admin/counsellor see all. Includes search + status filter.

### 10. Admission module — large multi-section form
Sections: Personal Identity (Name*, Gender*, DOB, Marital) · Contact & Address (Phone*, Alt Phone, Email*, Permanent Address*, Temporary) · Family (Father, Mother) · Academic Records table (SLC/+2/Bachelors × Institution/Board/Faculty/Year/GPA) · Professional Background (Occupation, Company, Years Exp) · Program Selection (Course*, Intake, Previously Applied + Year, Admission Status) · Scholarship & Referral (Type*, Declared, Amount, Source, Referral Name/Phone) · Mandatory Checklist (9 checkboxes: Photo, Citizenship, Transcript, Provisional, Character Certificate, Migration, Diploma, Equivalency, Supporting Docs) · Document Uploads (4 file slots: Provisional Cert, Transcript, Citizenship/ID, Additional) · Remarks. Plus a **Download CSV** action on the list.

### 11. Reports → Daily Walk-In Report
Stats cards (Today's Visitors, Counselling Done, Today's Admissions, Intake Walk-ins, Intake Admissions) · Course-wise Performance Breakdown table (Visitors/Counselling/Admissions per course) · Counsellor Productivity panel · Report Distribution (configured email recipients chips).

### 12. Dashboard tweaks
Header reads "ADMISSION ANALYTICS (SUMMER 6) — Admission Dashboard · Live". Counsellor sees the same dashboard. Caller has no dashboard at all.

### 13. Validations (Zod schemas, client + form-level)
- Login: required username + required password
- User: email format, password ≥ 8 chars, confirm-match, username unique, role in enum
- Lead: name 1–100, phone digits 7–15, email optional but format-checked, GPA 0–4 (or %), at least course required
- Course / Ad Source: name 1–80, unique
- Admission: all `*` fields required, file uploads PDF/IMG only and ≤ 5 MB each, mandatory-checklist items count toward "Document Pending"

### 14. Persistence
Keep current mock-data store for now (localStorage-backed) so all CRUD actions feel real without enabling Cloud yet. Add Cloud later in a separate pass if you want real auth + database.

## Build approach (single pass)

1. **Roles + nav** — add Accountant, fix Caller to only Follow Up, update session enum and sidebar map.
2. **Local store** — extend `mock-data.ts` into a small localStorage-backed store with typed CRUD (users, courses, ads, leads, followups, admissions) so every screen does real reads/writes.
3. **Zod schemas** — one `src/lib/schemas.ts` for all forms.
4. **Leads** — rewrite with 5 source tabs, 14 statuses, full Lead Registration dialog, status-change action per row.
5. **Users** — registration dialog with 4 roles + password confirm.
6. **Courses & Ads** — simple CRUD lists, seeded with real values.
7. **Follow Up** — attempts counter (x/5), type column, status filter, caller scoping.
8. **Admission** — full multi-section form + Download CSV.
9. **Reports → Daily Walk-In Report** — stat cards + course breakdown + email recipients.
10. **Dashboard** — match the exact stat tiles and copy.
11. **Counsellor + Caller** workspaces re-pointed to the shared modules with restricted nav.

## Open questions (need your call)
1. **Accountant role** — I couldn't log in as accountant. What screens should they see? (Best guess: Admission list + payments/fees module — but original has no fees module visible to me.)
2. **Lead detail / status update UX** — in the original, clicking a row didn't open anything for me. Should each row have an inline status dropdown + "Assign to Counsellor/Caller" + "Add Follow-Up" buttons?
3. **Branding footer** — original shows "powered by Facet Technology pvt ltd". Do you want that retained, replaced with your own org, or removed?
4. **Persistence** — OK to keep mock localStorage store for now, or should I enable Lovable Cloud (real DB + auth) in the same pass?