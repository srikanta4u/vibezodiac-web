'use client'

import { useState, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase — replace with your project values
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// ─── Constants ───────────────────────────────────────────────
const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
  'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
  'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
  'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
  'Wisconsin','Wyoming'
]

const TIMEZONES = [
  'America/New_York','America/Chicago','America/Denver','America/Los_Angeles',
  'America/Phoenix','America/Anchorage','Pacific/Honolulu'
]

const ASTROLOGY_TYPES = [
  'Vedic Astrology','Kundli Reading','Horoscope Reading','Marriage Matching',
  'Muhurat Selection','Numerology','Palmistry','Face Reading','Tarot',
  'Nadi Astrology','Prashna Kundli','Vastu Consultation'
]

const SERVICES = [
  'Daily horoscope consultation','Kundli analysis','Marriage compatibility',
  'Career consultation','Financial consultation','Health astrology',
  'Muhurat selection','Vastu consultation','Festival / religious guidance'
]

const SERVICE_MODES = ['Phone','Video','Chat','Email']

const LANGUAGES = [
  'English','Hindi','Tamil','Telugu','Kannada','Malayalam',
  'Gujarati','Marathi','Bengali','Punjabi','Sanskrit','Other'
]

const WEEKDAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
const TIME_SLOTS = ['6AM–9AM','9AM–12PM','12PM–3PM','3PM–6PM','6PM–9PM','9PM–12AM']

const STEPS = [
  { num: 1, label: 'Basic Info',   icon: '👤' },
  { num: 2, label: 'Location',     icon: '📍' },
  { num: 3, label: 'Expertise',    icon: '🌟' },
  { num: 4, label: 'Services',     icon: '🛎' },
  { num: 5, label: 'Availability', icon: '📅' },
  { num: 6, label: 'Photo',        icon: '📸' },
  { num: 7, label: 'Review',       icon: '✅' },
]

// ─── Types ────────────────────────────────────────────────────
interface FormData {
  // Step 1
  full_name: string; display_name: string; email: string; phone: string
  gender: string; experience_years: string; experience_level: string
  bio: string
  // Step 2
  state: string; city: string; zipcode: string
  is_temple_affiliated: boolean; temple_name: string
  temple_address: string; temple_website: string
  // Step 3
  astrology_types: string[]; 
  // Step 4
  services_offered: string[]; service_modes: string[]
  languages: string[]; languages_other: string
  // Step 5
  timezone: string; availability: Record<string, string[]>
  available_from: string; available_to: string
  // Step 6
  profile_photo_url: string; certification_url: string
  // Step 7 / Profile
  profile_headline: string; profile_description: string
  consultation_fee: string
}

const INITIAL: FormData = {
  full_name:'', display_name:'', email:'', phone:'', gender:'', experience_years:'',
  experience_level:'', bio:'', state:'', city:'', zipcode:'',
  is_temple_affiliated: false, temple_name:'', temple_address:'', temple_website:'',
  astrology_types:[], services_offered:[], service_modes:[], languages:[],
  languages_other:'', timezone:'America/New_York', availability:{},
  available_from:'18:00', available_to:'22:00',
  profile_photo_url:'', certification_url:'',
  profile_headline:'', profile_description:'', consultation_fee:'Free',
}

// ─── Helper components ────────────────────────────────────────

function Label({ children, required }: { children: React.ReactNode, required?: boolean }) {
  return (
    <label style={{ display:'block', color:'rgba(255,215,0,0.75)', fontSize:'0.8rem',
      letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:'0.45rem', fontFamily:"'Cinzel', serif" }}>
      {children}{required && <span style={{ color:'#f87171', marginLeft:'3px' }}>*</span>}
    </label>
  )
}

const inputCss: React.CSSProperties = {
  width:'100%', background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,215,0,0.2)',
  borderRadius:'10px', padding:'0.75rem 1rem', color:'white', fontSize:'0.95rem',
  outline:'none', boxSizing:'border-box', fontFamily:"'Crimson Text', serif",
  transition:'border-color 0.2s',
}

function Input({ label, required, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string, required?: boolean }) {
  return (
    <div>
      {label && <Label required={required}>{label}</Label>}
      <input {...props} required={required} style={{ ...inputCss, ...props.style }} />
    </div>
  )
}

function Select({ label, required, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string, required?: boolean }) {
  return (
    <div>
      {label && <Label required={required}>{label}</Label>}
      <select {...props} required={required} style={{ ...inputCss, cursor:'pointer', ...props.style }}>
        {children}
      </select>
    </div>
  )
}

function Textarea({ label, required, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string, required?: boolean }) {
  return (
    <div>
      {label && <Label required={required}>{label}</Label>}
      <textarea {...props} required={required} style={{ ...inputCss, minHeight:'100px', resize:'vertical', ...props.style }} />
    </div>
  )
}

function CheckPill({ label, checked, onChange }: { label:string, checked:boolean, onChange:()=>void }) {
  return (
    <button type="button" onClick={onChange} style={{
      padding:'0.45rem 1rem', borderRadius:'20px', fontSize:'0.82rem',
      border: checked ? '1px solid #FFD700' : '1px solid rgba(255,255,255,0.15)',
      background: checked ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.04)',
      color: checked ? '#FFD700' : 'rgba(255,255,255,0.6)',
      cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap',
      fontFamily:"'Crimson Text', serif",
    }}>
      {checked ? '✓ ' : ''}{label}
    </button>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ marginBottom:'1.5rem' }}>
      <h2 style={{ fontSize:'1.25rem', color:'white', margin:0, fontFamily:"'Cinzel', serif", letterSpacing:'1px' }}>
        {children}
      </h2>
      <div style={{ height:'2px', width:'40px', background:'linear-gradient(90deg,#FFD700,transparent)', marginTop:'8px' }} />
    </div>
  )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────
export default function JoinAsAstrologer() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(INITIAL)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [photoPreview, setPhotoPreview] = useState('')
  const photoRef = useRef<HTMLInputElement>(null)
  const certRef = useRef<HTMLInputElement>(null)

  const set = (key: keyof FormData, val: unknown) => setForm(f => ({ ...f, [key]: val }))

  const toggleArr = (key: keyof FormData, val: string) => {
    const arr = form[key] as string[]
    set(key, arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  const toggleAvailability = (day: string, slot: string) => {
    const curr = form.availability[day] || []
    const updated = curr.includes(slot) ? curr.filter(s => s !== slot) : [...curr, slot]
    set('availability', { ...form.availability, [day]: updated })
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setPhotoPreview(reader.result as string)
    reader.readAsDataURL(file)
    set('profile_photo_url', file.name)
  }

  const validateStep = (): boolean => {
    setError('')
    if (step === 1) {
      if (!form.full_name || !form.email || !form.phone || !form.gender || !form.experience_years || !form.bio)
        return setError('Please fill all required fields.') || false
      if (!/\S+@\S+\.\S+/.test(form.email))
        return setError('Please enter a valid email.') || false
    }
    if (step === 2) {
      if (!form.state || !form.city)
        return setError('State and city are required.') || false
      if (form.is_temple_affiliated && !form.temple_name)
        return setError('Please enter your temple name.') || false
    }
    if (step === 3 && form.astrology_types.length === 0)
      return setError('Select at least one astrology type.') || false
    if (step === 4 && (form.services_offered.length === 0 || form.service_modes.length === 0))
      return setError('Select at least one service and one service mode.') || false
    if (step === 5 && form.languages.length === 0)
      return setError('Select at least one language.') || false
    if (step === 6 && !form.profile_photo_url)
      return setError('Profile photo is required.') || false
    return true
  }

  const next = () => { if (validateStep()) setStep(s => Math.min(s + 1, 7)) }
  const prev = () => { setError(''); setStep(s => Math.max(s - 1, 1)) }

  const handleSubmit = async () => {
    if (!validateStep()) return
    setSubmitting(true)
    setError('')
    try {
      const payload = {
        full_name: form.full_name,
        display_name: form.display_name || form.full_name,
        email: form.email,
        phone: form.phone,
        gender: form.gender,
        experience_years: parseInt(form.experience_years) || 0,
        experience_level: form.experience_level,
        bio: form.bio,
        country: 'USA',
        state: form.state,
        city: form.city,
        zipcode: form.zipcode,
        is_temple_affiliated: form.is_temple_affiliated,
        temple_name: form.temple_name,
        temple_address: form.temple_address,
        temple_website: form.temple_website,
        astrology_types: form.astrology_types,
        services_offered: form.services_offered,
        service_modes: form.service_modes,
        languages: form.languages,
        languages_other: form.languages_other,
        timezone: form.timezone,
        availability: form.availability,
        available_from: form.available_from,
        available_to: form.available_to,
        profile_photo_url: form.profile_photo_url,
        profile_headline: form.profile_headline,
        profile_description: form.profile_description,
        consultation_fee: form.consultation_fee,
        verification_status: 'pending',
        referral_source: 'temple_campaign',
      }
      const { error: dbError } = await supabase.from('astrologers').insert([payload])
      if (dbError) throw dbError
      setSubmitted(true)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Submission failed. Please try again.'
      setError(msg)
    }
    setSubmitting(false)
  }

  // ── Success screen ────────────────────────────────────────
  if (submitted) return (
    <PageShell>
      <div style={{ textAlign:'center', padding:'4rem 2rem', maxWidth:'500px', margin:'0 auto' }}>
        <div style={{ fontSize:'4rem', marginBottom:'1rem' }}>🙏</div>
        <h2 style={{ fontSize:'2rem', color:'#FFD700', fontFamily:"'Cinzel', serif", marginBottom:'1rem' }}>
          Registration Submitted!
        </h2>
        <p style={{ color:'rgba(255,255,255,0.6)', lineHeight:1.8, marginBottom:'2rem' }}>
          Thank you, <strong style={{ color:'white' }}>{form.display_name || form.full_name}</strong>!
          Your profile is under review. We will contact you at <strong style={{ color:'#FFD700' }}>{form.email}</strong> within 2–3 business days.
        </p>
        <div style={{
          background:'rgba(255,215,0,0.08)', border:'1px solid rgba(255,215,0,0.2)',
          borderRadius:'14px', padding:'1.5rem', textAlign:'left', marginBottom:'2rem'
        }}>
          {[
            ['Name', form.display_name || form.full_name],
            ['Location', `${form.city}, ${form.state}`],
            ['Temple', form.temple_name || 'Independent'],
            ['Expertise', form.astrology_types.slice(0,3).join(', ')],
            ['Languages', form.languages.join(', ')],
          ].map(([k,v]) => (
            <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'0.4rem 0',
              borderBottom:'1px solid rgba(255,255,255,0.06)', fontSize:'0.9rem' }}>
              <span style={{ color:'rgba(255,255,255,0.4)' }}>{k}</span>
              <span style={{ color:'white' }}>{v}</span>
            </div>
          ))}
        </div>
        <a href="/" style={{
          display:'inline-block', background:'linear-gradient(135deg,#FFD700,#FF8C00)',
          color:'#1a0a00', padding:'0.8rem 2rem', borderRadius:'12px',
          fontWeight:'bold', textDecoration:'none', fontFamily:"'Cinzel', serif"
        }}>← Back to VibeZodiac</a>
      </div>
    </PageShell>
  )

  return (
    <PageShell>
      <div style={{ maxWidth:'780px', margin:'0 auto', padding:'2rem 1rem 5rem' }}>

        {/* Header */}
        <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'0.5rem' }}>🔮</div>
          <h1 style={{ fontSize:'2rem', color:'#FFD700', fontFamily:"'Cinzel', serif",
            letterSpacing:'2px', margin:'0 0 0.4rem' }}>Join as Astrologer</h1>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:'0.95rem' }}>
            Connect with seekers across the USA • Built for temple priests & Vedic experts
          </p>
        </div>

        {/* Step progress */}
        <div style={{ marginBottom:'2.5rem' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', position:'relative' }}>
            {/* connector line */}
            <div style={{ position:'absolute', top:'20px', left:'20px', right:'20px', height:'2px',
              background:'rgba(255,255,255,0.08)', zIndex:0 }} />
            <div style={{ position:'absolute', top:'20px', left:'20px',
              width:`${((step-1)/6)*100}%`, height:'2px',
              background:'linear-gradient(90deg,#FFD700,#FF8C00)', zIndex:1,
              transition:'width 0.4s ease' }} />
            {STEPS.map(s => (
              <div key={s.num} style={{ display:'flex', flexDirection:'column', alignItems:'center', zIndex:2, gap:'6px' }}>
                <div onClick={() => step > s.num && setStep(s.num)} style={{
                  width:'40px', height:'40px', borderRadius:'50%',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'1rem',
                  background: step === s.num ? 'linear-gradient(135deg,#FFD700,#FF8C00)'
                    : step > s.num ? 'rgba(255,215,0,0.2)' : 'rgba(255,255,255,0.06)',
                  border: step === s.num ? 'none'
                    : step > s.num ? '2px solid rgba(255,215,0,0.5)' : '2px solid rgba(255,255,255,0.1)',
                  color: step === s.num ? '#1a0a00' : step > s.num ? '#FFD700' : 'rgba(255,255,255,0.3)',
                  cursor: step > s.num ? 'pointer' : 'default',
                  transition:'all 0.3s', fontWeight:'bold',
                }}>
                  {step > s.num ? '✓' : s.icon}
                </div>
                <span style={{ fontSize:'0.65rem', color: step >= s.num ? 'rgba(255,215,0,0.7)' : 'rgba(255,255,255,0.25)',
                  letterSpacing:'0.5px', display: window?.innerWidth < 500 ? 'none' : 'block' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form card */}
        <div style={{
          background:'rgba(255,255,255,0.03)', backdropFilter:'blur(20px)',
          border:'1px solid rgba(255,215,0,0.12)', borderRadius:'20px',
          padding:'2rem', marginBottom:'1.5rem',
        }}>
          {error && (
            <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)',
              borderRadius:'10px', padding:'0.75rem 1.2rem', color:'#fca5a5',
              marginBottom:'1.5rem', fontSize:'0.88rem' }}>⚠️ {error}</div>
          )}

          {/* ── STEP 1: Basic Info ── */}
          {step === 1 && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }}>
              <SectionTitle>👤 Basic Information</SectionTitle>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <Input label="Full Name" required placeholder="Pandit Rajesh Sharma"
                  value={form.full_name} onChange={e => set('full_name', e.target.value)} />
                <Input label="Display Name" placeholder="Pandit Rajesh (optional)"
                  value={form.display_name} onChange={e => set('display_name', e.target.value)} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <Input label="Email Address" required type="email" placeholder="you@example.com"
                  value={form.email} onChange={e => set('email', e.target.value)} />
                <Input label="Phone (WhatsApp preferred)" required type="tel" placeholder="+1 (555) 000-0000"
                  value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem' }}>
                <Select label="Gender" required value={form.gender} onChange={e => set('gender', e.target.value)}>
                  <option value="">Select gender</option>
                  {['Male','Female','Other','Prefer not to say'].map(g => <option key={g} value={g}>{g}</option>)}
                </Select>
                <Input label="Years of Experience" required type="number" min="0" max="60" placeholder="e.g. 15"
                  value={form.experience_years} onChange={e => set('experience_years', e.target.value)} />
                <Select label="Experience Level" value={form.experience_level} onChange={e => set('experience_level', e.target.value)}>
                  <option value="">Select level</option>
                  {['Beginner (0–2 yrs)','Intermediate (3–7 yrs)','Expert (8–15 yrs)','Master (15+ yrs)'].map(l => (
                    <option key={l} value={l.split(' ')[0]}>{l}</option>
                  ))}
                </Select>
              </div>
              <Textarea label="Short Bio" required
                placeholder='e.g. "I am a Vedic priest with 18 years experience in horoscope reading, marriage matching, and muhurat selection."'
                value={form.bio} onChange={e => set('bio', e.target.value)}
                style={{ minHeight:'120px' }} />
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ color: form.bio.length > 1000 ? '#f87171' : 'rgba(255,255,255,0.25)', fontSize:'0.78rem' }}>
                  {form.bio.length}/1000 characters
                </span>
              </div>
            </div>
          )}

          {/* ── STEP 2: Location ── */}
          {step === 2 && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }}>
              <SectionTitle>📍 Location & Temple Affiliation</SectionTitle>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem' }}>
                <Select label="State" required value={form.state} onChange={e => set('state', e.target.value)}>
                  <option value="">Select state</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
                <Input label="City" required placeholder="New York"
                  value={form.city} onChange={e => set('city', e.target.value)} />
                <Input label="ZIP Code" placeholder="10001"
                  value={form.zipcode} onChange={e => set('zipcode', e.target.value)} />
              </div>
              {/* Temple affiliation toggle */}
              <div>
                <Label>Are you affiliated with a temple?</Label>
                <div style={{ display:'flex', gap:'0.8rem', marginTop:'0.3rem' }}>
                  {[true, false].map(v => (
                    <button key={String(v)} type="button" onClick={() => set('is_temple_affiliated', v)} style={{
                      padding:'0.6rem 1.5rem', borderRadius:'10px', cursor:'pointer',
                      border: form.is_temple_affiliated === v ? '1px solid #FFD700' : '1px solid rgba(255,255,255,0.15)',
                      background: form.is_temple_affiliated === v ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.04)',
                      color: form.is_temple_affiliated === v ? '#FFD700' : 'rgba(255,255,255,0.5)',
                      fontFamily:"'Crimson Text', serif", fontSize:'0.95rem',
                    }}>
                      {v ? '🛕 Yes, I am' : '🙅 No, Independent'}
                    </button>
                  ))}
                </div>
              </div>
              {form.is_temple_affiliated && (
                <div style={{ display:'flex', flexDirection:'column', gap:'1rem',
                  background:'rgba(255,215,0,0.04)', border:'1px solid rgba(255,215,0,0.1)',
                  borderRadius:'12px', padding:'1.2rem' }}>
                  <Input label="Temple Name" required placeholder="Shree Swaminarayan Temple"
                    value={form.temple_name} onChange={e => set('temple_name', e.target.value)} />
                  <Input label="Temple Address" placeholder="123 Temple Road, City, State"
                    value={form.temple_address} onChange={e => set('temple_address', e.target.value)} />
                  <Input label="Temple Website" type="url" placeholder="https://temple.org"
                    value={form.temple_website} onChange={e => set('temple_website', e.target.value)} />
                </div>
              )}
            </div>
          )}

          {/* ── STEP 3: Expertise ── */}
          {step === 3 && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
              <SectionTitle>🌟 Astrology Expertise</SectionTitle>
              <div>
                <Label required>Astrology Types (select all that apply)</Label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'0.6rem', marginTop:'0.5rem' }}>
                  {ASTROLOGY_TYPES.map(t => (
                    <CheckPill key={t} label={t}
                      checked={form.astrology_types.includes(t)}
                      onChange={() => toggleArr('astrology_types', t)} />
                  ))}
                </div>
              </div>
              <div>
                <Label>Experience Level</Label>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'0.8rem', marginTop:'0.5rem' }}>
                  {[
                    ['Beginner','0–2 years','🌱'],
                    ['Intermediate','3–7 years','🌿'],
                    ['Expert','8–15 years','⭐'],
                    ['Master','15+ years','👑'],
                  ].map(([level, years, icon]) => (
                    <button key={level} type="button" onClick={() => set('experience_level', level)} style={{
                      padding:'0.9rem 1rem', borderRadius:'12px', cursor:'pointer', textAlign:'left',
                      border: form.experience_level === level ? '1px solid #FFD700' : '1px solid rgba(255,255,255,0.1)',
                      background: form.experience_level === level ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.03)',
                      color: 'white', fontFamily:"'Crimson Text', serif",
                    }}>
                      <div style={{ fontSize:'1.3rem', marginBottom:'0.2rem' }}>{icon}</div>
                      <div style={{ fontWeight:'bold', color: form.experience_level === level ? '#FFD700' : 'white' }}>{level}</div>
                      <div style={{ fontSize:'0.8rem', color:'rgba(255,255,255,0.4)' }}>{years}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: Services & Languages ── */}
          {step === 4 && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
              <SectionTitle>🛎 Services & Languages</SectionTitle>
              <div>
                <Label required>Services Offered</Label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'0.6rem', marginTop:'0.5rem' }}>
                  {SERVICES.map(s => (
                    <CheckPill key={s} label={s}
                      checked={form.services_offered.includes(s)}
                      onChange={() => toggleArr('services_offered', s)} />
                  ))}
                </div>
              </div>
              <div>
                <Label required>Service Mode</Label>
                <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap', marginTop:'0.5rem' }}>
                  {SERVICE_MODES.map(m => (
                    <CheckPill key={m} label={`${m === 'Phone' ? '📞' : m === 'Video' ? '📹' : m === 'Chat' ? '💬' : '📧'} ${m}`}
                      checked={form.service_modes.includes(m)}
                      onChange={() => toggleArr('service_modes', m)} />
                  ))}
                </div>
              </div>
              <div>
                <Label required>Languages Spoken</Label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'0.6rem', marginTop:'0.5rem' }}>
                  {LANGUAGES.map(l => (
                    <CheckPill key={l} label={l}
                      checked={form.languages.includes(l)}
                      onChange={() => toggleArr('languages', l)} />
                  ))}
                </div>
                {form.languages.includes('Other') && (
                  <Input placeholder="Specify other language(s)" style={{ marginTop:'0.8rem' }}
                    value={form.languages_other} onChange={e => set('languages_other', e.target.value)} />
                )}
              </div>
              <div>
                <Label>Consultation Fee</Label>
                <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap', marginTop:'0.5rem' }}>
                  {['Free','$5','$10','$20','Custom'].map(f => (
                    <CheckPill key={f} label={f}
                      checked={form.consultation_fee === f}
                      onChange={() => set('consultation_fee', f)} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 5: Availability ── */}
          {step === 5 && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
              <SectionTitle>📅 Availability & Schedule</SectionTitle>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem' }}>
                <Select label="Timezone" required value={form.timezone} onChange={e => set('timezone', e.target.value)}>
                  {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz.replace('America/','').replace('Pacific/','Pacific/')}</option>)}
                </Select>
                <Input label="Available From" type="time" value={form.available_from}
                  onChange={e => set('available_from', e.target.value)} />
                <Input label="Available To" type="time" value={form.available_to}
                  onChange={e => set('available_to', e.target.value)} />
              </div>
              <div>
                <Label>Weekly Availability (select time slots)</Label>
                <div style={{ display:'flex', flexDirection:'column', gap:'0.6rem', marginTop:'0.8rem' }}>
                  {WEEKDAYS.map(day => (
                    <div key={day} style={{ display:'grid', gridTemplateColumns:'90px 1fr', gap:'0.8rem', alignItems:'center' }}>
                      <span style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.85rem', fontFamily:"'Crimson Text', serif" }}>{day}</span>
                      <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
                        {TIME_SLOTS.map(slot => {
                          const active = (form.availability[day] || []).includes(slot)
                          return (
                            <button key={slot} type="button" onClick={() => toggleAvailability(day, slot)} style={{
                              padding:'0.3rem 0.6rem', borderRadius:'6px', fontSize:'0.72rem', cursor:'pointer',
                              border: active ? '1px solid #FFD700' : '1px solid rgba(255,255,255,0.1)',
                              background: active ? 'rgba(255,215,0,0.12)' : 'rgba(255,255,255,0.03)',
                              color: active ? '#FFD700' : 'rgba(255,255,255,0.4)',
                              transition:'all 0.15s', fontFamily:"'Crimson Text', serif",
                            }}>{slot}</button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 6: Photo & Verification ── */}
          {step === 6 && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
              <SectionTitle>📸 Profile Photo & Verification</SectionTitle>
              {/* Photo upload */}
              <div>
                <Label required>Profile Photo</Label>
                <div style={{ display:'flex', gap:'1.5rem', alignItems:'center', marginTop:'0.5rem' }}>
                  <div style={{
                    width:'100px', height:'100px', borderRadius:'50%',
                    border: photoPreview ? '3px solid #FFD700' : '2px dashed rgba(255,215,0,0.3)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    overflow:'hidden', flexShrink:0,
                    background:'rgba(255,255,255,0.04)',
                  }}>
                    {photoPreview
                      ? <img src={photoPreview} alt="Preview" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      : <span style={{ fontSize:'2rem' }}>👤</span>
                    }
                  </div>
                  <div style={{ flex:1 }}>
                    <input ref={photoRef} type="file" accept="image/*" style={{ display:'none' }}
                      onChange={handlePhotoChange} />
                    <button type="button" onClick={() => photoRef.current?.click()} style={{
                      background:'rgba(255,215,0,0.1)', border:'1px solid rgba(255,215,0,0.3)',
                      color:'#FFD700', padding:'0.6rem 1.2rem', borderRadius:'8px',
                      cursor:'pointer', fontFamily:"'Crimson Text', serif", marginBottom:'0.5rem',
                    }}>
                      📤 Upload Photo
                    </button>
                    <p style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.78rem', margin:'0.3rem 0 0' }}>
                      JPG or PNG, max 5MB. Clear face photo recommended.
                    </p>
                  </div>
                </div>
              </div>
              {/* Certification */}
              <div>
                <Label>Temple ID or Priest Certification <span style={{ color:'rgba(255,255,255,0.3)', fontFamily:"'Crimson Text', serif", textTransform:'none', letterSpacing:0 }}>(optional but recommended)</span></Label>
                <input ref={certRef} type="file" accept="image/*,.pdf" style={{ display:'none' }}
                  onChange={e => set('certification_url', e.target.files?.[0]?.name || '')} />
                <button type="button" onClick={() => certRef.current?.click()} style={{
                  background:'rgba(255,255,255,0.04)', border:'2px dashed rgba(255,255,255,0.15)',
                  color:'rgba(255,255,255,0.5)', padding:'1.5rem', borderRadius:'12px',
                  cursor:'pointer', width:'100%', fontFamily:"'Crimson Text', serif",
                  marginTop:'0.5rem', fontSize:'0.95rem',
                }}>
                  {form.certification_url ? `✅ ${form.certification_url}` : '📎 Upload Certificate or Temple ID (JPG/PDF)'}
                </button>
              </div>
              {/* Profile headline */}
              <Input label="Profile Headline" placeholder='e.g. "Vedic Astrologer with 20 years experience | Marriage & Career Specialist"'
                value={form.profile_headline} onChange={e => set('profile_headline', e.target.value)} />
              <Textarea label="Profile Description (for your public page)" style={{ minHeight:'100px' }}
                placeholder="Tell seekers about your background, specialties, and approach..."
                value={form.profile_description} onChange={e => set('profile_description', e.target.value)} />
            </div>
          )}

          {/* ── STEP 7: Review & Submit ── */}
          {step === 7 && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1.2rem' }}>
              <SectionTitle>✅ Review & Submit</SectionTitle>
              <p style={{ color:'rgba(255,255,255,0.45)', fontSize:'0.9rem', margin:'0 0 0.5rem' }}>
                Please review your information before submitting.
              </p>
              {[
                { title:'Basic Info', items:[
                  ['Name', form.display_name || form.full_name],
                  ['Email', form.email],
                  ['Phone', form.phone],
                  ['Experience', `${form.experience_years} years • ${form.experience_level || '—'}`],
                ]},
                { title:'Location', items:[
                  ['Location', `${form.city}, ${form.state} ${form.zipcode}`],
                  ['Temple', form.is_temple_affiliated ? form.temple_name : 'Independent'],
                ]},
                { title:'Expertise', items:[
                  ['Astrology Types', form.astrology_types.join(', ') || '—'],
                  ['Services', form.services_offered.slice(0,3).join(', ') + (form.services_offered.length > 3 ? '...' : '') || '—'],
                  ['Languages', form.languages.join(', ') || '—'],
                  ['Service Mode', form.service_modes.join(', ') || '—'],
                ]},
                { title:'Availability', items:[
                  ['Timezone', form.timezone],
                  ['Hours', `${form.available_from} – ${form.available_to}`],
                  ['Days', Object.keys(form.availability).filter(d => form.availability[d].length > 0).join(', ') || '—'],
                ]},
              ].map(section => (
                <div key={section.title} style={{
                  background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,215,0,0.1)',
                  borderRadius:'12px', overflow:'hidden',
                }}>
                  <div style={{ background:'rgba(255,215,0,0.07)', padding:'0.6rem 1rem',
                    borderBottom:'1px solid rgba(255,215,0,0.08)',
                    color:'rgba(255,215,0,0.7)', fontSize:'0.78rem', letterSpacing:'1.5px',
                    fontFamily:"'Cinzel', serif" }}>
                    {section.title}
                  </div>
                  <div style={{ padding:'0.5rem 1rem' }}>
                    {section.items.map(([k,v]) => (
                      <div key={k} style={{ display:'flex', justifyContent:'space-between',
                        padding:'0.4rem 0', borderBottom:'1px solid rgba(255,255,255,0.04)',
                        fontSize:'0.88rem' }}>
                        <span style={{ color:'rgba(255,255,255,0.35)' }}>{k}</span>
                        <span style={{ color:'white', textAlign:'right', maxWidth:'60%' }}>{v || '—'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ background:'rgba(255,215,0,0.05)', border:'1px solid rgba(255,215,0,0.15)',
                borderRadius:'10px', padding:'1rem', fontSize:'0.82rem',
                color:'rgba(255,255,255,0.4)', lineHeight:1.7 }}>
                By submitting, you agree to VibeZodiac&apos;s Terms of Service. Your profile will be reviewed
                within 2–3 business days. You&apos;ll receive an email at <strong style={{ color:'#FFD700' }}>{form.email}</strong> once approved.
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div style={{ display:'flex', justifyContent:'space-between', gap:'1rem' }}>
          <button type="button" onClick={prev} disabled={step === 1} style={{
            background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.15)',
            color: step === 1 ? 'rgba(255,255,255,0.2)' : 'white',
            padding:'0.85rem 2rem', borderRadius:'12px', cursor: step === 1 ? 'not-allowed' : 'pointer',
            fontFamily:"'Cinzel', serif", fontSize:'0.9rem', letterSpacing:'1px',
          }}>← Back</button>

          {step < 7
            ? <button type="button" onClick={next} style={{
                flex:1, background:'linear-gradient(135deg,#FFD700,#FF8C00)',
                color:'#1a0a00', border:'none', borderRadius:'12px', padding:'0.85rem 2rem',
                fontWeight:'bold', cursor:'pointer', fontFamily:"'Cinzel', serif",
                fontSize:'0.95rem', letterSpacing:'1px',
              }}>
                Continue → {STEPS[step]?.label}
              </button>
            : <button type="button" onClick={handleSubmit} disabled={submitting} style={{
                flex:1, background: submitting ? 'rgba(255,215,0,0.3)' : 'linear-gradient(135deg,#FFD700,#FF8C00)',
                color: submitting ? 'rgba(255,255,255,0.4)' : '#1a0a00', border:'none', borderRadius:'12px',
                padding:'0.85rem 2rem', fontWeight:'bold',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontFamily:"'Cinzel', serif", fontSize:'0.95rem', letterSpacing:'1px',
              }}>
                {submitting ? '☸ Submitting...' : '🙏 Submit Registration'}
              </button>
          }
        </div>

        {/* Step indicator */}
        <p style={{ textAlign:'center', color:'rgba(255,255,255,0.2)', fontSize:'0.78rem', marginTop:'1rem' }}>
          Step {step} of 7
        </p>
      </div>
    </PageShell>
  )
}

// ── Page shell with cosmic bg ──────────────────────────────────
function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight:'100vh',
      background:'linear-gradient(160deg, #0a0015 0%, #1a0533 40%, #0d1a3a 100%)',
      fontFamily:"'Crimson Text', Georgia, serif",
      color:'white',
    }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
        input, select, textarea { font-family: 'Crimson Text', Georgia, serif !important; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2) !important; }
        select option { background: #1a0533; color: white; }
        button:focus { outline: none; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: rgba(255,255,255,0.03); }
        ::-webkit-scrollbar-thumb { background: rgba(255,215,0,0.2); border-radius: 3px; }
      `}</style>

      {/* Header nav */}
      <div style={{ background:'rgba(255,255,255,0.03)', backdropFilter:'blur(12px)',
        borderBottom:'1px solid rgba(255,215,0,0.15)', padding:'0.9rem 2rem',
        display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <a href="/" style={{ color:'#FFD700', textDecoration:'none', fontSize:'0.9rem', fontFamily:"'Cinzel', serif" }}>
          ← VibeZodiac
        </a>
        <div style={{ color:'rgba(255,255,255,0.35)', fontSize:'0.78rem', letterSpacing:'2px' }}>
          ASTROLOGER REGISTRATION
        </div>
        <div style={{ width:'80px' }} />
      </div>

      {children}
    </div>
  )
}
