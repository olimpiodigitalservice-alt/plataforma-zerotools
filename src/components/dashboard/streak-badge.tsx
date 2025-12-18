"use client"

import { Flame } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface StreakBadgeProps {
  count: number
  type: string
}

export function StreakBadge({ count, type }: StreakBadgeProps) {
  return (
    <Card className="bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-90">Sequência {type}</p>
          <p className="text-4xl font-bold mt-1">{count} dias</p>
        </div>
        <div className="p-4 bg-white/20 rounded-full">
          <Flame className="w-8 h-8" />
        </div>
      </CardContent>
    </Card>
  )
}
