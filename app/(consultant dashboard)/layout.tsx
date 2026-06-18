'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useConsultantStore } from '@/store/consultantStore';
import { useTranslation } from '@/lib/i18n/useTranslation';
import Sidebar from '@/components/Sidebar';
import ConsultantOnboarding from '@/components/onboarding/ConsultantOnboarding';

// Lucide Icons
import { 
  Bell, 
  X, 
  ShieldAlert, 
  CheckCircle, 
  Info,
  ShieldCheck, 
  Cpu, 
  Terminal, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Laptop
} from 'lucide-react';



export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  
  const isAuthenticated = useConsultantStore(state => state.isAuthenticated);
  const onboardingCompleted = useConsultantStore(state => state.onboardingCompleted);
  const notifications = useConsultantStore(state => state.notifications);
  const markNotificationRead = useConsultantStore(state => state.markNotificationRead);
  const clearNotifications = useConsultantStore(state => state.clearNotifications);
  const logoutConsultant = useConsultantStore(state => state.logoutConsultant);

  const [showAlertLog, setShowAlertLog] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isAuthPage = pathname === '/signin' || pathname === '/register';

  useEffect(() => {
    if (isMounted && !isAuthenticated && !isAuthPage) {
      router.replace('/signin');
    }
  }, [isMounted, isAuthenticated, isAuthPage, router]);

  // Inactivity Timeout (10 minutes)
  useEffect(() => {
    if (!isAuthenticated || isAuthPage) return;

    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      // 10 minutes = 10 * 60 * 1000 = 600000 ms
      timeoutId = setTimeout(() => {
        logoutConsultant();
        router.replace('/signin');
      }, 600000);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => document.addEventListener(event, resetTimer, true));

    // Initialize timer
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => document.removeEventListener(event, resetTimer, true));
    };
  }, [isAuthenticated, isAuthPage, logoutConsultant, router]);

  // If it's a signin or register page, render directly without sidebar wrappers
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Auth Protection Gatekeeper
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#61FD51] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Onboarding Compliance Guard
  if (!onboardingCompleted) {
    return <ConsultantOnboarding />;
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'PAYMENT':
        return <CheckCircle size={14} className="text-emerald-400" />;
      case 'JOB':
        return <Info size={14} className="text-cyan-400" />;
      default:
        return <ShieldAlert size={14} className="text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row relative overflow-hidden w-full">
      {/* Ambience glow elements */}
      <div className="absolute top-1/3 left-1/4 w-[480px] h-[480px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[480px] h-[480px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Shared Sidebar */}
      <Sidebar openNotifications={() => setShowAlertLog(true)} />

      {/* Scrolling central canvas */}
      <main className="flex-1 h-screen overflow-y-auto px-6 py-8 lg:p-12 z-10 w-full">
        <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
          {children}
        </div>
      </main>

      {/* Shared Alert Logs Sidepop */}
      {showAlertLog && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 z-40 animate-in fade-in duration-300 backdrop-blur-sm"
            onClick={() => setShowAlertLog(false)}
          />
          <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-surface border-l border-white/10 p-6 z-50 animate-in slide-in-from-right duration-300 shadow-2xl flex flex-col">
            
            <div className="flex justify-between items-center pb-6 border-b border-white/5 shrink-0">
              <div className="flex items-center gap-2">
                <Bell size={20} className="text-primary" />
                <h3 className="text-base font-extrabold text-white">{t('layout.alertLogTitle')}</h3>
              </div>
              <button 
                onClick={() => setShowAlertLog(false)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto py-6 pr-2 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-500 font-medium">
                  {t('layout.noAlerts')}
                </div>
              ) : (
                notifications.map(not => (
                  <div 
                    key={not.id}
                    onClick={() => markNotificationRead(not.id)}
                    className={`p-3.5 rounded-xl border flex gap-3 text-left cursor-pointer transition-all ${
                      not.read 
                        ? 'bg-slate-900/10 border-white/5 text-slate-400 opacity-60' 
                        : 'bg-slate-900/60 border-primary/20 text-white shadow-sm'
                    }`}
                  >
                    <div className="mt-1 flex-shrink-0">
                      {getAlertIcon(not.type)}
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <h4 className="text-xs font-black truncate">{not.title}</h4>
                      <p className="text-[10px] text-slate-400 leading-relaxed">{not.text}</p>
                      <span className="text-[8px] font-mono text-slate-500 block mt-1">
                        {new Date(not.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {!not.read && (
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-3 pt-6 border-t border-white/5 shrink-0">
              <button
                onClick={clearNotifications}
                disabled={notifications.length === 0}
                className="flex-1 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 disabled:opacity-40 text-red-400 font-bold py-3 rounded-xl transition text-xs cursor-pointer"
              >
                {t('layout.clearAll')}
              </button>
              <button
                onClick={() => setShowAlertLog(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition text-xs cursor-pointer"
              >
                {t('layout.closeLogs')}
              </button>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
