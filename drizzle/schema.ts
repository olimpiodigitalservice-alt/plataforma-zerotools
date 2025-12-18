/**
 * ZeroTools - Drizzle ORM Schema
 * Complete database schema for MySQL/TiDB
 * 
 * This schema defines all tables for:
 * - Authentication & User Profiles
 * - Nutrition Tracking
 * - Workout Logs
 * - Progress Photos (Before/After)
 * - Hydration
 * - Intermittent Fasting
 * - Supplements/Capsules Control
 * - AI Coaching
 * - Gamification (Streaks & Achievements)
 * - Subscriptions
 * - Notifications
 */

import { mysqlTable, varchar, int, decimal, datetime, text, boolean, json, uniqueIndex, index } from 'drizzle-orm/mysql-core'
import { relations } from 'drizzle-orm'

// ============================================
// AUTHENTICATION & PROFILE
// ============================================

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey(),
  openId: varchar('open_id', { length: 255 }),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  role: varchar('role', { length: 50 }).default('user').notNull(),
  createdAt: datetime('created_at').notNull().defaultNow(),
}, (table) => ({
  emailIdx: index('email_idx').on(table.email),
}))

export const userProfiles = mysqlTable('user_profiles', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  age: int('age'),
  gender: varchar('gender', { length: 20 }),
  height: decimal('height', { precision: 5, scale: 2 }), // in cm
  currentWeight: decimal('current_weight', { precision: 5, scale: 2 }), // in kg
  targetWeight: decimal('target_weight', { precision: 5, scale: 2 }), // in kg
  goal: varchar('goal', { length: 100 }), // lose_weight, gain_muscle, maintain, etc
  fitnessExperience: varchar('fitness_experience', { length: 50 }), // beginner, intermediate, advanced
  onboardingCompleted: boolean('onboarding_completed').default(false).notNull(),
  isPro: boolean('is_pro').default(false).notNull(),
  createdAt: datetime('created_at').notNull().defaultNow(),
  updatedAt: datetime('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: uniqueIndex('user_id_idx').on(table.userId),
}))

// ============================================
// NUTRITION
// ============================================

export const dailyGoals = mysqlTable('daily_goals', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: datetime('date').notNull(),
  caloriesTarget: int('calories_target').notNull().default(2000),
  caloriesConsumed: int('calories_consumed').notNull().default(0),
  carbsTarget: int('carbs_target').notNull().default(200),
  carbsConsumed: int('carbs_consumed').notNull().default(0),
  proteinTarget: int('protein_target').notNull().default(150),
  proteinConsumed: int('protein_consumed').notNull().default(0),
  fatTarget: int('fat_target').notNull().default(60),
  fatConsumed: int('fat_consumed').notNull().default(0),
  waterTarget: int('water_target').notNull().default(2000), // ml
  waterConsumed: int('water_consumed').notNull().default(0), // ml
  createdAt: datetime('created_at').notNull().defaultNow(),
}, (table) => ({
  userDateIdx: uniqueIndex('user_date_idx').on(table.userId, table.date),
}))

export const meals = mysqlTable('meals', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: datetime('date').notNull(),
  mealType: varchar('meal_type', { length: 50 }).notNull(), // breakfast, lunch, dinner, snack
  foodName: varchar('food_name', { length: 255 }).notNull(),
  calories: int('calories').notNull(),
  carbs: int('carbs').notNull(),
  protein: int('protein').notNull(),
  fat: int('fat').notNull(),
  servingSize: varchar('serving_size', { length: 100 }),
  createdAt: datetime('created_at').notNull().defaultNow(),
}, (table) => ({
  userDateIdx: index('user_date_idx').on(table.userId, table.date),
}))

export const favoriteMeals = mysqlTable('favorite_meals', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  foodName: varchar('food_name', { length: 255 }).notNull(),
  calories: int('calories').notNull(),
  carbs: int('carbs').notNull(),
  protein: int('protein').notNull(),
  fat: int('fat').notNull(),
  timesUsed: int('times_used').notNull().default(0),
  lastUsedAt: datetime('last_used_at'),
  createdAt: datetime('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('user_id_idx').on(table.userId),
}))

// ============================================
// WORKOUTS
// ============================================

export const exercises = mysqlTable('exercises', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(), // strength, cardio, flexibility, etc
  muscleGroup: varchar('muscle_group', { length: 100 }), // chest, back, legs, etc
  equipment: varchar('equipment', { length: 100 }), // barbell, dumbbell, bodyweight, etc
  difficulty: varchar('difficulty', { length: 50 }), // beginner, intermediate, advanced
  instructions: text('instructions'),
  videoUrl: varchar('video_url', { length: 500 }),
  createdAt: datetime('created_at').notNull().defaultNow(),
}, (table) => ({
  categoryIdx: index('category_idx').on(table.category),
  muscleGroupIdx: index('muscle_group_idx').on(table.muscleGroup),
}))

export const workoutLogs = mysqlTable('workout_logs', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  exerciseId: varchar('exercise_id', { length: 36 }).references(() => exercises.id, { onDelete: 'set null' }),
  date: datetime('date').notNull(),
  sets: int('sets'),
  reps: int('reps'),
  weight: decimal('weight', { precision: 6, scale: 2 }), // in kg
  duration: int('duration'), // in minutes
  notes: text('notes'),
  createdAt: datetime('created_at').notNull().defaultNow(),
}, (table) => ({
  userDateIdx: index('user_date_idx').on(table.userId, table.date),
}))

// ============================================
// PROGRESS PHOTOS - BEFORE & AFTER
// ============================================

export const progressPhotos = mysqlTable('progress_photos', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  photoUrl: varchar('photo_url', { length: 500 }).notNull(),
  photoType: varchar('photo_type', { length: 20 }).notNull(), // before, after, progress
  date: datetime('date').notNull(),
  weight: decimal('weight', { precision: 5, scale: 2 }), // in kg
  notes: text('notes'),
  createdAt: datetime('created_at').notNull().defaultNow(),
}, (table) => ({
  userDateIdx: index('user_date_idx').on(table.userId, table.date),
  userTypeIdx: index('user_type_idx').on(table.userId, table.photoType),
}))

// ============================================
// BODY MEASUREMENTS
// ============================================

export const bodyMeasurements = mysqlTable('body_measurements', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: datetime('date').notNull(),
  weight: decimal('weight', { precision: 5, scale: 2 }), // in kg
  waist: decimal('waist', { precision: 5, scale: 2 }), // in cm
  hips: decimal('hips', { precision: 5, scale: 2 }), // in cm
  chest: decimal('chest', { precision: 5, scale: 2 }), // in cm
  arms: decimal('arms', { precision: 5, scale: 2 }), // in cm
  legs: decimal('legs', { precision: 5, scale: 2 }), // in cm
  bodyFat: decimal('body_fat', { precision: 4, scale: 2 }), // percentage
  createdAt: datetime('created_at').notNull().defaultNow(),
}, (table) => ({
  userDateIdx: index('user_date_idx').on(table.userId, table.date),
}))

// ============================================
// HYDRATION & GAMIFICATION
// ============================================

export const streaks = mysqlTable('streaks', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 50 }).notNull(), // overall, nutrition, workout, water, supplements
  currentStreak: int('current_streak').notNull().default(0),
  longestStreak: int('longest_streak').notNull().default(0),
  lastUpdated: datetime('last_updated').notNull(),
  createdAt: datetime('created_at').notNull().defaultNow(),
}, (table) => ({
  userTypeIdx: uniqueIndex('user_type_idx').on(table.userId, table.type),
}))

export const achievements = mysqlTable('achievements', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 100 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  iconUrl: varchar('icon_url', { length: 500 }),
  unlockedAt: datetime('unlocked_at').notNull(),
  createdAt: datetime('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('user_id_idx').on(table.userId),
}))

// ============================================
// INTERMITTENT FASTING
// ============================================

export const fastingSessions = mysqlTable('fasting_sessions', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  planType: varchar('plan_type', { length: 50 }).notNull(), // 16:8, 18:6, 20:4, etc
  targetHours: int('target_hours').notNull(),
  startTime: datetime('start_time').notNull(),
  endTime: datetime('end_time'),
  completed: boolean('completed').default(false).notNull(),
  createdAt: datetime('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('user_id_idx').on(table.userId),
}))

// ============================================
// SUPPLEMENTS / CAPSULES
// ============================================

export const supplements = mysqlTable('supplements', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  totalCapsules: int('total_capsules').notNull(),
  remainingCapsules: int('remaining_capsules').notNull(),
  capsulesPerDay: int('capsules_per_day').notNull().default(1),
  startDate: datetime('start_date').notNull(),
  reminderTime: varchar('reminder_time', { length: 10 }), // HH:MM format
  status: varchar('status', { length: 20 }).notNull().default('normal'), // normal, low, empty
  createdAt: datetime('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('user_id_idx').on(table.userId),
}))

export const supplementLogs = mysqlTable('supplement_logs', {
  id: varchar('id', { length: 36 }).primaryKey(),
  supplementId: varchar('supplement_id', { length: 36 }).notNull().references(() => supplements.id, { onDelete: 'cascade' }),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  date: datetime('date').notNull(),
  capsulesTaken: int('capsules_taken').notNull().default(1),
  createdAt: datetime('created_at').notNull().defaultNow(),
}, (table) => ({
  supplementDateIdx: uniqueIndex('supplement_date_idx').on(table.supplementId, table.date),
  userIdIdx: index('user_id_idx').on(table.userId),
}))

// ============================================
// AI & COMMUNICATION
// ============================================

export const aiChatHistory = mysqlTable('ai_chat_history', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 20 }).notNull(), // user, assistant
  message: text('message').notNull(),
  timestamp: datetime('timestamp').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('user_id_idx').on(table.userId),
}))

// ============================================
// NOTIFICATIONS
// ============================================

export const notificationSettings = mysqlTable('notification_settings', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  waterEnabled: boolean('water_enabled').default(true).notNull(),
  supplementEnabled: boolean('supplement_enabled').default(true).notNull(),
  workoutEnabled: boolean('workout_enabled').default(true).notNull(),
  reminderTimes: json('reminder_times'), // Array of time strings
  createdAt: datetime('created_at').notNull().defaultNow(),
  updatedAt: datetime('updated_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: uniqueIndex('user_id_idx').on(table.userId),
}))

// ============================================
// SUBSCRIPTIONS
// ============================================

export const subscriptions = mysqlTable('subscriptions', {
  id: varchar('id', { length: 36 }).primaryKey(),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  plan: varchar('plan', { length: 50 }).notNull(), // free, trial, weekly, lifetime
  status: varchar('status', { length: 50 }).notNull(), // active, cancelled, expired
  startDate: datetime('start_date').notNull(),
  endDate: datetime('end_date'),
  createdAt: datetime('created_at').notNull().defaultNow(),
}, (table) => ({
  userIdIdx: index('user_id_idx').on(table.userId),
}))

// ============================================
// RELATIONS
// ============================================

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  dailyGoals: many(dailyGoals),
  meals: many(meals),
  favoriteMeals: many(favoriteMeals),
  workoutLogs: many(workoutLogs),
  progressPhotos: many(progressPhotos),
  bodyMeasurements: many(bodyMeasurements),
  streaks: many(streaks),
  achievements: many(achievements),
  fastingSessions: many(fastingSessions),
  supplements: many(supplements),
  supplementLogs: many(supplementLogs),
  aiChatHistory: many(aiChatHistory),
  notificationSettings: one(notificationSettings, {
    fields: [users.id],
    references: [notificationSettings.userId],
  }),
  subscriptions: many(subscriptions),
}))

export const supplementsRelations = relations(supplements, ({ one, many }) => ({
  user: one(users, {
    fields: [supplements.userId],
    references: [users.id],
  }),
  logs: many(supplementLogs),
}))

export const workoutLogsRelations = relations(workoutLogs, ({ one }) => ({
  user: one(users, {
    fields: [workoutLogs.userId],
    references: [users.id],
  }),
  exercise: one(exercises, {
    fields: [workoutLogs.exerciseId],
    references: [exercises.id],
  }),
}))
