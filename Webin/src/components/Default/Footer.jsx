import React from 'react'

const Footer = () => {
  return (
    <footer className="py-9 px-10 relative z-10 border-t border-[#151f30] bg-[rgba(7,9,15,0.8)]">
  <div className="max-w-[1160px] mx-auto flex items-center justify-between flex-wrap gap-[14px]">

    {/* Brand */}
    <div>
      <div
        className="font-black text-[17px] bg-gradient-to-r from-sky-400 to-orange-400 bg-clip-text text-transparent"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        WEBIN
      </div>
      <div className="text-[11px] text-slate-500 mt-[3px]">
        Internship Management Platform
      </div>
    </div>

    {/* Copyright */}
    <div className="text-[11px] text-[#1e2d45]">
      © 2025 Webin. All rights reserved.
    </div>

  </div>
</footer>
  )
}

export default Footer
