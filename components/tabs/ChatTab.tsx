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
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function ChatTab() {
  const { t } = useTranslation();
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
    { text: t('chat.sugText1'), label: t('chat.sugLabel1') },
    { text: t('chat.sugText2'), label: t('chat.sugLabel2') },
    { text: t('chat.sugText3'), label: t('chat.sugLabel3') }
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
          {t('chat.title')}
        </h1>
        <p className="text-slate-400 text-sm mt-1.5 font-medium max-w-2xl">
          {t('chat.desc')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Secure Channels contact card */}
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">{t('chat.secureConnections')}</span>
          
          {/* Modern Contact Card */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden flex items-center gap-4 shadow-lg shadow-black/20">
            <div className="absolute right-0 top-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
            
            <div className="w-12 h-12 rounded-full bg-slate-800 border-2 border-white/10 flex items-center justify-center text-primary relative shadow-inner">
              <User size={20} className="text-slate-300" />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full shadow-sm shadow-emerald-500/50" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-white truncate">Marcus Vance</h4>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1.5 mt-1 font-semibold">
                <ShieldCheck size={12} />
                {t('chat.secureLinkActive')}
              </p>
            </div>
          </div>

          {/* Elegant Session Details */}
          <div className="p-5 bg-white/5 border border-white/10 rounded-2xl space-y-3 shadow-lg shadow-black/20 backdrop-blur-sm">
            <div className="flex gap-2 items-center font-bold text-slate-300 text-xs mb-3 pb-3 border-b border-white/5">
              <Terminal size={14} className="text-primary" />
              {t('chat.sessionDetails')}
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">{t('chat.gateway')}</span>
                <span className="font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-white/5">ORR-SECURE-9</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">{t('chat.key')}</span>
                <span className="font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-white/5">RSA-4096-AES</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">{t('chat.logPolicy')}</span>
                <span className="text-emerald-400 font-medium">{t('chat.complianceArchival')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 3 Columns: Secure Chat Stream */}
        <div className="lg:col-span-3 flex flex-col bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl h-[560px] shadow-2xl shadow-black/40 overflow-hidden">
          
          {/* Channel topbar */}
          <div className="px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-md flex justify-between items-center select-none z-10 relative shadow-sm">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {t('chat.pmLiaisonChat')}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">{t('chat.channelNode')}</p>
            </div>
            <span className="text-[10px] font-semibold text-primary flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 shadow-inner">
              <Clock size={12} className="animate-spin-slow" />
              {t('chat.realTimeSyncActive')}
            </span>
          </div>

          {/* Active message list */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 relative">
            {messages.map(msg => {
              const isConsultant = msg.sender === 'CONSULTANT';
              return (
                <div 
                  key={msg.id}
                  className={`flex gap-3 w-full ${isConsultant ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Sender Avatar - Left for PM */}
                  {!isConsultant && (
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-sm mt-auto">
                      <User size={14} className="text-slate-400" />
                    </div>
                  )}

                  {/* Bubble content */}
                  <div className={`space-y-1.5 max-w-[75%]`}>
                    <div className={`px-4 py-3 text-sm leading-relaxed font-medium shadow-md ${
                      isConsultant 
                        ? 'bg-gradient-to-br from-primary to-[#11aa6a] text-slate-950 rounded-2xl rounded-br-sm' 
                        : 'bg-slate-800/80 backdrop-blur-sm border border-white/5 text-slate-200 rounded-2xl rounded-bl-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <span className={`text-[10px] text-slate-500 block font-medium ${isConsultant ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Sender Avatar - Right for Consultant */}
                  {isConsultant && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 shadow-sm mt-auto">
                      <User size={14} className="text-primary" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Smart Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start items-end animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-sm mt-auto">
                  <User size={14} className="text-slate-400" />
                </div>
                <div className="px-4 py-3.5 bg-slate-800/50 backdrop-blur-sm border border-white/5 rounded-2xl rounded-bl-sm flex items-center gap-1.5 shadow-md h-11">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            )}

            <div ref={streamEndRef} className="h-1" />
          </div>

          {/* Input Area Section */}
          <div className="bg-white/5 backdrop-blur-xl border-t border-white/10">
            {/* Quick suggestions area */}
            <div className="px-6 py-3 flex items-center gap-2 overflow-x-auto hide-scrollbar border-b border-white/5">
              <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 mr-2 shrink-0">
                <HelpCircle size={12} />
                {t('chat.quickQueries')}
              </span>
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(sug.text)}
                  className="shrink-0 text-[11px] font-semibold text-slate-300 bg-slate-900/50 hover:bg-white/10 border border-white/10 rounded-full px-4 py-1.5 transition-all cursor-pointer shadow-sm"
                >
                  {sug.label}
                </button>
              ))}
            </div>

            {/* Chat text box input */}
            <form onSubmit={handleSend} className="p-4 flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  placeholder={t('chat.sendSecureMessagePlaceholder')}
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e as unknown as React.FormEvent);
                    }
                  }}
                  className="w-full pl-5 pr-12 py-3.5 bg-slate-950/50 border border-white/10 focus:border-primary/50 rounded-3xl text-sm font-medium text-white focus:outline-none transition-colors shadow-inner resize-none min-h-[52px] max-h-[120px]"
                  rows={1}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-[52px] h-[52px] rounded-full bg-primary hover:bg-[#11aa6a] text-slate-950 transition-all cursor-pointer flex items-center justify-center shadow-lg shadow-primary/20 shrink-0 hover:scale-105 active:scale-95"
              >
                <Send size={20} className="ml-1" />
              </button>
            </form>
          </div>

        </div>
      </div>

    </div>
  );
}
