import React from 'react'
import COLORS from '../../assets/Default/theme'
import useInview from '../../hooks/useInview';

const FEAT=[
  {icon:"◈",title:"Application Tracking",  desc:"Real-time status from Pending to Accepted with cover letters attached.",        color:COLORS.indigo},
  {icon:"⬡",title:"Position Management",   desc:"Post openings with salary ranges, slot limits, and auto-close deadlines.",      color:COLORS.company},
  {icon:"◎",title:"Academic Supervision",  desc:"University lecturers write structured midterm and final evaluations.",          color:COLORS.supervisor},
  {icon:"▣",title:"Document Vault",        desc:"Central hub for resumes, ID cards, transcripts — all verified.",                color:COLORS.yellow},
  {icon:"◉",title:"Intern Info Dashboard", desc:"Complete records linking student, company, and academic supervisor.",           color:COLORS.green},
  {icon:"⬢",title:"Role-Based Access",     desc:"Four distinct portals with tailored permissions for each stakeholder.",         color:COLORS.student},
];


const FeaturesRec = () => {
  const [ref,v] = useInview();
  return (
    <section id="features" className="py-[90px] px-10 relative z-10">
      <div className="max-w-[1160px] mx-auto">

        {/* Section heading */}
        <div
          ref={ref}
          className={`text-center mb-14 transition-all duration-700 ease-in-out ${
            v ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div
            className="text-[11px] font-bold tracking-[2px] text-orange-400 mb-3"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            PLATFORM FEATURES
          </div>
          <h2
            className="font-black text-[clamp(26px,4vw,48px)] tracking-[-1.5px] text-slate-200"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Everything You Need,
            <span className="text-orange-400"> Nothing You Don't</span>
          </h2>
        </div>

        {/* Feature cards grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(290px,1fr))] gap-4">
          {FEAT.map((f) => (
            <div
              key={f.title}
              className="rounded-[14px] p-6 border border-[#151f30] bg-[#0d1322] transition-all duration-[250ms] cursor-default group"
              style={{ "--feat-color": f.color }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = f.color + "50";
                e.currentTarget.style.backgroundColor = f.color + "08";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#151f30";
                e.currentTarget.style.backgroundColor = "#0d1322";
              }}
            >
              {/* Icon box */}
              <div
                className="w-10 h-10 rounded-[9px] flex items-center justify-center text-[18px] mb-[14px]"
                style={{
                  background: f.color + "18",
                  border: `1px solid ${f.color}30`,
                  color: f.color,
                }}
              >
                {f.icon}
              </div>

              {/* Title */}
              <h3
                className="font-bold text-[14px] text-slate-200 mb-2"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {f.title}
              </h3>

              {/* Description */}
              <p className="text-[12px] text-slate-500 leading-[1.8]">
                {f.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default FeaturesRec
