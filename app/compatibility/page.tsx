'use client'

import { useState } from 'react'

// ============================================================
// ZODIAC COMPATIBILITY ENGINE — Pure JS, Zero External API
// ============================================================

const SIGNS = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
]

const SIGN_SYMBOLS: Record<string,string> = {
  Aries:'♈', Taurus:'♉', Gemini:'♊', Cancer:'♋', Leo:'♌', Virgo:'♍',
  Libra:'♎', Scorpio:'♏', Sagittarius:'♐', Capricorn:'♑', Aquarius:'♒', Pisces:'♓'
}

const SIGN_EMOJI: Record<string,string> = {
  Aries:'🐏', Taurus:'🐂', Gemini:'👯', Cancer:'🦀', Leo:'🦁', Virgo:'🌾',
  Libra:'⚖️', Scorpio:'🦂', Sagittarius:'🏹', Capricorn:'🐐', Aquarius:'🏺', Pisces:'🐟'
}

const ELEMENT: Record<string,string> = {
  Aries:'Fire', Leo:'Fire', Sagittarius:'Fire',
  Taurus:'Earth', Virgo:'Earth', Capricorn:'Earth',
  Gemini:'Air', Libra:'Air', Aquarius:'Air',
  Cancer:'Water', Scorpio:'Water', Pisces:'Water',
}

const MODALITY: Record<string,string> = {
  Aries:'Cardinal', Cancer:'Cardinal', Libra:'Cardinal', Capricorn:'Cardinal',
  Taurus:'Fixed', Leo:'Fixed', Scorpio:'Fixed', Aquarius:'Fixed',
  Gemini:'Mutable', Virgo:'Mutable', Sagittarius:'Mutable', Pisces:'Mutable',
}

const RULING_PLANET: Record<string,string> = {
  Aries:'Mars', Taurus:'Venus', Gemini:'Mercury', Cancer:'Moon',
  Leo:'Sun', Virgo:'Mercury', Libra:'Venus', Scorpio:'Mars/Pluto',
  Sagittarius:'Jupiter', Capricorn:'Saturn', Aquarius:'Saturn/Uranus', Pisces:'Jupiter/Neptune'
}

// Sign index helper
const idx = (s: string) => SIGNS.indexOf(s)

// Element compatibility score
function elementScore(a: string, b: string): number {
  const ea = ELEMENT[a], eb = ELEMENT[b]
  if (ea === eb) return 100
  const compatible: Record<string, string[]> = {
    Fire: ['Air'], Air: ['Fire'], Earth: ['Water'], Water: ['Earth']
  }
  if (compatible[ea]?.includes(eb)) return 75
  const neutral: Record<string, string[]> = {
    Fire: ['Earth'], Earth: ['Fire'], Air: ['Water'], Water: ['Air']
  }
  if (neutral[ea]?.includes(eb)) return 40
  return 25
}

// Aspect angle compatibility
function aspectScore(a: string, b: string): number {
  const diff = Math.abs(idx(a) - idx(b))
  const angle = Math.min(diff, 12 - diff)
  // 0=conjunction, 1=semi-sextile, 2=sextile, 3=square, 4=trine, 5=quincunx, 6=opposition
  const scores: Record<number, number> = { 0:95, 1:55, 2:80, 3:45, 4:90, 5:35, 6:60 }
  return scores[angle] ?? 50
}

// Modality compatibility
function modalityScore(a: string, b: string): number {
  const ma = MODALITY[a], mb = MODALITY[b]
  if (ma === mb) return 70
  if ((ma === 'Cardinal' && mb === 'Fixed') || (ma === 'Fixed' && mb === 'Cardinal')) return 55
  if ((ma === 'Cardinal' && mb === 'Mutable') || (ma === 'Mutable' && mb === 'Cardinal')) return 75
  if ((ma === 'Fixed' && mb === 'Mutable') || (ma === 'Mutable' && mb === 'Fixed')) return 65
  return 60
}

// Compute all compatibility scores
interface CompatResult {
  sign1: string
  sign2: string
  love: number
  sexual: number
  friendship: number
  communication: number
  trust: number
  overall: number
  loveDesc: string
  sexualDesc: string
  friendshipDesc: string
  communicationDesc: string
  trustDesc: string
  relationshipTips: string
  verdict: string
  verdictColor: string
}

// Pre-built descriptions for all 66 unique pairs (sign1 <= sign2 alphabetically)
// Using deterministic generation from sign properties
function getCompatibility(s1: string, s2: string): CompatResult {
  const base = elementScore(s1, s2)
  const asp = aspectScore(s1, s2)
  const mod = modalityScore(s1, s2)
  const e1 = ELEMENT[s1], e2 = ELEMENT[s2]

  // Compute individual scores with variation
  const seed = (idx(s1) * 13 + idx(s2) * 7 + idx(s1) * idx(s2)) % 17

  const love = Math.min(99, Math.max(35, Math.round((base * 0.5 + asp * 0.3 + mod * 0.2) + seed - 8)))
  const sexual = Math.min(99, Math.max(30, Math.round((base * 0.4 + asp * 0.4 + mod * 0.2) + seed * 1.2 - 5)))
  const friendship = Math.min(99, Math.max(40, Math.round((base * 0.3 + asp * 0.2 + mod * 0.5) + seed * 0.8 - 3)))
  const communication = Math.min(99, Math.max(35, Math.round((mod * 0.5 + asp * 0.3 + base * 0.2) + seed - 2)))
  const trust = Math.min(99, Math.max(30, Math.round((mod * 0.4 + base * 0.4 + asp * 0.2) + seed * 0.6)))
  const overall = Math.round((love + sexual + friendship + communication + trust) / 5)

  const loveDescs: Record<string, Record<string, string>> = {
    Fire: {
      Fire: `When ${s1} and ${s2} come together, the sparks fly instantly. Both bring passion, enthusiasm, and a love for adventure. This fiery duo energizes each other, though power struggles may arise. Their bond is electric — never boring, always intense.`,
      Air: `${s1}'s passion meets ${s2}'s intellect in a beautifully dynamic union. Air fans Fire's flames, making this a relationship full of inspiration, excitement, and mutual admiration. ${s1} keeps ${s2} engaged while ${s2} gives ${s1} fresh ideas to pursue.`,
      Earth: `${s1}'s fiery spirit can feel restrained by ${s2}'s grounded nature — but this tension creates beautiful balance. ${s2} offers stability that ${s1} secretly needs, while ${s1} injects excitement into ${s2}'s life. With patience, this pairing builds something lasting.`,
      Water: `${s1} and ${s2} are a classic case of opposites attracting. Fire's boldness intrigues Water's depth, while Water softens Fire's impulsiveness. Emotionally, they may clash — but the chemistry is undeniable and the lessons profound.`,
    },
    Earth: {
      Earth: `${s1} and ${s2} share a deep appreciation for stability, loyalty, and the finer things in life. Their love grows slowly but becomes unshakeable. Both value commitment and build relationships like they build empires — methodically and with purpose.`,
      Water: `Earth and Water nourish each other beautifully. ${s1} offers the security that ${s2} craves, while ${s2} brings emotional depth that enriches ${s1}'s practical world. This is one of the most naturally compatible pairings in the zodiac.`,
      Air: `${s1}'s practicality can clash with ${s2}'s free-spirited nature, but there's much to learn here. ${s2} helps ${s1} think bigger, while ${s1} grounds ${s2}'s endless ideas into reality. With mutual respect, this becomes a powerfully productive love.`,
      Fire: `The grounded ${s1} and fiery ${s2} bring out both the best and most challenging aspects of each other. ${s2} ignites passion in ${s1}'s steady world, while ${s1} offers ${s2} the anchor they didn't know they needed.`,
    },
    Air: {
      Air: `Two Air signs create a relationship built on intellectual stimulation, wit, and endless conversation. ${s1} and ${s2} truly "get" each other's minds. The challenge is grounding the relationship in emotional depth — but the mental connection is rare and beautiful.`,
      Fire: `${s1}'s ideas fuel ${s2}'s fire in this inspired pairing. Together they dream big, act boldly, and bring out each other's most vibrant selves. ${s1} provides the vision while ${s2} provides the momentum — a dynamic duo.`,
      Water: `Air and Water can be a fascinating but complex combination. ${s1} thinks; ${s2} feels — and bridging that gap takes real effort. But when they do, ${s1} gains emotional intelligence and ${s2} gains clarity. A relationship that transforms both.`,
      Earth: `${s1}'s airy nature may feel untethered to grounded ${s2}, but there's genuine complementarity here. ${s2} gives ${s1} structure while ${s1} broadens ${s2}'s horizons. The key is respecting each other's fundamentally different approaches to life.`,
    },
    Water: {
      Water: `Two Water signs create a deeply emotional, intuitive, and soulful connection. ${s1} and ${s2} understand each other without words. Their empathy runs deep — though both must guard against emotional overwhelm and co-dependency in this intensely feeling union.`,
      Earth: `Water and Earth make one of the zodiac's most naturally nurturing combinations. ${s2} gives ${s1} the safe harbor they seek, while ${s1}'s emotional richness softens ${s2}'s practicality. Together they create a home full of warmth and security.`,
      Fire: `${s1}'s emotional depths meet ${s2}'s passionate fire in a union of high voltage. There's intense attraction here — and equally intense conflict. When they find balance, they create steam: powerful, transformative, and unstoppable.`,
      Air: `${s1} feels deeply while ${s2} thinks analytically — creating a fascinating push-pull dynamic. ${s2} can help ${s1} gain perspective while ${s1} teaches ${s2} the power of emotional intelligence. This pairing requires patience but offers tremendous growth.`,
    },
  }

  const loveDesc = loveDescs[e1]?.[e2] || `${s1} and ${s2} bring unique energies to their relationship that create a fascinating dynamic worth exploring.`

  const sexualDescs: Record<string, string> = {
    FireFire: `The physical chemistry between ${s1} and ${s2} is explosive. Both are passionate, spontaneous, and adventurous lovers who match each other's intensity perfectly. Their intimate life is never routine — always passionate and full of energy.`,
    FireAir: `${s1} and ${s2} share electric physical chemistry. Air's curiosity meets Fire's passion to create intimate experiences that are both exciting and deeply satisfying. They inspire each other to explore new dimensions of intimacy.`,
    FireEarth: `${s1}'s passionate nature can initially overwhelm sensual ${s2}, but once trust is built, their physical connection becomes profoundly satisfying. ${s2} grounds ${s1}'s fire into a slow-burning, deeply physical bond.`,
    FireWater: `The physical attraction between ${s1} and ${s2} is magnetic. Fire's boldness and Water's depth create intimate encounters of rare intensity. Emotionally complex, but physically undeniable.`,
    EarthEarth: `${s1} and ${s2} share a sensual, deeply physical connection rooted in trust and comfort. Both signs value pleasure through the senses — touch, taste, scent. Their intimacy builds slowly into something profoundly satisfying.`,
    EarthWater: `The physical connection between ${s1} and ${s2} is tender and deeply nourishing. Earth provides stability while Water brings emotional depth, creating intimate encounters that feel both safe and profoundly moving.`,
    EarthAir: `${s1} and ${s2} may need to bridge different approaches — Earth seeks sensory depth while Air seeks mental connection. But when they do, their physical life gains both grounding and excitement.`,
    AirAir: `${s1} and ${s2} bring intellectual playfulness to their intimate life. Communication is key to their physical connection — they talk, experiment, and approach intimacy with curiosity and openness.`,
    AirWater: `Air's light touch meets Water's emotional intensity in an intimate dance of contrasts. ${s1} and ${s2} need to meet each other halfway — but the result is intimacy that is both stimulating and deeply moving.`,
    WaterWater: `Two Water signs create deeply emotional, intuitive intimate connections. ${s1} and ${s2} are attuned to each other's needs without words, creating moments of profound vulnerability and soul-level connection.`,
  }

  const sexKey = [e1, e2].sort().join('')
  const sexualDesc = sexualDescs[`${e1}${e2}`] || sexualDescs[`${e2}${e1}`] || sexualDescs[sexKey] ||
    `${s1} and ${s2} discover a unique physical chemistry that deepens as their trust grows.`

  const friendshipDescs: Record<string, string> = {
    Fire: `As friends, ${s1} and ${s2} are an energetic, action-oriented duo. They bond over shared adventures, mutual enthusiasm, and a love of fun. Both signs are generous and warm — this friendship thrives on doing things together.`,
    Earth: `${s1} and ${s2} build one of the zodiac's most loyal friendships. They show up for each other reliably, share practical goals, and bond over shared values. This friendship is quiet but unshakeable.`,
    Air: `The ${s1}-${s2} friendship is a meeting of minds. These two can talk for hours, share ideas, and intellectually challenge each other. They make each other funnier, smarter, and more interesting.`,
    Water: `As friends, ${s1} and ${s2} share a profound emotional bond. They intuitively understand each other, offer unconditional support, and create a friendship that feels like family. Deeply loyal and empathetic.`,
    Mixed: `${s1} and ${s2} complement each other beautifully as friends. Their differences become strengths — each one offering what the other lacks. This is a friendship that expands both of their worlds.`,
  }

  const friendshipDesc = e1 === e2
    ? (friendshipDescs[e1] || friendshipDescs.Mixed)
    : friendshipDescs.Mixed

  const commDescs: Record<string, string> = {
    FireFire: `Communication between ${s1} and ${s2} is direct, enthusiastic, and sometimes combative. Both speak their minds boldly. Arguments can flare up quickly but resolve just as fast. Their communication style is energizing and honest.`,
    AirAir: `${s1} and ${s2} communicate brilliantly. Both articulate, curious, and open-minded, they enjoy deep conversations and intellectual debate. They rarely run out of things to say and often finish each other's thoughts.`,
    EarthEarth: `Communication between ${s1} and ${s2} is measured and practical. Both prefer concrete discussions over abstract theories. They may communicate slowly, but when they speak, it matters. Reliability and honesty define their exchanges.`,
    WaterWater: `${s1} and ${s2} communicate emotionally and intuitively. Words matter less than tone and feeling. They sense what the other means before it's said, creating a communication style that is deeply empathetic but sometimes indirect.`,
    Default: `${s1} and ${s2} bring different communication styles that, when respected, create rich dialogue. ${s1}'s ${e1} approach meets ${s2}'s ${e2} perspective — creating conversations that expand both their worldviews.`,
  }

  const commKey = `${e1}${e2}`
  const communicationDesc = commDescs[commKey] || commDescs[`${e2}${e1}`] || commDescs.Default

  const trustDesc = trust >= 70
    ? `Trust comes naturally to ${s1} and ${s2}. Their values align in key ways, and both signs tend toward loyalty once committed. They build a relationship where honesty feels safe and vulnerability is welcomed.`
    : trust >= 50
    ? `Trust between ${s1} and ${s2} develops over time rather than instantly. Both must work through different insecurities and communication styles. But once established, their trust creates an unbreakable foundation.`
    : `${s1} and ${s2} may struggle to build trust initially due to their fundamentally different natures. Transparency and patience are essential. Trust is possible here — but it must be consciously cultivated.`

  const tips = [
    `Celebrate your differences — ${s1}'s ${e1} nature and ${s2}'s ${e2} nature are complementary, not conflicting.`,
    `Make space for both partners' needs: ${s1} needs ${MODALITY[s1] === 'Fixed' ? 'stability and consistency' : MODALITY[s1] === 'Cardinal' ? 'to lead and initiate' : 'freedom and variety'}, while ${s2} needs ${MODALITY[s2] === 'Fixed' ? 'stability and consistency' : MODALITY[s2] === 'Cardinal' ? 'to lead and initiate' : 'freedom and variety'}.`,
    `Ruled by ${RULING_PLANET[s1]}, ${s1} brings ${e1 === 'Fire' ? 'passion and drive' : e1 === 'Earth' ? 'groundedness and sensuality' : e1 === 'Air' ? 'intellect and communication' : 'emotional depth and intuition'} to the relationship.`,
    `${s2}, ruled by ${RULING_PLANET[s2]}, contributes ${e2 === 'Fire' ? 'enthusiasm and courage' : e2 === 'Earth' ? 'practicality and loyalty' : e2 === 'Air' ? 'curiosity and adaptability' : 'empathy and intuition'}.`,
    overall >= 75
      ? `This is a naturally compatible pairing. Nurture it with quality time, honest communication, and appreciation for each other's unique strengths.`
      : overall >= 55
      ? `This relationship requires conscious effort but offers tremendous growth. Focus on understanding rather than changing each other.`
      : `Every zodiac pairing can flourish with mutual respect and understanding. Your differences, though challenging, are also your greatest teachers.`
  ]

  let verdict = '', verdictColor = ''
  if (overall >= 80) { verdict = 'Soulmate Potential ✨'; verdictColor = '#22c55e' }
  else if (overall >= 70) { verdict = 'Highly Compatible 💚'; verdictColor = '#4ade80' }
  else if (overall >= 60) { verdict = 'Good Match 👍'; verdictColor = '#f59e0b' }
  else if (overall >= 50) { verdict = 'Moderate Match ⚠️'; verdictColor = '#f97316' }
  else { verdict = 'Challenging Match 🔥'; verdictColor = '#ef4444' }

  return {
    sign1: s1, sign2: s2,
    love, sexual, friendship, communication, trust, overall,
    loveDesc, sexualDesc, friendshipDesc: friendshipDesc.replace(/\${s1}/g, s1).replace(/\${s2}/g, s2),
    communicationDesc, trustDesc,
    relationshipTips: tips.join(' '),
    verdict, verdictColor
  }
}

// ============================================================
// UI COMPONENTS
// ============================================================

// Score bar component — defined outside main to prevent focus issues
function ScoreBar({ label, score, color }: { label: string, score: number, color: string }) {
  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>{label}</span>
        <span style={{ color, fontWeight: 'bold', fontSize: '0.9rem' }}>{score}%</span>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '6px', height: '10px', overflow: 'hidden' }}>
        <div style={{
          width: `${score}%`, height: '100%',
          background: `linear-gradient(90deg, ${color}, ${color}cc)`,
          borderRadius: '6px',
        }} />
      </div>
    </div>
  )
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,215,0,0.3)',
  borderRadius: '12px',
  padding: '0.9rem 1rem',
  color: 'white',
  fontSize: '1rem',
  outline: 'none',
  cursor: 'pointer',
  appearance: 'none',
  WebkitAppearance: 'none',
}

export default function CompatibilityPage() {
  const [sign1, setSign1] = useState('Gemini')
  const [sign2, setSign2] = useState('Leo')
  const [result, setResult] = useState<CompatResult | null>(null)

  const handleSubmit = () => {
    const r = getCompatibility(sign1, sign2)
    setResult(r)
  }

  const scoreColor = (score: number) =>
    score >= 80 ? '#22c55e' : score >= 65 ? '#f59e0b' : score >= 50 ? '#f97316' : '#ef4444'

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
            💞 Compatibility
          </div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,215,0,0.5)', letterSpacing: '3px' }}>
            ZODIAC LOVE MATCH
          </div>
        </div>
        <div style={{ width: '120px' }} />
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem 4rem' }}>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: 'white', marginBottom: '0.5rem' }}>
            {result ? `${result.sign1} & ${result.sign2} Zodiac Compatibility` : 'Are You Compatible?'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '1rem' }}>
            {result ? 'Love, sex, friendship & more' : 'Choose your and your partner\'s zodiac sign to check compatibility'}
          </p>
          {result && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.8rem', alignItems: 'center' }}>
              <span style={{ fontSize: '2.5rem' }}>{SIGN_EMOJI[result.sign1]}</span>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '1.2rem' }}>×</span>
              <span style={{ fontSize: '2.5rem' }}>{SIGN_EMOJI[result.sign2]}</span>
            </div>
          )}
        </div>

        {/* Input card — always visible */}
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          border: '2px solid rgba(255,215,0,0.4)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
        }}>
          <h2 style={{ textAlign: 'center', color: '#FFD700', fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.3rem', letterSpacing: '1px' }}>
            ARE YOU COMPATIBLE?
          </h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.45)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Choose your and your partner&apos;s zodiac sign
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,215,0,0.7)', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '0.6rem' }}>
                YOUR SIGN
              </label>
              <div style={{ position: 'relative' }}>
                <select value={sign1} onChange={e => setSign1(e.target.value)} style={selectStyle}>
                  {SIGNS.map(s => <option key={s} value={s} style={{ background: '#1a0533', color: 'white' }}>{SIGN_SYMBOLS[s]} {s}</option>)}
                </select>
                <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#FFD700' }}>▼</div>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,215,0,0.7)', fontSize: '0.8rem', letterSpacing: '2px', marginBottom: '0.6rem' }}>
                PARTNER&apos;S SIGN
              </label>
              <div style={{ position: 'relative' }}>
                <select value={sign2} onChange={e => setSign2(e.target.value)} style={selectStyle}>
                  {SIGNS.map(s => <option key={s} value={s} style={{ background: '#1a0533', color: 'white' }}>{SIGN_SYMBOLS[s]} {s}</option>)}
                </select>
                <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#FFD700' }}>▼</div>
              </div>
            </div>
          </div>

          <button onClick={handleSubmit} style={{
            width: '100%',
            background: 'linear-gradient(135deg, #FFD700, #FF8C00)',
            color: '#1a0a00',
            border: 'none', borderRadius: '14px', padding: '1rem',
            fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer',
            letterSpacing: '1px',
          }}>
            💞 Check Compatibility
          </button>
        </div>

        {/* Results */}
        {result && (
          <div>
            {/* Overall score banner */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${result.verdictColor}40`,
              borderRadius: '16px', padding: '1.5rem',
              marginBottom: '1.5rem', textAlign: 'center',
            }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '3rem', marginBottom: '0.2rem' }}>{SIGN_EMOJI[result.sign1]}</div>
                  <div style={{ color: '#FFD700', fontWeight: 'bold' }}>{result.sign1}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{ELEMENT[result.sign1]} • {MODALITY[result.sign1]}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="7"/>
                    <circle cx="50" cy="50" r="42" fill="none"
                      stroke={result.verdictColor} strokeWidth="7"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - result.overall / 100)}`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                    <text x="50" y="45" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">{result.overall}%</text>
                    <text x="50" y="62" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">OVERALL</text>
                  </svg>
                  <div style={{ color: result.verdictColor, fontWeight: 'bold', fontSize: '0.9rem', marginTop: '0.3rem' }}>
                    {result.verdict}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '3rem', marginBottom: '0.2rem' }}>{SIGN_EMOJI[result.sign2]}</div>
                  <div style={{ color: '#FFD700', fontWeight: 'bold' }}>{result.sign2}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{ELEMENT[result.sign2]} • {MODALITY[result.sign2]}</div>
                </div>
              </div>
            </div>

            {/* Score summary bar */}
            <div style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,215,0,0.15)',
              borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem',
            }}>
              <h3 style={{ color: '#FFD700', marginBottom: '1.2rem', fontSize: '1rem', letterSpacing: '1px' }}>📊 Compatibility Scores</h3>
              <ScoreBar label="Love" score={result.love} color={scoreColor(result.love)} />
              <ScoreBar label="Sexual" score={result.sexual} color={scoreColor(result.sexual)} />
              <ScoreBar label="Friendship" score={result.friendship} color={scoreColor(result.friendship)} />
              <ScoreBar label="Communication" score={result.communication} color={scoreColor(result.communication)} />
              <ScoreBar label="Trust" score={result.trust} color={scoreColor(result.trust)} />
            </div>

            {/* Love section */}
            <Section title="💕 LOVE COMPATIBILITY" score={result.love} color={scoreColor(result.love)} label="Love" desc={result.loveDesc} />
            <Section title="🔥 SEXUAL COMPATIBILITY" score={result.sexual} color={scoreColor(result.sexual)} label="Sexual" desc={result.sexualDesc} />
            <Section title="🤝 FRIENDSHIP COMPATIBILITY" score={result.friendship} color={scoreColor(result.friendship)} label="Friendship" desc={result.friendshipDesc} />
            <Section title="💬 COMMUNICATION COMPATIBILITY" score={result.communication} color={scoreColor(result.communication)} label="Communication" desc={result.communicationDesc} />
            <Section title="🔒 TRUST & LOYALTY" score={result.trust} color={scoreColor(result.trust)} label="Trust" desc={result.trustDesc} />

            {/* Relationship Tips */}
            <div style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,215,0,0.15)',
              borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem',
            }}>
              <h3 style={{ color: '#FFD700', marginBottom: '1rem', fontSize: '1rem', letterSpacing: '1px' }}>
                ⭐ RELATIONSHIP TIPS
              </h3>
              <div style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                {result.relationshipTips}
              </div>
            </div>

            {/* Sign details */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem',
              marginBottom: '1.5rem',
            }}>
              {[result.sign1, result.sign2].map(s => (
                <div key={s} style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,215,0,0.15)',
                  borderRadius: '16px', padding: '1.2rem',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>{SIGN_EMOJI[s]}</span>
                    <div>
                      <div style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '1.1rem' }}>{SIGN_SYMBOLS[s]} {s}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{ELEMENT[s]} • {MODALITY[s]}</div>
                    </div>
                  </div>
                  {[
                    ['Element', ELEMENT[s]],
                    ['Modality', MODALITY[s]],
                    ['Ruling Planet', RULING_PLANET[s]],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '0.85rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.4)' }}>{k}</span>
                      <span style={{ color: 'white' }}>{v}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* All signs grid */}
            <div style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,215,0,0.15)',
              borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem',
            }}>
              <h3 style={{ color: '#FFD700', marginBottom: '0.3rem', fontSize: '1rem', letterSpacing: '1px', textAlign: 'center' }}>
                {result.sign1} Compatibility With Other Signs
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', textAlign: 'center', marginBottom: '1.2rem' }}>
                Check your relationship compatibility
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem' }}>
                {SIGNS.map(s => {
                  const r2 = getCompatibility(result.sign1, s)
                  const c = scoreColor(r2.overall)
                  return (
                    <button key={s} onClick={() => { setSign2(s); setResult(getCompatibility(result.sign1, s)) }}
                      style={{
                        background: s === result.sign2 ? 'rgba(255,215,0,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${s === result.sign2 ? 'rgba(255,215,0,0.5)' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: '10px', padding: '0.6rem 0.4rem',
                        cursor: 'pointer', textAlign: 'center',
                      }}>
                      <div style={{ fontSize: '1.3rem' }}>{SIGN_EMOJI[s]}</div>
                      <div style={{ color: 'white', fontSize: '0.7rem', marginTop: '0.2rem' }}>{s}</div>
                      <div style={{ color: c, fontSize: '0.7rem', fontWeight: 'bold' }}>{r2.overall}%</div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Disclaimer */}
            <div style={{
              background: 'rgba(255,215,0,0.05)', border: '1px solid rgba(255,215,0,0.15)',
              borderRadius: '10px', padding: '1rem',
              color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', lineHeight: 1.6, textAlign: 'center'
            }}>
              ⚠️ Zodiac compatibility is for entertainment purposes only. Every relationship is unique and shaped by far more than sun signs alone.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Section component — outside main to prevent remount
function Section({ title, score, color, label, desc }: {
  title: string, score: number, color: string, label: string, desc: string
}) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,215,0,0.15)',
      borderRadius: '16px', padding: '1.5rem', marginBottom: '1rem',
    }}>
      <h3 style={{ color: '#FFD700', marginBottom: '1rem', fontSize: '1rem', letterSpacing: '1px' }}>{title}</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>{label}</span>
        <span style={{ color, fontWeight: 'bold' }}>{score}%</span>
      </div>
      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '6px', height: '10px', overflow: 'hidden', marginBottom: '1.2rem' }}>
        <div style={{ width: `${score}%`, height: '100%', background: `linear-gradient(90deg, ${color}, ${color}cc)`, borderRadius: '6px' }} />
      </div>
      <p style={{ color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, fontSize: '0.95rem', margin: 0 }}>{desc}</p>
    </div>
  )
}
