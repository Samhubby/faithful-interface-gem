// Domain types & enums for the LMS.

export type LeadSource = "Walk-in" | "Incoming" | "Website" | "AD" | "Event/Outreach";

export const LEAD_SOURCES: LeadSource[] = [
  "Walk-in",
  "Incoming",
  "Website",
  "AD",
  "Event/Outreach",
];

export type LeadStatus =
  | "Interested"
  | "Admitted"
  | "Will Apply for Next Intake"
  | "Will Visit College"
  | "Will Revisit"
  | "Follow-up Required"
  | "Want Detail in WhatsApp"
  | "CNR"
  | "Incoming Call Blocked"
  | "Expensive Fee"
  | "Not Interested"
  | "Joined Another College"
  | "Dead"
  | "CSV Upload";

export const LEAD_STATUSES: LeadStatus[] = [
  "Interested",
  "Admitted",
  "Will Apply for Next Intake",
  "Will Visit College",
  "Will Revisit",
  "Follow-up Required",
  "Want Detail in WhatsApp",
  "CNR",
  "Incoming Call Blocked",
  "Expensive Fee",
  "Not Interested",
  "Joined Another College",
  "Dead",
  "CSV Upload",
];

export type Intake = "Fall 1" | "Fall 2" | "Spring 3" | "Spring 4" | "Summer 5" | "Summer 6";
export const INTAKES: Intake[] = ["Fall 1", "Fall 2", "Spring 3", "Spring 4", "Summer 5", "Summer 6"];

export type Gender = "Male" | "Female" | "Other";
export const GENDERS: Gender[] = ["Male", "Female", "Other"];

export type Qualification = "+2" | "Bachelors" | "Masters";
export const QUALIFICATIONS: Qualification[] = ["+2", "Bachelors", "Masters"];

export interface Friend {
  name: string;
  phone: string;
}

export interface Lead {
  id: string;
  fullName: string;
  gender?: Gender;
  email?: string;
  phone: string;
  altPhone?: string;
  address?: string;
  qualification?: Qualification;
  institution?: string;
  gpa?: string;
  course: string;
  intake: string;
  source: LeadSource;
  adSource?: string; // marketing ad reference
  friends?: Friend[];
  status: LeadStatus;
  assignedTo?: string; // username of caller/counsellor
  createdAt: string; // ISO date
  notes?: string;
}

export interface FollowUp {
  id: string;
  leadId: string;
  name: string;
  number: string;
  type: LeadSource; // shown as WALK-IN / INCOMING / EVENT/OUTREACH etc
  attempts: number;
  maxAttempts: number; // typically 5
  lastStatus?: LeadStatus;
  assignedTo?: string; // username
  lastContactedAt?: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: "admin" | "counsellor" | "caller" | "accountant";
  password: string; // hashed in real app — plaintext here
}

export interface Course {
  id: string;
  name: string;
}

export interface AdSource {
  id: string;
  name: string;
}

export interface Admission {
  id: string;
  // Personal
  fullName: string;
  gender: Gender;
  dob?: string;
  maritalStatus?: "Single" | "Married" | "Other";
  // Contact
  phone: string;
  altPhone?: string;
  email: string;
  permanentAddress: string;
  temporaryAddress?: string;
  // Family
  fatherName?: string;
  motherName?: string;
  // Academic
  slcInstitution?: string;
  slcBoard?: string;
  slcYear?: string;
  slcGpa?: string;
  plusTwoInstitution?: string;
  plusTwoBoard?: string;
  plusTwoFaculty?: string;
  plusTwoYear?: string;
  plusTwoGpa?: string;
  bachelorsInstitution?: string;
  bachelorsBoard?: string;
  bachelorsFaculty?: string;
  bachelorsYear?: string;
  bachelorsGpa?: string;
  // Professional
  occupation?: string;
  company?: string;
  yearsExperience?: number;
  // Program
  course: string;
  intake: Intake;
  previouslyApplied?: boolean;
  previouslyAppliedYear?: string;
  admissionStatus: "Active" | "On Hold" | "Withdrawn";
  // Scholarship & Referral
  scholarshipType: "None" | "Merit" | "Need-based" | "Sports" | "Sibling";
  scholarshipDeclared?: string;
  scholarshipAmount?: number;
  referralSource?: string;
  referralName?: string;
  referralPhone?: string;
  // Checklist
  checklist: {
    photo: boolean;
    citizenship: boolean;
    transcript: boolean;
    provisional: boolean;
    characterCertificate: boolean;
    migration: boolean;
    diploma: boolean;
    equivalency: boolean;
    supportingDocs: boolean;
  };
  // Payment (used by accountant)
  totalFee?: number;
  amountPaid?: number;
  paymentStatus: "Paid" | "Partial" | "Due";
  remarks?: string;
  createdAt: string;
}
