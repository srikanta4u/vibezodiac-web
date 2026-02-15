import Link from 'next/link'
export function Footer() {
  return (
    <footer style={{
      background: '#2d3748',
      color: 'white',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <p>© 2026 Vibezodiac. All rights reserved.</p>
      <div style={{ marginTop: '1rem' }}>
        <Link href="/" style={{ color: 'white', margin: '0 1rem' }}>Home</Link>
        <Link href="/about" style={{ color: 'white', margin: '0 1rem' }}>About</Link>
        <Link href="/contact" style={{ color: 'white', margin: '0 1rem' }}>Contact</Link>
      </div>
      <p style={{ marginTop: '1rem', fontSize: '0.8rem', opacity: 0.7 }}>
        ⚠️ For entertainment purposes only
      </p>
    </footer>
  )
}
