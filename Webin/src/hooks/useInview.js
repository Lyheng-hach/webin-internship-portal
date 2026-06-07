import React, { useEffect, useRef, useState } from 'react'

function useInview(threshold=0.12) {
  const ref=useRef(null), [v,setV]=useState(false);
  useEffect(()=>{
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting)setV(true);},{threshold});
    if(ref.current)obs.observe(ref.current);
    return()=>obs.disconnect();
  },[threshold]);
  return[ref,v];
}

export default useInview
