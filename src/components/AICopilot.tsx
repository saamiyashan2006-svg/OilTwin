import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Sparkles, Wrench, TrendingDown, AlertTriangle } from 'lucide-react';

interface Message {
  role: 'user' | 'ai';
  text: string;
  actions?: string[];
}

const PRESET_CONVERSATIONS: Message[][] = [
  [
    { role: 'user', text: 'Why is Well B07 underperforming?' },
    {
      role: 'ai',
      text: 'Production has dropped 11.4% over the last 6 hours. Pressure variation and increased vibration are the primary detected factors.',
      actions: ['Inspect pump bearings', 'Schedule vibration analysis', 'Review pressure history'],
    },
  ],
  [
    { role: 'user', text: 'What is the current production across all wells?' },
    {
      role: 'ai',
      text: 'Aggregate production is 6,217 BPD across 7 active wells. Well C03 is the top performer at 1,120 BPD. Well B07 is flagged with reduced output.',
      actions: ['View per-well breakdown', 'Export production report'],
    },
  ],
  [
    { role: 'user', text: 'Predict maintenance needs for next 48 hours.' },
    {
      role: 'ai',
      text: 'Based on current vibration trends, Well B07 has a 78% probability of bearing degradation within 72 hours. Recommend proactive maintenance scheduling. All other wells are within normal parameters.',
      actions: ['Generate work order', 'Notify maintenance team', 'Set monitoring alert'],
    },
  ],
];

export default function AICopilot() {
  const [open, setOpen] = useState(false);
  const [conversationIdx, setConversationIdx] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const startConversation = (idx: number) => {
    setConversationIdx(idx);
    setMessages([]);
    const conv = PRESET_CONVERSATIONS[idx];
    // Show user message immediately
    setMessages([conv[0]]);
    // Then AI response with typing delay
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, conv[1]]);
    }, 1800);
  };

  // Auto-start first conversation when opened
  useEffect(() => {
    if (open && messages.length === 0) {
      startConversation(0);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', text: input }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: 'Based on the current digital twin state, all monitored parameters are within expected ranges. I recommend continuing regular surveillance and reviewing the anomaly engine feed for any pattern shifts.',
          actions: ['View anomaly feed', 'Check equipment health'],
        },
      ]);
    }, 1500);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 3, duration: 0.5 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 group"
      >
        <div className="relative w-14 h-14 rounded-full bg-base-800 border border-oil-400/30 flex items-center justify-center hover:border-oil-400/60 transition-all duration-300 shadow-[0_0_20px_rgba(200,155,44,0.2)] hover:shadow-[0_0_30px_rgba(200,155,44,0.4)]">
          <motion.span
            className="absolute inset-0 rounded-full border border-oil-400/40"
            animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          {open ? (
            <X className="w-5 h-5 text-steel-200" />
          ) : (
            <Bot className="w-6 h-6 text-oil-300" />
          )}
        </div>
        {!open && (
          <span className="absolute right-16 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-wider text-steel-300 bg-base-800/80 px-2 py-1 rounded-sm border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
            OIL TWIN AI
          </span>
        )}
      </motion.button>

      {/* Command interface */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] glass-panel rounded-sm overflow-hidden"
            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(200,155,44,0.1)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-base-900/80">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-sm bg-oil-400/10 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-oil-300" />
                </div>
                <div>
                  <div className="font-display text-sm text-steel-100">OIL TWIN AI</div>
                  <div className="font-mono text-[8px] uppercase tracking-wider text-status-green">OPERATIONAL COPILOT</div>
                </div>
              </div>
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-status-green"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="h-[340px] overflow-y-auto p-4 space-y-3">
              {/* Preset query chips */}
              {messages.length <= 1 && !typing && (
                <div className="space-y-2 mb-2">
                  <div className="label-tag">SUGGESTED QUERIES</div>
                  {PRESET_CONVERSATIONS.map((conv, i) => (
                    <button
                      key={i}
                      onClick={() => startConversation(i)}
                      className={`w-full text-left px-3 py-2 rounded-sm border text-xs transition-all ${
                        conversationIdx === i
                          ? 'border-oil-400/40 bg-oil-400/5 text-oil-300'
                          : 'border-white/5 text-steel-400 hover:border-white/10 hover:text-steel-200'
                      }`}
                    >
                      {conv[0].text}
                    </button>
                  ))}
                </div>
              )}

              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-sm text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-oil-400/10 text-oil-200 border border-oil-400/20'
                        : 'bg-base-700/60 text-steel-200 border border-white/5'
                    }`}
                  >
                    {msg.text}
                    {msg.actions && (
                      <div className="mt-2 space-y-1">
                        {msg.actions.map((action) => (
                          <button
                            key={action}
                            className="flex items-center gap-1.5 w-full text-left px-2 py-1 rounded-sm bg-base-800/50 hover:bg-oil-400/10 text-[10px] text-steel-400 hover:text-oil-300 transition-colors"
                          >
                            <Wrench className="w-2.5 h-2.5" />
                            {action}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <div className="bg-base-700/60 border border-white/5 px-3 py-2 rounded-sm flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-oil-400"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-white/10 p-3 flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your field..."
                className="flex-1 bg-transparent text-xs text-steel-200 placeholder:text-steel-500 outline-none font-mono"
              />
              <button
                onClick={handleSend}
                className="w-7 h-7 rounded-sm bg-oil-400/10 flex items-center justify-center hover:bg-oil-400/20 transition-colors"
              >
                <Send className="w-3.5 h-3.5 text-oil-300" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
