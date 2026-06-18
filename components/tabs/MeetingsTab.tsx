import React, { useState } from 'react';
import { useConsultantStore } from '@/store/consultantStore';
import { 
  Calendar, 
  Clock, 
  Video, 
  Plus, 
  CheckCircle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  X,
  Users
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function MeetingsTab() {
  const { t } = useTranslation();
  const meetings = useConsultantStore(state => state.meetings);
  const bookMeeting = useConsultantStore(state => state.bookMeeting);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState('2026-05-27');
  const [timeSlot, setTimeSlot] = useState('02:00 PM - 02:30 PM');
  const [topic, setTopic] = useState('');

  const timeSlots = [
    '09:30 AM - 10:00 AM',
    '11:00 AM - 11:30 AM',
    '02:00 PM - 02:30 PM',
    '04:30 PM - 05:00 PM'
  ];

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      alert(t('meetings.alertProvideTopic'));
      return;
    }

    bookMeeting(`PM Sync: ${topic.trim()}`, date, timeSlot);
    setTopic('');
    setIsModalOpen(false);
  };

  // Simple mini-calendar generation for visual mock (May 2026)
  const daysInMonth = 31;
  const firstDayOffset = 5; // Friday
  const miniCalendarDays = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - firstDayOffset + 1;
    return dayNum > 0 && dayNum <= daysInMonth ? dayNum : null;
  });

  const getPortalColor = (index: number) => {
    const colors = ['bg-primary', 'bg-cyan-400', 'bg-amber-400', 'bg-emerald-400'];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-black text-white flex items-center gap-2">
          <Calendar className="text-primary" />
          {t('meetings.title')}
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          {t('meetings.desc')}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:min-h-[600px]">
        
        {/* Left Sidebar */}
        <div className="lg:w-[280px] bg-card border border-white/5 rounded-3xl p-6 flex flex-col shrink-0 shadow-lg">
          
          {/* Create Button FAB */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-3 bg-primary hover:bg-[#11aa6a] text-slate-950 px-6 py-4 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all w-full justify-center group"
          >
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            {t('meetings.reserveSlot')}
          </button>

          {/* Mini Calendar Mock */}
          <div className="mt-8 select-none">
            <div className="flex items-center justify-between mb-4 px-2 text-sm font-bold text-white">
              <span>{t('meetings.monthYearMock')}</span>
              <div className="flex gap-2">
                <ChevronLeft size={16} className="cursor-pointer text-slate-400 hover:text-white transition-colors" />
                <ChevronRight size={16} className="cursor-pointer text-slate-400 hover:text-white transition-colors" />
              </div>
            </div>
            <div className="grid grid-cols-7 text-center text-[10px] font-black uppercase text-slate-500 mb-2 font-mono">
              {(t('meetings.daysOfWeek') as unknown as string[]).map((d, idx) => (
                <div key={idx}>{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 text-center text-xs gap-y-1 font-mono">
              {miniCalendarDays.map((day, i) => (
                <div key={i} className="flex justify-center items-center h-8">
                  {day && (
                    <button className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${
                      day === 27 ? 'bg-primary text-slate-950 font-bold shadow-md shadow-primary/20' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}>
                      {day}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 space-y-4 px-2 pt-8 border-t border-white/5">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-wider font-mono">{t('meetings.activeCalendars')}</h3>
            <div className="flex items-center gap-3 text-sm font-semibold text-slate-300">
              <input type="checkbox" checked readOnly className="accent-primary w-4 h-4 rounded-sm" />
              <span>{t('meetings.milestoneAlignments')}</span>
            </div>
          </div>

        </div>

        {/* Main Content - Schedule View */}
        <div className="flex-1 bg-card border border-white/5 rounded-3xl p-6 lg:p-10 overflow-y-auto shadow-lg relative">
          
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
              <h2 className="text-xl font-bold text-white font-mono uppercase tracking-tight">{t('meetings.agenda')}</h2>
            </div>
            
            {meetings.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
                <div className="p-6 bg-primary/5 border border-primary/10 rounded-full mb-6">
                  <Calendar size={48} className="text-primary opacity-80" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{t('meetings.noAlignments')}</h3>
                <p className="text-slate-400 text-sm max-w-sm mb-6">{t('meetings.pickCalendarSlot')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {meetings.map((meet, idx) => (
                  <div key={meet.id} className="flex group">
                    {/* Time Gutter */}
                    <div className="w-28 flex-shrink-0 pt-5 text-[11px] font-bold text-slate-500 text-right pr-6 font-mono">
                      {meet.timeSlot.split(' - ')[0]}
                    </div>
                    
                    {/* Event Card */}
                    <div className={`flex-1 relative pl-5 py-5 pr-6 rounded-2xl transition-colors bg-slate-900/40 hover:bg-slate-900/80 border border-white/5 hover:border-white/10 group flex flex-col md:flex-row md:items-center justify-between gap-4 overflow-hidden shadow-sm`}>
                      
                      {/* Left colored stripe */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getPortalColor(idx)}`} />

                      <div className="space-y-1.5">
                        <h4 className="text-sm font-extrabold text-white">{meet.title}</h4>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                          <span className="flex items-center gap-1.5"><Calendar size={12} /> {meet.date}</span>
                          <span className="flex items-center gap-1.5"><Clock size={12} /> {meet.timeSlot}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <a 
                          href={meet.joinLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/20 font-bold text-[11px] rounded-xl transition-all shadow-sm"
                        >
                          <Video size={14} />
                          {t('meetings.joinCall')}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
          <div className="bg-card border border-white/10 shadow-2xl rounded-3xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
              <span className="text-sm font-bold text-white uppercase tracking-wider font-mono">{t('meetings.reserveAlignmentSlot')}</span>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form onSubmit={handleBooking} className="space-y-6">
                
                {/* Title Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('meetings.alignmentSubject')}</label>
                  <input
                    type="text"
                    placeholder={t('meetings.subjectPlaceholder')}
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 focus:border-primary/50 rounded-xl text-xs font-semibold text-white focus:outline-none transition-colors"
                    required
                  />
                </div>

                {/* Date & Time Selectors */}
                <div className="flex flex-col gap-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('meetings.meetingTarget')}</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                          <Calendar size={14} />
                        </div>
                        <input
                          type="date"
                          value={date}
                          onChange={e => setDate(e.target.value)}
                          className="w-full pl-9 pr-3 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-primary/50 transition-colors font-mono appearance-none"
                          min="2026-05-25"
                          required
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                          <Clock size={14} />
                        </div>
                        <select 
                          value={timeSlot}
                          onChange={e => setTimeSlot(e.target.value)}
                          className="w-full pl-9 pr-3 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-primary/50 transition-colors font-mono appearance-none"
                        >
                          {timeSlots.map(slot => (
                            <option key={slot} value={slot}>{slot}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('meetings.participant')}</label>
                    <div className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 rounded-xl text-xs font-bold text-slate-400 flex items-center gap-2">
                      <Users size={14} />
                      {t('meetings.marcusVance')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 mt-4 border-t border-white/5">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white transition-colors"
                  >
                    {t('meetings.cancel')}
                  </button>
                  <button 
                    type="submit"
                    className="px-6 py-2.5 rounded-xl font-black bg-primary hover:bg-[#11aa6a] text-slate-950 transition-all shadow-md shadow-primary/10 flex items-center gap-2"
                  >
                    {t('meetings.saveBooking')}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
