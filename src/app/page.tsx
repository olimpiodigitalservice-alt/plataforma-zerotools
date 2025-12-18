"use client"

import { useEffect, useState } from 'react'
import { supabase, Supplement, SupplementLog, DashboardStats } from '@/lib/supabase'
import { StatsCard } from '@/components/dashboard/stats-card'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { StreakBadge } from '@/components/dashboard/streak-badge'
import { SupplementCard } from '@/components/supplements/supplement-card'
import { AddSupplementDialog } from '@/components/supplements/add-supplement-dialog'
import { 
  Flame, 
  Droplet, 
  Utensils, 
  Clock, 
  Dumbbell,
  TrendingUp,
  Bell,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function Home() {
  const [supplements, setSupplements] = useState<Supplement[]>([])
  const [supplementLogs, setSupplementLogs] = useState<SupplementLog[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    calories: 1850,
    protein: 145,
    carbs: 180,
    fats: 65,
    water_ml: 2000,
    water_goal_ml: 3000,
    fasting_hours: 14,
    fasting_goal_hours: 16,
    workouts_today: 1,
    supplements_taken: 0,
    supplements_total: 0,
    current_streak: 7
  })
  const [loading, setLoading] = useState(true)

  // Mock user ID (replace with real auth)
  const userId = 'demo-user-123'

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load supplements
      const { data: supplementsData, error: supplementsError } = await supabase
        .from('supplements')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (supplementsError) throw supplementsError

      // Load today's logs
      const today = format(new Date(), 'yyyy-MM-dd')
      const { data: logsData, error: logsError } = await supabase
        .from('supplement_logs')
        .select('*')
        .eq('user_id', userId)
        .gte('taken_at', `${today}T00:00:00`)
        .lte('taken_at', `${today}T23:59:59`)

      if (logsError) throw logsError

      setSupplements(supplementsData || [])
      setSupplementLogs(logsData || [])
      
      // Update stats
      setStats(prev => ({
        ...prev,
        supplements_taken: logsData?.length || 0,
        supplements_total: supplementsData?.reduce((sum, s) => sum + s.daily_frequency, 0) || 0
      }))
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSupplement = async (data: any) => {
    try {
      const { error } = await supabase
        .from('supplements')
        .insert([{
          user_id: userId,
          name: data.name,
          dosage: data.dosage,
          total_capsules: data.total_capsules,
          remaining_capsules: data.total_capsules,
          daily_frequency: data.daily_frequency,
          reminder_times: data.reminder_times,
          status: 'normal'
        }])

      if (error) throw error
      
      await loadData()
      toast.success('Suplemento adicionado!')
    } catch (error) {
      console.error('Error adding supplement:', error)
      throw error
    }
  }

  const handleTakeSupplement = async (supplementId: string) => {
    try {
      // Add log
      const { error: logError } = await supabase
        .from('supplement_logs')
        .insert([{
          user_id: userId,
          supplement_id: supplementId,
          taken_at: new Date().toISOString()
        }])

      if (logError) throw logError

      // Update remaining capsules
      const supplement = supplements.find(s => s.id === supplementId)
      if (supplement) {
        const { error: updateError } = await supabase
          .from('supplements')
          .update({ 
            remaining_capsules: supplement.remaining_capsules - 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', supplementId)

        if (updateError) throw updateError
      }

      await loadData()
      toast.success('Suplemento registrado! 💊')
    } catch (error) {
      console.error('Error taking supplement:', error)
      toast.error('Erro ao registrar suplemento')
    }
  }

  const handleQuickAction = (action: string) => {
    toast.info(`Funcionalidade "${action}" em desenvolvimento`)
  }

  const getTodayLogs = (supplementId: string) => {
    return supplementLogs.filter(log => log.supplement_id === supplementId).length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b sticky top-0 z-50 backdrop-blur-sm bg-white/80 dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ZeroTools
                </h1>
                <p className="text-xs text-muted-foreground">Fitness & Nutrition Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Streak Badge */}
        <StreakBadge count={stats.current_streak} type="Geral" />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Calorias"
            value={stats.calories}
            goal={2200}
            icon={Utensils}
            color="bg-emerald-500"
            progress={(stats.calories / 2200) * 100}
          />
          <StatsCard
            title="Hidratação"
            value={`${stats.water_ml}ml`}
            goal={`${stats.water_goal_ml}ml`}
            icon={Droplet}
            color="bg-blue-500"
            progress={(stats.water_ml / stats.water_goal_ml) * 100}
          />
          <StatsCard
            title="Jejum"
            value={`${stats.fasting_hours}h`}
            goal={`${stats.fasting_goal_hours}h`}
            icon={Clock}
            color="bg-amber-500"
            progress={(stats.fasting_hours / stats.fasting_goal_hours) * 100}
          />
          <StatsCard
            title="Treinos"
            value={stats.workouts_today}
            icon={Dumbbell}
            color="bg-orange-500"
          />
        </div>

        {/* Macros Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              Macronutrientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.protein}g</p>
                <p className="text-sm text-muted-foreground mt-1">Proteína</p>
              </div>
              <div className="text-center p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.carbs}g</p>
                <p className="text-sm text-muted-foreground mt-1">Carboidratos</p>
              </div>
              <div className="text-center p-4 bg-rose-50 dark:bg-rose-950/20 rounded-lg">
                <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{stats.fats}g</p>
                <p className="text-sm text-muted-foreground mt-1">Gorduras</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <QuickActions onAction={handleQuickAction} />

        {/* Supplements Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Suplementos</h2>
              <p className="text-sm text-muted-foreground">
                {stats.supplements_taken} / {stats.supplements_total} doses hoje
              </p>
            </div>
            <AddSupplementDialog onAdd={handleAddSupplement} />
          </div>

          {supplements.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-950/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Flame className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Nenhum suplemento cadastrado</h3>
                <p className="text-muted-foreground mb-6">
                  Adicione seus suplementos para começar a controlar seu consumo diário
                </p>
                <AddSupplementDialog onAdd={handleAddSupplement} />
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {supplements.map((supplement) => (
                <SupplementCard
                  key={supplement.id}
                  supplement={supplement}
                  todayLogs={getTodayLogs(supplement.id)}
                  onTake={handleTakeSupplement}
                  onEdit={() => toast.info('Edição em desenvolvimento')}
                />
              ))}
            </div>
          )}
        </div>

        {/* Coming Soon Modules */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="text-purple-900 dark:text-purple-100">
              🚀 Próximos Módulos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                '📸 Progresso Visual',
                '🍽️ Nutrição Completa',
                '💪 Treinos',
                '⏱️ Jejum Intermitente',
                '💧 Hidratação Avançada',
                '🤖 Coach IA',
                '🏆 Conquistas',
                '📊 Relatórios'
              ].map((module) => (
                <div
                  key={module}
                  className="p-3 bg-white dark:bg-slate-900 rounded-lg text-center text-sm font-medium"
                >
                  {module}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
