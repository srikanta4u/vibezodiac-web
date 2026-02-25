'use client'

import { useState } from 'react'

// ============================================================
// KUNDLI ENGINE — Pure JS, Zero External API
// ============================================================

const AYANAMSHA = 23.71743 // Lahiri ayanamsha (approx for 2000 epoch)

const RASHI = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
]

const RASHI_LORDS = ['Mars','Venus','Mercury','Moon','Sun','Mercury','Venus','Mars','Jupiter','Saturn','Saturn','Jupiter']

const RASHI_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓']

const NAKSHATRA = [
  'Ashwini','Bharani','Krittika','Rohini','Mrigashira','Ardra',
  'Punarvasu','Pushya','Ashlesha','Magha','Purva Phalguni','Uttara Phalguni',
  'Hasta','Chitra','Swati','Vishakha','Anuradha','Jyeshtha',
  'Mula','Purva Ashadha','Uttara Ashadha','Shravana','Dhanishta','Shatabhisha',
  'Purva Bhadrapada','Uttara Bhadrapada','Revati'
]

const NAKSHATRA_LORDS = [
  'Ketu','Venus','Sun','Moon','Mars','Rahu',
  'Jupiter','Saturn','Mercury','Ketu','Venus','Sun',
  'Moon','Mars','Rahu','Jupiter','Saturn','Mercury',
  'Ketu','Venus','Sun','Moon','Mars','Rahu',
  'Jupiter','Saturn','Mercury'
]

const PLANET_SYMBOLS: Record<string,string> = {
  Sun:'☉', Moon:'☽', Mars:'♂', Mercury:'☿', Jupiter:'♃',
  Venus:'♀', Saturn:'♄', Rahu:'☊', Ketu:'☋', Lagna:'Asc'
}

const VARNA = ['Brahmin','Kshatriya','Vaishya','Shudra']
const TATTVA = ['Fire','Earth','Air','Water']
const TITHI_NAMES = [
  'Pratipada','Dwitiya','Tritiya','Chaturthi','Panchami',
  'Shashthi','Saptami','Ashtami','Navami','Dashami',
  'Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Purnima',
  'Pratipada','Dwitiya','Tritiya','Chaturthi','Panchami',
  'Shashthi','Saptami','Ashtami','Navami','Dashami',
  'Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Amavasya'
]

const YOGA_NAMES = [
  'Vishkambha','Priti','Ayushman','Saubhagya','Shobhana','Atiganda','Sukarma',
  'Dhriti','Shoola','Ganda','Vriddhi','Dhruva','Vyaghata','Harshana','Vajra',
  'Siddhi','Vyatipata','Variyana','Parigha','Shiva','Siddha','Sadhya','Shubha',
  'Shukla','Brahma','Indra','Vaidhriti'
]

const KARAN_NAMES = [
  'Bava','Balava','Kaulava','Taitila','Gara','Vanija','Vishti',
  'Bava','Balava','Kaulava','Taitila','Gara','Vanija','Vishti',
  'Bava','Balava','Kaulava','Taitila','Gara','Vanija','Vishti',
  'Bava','Balava','Kaulava','Taitila','Gara','Vanija','Vishti',
  'Shakuni','Chatushpada','Naga','Kinstughna'
]

// Julian Day Number
function julianDay(year: number, month: number, day: number, hour: number): number {
  if (month <= 2) { year -= 1; month += 12 }
  const A = Math.floor(year / 100)
  const B = 2 - A + Math.floor(A / 4)
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + hour / 24 + B - 1524.5
}

// T = Julian centuries from J2000.0
function jdToT(jd: number): number {
  return (jd - 2451545.0) / 36525.0
}

// Mean Sun longitude (degrees)
function sunLongitude(T: number): number {
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T
  const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * Math.PI / 180
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * M)
    + 0.000289 * Math.sin(3 * M)
  return (L0 + C + 180) % 360  // true longitude (approx, +180 to convert from geocentric direction)
}

// Simplified Sun true longitude
function calcSunLon(T: number): number {
  const L0 = (280.46646 + 36000.76983 * T) % 360
  const M = ((357.52911 + 35999.05029 * T) % 360) * Math.PI / 180
  const C = 1.9146 * Math.sin(M) + 0.019993 * Math.sin(2*M) + 0.00029 * Math.sin(3*M)
  return (L0 + C + 360) % 360
}

// Moon longitude (simplified)
function calcMoonLon(T: number): number {
  const L = (218.3165 + 481267.8813 * T) % 360
  const M = ((357.5291 + 35999.0503 * T) % 360) * Math.PI / 180
  const Mm = ((134.9634 + 477198.8676 * T) % 360) * Math.PI / 180
  const D = ((297.8502 + 445267.1115 * T) % 360) * Math.PI / 180
  const F = ((93.2721 + 483202.0175 * T) % 360) * Math.PI / 180
  const lon = L
    + 6.2888 * Math.sin(Mm)
    + 1.2740 * Math.sin(2*D - Mm)
    + 0.6583 * Math.sin(2*D)
    + 0.2136 * Math.sin(2*Mm)
    - 0.1851 * Math.sin(M)
    - 0.1143 * Math.sin(2*F)
    + 0.0588 * Math.sin(2*D - 2*Mm)
    + 0.0572 * Math.sin(2*D - M - Mm)
    + 0.0533 * Math.sin(2*D + Mm)
  return (lon + 360) % 360
}

// Mars, Mercury, Jupiter, Venus, Saturn (VSOP-simplified mean longitude)
function calcPlanetLon(planet: string, T: number): number {
  const data: Record<string,[number,number]> = {
    Mars:      [355.4330, 689050.8514],
    Mercury:   [252.2509, 1494479.7132],
    Jupiter:   [34.3515, 109306.4415],
    Venus:     [181.9798, 585441.7456],
    Saturn:    [50.0774, 439960.9975],
  }
  const [L0, L1] = data[planet]
  return ((L0 + L1 * T / 360) % 360 + 360) % 360
}

// Rahu (mean north node)
function calcRahu(T: number): number {
  return ((125.04452 - 1934.136261 * T + 0.0020708 * T * T) % 360 + 360) % 360
}

// Ascendant (Lagna) using RAMC
function calcLagna(jd: number, lat: number, lon: number): number {
  const T = jdToT(jd)
  // Greenwich Sidereal Time
  const theta0 = (280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T) % 360
  const RAMC = (theta0 + lon + 360) % 360 // Local Sidereal Time in degrees
  const eps = (23.439291111 - 0.013004167 * T) * Math.PI / 180
  const phi = lat * Math.PI / 180
  const ramc = RAMC * Math.PI / 180
  // Ascendant formula
  const y = -Math.cos(ramc)
  const x = Math.sin(eps) * Math.tan(phi) + Math.cos(eps) * Math.sin(ramc)
  let asc = Math.atan2(y, x) * 180 / Math.PI
  if (asc < 0) asc += 360
  return asc
}

// Sidereal (subtract ayanamsha)
function toSidereal(lon: number): number {
  return ((lon - AYANAMSHA) + 360) % 360
}

function getRashi(lon: number): number {
  return Math.floor(lon / 30)
}

function getNakshatra(lon: number): { name: string, lord: string, pada: number } {
  const nakIdx = Math.floor(lon / (360/27))
  const pada = Math.floor((lon % (360/27)) / (360/27/4)) + 1
  return { name: NAKSHATRA[nakIdx % 27], lord: NAKSHATRA_LORDS[nakIdx % 27], pada }
}

function degreeToStr(deg: number): string {
  const d = Math.floor(deg)
  const m = Math.floor((deg - d) * 60)
  const s = Math.floor(((deg - d) * 60 - m) * 60)
  return `${d}°${m}'${s}"`
}

interface Planet {
  name: string
  lon: number
  siderealLon: number
  rashi: number
  rashiDeg: number
  nakshatra: { name: string; lord: string; pada: number }
  house: number
}

interface KundliData {
  name: string
  gender: string
  birthDate: string
  birthTime: string
  birthPlace: string
  sunrise: string
  sunset: string
  ayanamsha: string
  tithi: string
  karan: string
  yoga: string
  varna: string
  vashya: string
  yoni: string
  gan: string
  nadi: string
  sign: string
  signLord: string
  nakshatraCharan: string
  yog: string
  karana: string
  tatva: string
  yunja: string
  planets: Planet[]
  lagna: Planet
  houses: number[]
}

function geocode(place: string): { lat: number, lon: number, tz: number } {
  // Fallback geocoding for common places, else default to Greenwich
  const places: Record<string, { lat: number, lon: number, tz: number }> = {
    'new york': { lat: 40.7128, lon: -74.0060, tz: -5 },
    'london': { lat: 51.5074, lon: -0.1278, tz: 0 },
    'mumbai': { lat: 19.0760, lon: 72.8777, tz: 5.5 },
    'delhi': { lat: 28.6139, lon: 77.2090, tz: 5.5 },
    'new delhi': { lat: 28.6139, lon: 77.2090, tz: 5.5 },
    'bangalore': { lat: 12.9716, lon: 77.5946, tz: 5.5 },
    'chennai': { lat: 13.0827, lon: 80.2707, tz: 5.5 },
    'kolkata': { lat: 22.5726, lon: 88.3639, tz: 5.5 },
    'hyderabad': { lat: 17.3850, lon: 78.4867, tz: 5.5 },
    'pune': { lat: 18.5204, lon: 73.8567, tz: 5.5 },
    'bhubaneswar': { lat: 20.2961, lon: 85.8245, tz: 5.5 },
    'detroit': { lat: 42.3314, lon: -83.0458, tz: -5 },
    'chicago': { lat: 41.8781, lon: -87.6298, tz: -6 },
    'los angeles': { lat: 34.0522, lon: -118.2437, tz: -8 },
    'toronto': { lat: 43.6532, lon: -79.3832, tz: -5 },
    'sydney': { lat: -33.8688, lon: 151.2093, tz: 10 },
    'dubai': { lat: 25.2048, lon: 55.2708, tz: 4 },
    'singapore': { lat: 1.3521, lon: 103.8198, tz: 8 },
  }
  const key = place.toLowerCase().trim()
  for (const [k, v] of Object.entries(places)) {
    if (key.includes(k)) return v
  }
  // Default: use lon offset based on rough timezone guess
  return { lat: 20.5937, lon: 78.9629, tz: 5.5 } // India default
}

function calcKundli(
  name: string, gender: string, dateStr: string, timeStr: string, place: string
): KundliData {
  const [month, day, year] = dateStr.split('/').map(Number)
  const [timePart, ampm] = timeStr.split(' ')
  let [hours, minutes] = timePart.split(':').map(Number)
  if (ampm === 'PM' && hours !== 12) hours += 12
  if (ampm === 'AM' && hours === 12) hours = 0
  const hour = hours + minutes / 60

  const geo = geocode(place)
  const utcHour = hour - geo.tz
  const jd = julianDay(year, month, day, utcHour)
  const T = jdToT(jd)

  // Planet longitudes (tropical)
  const sunLon = calcSunLon(T)
  const moonLon = calcMoonLon(T)
  const marsLon = calcPlanetLon('Mars', T)
  const mercuryLon = calcPlanetLon('Mercury', T)
  const jupiterLon = calcPlanetLon('Jupiter', T)
  const venusLon = calcPlanetLon('Venus', T)
  const saturnLon = calcPlanetLon('Saturn', T)
  const rahuLon = calcRahu(T)
  const ketuLon = (rahuLon + 180) % 360
  const lagnaLon = calcLagna(jd, geo.lat, geo.lon)

  // Convert to sidereal
  const planets: Array<{ name: string, lon: number }> = [
    { name: 'Sun', lon: sunLon },
    { name: 'Moon', lon: moonLon },
    { name: 'Mars', lon: marsLon },
    { name: 'Mercury', lon: mercuryLon },
    { name: 'Jupiter', lon: jupiterLon },
    { name: 'Venus', lon: venusLon },
    { name: 'Saturn', lon: saturnLon },
    { name: 'Rahu', lon: rahuLon },
    { name: 'Ketu', lon: ketuLon },
  ]

  const lagnaData: Planet = {
    name: 'Lagna',
    lon: lagnaLon,
    siderealLon: toSidereal(lagnaLon),
    rashi: getRashi(toSidereal(lagnaLon)),
    rashiDeg: toSidereal(lagnaLon) % 30,
    nakshatra: getNakshatra(toSidereal(lagnaLon)),
    house: 1
  }

  const lagnaRashi = getRashi(toSidereal(lagnaLon))
  
  // House cusps (Equal house from Lagna)
  const houses = Array.from({length:12}, (_,i) => (lagnaRashi + i) % 12)

  const planetData: Planet[] = planets.map(p => {
    const sid = toSidereal(p.lon)
    const rashi = getRashi(sid)
    const house = ((rashi - lagnaRashi + 12) % 12) + 1
    return {
      name: p.name,
      lon: p.lon,
      siderealLon: sid,
      rashi,
      rashiDeg: sid % 30,
      nakshatra: getNakshatra(sid),
      house
    }
  })

  // Panchang
  const moonSidLon = toSidereal(moonLon)
  const sunSidLon = toSidereal(sunLon)
  const tithiIdx = Math.floor(((moonSidLon - sunSidLon + 360) % 360) / 12)
  const yogaIdx = Math.floor(((moonSidLon + sunSidLon) % 360) / (360/27))
  const karanIdx = Math.floor(((moonSidLon - sunSidLon + 360) % 360) / 6) % 11

  const moonNak = getNakshatra(moonSidLon)
  const moonRashiIdx = getRashi(moonSidLon)

  // Avakhada details
  const varnaIdx = [2,3,1,0,1,3,2,1,0,3,2,0][moonRashiIdx]
  const vashyaArr = ['Nara','Chatushpada','Nara','Kita','Vanachara','Nara','Nara','Kita','Chatushpada','Nara','Nara','Jalachar']
  const yoniArr = ['Ashva','Gaja','Mesha','Sarpa','Sarpa','Shwana','Marjara','Mushaka','Mahisha','Vyaghra','Simha','Gaja']
  const ganArr = ['Deva','Manushya','Deva','Rakshasa','Manushya','Manushya','Deva','Deva','Manushya','Rakshasa','Manushya','Rakshasa']
  const nadiArr = ['Antya','Madhya','Adhya','Adhya','Madhya','Antya','Antya','Madhya','Adhya','Adhya','Madhya','Antya']
  const tatvaArr = ['Fire','Earth','Air','Water','Fire','Earth','Air','Water','Fire','Earth','Air','Water']
  const yunjaArr = ['Antya','Antya','Antya','Anthya','Anthya','Madhya','Madhya','Madhya','Adhya','Adhya','Adhya','Adhya']

  // Sunrise/Sunset (approximation)
  const B2 = Math.floor((month - 14) / 12)
  const dayOfYear = Math.floor(275 * month / 9) - Math.floor((month + 9) / 12) * (1 + Math.floor((year - 4 * Math.floor(year / 4) + 2) / 3)) + day - 30
  const decl = -23.45 * Math.cos(2 * Math.PI * (dayOfYear + 10) / 365)
  const latRad = geo.lat * Math.PI / 180
  const declRad = decl * Math.PI / 180
  const cosH = -Math.tan(latRad) * Math.tan(declRad)
  const H = Math.acos(Math.max(-1, Math.min(1, cosH))) * 180 / Math.PI
  const sunrise = 12 - H / 15 + geo.tz
  const sunset = 12 + H / 15 + geo.tz
  const fmtTime = (h: number) => {
    const hh = Math.floor(h) % 24
    const mm = Math.floor((h - Math.floor(h)) * 60)
    return `${hh.toString().padStart(2,'0')}:${mm.toString().padStart(2,'0')}:00`
  }

  const moonNakName = moonNak.name
  const nakIdx = NAKSHATRA.indexOf(moonNakName)

  return {
    name, gender, birthDate: dateStr, birthTime: timeStr, birthPlace: place,
    sunrise: fmtTime(sunrise),
    sunset: fmtTime(sunset),
    ayanamsha: AYANAMSHA.toFixed(5),
    tithi: (tithiIdx < 15 ? 'Shukla ' : 'Krishna ') + TITHI_NAMES[tithiIdx],
    karan: KARAN_NAMES[karanIdx],
    yoga: YOGA_NAMES[yogaIdx % 27],
    varna: ['Brahmin','Kshatriya','Vaishya','Shudra'][varnaIdx],
    vashya: vashyaArr[moonRashiIdx],
    yoni: yoniArr[nakIdx % 12],
    gan: ganArr[moonRashiIdx],
    nadi: nadiArr[moonRashiIdx],
    sign: RASHI[moonRashiIdx],
    signLord: RASHI_LORDS[moonRashiIdx],
    nakshatraCharan: `${moonNakName} (${moonNak.pada})`,
    yog: YOGA_NAMES[yogaIdx % 27],
    karana: KARAN_NAMES[karanIdx],
    tatva: tatvaArr[moonRashiIdx],
    yunja: yunjaArr[moonRashiIdx],
    planets: planetData,
    lagna: lagnaData,
    houses
  }
}

// ============================================================
// UI COMPONENT
// ============================================================

export default function KundliPage() {
  const [form, setForm] = useState({
    name: '', gender: 'Male', birthDate: '', birthTime: '12:00 AM', birthPlace: ''
  })
  const [kundli, setKundli] = useState<KundliData | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.birthDate || !form.birthPlace) return
    setLoading(true)
    setTimeout(() => {
      const result = calcKundli(form.name, form.gender, form.birthDate, form.birthTime, form.birthPlace)
      setKundli(result)
      setLoading(false)
    }, 800)
  }

  // Place planets in house grid
  const houseGrid: Record<number, Planet[]> = {}
  if (kundli) {
    for (let i = 1; i <= 12; i++) houseGrid[i] = []
    ;[...kundli.planets, kundli.lagna].forEach(p => {
      if (!houseGrid[p.house]) houseGrid[p.house] = []
      houseGrid[p.house].push(p)
    })
  }

  // North Indian diamond chart positions (12 houses in diamond grid)
  const housePositions = [
    // row, col, label position  [house index 1-12]
    { house: 1,  row: 0, col: 1, w: 1, h: 1 }, // top center
    { house: 2,  row: 0, col: 2, w: 1, h: 1 }, // top right
    { house: 3,  row: 1, col: 3, w: 1, h: 1 }, // right top
    { house: 4,  row: 2, col: 2, w: 1, h: 1 }, // bottom right
    { house: 5,  row: 2, col: 1, w: 1, h: 1 }, // bottom center
    { house: 6,  row: 2, col: 0, w: 1, h: 1 }, // bottom left
    { house: 7,  row: 1, col: 0, w: 1, h: 1 }, // left bottom (center)
    { house: 8,  row: 0, col: 0, w: 1, h: 1 }, // top left
    { house: 9,  row: 1, col: 0, w: 1, h: 1 }, // (merged, override)
    { house: 10, row: 0, col: 1, w: 1, h: 1 }, // (override)
    { house: 11, row: 0, col: 0, w: 1, h: 1 }, // (override)
    { house: 12, row: 0, col: 2, w: 1, h: 1 }, // (override)
  ]

  // South Indian chart layout (4x4 grid, houses in fixed rashi order)
  // Houses are placed by rashi (anti-clockwise from top-left: Pisces, Aries, Taurus, Gemini...)
  const southGridMap: Record<number,[number,number]> = {
    0: [0,1], 1: [0,2], 2: [0,3],  // Aries, Taurus, Gemini  (top row)
    11:[0,0],                        // Pisces
    3: [1,3],                        // Cancer
    10:[1,0],                        // Aquarius
    4: [2,3],                        // Leo
    9: [2,0],                        // Capricorn
    5: [3,3], 6: [3,2], 7: [3,1], 8:[3,0],  // Virgo, Libra, Scorpio, Sagittarius
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
      fontFamily: "'Georgia', serif",
      color: 'white',
      padding: '0 0 4rem 0'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,215,0,0.3)',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <a href="/" style={{ color: '#FFD700', textDecoration: 'none', fontSize: '1.1rem' }}>
          ← VibeZodiac
        </a>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#FFD700', letterSpacing: '2px' }}>
            ☸ Free Kundli
          </div>
          <div style={{ fontSize: '0.8rem', color: 'rgba(255,215,0,0.6)', letterSpacing: '3px' }}>
            VEDIC BIRTH CHART
          </div>
        </div>
        <div style={{ width: '100px' }} />
      </div>

      {/* Form */}
      {!kundli && (
        <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '0 1.5rem' }}>
          <div style={{
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,215,0,0.3)',
            borderRadius: '20px',
            padding: '2.5rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
          }}>
            <h2 style={{ textAlign: 'center', color: '#FFD700', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
              New Kundli
            </h2>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>
              Enter your birth details for a complete Vedic birth chart
            </p>

            <form onSubmit={handleSubmit}>
              {[
                { label: 'Name *', key: 'name', type: 'text', placeholder: 'Enter your name' },
                { label: 'Birth Date *', key: 'birthDate', type: 'text', placeholder: 'MM/DD/YYYY' },
                { label: 'Birth Time *', key: 'birthTime', type: 'text', placeholder: '12:00 AM' },
                { label: 'Birth Place *', key: 'birthPlace', type: 'text', placeholder: 'City, Country' },
              ].map(field => (
                <div key={field.key} style={{ marginBottom: '1.2rem' }}>
                  <label style={{ display: 'block', color: 'rgba(255,215,0,0.8)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={form[field.key as keyof typeof form]}
                    onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    required
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,215,0,0.3)',
                      borderRadius: '10px',
                      padding: '0.8rem 1rem',
                      color: 'white',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              ))}

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', color: 'rgba(255,215,0,0.8)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  Gender *
                </label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {['Male', 'Female', 'Other'].map(g => (
                    <label key={g} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', color: 'white' }}>
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={form.gender === g}
                        onChange={() => setForm(f => ({ ...f, gender: g }))}
                        style={{ accentColor: '#FFD700' }}
                      />
                      {g}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? 'rgba(255,215,0,0.3)' : 'linear-gradient(135deg, #FFD700, #FF8C00)',
                  color: loading ? 'rgba(255,255,255,0.5)' : '#1a1a2e',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '1rem',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s',
                  letterSpacing: '1px'
                }}
              >
                {loading ? '☸ Calculating...' : '✨ Generate Free Kundli'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Kundli Result */}
      {kundli && (
        <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
          {/* Back button */}
          <button
            onClick={() => setKundli(null)}
            style={{
              background: 'rgba(255,215,0,0.15)',
              border: '1px solid rgba(255,215,0,0.4)',
              color: '#FFD700',
              padding: '0.5rem 1.2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              marginBottom: '1.5rem',
              fontSize: '0.9rem'
            }}
          >
            ← New Kundli
          </button>

          {/* Tabs layout */}
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,215,0,0.2)',
            borderRadius: '16px',
            overflow: 'hidden'
          }}>
            {/* Tab Header */}
            <div style={{
              display: 'flex',
              background: 'rgba(0,0,0,0.3)',
              borderBottom: '1px solid rgba(255,215,0,0.2)',
              overflowX: 'auto'
            }}>
              {['Basic','Kundli Chart','Planet Positions','Panchang','Avakhada'].map((tab, i) => (
                <TabButton key={tab} tab={tab} index={i} />
              ))}
            </div>

            {/* Content */}
            <TabContent kundli={kundli} houseGrid={houseGrid} />
          </div>
        </div>
      )}
    </div>
  )
}

function TabButton({ tab, index }: { tab: string, index: number }) {
  const [active, setActive] = useState(index === 0)
  // This won't work well in isolation; we need shared state
  return null
}

function TabContent({ kundli, houseGrid }: { kundli: KundliData, houseGrid: Record<number, Planet[]> }) {
  const [activeTab, setActiveTab] = useState(0)
  const tabs = ['Basic','Kundli Chart','Planet Positions','Panchang','Avakhada']

  const row = (label: string, value: string) => (
    <tr key={label} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <td style={{ padding: '0.75rem 1rem', color: 'rgba(255,255,255,0.5)', width: '45%', fontSize: '0.9rem' }}>{label}</td>
      <td style={{ padding: '0.75rem 1rem', color: 'white', fontWeight: '500', fontSize: '0.9rem' }}>{value}</td>
    </tr>
  )

  return (
    <>
      {/* Tab buttons here */}
      <div style={{
        display: 'flex',
        background: 'rgba(0,0,0,0.3)',
        borderBottom: '1px solid rgba(255,215,0,0.2)',
        overflowX: 'auto'
      }}>
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            style={{
              padding: '0.9rem 1.3rem',
              background: activeTab === i ? 'rgba(255,215,0,0.2)' : 'transparent',
              color: activeTab === i ? '#FFD700' : 'rgba(255,255,255,0.5)',
              border: 'none',
              borderBottom: activeTab === i ? '3px solid #FFD700' : '3px solid transparent',
              cursor: 'pointer',
              fontWeight: activeTab === i ? 'bold' : 'normal',
              fontSize: '0.9rem',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ padding: '1.5rem' }}>
        {/* BASIC TAB */}
        {activeTab === 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div>
              <h3 style={{ color: '#FFD700', marginBottom: '1rem', fontSize: '1rem', letterSpacing: '1px' }}>BASIC DETAILS</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {row('Name', kundli.name)}
                  {row('Gender', kundli.gender)}
                  {row('Date', kundli.birthDate)}
                  {row('Time', kundli.birthTime)}
                  {row('Place', kundli.birthPlace)}
                  {row('Sunrise', kundli.sunrise)}
                  {row('Sunset', kundli.sunset)}
                  {row('Ayanamsha', kundli.ayanamsha)}
                </tbody>
              </table>
            </div>
            <div>
              <h3 style={{ color: '#FFD700', marginBottom: '1rem', fontSize: '1rem', letterSpacing: '1px' }}>PANCHANG DETAILS</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {row('Tithi', kundli.tithi)}
                  {row('Karan', kundli.karan)}
                  {row('Yoga', kundli.yoga)}
                  {row('Nakshatra', kundli.nakshatraCharan)}
                  {row('Sign', kundli.sign)}
                  {row('Sign Lord', kundli.signLord)}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* KUNDLI CHART TAB */}
        {activeTab === 1 && (
          <div>
            <h3 style={{ color: '#FFD700', marginBottom: '1.5rem', textAlign: 'center', letterSpacing: '2px' }}>
              SOUTH INDIAN BIRTH CHART
            </h3>
            <SouthIndianChart kundli={kundli} houseGrid={houseGrid} />
          </div>
        )}

        {/* PLANET POSITIONS TAB */}
        {activeTab === 2 && (
          <div>
            <h3 style={{ color: '#FFD700', marginBottom: '1rem', fontSize: '1rem', letterSpacing: '1px' }}>PLANET POSITIONS</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,215,0,0.1)' }}>
                    {['Planet','Sign','Degree','Nakshatra','Pada','Lord','House'].map(h => (
                      <th key={h} style={{ padding: '0.7rem', color: '#FFD700', textAlign: 'left', fontWeight: 'normal', letterSpacing: '0.5px' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[kundli.lagna, ...kundli.planets].map(p => (
                    <tr key={p.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '0.65rem', color: 'white' }}>
                        {PLANET_SYMBOLS[p.name] || ''} {p.name}
                      </td>
                      <td style={{ padding: '0.65rem', color: '#B0E0E6' }}>
                        {RASHI_SYMBOLS[p.rashi]} {RASHI[p.rashi]}
                      </td>
                      <td style={{ padding: '0.65rem', color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>
                        {degreeToStr(p.rashiDeg)}
                      </td>
                      <td style={{ padding: '0.65rem', color: 'rgba(255,255,255,0.7)' }}>{p.nakshatra.name}</td>
                      <td style={{ padding: '0.65rem', color: 'rgba(255,255,255,0.7)' }}>{p.nakshatra.pada}</td>
                      <td style={{ padding: '0.65rem', color: '#DDA0DD' }}>{p.nakshatra.lord}</td>
                      <td style={{ padding: '0.65rem', color: '#90EE90' }}>{p.house}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PANCHANG TAB */}
        {activeTab === 3 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div>
              <h3 style={{ color: '#FFD700', marginBottom: '1rem', fontSize: '1rem', letterSpacing: '1px' }}>PANCHANG</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {row('Tithi', kundli.tithi)}
                  {row('Nakshatra', kundli.nakshatraCharan)}
                  {row('Yoga', kundli.yoga)}
                  {row('Karan', kundli.karan)}
                  {row('Var (Day)', ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date(kundli.birthDate).getDay()])}
                </tbody>
              </table>
            </div>
            <div>
              <h3 style={{ color: '#FFD700', marginBottom: '1rem', fontSize: '1rem', letterSpacing: '1px' }}>ADDITIONAL INFO</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {row('Sign', kundli.sign)}
                  {row('Sign Lord', kundli.signLord)}
                  {row('Sunrise', kundli.sunrise)}
                  {row('Sunset', kundli.sunset)}
                  {row('Ayanamsha', kundli.ayanamsha)}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AVAKHADA TAB */}
        {activeTab === 4 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div>
              <h3 style={{ color: '#FFD700', marginBottom: '1rem', fontSize: '1rem', letterSpacing: '1px' }}>AVAKHADA DETAILS</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {row('Varna', kundli.varna)}
                  {row('Vashya', kundli.vashya)}
                  {row('Yoni', kundli.yoni)}
                  {row('Gan', kundli.gan)}
                  {row('Nadi', kundli.nadi)}
                  {row('Sign', kundli.sign)}
                  {row('Sign Lord', kundli.signLord)}
                </tbody>
              </table>
            </div>
            <div>
              <h3 style={{ color: '#FFD700', marginBottom: '1rem', fontSize: '1rem', letterSpacing: '1px' }}>MORE DETAILS</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  {row('Nakshatra-Charan', kundli.nakshatraCharan)}
                  {row('Yog', kundli.yog)}
                  {row('Karan', kundli.karana)}
                  {row('Tithi', kundli.tithi)}
                  {row('Yunja', kundli.yunja)}
                  {row('Tatva', kundli.tatva)}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function SouthIndianChart({ kundli, houseGrid }: { kundli: KundliData, houseGrid: Record<number, Planet[]> }) {
  // South Indian chart: fixed rashis, planets placed by rashi
  // Grid positions (row, col) for each rashi index 0-11
  const rashiGrid: Record<number,[number,number]> = {
    11:[0,0], 0:[0,1], 1:[0,2], 2:[0,3],
    10:[1,0],                   3:[1,3],
    9: [2,0],                   4:[2,3],
    8: [3,0], 7:[3,1], 6:[3,2], 5:[3,3],
  }

  // Place planets by rashi
  const rashiPlanets: Record<number, Planet[]> = {}
  for (let i = 0; i < 12; i++) rashiPlanets[i] = []
  ;[kundli.lagna, ...kundli.planets].forEach(p => {
    rashiPlanets[p.rashi].push(p)
  })

  const lagnaRashi = kundli.lagna.rashi

  const cellStyle = (rashi: number): React.CSSProperties => ({
    border: '1px solid rgba(255,215,0,0.3)',
    padding: '0.4rem',
    minHeight: '80px',
    position: 'relative',
    background: rashi === lagnaRashi ? 'rgba(255,215,0,0.08)' : 'rgba(255,255,255,0.03)',
    verticalAlign: 'top',
    width: '25%'
  })

  const rows: [number,number,number,number][] = [
    [11,0,1,2],
    [10,-1,-1,3],
    [9,-1,-1,4],
    [8,7,6,5],
  ]

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
        <tbody>
          {rows.map((rowRashis, ri) => (
            <tr key={ri}>
              {rowRashis.map((rashi, ci) => {
                if (rashi === -1) {
                  if (ri === 1 && ci === 1) {
                    return (
                      <td key={ci} colSpan={2} rowSpan={2} style={{
                        border: '1px solid rgba(255,215,0,0.3)',
                        textAlign: 'center',
                        background: 'rgba(255,215,0,0.05)',
                        verticalAlign: 'middle'
                      }}>
                        <div style={{ color: '#FFD700', fontSize: '1.2rem' }}>☸</div>
                        <div style={{ color: '#FFD700', fontSize: '0.7rem', marginTop: '0.3rem' }}>
                          {kundli.name}
                        </div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem' }}>
                          {kundli.birthDate}
                        </div>
                      </td>
                    )
                  }
                  return null
                }
                return (
                  <td key={ci} style={cellStyle(rashi)}>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(255,215,0,0.5)', marginBottom: '0.2rem' }}>
                      {RASHI_SYMBOLS[rashi]} {rashi === lagnaRashi ? '◆' : ''}
                    </div>
                    {rashiPlanets[rashi].map(p => (
                      <div key={p.name} style={{
                        fontSize: '0.7rem',
                        color: p.name === 'Lagna' ? '#FFD700' : p.name === 'Sun' ? '#FFA500' : p.name === 'Moon' ? '#E0E0FF' : p.name === 'Rahu' || p.name === 'Ketu' ? '#DDA0DD' : '#90EE90',
                        lineHeight: 1.3
                      }}>
                        {PLANET_SYMBOLS[p.name]} {p.name.substring(0,3)}
                      </div>
                    ))}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ textAlign: 'center', marginTop: '1rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>
        South Indian Chart • Lahiri Ayanamsha
      </div>
    </div>
  )
}
