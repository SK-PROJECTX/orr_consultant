import React, { useState } from 'react';
import { useConsultantStore } from '@/store/consultantStore';
import { 
  Calendar, 
  Clock, 
  Video, 
  Plus, 
  CheckCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function MeetingsTab() {
  const meetings = useConsultantStore(state => state.meetings);
  const bookMeeting = useConsultantStore(state => state.bookMeeting);

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
      alert("Please provide the sync alignment topic.");
      return;
    }

    bookMeeting(`PM Sync: ${topic.trim()}`, date, timeSlot);
    setTopic('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-black text-white flex items-center gap-2">
          <Calendar className="text-primary" />
          PM Meetings Planner
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Coordinate brief engineering reviews and syncs with Marcus Vance (PM) to keep deliverables on schedule.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left 2 Columns: Meeting Booking Form */}
        <div className="lg:col-span-2 space-y-4">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block font-mono">Reserve Alignment Slot</span>
          
          <div className="bg-card/40 border border-white/5 rounded-3xl p-6 space-y-5">
            <form onSubmit={handleBooking} className="space-y-4">
              
              {/* Sync Topic */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider font-mono">Alignment Goal / Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Ingestion pipeline checkpoint review"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 focus:border-primary/50 rounded-xl text-xs font-semibold text-white focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Date selection */}
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider font-mono">Meeting Target Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-primary/50 transition-colors font-mono"
                  min="2026-05-25"
                  required
                />
              </div>

              {/* Time Slots selector */}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider block font-mono">Select Available Time</label>
                <div className="grid grid-cols-1 gap-2">
                  {timeSlots.map(slot => {
                    const isSelected = timeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeSlot(slot)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left cursor-pointer ${
                          isSelected 
                            ? 'bg-primary/5 border-primary text-white shadow-sm' 
                            : 'bg-slate-950/20 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-300'
                        }`}
                      >
                        <span className="text-[11px] font-bold font-mono">{slot}</span>
                        <div className={`w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-primary border-primary text-background' : 'border-white/20'
                        }`}>
                          {isSelected && <CheckCircle size={12} className="stroke-[3px]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Booking Trigger CTA */}
              <button
                type="submit"
                className="w-full mt-2 flex items-center justify-center gap-1.5 px-6 py-3 bg-primary hover:bg-lemon text-background font-black text-xs rounded-xl transition-all shadow-lg shadow-primary/10 cursor-pointer"
              >
                <Plus size={14} />
                Reserve Video Sync
              </button>

            </form>
          </div>
        </div>

        {/* Right 3 Columns: Meetings logs lists */}
        <div className="lg:col-span-3 space-y-4 animate-in fade-in duration-300">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block font-mono">Milestone Alignment Syncs</span>
          
          {meetings.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/10 border border-white/5 rounded-2xl">
              <Clock size={28} className="text-slate-600 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-slate-400">No alignments scheduled</h4>
              <p className="text-[10px] text-slate-500">Pick a calendar slot to reserve a review call with Marcus.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {meetings.map(meet => {
                return (
                  <div 
                    key={meet.id}
                    className="p-5 rounded-2xl bg-card border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-slate-900/60 border border-white/5 rounded-xl text-primary flex-shrink-0">
                        <Video size={20} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs lg:text-sm font-extrabold text-white leading-normal">{meet.title}</h4>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                          <span>Date: <strong>{meet.date}</strong></span>
                          <span>•</span>
                          <span>Slot: <strong>{meet.timeSlot}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-row items-center justify-between w-full md:w-auto border-t border-white/5 md:border-transparent pt-3 md:pt-0">
                      <a 
                        href={meet.joinLink}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-[10px] rounded-xl transition-all shadow-md shadow-emerald-500/10 cursor-pointer"
                      >
                        Join Zoom Call
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
