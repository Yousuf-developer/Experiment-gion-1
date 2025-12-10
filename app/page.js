import CustomCursor from '@/Components/CustomCursor'
import Navbar from '@/Components/Navbar'
import HeroSection from '@/Sections/HeroSection'
import React from 'react'

const page = () => {
  return (
    <div className='body-wrapper bg-black'>

      <header>
        <Navbar/>
        <HeroSection/>
      </header>
         

         <CustomCursor/>
 
    </div>
  )
}

export default page