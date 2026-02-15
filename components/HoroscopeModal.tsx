'use client'

import { useEffect } from 'react'
import type { HoroscopeWithSign } from '@/lib/types'

interface HoroscopeModalProps {
  horoscope: HoroscopeWithSign
  onClose: () => void
}

export function HoroscopeModal({ horoscope, onClose }: HoroscopeModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const date = new Date(horoscope.horoscope_date)

  return (
    <div className="modal active" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <div className="modal-symbol">{horoscope.zodiac_signs.symbol}</div>
          <h2 className="modal-title">{horoscope.zodiac_signs.name}</h2>
          <p className="modal-date">
            {date.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <div className="horoscope-section">
          <h3>🌟 Today&apos;s Focus</h3>
          <p>{horoscope.todays_focus}</p>
        </div>

        <div className="horoscope-section">
          <h3>💕 Love & Relationships</h3>
          <p>{horoscope.love_forecast}</p>
        </div>

        <div className="horoscope-section">
          <h3>💼 Career & Work</h3>
          <p>{horoscope.career_forecast}</p>
        </div>

        <div className="horoscope-section">
          <h3>💰 Finance</h3>
          <p>{horoscope.finance_forecast}</p>
        </div>

        <div className="horoscope-section">
          <h3>🏃 Health & Wellness</h3>
          <p>{horoscope.health_forecast}</p>
        </div>

        <div className="lucky-items">
          <div className="lucky-item">
            <div className="lucky-label">Lucky Number</div>
            <div className="lucky-value">{horoscope.lucky_number}</div>
          </div>
          <div className="lucky-item">
            <div className="lucky-label">Lucky Color</div>
            <div className="lucky-value">{horoscope.lucky_color}</div>
          </div>
          <div className="lucky-item">
            <div className="lucky-label">Lucky Time</div>
            <div className="lucky-value">{horoscope.lucky_time}</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.8);
          z-index: 1000;
          align-items: center;
          justify-content: center;
        }

        .modal.active {
          display: flex;
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          padding: 40px;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
          animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
          from {
            transform: translateY(-50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .close-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          font-size: 2rem;
          cursor: pointer;
          color: #666;
          background: none;
          border: none;
        }

        .close-btn:hover {
          color: #333;
        }

        .modal-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .modal-symbol {
          font-size: 4rem;
          margin-bottom: 10px;
        }

        .modal-title {
          font-size: 2rem;
          color: #333;
          margin-bottom: 5px;
        }

        .modal-date {
          color: #666;
          font-size: 1rem;
        }

        .horoscope-section {
          margin-bottom: 20px;
        }

        .horoscope-section h3 {
          color: #667eea;
          font-size: 1.2rem;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .horoscope-section p {
          color: #555;
          line-height: 1.6;
        }

        .lucky-items {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-top: 20px;
          padding: 20px;
          background: #f5f5f5;
          border-radius: 10px;
        }

        .lucky-item {
          text-align: center;
        }

        .lucky-label {
          font-size: 0.8rem;
          color: #666;
          margin-bottom: 5px;
        }

        .lucky-value {
          font-size: 1.2rem;
          font-weight: bold;
          color: #667eea;
        }

        @media (max-width: 768px) {
          .modal-content {
            padding: 30px 20px;
          }
          .lucky-items {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
