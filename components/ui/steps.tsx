"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  title: string
  description: string
  icon?: React.ComponentType<{ className?: string }>
}

interface StepsProps {
  steps: Step[]
  currentStep: number
  onStepClick?: (step: number) => void
}

export function Steps({ steps, currentStep, onStepClick }: StepsProps) {
  return (
    <div className="relative">
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const StepIcon = step.icon
          const isActive = currentStep === index + 1
          const isCompleted = currentStep > index + 1

          return (
            <div
              key={index}
              className={cn(
                "relative flex flex-col items-center group",
                onStepClick && "cursor-pointer"
              )}
              onClick={() => onStepClick?.(index + 1)}
            >
              {/* Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute top-5 left-[50%] w-full h-[2px] -translate-y-1/2",
                    isCompleted
                      ? "bg-blue-500 dark:bg-blue-400"
                      : "bg-gray-200 dark:bg-gray-800"
                  )}
                />
              )}

              {/* Circle */}
              <div
                className={cn(
                  "relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200",
                  isActive && "ring-4 ring-blue-50 dark:ring-blue-900/50",
                  isCompleted
                    ? "bg-blue-500 dark:bg-blue-400 border-blue-500 dark:border-blue-400"
                    : isActive
                    ? "border-blue-500 dark:border-blue-400"
                    : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
                )}
              >
                {StepIcon ? (
                  <StepIcon
                    className={cn(
                      "w-5 h-5",
                      isCompleted || isActive
                        ? "text-white dark:text-white"
                        : "text-gray-400 dark:text-gray-600"
                    )}
                  />
                ) : (
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isCompleted || isActive
                        ? "text-white dark:text-white"
                        : "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Text */}
              <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 text-center w-32">
                <p
                  className={cn(
                    "text-sm font-medium mb-0.5 whitespace-nowrap",
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400"
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 whitespace-nowrap">
                  {step.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
