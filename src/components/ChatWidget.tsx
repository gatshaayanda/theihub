'use client';
import { useEffect, useMemo, useRef, useState } from 'react';

type Msg = { sender: 'user' | 'bot'; text: string };
type Stage = 'browse' | 'inquire' | 'lead' | 'handoff';

const STORAGE_KEY = 'scents_chat_history_v1';
const LEAD_KEY = 'scents_chat_lead_v1';
const BROCHURE_PDF = '/scents-suites-brochure.pdf';
const BOOKING_EMAIL = 'booking@scentsandsuites.com';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState<Stage>('browse');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [unread, setUnread] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const [leadOpen, setLeadOpen] = useState(false);
  const [lead, setLead] = useState({ name: '', email: '', phone: '', message: '' });

  const FALLBACKS = useMemo(
    () => [
      "I'm not sure about that yet — but I can help with rooms, pricing or booking.",
      "Maybe try asking about suites, amenities, or how to book your stay.",
      "Sorry, I didn’t quite get that. Want to see our rooms or contact the team?",
    ],
    []
  );
  const fallbackIdx = useRef(0);
  const rotatedFallback = () => FALLBACKS[fallbackIdx.current++ % FALLBACKS.length];

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMessages(JSON.parse(saved));
      const leadSaved = localStorage.getItem(LEAD_KEY);
      if (leadSaved) setLead((prev) => ({ ...prev, ...(JSON.parse(leadSaved) || {}) }));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (!open && messages.length) setUnread((u) => u + 1);
  }, [messages, open]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          sender: 'bot',
          text:
            "Welcome to Scents & Suites Luxury Villa ✨\nI'm your virtual concierge.\nWould you like to view suites, check availability, or download our brochure?",
        },
      ]);
      setSuggestions(['View suites', 'Check availability', 'Download brochure', 'Contact us']);
      setUnread(0);
      setStage('inquire');
    }
    if (open) setUnread(0);
  }, [open, messages.length]);

  const pushBot = (text: string, sugg?: string[]) => {
    setMessages((p) => [...p, { sender: 'bot', text }]);
    setSuggestions(Array.isArray(sugg) ? sugg : []);
  };

  const toMailto = (leadData: typeof lead, transcript: Msg[]) => {
    const subject = encodeURIComponent(`Guest Inquiry — ${leadData.name || 'Website Visitor'}`);
    const body = [
      `Name: ${leadData.name || '-'}`,
      `Email: ${leadData.email || '-'}`,
      `Phone: ${leadData.phone || '-'}`,
      `Message: ${leadData.message || '-'}`,
      '',
      '— Chat Transcript —',
      ...transcript.map((m) => `${m.sender === 'user' ? 'Guest' : 'Assistant'}: ${m.text}`),
    ].join('\n');
    return `mailto:${BOOKING_EMAIL}?subject=${subject}&body=${encodeURIComponent(body)}`;
  };

  async function sendMessage(override?: string) {
    const text = (override ?? input).trim();
    if (!text) return;
    setMessages((p) => [...p, { sender: 'user', text }]);
    setInput('');
    setTyping(true);

    try {
      const res = await fetch('/api/fake-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      const reply = data?.reply?.trim() || rotatedFallback();
      pushBot(reply, data?.suggestions || []);
      setTyping(false);
    } catch {
      setTyping(false);
      pushBot(rotatedFallback());
    }
  }

  const onSuggestion = (s: string) => {
    if (s === 'Download brochure') window.open(BROCHURE_PDF, '_blank');
    else if (s === 'Book a stay' || s === 'Check availability') window.location.href = '/booking';
    else if (s === 'View suites' || s === 'View rooms') window.location.href = '/room-styles';
    else if (s === 'Contact us' || s === 'Send a message') {
      setLeadOpen(true);
      pushBot('Sure! Leave your details below and our concierge will reach out shortly.');
    } else sendMessage(s);
  };

  const submitLead = () => {
    const clean = {
      name: lead.name.trim(),
      email: lead.email.trim(),
      phone: lead.phone.trim(),
      message: lead.message.trim(),
    };
    try {
      localStorage.setItem(LEAD_KEY, JSON.stringify(clean));
    } catch {}
    window.location.href = toMailto(clean, messages);
    pushBot('Thank you! Our team will contact you soon.', ['View suites', 'Book a stay']);
    setLeadOpen(false);
    setStage('handoff');
  };

  return (
    <>
      {/* Launcher Button (with bounce motion) */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed z-50 bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-white focus:outline-none animate-bounce-soft shadow-lg"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #B89B59, #4C1F26 90%)',
            boxShadow: '0 0 16px rgba(184,155,89,0.45)',
          }}
          aria-label="Open chat"
        >
          💧
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-2 py-0.5">
              {unread}
            </span>
          )}
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div
          className="fixed z-50 bottom-6 right-6 flex flex-col rounded-2xl shadow-2xl border overflow-hidden animate-panel-in"
          style={{
            width: 'min(90vw,22rem)',
            height: leadOpen ? '32rem' : '28rem',
            background: '#FFF9F1',
            borderColor: 'rgba(0,0,0,0.08)',
            animation: 'slideIn 0.6s cubic-bezier(0.45,0,0.25,1)',
          }}
        >
          {/* Header */}
          <div className="px-4 py-3 flex items-center justify-between bg-[#4C1F26]/95 text-white backdrop-blur-sm shadow-inner">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 flex items-center justify-center rounded-full bg-[#D6B678] text-black text-xs font-semibold shadow-inner">
                SS
              </div>
              <div>
                <div className="font-semibold text-sm">Concierge Chat</div>
                <div className="text-[11px] opacity-80">
                  {stage === 'lead' ? 'Leave us a message' : 'Online • Ask away'}
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white text-lg"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm bg-[#FAF6EF]">
            {messages.map((m, i) => {
              const isUser = m.sender === 'user';
              return (
                <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`px-3 py-2 rounded-2xl max-w-[80%] whitespace-pre-line animate-bubble ${
                      isUser
                        ? 'bg-[#D6B678] text-black font-medium shadow'
                        : 'bg-white text-black border border-gray-200 shadow-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}
            {typing && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-2xl bg-white border border-gray-300 text-black">
                  <span className="typing-dot" />
                  <span className="typing-dot" style={{ animationDelay: '120ms' }} />
                  <span className="typing-dot" style={{ animationDelay: '240ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Lead Form */}
          {leadOpen && (
            <div className="p-3 border-t border-gray-200 bg-white space-y-2 text-sm text-black">
              <input
                value={lead.name}
                onChange={(e) => setLead((s) => ({ ...s, name: e.target.value }))}
                placeholder="Your name"
                className="form-input text-black"
              />
              <input
                value={lead.email}
                onChange={(e) => setLead((s) => ({ ...s, email: e.target.value }))}
                placeholder="Email"
                className="form-input text-black"
              />
              <input
                value={lead.phone}
                onChange={(e) => setLead((s) => ({ ...s, phone: e.target.value }))}
                placeholder="Phone"
                className="form-input text-black"
              />
              <textarea
                rows={2}
                value={lead.message}
                onChange={(e) => setLead((s) => ({ ...s, message: e.target.value }))}
                placeholder="Your message (optional)"
                className="form-input text-black"
              />
              <div className="flex gap-2 pt-1">
                <button
                  onClick={submitLead}
                  className="bg-[#D6B678] text-black px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition"
                >
                  Send
                </button>
                <button
                  onClick={() => setLeadOpen(false)}
                  className="bg-gray-200 text-black px-4 py-2 rounded-lg text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Suggestions */}
          {!leadOpen && suggestions.length > 0 && (
            <div className="px-3 py-2 border-t border-gray-200 bg-white flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => onSuggestion(s)}
                  className="text-xs px-3 py-1 rounded-full border border-gray-400 text-black hover:bg-[#D6B678] hover:text-white transition"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          {!leadOpen && (
            <div className="flex p-3 border-t border-gray-200 bg-white gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask us anything..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm text-black focus:outline-none"
              />
              <button
                className="bg-[#D6B678] text-black px-4 py-2 rounded-full text-sm font-semibold hover:brightness-110 transition"
                onClick={() => sendMessage()}
              >
                Send
              </button>
            </div>
          )}
        </div>
      )}

      {/* Animations */}
      <style jsx global>{`
        @keyframes bounce-soft {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-6px); }
          50% { transform: translateY(0); }
          75% { transform: translateY(-3px); }
        }
        .animate-bounce-soft {
          animation: bounce-soft 4s cubic-bezier(0.45, 0, 0.25, 1) infinite;
        }

        @keyframes slideIn {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes bubbleIn {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bubble { animation: bubbleIn 0.3s ease-out; }

        @keyframes typing {
          0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
        .typing-dot {
          display: inline-block;
          width: 6px; height: 6px; margin-right: 4px;
          background: linear-gradient(90deg, #B89B59, #D6B678);
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
        }
      `}</style>
    </>
  );
}
