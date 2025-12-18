"use client"

import { Droplet, Utensils, Dumbbell, Camera, Pill } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface QuickActionsProps {
  onAction: (action: string) => void
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const actions = [
    { id: 'water', label: 'Água', icon: Droplet },
    { id: 'meal', label: 'Refeição', icon: Utensils },
    { id: 'workout', label: 'Treino', icon: Dumbbell },
    { id: 'photo', label: 'Foto', icon: Camera },
    { id: 'supplement', label: 'Suplemento', icon: Pill },
  ]

  return (
    <Card className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg text-[#111111]">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.id}
                onClick={() => onAction(action.id)}
                className="flex flex-col items-center justify-center h-20 bg-[#55C1B3] hover:bg-[#6AD3C6] text-white border-0 rounded-xl transition-all"
                variant="default"
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{action.label}</span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
