import React, { useState, useRef, useEffect } from 'react';
import { X, Send, MessageSquare, Trash2, AlertCircle } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

interface InventoryAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUGGESTED_PROMPTS = [
  'How should I structure SKUs and units in Items Management?',
  'Explain inter-godown Stock Transfer challan reconciliation.',
  'How do Contractors and Manufacturing batches link to Stock?',
];

export const InventoryAssistantDrawer: React.FC<
  InventoryAssistantDrawerProps
> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: 'Welcome to the Inventory Operations Assistant. Ask about SKU cataloging, godown transfers, contractor job work, manufacturing batches, or monthly stock reconciliations.',
      timestamp: 'Ready',
    },
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'general' | 'fast'>('general');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const threadEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) {
    return null;
  }

  const sendPrompt = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || isLoading) return;

    const userTurn: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: 'Just now',
    };

    const historyForApi = messages
      .filter((m) => m.id !== 'welcome-1')
      .map((m) => ({ role: m.role, text: m.text }));

    setMessages((prev) => [...prev, userTurn]);
    setInput('');
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: historyForApi,
          mode,
        }),
      });

      const data = (await response.json()) as {
        reply?: string;
        error?: string;
      };

      if (!response.ok || data.error) {
        setErrorMessage(
          data.error ?? 'Unable to reach the assistant right now.'
        );
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `model-${Date.now()}`,
            role: 'model',
            text: data.reply ?? 'No response returned.',
            timestamp: 'Just now',
          },
        ]);
      }
    } catch {
      setErrorMessage('Network error while contacting the assistant.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void sendPrompt(input);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome-1',
        role: 'model',
        text: 'Conversation cleared. How can I help with your inventory or godown workflows?',
        timestamp: 'Ready',
      },
    ]);
    setErrorMessage(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Inventory Operations Assistant"
    >
      <div
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-md liquid-glass-elevated h-full flex flex-col border-l border-white/90">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200/70 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl liquid-glass-subtle flex items-center justify-center text-slate-800 shrink-0">
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-slate-900 truncate">
                Inventory Assistant
              </h2>
              <p className="text-[11px] text-slate-500 truncate">
                Multi-turn ERP workflow guidance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleClearChat}
              aria-label="Clear conversation"
              className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/70 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close assistant"
              className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/70 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="px-5 py-2.5 border-b border-slate-200/60 bg-white/40 flex items-center justify-between gap-2 text-xs shrink-0">
          <span className="text-slate-500">Response Mode</span>
          <div
            role="group"
            aria-label="Assistant response speed"
            className="flex items-center gap-1 p-0.5 liquid-glass-pill rounded-lg"
          >
            <button
              type="button"
              onClick={() => setMode('general')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                mode === 'general'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              General
            </button>
            <button
              type="button"
              onClick={() => setMode('fast')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                mode === 'fast'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fast
            </button>
          </div>
        </div>

        {/* Scrollable Message Thread */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'liquid-glass text-slate-800'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {msg.role === 'user' ? 'You' : 'Assistant'} · {msg.timestamp}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start">
              <div className="liquid-glass rounded-2xl px-4 py-3 text-xs text-slate-500">
                Preparing guidance...
              </div>
            </div>
          )}

          {errorMessage && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-red-50/90 border border-red-200 text-red-700 text-xs flex items-start gap-2"
            >
              <AlertCircle
                className="w-4 h-4 shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <span>{errorMessage}</span>
            </div>
          )}

          {messages.length === 1 && (
            <div className="pt-2 space-y-2">
              <div className="text-[11px] font-medium text-slate-500">
                Suggested Questions
              </div>
              <div className="space-y-1.5">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void sendPrompt(prompt)}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl liquid-glass-subtle hover:bg-white/80 text-xs text-slate-700 transition-colors cursor-pointer"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={threadEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-slate-200/70 bg-white/60 flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about items, godowns, stock..."
            aria-label="Message Inventory Assistant"
            className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-200/90 bg-white/90 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            className="h-10 px-4 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-40 transition-colors flex items-center justify-center cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
};
