export function Footer() {
  return (
    <footer style={{
      background: '#2d3748',
      color: 'white',
      padding: '3rem 2rem',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem'
      }}>
        {/* About */}
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>About VibeZodiac</h3>
          <p style={{ color: '#a0aec0', lineHeight: 1.6 }}>
            Your daily cosmic companion for horoscopes and astrological guidance.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Quick Links</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="/" style={{ color: '#a0aec0', textDecoration: 'none' }}>Home</a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="/about" style={{ color: '#a0aec0', textDecoration: 'none' }}>About</a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="/contact" style={{ color: '#a0aec0', textDecoration: 'none' }}>Contact</a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="/privacy" style={{ color: '#a0aec0', textDecoration: 'none' }}>Privacy Policy</a>
            </li>
          </ul>
        </div>

        {/* Zodiac Signs */}
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Zodiac Signs</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].map(sign => (
              <span key={sign} style={{ color: '#a0aec0', fontSize: '0.9rem' }}>{sign}</span>
            ))}
          </div>
        </div>

        {/* Legal */}
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Legal</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="/privacy" style={{ color: '#a0aec0', textDecoration: 'none' }}>Privacy Policy</a>
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              <a href="/contact" style={{ color: '#a0aec0', textDecoration: 'none' }}>Terms of Service</a>
            </li>
          </ul>
          <div style={{
            background: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            padding: '0.75rem',
            marginTop: '1rem'
          }}>
            <p style={{ color: '#856404', fontSize: '0.8rem', margin: 0 }}>
              ⚠️ For entertainment purposes only
            </p>
          </div>
        </div>
      </div>

      <div style={{
        textAlign: 'center',
        marginTop: '2rem',
        paddingTop: '2rem',
        borderTop: '1px solid #4a5568',
        color: '#a0aec0'
      }}>
        <p>© 2026 Vibezodiac. All rights reserved.</p>
      </div>
    </footer>
  )
}
