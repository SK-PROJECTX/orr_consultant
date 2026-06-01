import React, { useState, useRef, useEffect } from 'react';
import { useConsultantStore } from '@/store/consultantStore';
import { 
  Send, 
  User, 
  ShieldCheck, 
  MessageSquare, 
  Terminal, 
  HelpCircle,
  Clock
} from 'lucide-react';

export default function ChatTab() {
  const messages = useConsultantStore(state => state.messages);
  const sendChatMessage = useConsultantStore(state => state.sendChatMessage);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const streamEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages load
  const scrollToBottom = () => {
    streamEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    // Simulate typing indicator if the last message is from the consultant
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.sender === 'CONSULTANT') {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 1100);
      return () => clearTimeout(timer);
    } else {
      setIsTyping(false);
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    sendChatMessage(inputText.trim());
    setInputText('');
  };

  // Quick suggestion chips
  const suggestions = [
    { text: "When is the next billing cycle processed?", label: "Billing cycle query" },
    { text: "How do I request a task deadline extension?", label: "Deadline extension" },
    { text: "Where can I review active contract parameters?", label: "Audit specs" }
  ];

  const handleSuggestionClick = (text: string) => {
    sendChatMessage(text);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Tab Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-black text-white flex items-center gap-2">
          <MessageSquare className="text-primary" />
          PM Secure Messaging
        </h1>
        <p className="text-slate-400 text-xs mt-1 font-sans">
          Authorized end-to-end encrypted messaging link. All logs are stored securely for operational compliance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Secure Channels contact card */}
        <div className="space-y-3.5">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block font-mono">Secure Connections</span>
          <div className="p-4 rounded-xl bg-card border border-primary/20 relative overflow-hidden flex items-center gap-3">
            <div className="absolute right-0 top-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />
            
            <div className="w-10 h-10 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-primary relative">
              <User size={18} className="text-slate-300" />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary border-2 border-card rounded-full" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-black text-white truncate">Marcus Vance (PM)</h4>
              <p className="text-[9px] text-primary flex items-center gap-1 mt-0.5 font-semibold font-mono">
                <ShieldCheck size={10} />
                Secure Link Active
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-900/20 border border-white/5 rounded-2xl space-y-2 text-left font-mono text-[9px] text-slate-400">
            <div className="flex gap-1 items-center font-black text-slate-300 uppercase mb-1">
              <Terminal size={10} />
              Session Details
            </div>
            <div><strong className="text-slate-300">Gateway:</strong> ORR-SECURE-9</div>
            <div><strong className="text-slate-300">Key:</strong> RSA-4096-AES</div>
            <div><strong className="text-slate-300">Log Policy:</strong> Compliance Archival</div>
          </div>
        </div>

        {/* Right 3 Columns: Secure Chat Stream */}
        <div className="lg:col-span-3 flex flex-col bg-card/40 border border-white/5 rounded-3xl h-[520px] overflow-hidden">
          
          {/* Channel topbar */}
          <div className="px-6 py-4 border-b border-white/5 bg-slate-950/20 flex justify-between items-center select-none">
            <div className="space-y-0.5">
              <h3 className="text-xs font-black text-white">Project Manager Liaison Chat</h3>
              <p className="text-[9px] text-slate-500 font-mono">Channel Node: M-VANCE-PM-SECURE</p>
            </div>
            <span className="text-[9px] font-mono font-bold text-slate-400 flex items-center gap-1.5 bg-slate-900 border border-white/5 px-2.5 py-1 rounded">
              <Clock size={10} className="text-primary animate-spin-slow" />
              Real-time Sync Active
            </span>
          </div>

          {/* Active message list */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map(msg => {
              const isConsultant = msg.sender === 'CONSULTANT';
              return (
                <div 
                  key={msg.id}
                  className={`flex gap-3 max-w-[80%] ${isConsultant ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  {/* Sender Avatar */}
                  <div className={`w-8 h-8 rounded-lg border border-white/5 flex items-center justify-center flex-shrink-0 ${
                    isConsultant ? 'bg-primary/20 text-primary' : 'bg-slate-800 text-slate-400'
                  }`}>
                    <User size={14} />
                  </div>

                  {/* Bubble content */}
                  <div className="space-y-1">
                    <div className={`p-3.5 rounded-2xl text-xs leading-relaxed font-semibold ${
                      isConsultant 
                        ? 'bg-primary text-background rounded-tr-none shadow shadow-primary/5 font-extrabold' 
                        : 'bg-slate-900/80 border border-white/5 text-slate-200 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                    <span className={`text-[8px] font-mono text-slate-500 block ${isConsultant ? 'text-right' : ''}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Smart Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-white/5 flex items-center justify-center flex-shrink-0 text-slate-400">
                  <User size={14} />
                </div>
                <div className="p-3 bg-slate-900/40 border border-white/5 rounded-2xl rounded-tl-none flex items-center gap-1 text-[10px] text-slate-500 font-bold font-mono">
                  PM is typing
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            )}

            <div ref={streamEndRef} />
          </div>

          {/* Quick suggestions area */}
          <div className="px-6 py-2.5 bg-slate-950/20 border-t border-white/5 flex flex-wrap gap-2">
            <span className="text-[8px] font-mono font-black text-slate-500 uppercase flex items-center gap-1 mr-1">
              <HelpCircle size={10} />
              Quick Queries
            </span>
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(sug.text)}
                className="text-[9px] font-bold text-slate-400 bg-slate-900 hover:bg-slate-850 hover:text-white border border-white/5 rounded-lg px-2.5 py-1 transition cursor-pointer"
              >
                {sug.label}
              </button>
            ))}
          </div>

          {/* Chat text box input */}
          <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-surface flex gap-3">
            <input
              type="text"
              placeholder="Send secure compliance message to PM..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-950/60 border border-white/10 focus:border-primary/50 rounded-xl text-xs font-semibold text-white focus:outline-none transition-colors"
              required
            />
            <button
              type="submit"
              className="bg-primary hover:bg-lemon text-background p-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center"
            >
              <Send size={16} />
            </button>
          </form>

        </div>
      </div>

    </div>
  );
}
