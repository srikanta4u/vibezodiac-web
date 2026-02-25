'use client'

import { useState } from 'react'

// ============================================================
// KUNDLI MATCHING ENGINE — Pure JS, Zero External API
// Full Ashtakoot Guna Milan (36 points system)
// ============================================================

const AYANAMSHA = 23.71743

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

const RASHI = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
]

// Varna: 0=Brahmin,1=Kshatriya,2=Vaishya,3=Shudra
const NAKSHATRA_VARNA = [
  0,3,1,2,0,3,1,2,3,3,2,1,0,1,0,2,3,1,
  3,2,1,0,3,2,0,1,0
]

// Vashya by rashi
const RASHI_VASHYA = [
  'Chatushpada','Chatushpada','Nara','Kita','Vanachara','Nara',
  'Nara','Kita','Chatushpada','Nara','Nara','Jalachar'
]

// Tara: nakshatra index mod 9, then by position
// Yoni animal for each nakshatra
const NAKSHATRA_YONI = [
  'Ashva','Gaja','Mesha','Sarpa','Sarpa','Shwana',
  'Marjara','Mushaka','Sarpa','Mushaka','Marjara','Gau',
  'Mahisha','Vyaghra','Mahisha','Vyaghra','Mriga','Mriga',
  'Shwana','Mushaka','Nakula','Nakula','Simha','Ashva',
  'Simha','Gau','Gaja'
]

// Yoni compatibility matrix (0=hostile,1=neutral,2=friendly)
const YONI_COMPAT: Record<string, Record<string, number>> = {
  Ashva:    { Ashva:4, Gaja:2, Mesha:2, Sarpa:0, Shwana:2, Marjara:1, Mushaka:1, Mriga:2, Gau:2, Mahisha:1, Vyaghra:1, Nakula:1, Simha:1 },
  Gaja:     { Ashva:2, Gaja:4, Mesha:1, Sarpa:1, Shwana:1, Marjara:2, Mushaka:1, Mriga:2, Gau:2, Mahisha:2, Vyaghra:1, Nakula:1, Simha:1 },
  Mesha:    { Ashva:2, Gaja:1, Mesha:4, Sarpa:2, Shwana:2, Marjara:1, Mushaka:1, Mriga:3, Gau:1, Mahisha:1, Vyaghra:1, Nakula:1, Simha:1 },
  Sarpa:    { Ashva:0, Gaja:1, Mesha:2, Sarpa:4, Shwana:1, Marjara:1, Mushaka:2, Mriga:1, Gau:1, Mahisha:1, Vyaghra:1, Nakula:1, Simha:1 },
  Shwana:   { Ashva:2, Gaja:1, Mesha:2, Sarpa:1, Shwana:4, Marjara:0, Mushaka:1, Mriga:2, Gau:1, Mahisha:1, Vyaghra:2, Nakula:2, Simha:1 },
  Marjara:  { Ashva:1, Gaja:2, Mesha:1, Sarpa:1, Shwana:0, Marjara:4, Mushaka:0, Mriga:1, Gau:1, Mahisha:1, Vyaghra:1, Nakula:1, Simha:1 },
  Mushaka:  { Ashva:1, Gaja:1, Mesha:1, Sarpa:2, Shwana:1, Marjara:0, Mushaka:4, Mriga:1, Gau:1, Mahisha:1, Vyaghra:1, Nakula:1, Simha:1 },
  Mriga:    { Ashva:2, Gaja:2, Mesha:3, Sarpa:1, Shwana:2, Marjara:1, Mushaka:1, Mriga:4, Gau:1, Mahisha:2, Vyaghra:1, Nakula:2, Simha:1 },
  Gau:      { Ashva:2, Gaja:2, Mesha:1, Sarpa:1, Shwana:1, Marjara:1, Mushaka:1, Mriga:1, Gau:4, Mahisha:2, Vyaghra:1, Nakula:1, Simha:1 },
  Mahisha:  { Ashva:1, Gaja:2, Mesha:1, Sarpa:1, Shwana:1, Marjara:1, Mushaka:1, Mriga:2, Gau:2, Mahisha:4, Vyaghra:1, Nakula:1, Simha:1 },
  Vyaghra:  { Ashva:1, Gaja:1, Mesha:1, Sarpa:1, Shwana:2, Marjara:1, Mushaka:1, Mriga:1, Gau:1, Mahisha:1, Vyaghra:4, Nakula:1, Simha:2 },
  Nakula:   { Ashva:1, Gaja:1, Mesha:1, Sarpa:1, Shwana:2, Marjara:1, Mushaka:1, Mriga:2, Gau:1, Mahisha:1, Vyaghra:1, Nakula:4, Simha:1 },
  Simha:    { Ashva:1, Gaja:1, Mesha:1, Sarpa:1, Shwana:1, Marjara:1, Mushaka:1, Mriga:1, Gau:1, Mahisha:1, Vyaghra:2, Nakula:1, Simha:4 },
}

// Gana: 0=Deva,1=Manushya,2=Rakshasa
const NAKSHATRA_GANA = [
  0,1,0,2,1,1,0,0,1,2,1,1,0,2,0,0,2,1,
  2,1,0,0,1,2,0,1,0
]

// Rashi lords
const RASHI_LORDS = ['Mars','Venus','Mercury','Moon','Sun','Mercury','Venus','Mars','Jupiter','Saturn','Saturn','Jupiter']

// Nadi: 0=Adhya,1=Madhya,2=Antya
const NAKSHATRA_NADI = [
  0,1,2,2,1,0,0,1,2,2,1,0,0,1,2,2,1,0,
  0,1,2,2,1,0,0,1,2
]

// Planet friendship table
const PLANET_FRIENDS: Record<string, string[]> = {
  Sun:     ['Moon','Mars','Jupiter'],
  Moon:    ['Sun','Mercury'],
  Mars:    ['Sun','Moon','Jupiter'],
  Mercury: ['Sun','Venus'],
  Jupiter: ['Sun','Moon','Mars'],
  Venus:   ['Mercury','Saturn'],
  Saturn:  ['Mercury','Venus'],
  Rahu:    ['Venus','Saturn'],
  Ketu:    ['Mars','Venus','Saturn'],
}
const PLANET_ENEMIES: Record<string, string[]> = {
  Sun:     ['Venus','Saturn'],
  Moon:    ['None'],
  Mars:    ['Mercury'],
  Mercury: ['Moon'],
  Jupiter: ['Mercury','Venus'],
  Venus:   ['Sun','Moon'],
  Saturn:  ['Sun','Moon','Mars'],
  Rahu:    ['Sun','Moon','Mars'],
  Ketu:    ['Sun','Moon'],
}

// ---- Astronomical calculations ----

function julianDay(year: number, month: number, day: number, hour: number): number {
  if (month <= 2) { year -= 1; month += 12 }
  const A = Math.floor(year / 100)
  const B = 2 - A + Math.floor(A / 4)
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + hour / 24 + B - 1524.5
}

function jdToT(jd: number): number {
  return (jd - 2451545.0) / 36525.0
}

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

function calcSunLon(T: number): number {
  const L0 = (280.46646 + 36000.76983 * T) % 360
  const M = ((357.52911 + 35999.05029 * T) % 360) * Math.PI / 180
  const C = 1.9146 * Math.sin(M) + 0.019993 * Math.sin(2*M) + 0.00029 * Math.sin(3*M)
  return (L0 + C + 360) % 360
}

function toSidereal(lon: number): number {
  return ((lon - AYANAMSHA) + 360) % 360
}

function geocode(place: string): { lat: number, lon: number, tz: number } {
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
    'houston': { lat: 29.7604, lon: -95.3698, tz: -6 },
    'phoenix': { lat: 33.4484, lon: -112.0740, tz: -7 },
    'philadelphia': { lat: 39.9526, lon: -75.1652, tz: -5 },
    'san antonio': { lat: 29.4241, lon: -98.4936, tz: -6 },
  }
  const key = place.toLowerCase().trim()
  for (const [k, v] of Object.entries(places)) {
    if (key.includes(k)) return v
  }
  return { lat: 28.6139, lon: 77.2090, tz: 5.5 }
}

interface PersonData {
  name: string
  moonNakIdx: number
  moonRashi: number
  moonSidLon: number
  sunSidLon: number
  nakName: string
  rashiName: string
  rashiLord: string
  nakLord: string
}

function calcPersonData(name: string, dateStr: string, timeStr: string, place: string): PersonData {
  const parts = dateStr.split('/')
  const month = parseInt(parts[0]), day = parseInt(parts[1]), year = parseInt(parts[2])
  const [timePart, ampm] = timeStr.split(' ')
  let [hours, minutes] = timePart.split(':').map(Number)
  if (ampm === 'PM' && hours !== 12) hours += 12
  if (ampm === 'AM' && hours === 12) hours = 0
  const hour = hours + minutes / 60

  const geo = geocode(place)
  const utcHour = hour - geo.tz
  const jd = julianDay(year, month, day, utcHour)
  const T = jdToT(jd)

  const moonLon = calcMoonLon(T)
  const sunLon = calcSunLon(T)
  const moonSidLon = toSidereal(moonLon)
  const sunSidLon = toSidereal(sunLon)
  const moonNakIdx = Math.floor(moonSidLon / (360/27))
  const moonRashi = Math.floor(moonSidLon / 30)

  return {
    name,
    moonNakIdx: moonNakIdx % 27,
    moonRashi,
    moonSidLon,
    sunSidLon,
    nakName: NAKSHATRA[moonNakIdx % 27],
    rashiName: RASHI[moonRashi],
    rashiLord: RASHI_LORDS[moonRashi],
    nakLord: NAKSHATRA_LORDS[moonNakIdx % 27],
  }
}

// ============================================================
// ASHTAKOOT GUNA MILAN — 8 Tests, 36 Points Total
// ============================================================

interface GunaResult {
  name: string
  maxPoints: number
  received: number
  maleValue: string
  femaleValue: string
  description: string
  meaning: string
  color: string
}

// 1. VARNA (1 point) — Spiritual compatibility
function calcVarna(male: PersonData, female: PersonData): GunaResult {
  const mv = NAKSHATRA_VARNA[male.moonNakIdx]
  const fv = NAKSHATRA_VARNA[female.moonNakIdx]
  const varnaNames = ['Brahmin','Kshatriya','Vaishya','Shudra']
  // Male varna should be >= female varna (or same)
  let pts = 0
  if (mv === fv) pts = 1
  else if (mv < fv) pts = 1  // male higher or equal
  else pts = 0
  return {
    name: 'Varna',
    maxPoints: 1,
    received: pts,
    maleValue: varnaNames[mv],
    femaleValue: varnaNames[fv],
    description: 'Natural Refinement / Work',
    meaning: "Varna refers to the mental compatibility of the two persons involved. It holds nominal effect on the matters of marriage compatibility.",
    color: pts === 1 ? '#22c55e' : '#ef4444'
  }
}

// 2. VASHYA (2 points) — Dominance/attraction
function calcVashya(male: PersonData, female: PersonData): GunaResult {
  const mv = RASHI_VASHYA[male.moonRashi]
  const fv = RASHI_VASHYA[female.moonRashi]
  let pts = 0
  if (mv === fv) pts = 2
  else {
    // Mutual attraction pairs
    const pairs: Record<string,string> = {
      'Nara': 'Nara', 'Chatushpada': 'Chatushpada',
      'Kita': 'Jalachar', 'Jalachar': 'Kita',
      'Vanachara': 'Chatushpada'
    }
    if (pairs[mv] === fv || pairs[fv] === mv) pts = 1
    else pts = 0
  }
  return {
    name: 'Vashya',
    maxPoints: 2,
    received: pts,
    maleValue: mv,
    femaleValue: fv,
    description: 'Innate Giving / Attraction towards each other',
    meaning: "The boy and the girl both will remain an amazing understanding when it will come to an emotional, moral and professional aspect.",
    color: pts >= 1 ? '#22c55e' : '#ef4444'
  }
}

// 3. TARA (3 points) — Birth star compatibility
function calcTara(male: PersonData, female: PersonData): GunaResult {
  const mn = male.moonNakIdx
  const fn = female.moonNakIdx
  // Tara = (female_nak - male_nak + 27) % 9
  const tara1 = ((fn - mn + 27) % 27) % 9
  const tara2 = ((mn - fn + 27) % 27) % 9
  const goodTaras = [1, 2, 4, 6, 8] // Sampat,Vipat,Kshema,Sadhana,Mitra,Ati-Mitra
  const t1good = [1,3,5,7].includes(tara1) // odd taras are bad: Vipat,Pratyak,Vadha,Atimitra exception
  // Simplified: taras 1,2,4,6,8 are auspicious (0-indexed: 0,1,3,5,7)
  const auspicious = [0,1,3,5,7]
  const pts1 = auspicious.includes(tara1) ? 1.5 : 0
  const pts2 = auspicious.includes(tara2) ? 1.5 : 0
  const pts = pts1 + pts2
  const taraNames = ['Janma','Sampat','Vipat','Kshema','Pratyak','Sadhaka','Vadha','Mitra','Ati-Mitra']
  return {
    name: 'Tara',
    maxPoints: 3,
    received: Math.min(pts, 3),
    maleValue: taraNames[tara1],
    femaleValue: taraNames[tara2],
    description: 'Comfort - Prosperity - Health',
    meaning: "Tara is the indicator of the birth star compatibility of the bride and the groom. It also indicates the fortune of the couple.",
    color: pts >= 1.5 ? '#22c55e' : pts > 0 ? '#f59e0b' : '#ef4444'
  }
}

// 4. YONI (4 points) — Physical/sexual compatibility
function calcYoni(male: PersonData, female: PersonData): GunaResult {
  const my = NAKSHATRA_YONI[male.moonNakIdx]
  const fy = NAKSHATRA_YONI[female.moonNakIdx]
  const score = YONI_COMPAT[my]?.[fy] ?? YONI_COMPAT[fy]?.[my] ?? 1
  return {
    name: 'Yoni',
    maxPoints: 4,
    received: score,
    maleValue: my,
    femaleValue: fy,
    description: 'Physical Intimacy',
    meaning: "Both of them need to work in synchronization which might create friction at times between them.",
    color: score >= 3 ? '#22c55e' : score >= 2 ? '#f59e0b' : '#ef4444'
  }
}

// 5. GRAHA MAITRI (5 points) — Rashi lord friendship
function calcGrahaMaitri(male: PersonData, female: PersonData): GunaResult {
  const ml = male.rashiLord
  const fl = female.rashiLord
  let pts = 0
  if (ml === fl) {
    pts = 5
  } else {
    const mlFriends = PLANET_FRIENDS[ml] || []
    const mlEnemies = PLANET_ENEMIES[ml] || []
    const flFriends = PLANET_FRIENDS[fl] || []
    const flEnemies = PLANET_ENEMIES[fl] || []
    const mLikeF = mlFriends.includes(fl)
    const mDislikeF = mlEnemies.includes(fl)
    const fLikeM = flFriends.includes(ml)
    const fDislikeM = flEnemies.includes(ml)

    if (mLikeF && fLikeM) pts = 5
    else if (mLikeF && !fDislikeM) pts = 4
    else if (!mDislikeF && fLikeM) pts = 4
    else if (!mDislikeF && !fDislikeM) pts = 3
    else if (mLikeF && fDislikeM) pts = 1
    else if (mDislikeF && fLikeM) pts = 1
    else pts = 0
  }
  return {
    name: 'Graha Maitri',
    maxPoints: 5,
    received: pts,
    maleValue: ml,
    femaleValue: fl,
    description: 'Friendliness of Sign Lords',
    meaning: "Graha Maitri is the indicator of the intellectual and mental connection between the prospective couple.",
    color: pts >= 4 ? '#22c55e' : pts >= 3 ? '#f59e0b' : '#ef4444'
  }
}

// 6. GANA (6 points) — Temperament
function calcGana(male: PersonData, female: PersonData): GunaResult {
  const mg = NAKSHATRA_GANA[male.moonNakIdx]
  const fg = NAKSHATRA_GANA[female.moonNakIdx]
  const ganaNames = ['Deva','Manushya','Rakshasa']
  let pts = 0
  if (mg === fg) pts = 6
  else if (mg === 0 && fg === 1) pts = 5 // Deva+Manushya
  else if (mg === 1 && fg === 0) pts = 5
  else if (mg === 0 && fg === 2) pts = 1 // Deva+Rakshasa
  else if (mg === 2 && fg === 0) pts = 1
  else if (mg === 1 && fg === 2) pts = 0 // Manushya+Rakshasa
  else if (mg === 2 && fg === 1) pts = 0
  return {
    name: 'Gana',
    maxPoints: 6,
    received: pts,
    maleValue: ganaNames[mg],
    femaleValue: ganaNames[fg],
    description: 'Temperament',
    meaning: "Gana is the indicator of the behaviour, character and temperament of the possible bride and groom towards each other.",
    color: pts >= 5 ? '#22c55e' : pts >= 3 ? '#f59e0b' : '#ef4444'
  }
}

// 7. BHAKOOT (7 points) — Rashi compatibility
function calcBhakoot(male: PersonData, female: PersonData): GunaResult {
  const mr = male.moonRashi
  const fr = female.moonRashi
  // Rashi distance
  const d1 = ((fr - mr + 12) % 12) + 1
  const d2 = ((mr - fr + 12) % 12) + 1
  // Auspicious combinations (not 2-12, 5-9, 6-8)
  const inauspicious = (d1 === 6 && d2 === 8) || (d1 === 8 && d2 === 6) ||
    (d1 === 5 && d2 === 9) || (d1 === 9 && d2 === 5) ||
    (d1 === 2 && d2 === 12) || (d1 === 12 && d2 === 2)
  const pts = inauspicious ? 0 : 7
  return {
    name: 'Bhakoot',
    maxPoints: 7,
    received: pts,
    maleValue: RASHI[mr],
    femaleValue: RASHI[fr],
    description: 'Health and Wealth',
    meaning: "The combination of love Signs of the bride and the groom is an auspicious combination. It is recommended to chat an Astrologer after their wedding.",
    color: pts === 7 ? '#22c55e' : '#ef4444'
  }
}

// 8. NADI (8 points) — Health/progeny (most important)
function calcNadi(male: PersonData, female: PersonData): GunaResult {
  const mn = NAKSHATRA_NADI[male.moonNakIdx]
  const fn = NAKSHATRA_NADI[female.moonNakIdx]
  const nadiNames = ['Adhya (Vata)','Madhya (Pitta)','Antya (Kapha)']
  const pts = mn === fn ? 0 : 8
  return {
    name: 'Nadi',
    maxPoints: 8,
    received: pts,
    maleValue: nadiNames[mn],
    femaleValue: nadiNames[fn],
    description: 'Progeny',
    meaning: "This couple will experience beneficial and long lasting partnership. This marriage is preferable at all cost.",
    color: pts === 8 ? '#22c55e' : '#ef4444'
  }
}

// Mangal Dosha check
function checkMangalDosha(person: PersonData): boolean {
  // Simplified: Mars in 1,2,4,7,8,12 from lagna/moon — approximate with moon rashi
  // Using nakshatra-based approximation
  const mangalNakshatras = [2,4,6,9,11,13,16,18,20,23,25] // approximate
  return mangalNakshatras.includes(person.moonNakIdx)
}

interface MatchResult {
  gunas: GunaResult[]
  totalPoints: number
  totalMax: number
  percentage: number
  verdict: string
  verdictColor: string
  verdictBg: string
  male: PersonData
  female: PersonData
  mangalMale: boolean
  mangalFemale: boolean
  mangalMatch: boolean
  summary: string
}

function calcMatch(male: PersonData, female: PersonData): MatchResult {
  const gunas = [
    calcVarna(male, female),
    calcVashya(male, female),
    calcTara(male, female),
    calcYoni(male, female),
    calcGrahaMaitri(male, female),
    calcGana(male, female),
    calcBhakoot(male, female),
    calcNadi(male, female),
  ]

  const totalPoints = gunas.reduce((s, g) => s + g.received, 0)
  const totalMax = 36
  const percentage = (totalPoints / totalMax) * 100

  let verdict = '', verdictColor = '', verdictBg = '', summary = ''

  if (totalPoints >= 32) {
    verdict = 'Excellent Match ✨'; verdictColor = '#22c55e'; verdictBg = 'rgba(34,197,94,0.1)'
    summary = 'This is an exceptional match. The couple is highly compatible and blessed for a joyful, prosperous marriage.'
  } else if (totalPoints >= 27) {
    verdict = 'Very Good Match 💚'; verdictColor = '#22c55e'; verdictBg = 'rgba(34,197,94,0.1)'
    summary = 'This is a very good match. The couple shares great compatibility and can look forward to a happy life together.'
  } else if (totalPoints >= 21) {
    verdict = 'Good Match 👍'; verdictColor = '#f59e0b'; verdictBg = 'rgba(245,158,11,0.1)'
    summary = 'This is a medium score. Marriage can proceed with mutual understanding and some astrologer guidance.'
  } else if (totalPoints >= 18) {
    verdict = 'Average Match ⚠️'; verdictColor = '#f59e0b'; verdictBg = 'rgba(245,158,11,0.1)'
    summary = 'Average compatibility. Should consult an astrologer before proceeding for remedies and guidance.'
  } else {
    verdict = 'Mismatch ✗'; verdictColor = '#ef4444'; verdictBg = 'rgba(239,68,68,0.1)'
    summary = 'This combination has challenges. It is strongly recommended to consult an astrologer before marriage.'
  }

  const mangalMale = checkMangalDosha(male)
  const mangalFemale = checkMangalDosha(female)
  const mangalMatch = (mangalMale && mangalFemale) || (!mangalMale && !mangalFemale)

  return { gunas, totalPoints, totalMax, percentage, verdict, verdictColor, verdictBg, male, female, mangalMale, mangalFemale, mangalMatch, summary }
}

// ============================================================
// UI
// ============================================================

interface FormData {
  name: string
  date: string
  time: string
  place: string
}

const emptyForm: FormData = { name: '', date: '', time: '12:00 AM', place: '' }

// ⚠️ IMPORTANT: FormPanel must be defined OUTSIDE the main component
// to prevent React from remounting it on every keystroke (causing focus loss)
const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,215,0,0.25)',
  borderRadius: '10px',
  padding: '0.75rem 1rem',
  color: 'white',
  fontSize: '0.95rem',
  outline: 'none',
  boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  display: 'block',
  color: 'rgba(255,215,0,0.8)',
  marginBottom: '0.4rem',
  fontSize: '0.85rem',
  letterSpacing: '0.5px',
}

function FormPanel({ data, setData, label }: { data: FormData, setData: (d: FormData) => void, label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <h3 style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', letterSpacing: '3px', margin: 0 }}>
        {label} DETAIL
      </h3>
      <div>
        <label style={labelStyle}>Name *</label>
        <input style={inputStyle} placeholder="Enter name" value={data.name}
          onChange={e => setData({ ...data, name: e.target.value })} />
      </div>
      <div>
        <label style={labelStyle}>Date of Birth * (MM/DD/YYYY)</label>
        <input style={inputStyle} placeholder="MM/DD/YYYY" value={data.date}
          onChange={e => setData({ ...data, date: e.target.value })} />
      </div>
      <div>
        <label style={labelStyle}>Time of Birth</label>
        <input style={inputStyle} placeholder="12:00 AM" value={data.time}
          onChange={e => setData({ ...data, time: e.target.value })} />
      </div>
      <div>
        <label style={labelStyle}>Birth Place *</label>
        <input style={inputStyle} placeholder="City, Country" value={data.place}
          onChange={e => setData({ ...data, place: e.target.value })} />
      </div>
    </div>
  )
}

export default function KundliMatchingPage() {
  const [boy, setBoy] = useState<FormData>({ ...emptyForm })
  const [girl, setGirl] = useState<FormData>({ ...emptyForm })
  const [activeTab, setActiveTab] = useState<'boy' | 'girl'>('boy')
  const [result, setResult] = useState<MatchResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleMatch = () => {
    if (!boy.name || !boy.date || !boy.place || !girl.name || !girl.date || !girl.place) {
      setError('Please fill all required fields for both Boy and Girl.')
      return
    }
    setError('')
    setLoading(true)
    setTimeout(() => {
      try {
        const maleData = calcPersonData(boy.name, boy.date, boy.time, boy.place)
        const femaleData = calcPersonData(girl.name, girl.date, girl.time, girl.place)
        const matchResult = calcMatch(maleData, femaleData)
        setResult(matchResult)
      } catch (e) {
        setError('Error calculating. Please check date format MM/DD/YYYY.')
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0a0015 0%, #1a0533 40%, #0d1a3a 100%)',
      fontFamily: "'Georgia', serif",
      color: 'white',
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,215,0,0.2)',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <a href="/" style={{ color: '#FFD700', textDecoration: 'none', fontSize: '1rem' }}>← VibeZodiac</a>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#FFD700', letterSpacing: '2px' }}>
            💑 Kundli Matching
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,215,0,0.5)', letterSpacing: '3px' }}>
            ASHTAKOOT GUNA MILAN
          </div>
        </div>
        <div style={{ width: '120px' }} />
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1rem 4rem' }}>

        {/* Hero text */}
        {!result && (
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.8rem', color: 'white', marginBottom: '0.5rem' }}>Find Your Right One</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
              Our Vedic Kundli matching uses the ancient Ashtakoot system (36 point Guna Milan) to analyze
              compatibility across 8 dimensions of life and relationships.
            </p>
          </div>
        )}

        {/* Form */}
        {!result && (
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,215,0,0.2)',
            borderRadius: '20px',
            overflow: 'hidden',
            marginBottom: '1.5rem',
          }}>
            {/* Tab switcher */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,215,0,0.15)' }}>
              {(['boy', 'girl'] as const).map(t => (
                <button key={t} onClick={() => setActiveTab(t)} style={{
                  flex: 1,
                  padding: '1rem',
                  background: activeTab === t ? 'rgba(255,215,0,0.12)' : 'transparent',
                  color: activeTab === t ? '#FFD700' : 'rgba(255,255,255,0.4)',
                  border: 'none',
                  borderBottom: activeTab === t ? '3px solid #FFD700' : '3px solid transparent',
                  cursor: 'pointer',
                  fontWeight: activeTab === t ? 'bold' : 'normal',
                  fontSize: '1rem',
                  transition: 'all 0.2s',
                }}>
                  {t === 'boy' ? "🤵 Boy's Detail" : "👰 Girl's Detail"}
                </button>
              ))}
            </div>

            <div style={{ padding: '1.5rem 2rem' }}>
              {activeTab === 'boy'
                ? <FormPanel data={boy} setData={setBoy} label="BOY'S" />
                : <FormPanel data={girl} setData={setGirl} label="GIRL'S" />
              }
            </div>
          </div>
        )}

        {error && (
          <div style={{
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '10px', padding: '0.8rem 1.2rem', color: '#fca5a5',
            marginBottom: '1rem', textAlign: 'center', fontSize: '0.9rem'
          }}>{error}</div>
        )}

        {!result && (
          <button onClick={handleMatch} disabled={loading} style={{
            width: '100%',
            background: loading ? 'rgba(255,215,0,0.2)' : 'linear-gradient(135deg, #FFD700, #FF8C00)',
            color: loading ? 'rgba(255,255,255,0.4)' : '#1a0a00',
            border: 'none', borderRadius: '14px', padding: '1.1rem',
            fontSize: '1.15rem', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
            letterSpacing: '1px', transition: 'all 0.3s',
          }}>
            {loading ? '☸ Calculating Compatibility...' : '💑 Match Horoscope'}
          </button>
        )}

        {/* ===== RESULT ===== */}
        {result && (
          <div>
            {/* Back */}
            <button onClick={() => setResult(null)} style={{
              background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)',
              color: '#FFD700', padding: '0.5rem 1.2rem', borderRadius: '8px',
              cursor: 'pointer', marginBottom: '1.5rem', fontSize: '0.9rem',
            }}>← New Match</button>

            {/* Header cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
              {/* Boy card */}
              <div style={{
                background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.3)',
                borderRadius: '14px', padding: '1.2rem', textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.3rem' }}>🤵</div>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#93c5fd' }}>{result.male.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.3rem' }}>
                  {boy.date} • {boy.time}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{boy.place}</div>
                <div style={{
                  marginTop: '0.7rem', padding: '0.3rem 0.8rem',
                  background: 'rgba(96,165,250,0.15)', borderRadius: '20px',
                  fontSize: '0.8rem', color: '#93c5fd', display: 'inline-block'
                }}>
                  {result.male.rashiName} • {result.male.nakName}
                </div>
              </div>

              {/* Score circle */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8"/>
                    <circle cx="60" cy="60" r="50" fill="none"
                      stroke={result.verdictColor} strokeWidth="8"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - result.totalPoints / 36)}`}
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                    />
                    <text x="60" y="55" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold">{result.totalPoints.toFixed(0)}</text>
                    <text x="60" y="72" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="11">out of 36</text>
                  </svg>
                </div>
                <div style={{ marginTop: '0.5rem', color: result.verdictColor, fontWeight: 'bold', fontSize: '0.85rem' }}>
                  {result.verdict}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '0.2rem' }}>💞</div>
              </div>

              {/* Girl card */}
              <div style={{
                background: 'rgba(244,114,182,0.1)', border: '1px solid rgba(244,114,182,0.3)',
                borderRadius: '14px', padding: '1.2rem', textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.3rem' }}>👰</div>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#f9a8d4' }}>{result.female.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.3rem' }}>
                  {girl.date} • {girl.time}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{girl.place}</div>
                <div style={{
                  marginTop: '0.7rem', padding: '0.3rem 0.8rem',
                  background: 'rgba(244,114,182,0.15)', borderRadius: '20px',
                  fontSize: '0.8rem', color: '#f9a8d4', display: 'inline-block'
                }}>
                  {result.female.rashiName} • {result.female.nakName}
                </div>
              </div>
            </div>

            {/* Summary banner */}
            <div style={{
              background: result.verdictBg,
              border: `1px solid ${result.verdictColor}40`,
              borderRadius: '12px', padding: '1rem 1.5rem',
              marginBottom: '1.5rem', textAlign: 'center',
            }}>
              <div style={{ color: result.verdictColor, fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.4rem' }}>
                {result.totalPoints.toFixed(1)}/36 is your Guna Score
              </div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>{result.summary}</div>
            </div>

            {/* Ashtakoot table */}
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,215,0,0.15)',
              borderRadius: '16px', overflow: 'hidden', marginBottom: '1.5rem',
            }}>
              <div style={{
                background: 'rgba(255,215,0,0.1)', padding: '1rem 1.5rem',
                borderBottom: '1px solid rgba(255,215,0,0.15)',
              }}>
                <h3 style={{ margin: 0, color: '#FFD700', fontSize: '1rem', letterSpacing: '1px' }}>
                  ☸ Match Ashtakoot Points
                </h3>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.05)' }}>
                      {['Attribute','Male','Female','Received','Out of','Area of Life','Description','Meaning'].map(h => (
                        <th key={h} style={{
                          padding: '0.7rem 0.8rem', color: 'rgba(255,215,0,0.7)',
                          textAlign: 'left', fontWeight: 'normal', fontSize: '0.78rem',
                          letterSpacing: '0.5px', whiteSpace: 'nowrap',
                          borderBottom: '1px solid rgba(255,255,255,0.06)',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.gunas.map((g, i) => (
                      <tr key={g.name} style={{
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)'
                      }}>
                        <td style={{ padding: '0.75rem 0.8rem', color: g.color, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                          {g.name}
                        </td>
                        <td style={{ padding: '0.75rem 0.8rem', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>
                          {g.maleValue}
                        </td>
                        <td style={{ padding: '0.75rem 0.8rem', color: 'rgba(255,255,255,0.7)', whiteSpace: 'nowrap' }}>
                          {g.femaleValue}
                        </td>
                        <td style={{ padding: '0.75rem 0.8rem' }}>
                          <span style={{
                            color: g.color, fontWeight: 'bold', fontSize: '1rem'
                          }}>{g.received}</span>
                        </td>
                        <td style={{ padding: '0.75rem 0.8rem', color: 'rgba(255,255,255,0.4)' }}>{g.maxPoints}</td>
                        <td style={{ padding: '0.75rem 0.8rem', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                          {g.description}
                        </td>
                        <td style={{ padding: '0.75rem 0.8rem', color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem', maxWidth: '200px' }}>
                          {g.meaning.substring(0, 80)}...
                        </td>
                        <td style={{ padding: '0.75rem 0.8rem' }}>
                          <div style={{
                            width: '60px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${(g.received / g.maxPoints) * 100}%`,
                              height: '100%', background: g.color, borderRadius: '3px',
                              transition: 'width 1s'
                            }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                    {/* Total row */}
                    <tr style={{ background: 'rgba(255,215,0,0.06)', borderTop: '2px solid rgba(255,215,0,0.2)' }}>
                      <td colSpan={3} style={{ padding: '0.8rem', color: '#FFD700', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        Total
                      </td>
                      <td style={{ padding: '0.8rem', color: '#FFD700', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        {result.totalPoints.toFixed(1)}
                      </td>
                      <td style={{ padding: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>36</td>
                      <td colSpan={3} style={{ padding: '0.8rem' }}>
                        <div style={{
                          width: '120px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${result.percentage}%`, height: '100%',
                            background: `linear-gradient(90deg, ${result.verdictColor}, ${result.verdictColor}aa)`,
                            borderRadius: '4px'
                          }} />
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* Summary verdict */}
              <div style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', lineHeight: 1.6
              }}>
                Ashtakoot Matching between male and female is <strong style={{ color: result.verdictColor }}>
                  {result.totalPoints.toFixed(1)} points out of 36 points
                </strong>. {result.totalPoints >= 18 ? 'This is the medium score. Hence, marriage can be approved.' : 'This score is below 18. It is recommended to consult an astrologer.'}
              </div>
            </div>

            {/* Dosha section */}
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,215,0,0.15)',
              borderRadius: '16px', overflow: 'hidden', marginBottom: '1.5rem',
            }}>
              <div style={{
                background: 'rgba(255,215,0,0.1)', padding: '1rem 1.5rem',
                borderBottom: '1px solid rgba(255,215,0,0.15)',
              }}>
                <h3 style={{ margin: 0, color: '#FFD700', fontSize: '1rem', letterSpacing: '1px' }}>
                  🔥 Dosha Analysis
                </h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 0 }}>
                {[
                  { label: 'Ashtakoot Score', value: `${result.totalPoints.toFixed(1)}/36`, color: result.verdictColor },
                  { label: 'Mangal Dosha (Boy)', value: result.mangalMale ? 'Present' : 'Not Present', color: result.mangalMale ? '#f59e0b' : '#22c55e' },
                  { label: 'Mangal Dosha (Girl)', value: result.mangalFemale ? 'Present' : 'Not Present', color: result.mangalFemale ? '#f59e0b' : '#22c55e' },
                  { label: 'Manglik Match', value: result.mangalMatch ? 'Yes ✓' : 'No ✗', color: result.mangalMatch ? '#22c55e' : '#ef4444' },
                ].map((item, i) => (
                  <div key={i} style={{
                    padding: '1.2rem 1.5rem',
                    borderRight: i < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    borderBottom: '0',
                  }}>
                    <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>{item.label}</div>
                    <div style={{ color: item.color, fontWeight: 'bold', fontSize: '1.1rem' }}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compatibility breakdown visual */}
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,215,0,0.15)',
              borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem',
            }}>
              <h3 style={{ color: '#FFD700', marginBottom: '1.2rem', fontSize: '1rem', letterSpacing: '1px' }}>
                📊 Compatibility Breakdown
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {result.gunas.map(g => (
                  <div key={g.name} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 50px', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{g.name}</div>
                    <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '6px', height: '10px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${(g.received / g.maxPoints) * 100}%`,
                        height: '100%', background: `linear-gradient(90deg, ${g.color}, ${g.color}88)`,
                        borderRadius: '6px', transition: 'width 1.2s ease',
                      }} />
                    </div>
                    <div style={{ color: g.color, fontWeight: 'bold', fontSize: '0.85rem', textAlign: 'right' }}>
                      {g.received}/{g.maxPoints}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{
              background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.15)',
              borderRadius: '10px', padding: '1rem 1.2rem',
              color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', lineHeight: 1.6, textAlign: 'center'
            }}>
              ⚠️ This Kundli matching is for entertainment and informational purposes only.
              For important life decisions, please consult a qualified Vedic astrologer.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
