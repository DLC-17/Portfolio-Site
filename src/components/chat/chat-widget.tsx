"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Sparkles, X, Send, RotateCcw, Bot, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const SUGGESTED_QUESTIONS = [
  "What did you build at Spoqen?",
  "What is your experience with Agentic AI & MCP?",
  "What roles and tech stacks are you targeting?",
  "Tell me about your voice AI work at Infinitus.",
];

/** Parse inline markdown bold, italic, code, and strip unneeded asterisks */
function renderInline(text: string): React.ReactNode {
  let normalized = text;
  // Balance unclosed ** during streaming
  const boldMatches = normalized.match(/\*\*/g);
  if (boldMatches && boldMatches.length % 2 === 1) {
    normalized += "**";
  }

  const parts: React.ReactNode[] = [];
  const regex = /(\*\*.*?\*\*|\*.*?\*|`.*?`)/g;
  const segments = normalized.split(regex);

  segments.forEach((seg, idx) => {
    if (seg.startsWith("**") && seg.endsWith("**") && seg.length >= 4) {
      parts.push(
        <strong key={`b-${idx}`} className="font-semibold text-foreground">
          {seg.slice(2, -2).replace(/\*/g, "")}
        </strong>
      );
    } else if (seg.startsWith("*") && seg.endsWith("*") && seg.length >= 2) {
      parts.push(
        <em key={`i-${idx}`} className="italic">
          {seg.slice(1, -1).replace(/\*/g, "")}
        </em>
      );
    } else if (seg.startsWith("`") && seg.endsWith("`") && seg.length >= 2) {
      parts.push(
        <code key={`c-${idx}`} className="rounded bg-muted/60 px-1 py-0.5 font-mono text-[14px]">
          {seg.slice(1, -1)}
        </code>
      );
    } else {
      // Remove stray unneeded asterisks
      const cleaned = seg.replace(/\*/g, "");
      if (cleaned) {
        // Parse markdown links [text](url) and email addresses
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)|([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g;
        let lastIdx = 0;
        let match: RegExpExecArray | null;

        while ((match = linkRegex.exec(cleaned)) !== null) {
          if (match.index > lastIdx) {
            parts.push(cleaned.slice(lastIdx, match.index));
          }
          if (match[1] && match[2]) {
            // Markdown link [text](url)
            parts.push(
              <a
                key={`link-${idx}-${match.index}`}
                href={match[2]}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-opposing underline underline-offset-4 transition-colors hover:opacity-80"
              >
                {match[1]}
              </a>
            );
          } else if (match[3]) {
            // Email address
            parts.push(
              <a
                key={`mail-${idx}-${match.index}`}
                href={`mailto:${match[3]}`}
                className="font-medium text-opposing underline underline-offset-4 transition-colors hover:opacity-80"
              >
                {match[3]}
              </a>
            );
          }
          lastIdx = match.index + match[0].length;
        }

        if (lastIdx < cleaned.length) {
          parts.push(cleaned.slice(lastIdx));
        }
      }
    }
  });

  return parts.length > 0 ? parts : null;
}

/** Render structured chat message with clean bullets, paragraphs, and zero raw asterisks */
function renderFormattedMessage(content: string): React.ReactNode {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="my-2 space-y-2 pl-0.5">
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, lineIdx) => {
    const trimmed = line.trim();

    // Check if line is a bullet item starting with *, -, or •
    const bulletMatch = trimmed.match(/^(\*+|-|•)\s+(.*)/);
    if (bulletMatch) {
      const itemText = bulletMatch[2];
      currentList.push(
        <li key={`li-${lineIdx}`} className="flex items-start gap-2.5 text-pretty">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
          <span className="flex-1">{renderInline(itemText)}</span>
        </li>
      );
    } else {
      flushList();
      if (trimmed === "") {
        elements.push(<div key={`blank-${lineIdx}`} className="h-1.5" />);
      } else {
        elements.push(
          <p key={`p-${lineIdx}`} className="text-pretty leading-relaxed">
            {renderInline(line)}
          </p>
        );
      }
    }
  });

  flushList();
  return elements;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [honeypotValue, setHoneypotValue] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages]);

  const handleSend = async (userText: string) => {
    const trimmed = userText.trim();
    if (!trimmed || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed.slice(0, 400),
    };

    const assistantPlaceholderId = `assistant-${Date.now()}`;
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Append an empty assistant message to receive the stream
      setMessages((prev) => [
        ...prev,
        { id: assistantPlaceholderId, role: "assistant", content: "" },
      ]);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          honeypot: honeypotValue,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
          errorData.error || "Something went wrong. Please try again shortly.";
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantPlaceholderId ? { ...msg, content: errorMessage } : msg
          )
        );
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let streamedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        streamedContent += chunk;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantPlaceholderId
              ? { ...msg, content: streamedContent }
              : msg
          )
        );
      }
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantPlaceholderId
            ? {
                ...msg,
                content:
                  "Network error communicating with David AI. Please try again or email david@dc-dev.space.",
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mb-3 flex h-[560px] max-h-[calc(100vh-6rem)] w-[400px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/95 shadow-2xl backdrop-blur-md sm:w-[460px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/80 bg-muted/40 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="relative flex size-9 items-center justify-center rounded-full border-2 border-black dark:border-white bg-primary/10 text-primary">
                  <Bot size={19} />
                  <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-[19px] font-semibold text-foreground">David AI</h3>
                  </div>
                  <p className="text-[16px] text-muted-foreground">Forward Deployed Engineer</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClear}
                    title="Clear conversation"
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <RotateCcw size={17} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto px-4 py-4 text-[17px]">
              {messages.length === 0 ? (
                <div className="flex flex-col gap-4 py-2">
                  <div className="rounded-xl border border-border/80 bg-background/50 p-3.5 text-foreground">
                    <div className="mb-1.5 flex items-center gap-1.5 font-medium text-primary">
                      <Sparkles size={17} />
                      <span>Ask David Anything</span>
                    </div>
                    <p className="text-pretty text-muted-foreground leading-relaxed">
                      Hi! I’m David’s AI avatar, grounded in his real engineering experience, architecture decisions, and portfolio. Ask me what you’d normally ask in an initial screen!
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <p className="text-[16px] font-medium text-muted-foreground">
                      Suggested questions:
                    </p>
                    {SUGGESTED_QUESTIONS.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => handleSend(q)}
                        className="group flex items-center justify-between rounded-lg border border-border/60 bg-muted/20 px-3 py-2 text-left text-[16px] text-foreground transition-all hover:border-primary/60 hover:bg-muted/50 hover:text-primary"
                      >
                        <span className="line-clamp-1">{q}</span>
                        <ArrowRight size={14} className="shrink-0 opacity-40 transition-transform group-hover:translate-x-0.5 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((m) => {
                    const isUser = m.role === "user";
                    return (
                      <div
                        key={m.id}
                        className={cn("flex", isUser ? "justify-end" : "justify-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed text-pretty",
                            isUser
                              ? "rounded-tr-xs bg-primary text-primary-foreground shadow-xs font-medium"
                              : "rounded-tl-xs border border-border/80 bg-muted/30 text-foreground"
                          )}
                        >
                          {isUser ? (
                            <div className="whitespace-pre-wrap">{m.content}</div>
                          ) : (
                            <div className="space-y-1">{renderFormattedMessage(m.content)}</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-xs border border-border/80 bg-muted/30 px-3.5 py-2.5 text-muted-foreground">
                        <span className="size-1.5 animate-bounce rounded-full bg-primary" />
                        <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:0.2s]" />
                        <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:0.4s]" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="border-t border-border/80 bg-muted/20 p-2.5"
            >
              {/* Invisible Honeypot */}
              <input
                type="text"
                name="company_field"
                value={honeypotValue}
                onChange={(e) => setHoneypotValue(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, 400))}
                  placeholder="Ask a question about David..."
                  disabled={isLoading}
                  maxLength={400}
                  className="flex-1 rounded-xl border border-border/80 bg-background px-3 py-2 text-[17px] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  aria-label="Send message"
                  className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs transition-opacity hover:opacity-90 disabled:opacity-40"
                >
                  <Send size={16} />
                </button>
              </div>

              <div className="mt-1 flex items-center justify-between px-1 text-[15px] text-muted-foreground/60">
                <span>Gemini 2.5 Flash</span>
                <span>{input.length}/400</span>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close David AI chat" : "Open David AI chat"}
        className={cn(
          "group flex items-center gap-2.5 rounded-full border border-border/80 bg-card/95 px-4 py-2.5 text-xs font-semibold text-foreground shadow-xl backdrop-blur-md transition-all hover:border-primary hover:shadow-2xl",
          isOpen && "border-primary text-primary"
        )}
      >
        <div className="relative flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Sparkles size={13} />
          <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-emerald-500 ring-2 ring-background" />
        </div>
        <span>Ask David AI</span>
      </motion.button>
    </div>
  );
}
