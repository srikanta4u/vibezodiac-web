'use client'

import { useState } from 'react'
import { HoroscopeModal } from './HoroscopeModal'
import type { HoroscopeWithSign } from '@/lib/types'

interface ZodiacWheelProps {
  horoscopes: HoroscopeWithSign[]
}

const zodiacConfig = [
  { name: 'Aries', symbol: '♈', class: 'aries', angle: 0 },
  { name: 'Taurus', symbol: '♉', class: 'taurus', angle: 30 },
  { name: 'Gemini', symbol: '♊', class: 'gemini', angle: 60 },
  { name: 'Cancer', symbol: '♋', class: 'cancer', angle: 90 },
  { name: 'Leo', symbol: '♌', class: 'leo', angle: 120 },
  { name: 'Virgo', symbol: '♍', class: 'virgo', angle: 150 },
  { name: 'Libra', symbol: '♎', class: 'libra', angle: 180 },
  { name: 'Scorpio', symbol: '♏', class: 'scorpio', angle: 210 },
  { name: 'Sagittarius', symbol: '♐', class: 'sagittarius', angle: 240 },
  { name: 'Capricorn', symbol: '♑', class: 'capricorn', angle: 270 },
  { name: 'Aquarius', symbol: '♒', class: 'aquarius', angle: 300 },
  { name: 'Pisces', symbol: '♓', class: 'pisces', angle: 330 }
]

export function ZodiacWheel({ horoscopes }: ZodiacWheelProps) {
  const [selectedHoroscope, setSelectedHoroscope] = useState<HoroscopeWithSign | null>(null)

  const handleSignClick = (signName: string) => {
    const horoscope = horoscopes.find(h => h.zodiac_signs.name === signName)
    if (horoscope) {
      setSelectedHoroscope(horoscope)
    }
  }

  const today = new Date()

  return (
    <>
      <div className="wheel-container">
        <div className="wheel">
          {zodiacConfig.map((sign) => (
            <div
              key={sign.name}
              className={`zodiac-slice ${sign.class}`}
              style={{ transform: `rotate(${sign.angle}deg)` }}
              onClick={() => handleSignClick(sign.name)}
            >
              <div 
                className="zodiac-content"
                style={{ transform: `rotate(${-sign.angle + 15}deg)` }}
              >
                <div className="zodiac-symbol">{sign.symbol}</div>
                <div className="zodiac-name">{sign.name}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="center-circle">
          <div className="center-text">Today</div>
          <div className="center-date">
            {today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>

      {selectedHoroscope && (
        <HoroscopeModal
          horoscope={selectedHoroscope}
          onClose={() => setSelectedHoroscope(null)}
        />
      )}

      <style jsx>{`
        .wheel-container {
          position: relative;
          width: 600px;
          height: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 50%;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          padding: 20px;
        }

        .wheel {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
        }

        .zodiac-slice {
          position: absolute;
          width: 50%;
          height: 50%;
          transform-origin: 100% 100%;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          clip-path: polygon(100% 100%, 0% 100%, 50% 0%);
        }

        .zodiac-slice:hover {
          filter: brightness(1.2);
          transform: scale(1.05);
          z-index: 10;
        }

        .zodiac-content {
          position: absolute;
          top: 30%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          pointer-events: none;
        }

        .zodiac-symbol {
          font-size: 2.5rem;
          margin-bottom: 5px;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
        }

        .zodiac-name {
          font-size: 0.9rem;
          font-weight: bold;
          text-transform: uppercase;
          color: rgba(0,0,0,0.8);
          letter-spacing: 1px;
        }

        .aries { background: linear-gradient(135deg, #ff416c, #ff4b2b); }
        .taurus { background: linear-gradient(135deg, #56ab2f, #a8e063); }
        .gemini { background: linear-gradient(135deg, #f7971e, #ffd200); }
        .cancer { background: linear-gradient(135deg, #e0e0e0, #ffffff); }
        .leo { background: linear-gradient(135deg, #ff8008, #ffc837); }
        .virgo { background: linear-gradient(135deg, #8b7355, #d4a574); }
        .libra { background: linear-gradient(135deg, #ff6b9d, #c06c84); }
        .scorpio { background: linear-gradient(135deg, #8e0e00, #1f1c18); }
        .sagittarius { background: linear-gradient(135deg, #8e2de2, #4a00e0); }
        .capricorn { background: linear-gradient(135deg, #2c3e50, #34495e); }
        .aquarius { background: linear-gradient(135deg, #00c6ff, #0072ff); }
        .pisces { background: linear-gradient(135deg, #5ee7df, #b490ca); }

        .center-circle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 200px;
          height: 200px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          color: white;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          z-index: 100;
        }

        .center-text {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 5px;
        }

        .center-date {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        @media (max-width: 768px) {
          .wheel-container {
            width: 90vw;
            height: 90vw;
            max-width: 400px;
            max-height: 400px;
          }
          .zodiac-symbol { font-size: 1.5rem; }
          .zodiac-name { font-size: 0.7rem; }
          .center-circle {
            width: 120px;
            height: 120px;
          }
          .center-text { font-size: 1rem; }
        }
      `}</style>
    </>
  )
}
