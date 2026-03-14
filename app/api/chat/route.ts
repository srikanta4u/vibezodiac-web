import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'
import crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const MAX_MESSAGES_PER_DAY = 10
const CACHE_TTL_MS = 1000 * 60 * 60
const MAX_INPUT_LENGTH = 300
const MAX_CHUNKS = 5
const MATCH_THRESHOLD = 0.50

const responseCache = new Map<string, { reply: string; ts: number }>()

const ASTROLOGY_KEYWORDS = [
  'zodiac','astrology','horoscope','sign','aries','taurus','gemini',
  'cancer','leo','virgo','libra','scorpio','sagittarius','capricorn',
  'aquarius','pisces','planet','mercury','venus','mars','jupiter',
  'saturn','neptune','uranus','moon','sun','rising','ascendant',
  'natal','birth chart','vedic','compatibility','forecast','lucky',
  'vibezodiac','kundli','retrograde','transit','house','element',
  'fire sign','water sign','earth sign','air sign','cusp','decan',
  'love','career','finance','health','today','tomorrow','weekly',
  'monthly','prediction','veda','cosmic','celestial','spiritual'
]

function isAstrologyQuestion(query: string): boolean {
  const lower = query.toLowerCase()
  return ASTROLOGY_KEYWORDS.some(keyword => lower.includes(keyword))
}

async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
  const ipHash = crypto.createHash('sha256').update(ip).digest('hex')
  const today = new Date().toISOString().split('T')[0]

  const { data } = await supabase
    .from('chat_rate_limits')
    .select('count, date')
    .eq('ip_hash', ipHash)
    .single()

  if (!data || data.date !== today) {
    await supabase
      .from('chat_rate_limits')
      .upsert({ ip_hash: ipHash, count: 1, date: today })
    return { allowed: true, remaining: MAX_MESSAGES_PER_DAY - 1 }
  }

  if (data.count >= MAX_MESSAGES_PER_DAY) {
    return { allowed: false, remaining: 0 }
  }

  await supabase
    .from('chat_rate_limits')
    .update({ count: data.count + 1 })
    .eq('ip_hash', ipHash)

  return { allowed: true, remaining: MAX_MESSAGES_PER_DAY - data.count - 1 }
}

async function embedQuery(text: string): Promise<number[]> {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text
    })
  })
  const data = await res.json()
  return data.data[0].embedding
}

async function retrieveContext(embedding: number[]): Promise<string> {
  const { data: chunks } = await supabase.rpc('match_documents', {
    query_embedding: embedding,
    match_threshold: MATCH_THRESHOLD,
    match_count: MAX_CHUNKS
  })

  if (!chunks || chunks.length === 0) return ''

  return chunks
    .map((c: any) => c.chunk_text.split(' ').slice(0, 200).join(' '))
    .join('\n---\n')
}

async function generateAnswer(context: string, question: string): Promise<string> {
  const systemPrompt = `You are Veda, VibeZodiac's astrology guide.
RULES:
- Answer ONLY from the context provided. Never use outside knowledge.
- If context is empty say: "I don't have VibeZodiac content on that yet. Check vibezodiac.com! ✨"
- Only discuss astrology, zodiac signs, horoscopes, VibeZodiac features.
- Decline unrelated questions warmly.
- Keep answers to 2-3 sentences. Be warm and mystical.`

  const userMessage = context
    ? `VibeZodiac content:\n${context}\n\nQuestion: ${question}`
    : `Question: ${question}`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 250,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    })
  })

  const data = await res.json()
  return data.content?.[0]?.text ?? "The cosmos is quiet right now. Please try again! 🌙"
}

async function saveChatHistory(sessionId: string, message: string, reply: string): Promise<void> {
  await supabase.from('chat_messages').insert([
    { session_id: sessionId, role: 'user', content: message },
    { session_id: sessionId, role: 'assistant', content: reply }
  ])
}

export async function POST(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for')
  const realIp = req.headers.get('x-real-ip')
  const ip = (forwarded?.split(',')[0] ?? realIp ?? 'unknown').trim()

  const { allowed, remaining } = await checkRateLimit(ip)

  if (!allowed) {
    return Response.json({
      reply: "🌙 You've used your 10 free cosmic readings for today! Come back tomorrow. ✨",
      rateLimited: true,
      remaining: 0
    }, { status: 429 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }

  const raw = (body?.message ?? '').toString().trim()
  if (!raw) {
    return Response.json({ error: 'Empty message' }, { status: 400 })
  }

  const message = raw.slice(0, MAX_INPUT_LENGTH).replace(/<[^>]*>/g, '')

  if (!isAstrologyQuestion(message)) {
    return Response.json({
      reply: "I'm Veda, your cosmic guide! ✨ I specialize in astrology and horoscopes. Ask me about your zodiac sign, compatibility, or today's horoscope!",
      remaining
    })
  }

  const cacheKey = message.toLowerCase()
  const cached = responseCache.get(cacheKey)
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    return Response.json({ reply: cached.reply, remaining, fromCache: true })
  }

  let embedding: number[]
  try {
    embedding = await embedQuery(message)
  } catch {
    return Response.json({
      reply: "The stars are misaligned right now. Please try again! 🌙",
      remaining
    })
  }

  const context = await retrieveContext(embedding)

  if (!context) {
    return Response.json({
      reply: "I don't have VibeZodiac content on that topic yet. Visit vibezodiac.com for your daily horoscope, Kundli, and compatibility! ✨",
      remaining
    })
  }

  const reply = await generateAnswer(context, message)

  responseCache.set(cacheKey, { reply, ts: Date.now() })

  const sessionId = body?.sessionId
  if (sessionId) {
    saveChatHistory(sessionId, message, reply).catch(() => {})
  }

  return Response.json({ reply, remaining })
}
