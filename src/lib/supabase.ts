import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================
// DATABASE TYPES - ZeroTools Schema
// ============================================

export type User = {
  id: string
  email: string
  name: string
  created_at: string
}

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

export type ProgressPhoto = {
  id: string
  user_id: string
  photo_url: string
  photo_type: 'before' | 'after' | 'progress'
  date: string
  weight?: number
  notes?: string
  created_at: string
}

export type NutritionLog = {
  id: string
  user_id: string
  date: string
  calories: number
  protein: number
  carbs: number
  fats: number
  created_at: string
}

export type WaterLog = {
  id: string
  user_id: string
  date: string
  amount_ml: number
  created_at: string
}

export type FastingLog = {
  id: string
  user_id: string
  start_time: string
  end_time?: string
  duration_hours?: number
  created_at: string
}

export type WorkoutLog = {
  id: string
  user_id: string
  date: string
  workout_type: string
  duration_minutes: number
  notes?: string
  created_at: string
}

export type Streak = {
  id: string
  user_id: string
  streak_type: string
  current_count: number
  best_count: number
  last_updated: string
  created_at: string
}

export type Notification = {
  id: string
  user_id: string
  title: string
  message: string
  type: 'supplement' | 'water' | 'workout' | 'achievement' | 'system'
  read: boolean
  created_at: string
}

// ============================================
// DASHBOARD STATS TYPE
// ============================================

export type DashboardStats = {
  calories: number
  calories_goal: number
  protein: number
  protein_goal: number
  carbs: number
  carbs_goal: number
  fats: number
  fats_goal: number
  water_ml: number
  water_goal_ml: number
  fasting_hours: number
  fasting_goal_hours: number
  workouts_today: number
  supplements_taken: number
  supplements_total: number
  current_streak: number
}

// ============================================
// DATABASE HELPER FUNCTIONS
// ============================================

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data as User
}

export async function getSupplements(userId: string) {
  const { data, error } = await supabase
    .from('supplements')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Supplement[]
}

export async function addSupplement(supplement: Omit<Supplement, 'id' | 'created_at' | 'updated_at' | 'status'>) {
  const { data, error } = await supabase
    .from('supplements')
    .insert([supplement])
    .select()
    .single()
  
  if (error) throw error
  return data as Supplement
}

export async function logSupplementTaken(supplementId: string, userId: string) {
  // Log the supplement taken
  const { error: logError } = await supabase
    .from('supplement_logs')
    .insert([{
      supplement_id: supplementId,
      user_id: userId,
      taken_at: new Date().toISOString()
    }])
  
  if (logError) throw logError

  // Update remaining capsules
  const { data: supplement } = await supabase
    .from('supplements')
    .select('remaining_capsules')
    .eq('id', supplementId)
    .single()

  if (supplement && supplement.remaining_capsules > 0) {
    const { error: updateError } = await supabase
      .from('supplements')
      .update({ remaining_capsules: supplement.remaining_capsules - 1 })
      .eq('id', supplementId)
    
    if (updateError) throw updateError
  }
}

export async function getTodaySupplementLogs(userId: string) {
  const today = new Date().toISOString().split('T')[0]
  
  const { data, error } = await supabase
    .from('supplement_logs')
    .select('*, supplements(*)')
    .eq('user_id', userId)
    .gte('taken_at', `${today}T00:00:00`)
    .lte('taken_at', `${today}T23:59:59`)
  
  if (error) throw error
  return data
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const today = new Date().toISOString().split('T')[0]
  
  // Get nutrition data
  const { data: nutrition } = await supabase
    .from('nutrition_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single()

  // Get water data
  const { data: water } = await supabase
    .from('water_logs')
    .select('amount_ml')
    .eq('user_id', userId)
    .eq('date', today)

  // Get fasting data
  const { data: fasting } = await supabase
    .from('fasting_logs')
    .select('*')
    .eq('user_id', userId)
    .is('end_time', null)
    .single()

  // Get workout data
  const { data: workouts } = await supabase
    .from('workout_logs')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)

  // Get supplements data
  const { data: supplements } = await supabase
    .from('supplements')
    .select('*')
    .eq('user_id', userId)

  const { data: supplementLogs } = await supabase
    .from('supplement_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('taken_at', `${today}T00:00:00`)
    .lte('taken_at', `${today}T23:59:59`)

  // Get streak data
  const { data: streak } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .eq('streak_type', 'overall')
    .single()

  const totalWater = water?.reduce((sum, log) => sum + log.amount_ml, 0) || 0
  const fastingHours = fasting?.start_time 
    ? (new Date().getTime() - new Date(fasting.start_time).getTime()) / (1000 * 60 * 60)
    : 0

  return {
    calories: nutrition?.calories || 0,
    calories_goal: 2000,
    protein: nutrition?.protein || 0,
    protein_goal: 150,
    carbs: nutrition?.carbs || 0,
    carbs_goal: 200,
    fats: nutrition?.fats || 0,
    fats_goal: 60,
    water_ml: totalWater,
    water_goal_ml: 2000,
    fasting_hours: Math.floor(fastingHours * 10) / 10,
    fasting_goal_hours: 16,
    workouts_today: workouts?.length || 0,
    supplements_taken: supplementLogs?.length || 0,
    supplements_total: supplements?.reduce((sum, s) => sum + s.daily_frequency, 0) || 0,
    current_streak: streak?.current_count || 0
  }
}
