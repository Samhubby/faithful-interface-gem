## Goal
Turn the current localStorage prototype into a real multi-user LMS backed by Lovable Cloud (Postgres + Auth), so any user you create can log in from any device and see only the features for their role.

## What changes

### 1. Backend (Lovable Cloud)
Enable Lovable Cloud and create these tables with RLS:
- `profiles` — id (=auth.users.id), first_name, last_name, username, email
- `user_roles` — (user_id, role) where role ∈ admin | counsellor | caller | accountant (separate table, security-definer `has_role()` for safe RLS)
- `courses` — id, name
- `ad_sources` — id, name
- `leads` — all current Lead fields incl. `next_follow_up_date`, `remarks`, `status`, `assigned_to` (uuid → profiles), `created_at`
- `lead_interactions` — lead_id, at, status, remarks, next_follow_up_date, by
- `followups` — lead_id, attempts, max_attempts (5), last_status, next_follow_up_date, assigned_to, last_remark
- `admissions` — full admission record incl. `total_fee`, `amount_paid`, `payment_status`

RLS:
- Admin: full access to everything
- Counsellor / Caller: read+write leads/followups/admissions assigned to them; read courses & ad_sources
- Accountant: read all admissions, update payment fields only
- Everyone authenticated: read courses, ad_sources, their own profile

Triggers:
- On `auth.users` insert → create `profiles` row
- On `leads` insert/update: if `status='Admitted'` and no admission exists yet → auto-create an `admissions` row with `total_fee` defaulted from course name (B* → 75 000, M* → 50 000)
- On `leads` insert/update: if `next_follow_up_date` set or status is a follow-up status → upsert into `followups`

### 2. Auth
- Replace the current fake login (`localStorage` session) with real Supabase email/password auth
- Login page: email + password (we'll seed existing demo users into auth so nothing breaks)
- "Add user" in the Users module calls a protected server function that uses the admin client to create the auth user + profile + role in one go — so any user you create can immediately log in
- Route guard: send unauthenticated visitors to `/auth`; load role from `user_roles` and redirect to that role's home

### 3. Follow-up Today
- Follow-up dashboard gets a **"Due Today"** tab (default) that filters by `next_follow_up_date = today`, plus **Upcoming** and **Overdue** tabs
- Creating a walk-in lead with today's follow-up date will show up there immediately

### 4. Admitted → Admission
- Marking a lead "Admitted" (from Leads or Follow-up) auto-creates the admission record server-side via trigger, so it appears in the Admission module without manual re-entry
- Default `total_fee`:
  - Course name starts with `B` (case-insensitive) → 75 000
  - Course name starts with `M` → 50 000
  - else → leave blank
- Fee remains editable

### 5. Walk-in lead form
- Already has remarks + calendar next-follow-up (kept), but the date will now persist server-side

## Technical notes
- All data access goes through TanStack `createServerFn` with `requireSupabaseAuth` (RLS as the signed-in user). Admin-only mutations (create user, role assignment) verify `has_role(uid, 'admin')` before using the service-role client.
- Existing `store.ts` / `useStore` calls are replaced with TanStack Query hooks talking to server functions. The UI components stay largely the same.
- One migration creates all tables + GRANTs + RLS + triggers + seed data (courses, ad sources).
- Demo users from the current seed will be created in auth so you can keep logging in as `admin / admin`, `muktinath / muktinath`, etc. (email will be `<username>@pgs.edu.np`, password unchanged).

## Out of scope for this pass
- Email notifications, password reset UI (can add later)
- File uploads for admission documents (checkbox stays boolean for now)
- Realtime updates (data will refresh on navigation / refetch)

## A couple of confirmations before I build

1. **Demo logins** — OK to migrate the existing seeded users into real auth using `<username>@pgs.edu.np` + the same password (e.g. `admin@pgs.edu.np` / `admin`)? Or do you want a clean slate with just one admin you set?
2. **Credentials you mentioned** — you don't need to share anything; Lovable Cloud will provision the database automatically. If you meant SMTP/email for password resets, we can wire that later.
3. **Fee rule** — "starts with B → 75 000, starts with M → 50 000" applied to the course name. Confirm that's the rule (so `BBA`, `BScIT`, `BSCS` = 75k; `MBA`, `MScIT`, `MBA-IT` = 50k).

Once you confirm, I'll enable Lovable Cloud and ship the migration + server functions + UI rewire in one go.