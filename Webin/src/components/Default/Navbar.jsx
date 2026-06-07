import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import assets from '../../assets/Default/assets'
import ThemeToggleBtn from './ThemeToggleBtn'

const Navbar = ({theme, setTheme}) => {

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('home')

  return (
    <div className='flex justify-between items-center px-4 sm:px-12 lg:px-24 xl:px-40 py-4 sticky top-0 z-20 backdrop-blur-x1 font-medium bg-white/50 dark:bg-gray-900/70'>
      <img src={theme === 'dark' ? assets.logo_dark : assets.logo} className='w-32 sm:w-40' alt="" />
      <div className={`text-gray-700 dark:text-white sm:text-sm ${!sidebarOpen ? 'max-sm:w-0 overflow-hidden' : 'max-sm:w60 max-sm:pl-10'} max-sm:fixed top-0 bootom-0 right-0 max-sm:min-h-screen max-sm:h-full max-sm:flex-col max-sm:bg-primary max-sm:text-white max-sm:pt-20 flex sm:items-center gap-10 transition-all border-2 border-gray-300 dark:border-gray-700 px-20 py-2 rounded-xl `}>

        <img src={assets.close_icon} alt="" className='w-5 absolute right-4 top-4 sm:hidden' onClick={()=> setSidebarOpen(false)}/>
    
        <a onClick={() => { setActiveLink('home'); setSidebarOpen(false); }} href="#" className={`sm:hover:text-blue-700 ${activeLink === 'home' ? 'text-blue-300' : ''}`}>Home</a>
        <a onClick={() => { setActiveLink('features'); setSidebarOpen(false); }} href="#features" className={`sm:hover:text-blue-700 ${activeLink === 'features' ? 'text-blue-300' : ''}`}>Feature</a>
        <a onClick={() => { setActiveLink('howitwork'); setSidebarOpen(false); }} href="#howitwork" className={`sm:hover:text-blue-700 ${activeLink === 'howitwork' ? 'text-blue-300' : ''}`}>How It Work</a>
      </div>
      <div className='flex items-center gap-2 sm:gap-4'>
        <ThemeToggleBtn theme={theme} setTheme={setTheme} />
        <img src={theme == 'dark' ? assets.menu_icon_dark : assets.menu_icon} alt="" onClick={()=> setSidebarOpen(true)} className='w-8 sm:hidden'/>
        <Link to="/login">
          <img
            src={theme === 'dark' ? assets.profile_dark : assets.profile_light}
            className='size-8.5 p-1 border-2 border-gray-500 rounded-full hover:border-blue-500 transition-colors'
            alt="Login"
          />
        </Link>
      </div>

      
    </div>
  )
}

export default Navbar
