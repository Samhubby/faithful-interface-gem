// Tiny localStorage-backed store. Seeds with realistic data on first load.

import type {
  AdSource,
  Admission,
  Course,
  FollowUp,
  Lead,
  LeadSource,
  LeadStatus,
  User,
} from "./types";

const KEY = "lms_store_v2";

interface Store {
  users: User[];
  courses: Course[];
  ads: AdSource[];
  leads: Lead[];
  followups: FollowUp[];
  admissions: Admission[];
}

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`;
}

const SEED_COURSES: Course[] = [
  "BBA",
  "BSAI",
  "BScIT",
  "BSCS",
  "BSSWE",
  "MBA",
  "MBA-Data Analytics",
  "MBA-Finance & Economics",
  "MBA-IT",
  "MScIT",
].map((n) => ({ id: uid("C"), name: n }));

const SEED_ADS: AdSource[] = [
  "AI Chatbox",
  "College Nepal",
  "EduSanjal",
  "Facebook",
  "Hoarding Board",
  "Instagram",
  "NPL",
  "Others",
  "Pole Branding",
  "TikTok",
].map((n) => ({ id: uid("A"), name: n }));

const SEED_USERS: User[] = [
  { id: uid("U"), firstName: "System", lastName: "Admin", username: "admin", email: "admin@pgs.edu.np", role: "admin", password: "admin" },
  { id: uid("U"), firstName: "Muktinath", lastName: "Poudel", username: "muktinath", email: "muktinath.poudel@pgs.edu.np", role: "counsellor", password: "muktinath" },
  { id: uid("U"), firstName: "Rajesh", lastName: "Basnet", username: "rajesh", email: "rajesh.basnet@pgs.edu.np", role: "counsellor", password: "rajesh" },
  { id: uid("U"), firstName: "Sabina", lastName: "Bhattarai", username: "sabina", email: "sabina@pgs.edu.np", role: "counsellor", password: "sabina" },
  { id: uid("U"), firstName: "Shruti", lastName: "Dhungana", username: "shruti", email: "shruti@pgs.edu.np", role: "counsellor", password: "shruti" },
  { id: uid("U"), firstName: "Dikshyant", lastName: "Ghising", username: "dikshyant", email: "dikshyant@pgs.edu.np", role: "caller", password: "dikshyant" },
  { id: uid("U"), firstName: "Vivek", lastName: "Raut", username: "vivek", email: "vivek@pgs.edu.np", role: "caller", password: "vivek" },
  { id: uid("U"), firstName: "Dristi", lastName: "Khadka", username: "dristi", email: "dristi@pgs.edu.np", role: "caller", password: "dristi" },
  { id: uid("U"), firstName: "Elyana", lastName: "Sah", username: "elyana", email: "elyana@pgs.edu.np", role: "caller", password: "elyana" },
  { id: uid("U"), firstName: "Pragyan", lastName: "Pratap Singh", username: "pragyan", email: "pragyan@pgs.edu.np", role: "caller", password: "pragyan" },
  { id: uid("U"), firstName: "Bishnu", lastName: "Kafle", username: "bishnu", email: "bishnu@pgs.edu.np", role: "accountant", password: "bishnu" },
];

function makeLead(
  fullName: string,
  phone: string,
  course: string,
  intake: string,
  source: LeadSource,
  status: LeadStatus,
  assignedTo?: string,
): Lead {
  return {
    id: uid("L"),
    fullName,
    phone,
    course,
    intake,
    source,
    status,
    assignedTo,
    createdAt: new Date().toISOString(),
  };
}

const SEED_LEADS: Lead[] = [
  makeLead("Bijen Uprety", "9863460255", "BBA", "Fall 1", "Walk-in", "Interested", "muktinath"),
  makeLead("Minma Rai", "9806129929", "BSCS", "Fall 1", "Walk-in", "Admitted", "muktinath"),
  makeLead("Jeshran Tamang", "9828009760", "BBA", "Fall 1", "Walk-in", "CNR", "rajesh"),
  makeLead("Bishal Khadka", "9761882352", "BScIT", "Fall 1", "Walk-in", "Interested", "rajesh"),
  makeLead("Remant Yadav", "9819747994", "MBA", "Fall 1", "Walk-in", "Interested", "sabina"),
  makeLead("Pukar Basnet", "9767584669", "MBA-IT", "Fall 1", "Walk-in", "Interested", "shruti"),
  makeLead("Neha Pokhrel", "9749418010", "BBA", "Summer 6", "Walk-in", "Interested", "muktinath"),
  makeLead("Aakriti Ghimire", "9841077500", "MScIT", "Summer 6", "Walk-in", "Interested", "muktinath"),
  makeLead("Avinash Sinha", "9864047206", "MBA", "Summer 6", "Walk-in", "Admitted", "rajesh"),
  makeLead("Kunjan Basnet", "9863039862", "BBA", "Summer 6", "Walk-in", "Will Apply for Next Intake", "rajesh"),
  makeLead("Shuva Kharel", "9808262842", "BSAI", "Fall 1", "Walk-in", "Interested", "sabina"),
  makeLead("Shlok Poudel", "9767647200", "BScIT", "Fall 1", "Walk-in", "Interested", "shruti"),
  makeLead("Layash Piya", "9822768389", "MScIT", "Summer 6", "Walk-in", "Admitted", "muktinath"),
  makeLead("Adil Aftab", "9845880870", "BSCS", "Fall 1", "Walk-in", "Admitted", "rajesh"),
  makeLead("Diwas Rana Magar", "9849111232", "MBA-Data Analytics", "Summer 6", "Walk-in", "Admitted", "muktinath"),
  makeLead("Swostika Neupane", "9741827426", "BBA", "Fall 1", "Incoming", "Interested", "dikshyant"),
  makeLead("Kushal Dahal", "9706745380", "BSCS", "Fall 1", "Incoming", "Interested", "vivek"),
  makeLead("Bipa Tuladhar", "9860923358", "MBA", "Fall 1", "Incoming", "Interested", "dristi"),
  makeLead("Sajan Niraula", "9709496840", "BScIT", "Fall 1", "Incoming", "Interested", "elyana"),
  makeLead("Yuna Dhakal", "9813742184", "MBA-Data Analytics", "Summer 6", "Website", "Admitted", "muktinath"),
  makeLead("Shyam Krishna Chaudhary", "9812032039", "MBA-Data Analytics", "Summer 6", "AD", "Admitted", "rajesh"),
  makeLead("Nirmal Seti", "9769939842", "BBA", "Fall 1", "Event/Outreach", "Follow-up Required", "dikshyant"),
  makeLead("Sandesh Jora", "9763275417", "MBA", "Fall 1", "Event/Outreach", "Follow-up Required", "dikshyant"),
  makeLead("BIshal Okheda", "9707137792", "BScIT", "Fall 1", "Event/Outreach", "Follow-up Required", "dikshyant"),
  makeLead("Shubhangi Neupane", "9862445980", "BBA", "Fall 1", "Event/Outreach", "Follow-up Required", "dikshyant"),
  makeLead("Shivansh Karki", "9866291281", "BSCS", "Fall 1", "Event/Outreach", "Follow-up Required", "dikshyant"),
  makeLead("Shalini Purbey", "9765333294", "BSAI", "Fall 1", "Event/Outreach", "Follow-up Required", "dikshyant"),
  makeLead("Sanaya Awasthi", "9749956497", "BBA", "Fall 1", "Event/Outreach", "Follow-up Required", "vivek"),
  makeLead("Shaniya Sunuwar", "9842851081", "BScIT", "Fall 1", "Event/Outreach", "Follow-up Required", "vivek"),
  makeLead("Shreeyami Aryal", "9841032961", "MBA", "Fall 1", "Event/Outreach", "Follow-up Required", "dristi"),
  makeLead("Kritika Kumari Shah", "9847360758", "BBA", "Fall 1", "Event/Outreach", "Follow-up Required", "dristi"),
  makeLead("Sanchit Giri", "9849367582", "MBA-IT", "Fall 1", "Event/Outreach", "Follow-up Required", "elyana"),
  makeLead("Sandesh Khadka", "9748418362", "BSAI", "Fall 1", "Event/Outreach", "Follow-up Required", "elyana"),
  makeLead("Rabin Gaihre", "9767474652", "BScIT", "Fall 1", "Event/Outreach", "Follow-up Required", "pragyan"),
  makeLead("Sandesh Nepal", "9761606817", "BBA", "Fall 1", "Event/Outreach", "Follow-up Required", "pragyan"),
];

function seedFollowups(leads: Lead[]): FollowUp[] {
  return leads
    .filter((l) => l.status === "Follow-up Required" || l.status === "CNR" || l.status === "Will Revisit")
    .map((l) => ({
      id: uid("F"),
      leadId: l.id,
      name: l.fullName,
      number: l.phone,
      type: l.source,
      attempts: Math.floor(Math.random() * 3) + 1,
      maxAttempts: 5,
      lastStatus: l.status,
      assignedTo: l.assignedTo,
    }));
}

function seedAdmissions(leads: Lead[]): Admission[] {
  return leads
    .filter((l) => l.status === "Admitted")
    .map<Admission>((l) => ({
      id: uid("ADM"),
      fullName: l.fullName,
      gender: "Male",
      phone: l.phone,
      email: `${l.fullName.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      permanentAddress: "Kathmandu, Nepal",
      course: l.course,
      intake: l.intake as Admission["intake"],
      admissionStatus: "Active",
      scholarshipType: "None",
      checklist: {
        photo: true,
        citizenship: true,
        transcript: false,
        provisional: false,
        characterCertificate: false,
        migration: false,
        diploma: false,
        equivalency: false,
        supportingDocs: false,
      },
      totalFee: 250000,
      amountPaid: 100000,
      paymentStatus: "Partial",
      maritalStatus: "Single",
      createdAt: new Date().toISOString(),
    }));
}

function initialStore(): Store {
  const leads = SEED_LEADS;
  return {
    users: SEED_USERS,
    courses: SEED_COURSES,
    ads: SEED_ADS,
    leads,
    followups: seedFollowups(leads),
    admissions: seedAdmissions(leads),
  };
}

function read(): Store {
  if (typeof window === "undefined") return initialStore();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const s = initialStore();
      localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw) as Store;
  } catch {
    return initialStore();
  }
}

function write(s: Store) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
  // notify listeners
  window.dispatchEvent(new CustomEvent("lms:store"));
}

export const store = {
  all: () => read(),
  reset: () => {
    if (typeof window !== "undefined") localStorage.removeItem(KEY);
  },
  // Users
  listUsers: () => read().users,
  addUser: (u: Omit<User, "id">) => {
    const s = read();
    if (s.users.some((x) => x.username.toLowerCase() === u.username.toLowerCase())) {
      throw new Error("Username already exists");
    }
    s.users.push({ ...u, id: uid("U") });
    write(s);
  },
  updateUser: (id: string, patch: Partial<User>) => {
    const s = read();
    s.users = s.users.map((u) => (u.id === id ? { ...u, ...patch } : u));
    write(s);
  },
  removeUser: (id: string) => {
    const s = read();
    s.users = s.users.filter((u) => u.id !== id);
    write(s);
  },
  // Courses
  listCourses: () => read().courses,
  addCourse: (name: string) => {
    const s = read();
    if (s.courses.some((c) => c.name.toLowerCase() === name.toLowerCase())) throw new Error("Course exists");
    s.courses.push({ id: uid("C"), name });
    write(s);
  },
  updateCourse: (id: string, name: string) => {
    const s = read();
    s.courses = s.courses.map((c) => (c.id === id ? { ...c, name } : c));
    write(s);
  },
  removeCourse: (id: string) => {
    const s = read();
    s.courses = s.courses.filter((c) => c.id !== id);
    write(s);
  },
  // Ads
  listAds: () => read().ads,
  addAd: (name: string) => {
    const s = read();
    if (s.ads.some((a) => a.name.toLowerCase() === name.toLowerCase())) throw new Error("Ad source exists");
    s.ads.push({ id: uid("A"), name });
    write(s);
  },
  updateAd: (id: string, name: string) => {
    const s = read();
    s.ads = s.ads.map((a) => (a.id === id ? { ...a, name } : a));
    write(s);
  },
  removeAd: (id: string) => {
    const s = read();
    s.ads = s.ads.filter((a) => a.id !== id);
    write(s);
  },
  // Leads
  listLeads: () => read().leads,
  addLead: (l: Omit<Lead, "id" | "createdAt">) => {
    const s = read();
    const lead: Lead = { ...l, id: uid("L"), createdAt: new Date().toISOString(), interactions: l.interactions ?? [] };
    s.leads.unshift(lead);
    // automatically add to follow-ups if status warrants OR a next follow-up date is set
    const followUpStatuses: LeadStatus[] = ["Follow-up Required", "CNR", "Will Revisit", "Will Visit College"];
    if (lead.nextFollowUpDate || followUpStatuses.includes(lead.status)) {
      s.followups.unshift({
        id: uid("F"),
        leadId: lead.id,
        name: lead.fullName,
        number: lead.phone,
        type: lead.source,
        attempts: 0,
        maxAttempts: 5,
        lastStatus: lead.status,
        assignedTo: lead.assignedTo,
        nextFollowUpDate: lead.nextFollowUpDate,
        lastRemark: lead.remarks,
      });
    }
    write(s);
    return lead;
  },
  updateLead: (id: string, patch: Partial<Lead>) => {
    const s = read();
    s.leads = s.leads.map((l) => (l.id === id ? { ...l, ...patch } : l));
    // keep follow-up in sync when date / status changes
    s.followups = s.followups.map((f) =>
      f.leadId === id
        ? {
            ...f,
            nextFollowUpDate: patch.nextFollowUpDate ?? f.nextFollowUpDate,
            lastStatus: patch.status ?? f.lastStatus,
            assignedTo: patch.assignedTo ?? f.assignedTo,
          }
        : f,
    );
    write(s);
  },
  removeLead: (id: string) => {
    const s = read();
    s.leads = s.leads.filter((l) => l.id !== id);
    s.followups = s.followups.filter((f) => f.leadId !== id);
    write(s);
  },
  // Follow-ups
  listFollowups: () => read().followups,
  incrementAttempt: (
    id: string,
    opts: { newStatus?: LeadStatus; nextFollowUpDate?: string; remarks?: string; by?: string } = {},
  ) => {
    const s = read();
    const { newStatus, nextFollowUpDate, remarks, by } = opts;
    s.followups = s.followups.map((f) =>
      f.id === id
        ? {
            ...f,
            attempts: Math.min(f.attempts + 1, f.maxAttempts),
            lastStatus: newStatus ?? f.lastStatus,
            lastContactedAt: new Date().toISOString(),
            nextFollowUpDate: nextFollowUpDate ?? f.nextFollowUpDate,
            lastRemark: remarks ?? f.lastRemark,
          }
        : f,
    );
    const fu = s.followups.find((f) => f.id === id);
    if (fu) {
      s.leads = s.leads.map((l) =>
        l.id === fu.leadId
          ? {
              ...l,
              status: newStatus ?? l.status,
              nextFollowUpDate: nextFollowUpDate ?? l.nextFollowUpDate,
              interactions: [
                ...(l.interactions ?? []),
                {
                  at: new Date().toISOString(),
                  status: (newStatus ?? l.status) as LeadStatus,
                  remarks,
                  nextFollowUpDate,
                  by,
                },
              ],
            }
          : l,
      );
    }
    write(s);
  },
  removeFollowup: (id: string) => {
    const s = read();
    s.followups = s.followups.filter((f) => f.id !== id);
    write(s);
  },
  // Admissions
  listAdmissions: () => read().admissions,
  addAdmission: (a: Omit<Admission, "id" | "createdAt">) => {
    const s = read();
    s.admissions.unshift({ ...a, id: uid("ADM"), createdAt: new Date().toISOString() });
    write(s);
  },
  updateAdmission: (id: string, patch: Partial<Admission>) => {
    const s = read();
    s.admissions = s.admissions.map((a) => (a.id === id ? { ...a, ...patch } : a));
    write(s);
  },
  removeAdmission: (id: string) => {
    const s = read();
    s.admissions = s.admissions.filter((a) => a.id !== id);
    write(s);
  },
};

// Hook to subscribe to store changes.
import { useEffect, useState } from "react";
export function useStore<T>(selector: (s: Store) => T): T {
  const [value, setValue] = useState<T>(() => selector(read()));
  useEffect(() => {
    const handler = () => setValue(selector(read()));
    window.addEventListener("lms:store", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("lms:store", handler);
      window.removeEventListener("storage", handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return value;
}
