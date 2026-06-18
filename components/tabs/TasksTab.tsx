import React, { useState } from 'react';
import { useConsultantStore, Task } from '@/store/consultantStore';
import {
  CheckSquare,
  Clock,
  AlertCircle,
  Send,
  UploadCloud,
  CheckCircle,
  ChevronRight,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function TasksTab() {
  const { t } = useTranslation();
  const tasks = useConsultantStore(state => state.tasks);
  const updateTaskStatus = useConsultantStore(state => state.updateTaskStatus);
  const submitTaskDeliverable = useConsultantStore(state => state.submitTaskDeliverable);

  const [activeFilter, setActiveFilter] = useState<'ALL' | Task['status']>('ALL');

  // Submit Drawer State
  const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [fileName, setFileName] = useState('');
  const [dragging, setDragging] = useState(false);

  const filteredTasks = tasks.filter(t => activeFilter === 'ALL' || t.status === activeFilter);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim() || !fileName) {
      alert(t('tasks.alertCompletionNotes'));
      return;
    }

    if (submittingTaskId) {
      submitTaskDeliverable(submittingTaskId, notes, fileName);
      setSubmittingTaskId(null);
      setNotes('');
      setFileName('');
    }
  };

  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'HIGH':
        return <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-[8px] px-1.5 py-0.5 rounded font-black font-mono uppercase">{t('tasks.priorityHigh')}</span>;
      case 'MEDIUM':
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[8px] px-1.5 py-0.5 rounded font-black font-mono uppercase">{t('tasks.priorityMedium')}</span>;
      default:
        return <span className="bg-slate-800 text-slate-400 border border-white/5 text-[8px] px-1.5 py-0.5 rounded font-black font-mono uppercase">{t('tasks.priorityLow')}</span>;
    }
  };

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="text-emerald-400 text-xs font-black flex items-center gap-1"><CheckCircle size={14} /> {t('tasks.statusCompleted')}</span>;
      case 'UNDER_REVIEW':
        return <span className="text-amber-400 text-xs font-black flex items-center gap-1 animate-pulse"><Clock size={14} /> {t('tasks.statusAuditing')}</span>;
      case 'IN_PROGRESS':
        return <span className="text-cyan-400 text-xs font-black flex items-center gap-1"><TrendingUp size={14} /> {t('tasks.statusCoding')}</span>;
      default:
        return <span className="text-slate-400 text-xs font-black flex items-center gap-1"><AlertCircle size={14} /> {t('tasks.statusAssigned')}</span>;
    }
  };

  const submittingTaskObj = tasks.find(t => t.id === submittingTaskId);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-white">{t('tasks.title')}</h1>
          <p className="text-slate-400 text-xs mt-1">{t('tasks.desc')}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex bg-slate-900/60 p-1 border border-white/5 rounded-2xl w-full max-w-xl">
        {(['ALL', 'ASSIGNED', 'IN_PROGRESS', 'UNDER_REVIEW', 'COMPLETED'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`flex-1 px-3 py-2 rounded-xl text-[10px] font-black transition-all cursor-pointer ${activeFilter === tab
                ? 'bg-primary text-background shadow-lg'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
          >
            {tab === 'ALL' ? t('tasks.tabAll') : tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Tasks List Container */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="p-16 text-center bg-slate-900/10 border border-white/5 rounded-2xl space-y-2">
            <CheckSquare size={36} className="text-slate-600 mx-auto" />
            <h4 className="text-xs font-bold text-slate-400">{t('tasks.noMilestones')}</h4>
            <p className="text-[10px] text-slate-500">{t('tasks.goToDashboard')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTasks.map(task => {
              const isAssigned = task.status === 'ASSIGNED';
              const isInProgress = task.status === 'IN_PROGRESS';
              const isCompleted = task.status === 'COMPLETED';
              const isUnderReview = task.status === 'UNDER_REVIEW';

              return (
                <div
                  key={task.id}
                  className="bg-card/45 border border-white/5 hover:border-white/10 transition-all p-6 rounded-2xl flex flex-col justify-between gap-5 relative overflow-hidden"
                >
                  {/* Neon active outline for tasks currently worked on */}
                  {isInProgress && (
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-cyan-400" />
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-3">
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-slate-500 font-extrabold">{task.id}</span>
                        <h3 className="text-xs lg:text-sm font-extrabold text-white leading-snug">{task.title}</h3>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        {getPriorityBadge(task.priority)}
                        {getStatusLabel(task.status)}
                      </div>
                    </div>

                    <p className="text-slate-400 text-[11px] leading-relaxed font-semibold">{task.description}</p>
                  </div>

                  <div className="border-t border-white/5 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {t('tasks.targetDueDate')} <strong className="text-slate-300">{task.dueDate}</strong>
                    </span>

                    {/* Progress Controls */}
                    <div className="flex gap-2 w-full sm:w-auto">
                      {isAssigned && (
                        <button
                          onClick={() => updateTaskStatus(task.id, 'IN_PROGRESS')}
                          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[10px] rounded-xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer"
                        >
                          {t('tasks.startCoding')}
                          <ArrowRight size={12} />
                        </button>
                      )}

                      {isInProgress && (
                        <button
                          onClick={() => setSubmittingTaskId(task.id)}
                          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-black text-[10px] rounded-xl transition shadow-lg shadow-cyan-500/10 cursor-pointer"
                        >
                          {t('tasks.submitDeliverable')}
                          <ChevronRight size={12} />
                        </button>
                      )}

                      {isUnderReview && (
                        <div className="text-[10px] text-slate-500 font-semibold font-mono bg-slate-900/40 px-3 py-1.5 rounded-lg border border-white/5">
                          {t('tasks.verificationPending')}
                        </div>
                      )}

                      {isCompleted && (
                        <div className="text-[10px] text-emerald-400 font-bold font-mono bg-emerald-500/5 px-3 py-1.5 rounded-lg border border-emerald-500/10">
                          {t('tasks.clearedForBilling')}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submission detail display if completed/under review */}
                  {(isUnderReview || isCompleted) && task.deliverableSubmitted && (
                    <div className="mt-4 p-3 bg-slate-950/40 rounded-xl border border-white/5 space-y-1 font-mono text-[9px] text-slate-400">
                      <div><strong className="text-slate-300">{t('tasks.filePackage')}</strong> {task.deliverableSubmitted.fileName}</div>
                      <div><strong className="text-slate-300">{t('tasks.notesStr')}</strong> {task.deliverableSubmitted.notes}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Deliverable Submission Drawer Modal */}
      {submittingTaskId && submittingTaskObj && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-slate-900 border border-cyan-500/30 backdrop-blur-2xl p-6 lg:p-8 rounded-[2rem] space-y-6 shadow-2xl relative">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider font-mono">{t('tasks.deliverablesSuite')}</span>
              <h3 className="text-lg font-black text-white">{t('tasks.uploadTaskDeliverable')}</h3>
              <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
                {t('tasks.submittingFor')} <strong className="text-white font-semibold font-mono">{submittingTaskObj.id}</strong>{t('tasks.pmWillBeAlerted')}
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('tasks.completionNotes')}</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder={t('tasks.detailChanges')}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 focus:border-cyan-500/50 rounded-xl text-xs font-semibold text-white focus:outline-none transition-colors leading-relaxed"
                  required
                />
              </div>

              {/* Drag and Drop File Upload Area */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('tasks.deliverableArchive')}</label>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  className={`p-6 border-2 border-dashed rounded-2xl text-center transition-all ${fileName
                      ? 'bg-cyan-500/5 border-cyan-500 text-white'
                      : dragging
                        ? 'bg-slate-850 border-cyan-500 text-cyan-400'
                        : 'bg-slate-950/40 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                >
                  <UploadCloud className="mx-auto mb-2 text-slate-400 stroke-1" size={32} />
                  {fileName ? (
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-cyan-400">{fileName}</p>
                      <button
                        type="button"
                        onClick={() => setFileName('')}
                        className="text-[9px] text-red-400 hover:underline font-mono"
                      >
                        {t('tasks.removeArchive')}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-bold text-slate-300">{t('tasks.dragDropArchive')}</p>
                      <p className="text-[10px] text-slate-500 mt-1">{t('tasks.orClickToBrowseLocal')}</p>
                      <input
                        type="file"
                        accept=".zip,.pdf,.txt,.rar"
                        onChange={e => e.target.files && e.target.files[0] && setFileName(e.target.files[0].name)}
                        className="hidden"
                        id="deliverable-file-picker"
                      />
                      <label
                        htmlFor="deliverable-file-picker"
                        className="mt-3 inline-block px-4 py-1.5 bg-slate-850 hover:bg-slate-800 border border-white/5 hover:border-white/10 rounded-xl text-[10px] font-bold text-slate-300 cursor-pointer transition-all"
                      >
                        {t('tasks.selectArchive')}
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmittingTaskId(null)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl transition text-xs cursor-pointer"
                >
                  {t('tasks.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-black py-2.5 rounded-xl transition text-xs shadow-lg shadow-cyan-500/10 cursor-pointer animate-pulse"
                >
                  {t('tasks.deliverMilestone')}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
