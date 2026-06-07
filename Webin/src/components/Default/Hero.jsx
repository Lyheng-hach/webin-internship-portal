import React, { useEffect, useState } from 'react'
import assets from '../../assets/Default/assets';
import useInview from '../../hooks/useInview';

function Counter({target,suffix=""}){
  const [val,setVal]=useState(0);
  const [ref,v]=useInview();
  useEffect(()=>{
    if(!v)return;
    let s=0;const step=target/60;
    const id=setInterval(()=>{s+=step;if(s>=target){setVal(target);clearInterval(id);}else setVal(Math.floor(s));},16);
    return()=>clearInterval(id);
  },[v,target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

const Hero = () => {
    const [fade, setFade] = useState(true);
    const [wi, setWi] = useState(0);

    const words = ["Students.", "Companies.", "Supervisors."];

    useEffect(() => {
    const id = setInterval(() => {
        setFade(false);
        setTimeout(() => {
        setWi(p => (p + 1) % words.length);
        setFade(true);
        }, 350);
    }, 2800);
    return () => clearInterval(id);
    }, [words.length]);
  return (
    <div id='hero' className='flex flex-col items-center gap-6 py-5 px-4 sm:px-12 lg:px-24 xl:px-40 text-center w-full overflow-hidden text-gray-700 dark:text-white'>
        <div className="inline-flex items-center gap-2 border border-sky-400/25 bg-sky-400/[0.06] rounded-full px-4 py-1.5 mb-10 animate-[fadeUp_0.8s_ease_both]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,1)]"/>
            <span className='text-[11px] font-semibold tracking-[1px] font-display text-blue-400'>INTERNSHIP MANAGEMENT PLATFORM</span>
        </div>
        <h1 className='text-4xl sm:text-5xl md:text-6xl xl:text-[84px] font-medium xl:leading-[95px] max-w-5xl'>
            Bridging the Gap Between
            <span className='bg-gradient-to-r dark:from-[#9600FF] to-[#fbbf24] bg-clip-text text-transparent from-blue-500 '> Academia &amp; Industry</span>
        </h1>
        <div
        className="font-bold mb-7 text-slate-500"
        style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(16px, 2.5vw, 26px)",
            animation: "fadeUp 1s ease 0.2s both",
        }}
        >
        Built for{" "}
            <span
                className="inline-block transition-opacity duration-[350ms] ease-in-out text-orange-300"
                style={{ opacity: fade ? 1 : 0 }}
            >
                {words[wi]}
            </span>
        </div>
        <p className='text-slate-500 leading-relaxed max-w-[520px] mb-11'>
            Webin streamlines the entire internship lifecycle - from application and placement to evalution and document management - in one unified platform.
        </p>
        <div>
            <img src={assets.image_head} alt="" className='w-full max-w-6xl rounded-xl'/>
        </div>
        <div className="flex gap-11 mt-[72px] [animation:fadeUp_1s_ease_0.5s_both] flex-wrap justify-center">
            {[
                { n: 1200, s: "+", label: "Students",    c: "text-sky-400",    glow: "drop-shadow-[0_0_18px_rgba(56,189,248,0.33)]"  },
                { n: 340,  s: "+", label: "Companies",   c: "text-orange-400", glow: "drop-shadow-[0_0_18px_rgba(251,146,60,0.33)]"  },
                { n: 98,   s: "%", label: "Success Rate",c: "text-emerald-400",glow: "drop-shadow-[0_0_18px_rgba(52,211,153,0.33)]"  },
                { n: 80,   s: "+", label: "Supervisors", c: "text-violet-400", glow: "drop-shadow-[0_0_18px_rgba(192,132,252,0.33)]" },
            ].map(({ n, s, label, c, glow }) => (
                <div key={label} className="text-center">
                    <div
                        className={`font-black text-[34px] leading-none ${c} ${glow}`}
                        style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                        <Counter target={n} suffix={s} />
                </div>
                <div className="text-[11px] text-slate-500 tracking-[0.5px] mt-1">
                    {label}
                </div>
            </div>
        ))}
        </div>
    </div>
  )
}

export default Hero
