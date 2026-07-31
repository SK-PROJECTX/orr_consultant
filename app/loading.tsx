import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4 animate-in fade-in duration-500">
      <div className="relative flex items-center justify-center">
        <div className="absolute w-16 h-16 bg-primary/20 rounded-full blur-xl animate-pulse" />
        <Loader2 className="w-12 h-12 text-[#61FD51] animate-spin relative z-10" />
      </div>
      <div className="flex flex-col items-center gap-1.5 text-center">
        <p className="text-sm font-bold text-white tracking-wide font-mono">
          Loading Specialist Portal...
        </p>
        <p className="text-xs font-medium text-slate-400 font-mono opacity-70">
          Establishing secure environment
        </p>
      </div>
    </div>
  );
}
