"use client"

import { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface StatsCardProps {
  title: string
  value: string | number
  goal?: string | number
  icon: LucideIcon
  color: string
  progress?: number
}

export function StatsCard({ title, value, goal, icon: Icon, color, progress }: StatsCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-bold">{value}</p>
              {goal && (
                <p className="text-sm text-muted-foreground">/ {goal}</p>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        
        {progress !== undefined && (
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
