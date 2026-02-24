'use client'
import { useState } from 'react'
import { Navigation } from '@/components/Navigation'
import { Footer } from '@/components/Footer'
import { supabase } from '@/lib/supabase'

export default function SubscribePage() {
  const [email, setEmail] = useState('')
  const [zodiacSign, setZodiacSign] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !zodiacSign) {
      setStatus('error')
      setMessage('Please fill in all fields')
      return
    }
    setStatus('loading')
    try {
      const { data: signs } = await supabase
        .from('zodiac_signs')
        .select('id')
        .eq('slug', zodiacSign.toLowerCase())
        .single()

      if (!signs) throw new Error('Invalid zodiac sign')

      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert({ email, zodiac_sign_id: signs.id, is_confirmed: false })

      if (error) {
        if (error.code === '23505') throw new Error('This email is already subscribed!')
        throw error
      }

      setStatus('success')
      setMessage('Successfully subscribed! Check your email for confirmation.')
      setEmail('')
      setZodiacSign('')
    } catch (error: any) {
      setStatus('error')
      setMessage(error.message || 'Failed to subscribe. Please try again.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Navigation />
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: '20px', padding: '3rem 2rem', maxWidth: '500px', width: '100%' }}>
          <h1 style={{ fontSize: '2rem', color: 'white', textAlign: 'center', marginBottom: '0.5rem' }}>📧 Subscribe</h1>
          <p style={{ color: 'rgba(255,255,255,0.9)', textAlign: 'center', marginBottom: '2rem' }}>Get daily horoscopes in your inbox!</p>

          {status === 'success' && (
            <div style={{ background: '#d4edda', color: '#155724', padding: '1rem', borderRadius: '10px', marginBottom: '1rem', textAlign: 'center' }}>
              ✅ {message}
            </div>
          )}
          {status === 'error' && (
            <div style={{ background: '#f8d7da', color: '#721c24', padding: '1rem', borderRadius: '10px', marginBottom: '1rem', textAlign: 'center' }}>
              ❌ {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '1rem', marginBottom: '1rem', border: 'none', borderRadius: '10px', fontSize: '1rem', boxSizing: 'border-box' }}
            />
            <select
              value={zodiacSign}
              onChange={(e) => setZodiacSign(e.target.value)}
              required
              style={{ width: '100%', padding: '1rem', marginBottom: '1rem', border: 'none', borderRadius: '10px', fontSize: '1rem', boxSizing: 'border-box' }}
            >
              <option value="">Select your zodiac sign</option>
              <option value="aries">♈ Aries</option>
              <option value="taurus">♉ Taurus</option>
              <option value="gemini">♊ Gemini</option>
              <option value="cancer">♋ Cancer</option>
              <option value="leo">♌ Leo</option>
              <option value="virgo">♍ Virgo</option>
              <option value="libra">♎ Libra</option>
              <option value="scorpio">♏ Scorpio</option>
              <option value="sagittarius">♐ Sagittarius</option>
              <option value="capricorn">♑ Capricorn</option>
              <option value="aquarius">♒ Aquarius</option>
              <option value="pisces">♓ Pisces</option>
            </select>
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{ width: '100%', padding: '1rem', background: 'white', color: '#667eea', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 'bold', cursor: status === 'loading' ? 'not-allowed' : 'pointer', opacity: status === 'loading' ? 0.7 : 1 }}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
