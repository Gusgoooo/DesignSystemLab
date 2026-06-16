"use client"

import {
  AssistantRuntimeProvider,
  AuiIf,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  useLocalRuntime,
  type ChatModelAdapter,
} from "@assistant-ui/react"
import { Bot, Paperclip, Send, UserRound } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const demoModelAdapter: ChatModelAdapter = {
  async run() {
    return {
      content: [
        {
          type: "text",
          text:
            "已收到。我会基于当前 token 系统生成中文方案，并保持 shadcn 语义类、间距和圆角一致。",
        },
      ],
    }
  },
}

function MessageText() {
  return (
    <MessagePrimitive.Parts>
      {({ part }) => {
        if (part.type === "text") {
          return <p className="whitespace-pre-wrap leading-6">{part.text}</p>
        }

        if (part.type === "reasoning") {
          return (
            <p className="rounded-[var(--radius-control)] bg-muted px-3 py-2 text-muted-foreground">
              {part.text}
            </p>
          )
        }

        if (part.type === "tool-call") {
          return (
            <div className="rounded-[var(--radius-control)] border border-border bg-muted px-3 py-2 text-sm">
              工具调用：{part.toolName}
            </div>
          )
        }

        return null
      }}
    </MessagePrimitive.Parts>
  )
}

function AssistantMessage() {
  return (
    <MessagePrimitive.Root className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
      <div className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Bot className="size-4" />
      </div>
      <div className="min-w-0 rounded-[var(--radius-card)] border border-border bg-card px-4 py-3 text-sm text-card-foreground [box-shadow:var(--elevation-card)]">
        <MessageText />
      </div>
    </MessagePrimitive.Root>
  )
}

function UserMessage() {
  return (
    <MessagePrimitive.Root className="grid grid-cols-[minmax(0,1fr)_2rem] gap-3">
      <div className="min-w-0 justify-self-end rounded-[var(--radius-card)] bg-primary px-4 py-3 text-sm text-primary-foreground">
        <MessageText />
      </div>
      <div className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <UserRound className="size-4" />
      </div>
    </MessagePrimitive.Root>
  )
}

function ThreadWelcome() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <h3 className="text-[clamp(1.125rem,2vw,2.25rem)] font-[var(--font-weight-heading)] leading-none tracking-[var(--tracking-heading)] text-foreground">
        和你的工作台对话
      </h3>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2 rounded-[var(--radius-control)] bg-muted p-1">
        <span className="px-4 py-2 text-sm leading-none text-muted-foreground">
          用 token 生成 shadcn 主题与预览
        </span>
        <button
          className="rounded-[calc(var(--radius-control)-2px)] bg-foreground px-5 py-2 text-sm font-medium leading-none text-background"
          type="button"
        >
          开始提问
        </button>
      </div>
    </div>
  )
}

function ThreadComposer() {
  return (
    <ComposerPrimitive.Root className="mx-auto w-full rounded-[var(--radius-panel)] border border-border bg-background p-5 [box-shadow:var(--elevation-card)] md:w-3/5">
      <ComposerPrimitive.Input asChild>
        <Textarea
          className="min-h-24 resize-none border-0 bg-transparent p-0 text-base shadow-none focus-visible:ring-0"
          placeholder="输入你的问题..."
        />
      </ComposerPrimitive.Input>
      <div className="mt-5 flex items-center justify-between gap-2">
        <Button size="sm" type="button" variant="outline">
          <Paperclip className="size-4" />
          附件
        </Button>
        <ComposerPrimitive.Send asChild>
          <Button size="sm" type="submit">
            <Send className="size-4" />
            发送
          </Button>
        </ComposerPrimitive.Send>
      </div>
    </ComposerPrimitive.Root>
  )
}

export function AssistantThread({ className }: { className?: string }) {
  const runtime = useLocalRuntime(demoModelAdapter)

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <ThreadPrimitive.Root
        className={cn("flex h-full min-h-0 flex-col bg-background", className)}
      >
        <ThreadPrimitive.Viewport className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 sm:p-6">
          <ThreadPrimitive.Messages
            components={{
              AssistantMessage,
              UserMessage,
            }}
          />
          <AuiIf condition={(state) => state.thread.isEmpty}>
            <ThreadWelcome />
          </AuiIf>
        </ThreadPrimitive.Viewport>
        <div className="bg-background p-4">
          <ThreadComposer />
        </div>
      </ThreadPrimitive.Root>
    </AssistantRuntimeProvider>
  )
}
