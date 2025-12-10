import React from 'react'

const Navbar = () => {
  return (
    <nav className='fixed z-[1000] top-0 left-0 text-[#fff] px-3 py-3 w-screen flex items-center justify-between'>
       

       {/* Logo Tag  */}

<div className='flex items-center justify-between w-[40%]'>
       <h3 className='text-sm font-lay'>GN  .D</h3>
       <h3 className='text-sm font-lay-normal'>Somewhere in Italy</h3>
       <h3 className='text-sm font-lay'>3:44 p.m</h3>

</div>

<div className='flex items-center justify-between w-[30%]'>
       <h3 className='text-sm font-lay'>Menu</h3>
       <div className='text-sm font-lay h-2.5 w-2.5 bg-[#FFB581] rounded-full'></div>
</div>


    </nav>
  )
}

export default Navbar