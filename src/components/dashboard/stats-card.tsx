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
    <Card className="overflow-hidden bg-white border border-[#E5E7EB] rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-[#4A4A4A]">{title}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-bold text-[#111111]">{value}</p>
              {goal && (
                <p className="text-sm text-[#4A4A4A]">/ {goal}</p>
              )}
            </div>
          </div>
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
        
        {progress !== undefined && (
          <div className="mt-4">
            <Progress value={progress} className="h-2 bg-[#E5E7EB]" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
