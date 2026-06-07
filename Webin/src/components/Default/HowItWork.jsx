import React, { useState } from 'react'
import useInview from '../../hooks/useInview';
import COLORS from '../../assets/Default/theme'

const STEPS=[
  {phase:"01",actor:"COMPANY",   color:COLORS.company,   title:"Post an Internship",  desc:"Companies get verified by Admin, then post positions with full requirements and slot limits."},
  {phase:"02",actor:"STUDENT",   color:COLORS.student,   title:"Discover & Apply",    desc:"Students browse open positions and apply attaching cover letters from their document vault."},
  {phase:"03",actor:"COMPANY",   color:COLORS.company,   title:"Review & Accept",     desc:"Companies review applications, add remarks, and accepted students are linked to an Intern Info record."},
  {phase:"04",actor:"SUPERVISOR",color:COLORS.supervisor,title:"Academic Oversight",  desc:"A university lecturer is assigned. They monitor progress and write midterm + final evaluations."},
  {phase:"05",actor:"ADMIN",     color:COLORS.indigo,    title:"Monitor & Manage",    desc:"Admins have full platform visibility — verifying companies, managing accounts, checking documents."},
];

const HowItWork = () => {
    const [active,setActive]=useState(0)
    const [ref,v]=useInview();
    return (
        <section id="howitwork" className="py-[90px] px-10 pb-[110px] relative z-10">
            <div className="max-w-[1060px] mx-auto">

                {/* ── Heading ── */}
                <div
                ref={ref}
                className={`text-center mb-14 transition-all duration-700 ease-in-out ${
                    v ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                }`}
                >
                <div
                    className="text-[11px] font-bold tracking-[2px] text-emerald-400 mb-3"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                >
                    HOW IT WORKS
                </div>
                <h2
                    className="font-black text-[clamp(26px,4vw,48px)] tracking-[-1.5px] text-slate-200"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                >
                    From Post to{" "}
                    <span className="text-emerald-400">Evaluation</span>
                </h2>
                </div>

                {/* ── Grid ── */}
                <div className="grid grid-cols-[1fr_1.4fr] gap-9 items-start">

                {/* ── Step list ── */}
                <div className="flex flex-col gap-1">
                    {STEPS.map((s, i) => (
                    <div
                        key={i}
                        onClick={() => setActive(i)}
                        className="flex items-center gap-3 px-4 py-[13px] rounded-[10px] cursor-pointer transition-all duration-200 border"
                        style={{
                        background: active === i ? `${s.color}0e` : "transparent",
                        borderColor: active === i ? `${s.color}40` : "transparent",
                        }}
                    >
                        {/* Phase number */}
                        <span
                        className="text-[11px] font-black tracking-[1px] min-w-[22px]"
                        style={{
                            fontFamily: "'Syne', sans-serif",
                            color: active === i ? s.color : "#64748b",
                        }}
                        >
                        {s.phase}
                        </span>

                        <div>
                        {/* Actor pill */}
                        <span
                            className="text-[9px] font-bold tracking-[1px] px-[7px] py-[1px] rounded-full"
                            style={{
                            fontFamily: "'Syne', sans-serif",
                            color: s.color,
                            background: `${s.color}12`,
                            border: `1px solid ${s.color}25`,
                            }}
                        >
                            {s.actor}
                        </span>

                        {/* Step title */}
                        <div
                            className="text-[13px] font-bold mt-[5px]"
                            style={{
                            fontFamily: "'Syne', sans-serif",
                            color: active === i ? "#e2e8f0" : "#94a3b8",
                            }}
                        >
                            {s.title}
                        </div>
                        </div>
                    </div>
                    ))}
                </div>

                {/* ── Detail panel ── */}
                <div
                    className="relative rounded-2xl p-8 overflow-hidden transition-[border-color] duration-300 bg-[#0d1322]"
                    style={{ border: `1px solid ${STEPS[active].color}40` }}
                >
                    {/* Big ghost number */}
                    <div
                    className="absolute -top-2.5 right-4 text-[100px] font-black leading-none pointer-events-none select-none"
                    style={{
                        fontFamily: "'Syne', sans-serif",
                        color: `${STEPS[active].color}06`,
                    }}
                    >
                    {STEPS[active].phase}
                    </div>

                    <div className="relative">
                    {/* Actor label */}
                    <span
                        className="text-[10px] font-bold tracking-[2px]"
                        style={{
                        fontFamily: "'Syne', sans-serif",
                        color: STEPS[active].color,
                        }}
                    >
                        {STEPS[active].actor} ACTION
                    </span>

                    {/* Title */}
                    <h3
                        className="font-black text-2xl tracking-[-0.8px] text-slate-200 mt-2.5 mb-3.5"
                        style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                        {STEPS[active].title}
                    </h3>

                    {/* Description */}
                    <p className="text-[13.5px] text-slate-500 leading-[1.9]">
                        {STEPS[active].desc}
                    </p>

                    {/* ── Prev / Dots / Next ── */}
                    <div className="flex items-center justify-between mt-7">

                        {/* Prev */}
                        <button
                        onClick={() => setActive((p) => Math.max(0, p - 1))}
                        className="px-3.5 py-[7px] rounded-lg border bg-transparent text-[11px] font-semibold transition-colors duration-200"
                        style={{
                            fontFamily: "'Syne', sans-serif",
                            borderColor: "#151f30",
                            color: active === 0 ? "#151f30" : "#94a3b8",
                            cursor: active === 0 ? "default" : "pointer",
                        }}
                        >
                        ← Prev
                        </button>

                        {/* Dots */}
                        <div className="flex items-center gap-[5px]">
                        {STEPS.map((s, i) => (
                            <div
                            key={i}
                            onClick={() => setActive(i)}
                            className="h-[5px] rounded-[3px] cursor-pointer transition-all duration-300"
                            style={{
                                width: i === active ? 18 : 5,
                                background: i === active ? STEPS[active].color : "#151f30",
                            }}
                            />
                        ))}
                        </div>

                        {/* Next */}
                        <button
                        onClick={() => setActive((p) => Math.min(STEPS.length - 1, p + 1))}
                        className="px-3.5 py-[7px] rounded-lg border bg-transparent text-[11px] font-semibold transition-colors duration-200"
                        style={{
                            fontFamily: "'Syne', sans-serif",
                            borderColor: "#151f30",
                            color: active === STEPS.length - 1 ? "#151f30" : "#94a3b8",
                            cursor: active === STEPS.length - 1 ? "default" : "pointer",
                        }}
                        >
                        Next →
                        </button>

                    </div>
                    </div>
                </div>

                </div>
            </div>
        </section>
    )
}

export default HowItWork
