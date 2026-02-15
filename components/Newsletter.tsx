'use client'
export function Newsletter() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '4rem 2rem',
      color: 'white',
      textAlign: 'center'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>📧 Subscribe to Newsletter</h2>
      <p style={{ marginBottom: '2rem' }}>Get daily horoscopes in your inbox!</p>
      <div style={{ maxWidth: '400px', margin: '0 auto' }}>
        <input 
          type="email" 
          placeholder="your@email.com" 
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '10px',
            border: 'none',
            marginBottom: '1rem'
          }}
        />
        <button style={{
          width: '100%',
          padding: '1rem',
          background: 'white',
          color: '#667eea',
          border: 'none',
          borderRadius: '10px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Subscribe
        </button>
      </div>
    </section>
  )
}
