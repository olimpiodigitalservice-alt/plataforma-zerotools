import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export type Supplement = {
  id: string
  user_id: string
  name: string
  dosage: string
  total_capsules: number
  remaining_capsules: number
  daily_frequency: number
  reminder_times: string[]
  status: 'normal' | 'low' | 'empty'
  created_at: string
  updated_at: string
}

export type SupplementLog = {
  id: string
  user_id: string
  supplement_id: string
  taken_at: string
  created_at: string
}

export type User = {
  id: string
  email: string
  name: string
  created_at: string
}

export type DashboardStats = {
  calories: number
  protein: number
  carbs: number
  fats: number
  water_ml: number
  water_goal_ml: number
  fasting_hours: number
  fasting_goal_hours: number
  workouts_today: number
  supplements_taken: number
  supplements_total: number
  current_streak: number
}
