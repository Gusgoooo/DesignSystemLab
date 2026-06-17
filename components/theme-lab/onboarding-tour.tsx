"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react"
import { ArrowRight, CheckCircle2, X } from "lucide-react"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { cn } from "../../lib/utils"

type TourTarget =
  | "style-controls"
  | "theme-preview"
  | "preview-mode"
  | "enterprise-prompt"

type TourStep = {
  target: TourTarget
  title: string
  description: string
  radius: string
}

type MeasuredRect = {
  top: number
  left: number
  width: number
  height: number
}

type OnboardingTourProps = {
  restartKey: number
}

const storageKey = "visual-system-lab:onboarding-tour:v2"
const highlightPadding = 8
const viewportMargin = 16
const cardWidth = 344
const estimatedCardHeight = 360

const tourSteps: readonly TourStep[] = [
  {
    target: "style-controls",
    title: "在这里定义样式",
    description: "调整左侧参数，定义你的视觉风格。",
    radius: "28px",
  },
  {
    target: "theme-preview",
    title: "在这里查看主题参数预览",
    description: "在右侧实时查看样式应用效果。",
    radius: "28px",
  },
  {
    target: "preview-mode",
    title: "切换两种预览模式",
    description: "切换组件和模块，检查不同场景下的表现。",
    radius: "999px",
  },
  {
    target: "enterprise-prompt",
    title: "确定样式后直接导出 Prompt",
    description: "确认后导出 Prompt，让 AI 工具应用到项目中。",
    radius: "20px",
  },
]

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function getMeasuredRect(target: TourTarget): MeasuredRect | null {
  const element = document.querySelector<HTMLElement>(
    `[data-tour-target="${target}"]`
  )

  if (!element) {
    return null
  }

  const rect = element.getBoundingClientRect()
  const left = clamp(
    rect.left - highlightPadding,
    viewportMargin,
    window.innerWidth - viewportMargin
  )
  const top = clamp(
    rect.top - highlightPadding,
    viewportMargin,
    window.innerHeight - viewportMargin
  )
  const right = clamp(
    rect.right + highlightPadding,
    viewportMargin,
    window.innerWidth - viewportMargin
  )
  const bottom = clamp(
    rect.bottom + highlightPadding,
    viewportMargin,
    window.innerHeight - viewportMargin
  )

  return {
    top,
    left,
    width: Math.max(0, right - left),
    height: Math.max(0, bottom - top),
  }
}

export function OnboardingTour(props: OnboardingTourProps) {
  const coachCardRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [targetRect, setTargetRect] = useState<MeasuredRect | null>(null)
  const [coachHeight, setCoachHeight] = useState(estimatedCardHeight)
  const step = tourSteps[stepIndex]
  const isLastStep = stepIndex === tourSteps.length - 1

  const finishTour = useCallback(() => {
    try {
      window.localStorage.setItem(storageKey, "complete")
    } catch {
      // Ignore storage errors so the guide can still close in private contexts.
    }

    setOpen(false)
  }, [])

  const goNext = useCallback(() => {
    if (stepIndex === tourSteps.length - 1) {
      finishTour()
      return
    }

    setStepIndex((current) => Math.min(current + 1, tourSteps.length - 1))
  }, [finishTour, stepIndex])

  useEffect(() => {
    if (props.restartKey > 0) {
      setStepIndex(0)
      setOpen(true)
      return
    }

    try {
      if (!window.localStorage.getItem(storageKey)) {
        setOpen(true)
      }
    } catch {
      setOpen(true)
    }
  }, [props.restartKey])

  useEffect(() => {
    if (!open) {
      return
    }

    function updateTargetRect() {
      setTargetRect(getMeasuredRect(step.target))
    }

    updateTargetRect()
    const frameId = window.requestAnimationFrame(updateTargetRect)

    window.addEventListener("resize", updateTargetRect)
    window.addEventListener("scroll", updateTargetRect, true)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener("resize", updateTargetRect)
      window.removeEventListener("scroll", updateTargetRect, true)
    }
  }, [open, step.target])

  useEffect(() => {
    if (!open) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        finishTour()
      }

      if (event.key === "Enter" || event.key === "ArrowRight") {
        event.preventDefault()
        goNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [finishTour, goNext, open])

  useEffect(() => {
    if (!open) {
      return
    }

    function updateCoachHeight() {
      const measuredHeight = coachCardRef.current?.getBoundingClientRect().height

      if (measuredHeight) {
        setCoachHeight(
          Math.ceil(
            Math.min(measuredHeight, window.innerHeight - viewportMargin * 2)
          )
        )
      }
    }

    updateCoachHeight()
    const frameId = window.requestAnimationFrame(updateCoachHeight)

    window.addEventListener("resize", updateCoachHeight)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener("resize", updateCoachHeight)
    }
  }, [open, stepIndex])

  const coachStyle = useMemo<CSSProperties>(() => {
    if (typeof window === "undefined") {
      return {
        left: "50%",
        maxHeight: `calc(100vh - ${viewportMargin * 2}px)`,
        overflowY: "auto",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: cardWidth,
      }
    }

    const viewportCardWidth = Math.min(
      cardWidth,
      Math.max(0, window.innerWidth - viewportMargin * 2)
    )

    if (!targetRect) {
      return {
        left: "50%",
        maxHeight: `calc(100vh - ${viewportMargin * 2}px)`,
        overflowY: "auto",
        top: "50%",
        transform: "translate(-50%, -50%)",
        width: viewportCardWidth,
      }
    }

    const maxLeft = Math.max(
      viewportMargin,
      window.innerWidth - viewportCardWidth - viewportMargin
    )
    const canPlaceRight =
      targetRect.left + targetRect.width + 14 + viewportCardWidth <=
      window.innerWidth - viewportMargin
    const canPlaceLeft = targetRect.left - 14 - viewportCardWidth >= viewportMargin
    const left = canPlaceRight
      ? targetRect.left + targetRect.width + 14
      : canPlaceLeft
        ? targetRect.left - viewportCardWidth - 14
        : clamp(targetRect.left + 18, viewportMargin, maxLeft)
    const maxTop = Math.max(
      viewportMargin,
      window.innerHeight - coachHeight - viewportMargin
    )
    const top = clamp(
      targetRect.top + Math.min(24, targetRect.height / 4),
      viewportMargin,
      maxTop
    )

    return {
      left,
      maxHeight: `calc(100vh - ${viewportMargin * 2}px)`,
      overflowY: "auto",
      top,
      width: viewportCardWidth,
    }
  }, [coachHeight, targetRect])

  if (!open) {
    return null
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-[80]">
      {targetRect ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed border-2 border-primary bg-background/5 ring-4 ring-primary/20 transition-[background-color,border-color,box-shadow,opacity] duration-200"
          style={{
            borderRadius: step.radius,
            boxShadow:
              "0 0 0 9999px color-mix(in oklch, var(--foreground) 52%, transparent)",
            height: targetRect.height,
            left: targetRect.left,
            top: targetRect.top,
            width: targetRect.width,
          }}
        />
      ) : (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 bg-foreground/55"
        />
      )}

      <Card
        ref={coachCardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="theme-tour-title"
        className="pointer-events-auto fixed -translate-y-1 gap-4 border-border bg-popover p-4 text-popover-foreground [box-shadow:0_28px_80px_color-mix(in_oklch,var(--foreground)_24%,transparent),0_10px_28px_color-mix(in_oklch,var(--foreground)_12%,transparent),inset_0_1px_0_color-mix(in_oklch,var(--background)_84%,transparent)]"
        style={coachStyle}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-muted-foreground">
            {stepIndex + 1} / {tourSteps.length}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="关闭新手引导"
            onClick={finishTour}
          >
            <X className="size-3.5" />
          </Button>
        </div>

        <div className="space-y-2">
          <h3
            id="theme-tour-title"
            className="text-base font-semibold leading-6 tracking-normal"
          >
            {step.title}
          </h3>
          <p className="text-sm leading-6 text-muted-foreground">
            {step.description}
          </p>
        </div>

        <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
          {tourSteps.map((item, index) => (
            <span
              key={item.target}
              className={cn(
                "h-1.5 rounded-full bg-muted transition-colors",
                index <= stepIndex && "bg-primary"
              )}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={finishTour}
          >
            跳过
          </Button>
          <Button type="button" size="sm" onClick={goNext}>
            {isLastStep ? (
              <>
                开始体验
                <CheckCircle2 className="size-4" />
              </>
            ) : (
              <>
                下一步
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </div>
      </Card>
    </div>
  )
}
