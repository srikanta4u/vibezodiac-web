'use client'

import Link from 'next/link'
import { useState } from 'react'

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/" style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'white',
          textDecoration: 'none'
        }}>
          ✨ Vibezodiac
        </Link>

        <div style={{
          display: 'flex',
          gap: '2rem',
          alignItems: 'center'
        }}>
          <Link href="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
          <Link href="/about" style={{ color: 'white', textDecoration: 'none' }}>About</Link>
          <Link href="/contact" style={{ color: 'white', textDecoration: 'none' }}>Contact</Link>
          <Link href="/subscribe" style={{ color: 'white', textDecoration: 'none' }}>Subscribe</Link>
          <Link href="/kundli" style={{ color: '#FFD700', textDecoration: 'none', fontWeight: 'bold' }}>☸ Free Kundli</Link>
        </div>
      </div>
    </nav>
  )
}
