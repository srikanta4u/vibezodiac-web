'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ── CHANGE THESE CREDENTIALS ──────────────────────────────────
const ADMIN_USERNAME = 'vibezodiac_admin'
const ADMIN_PASSWORD = 'VZ@Admin2026!'
// ─────────────────────────────────────────────────────────────

type Astrologer = {
  id: string
  full_name: string
  display_name: string
  email: string
  phone: string
  gender: string
  experience_years: number
  experience_level: string
  bio: string
  state: string
  city: string
  zipcode: string
  is_temple_affiliated: boolean
  temple_name: string
  temple_address: string
  temple_website: string
  astrology_types: string[]
  services_offered: string[]
  service_modes: string[]
  languages: string[]
  timezone: string
  consultation_fee: string
  profile_headline: string
  verification_status: 'pending' | 'approved' | 'rejected'
  is_active: boolean
  created_at: string
  profile_photo_url: string
}

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [astrologers, setAstrologers] = useState<Astrologer[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<FilterStatus>('pending')
  const [selected, setSelected] = useState<Astrologer | null>(null)
  const [actionMsg, setActionMsg] = useState('')
  const [counts, setCounts] = useState({ all: 0, pending: 0, approved: 0, rejected: 0 })

  const login = () => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setAuthed(true)
      setLoginError('')
    } else {
      setLoginError('Invalid username or password.')
    }
  }

  const fetchAstrologers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('astrologers')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error && data) {
      setAstrologers(data as Astrologer[])
      setCounts({
        all: data.length,
        pending: data.filter(a => a.verification_status === 'pending').length,
        approved: data.filter(a => a.verification_status === 'approved').length,
        rejected: data.filter(a => a.verification_status === 'rejected').length,
      })
    }
    setLoading(false)
  }

  useEffect(() => { if (authed) fetchAstrologers() }, [authed])

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('astrologers')
      .update({
        verification_status: status,
        is_active: status === 'approved',
      })
      .eq('id', id)

    if (!error) {
      setActionMsg(`✅ ${status === 'approved' ? 'Approved' : 'Rejected'} successfully!`)
      setSelected(null)
      fetchAstrologers()
      setTimeout(() => setActionMsg(''), 3000)
    }
  }

  const filtered = filter === 'all'
    ? astrologers
    : astrologers.filter(a => a.verification_status === filter)

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
  })

  const statusColor = (s: string) =>
    s === 'approved' ? '#22c55e' : s === 'rejected' ? '#ef4444' : '#f59e0b'

  const statusBg = (s: string) =>
    s === 'approved' ? 'rgba(34,197,94,0.1)' : s === 'rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)'

  // ── LOGIN SCREEN ─────────────────────────────────────────────
  if (!authed) return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Georgia', serif",
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,215,0,0.2)',
        borderRadius: '20px',
        padding: '3rem',
        width: '100%', maxWidth: '400px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔐</div>
          <div style={{ fontSize: '1.4rem', color: '#FFD700', fontWeight: 'bold', letterSpacing: '1px' }}>
            VibeZodiac Admin
          </div>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.3rem', letterSpacing: '2px' }}>
            ASTROLOGER MANAGEMENT
          </div>
        </div>

        {['Username', 'Password'].map((label, i) => (
          <div key={label} style={{ marginBottom: '1.2rem' }}>
            <label style={{ display: 'block', color: 'rgba(255,215,0,0.7)', fontSize: '0.82rem', marginBottom: '0.4rem', letterSpacing: '1px' }}>
              {label.toUpperCase()}
            </label>
            <input
              type={i === 1 ? 'password' : 'text'}
              value={i === 0 ? username : password}
              onChange={e => i === 0 ? setUsername(e.target.value) : setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              style={{
                width: '100%', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,215,0,0.2)',
                borderRadius: '10px', padding: '0.8rem 1rem',
                color: 'white', fontSize: '0.95rem', outline: 'none',
              }}
            />
          </div>
        ))}

        {loginError && (
          <div style={{ color: '#f87171', fontSize: '0.82rem', marginBottom: '1rem', textAlign: 'center' }}>
            {loginError}
          </div>
        )}

        <button onClick={login} style={{
          width: '100%',
          background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
          color: '#1a0a00', border: 'none', borderRadius: '10px',
          padding: '0.9rem', fontSize: '1rem', fontWeight: 'bold',
          cursor: 'pointer', fontFamily: "'Georgia', serif", letterSpacing: '1px',
        }}>
          Sign In →
        </button>
      </div>
    </div>
  )

  // ── DASHBOARD ─────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0d1a',
      fontFamily: "'Georgia', serif",
      color: 'white',
    }}>
      {/* Top bar */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,215,0,0.12)',
        padding: '1rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.1rem' }}>✨ VibeZodiac</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 0.75rem' }}>›</span>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Admin Dashboard</span>
        </div>
        <button onClick={() => setAuthed(false)} style={{
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.4)',
          borderRadius: '8px', padding: '0.4rem 1rem',
          cursor: 'pointer', fontSize: '0.8rem',
        }}>Sign Out</button>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Action message */}
        {actionMsg && (
          <div style={{
            background: 'rgba(34,197,94,0.12)',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: '10px', padding: '0.8rem 1.2rem',
            marginBottom: '1.5rem', color: '#22c55e', fontSize: '0.9rem',
          }}>{actionMsg}</div>
        )}

        {/* Stats */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px,1fr))',
          gap: '1rem', marginBottom: '2rem',
        }}>
          {([
            ['All', counts.all, '#818cf8', 'all'],
            ['Pending', counts.pending, '#f59e0b', 'pending'],
            ['Approved', counts.approved, '#22c55e', 'approved'],
            ['Rejected', counts.rejected, '#ef4444', 'rejected'],
          ] as [string, number, string, FilterStatus][]).map(([label, count, color, f]) => (
            <div key={label} onClick={() => setFilter(f)} style={{
              background: filter === f ? `${color}18` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${filter === f ? color + '50' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '12px', padding: '1.2rem',
              cursor: 'pointer', transition: 'all 0.2s',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color }}>{count}</div>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.3rem' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px', overflow: 'hidden',
        }}>
          <div style={{
            padding: '1rem 1.5rem',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>
              {filtered.length} {filter} registration{filtered.length !== 1 ? 's' : ''}
            </div>
            <button onClick={fetchAstrologers} style={{
              background: 'rgba(255,215,0,0.08)',
              border: '1px solid rgba(255,215,0,0.2)',
              color: '#FFD700', borderRadius: '8px',
              padding: '0.35rem 0.9rem', cursor: 'pointer', fontSize: '0.78rem',
            }}>↻ Refresh</button>
          </div>

          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
              Loading...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(255,255,255,0.25)' }}>
              No {filter} registrations
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                    {['Name', 'Email', 'Location', 'Expertise', 'Submitted', 'Status', 'Action'].map(h => (
                      <th key={h} style={{
                        padding: '0.8rem 1rem', textAlign: 'left',
                        color: 'rgba(255,215,0,0.5)', fontWeight: 'normal',
                        fontSize: '0.72rem', letterSpacing: '1px',
                        borderBottom: '1px solid rgba(255,255,255,0.06)',
                      }}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(a => (
                    <tr key={a.id} style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      transition: 'background 0.15s',
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ color: 'white', fontWeight: 'bold' }}>{a.full_name}</div>
                        <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>{a.display_name}</div>
                      </td>
                      <td style={{ padding: '0.9rem 1rem', color: 'rgba(255,255,255,0.55)' }}>
                        {a.email}<br />
                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>{a.phone}</span>
                      </td>
                      <td style={{ padding: '0.9rem 1rem', color: 'rgba(255,255,255,0.55)' }}>
                        {a.city}, {a.state}
                        {a.is_temple_affiliated && (
                          <div style={{ fontSize: '0.72rem', color: '#FFD700', opacity: 0.6 }}>🛕 {a.temple_name}</div>
                        )}
                      </td>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                          {(a.astrology_types || []).slice(0, 2).map(t => (
                            <span key={t} style={{
                              background: 'rgba(255,215,0,0.08)',
                              border: '1px solid rgba(255,215,0,0.15)',
                              color: 'rgba(255,215,0,0.6)',
                              padding: '0.1rem 0.5rem', borderRadius: '8px', fontSize: '0.7rem',
                            }}>{t}</span>
                          ))}
                          {(a.astrology_types || []).length > 2 && (
                            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>
                              +{a.astrology_types.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '0.9rem 1rem', color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>
                        {fmt(a.created_at)}
                      </td>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <span style={{
                          background: statusBg(a.verification_status),
                          color: statusColor(a.verification_status),
                          padding: '0.25rem 0.7rem', borderRadius: '20px', fontSize: '0.75rem',
                          textTransform: 'capitalize',
                        }}>{a.verification_status}</span>
                      </td>
                      <td style={{ padding: '0.9rem 1rem' }}>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button onClick={() => setSelected(a)} style={{
                            background: 'rgba(129,140,248,0.12)',
                            border: '1px solid rgba(129,140,248,0.25)',
                            color: '#818cf8', borderRadius: '6px',
                            padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.75rem',
                          }}>View</button>
                          {a.verification_status !== 'approved' && (
                            <button onClick={() => updateStatus(a.id, 'approved')} style={{
                              background: 'rgba(34,197,94,0.12)',
                              border: '1px solid rgba(34,197,94,0.25)',
                              color: '#22c55e', borderRadius: '6px',
                              padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.75rem',
                            }}>✓</button>
                          )}
                          {a.verification_status !== 'rejected' && (
                            <button onClick={() => updateStatus(a.id, 'rejected')} style={{
                              background: 'rgba(239,68,68,0.12)',
                              border: '1px solid rgba(239,68,68,0.25)',
                              color: '#ef4444', borderRadius: '6px',
                              padding: '0.3rem 0.7rem', cursor: 'pointer', fontSize: '0.75rem',
                            }}>✕</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── DETAIL MODAL ─── */}
      {selected && (
        <div onClick={() => setSelected(null)} style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(4px)',
          zIndex: 50,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#13102a',
            border: '1px solid rgba(255,215,0,0.15)',
            borderRadius: '20px',
            width: '100%', maxWidth: '680px',
            maxHeight: '85vh', overflowY: 'auto',
            padding: '2rem',
          }}>
            {/* Modal header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <div style={{ fontSize: '1.2rem', color: 'white', fontWeight: 'bold' }}>{selected.full_name}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>
                  {selected.email} • {selected.phone}
                </div>
              </div>
              <button onClick={() => setSelected(null)} style={{
                background: 'rgba(255,255,255,0.08)', border: 'none', color: 'white',
                width: '32px', height: '32px', borderRadius: '50%',
                cursor: 'pointer', fontSize: '1rem',
              }}>✕</button>
            </div>

            {/* Detail rows */}
            {[
              ['Status', <span style={{ color: statusColor(selected.verification_status), textTransform: 'capitalize' }}>{selected.verification_status}</span>],
              ['Location', `${selected.city}, ${selected.state} ${selected.zipcode}`],
              ['Experience', `${selected.experience_years} yrs • ${selected.experience_level}`],
              ['Languages', (selected.languages || []).join(', ')],
              ['Service Modes', (selected.service_modes || []).join(', ')],
              ['Consultation Fee', selected.consultation_fee || 'Not set'],
              ['Timezone', selected.timezone],
              ['Submitted', fmt(selected.created_at)],
            ].map(([label, value]) => (
              <div key={label as string} style={{
                display: 'flex', gap: '1rem',
                padding: '0.65rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div style={{ width: '140px', flexShrink: 0, color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>{label}</div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem' }}>{value as any}</div>
              </div>
            ))}

            {/* Temple */}
            {selected.is_temple_affiliated && (
              <div style={{ padding: '0.65rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '1rem' }}>
                <div style={{ width: '140px', flexShrink: 0, color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>Temple</div>
                <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem' }}>
                  🛕 {selected.temple_name}<br />
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>{selected.temple_address}</span>
                </div>
              </div>
            )}

            {/* Expertise */}
            <div style={{ padding: '0.65rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '1rem' }}>
              <div style={{ width: '140px', flexShrink: 0, color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>Expertise</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                {(selected.astrology_types || []).map(t => (
                  <span key={t} style={{
                    background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.15)',
                    color: 'rgba(255,215,0,0.7)', padding: '0.15rem 0.55rem',
                    borderRadius: '10px', fontSize: '0.75rem',
                  }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div style={{ padding: '0.65rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '1rem' }}>
              <div style={{ width: '140px', flexShrink: 0, color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>Bio</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', lineHeight: 1.6 }}>{selected.bio}</div>
            </div>

            {/* Headline */}
            {selected.profile_headline && (
              <div style={{ padding: '0.65rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '1rem' }}>
                <div style={{ width: '140px', flexShrink: 0, color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>Headline</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>{selected.profile_headline}</div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              {selected.verification_status !== 'approved' && (
                <button onClick={() => updateStatus(selected.id, 'approved')} style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  border: 'none', color: 'white', borderRadius: '10px',
                  padding: '0.85rem', cursor: 'pointer', fontSize: '0.95rem',
                  fontWeight: 'bold', fontFamily: "'Georgia', serif",
                }}>✓ Approve</button>
              )}
              {selected.verification_status !== 'rejected' && (
                <button onClick={() => updateStatus(selected.id, 'rejected')} style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  border: 'none', color: 'white', borderRadius: '10px',
                  padding: '0.85rem', cursor: 'pointer', fontSize: '0.95rem',
                  fontWeight: 'bold', fontFamily: "'Georgia', serif",
                }}>✕ Reject</button>
              )}
              <button onClick={() => setSelected(null)} style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)', borderRadius: '10px',
                padding: '0.85rem 1.5rem', cursor: 'pointer', fontSize: '0.9rem',
              }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
