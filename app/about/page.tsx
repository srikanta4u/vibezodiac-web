import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'

export const metadata = {
  title: 'About Us - VibeZodiac',
  description: 'Learn about VibeZodiac - Your cosmic companion for daily horoscopes and astrological guidance'
}

export default function AboutPage() {
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
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#667eea' }}>About VibeZodiac</h1>
          
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#333', marginBottom: '2rem' }}>
            At VibeZodiac, we believe that understanding yourself and your life's path should be empowering, 
            uplifting, and insightful. In a world full of noise and uncertainty, our mission is simple — to 
            help you decode your destiny with clarity, confidence, and cosmic perspective.
          </p>

          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#667eea', marginBottom: '1rem' }}>Who We Are</h2>
            <p style={{ lineHeight: 1.8, color: '#333' }}>
              VibeZodiac was born out of a deep passion for astrology and human potential. We are a team of 
              modern mystics, experienced astrologers, intuitive readers, and spiritual guides who come together 
              to build a space where ancient wisdom meets genuine personal transformation.
            </p>
            <p style={{ lineHeight: 1.8, color: '#333', marginTop: '1rem' }}>
              We believe astrology isn't just about predictions — it's about understanding your unique cosmic 
              blueprint and using that knowledge to make better, more authentic decisions in life.
            </p>
          </section>

          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#667eea', marginBottom: '1rem' }}>What We Do</h2>
            <p style={{ lineHeight: 1.8, color: '#333', marginBottom: '1rem' }}>
              At VibeZodiac, we bring the universe closer to you. Whether you're searching for clarity in love, 
              purpose in career, harmony in relationships, or deeper self-understanding, we offer guidance that's:
            </p>
            <ul style={{ lineHeight: 2, color: '#333', paddingLeft: '2rem' }}>
              <li><strong>Personalized</strong> — Every reading is tailored to your birth details and life context</li>
              <li><strong>Insightful</strong> — We go beyond generic horoscopes to deliver meaningful perspective</li>
              <li><strong>Uplifting</strong> — Our focus is on empowering you to take action with confidence</li>
              <li><strong>Accessible</strong> — Guidance that's available whenever you need it, in a format that fits your life</li>
            </ul>
          </section>

          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#667eea', marginBottom: '1rem' }}>Our Vision</h2>
            <p style={{ lineHeight: 1.8, color: '#333' }}>
              We want everyone to feel connected to their bigger story — to see patterns in their lives, 
              embrace their strengths, understand their challenges, and walk forward with purpose. Your stars 
              aren't just predictions — they're invitations to grow.
            </p>
          </section>

          <section style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#667eea', marginBottom: '1rem' }}>Why VibeZodiac</h2>
            <p style={{ 
              lineHeight: 1.8, 
              color: '#333',
              fontSize: '1.1rem',
              fontStyle: 'italic',
              marginBottom: '1rem'
            }}>
              Because life isn't random — it's written in the stars • interpreted with heart • and lived with intention.
            </p>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '2rem',
              borderRadius: '15px',
              color: 'white',
              textAlign: 'center',
              marginTop: '1.5rem'
            }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>At VibeZodiac:</p>
              <p style={{ fontSize: '1.3rem', lineHeight: 1.8 }}>
                💫 You're heard<br/>
                💫 You're guided<br/>
                💫 You're supported on your journey
              </p>
            </div>
            <p style={{ lineHeight: 1.8, color: '#333', marginTop: '1.5rem' }}>
              Our community is built on trust, authenticity, and genuine guidance — not guesswork.
            </p>
          </section>

          <section style={{
            background: '#f8f9fa',
            padding: '2rem',
            borderRadius: '15px',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '1.8rem', color: '#667eea', marginBottom: '1rem' }}>Join Us on Your Journey</h2>
            <p style={{ lineHeight: 1.8, color: '#333', marginBottom: '1.5rem' }}>
              Whether you're curious about your sun sign, exploring the depth of your birth chart, or seeking 
              guidance during a life transition — VibeZodiac is your cosmic companion.
            </p>
            <p style={{ 
              fontSize: '1.3rem', 
              color: '#667eea', 
              fontWeight: 'bold'
            }}>
              Let's discover your unique vibe. 🌌
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
