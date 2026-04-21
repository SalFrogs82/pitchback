"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps {
  className?: string
  value?: number[]
  defaultValue?: number[]
  min?: number
  max?: number
  step?: number
  onValueChange?: (value: number[]) => void
  disabled?: boolean
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, defaultValue, min = 0, max = 100, step = 1, onValueChange, disabled, ...props }, ref) => {
    const currentValue = value?.[0] ?? defaultValue?.[0] ?? min

    return (
      <div className={cn("relative flex w-full touch-none select-none items-center", className)}>
        <input
          type="range"
          ref={ref}
          min={min}
          max={max}
          step={step}
          value={currentValue}
          disabled={disabled}
          onChange={(e) => onValueChange?.([Number(e.target.value)])}
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-primary/20 accent-primary disabled:cursor-not-allowed disabled:opacity-50"
          {...props}
        />
      </div>
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
