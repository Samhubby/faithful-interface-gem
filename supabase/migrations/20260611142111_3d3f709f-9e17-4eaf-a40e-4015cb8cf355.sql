
-- ============== ENUMS ==============
CREATE TYPE public.app_role AS ENUM ('admin', 'counsellor', 'caller', 'accountant');
CREATE TYPE public.lead_source AS ENUM ('Walk-in','Incoming','Website','AD','Event/Outreach');
CREATE TYPE public.lead_status AS ENUM (
  'Interested','Admitted','Will Apply for Next Intake','Will Visit College','Will Revisit',
  'Follow-up Required','Want Detail in WhatsApp','CNR','Incoming Call Blocked','Expensive Fee',
  'Not Interested','Joined Another College','Dead','CSV Upload'
);

-- ============== PROFILES ==============
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL DEFAULT '',
  last_name  text NOT NULL DEFAULT '',
  username   text UNIQUE NOT NULL,
  email      text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============== USER ROLES ==============
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS public.app_role LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid() LIMIT 1
$$;

-- profile policies
CREATE POLICY "users read own profile" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "users update own profile" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins insert profiles" ON public.profiles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'admin') OR id = auth.uid());
CREATE POLICY "admins delete profiles" ON public.profiles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(),'admin'));

-- staff can see each other's profiles (for assignment dropdowns)
CREATE POLICY "staff read profiles" ON public.profiles FOR SELECT TO authenticated
  USING (true);

-- user_roles policies
CREATE POLICY "users read own role" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============== AUTO-CREATE PROFILE ON SIGNUP ==============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, username, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name',''),
    COALESCE(NEW.raw_user_meta_data->>'last_name',''),
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email,'@',1)),
    NEW.email
  );
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============== COURSES ==============
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.courses TO authenticated;
GRANT ALL ON public.courses TO service_role;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read courses" ON public.courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin write courses" ON public.courses FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============== AD SOURCES ==============
CREATE TABLE public.ad_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ad_sources TO authenticated;
GRANT ALL ON public.ad_sources TO service_role;
ALTER TABLE public.ad_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read ad_sources" ON public.ad_sources FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin write ad_sources" ON public.ad_sources FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- ============== LEADS ==============
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  gender text,
  email text,
  phone text NOT NULL,
  alt_phone text,
  address text,
  qualification text,
  institution text,
  gpa text,
  course text NOT NULL,
  intake text NOT NULL,
  source public.lead_source NOT NULL,
  ad_source text,
  status public.lead_status NOT NULL DEFAULT 'Interested',
  assigned_to uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes text,
  visit_date date,
  next_follow_up_date date,
  remarks text,
  friends jsonb DEFAULT '[]'::jsonb,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin all leads" ON public.leads FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "staff read assigned leads" ON public.leads FOR SELECT TO authenticated
  USING (assigned_to = auth.uid() OR created_by = auth.uid()
         OR public.has_role(auth.uid(),'counsellor') OR public.has_role(auth.uid(),'caller')
         OR public.has_role(auth.uid(),'accountant'));
CREATE POLICY "staff insert leads" ON public.leads FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(),'counsellor') OR public.has_role(auth.uid(),'caller'));
CREATE POLICY "staff update assigned leads" ON public.leads FOR UPDATE TO authenticated
  USING (assigned_to = auth.uid() OR created_by = auth.uid()
         OR public.has_role(auth.uid(),'counsellor') OR public.has_role(auth.uid(),'caller'));

-- ============== LEAD INTERACTIONS ==============
CREATE TABLE public.lead_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  at timestamptz NOT NULL DEFAULT now(),
  status public.lead_status,
  remarks text,
  next_follow_up_date date,
  by_user uuid REFERENCES auth.users(id) ON DELETE SET NULL
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_interactions TO authenticated;
GRANT ALL ON public.lead_interactions TO service_role;
ALTER TABLE public.lead_interactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read interactions" ON public.lead_interactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "auth write interactions" ON public.lead_interactions FOR INSERT TO authenticated WITH CHECK (true);

-- ============== FOLLOWUPS ==============
CREATE TABLE public.followups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL UNIQUE REFERENCES public.leads(id) ON DELETE CASCADE,
  attempts int NOT NULL DEFAULT 0,
  max_attempts int NOT NULL DEFAULT 5,
  last_status public.lead_status,
  last_contacted_at timestamptz,
  next_follow_up_date date,
  last_remark text,
  assigned_to uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.followups TO authenticated;
GRANT ALL ON public.followups TO service_role;
ALTER TABLE public.followups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin all followups" ON public.followups FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "staff read followups" ON public.followups FOR SELECT TO authenticated USING (true);
CREATE POLICY "staff write own followups" ON public.followups FOR UPDATE TO authenticated
  USING (assigned_to = auth.uid()
         OR public.has_role(auth.uid(),'counsellor') OR public.has_role(auth.uid(),'caller'));
CREATE POLICY "staff insert followups" ON public.followups FOR INSERT TO authenticated WITH CHECK (true);

-- ============== ADMISSIONS ==============
CREATE TABLE public.admissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid UNIQUE REFERENCES public.leads(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  gender text,
  dob date,
  marital_status text,
  phone text NOT NULL,
  alt_phone text,
  email text,
  permanent_address text,
  temporary_address text,
  father_name text,
  mother_name text,
  course text NOT NULL,
  intake text NOT NULL,
  admission_status text NOT NULL DEFAULT 'Active',
  scholarship_type text NOT NULL DEFAULT 'None',
  scholarship_amount numeric DEFAULT 0,
  checklist jsonb NOT NULL DEFAULT '{}'::jsonb,
  total_fee numeric,
  amount_paid numeric NOT NULL DEFAULT 0,
  payment_status text NOT NULL DEFAULT 'Due',
  remarks text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.admissions TO authenticated;
GRANT ALL ON public.admissions TO service_role;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin all admissions" ON public.admissions FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "staff read admissions" ON public.admissions FOR SELECT TO authenticated USING (true);
CREATE POLICY "staff write admissions" ON public.admissions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "staff update admissions" ON public.admissions FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(),'counsellor') OR public.has_role(auth.uid(),'accountant'));

-- ============== FEE DEFAULT FN ==============
CREATE OR REPLACE FUNCTION public.default_fee_for_course(_course text)
RETURNS numeric LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE
    WHEN _course ~* '^b' THEN 75000
    WHEN _course ~* '^m' THEN 50000
    ELSE NULL
  END
$$;

-- ============== TRIGGERS: lead -> followup + admission sync ==============
CREATE OR REPLACE FUNCTION public.sync_lead_followup()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  fu_statuses public.lead_status[] := ARRAY['Follow-up Required','CNR','Will Revisit','Will Visit College']::public.lead_status[];
BEGIN
  IF NEW.next_follow_up_date IS NOT NULL OR NEW.status = ANY(fu_statuses) THEN
    INSERT INTO public.followups (lead_id, attempts, max_attempts, last_status, next_follow_up_date, last_remark, assigned_to)
    VALUES (NEW.id, 0, 5, NEW.status, NEW.next_follow_up_date, NEW.remarks, NEW.assigned_to)
    ON CONFLICT (lead_id) DO UPDATE
      SET next_follow_up_date = EXCLUDED.next_follow_up_date,
          last_status         = EXCLUDED.last_status,
          assigned_to         = EXCLUDED.assigned_to,
          last_remark         = COALESCE(EXCLUDED.last_remark, public.followups.last_remark);
  END IF;

  IF NEW.status = 'Admitted' THEN
    INSERT INTO public.admissions (lead_id, full_name, phone, email, course, intake, total_fee, checklist, payment_status)
    VALUES (NEW.id, NEW.full_name, NEW.phone, NEW.email, NEW.course, NEW.intake,
            public.default_fee_for_course(NEW.course),
            '{}'::jsonb, 'Due')
    ON CONFLICT (lead_id) DO NOTHING;
  END IF;
  RETURN NEW;
END; $$;

CREATE TRIGGER trg_sync_lead_followup
AFTER INSERT OR UPDATE OF status, next_follow_up_date, assigned_to, remarks ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.sync_lead_followup();

-- ============== updated_at helpers ==============
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TRIGGER touch_leads_updated_at BEFORE UPDATE ON public.leads
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER touch_admissions_updated_at BEFORE UPDATE ON public.admissions
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============== SEED ==============
INSERT INTO public.courses (name) VALUES
('BBA'),('BSAI'),('BScIT'),('BSCS'),('BSSWE'),
('MBA'),('MBA-Data Analytics'),('MBA-Finance & Economics'),('MBA-IT'),('MScIT')
ON CONFLICT DO NOTHING;

INSERT INTO public.ad_sources (name) VALUES
('AI Chatbox'),('College Nepal'),('EduSanjal'),('Facebook'),('Hoarding Board'),
('Instagram'),('NPL'),('Others'),('Pole Branding'),('TikTok')
ON CONFLICT DO NOTHING;
