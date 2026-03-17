import { Clock } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import useAppStore from '@/stores/main'
import { formatTime } from '@/lib/utils'
import { Card } from '@/components/ui/card'

export function TimeSimulator() {
  const { timeMinutes, setTimeMinutes } = useAppStore()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-md border-t shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="container max-w-2xl mx-auto flex flex-col gap-3">
        <div className="flex items-center justify-between text-sm font-medium">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Time Simulator</span>
          </div>
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-base shadow-sm font-bold tracking-wider">
            {formatTime(timeMinutes)}
          </div>
        </div>
        <Slider
          defaultValue={[timeMinutes]}
          value={[timeMinutes]}
          onValueChange={(val) => setTimeMinutes(val[0])}
          max={1200} // 20:00
          min={420} // 07:00
          step={5}
          className="py-2 cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground font-medium px-1">
          <span>07:00</span>
          <span>12:00</span>
          <span>20:00</span>
        </div>
      </div>
    </div>
  )
}
