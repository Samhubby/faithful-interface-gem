export const COURSES = [
  { code: "BBA", name: "Bachelor of Business Administration", total: 12, today: 1 },
  { code: "BSAI", name: "BSc Artificial Intelligence", total: 5, today: 0 },
  { code: "BScIT", name: "BSc Information Technology", total: 8, today: 2 },
  { code: "BSCS", name: "BSc Computer Science", total: 6, today: 0 },
  { code: "BSSWE", name: "BSc Software Engineering", total: 4, today: 1 },
  { code: "MBA", name: "Master of Business Administration", total: 9, today: 0 },
  { code: "MBA-DA", name: "MBA — Data Analytics", total: 3, today: 0 },
  { code: "MBA-FE", name: "MBA — Finance & Economics", total: 2, today: 0 },
  { code: "MBA-IT", name: "MBA — IT", total: 4, today: 1 },
  { code: "MScIT", name: "MSc Information Technology", total: 5, today: 0 },
];

export const STAFF = [
  { name: "Dikshyant Ghising", username: "dikshyant", role: "Caller" },
  { name: "Vivek Raut", username: "vivek", role: "Caller" },
  { name: "Dristi Khadka", username: "dristi", role: "Caller" },
  { name: "Elyana Sah", username: "elyana", role: "Caller" },
  { name: "Pragyan Pratap Singh", username: "pragyan", role: "Caller" },
  { name: "Rajesh Basnet", username: "rajesh", role: "Counsellor" },
  { name: "Sabina Bhattarai", username: "sabina", role: "Counsellor" },
  { name: "Muktinath Poudel", username: "muktinath", role: "Counsellor" },
  { name: "Shruti Dhungana", username: "shruti", role: "Counsellor" },
];

export const LEADS = [
  { id: "L-1042", name: "Aastha Sharma", phone: "98xxxxxx12", course: "BBA", source: "Facebook", status: "New", assigned: "Dikshyant", date: "2026-06-01" },
  { id: "L-1043", name: "Bibek KC", phone: "98xxxxxx34", course: "MBA", source: "Walk-in", status: "Contacted", assigned: "Muktinath", date: "2026-06-02" },
  { id: "L-1044", name: "Chandra Adhikari", phone: "98xxxxxx56", course: "BScIT", source: "Instagram", status: "Follow up", assigned: "Vivek", date: "2026-06-03" },
  { id: "L-1045", name: "Diya Tamang", phone: "98xxxxxx78", course: "MScIT", source: "Referral", status: "Admitted", assigned: "Sabina", date: "2026-06-04" },
  { id: "L-1046", name: "Eshan Rai", phone: "98xxxxxx90", course: "BSAI", source: "Website", status: "New", assigned: "Elyana", date: "2026-06-04" },
  { id: "L-1047", name: "Firoz Khan", phone: "98xxxxxx11", course: "MBA-IT", source: "Facebook", status: "Lost", assigned: "Pragyan", date: "2026-06-04" },
  { id: "L-1048", name: "Garima Joshi", phone: "98xxxxxx22", course: "BBA", source: "Walk-in", status: "Contacted", assigned: "Rajesh", date: "2026-06-05" },
  { id: "L-1049", name: "Hari Bahadur", phone: "98xxxxxx33", course: "MBA", source: "Google", status: "Follow up", assigned: "Shruti", date: "2026-06-05" },
];

export const ADS = [
  { id: "A-01", title: "Summer Intake — MBA", channel: "Facebook", spend: 24000, leads: 32, status: "Active" },
  { id: "A-02", title: "BScIT Scholarships", channel: "Instagram", spend: 18000, leads: 24, status: "Active" },
  { id: "A-03", title: "Open House", channel: "Google", spend: 12500, leads: 14, status: "Paused" },
  { id: "A-04", title: "Career Fair", channel: "Email", spend: 5000, leads: 9, status: "Active" },
];

export const ADMISSIONS = LEADS.filter((l) => l.status === "Admitted" || l.status === "Contacted").map((l, i) => ({
  ...l,
  admissionId: `ADM-2026-${100 + i}`,
  documents: i % 2 === 0 ? "Complete" : "Pending",
  fee: i % 2 === 0 ? "Paid" : "Due",
}));

export type StatusTone = "new" | "contacted" | "followup" | "admitted" | "lost";
export function statusTone(s: string): StatusTone {
  const k = s.toLowerCase();
  if (k.includes("admit")) return "admitted";
  if (k.includes("lost")) return "lost";
  if (k.includes("follow")) return "followup";
  if (k.includes("contact")) return "contacted";
  return "new";
}
