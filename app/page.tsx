import { supabase } from '@/lib/supabase'
import { ZodiacWheel } from '@/components/ZodiacWheel'
import { Navigation } from '@/components/Navigation'
import { Newsletter } from '@/components/Newsletter'
import { Footer } from '@/components/Footer'
import type { HoroscopeWithSign } from '@/lib/types'

export const revalidate = 3600

async function getHoroscopes() {
  const today = new Date().toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('daily_horoscopes')
    .select(`
      id,
      zodiac_sign_id,
      horoscope_date,
      todays_focus,
      love_forecast,
      career_forecast,
      finance_forecast,
      health_forecast,
      lucky_number,
      lucky_color,
      lucky_time,
      overall_rating,
      zodiac_signs!inner (
        id,
        name,
        slug,
        symbol,
        element,
        sort_order
      )
    `)
    .eq('horoscope_date', today)
    .order('zodiac_signs(sort_order)', { ascending: true })

  if (error) {
    console.error('Error fetching horoscopes:', error)
    return []
  }

  if (!data || data.length === 0) {
    console.log('No horoscopes found for today:', today)
    return []
  }

  console.log('Fetched horoscopes:', data.length)
  return data as unknown as HoroscopeWithSign[]
}

export default async function HomePage() {
  const horoscopes = await getHoroscopes()

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navigation />
      
      <main style={{
        flex: 1,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '1200px', width: '100%' }}>
          <h1 style={{
            color: 'white',
            fontSize: '3rem',
            marginBottom: '10px',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            ✨ Vibezodiac
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '1.2rem',
            marginBottom: '40px'
          }}>
            Discover Your Daily Cosmic Guidance
          </p>

          {horoscopes.length > 0 ? (
            <>
              <p style={{ color: 'white', marginBottom: '20px' }}>
                {horoscopes.length} horoscopes loaded for today
              </p>
              <ZodiacWheel horoscopes={horoscopes} />
            </>
          ) : (
            <div style={{ color: 'white', fontSize: '1.2rem' }}>
              No horoscopes available for today. Please generate them first.
            </div>
          )}
        </div>
      </main>

      <Newsletter />
      <Footer />
    </div>
  )
}
