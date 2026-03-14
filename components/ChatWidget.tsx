'use client'
import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED = [
  "What's my Scorpio horoscope today?",
  "Are Aries and Leo compatible?",
  "What does rising sign mean?",
]

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Namaste! I'm Veda, your cosmic guide ✨ Ask me anything about your zodiac sign, horoscope, or astrology!" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [remaining, setRemaining] = useState<number | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(text?: string) {
    const message = text ?? input.trim()
    if (!message || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: message }])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      const { reply, remaining: rem, rateLimited } = await res.json()
      if (rem !== undefined) setRemaining(rem)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: reply ?? "The cosmos is quiet. Please try again! 🌙"
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "The stars are misaligned right now. Please try again! 🌙"
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          width: 56, height: 56, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6B4EFF, #9B59B6)',
          border: 'none', cursor: 'pointer', fontSize: 22,
          boxShadow: '0 4px 20px rgba(107,78,255,0.5)',
          color: '#fff', display: 'flex', alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {open ? '✕' : '✨'}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 90, right: 24, zIndex: 9998,
          width: 340, height: 500, borderRadius: 16,
          background: '#1a1035',
          border: '1px solid rgba(107,78,255,0.3)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>

          {/* Header */}
          <div style={{
            padding: '14px 16px',
            background: 'linear-gradient(135deg, #6B4EFF, #9B59B6)',
            color: '#fff', fontWeight: 500, fontSize: 14,
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            <span style={{ fontSize: 18 }}>✨</span>
            Veda — VibeZodiac Guide
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: 12,
            display: 'flex', flexDirection: 'column', gap: 10
          }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '8px 12px',
                borderRadius: m.role === 'user'
                  ? '14px 14px 4px 14px'
                  : '14px 14px 14px 4px',
                background: m.role === 'user'
                  ? 'linear-gradient(135deg, #6B4EFF, #9B59B6)'
                  : 'rgba(255,255,255,0.08)',
                color: '#fff',
                fontSize: 13, lineHeight: 1.6
              }}>
                {m.content}
              </div>
            ))}

            {loading && (
              <div style={{
                alignSelf: 'flex-start',
                padding: '8px 12px',
                background: 'rgba(255,255,255,0.08)',
                borderRadius: '14px 14px 14px 4px',
                color: 'rgba(255,255,255,0.6)',
                fontSize: 13
              }}>
                🔮 Reading the cosmos...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested questions — show only at start */}
          {messages.length === 1 && !loading && (
            <div style={{
              padding: '0 12px 8px',
              display: 'flex', flexWrap: 'wrap', gap: 6
            }}>
              {SUGGESTED.map(q => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  style={{
                    fontSize: 11, padding: '4px 10px', borderRadius: 12,
                    border: '1px solid rgba(107,78,255,0.4)',
                    background: 'rgba(107,78,255,0.15)',
                    cursor: 'pointer', color: 'rgba(255,255,255,0.8)'
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Remaining count warning */}
          {remaining !== null && remaining <= 3 && (
            <div style={{
              padding: '4px 12px',
              fontSize: 11,
              textAlign: 'center',
              color: remaining === 0 ? '#ff6b6b' : 'rgba(255,255,255,0.5)'
            }}>
              {remaining === 0
                ? '🌙 Daily limit reached. Come back tomorrow!'
                : `✨ ${remaining} free readings left today`}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: 12,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', gap: 8
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask about your stars..."
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 20,
                border: '1px solid rgba(107,78,255,0.4)',
                background: 'rgba(255,255,255,0.08)',
                color: '#fff', fontSize: 13, outline: 'none'
              }}
            />
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              style={{
                padding: '8px 14px', borderRadius: 20, border: 'none',
                background: 'linear-gradient(135deg, #6B4EFF, #9B59B6)',
                color: '#fff', cursor: 'pointer', fontSize: 13,
                opacity: loading || !input.trim() ? 0.4 : 1
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  )
}
