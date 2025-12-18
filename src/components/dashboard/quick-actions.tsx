"use client"

import { Droplet, Utensils, Dumbbell, Camera, Pill } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface QuickActionsProps {
  onAction: (action: string) => void
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const actions = [
    { id: 'water', label: 'Água', icon: Droplet, color: 'bg-blue-500 hover:bg-blue-600' },
    { id: 'meal', label: 'Refeição', icon: Utensils, color: 'bg-emerald-500 hover:bg-emerald-600' },
    { id: 'workout', label: 'Treino', icon: Dumbbell, color: 'bg-orange-500 hover:bg-orange-600' },
    { id: 'photo', label: 'Foto', icon: Camera, color: 'bg-purple-500 hover:bg-purple-600' },
    { id: 'supplement', label: 'Suplemento', icon: Pill, color: 'bg-pink-500 hover:bg-pink-600' },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.id}
                onClick={() => onAction(action.id)}
                className={`flex flex-col items-center justify-center h-20 ${action.color} text-white`}
                variant="default"
              >
                <Icon className="w-6 h-6 mb-1" />
                <span className="text-xs">{action.label}</span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
