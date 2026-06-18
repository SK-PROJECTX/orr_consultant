import React, { useState } from 'react';
import Link from 'next/link';
import { useConsultantStore, JobOffer } from '@/store/consultantStore';
import { 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  Clock, 
  ArrowUpRight, 
  Briefcase, 
  FileText, 
  Check, 
  X, 
  ChevronRight, 
  Sparkles 
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function DashboardTab() {
  const { t } = useTranslation();
  const onboardingData = useConsultantStore(state => state.onboardingData);
  const availableJobs = useConsultantStore(state => state.availableJobs);
  const activeJobs = useConsultantStore(state => state.activeJobs);
  const acceptJob = useConsultantStore(state => state.acceptJob);
  const rejectJob = useConsultantStore(state => state.rejectJob);
  
  const walletBalance = useConsultantStore(state => state.walletBalance);
  const tasks = useConsultantStore(state => state.tasks);
  const notifications = useConsultantStore(state => state.notifications);
  const markNotificationRead = useConsultantStore(state => state.markNotificationRead);
  const clearNotifications = useConsultantStore(state => state.clearNotifications);

  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  const activeTasks = tasks.filter(t => t.status !== 'COMPLETED');
  const pendingInvoicesAmount = walletBalance.pending;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Greeting Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 border border-white/5 backdrop-blur-md p-6 lg:p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full uppercase tracking-wider font-mono">
              {t('dashboard.partnerWorkspaceActive')}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
            {t('dashboard.welcomeBack')}
          </h1>
          <p className="text-slate-400 text-xs max-w-xl">
            {t('dashboard.authorizedFor')} <strong className="text-slate-300 capitalize">{onboardingData?.industry || t('dashboard.generalConsultation')}</strong> {t('dashboard.scopesNoDirect')}
          </p>
        </div>
        <div className="text-xs font-mono text-slate-500 bg-slate-950/40 px-4 py-2.5 border border-white/5 rounded-xl">
          {t('dashboard.nodeKey')} <span className="text-slate-300 font-bold">ORR-CONS-{onboardingData?.industry?.substring(0, 3).toUpperCase() || 'GEN'}</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-2xl bg-card border border-white/5 relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono block">{t('dashboard.availableWalletBalance')}</span>
          <h3 className="text-2xl font-black text-white mt-2">${walletBalance.available.toLocaleString()}</h3>
          <Link 
            href="/wallet"
            className="flex items-center gap-1.5 mt-3 text-[10px] font-bold text-primary hover:text-white transition-colors cursor-pointer"
          >
            {t('dashboard.manageWallet')}
            <ArrowUpRight size={12} />
          </Link>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-2xl bg-card border border-white/5 relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-emerald-500/5 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono block">{t('dashboard.inReviewPending')}</span>
          <h3 className="text-2xl font-black text-white mt-2">${pendingInvoicesAmount.toLocaleString()}</h3>
          <p className="text-[10px] text-slate-400 mt-3 font-semibold">{t('dashboard.biWeeklyBilling')}</p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-2xl bg-card border border-white/5 relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-cyan-500/5 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono block">{t('dashboard.activeContracts')}</span>
          <h3 className="text-2xl font-black text-white mt-2">{activeJobs.length} {t('dashboard.scopes')}</h3>
          <Link 
            href="/tasks"
            className="flex items-center gap-1.5 mt-3 text-[10px] font-bold text-cyan-400 hover:text-white transition-colors cursor-pointer"
          >
            {t('dashboard.reviewDeliverables')}
            <ChevronRight size={12} />
          </Link>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-2xl bg-card border border-white/5 relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-red-500/5 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono block">{t('dashboard.openTasks')}</span>
          <h3 className="text-2xl font-black text-white mt-2">{activeTasks.length} {t('dashboard.pending')}</h3>
          <p className="text-[10px] text-red-400 mt-3 flex items-center gap-1 font-bold">
            <Clock size={10} className="animate-pulse" />
            {t('dashboard.checkMilestones')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Job Acceptance & Deadlines */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Incoming Job broadcasts (Workflow) */}
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Briefcase size={18} className="text-primary" />
              {t('dashboard.incomingJobTenders')}
            </h2>

            {availableJobs.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/10 border border-white/5 rounded-2xl space-y-2">
                <Sparkles size={28} className="text-slate-600 mx-auto animate-pulse" />
                <h4 className="text-xs font-bold text-slate-400">{t('dashboard.allBroadcastsAck')}</h4>
                <p className="text-[10px] text-slate-500">{t('dashboard.checkingTenders')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableJobs.map(job => {
                  const isExpanded = expandedJobId === job.id;
                  return (
                    <div 
                      key={job.id} 
                      className="glow-border bg-card/60 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300"
                    >
                      {/* Top Header Card Summary */}
                      <div 
                        onClick={() => setExpandedJobId(isExpanded ? null : job.id)}
                        className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer select-none"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-[9px] font-mono font-black text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                              {job.id}
                            </span>
                            <span className="text-[9px] font-mono font-semibold text-slate-300 bg-slate-800 border border-white/5 px-2 py-0.5 rounded capitalize">
                              {job.clientSector}
                            </span>
                          </div>
                          <h3 className="text-sm font-extrabold text-white group-hover:text-primary transition-colors mt-1">{job.title}</h3>
                        </div>
                        <div className="text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t border-white/5 sm:border-transparent pt-3 sm:pt-0">
                          <span className="text-xs font-black text-emerald-400 font-mono">{job.rate}</span>
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5">{job.duration} {t('dashboard.duration')}</span>
                        </div>
                      </div>

                      {/* Expanded Parameters & Acceptance actions */}
                      {isExpanded && (
                        <div className="p-6 border-t border-white/5 bg-slate-950/20 space-y-6">
                          <div className="space-y-2">
                            <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block font-mono">{t('dashboard.jobDescription')}</span>
                            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-4 border border-white/5 rounded-xl">{job.description}</p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Scope lists */}
                            <div className="space-y-2.5">
                              <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block font-mono">{t('dashboard.scopeOfConsultation')}</span>
                              <ul className="space-y-1.5 text-[11px] text-slate-400 leading-relaxed font-semibold">
                                {job.scope.map((scp, idx) => (
                                  <li key={idx} className="flex gap-2 items-start">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                    <span>{scp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Required deliverables */}
                            <div className="space-y-2.5">
                              <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block font-mono">{t('dashboard.deliverablesBreakdown')}</span>
                              <ul className="space-y-1.5 text-[11px] text-slate-400 leading-relaxed font-semibold">
                                {job.deliverables.map((del, idx) => (
                                  <li key={idx} className="flex gap-2 items-start">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                                    <span>{del}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* Action Workflows Buttons */}
                          <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
                            <button
                              onClick={() => rejectJob(job.id)}
                              className="flex items-center gap-1 px-4 py-2 border border-red-500/20 bg-red-500/5 hover:bg-red-500/15 text-red-400 font-bold text-xs rounded-xl transition cursor-pointer"
                            >
                              <X size={14} />
                              {t('dashboard.declineTender')}
                            </button>
                            <button
                              onClick={() => acceptJob(job.id)}
                              className="flex items-center gap-1.5 px-6 py-2.5 bg-primary hover:bg-lemon text-background font-black text-xs rounded-xl transition shadow-lg shadow-primary/10 cursor-pointer"
                            >
                              <Check size={14} />
                              {t('dashboard.acceptContract')}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Closest Upcoming Deadlines List */}
          <div className="space-y-4">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Clock size={18} className="text-primary" />
              {t('dashboard.activeMilestoneDeadlines')}
            </h2>

            {activeTasks.length === 0 ? (
              <div className="p-6 text-center bg-slate-900/10 border border-white/5 rounded-2xl">
                <CheckCircle size={24} className="text-slate-600 mx-auto mb-2 animate-bounce" />
                <h4 className="text-xs font-bold text-slate-400">{t('dashboard.allMilestonesCompleted')}</h4>
                <p className="text-[10px] text-slate-500 mt-1">{t('dashboard.acceptNewTenders')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeTasks.slice(0, 3).map(task => {
                  const isHigh = task.priority === 'HIGH';
                  return (
                    <div 
                      key={task.id}
                      className="p-4 rounded-xl bg-card border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-white/10 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono text-slate-400 font-semibold">{task.id}</span>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded font-black font-mono uppercase ${
                            isHigh ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {task.priority} {t('dashboard.priority')}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white leading-normal">{task.title}</h4>
                      </div>
                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t border-white/5 sm:border-transparent pt-2 sm:pt-0">
                        <span className="text-[10px] text-slate-400">{t('dashboard.due')} <strong className="text-slate-200">{task.dueDate}</strong></span>
                        <Link
                          href="/tasks"
                          className="text-[10px] font-black text-primary hover:text-white transition-colors cursor-pointer"
                        >
                          {t('dashboard.workspace')}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Column: Live Notification Console */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <FileText size={18} className="text-primary" />
              {t('dashboard.portalSecurityLogs')}
            </h2>
            {notifications.length > 0 && (
              <button 
                onClick={clearNotifications}
                className="text-[10px] text-red-400 hover:text-red-300 cursor-pointer font-bold font-mono"
              >
                {t('dashboard.clearLogs')}
              </button>
            )}
          </div>

          <div className="bg-card/40 border border-white/5 rounded-3xl p-5 space-y-4 max-h-[480px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                {t('dashboard.noAlerts')}
              </div>
            ) : (
              <div className="space-y-3.5">
                {notifications.map(not => {
                  return (
                    <div 
                      key={not.id}
                      onClick={() => markNotificationRead(not.id)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        not.read 
                          ? 'bg-slate-900/10 border-white/5 text-slate-400 opacity-60' 
                          : 'bg-slate-900/60 border-primary/20 text-white shadow-sm'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-extrabold leading-snug">{not.title}</span>
                        {!not.read && (
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal mt-1">{not.text}</p>
                      <span className="text-[8px] font-mono text-slate-500 block mt-2">
                        {new Date(not.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
