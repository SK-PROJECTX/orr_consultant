import React, { useState, useRef, useEffect } from 'react';
import { useConsultantStore } from '@/store/consultantStore';
import {
  Send,
  User,
  ShieldCheck,
  MessageSquare,
  Terminal,
  HelpCircle,
  Clock,
  FilePlus,
  X,
  File,
  Sparkles,
  Bot
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function ChatTab() {
  const { t } = useTranslation();
  const messages = useConsultantStore(state => state.messages);
  const sendChatMessage = useConsultantStore(state => state.sendChatMessage);
  const fetchMessages = useConsultantStore(state => state.fetchMessages);
  const clearMessages = useConsultantStore(state => state.clearMessages);

  const lastFetchedRef = useRef<string | null>(null);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachment, setAttachment] = useState<{name: string, url: string, type: string} | null>(null);
  const [activeContact, setActiveContact] = useState('pm');
  const [directory, setDirectory] = useState<any[]>([]);

  const streamEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages load
  const scrollToBottom = () => {
    streamEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch directory on mount
  useEffect(() => {
    const cNum = sessionStorage.getItem('consultant_number');
    if (!cNum) return;
    fetch(`https://orr-backend-105825824472.asia-southeast2.run.app/api/v1/consultants/${cNum}/messages/directory/`)
      .then(res => res.json())
      .then(resData => {
        let data = resData;
        while (data && !Array.isArray(data) && data.data !== undefined) {
          data = data.data;
        }
        if (Array.isArray(data)) {
          setDirectory(data);
          if (data.length > 0) setActiveContact(data[0].id);
        }
      })
      .catch(err => console.error('Failed to fetch directory', err));
  }, []);

  // Poll messages for activeContact
  useEffect(() => {
    if (!activeContact) return;
    
    clearMessages();
    lastFetchedRef.current = null;
    
    const fetchFn = async () => {
      await fetchMessages(activeContact, lastFetchedRef.current || undefined);
      const msgs = useConsultantStore.getState().messages;
      if (msgs.length > 0) {
        lastFetchedRef.current = msgs[msgs.length - 1].timestamp;
      }
    };
    
    fetchFn();
    const interval = setInterval(fetchFn, 10000);
    return () => clearInterval(interval);
  }, [activeContact]);

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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() && !attachment) return;

    const optimisticMsg = {
      id: `temp-${Date.now()}`,
      sender: 'CONSULTANT' as const,
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
      attachment: attachment ? { name: attachment.name, url: attachment.url, type: attachment.type } : undefined
    };
    
    useConsultantStore.setState(state => ({ messages: [...state.messages, optimisticMsg] }));

    try {
      sendChatMessage(inputText.trim(), attachment || undefined, activeContact);
    } catch (e) {
      console.error("Failed to send", e);
      useConsultantStore.setState(state => ({ messages: state.messages.filter(m => m.id !== optimisticMsg.id) }));
    }
    
    setInputText('');
    setAttachment(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setAttachment({
      name: file.name,
      url,
      type: file.type
    });

    e.target.value = '';
  };

  // Quick suggestion chips
  const suggestions = [
    { text: t('chat.sugText1'), label: t('chat.sugLabel1') },
    { text: t('chat.sugText2'), label: t('chat.sugLabel2') },
    { text: t('chat.sugText3'), label: t('chat.sugLabel3') }
  ];

  const handleSuggestionClick = (text: string) => {
    sendChatMessage(text, undefined, activeContact);
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

      <div className="flex bg-card backdrop-blur-xl border border-white/10 rounded-3xl h-[600px] shadow-2xl shadow-black/40 overflow-hidden">
        
        {/* Contacts Sidebar */}
        <div className="w-64 border-r border-white/10 bg-white/5 flex flex-col shrink-0 hidden md:flex">
          <div className="p-4 border-b border-white/10 font-black text-white text-sm flex items-center gap-2">
            <User size={16} className="text-primary" />
            Directory
          </div>
          <div className="flex-1 overflow-y-auto">
            {directory.map(c => (
              <div 
                key={c.id} 
                onClick={() => setActiveContact(c.id)}
                className={`p-4 border-b border-white/5 cursor-pointer transition-colors flex flex-col gap-1 ${activeContact === c.id ? 'bg-white/10 border-l-2 border-l-primary' : 'hover:bg-white/5 border-l-2 border-l-transparent'}`}
              >
                <span className="text-sm font-bold text-white">{c.name}</span>
                <span className="text-[10px] uppercase font-mono text-slate-400">{c.role}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0 relative">

          {/* Channel topbar */}
          <div className="px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-md flex justify-between items-center select-none z-10 relative shadow-sm">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {directory.find(c => c.id === activeContact)?.name || 'Project Manager'}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">{t('chat.channelNode')}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-semibold text-primary flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 shadow-inner">
                <Clock size={12} className="animate-spin-slow" />
                {t('chat.realTimeSyncActive')}
              </span>
            </div>
          </div>

          {/* Active message list */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 relative">
            {messages.map(msg => {
              const isConsultant = msg.sender === 'CONSULTANT' || msg.sender === 'me';
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
                    <span className={`text-[10px] font-bold text-slate-400 block px-1 ${isConsultant ? 'text-right' : 'text-left'}`}>
                      {isConsultant ? 'Consultant' : (directory.find(c => c.id === activeContact)?.name || 'Project Manager')}
                    </span>
                    <div className={`px-4 py-3 text-sm leading-relaxed font-medium shadow-md ${isConsultant
                        ? 'bg-gradient-to-br from-primary to-[#11aa6a] text-slate-950 rounded-2xl rounded-br-sm'
                        : 'bg-slate-800/80 backdrop-blur-sm border border-white/5 text-slate-200 rounded-2xl rounded-bl-sm'
                      }`}>
                      {msg.attachment && (
                        <div className={`flex items-center gap-3 p-2.5 rounded-xl mb-2 border ${isConsultant ? 'bg-black/10 border-black/10' : 'bg-white/5 border-white/10'}`}>
                          {msg.attachment.type.startsWith('image/') ? (
                            <img src={msg.attachment.url} alt={msg.attachment.name} className="w-10 h-10 rounded object-cover shadow-sm border border-white/10" />
                          ) : (
                            <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${isConsultant ? 'bg-black/10' : 'bg-white/10'}`}>
                              <File size={20} className={isConsultant ? "text-slate-900" : "text-primary"} />
                            </div>
                          )}
                          <span className={`text-xs font-bold truncate max-w-[150px] ${isConsultant ? 'text-slate-900' : 'text-white'}`}>
                            {msg.attachment.name}
                          </span>
                        </div>
                      )}
                      {msg.text && <div>{msg.text}</div>}
                    </div>
                    <span className={`text-[10px] text-slate-500 block font-medium ${isConsultant ? 'text-right' : 'text-left'}`}>
                      {new Date(msg.created_at || msg.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
          <div className="bg-white/5 backdrop-blur-xl border-t border-white/10 relative">
            {/* Attachment Preview */}
            {attachment && (
              <div className="absolute bottom-full left-4 mb-2 p-3 bg-slate-800 border border-white/10 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 z-20">
                {attachment.type.startsWith('image/') ? (
                   <img src={attachment.url} alt="preview" className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                ) : (
                   <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center shadow-sm">
                     <File size={24} className="text-primary" />
                   </div>
                )}
                <div className="flex flex-col pr-2">
                  <span className="text-xs font-bold text-white max-w-[180px] truncate">{attachment.name}</span>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">Attached file</span>
                </div>
                <button 
                  onClick={() => setAttachment(null)}
                  className="p-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
                >
                  <X size={16} />
                </button>
              </div>
            )}

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
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-[52px] h-[52px] rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-primary transition-all cursor-pointer flex items-center justify-center shrink-0 shadow-inner"
              >
                <FilePlus size={22} />
              </button>
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
