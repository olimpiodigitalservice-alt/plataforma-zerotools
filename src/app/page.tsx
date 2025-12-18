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
      <div className="flex items-center justify-center min-h-screen bg-[#F9FAFB]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#55C1B3] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#4A4A4A]">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="bg-white border-b border-[#E5E7EB] sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#55C1B3] rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#111111]">
                  ZeroTools
                </h1>
                <p className="text-xs text-[#4A4A4A]">Fitness & Nutrition Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="hover:bg-[#F9FAFB]">
                <Bell className="w-5 h-5 text-[#4A4A4A]" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-[#F9FAFB]">
                <Settings className="w-5 h-5 text-[#4A4A4A]" />
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
            color="bg-[#55C1B3]"
            progress={(stats.calories / 2200) * 100}
          />
          <StatsCard
            title="Hidratação"
            value={`${stats.water_ml}ml`}
            goal={`${stats.water_goal_ml}ml`}
            icon={Droplet}
            color="bg-[#55C1B3]"
            progress={(stats.water_ml / stats.water_goal_ml) * 100}
          />
          <StatsCard
            title="Jejum"
            value={`${stats.fasting_hours}h`}
            goal={`${stats.fasting_goal_hours}h`}
            icon={Clock}
            color="bg-[#55C1B3]"
            progress={(stats.fasting_hours / stats.fasting_goal_hours) * 100}
          />
          <StatsCard
            title="Treinos"
            value={stats.workouts_today}
            icon={Dumbbell}
            color="bg-[#55C1B3]"
          />
        </div>

        {/* Macros Card */}
        <Card className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#111111]">
              <TrendingUp className="w-5 h-5 text-[#55C1B3]" />
              Macronutrientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                <p className="text-2xl font-bold text-[#55C1B3]">{stats.protein}g</p>
                <p className="text-sm text-[#4A4A4A] mt-1">Proteína</p>
              </div>
              <div className="text-center p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                <p className="text-2xl font-bold text-[#55C1B3]">{stats.carbs}g</p>
                <p className="text-sm text-[#4A4A4A] mt-1">Carboidratos</p>
              </div>
              <div className="text-center p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB]">
                <p className="text-2xl font-bold text-[#55C1B3]">{stats.fats}g</p>
                <p className="text-sm text-[#4A4A4A] mt-1">Gorduras</p>
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
              <h2 className="text-2xl font-bold text-[#111111]">Suplementos</h2>
              <p className="text-sm text-[#4A4A4A]">
                {stats.supplements_taken} / {stats.supplements_total} doses hoje
              </p>
            </div>
            <AddSupplementDialog onAdd={handleAddSupplement} />
          </div>

          {supplements.length === 0 ? (
            <Card className="p-12 text-center bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Flame className="w-8 h-8 text-[#55C1B3]" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#111111]">Nenhum suplemento cadastrado</h3>
                <p className="text-[#4A4A4A] mb-6">
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
        <Card className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-[#111111]">
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
                  className="p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-center text-sm font-medium text-[#4A4A4A]"
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
