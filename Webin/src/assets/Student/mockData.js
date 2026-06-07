const STUDENT = {
  id: "STU-2024-0042", name: "Dara Sopheak", email: "dara.sopheak@student.edu.kh",
  phone: "+855 12 345 678", gender: "Male", dateOfBirth: "2002-08-14",
  nationality: "Cambodian", maritalStatus: "Single", address: "Phnom Penh, Cambodia",
  universityName: "Royal University of Phnom Penh", yearOfStudy: "Year 3",
  major: "Computer Science", fieldOfStudy: "Software Engineering",
  skills: ["React.js", "Node.js", "PostgreSQL", "Figma", "Python", "REST APIs"],
  gpa: "3.8", profilePicture: null,
};

export default STUDENT;

export const INTERNSHIPS = [
  { id: "INT-2024-001", company: "TechCorp Cambodia", logo: "TC", position: "Frontend Developer Intern", department: "Engineering", startDate: "2024-06-01", endDate: "2024-08-31", status: "Completed", supervisor: "Dr. Chan Vuthy", supervisorTitle: "Senior Lecturer", evaluationScore: 88, evaluationType: "Final", feedback: "Excellent work on the dashboard redesign. Shows strong initiative." },
  { id: "INT-2025-003", company: "Sabay Digital", logo: "SD", position: "Full-Stack Developer Intern", department: "Product", startDate: "2025-01-15", endDate: "2025-04-15", status: "Active", supervisor: "Prof. Sok Pisey", supervisorTitle: "Professor", evaluationScore: null, evaluationType: "Midterm", feedback: null },
];

export const APPLICATIONS = [
  { id: "APP-2025-012", company: "Sabay Digital", logo: "SD", position: "Full-Stack Developer Intern", location: "Phnom Penh", salary: "$300–450/mo", applyDate: "2025-01-05", status: "Accepted", type: "Full-Stack" },
  { id: "APP-2025-019", company: "Wing Bank", logo: "WB", position: "Data Analyst Intern", location: "Phnom Penh", salary: "$250–350/mo", applyDate: "2025-02-10", status: "Pending", type: "Data" },
  { id: "APP-2025-007", company: "Cellcard", logo: "CC", position: "Mobile Dev Intern", location: "Phnom Penh", salary: "$200–300/mo", applyDate: "2024-12-20", status: "Rejected", type: "Mobile" },
  { id: "APP-2025-024", company: "Smart Axiata", logo: "SA", position: "Backend Developer Intern", location: "Phnom Penh", salary: "$300–400/mo", applyDate: "2025-03-01", status: "Pending", type: "Backend" },
];

export const POSITIONS = [
  { id: "POS-001", company: "ABA Bank", logo: "AB", title: "Software Developer Intern", location: "Phnom Penh", salary: "$350–500/mo", deadline: "2025-04-30", slots: 3, skills: ["React", "Node.js", "MySQL"], type: "Full-Stack", posted: "2025-03-10", description: "Join our digital banking team to build next-gen fintech solutions." },
  { id: "POS-002", company: "NHAM24", logo: "N2", title: "Mobile App Intern", location: "Phnom Penh", salary: "$250–350/mo", deadline: "2025-04-15", slots: 2, skills: ["Flutter", "Firebase", "Dart"], type: "Mobile", posted: "2025-03-08", description: "Help build our food delivery mobile app used by 500k+ users." },
  { id: "POS-003", company: "BookMeBus", logo: "BM", title: "Data Analyst Intern", location: "Siem Reap", salary: "$200–300/mo", deadline: "2025-05-01", slots: 1, skills: ["Python", "SQL", "Tableau"], type: "Data", posted: "2025-03-12", description: "Analyze passenger data and build dashboards for business insights." },
  { id: "POS-004", company: "Pathmazing", logo: "PM", title: "UI/UX Design Intern", location: "Phnom Penh", salary: "$300–400/mo", deadline: "2025-04-20", slots: 2, skills: ["Figma", "Adobe XD", "Prototyping"], type: "Design", posted: "2025-03-14", description: "Design beautiful interfaces for our suite of enterprise software." },
  { id: "POS-005", company: "Cellcard", logo: "CC", title: "Cloud Infrastructure Intern", location: "Phnom Penh", salary: "$400–550/mo", deadline: "2025-05-10", slots: 1, skills: ["AWS", "Docker", "Kubernetes"], type: "DevOps", posted: "2025-03-15", description: "Work with our cloud team on infrastructure automation projects." },
  { id: "POS-006", company: "TechCorp Cambodia", logo: "TC", title: "Machine Learning Intern", location: "Phnom Penh", salary: "$450–600/mo", deadline: "2025-04-25", slots: 2, skills: ["Python", "TensorFlow", "NumPy"], type: "AI/ML", posted: "2025-03-16", description: "Develop ML models for our predictive analytics platform." },
];

export const DOCUMENTS = [
  { id: "DOC-001", type: "Resume", name: "Dara_Sopheak_CV_2025.pdf", size: "248 KB", uploadDate: "2025-01-10", status: "Verified", icon: "📄" },
  { id: "DOC-002", type: "ID Card", name: "National_ID_Dara.jpg", size: "1.2 MB", uploadDate: "2025-01-10", status: "Verified", icon: "🪪" },
  { id: "DOC-003", type: "Transcript", name: "Academic_Transcript_2024.pdf", size: "512 KB", uploadDate: "2025-02-05", status: "Verified", icon: "📋" },
  { id: "DOC-004", type: "Offer Letter", name: "Sabay_Offer_Letter.pdf", size: "180 KB", uploadDate: "2025-01-16", status: "Pending", icon: "📨" },
  { id: "DOC-005", type: "Other", name: "Recommendation_Letter.pdf", size: "95 KB", uploadDate: "2025-03-01", status: "Pending", icon: "📝" },
];



