import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  sublabel?: string;
  minHeight?: string;
}

export default function LoadingSpinner({
  label = 'Loading Specialist Portal...',
  sublabel = 'Syncing workspace data',
  minHeight = 'min-h-[60vh]'
}: LoadingSpinnerProps) {
  return (
    <div className={`w-full ${minHeight} flex flex-col items-center justify-center p-8 space-y-4 animate-in fade-in duration-500`}>
      <div className="relative flex items-center justify-center">
        <div className="absolute w-16 h-16 bg-[#61FD51]/20 rounded-full blur-xl animate-pulse" />
        <Loader2 className="w-12 h-12 text-[#61FD51] animate-spin relative z-10" />
      </div>
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-sm font-bold text-white tracking-wide font-mono">
          {label}
        </p>
        {sublabel && (
          <p className="text-xs font-medium text-slate-400 font-mono opacity-70">
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
}
