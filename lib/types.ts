export interface ZodiacSign {
  id: string
  name: string
  slug: string
  symbol: string
  element: 'fire' | 'earth' | 'air' | 'water'
  sort_order: number
}

export interface DailyHoroscope {
  id: string
  zodiac_sign_id: string
  horoscope_date: string
  todays_focus: string
  love_forecast: string
  career_forecast: string
  finance_forecast: string
  health_forecast: string
  lucky_number: number
  lucky_color: string
  lucky_time: string
  overall_rating: number
}

export interface HoroscopeWithSign extends DailyHoroscope {
  zodiac_signs: ZodiacSign
}
