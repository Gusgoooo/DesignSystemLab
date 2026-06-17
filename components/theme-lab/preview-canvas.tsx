"use client"

import {
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react"
import { cn } from "../../lib/utils"

type PreviewCanvasProps = {
  children: ReactNode
  dragEnabled?: boolean
}

type DragState = {
  pointerId: number | null
  startX: number
  startY: number
  scrollLeft: number
  scrollTop: number
  didMove: boolean
}

const interactiveSelector = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  "summary",
  "label",
  "[contenteditable='true']",
  "[role='button']",
  "[role='checkbox']",
  "[role='combobox']",
  "[role='link']",
  "[role='menuitem']",
  "[role='radio']",
  "[role='slider']",
  "[role='spinbutton']",
  "[role='switch']",
  "[role='tab']",
  "[data-canvas-drag-disabled]",
].join(",")

function isInteractiveTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false
  }

  return Boolean(target.closest(interactiveSelector))
}

export function PreviewCanvas(props: PreviewCanvasProps) {
  const dragEnabled = props.dragEnabled ?? true
  const viewportRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<DragState>({
    pointerId: null,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
    didMove: false,
  })
  const [isDragging, setIsDragging] = useState(false)

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    const viewport = viewportRef.current

    if (dragRef.current.pointerId !== event.pointerId) {
      return
    }

    if (viewport?.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId)
    }

    dragRef.current.pointerId = null
    setIsDragging(false)
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (
      !dragEnabled ||
      event.button !== 0 ||
      event.pointerType === "pen" ||
      isInteractiveTarget(event.target)
    ) {
      return
    }

    const viewport = viewportRef.current

    if (!viewport) {
      return
    }

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: viewport.scrollLeft,
      scrollTop: viewport.scrollTop,
      didMove: false,
    }

    viewport.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const viewport = viewportRef.current
    const drag = dragRef.current

    if (!dragEnabled || !viewport || drag.pointerId !== event.pointerId) {
      return
    }

    const deltaX = event.clientX - drag.startX
    const deltaY = event.clientY - drag.startY

    if (!drag.didMove && Math.hypot(deltaX, deltaY) > 3) {
      drag.didMove = true
      setIsDragging(true)
    }

    if (!drag.didMove) {
      return
    }

    viewport.scrollLeft = drag.scrollLeft - deltaX
    viewport.scrollTop = drag.scrollTop - deltaY
    event.preventDefault()
  }

  function handleClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (dragRef.current.didMove) {
      event.preventDefault()
      event.stopPropagation()
      dragRef.current.didMove = false
    }
  }

  return (
    <div
      ref={viewportRef}
      role="region"
      aria-label="可拖拽预览画布"
      tabIndex={0}
      onClickCapture={handleClickCapture}
      onDragStart={(event) => event.preventDefault()}
      onLostPointerCapture={endDrag}
      onPointerCancel={endDrag}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      className={cn(
        "h-full overflow-auto bg-white outline-none overscroll-contain dark:bg-neutral-950 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        dragEnabled && isDragging && "cursor-grabbing select-none",
        dragEnabled && !isDragging && "cursor-grab",
        !dragEnabled && "cursor-auto",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
      )}
    >
      {props.children}
    </div>
  )
}
