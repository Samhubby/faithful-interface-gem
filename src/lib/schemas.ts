import { z } from "zod";
import { LEAD_SOURCES, LEAD_STATUSES, INTAKES, GENDERS, QUALIFICATIONS } from "./types";

const phoneRegex = /^[+0-9\s-]{7,15}$/;

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Username is required").max(64),
  password: z.string().min(1, "Password is required").max(128),
});

export const userSchema = z
  .object({
    firstName: z.string().trim().min(1, "First name required").max(50),
    lastName: z.string().trim().min(1, "Last name required").max(50),
    username: z.string().trim().min(3, "Min 3 chars").max(32).regex(/^[a-zA-Z0-9_.-]+$/, "Letters, numbers, . _ - only"),
    email: z.string().trim().email("Invalid email").max(120),
    role: z.enum(["admin", "counsellor", "caller", "accountant"]),
    password: z.string().min(6, "Min 6 characters").max(128),
    confirmPassword: z.string().min(6).max(128),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const leadSchema = z.object({
  fullName: z.string().trim().min(1, "Required").max(100),
  gender: z.enum(GENDERS as [string, ...string[]]).optional().or(z.literal("")),
  email: z.string().trim().email("Invalid email").max(120).optional().or(z.literal("")),
  phone: z.string().trim().regex(phoneRegex, "Invalid phone"),
  altPhone: z.string().trim().regex(phoneRegex, "Invalid phone").optional().or(z.literal("")),
  address: z.string().trim().max(200).optional().or(z.literal("")),
  qualification: z.enum(QUALIFICATIONS as [string, ...string[]]).optional().or(z.literal("")),
  institution: z.string().trim().max(120).optional().or(z.literal("")),
  gpa: z.string().trim().max(10).optional().or(z.literal("")),
  course: z.string().trim().min(1, "Select a course"),
  intake: z.enum(INTAKES as [string, ...string[]]),
  source: z.enum(LEAD_SOURCES as [string, ...string[]]),
  adSource: z.string().trim().max(60).optional().or(z.literal("")),
  status: z.enum(LEAD_STATUSES as [string, ...string[]]).default("Interested"),
  friend1Name: z.string().trim().max(60).optional().or(z.literal("")),
  friend1Phone: z.string().trim().max(20).optional().or(z.literal("")),
  friend2Name: z.string().trim().max(60).optional().or(z.literal("")),
  friend2Phone: z.string().trim().max(20).optional().or(z.literal("")),
  friend3Name: z.string().trim().max(60).optional().or(z.literal("")),
  friend3Phone: z.string().trim().max(20).optional().or(z.literal("")),
});

export const courseSchema = z.object({
  name: z.string().trim().min(1, "Required").max(80),
});

export const adSchema = z.object({
  name: z.string().trim().min(1, "Required").max(60),
});

export const admissionSchema = z.object({
  fullName: z.string().trim().min(1, "Required").max(120),
  gender: z.enum(GENDERS as [string, ...string[]]),
  dob: z.string().optional().or(z.literal("")),
  maritalStatus: z.enum(["Single", "Married", "Other"]).default("Single"),
  phone: z.string().trim().regex(phoneRegex, "Invalid phone"),
  altPhone: z.string().trim().regex(phoneRegex, "Invalid").optional().or(z.literal("")),
  email: z.string().trim().email("Invalid email"),
  permanentAddress: z.string().trim().min(1, "Required").max(200),
  temporaryAddress: z.string().trim().max(200).optional().or(z.literal("")),
  fatherName: z.string().trim().max(100).optional().or(z.literal("")),
  motherName: z.string().trim().max(100).optional().or(z.literal("")),
  occupation: z.string().trim().max(60).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  yearsExperience: z.coerce.number().min(0).max(60).optional(),
  course: z.string().trim().min(1, "Select course"),
  intake: z.enum(INTAKES as [string, ...string[]]),
  previouslyApplied: z.boolean().default(false),
  previouslyAppliedYear: z.string().trim().max(8).optional().or(z.literal("")),
  admissionStatus: z.enum(["Active", "On Hold", "Withdrawn"]).default("Active"),
  scholarshipType: z.enum(["None", "Merit", "Need-based", "Sports", "Sibling"]).default("None"),
  scholarshipAmount: z.coerce.number().min(0).max(10_000_000).optional(),
  referralName: z.string().trim().max(80).optional().or(z.literal("")),
  referralPhone: z.string().trim().max(20).optional().or(z.literal("")),
  totalFee: z.coerce.number().min(0).optional(),
  amountPaid: z.coerce.number().min(0).optional(),
  remarks: z.string().trim().max(500).optional().or(z.literal("")),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type UserInput = z.infer<typeof userSchema>;
export type LeadInput = z.infer<typeof leadSchema>;
export type CourseInput = z.infer<typeof courseSchema>;
export type AdInput = z.infer<typeof adSchema>;
export type AdmissionInput = z.infer<typeof admissionSchema>;
