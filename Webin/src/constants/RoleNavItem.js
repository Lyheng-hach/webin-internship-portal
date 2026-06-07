const ROLE_NAV = {
  student: [
    { to:"dashboard",    label:"Dashboard",            icon:"▦" },
    { to:"browse",       label:"Browse Positions",      icon:"◈" },
    { to:"applications", label:"My Applications",       icon:"◎", notif:true },
    { to:"internships",  label:"Internship History",    icon:"◉" },
    { to:"documents",    label:"Documents",             icon:"▣" },
    { to:"notifications",label:"Notifications",         icon:"🔔", notif:true },
    { to:"profile",      label:"My Profile",            icon:"⬡" },
  ],
  company: [
    { to:"dashboard",    label:"Dashboard",             icon:"▦" },
    { to:"positions",    label:"Positions",             icon:"◈" },
    { to:"applications", label:"Applications",          icon:"◎", notif:true },
    { to:"interns",      label:"Manage Interns",        icon:"◉" },
    { to:"interviews",   label:"Interviews",            icon:"🎤" },
    { to:"notifications",label:"Notifications",         icon:"🔔", notif:true },
    { to:"profile",      label:"Company Profile",       icon:"⬡" },
  ],
  supervisor: [
    { to:"dashboard",    label:"Dashboard",             icon:"▦" },
    { to:"students",     label:"My Students",           icon:"◉" },
    { to:"evaluations",  label:"Evaluations",           icon:"📋", notif:true },
    { to:"monitoring",   label:"Monitoring",            icon:"◎" },
    { to:"notifications",label:"Notifications",         icon:"🔔", notif:true },
    { to:"profile",      label:"My Profile",            icon:"⬡" },
  ],
  admin: [
    { to:"dashboard",    label:"Dashboard",             icon:"▦" },
    { to:"students",     label:"All Students",          icon:"◉" },
    { to:"companies",    label:"Companies",             icon:"⬡" },
    { to:"supervisors",  label:"Supervisors",           icon:"◈" },
    { to:"internships",  label:"Internships",           icon:"▣" },
    { to:"documents",    label:"Documents",             icon:"📋" },
    { to:"notifications",label:"Notifications",         icon:"🔔", notif:true },
  ],
};

export default ROLE_NAV