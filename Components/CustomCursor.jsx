'use client'
import React, { useEffect, useRef } from 'react'

const CustomCursor = () => {
  const cursorRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    // Hide the default cursor
    document.body.style.cursor = 'none'

    const handleMouseMove = (e) => {
      const { clientX: x, clientY: y } = e
      // Smooth follow using translate
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.body.style.cursor = 'default' // restore cursor on unmount
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className='invert-100 mix-blend-exclusion'
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '20px',       // adjust size as needed
        height: '20px',
        pointerEvents: 'none',
        backgroundImage: 'url(/cursor.png)',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        transform: 'translate3d(0,0,0)',
        zIndex: 9999,
      }}
    />
  )
}

export default CustomCursor
