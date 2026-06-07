export const COMPANY = {
  company_id:   "COM-001",
  name:         "TechCorp Cambodia",
  industry:     "Information Technology",
  email:        "hr@techcorp.com.kh",
  phone:        "+855 23 123 456",
  address:      "Phnom Penh, Cambodia",
  website:      "techcorp.com.kh",
  description:  "TechCorp Cambodia is a leading software development company building digital solutions for banking, logistics, and e-commerce sectors across Southeast Asia.",
  logo:         "TC",
  verified:     true,
  account_id:   "ACC-COM-001",
  founded:      "2015",
  size:         "50–200 employees",
};

// Skill table
export const SKILLS = [
  { skill_id:"SK-001", name:"React.js",    category:"Frontend" },
  { skill_id:"SK-002", name:"Node.js",     category:"Backend"  },
  { skill_id:"SK-003", name:"PostgreSQL",  category:"Database" },
  { skill_id:"SK-004", name:"Figma",       category:"Design"   },
  { skill_id:"SK-005", name:"Python",      category:"Programming" },
  { skill_id:"SK-006", name:"REST APIs",   category:"Backend"  },
  { skill_id:"SK-007", name:"Flutter",     category:"Mobile"   },
  { skill_id:"SK-008", name:"AWS",         category:"DevOps"   },
  { skill_id:"SK-009", name:"Docker",      category:"DevOps"   },
  { skill_id:"SK-010", name:"TensorFlow",  category:"AI/ML"    },
  { skill_id:"SK-011", name:"MySQL",       category:"Database" },
  { skill_id:"SK-012", name:"TypeScript",  category:"Frontend" },
  { skill_id:"SK-013", name:"Vue.js",      category:"Frontend" },
  { skill_id:"SK-014", name:"MongoDB",     category:"Database" },
];

// Position_Skill junction
export const POSITION_SKILLS = [
  { position_id:"POS-001", skill_id:"SK-001" },
  { position_id:"POS-001", skill_id:"SK-002" },
  { position_id:"POS-001", skill_id:"SK-011" },
  { position_id:"POS-002", skill_id:"SK-007" },
  { position_id:"POS-002", skill_id:"SK-006" },
  { position_id:"POS-003", skill_id:"SK-005" },
  { position_id:"POS-003", skill_id:"SK-010" },
];

export const getPositionSkills = (pid) =>
  POSITION_SKILLS.filter(ps => ps.position_id === pid)
    .map(ps => SKILLS.find(s => s.skill_id === ps.skill_id)).filter(Boolean);

// Positions posted by this company
export const POSITIONS = [
  { position_id:"POS-001", company_id:"COM-001", title:"Software Developer Intern",   type:"Full-Stack", location:"Phnom Penh", salary_min:350, salary_max:500, slots:3, filled:1, deadline:"2025-04-30", posted:"2025-03-10", status:"Active",  description:"Join our engineering team to build next-gen fintech solutions.", department:"Engineering" },
  { position_id:"POS-002", company_id:"COM-001", title:"Mobile App Intern",           type:"Mobile",     location:"Phnom Penh", salary_min:250, salary_max:350, slots:2, filled:2, deadline:"2025-04-15", posted:"2025-03-08", status:"Closed",  description:"Build cross-platform mobile apps using Flutter.", department:"Product" },
  { position_id:"POS-003", company_id:"COM-001", title:"Machine Learning Intern",     type:"AI/ML",      location:"Phnom Penh", salary_min:450, salary_max:600, slots:2, filled:0, deadline:"2025-05-10", posted:"2025-03-16", status:"Active",  description:"Develop ML models for our predictive analytics platform.", department:"Data Science" },
];

// Applications received
export const APPLICATIONS = [
  { application_id:"APP-001", position_id:"POS-001", position:"Software Developer Intern", student_id:"STU-001", student_name:"Dara Sopheak",    university:"RUPP",  apply_date:"2025-03-12", status:"Pending",  interview_status:null,        cover_letter:"I am passionate about full-stack development and have 2 years of React experience.", gpa:"3.8", year:"Year 3" },
  { application_id:"APP-002", position_id:"POS-001", position:"Software Developer Intern", student_id:"STU-002", student_name:"Chenda Vann",      university:"ITC",   apply_date:"2025-03-14", status:"Accepted", interview_status:"Completed",  cover_letter:"My Node.js and PostgreSQL skills align perfectly with this role.", gpa:"3.6", year:"Year 4" },
  { application_id:"APP-003", position_id:"POS-001", position:"Software Developer Intern", student_id:"STU-003", student_name:"Pisach Keo",       university:"RUPP",  apply_date:"2025-03-15", status:"Rejected", interview_status:"Cancelled",  cover_letter:"I have completed several full-stack projects during my studies.", gpa:"3.2", year:"Year 3" },
  { application_id:"APP-004", position_id:"POS-003", position:"Machine Learning Intern",   student_id:"STU-004", student_name:"Sreyleak Noun",    university:"ITC",   apply_date:"2025-03-18", status:"Pending",  interview_status:null,        cover_letter:"My background in Python and data science makes me a great fit.", gpa:"3.9", year:"Year 4" },
  { application_id:"APP-005", position_id:"POS-003", position:"Machine Learning Intern",   student_id:"STU-005", student_name:"Bopha Chan",       university:"Paragon",apply_date:"2025-03-20", status:"Pending",  interview_status:"Scheduled",  cover_letter:"I have experience with TensorFlow and predictive modeling.", gpa:"3.7", year:"Year 3" },
  { application_id:"APP-006", position_id:"POS-001", position:"Software Developer Intern", student_id:"STU-006", student_name:"Visal Thong",      university:"RUPP",  apply_date:"2025-03-22", status:"Pending",  interview_status:null,        cover_letter:"Strong background in React and TypeScript.", gpa:"3.5", year:"Year 3" },
];

// Interns (accepted + active)
export const INTERNS = [
  { intern_id:"INT-001", student_id:"STU-002", student_name:"Chenda Vann",   university:"ITC",    position_id:"POS-001", position:"Software Developer Intern", department:"Engineering", supervisor:"Dr. Chan Vuthy", start_date:"2025-01-15", end_date:"2025-04-15", status:"Active",    evaluation_score:null, field:"Full-Stack" },
  { intern_id:"INT-002", student_id:"STU-007", student_name:"Mony Pich",     university:"RUPP",   position_id:"POS-002", position:"Mobile App Intern",          department:"Product",     supervisor:"Prof. Sok Pisey", start_date:"2024-09-01", end_date:"2024-12-01", status:"Completed", evaluation_score:85,   field:"Mobile" },
  { intern_id:"INT-003", student_id:"STU-008", student_name:"Rathana Heng",  university:"Paragon",position_id:"POS-002", position:"Mobile App Intern",          department:"Product",     supervisor:"Prof. Sok Pisey", start_date:"2024-09-01", end_date:"2024-12-01", status:"Completed", evaluation_score:91,   field:"Mobile" },
];

// Interviews
export const INTERVIEWS = [
  { interview_id:"ITV-001", application_id:"APP-002", student_name:"Chenda Vann",   position:"Software Developer Intern", scheduled_at:"2025-01-10T10:00:00", type:"Online",   status:"Completed", location:"Zoom",              notes:"Technical round — React & Node.js" },
  { interview_id:"ITV-002", application_id:"APP-005", student_name:"Bopha Chan",    position:"Machine Learning Intern",   scheduled_at:"2025-04-01T14:00:00", type:"On-site",  status:"Scheduled", location:"TechCorp HQ, Floor 2",notes:"Bring portfolio and ID card" },
];

// Notifications — application updates
export const NOTIFS_DATA = [
  { notification_id:"NOT-001", application_id:"APP-001", student_name:"Dara Sopheak",  position:"Software Developer Intern", type:"APPLICATION_SUBMITTED", message:"Dara Sopheak has submitted a new application for Software Developer Intern.", is_read:false, created_at:"2025-03-12T09:30:00" },
  { notification_id:"NOT-002", application_id:"APP-004", student_name:"Sreyleak Noun", position:"Machine Learning Intern",   type:"APPLICATION_SUBMITTED", message:"Sreyleak Noun has applied for the Machine Learning Intern position.", is_read:false, created_at:"2025-03-18T11:00:00" },
  { notification_id:"NOT-003", application_id:"APP-005", student_name:"Bopha Chan",    position:"Machine Learning Intern",   type:"APPLICATION_SUBMITTED", message:"Bopha Chan submitted an application for Machine Learning Intern.", is_read:true,  created_at:"2025-03-20T14:15:00" },
  { notification_id:"NOT-004", application_id:"APP-006", student_name:"Visal Thong",   position:"Software Developer Intern", type:"APPLICATION_SUBMITTED", message:"Visal Thong has applied for the Software Developer Intern role.", is_read:false, created_at:"2025-03-22T08:45:00" },
  { notification_id:"NOT-005", application_id:"APP-002", student_name:"Chenda Vann",   position:"Software Developer Intern", type:"APPLICATION_WITHDRAWN", message:"Chenda Vann's application status was updated to Accepted.", is_read:true,  created_at:"2025-01-08T16:00:00" },
];
