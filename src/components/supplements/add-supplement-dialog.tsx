"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Plus, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

interface SupplementFormData {
  name: string
  dosage: string
  total_capsules: number
  daily_frequency: number
  reminder_times: string[]
}

interface AddSupplementDialogProps {
  onAdd: (data: SupplementFormData) => Promise<void>
}

export function AddSupplementDialog({ onAdd }: AddSupplementDialogProps) {
  const [open, setOpen] = useState(false)
  const [reminderInput, setReminderInput] = useState('')
  const [reminders, setReminders] = useState<string[]>([])
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SupplementFormData>()

  const addReminder = () => {
    if (reminderInput && !reminders.includes(reminderInput)) {
      setReminders([...reminders, reminderInput])
      setReminderInput('')
    }
  }

  const removeReminder = (time: string) => {
    setReminders(reminders.filter(t => t !== time))
  }

  const onSubmit = async (data: SupplementFormData) => {
    try {
      await onAdd({
        ...data,
        reminder_times: reminders
      })
      toast.success('Suplemento adicionado com sucesso!')
      reset()
      setReminders([])
      setOpen(false)
    } catch (error) {
      toast.error('Erro ao adicionar suplemento')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#55C1B3] hover:bg-[#6AD3C6] text-white border-0">
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Suplemento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white border border-[#E5E7EB] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#111111]">Novo Suplemento</DialogTitle>
          <DialogDescription className="text-[#4A4A4A]">
            Adicione um novo suplemento para controlar seu consumo diário
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[#111111]">Nome do Suplemento *</Label>
            <Input
              id="name"
              placeholder="Ex: Whey Protein, Creatina, Ômega 3"
              className="bg-white border-[#E5E7EB] focus:border-[#55C1B3] focus:ring-[#55C1B3]"
              {...register('name', { required: 'Nome é obrigatório' })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dosage" className="text-[#111111]">Dosagem *</Label>
            <Input
              id="dosage"
              placeholder="Ex: 30g, 5g, 1000mg"
              className="bg-white border-[#E5E7EB] focus:border-[#55C1B3] focus:ring-[#55C1B3]"
              {...register('dosage', { required: 'Dosagem é obrigatória' })}
            />
            {errors.dosage && (
              <p className="text-sm text-red-500">{errors.dosage.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total_capsules" className="text-[#111111]">Total de Cápsulas *</Label>
              <Input
                id="total_capsules"
                type="number"
                min="1"
                placeholder="60"
                className="bg-white border-[#E5E7EB] focus:border-[#55C1B3] focus:ring-[#55C1B3]"
                {...register('total_capsules', { 
                  required: 'Total é obrigatório',
                  valueAsNumber: true,
                  min: 1
                })}
              />
              {errors.total_capsules && (
                <p className="text-sm text-red-500">{errors.total_capsules.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="daily_frequency" className="text-[#111111]">Doses por Dia *</Label>
              <Input
                id="daily_frequency"
                type="number"
                min="1"
                max="10"
                placeholder="2"
                className="bg-white border-[#E5E7EB] focus:border-[#55C1B3] focus:ring-[#55C1B3]"
                {...register('daily_frequency', { 
                  required: 'Frequência é obrigatória',
                  valueAsNumber: true,
                  min: 1,
                  max: 10
                })}
              />
              {errors.daily_frequency && (
                <p className="text-sm text-red-500">{errors.daily_frequency.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminder" className="text-[#111111]">Horários de Lembrete (opcional)</Label>
            <div className="flex gap-2">
              <Input
                id="reminder"
                type="time"
                value={reminderInput}
                onChange={(e) => setReminderInput(e.target.value)}
                className="bg-white border-[#E5E7EB] focus:border-[#55C1B3] focus:ring-[#55C1B3]"
              />
              <Button 
                type="button" 
                onClick={addReminder} 
                variant="outline"
                className="border-[#E5E7EB] hover:bg-[#F9FAFB]"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {reminders.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {reminders.map((time) => (
                  <span 
                    key={time} 
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium bg-[#F9FAFB] text-[#111111] border border-[#E5E7EB]"
                  >
                    {time}
                    <button
                      type="button"
                      onClick={() => removeReminder(time)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="border-[#E5E7EB] hover:bg-[#F9FAFB]"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-[#55C1B3] hover:bg-[#6AD3C6] text-white border-0"
            >
              Adicionar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
