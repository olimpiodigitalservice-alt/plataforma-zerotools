"use client"

import { Supplement } from '@/lib/supabase'
import { Pill, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface SupplementCardProps {
  supplement: Supplement
  todayLogs: number
  onTake: (id: string) => void
  onEdit: (supplement: Supplement) => void
}

export function SupplementCard({ supplement, todayLogs, onTake, onEdit }: SupplementCardProps) {
  const percentage = (supplement.remaining_capsules / supplement.total_capsules) * 100
  const isCompleteToday = todayLogs >= supplement.daily_frequency
  
  const statusConfig = {
    normal: { color: 'bg-emerald-500', text: 'Normal', icon: CheckCircle2 },
    low: { color: 'bg-amber-500', text: 'Estoque Baixo', icon: AlertCircle },
    empty: { color: 'bg-red-500', text: 'Acabou', icon: AlertCircle }
  }
  
  const config = statusConfig[supplement.status]
  const StatusIcon = config.icon

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-1 h-full ${config.color}`} />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Pill className="w-5 h-5 text-purple-500" />
              {supplement.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{supplement.dosage}</p>
          </div>
          <Badge variant={supplement.status === 'normal' ? 'default' : 'destructive'} className="ml-2">
            <StatusIcon className="w-3 h-3 mr-1" />
            {config.text}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estoque</span>
            <span className="font-medium">
              {supplement.remaining_capsules} / {supplement.total_capsules} cápsulas
            </span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>

        {/* Daily Progress */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div>
            <p className="text-sm font-medium">Hoje</p>
            <p className="text-xs text-muted-foreground">
              {todayLogs} / {supplement.daily_frequency} doses
            </p>
          </div>
          {isCompleteToday ? (
            <Badge variant="default" className="bg-emerald-500">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Completo
            </Badge>
          ) : (
            <Button
              size="sm"
              onClick={() => onTake(supplement.id)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Pill className="w-4 h-4 mr-2" />
              Consumir
            </Button>
          )}
        </div>

        {/* Reminder Times */}
        {supplement.reminder_times.length > 0 && (
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">Lembretes:</span> {supplement.reminder_times.join(', ')}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
