import React, { useState } from 'react'
import Navbar from '../components/Default/Navbar';
import Hero from '../components/Default/Hero';
import FeaturesRec from '../components/Default/FeaturesRec';
import HowItWork from '../components/Default/HowItWork';
import Footer from '../components/Default/Footer';


const Home = () => {

  const [theme, setTheme] = useState(localStorage.getItem('theme') ? localStorage.getItem('theme') : 'light');
  
  return (
    <div className='dark:bg-black relative'>
      <Navbar theme={theme} setTheme={setTheme} />
      <Hero />
      <FeaturesRec />
      <HowItWork />
      <Footer />
    </div>
  )
}

export default Home
