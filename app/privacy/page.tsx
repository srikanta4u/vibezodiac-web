import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
export const metadata = {
  title: 'Privacy Policy - VibeZodiac',
  description: 'Privacy Policy for VibeZodiac mobile app and website'
}

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navigation />
      
      <main style={{
        flex: 1,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '4rem 2rem'
      }}>
        <div style={{
          maxWidth: '900px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '20px',
          padding: '3rem',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#667eea' }}>Privacy Policy</h1>
          <p style={{ color: '#666', marginBottom: '2rem' }}><strong>Last Updated:</strong> February 16, 2026</p>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#667eea', marginBottom: '1rem' }}>1. Introduction</h2>
            <p style={{ lineHeight: 1.8, color: '#333' }}>
              VibeZodiac ("we", "our", "us") operates the VibeZodiac mobile application and website. 
              This Privacy Policy explains how we collect, use, and protect your information.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#667eea', marginBottom: '1rem' }}>2. Information We Collect</h2>
            
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', marginTop: '1rem', color: '#333' }}>2.1 Information You Provide</h3>
            <ul style={{ lineHeight: 1.8, color: '#333', paddingLeft: '2rem' }}>
              <li><strong>Email Address:</strong> Only if you subscribe to our newsletter</li>
              <li><strong>Zodiac Sign Preference:</strong> Stored locally on your device</li>
            </ul>

            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', marginTop: '1rem', color: '#333' }}>2.2 Information We Do NOT Collect</h3>
            <ul style={{ lineHeight: 1.8, color: '#333', paddingLeft: '2rem' }}>
              <li>We do NOT collect your name, address, or phone number</li>
              <li>We do NOT track your location</li>
              <li>We do NOT collect financial information</li>
              <li>We do NOT collect sensitive personal information</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#667eea', marginBottom: '1rem' }}>3. How We Use Your Information</h2>
            <ul style={{ lineHeight: 1.8, color: '#333', paddingLeft: '2rem' }}>
              <li>To provide daily horoscope content</li>
              <li>To improve our services</li>
              <li>To fix bugs and improve app stability</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#667eea', marginBottom: '1rem' }}>4. Data Storage</h2>
            <ul style={{ lineHeight: 1.8, color: '#333', paddingLeft: '2rem' }}>
              <li><strong>Local Storage:</strong> Preferences stored on your device only</li>
              <li><strong>Cloud Storage:</strong> Horoscope content stored securely</li>
              <li><strong>No Sharing:</strong> We do NOT sell or share your data</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#667eea', marginBottom: '1rem' }}>5. Third-Party Services</h2>
            <ul style={{ lineHeight: 1.8, color: '#333', paddingLeft: '2rem' }}>
              <li><strong>Supabase:</strong> Secure data storage</li>
              <li><strong>Vercel:</strong> Website hosting</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#667eea', marginBottom: '1rem' }}>6. Children's Privacy</h2>
            <p style={{ lineHeight: 1.8, color: '#333' }}>
              Our services are rated 4+ and do not knowingly collect information from children under 13.
            </p>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#667eea', marginBottom: '1rem' }}>7. Your Rights</h2>
            <ul style={{ lineHeight: 1.8, color: '#333', paddingLeft: '2rem' }}>
              <li>Access your data</li>
              <li>Delete your data</li>
              <li>Opt-out of communications</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#667eea', marginBottom: '1rem' }}>8. Disclaimer</h2>
            <div style={{
              background: '#fff3cd',
              border: '2px solid #ffc107',
              borderRadius: '10px',
              padding: '1.5rem',
              marginTop: '1rem'
            }}>
              <p style={{ lineHeight: 1.8, color: '#856404', margin: 0 }}>
                <strong>⚠️ Important:</strong> VibeZodiac is for entertainment purposes only. 
                Horoscope content is AI-generated and should not be considered professional advice.
              </p>
            </div>
          </section>

          <section>
            <h2 style={{ fontSize: '1.8rem', color: '#667eea', marginBottom: '1rem' }}>9. Contact Us</h2>
            <p style={{ lineHeight: 1.8, color: '#333' }}>
              Email: <a href="mailto:privacy@vibezodiac.com" style={{ color: '#667eea' }}>privacy@vibezodiac.com</a><br/>
              Website: <a href="https://vibezodiac.com" style={{ color: '#667eea' }}>vibezodiac.com</a>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
