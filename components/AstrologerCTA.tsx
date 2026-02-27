'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

// ─── BANNER (Option 2) ────────────────────────────────────────
// Place this RIGHT AFTER <ZodiacWheel /> in app/page.tsx
export function AstrologerBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{
      maxWidth: '860px',
      margin: '0 auto 1.5rem',
      padding: '0 1rem',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(12px)',
      transition: 'opacity 0.6s ease, transform 0.6s ease',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(26,5,51,0.95) 0%, rgba(45,27,105,0.9) 50%, rgba(26,5,51,0.95) 100%)',
        border: '1px solid rgba(255,215,0,0.25)',
        borderRadius: '16px',
        padding: '1.1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,215,0,0.1)',
        flexWrap: 'wrap',
      }}>
        {/* Left: icon + text */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: '220px' }}>
          {/* Animated icon */}
          <div style={{
            width: '48px', height: '48px', flexShrink: 0,
            background: 'linear-gradient(135deg, rgba(255,215,0,0.2), rgba(255,140,0,0.1))',
            border: '1px solid rgba(255,215,0,0.35)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem',
            animation: 'pulse 3s ease-in-out infinite',
          }}>
            🔮
          </div>
          <div>
            <div style={{
              fontFamily: "'Georgia', serif",
              fontWeight: 'bold',
              fontSize: '0.95rem',
              color: '#FFD700',
              marginBottom: '0.15rem',
              letterSpacing: '0.3px',
            }}>
              Are you a Vedic Priest or Astrologer?
            </div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
              Join VibeZodiac — connect with seekers across the USA, Canada, India, Australia and UK • Free to register
            </div>
          </div>
        </div>

        {/* Right: CTA */}
        <Link href="/join-as-astrologer" style={{
          background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
          color: '#1a0a00',
          padding: '0.6rem 1.4rem',
          borderRadius: '10px',
          fontWeight: 'bold',
          fontSize: '0.85rem',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          flexShrink: 0,
          fontFamily: "'Georgia', serif",
          letterSpacing: '0.3px',
          boxShadow: '0 4px 12px rgba(255,140,0,0.3)',
          transition: 'transform 0.15s, box-shadow 0.15s',
          display: 'inline-block',
        }}
          onMouseEnter={e => {
            (e.target as HTMLElement).style.transform = 'translateY(-1px)'
            ;(e.target as HTMLElement).style.boxShadow = '0 6px 18px rgba(255,140,0,0.45)'
          }}
          onMouseLeave={e => {
            (e.target as HTMLElement).style.transform = 'translateY(0)'
            ;(e.target as HTMLElement).style.boxShadow = '0 4px 12px rgba(255,140,0,0.3)'
          }}
        >
          Join as Astrologer →
        </Link>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,215,0,0.2); }
          50% { box-shadow: 0 0 0 8px rgba(255,215,0,0); }
        }
      `}</style>
    </div>
  )
}

// ─── FULL SECTION (Option 3) ──────────────────────────────────
// Place this BELOW the zodiac section, ABOVE Footer in app/page.tsx
export function AstrologerSection() {
  const [hovered, setHovered] = useState(false)

  return (
    <section style={{
      background: 'linear-gradient(160deg, #0a0015 0%, #1a0533 40%, #0d1a3a 100%)',
      borderTop: '1px solid rgba(255,215,0,0.12)',
      padding: '5rem 1.5rem',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Background decorative stars */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {['10%,15%','85%,20%','20%,75%','90%,65%','50%,8%','70%,85%','5%,50%'].map((pos, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: pos.split(',')[0], top: pos.split(',')[1],
            width: i % 2 === 0 ? '2px' : '3px', height: i % 2 === 0 ? '2px' : '3px',
            background: '#FFD700', borderRadius: '50%',
            opacity: 0.15 + (i * 0.05),
            animation: `twinkle ${2 + i * 0.4}s ease-in-out infinite alternate`,
          }} />
        ))}
        <div style={{
          position: 'absolute', top: '-60px', right: '5%',
          fontSize: '18rem', color: 'rgba(255,215,0,0.02)',
          lineHeight: 1, userSelect: 'none', fontFamily: 'serif',
        }}>✦</div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Section badge */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(255,215,0,0.1)',
            border: '1px solid rgba(255,215,0,0.25)',
            borderRadius: '20px',
            padding: '0.35rem 1.2rem',
            fontSize: '0.72rem',
            color: '#FFD700',
            letterSpacing: '2.5px',
            fontFamily: "'Georgia', serif",
            textTransform: 'uppercase',
          }}>
            For Priests & Vedic Experts
          </span>
        </div>

        {/* 2-column layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '4rem',
          alignItems: 'center',
        }}>

          {/* ── LEFT: Text content ── */}
          <div>
            <h2 style={{
              fontFamily: "'Georgia', serif",
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              color: 'white',
              margin: '0 0 1rem',
              lineHeight: 1.25,
              fontWeight: 'normal',
            }}>
              Share Your Wisdom.<br />
              <span style={{ color: '#FFD700' }}>Reach Seekers Across the USA, Canada, India, Australia and UK.</span>
            </h2>

            <p style={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: '1rem',
              lineHeight: 1.8,
              marginBottom: '1.8rem',
              fontFamily: "'Georgia', serif",
            }}>
              Are you a temple priest, Vedic astrologer, or spiritual guide?
              VibeZodiac connects you with thousands of seekers looking for
              authentic guidance in marriage, career, and life's journey.
            </p>

            {/* Feature list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2.2rem' }}>
              {[
                ['🛕', 'Affiliated with 671+ US Hindu temples'],
                ['🌐', 'Connect via phone, video, chat or email'],
                ['📅', 'Set your own schedule & availability'],
                ['💰', 'Start free — earn from consultations'],
                ['✅', 'Verified profile, trusted community'],
              ].map(([icon, text]) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    width: '32px', height: '32px', flexShrink: 0,
                    background: 'rgba(255,215,0,0.08)',
                    border: '1px solid rgba(255,215,0,0.15)',
                    borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.95rem',
                  }}>{icon}</span>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.92rem', fontFamily: "'Georgia', serif" }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div>
              <Link
                href="/join-as-astrologer"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                style={{
                  display: 'inline-block',
                  background: hovered
                    ? 'linear-gradient(135deg, #FFE033, #FF9D00)'
                    : 'linear-gradient(135deg, #FFD700, #FF8C00)',
                  color: '#1a0a00',
                  padding: '0.9rem 2.2rem',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  fontFamily: "'Georgia', serif",
                  letterSpacing: '0.5px',
                  boxShadow: hovered
                    ? '0 8px 28px rgba(255,140,0,0.5)'
                    : '0 4px 16px rgba(255,140,0,0.3)',
                  transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
                  transition: 'all 0.2s ease',
                }}
              >
                🔮 Register as Astrologer →
              </Link>
              <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.25)', fontFamily: "'Georgia', serif" }}>
                Takes 5 minutes • Free to join • Start earning today
              </p>
            </div>
          </div>

          {/* ── RIGHT: Sample profile card ── */}
          <div style={{
            background: 'linear-gradient(160deg, rgba(255,215,0,0.07), rgba(255,140,0,0.04))',
            border: '1px solid rgba(255,215,0,0.15)',
            borderRadius: '20px',
            padding: '2rem',
            position: 'relative',
            backdropFilter: 'blur(10px)',
          }}>
            {/* "Sample" badge */}
            <div style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'rgba(255,215,0,0.1)',
              border: '1px solid rgba(255,215,0,0.2)',
              borderRadius: '20px',
              padding: '0.2rem 0.7rem',
              fontSize: '0.65rem',
              color: 'rgba(255,215,0,0.5)',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              fontFamily: "'Georgia', serif",
            }}>Sample Profile</div>

            {/* Avatar */}
            <div style={{ textAlign: 'center', marginBottom: '1.2rem' }}>
              <div style={{
                width: '90px', height: '90px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(255,215,0,0.25), rgba(255,140,0,0.1))',
                border: '2px solid rgba(255,215,0,0.35)',
                margin: '0 auto 0.75rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '2.5rem',
              }}>🧘</div>
              <div style={{ fontFamily: "'Georgia', serif", fontSize: '1.1rem', color: 'white', marginBottom: '0.2rem' }}>
                Pandit Rajan Sharma
              </div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,215,0,0.6)' }}>
                Vedic Astrologer • ISKCON New York
              </div>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center', marginBottom: '1.2rem' }}>
              {['Kundli', 'Marriage', 'Muhurat', 'Hindi', 'Telugu', 'Sanskrit'].map(tag => (
                <span key={tag} style={{
                  background: 'rgba(255,215,0,0.08)',
                  border: '1px solid rgba(255,215,0,0.2)',
                  color: 'rgba(255,215,0,0.7)',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '12px',
                  fontSize: '0.72rem',
                  fontFamily: "'Georgia', serif",
                }}>{tag}</span>
              ))}
            </div>

            {/* Stats row */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
              gap: '0.5rem',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              paddingTop: '1.2rem',
              marginBottom: '1.2rem',
            }}>
              {[['18', 'Yrs Exp'], ['4.9 ★', 'Rating'], ['240+', 'Sessions']].map(([num, lbl]) => (
                <div key={lbl} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Georgia', serif", fontSize: '1.1rem', color: '#FFD700', fontWeight: 'bold' }}>{num}</div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.1rem' }}>{lbl}</div>
                </div>
              ))}
            </div>

            {/* Modes */}
            <div style={{
              display: 'flex', gap: '0.5rem', justifyContent: 'center',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              paddingTop: '1rem',
            }}>
              {[['📞','Phone'], ['📹','Video'], ['💬','Chat'], ['📧','Email']].map(([icon, lbl]) => (
                <div key={lbl} style={{
                  textAlign: 'center', padding: '0.4rem 0.6rem',
                  background: 'rgba(255,255,255,0.04)', borderRadius: '8px',
                  flex: 1,
                }}>
                  <div style={{ fontSize: '1rem' }}>{icon}</div>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.15rem' }}>{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom trust strip */}
        <div style={{
          marginTop: '4rem',
          paddingTop: '2.5rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1.5rem',
          textAlign: 'center',
        }}>
          {[
            ['671+', 'US Hindu Temples'],
            ['5 min', 'To Register'],
            ['Free', 'To Join'],
            ['USA', 'Nationwide Reach'],
          ].map(([num, lbl]) => (
            <div key={lbl}>
              <div style={{ fontFamily: "'Georgia', serif", fontSize: '1.6rem', color: '#FFD700', fontWeight: 'bold' }}>{num}</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.3rem' }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes twinkle {
          from { opacity: 0.1; transform: scale(1); }
          to   { opacity: 0.4; transform: scale(1.5); }
        }
      `}</style>
    </section>
  )
}
