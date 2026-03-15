import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ywovuuomfblorpdwbyks.supabase.co'

const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || ''
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

function chunkText(text, size = 200, overlap = 20) {
  const words = text.split(' ')
  const chunks = []
  for (let i = 0; i < words.length; i += size - overlap) {
    chunks.push(words.slice(i, i + size).join(' '))
    if (i + size >= words.length) break
  }
  return chunks
}

async function embedTexts(texts) {
  const res = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ model: 'text-embedding-3-small', input: texts })
  })
  const data = await res.json()
  if (!data.data) {
    console.error('Embedding error:', data)
    throw new Error('Embedding failed')
  }
  return data.data.map(d => d.embedding)
}

async function ingest(sourceType, title, content, metadata = {}) {
  // Check if already ingested
  const { data: existing } = await supabase
    .from('documents')
    .select('id')
    .eq('title', title)
    .single()

  if (existing) {
    console.log(`  Skipping (already exists): ${title}`)
    return
  }

  const { data: doc, error } = await supabase
    .from('documents')
    .insert({ source_type: sourceType, title, content, metadata })
    .select()
    .single()

  if (error) {
    console.error(`  Insert error for ${title}:`, error.message)
    return
  }

  const chunks = chunkText(content)
  const embeddings = await embedTexts(chunks)

  await supabase.from('document_embeddings').insert(
    chunks.map((chunk, i) => ({
      document_id: doc.id,
      chunk_index: i,
      chunk_text: chunk,
      embedding: embeddings[i]
    }))
  )
  console.log(`  ✓ ${title} (${chunks.length} chunks)`)
}

async function ingestHoroscopes() {
  console.log('\nIngesting horoscopes...')
  const { data: horoscopes } = await supabase
    .from('daily_horoscopes')
    .select('*, zodiac_signs(name)')
    .order('horoscope_date', { ascending: false })
    .limit(120)

  for (const h of horoscopes ?? []) {
    const content = `${h.zodiac_signs.name} horoscope for ${h.horoscope_date}. Focus: ${h.todays_focus} Love: ${h.love_forecast} Career: ${h.career_forecast} Finance: ${h.finance_forecast} Health: ${h.health_forecast} Lucky number: ${h.lucky_number}. Lucky color: ${h.lucky_color}. Lucky time: ${h.lucky_time}. Overall rating: ${h.overall_rating}/5.`
    await ingest('horoscope', `${h.zodiac_signs.name} ${h.horoscope_date}`, content, {
      sign: h.zodiac_signs.name,
      date: h.horoscope_date
    })
  }
}

async function ingestZodiacSigns() {
  console.log('\nIngesting zodiac signs...')
  const { data: signs } = await supabase.from('zodiac_signs').select('*')

  for (const s of signs ?? []) {
    const content = `${s.name} is a ${s.element} sign. Symbol: ${s.symbol ?? s.name}. ${s.description ?? ''}`
    await ingest('zodiac_sign', `${s.name} zodiac sign description`, content, {
      sign: s.name,
      element: s.element
    })
  }
}

async function main() {
  console.log('Starting VibeZodiac content ingestion...')
  await ingestHoroscopes()
  await ingestZodiacSigns()
  console.log('\nIngestion complete! ✅')
  console.log('Your chatbot now has VibeZodiac content to answer from.')
}

main().catch(console.error)
