'use client';

import React, { useState } from 'react';
import { useConsultantStore, Task } from '@/store/consultantStore';
import {
  Clock,
  AlertCircle,
  UploadCloud,
  CheckCircle,
  TrendingUp,
  GripHorizontal,
  ChevronRight
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { 
  DndContext, 
  useDraggable, 
  useDroppable, 
  DragEndEvent,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';

interface DroppableColumnProps {
  id: Task['status'];
  title: string;
  icon: React.ReactNode;
  tasks: Task[];
  onTaskClick?: (taskId: string) => void;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({ id, title, icon, tasks, onTaskClick }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div 
      ref={setNodeRef}
      className={`flex flex-col min-w-[280px] sm:min-w-[320px] max-w-[350px] bg-slate-900/40 border rounded-3xl overflow-hidden transition-colors duration-300 ${
        isOver ? 'border-primary/50 bg-slate-900/60' : 'border-white/5'
      }`}
    >
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-950/40">
        <h3 className="font-bold text-sm text-white flex items-center gap-2">
          {icon}
          {title}
        </h3>
        <span className="bg-slate-800 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="p-4 flex-1 space-y-4 overflow-y-auto min-h-[400px]">
        {tasks.map(task => (
          <DraggableTaskCard key={task.id} task={task} onClick={() => onTaskClick?.(task.id)} />
        ))}
      </div>
    </div>
  );
};

const DraggableTaskCard: React.FC<{ task: Task, isOverlay?: boolean, onClick?: () => void }> = ({ task, isOverlay, onClick }) => {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

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

  if (isDragging && !isOverlay) {
    return <div ref={setNodeRef} className="opacity-30 border-2 border-dashed border-primary/50 bg-card/10 h-[150px] rounded-2xl" />;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-card/70 border border-white/5 hover:border-white/15 transition-all p-4 rounded-2xl flex flex-col gap-3 relative shadow-lg ${isOverlay ? 'scale-105 shadow-primary/20 cursor-grabbing' : 'cursor-grab'}`}
      {...listeners}
      {...attributes}
    >
      {task.status === 'IN_PROGRESS' && (
        <div className="absolute top-0 left-0 w-1 h-full bg-cyan-400" />
      )}
      
      <div className="flex justify-between items-start">
        <span className="text-[9px] font-mono text-slate-500 font-extrabold">{task.id}</span>
        <GripHorizontal size={14} className="text-slate-600" />
      </div>
      
      <div>
        <h4 className="text-xs font-extrabold text-white leading-snug mb-1">{task.title}</h4>
        <p className="text-slate-400 text-[10px] line-clamp-2 leading-relaxed">{task.description}</p>
      </div>

      <div className="flex justify-between items-end mt-2 pt-2 border-t border-white/5">
        <span className="text-[9px] text-slate-500 font-mono">
          {t('tasks.due')} <strong className="text-slate-300">{task.dueDate}</strong>
        </span>
        {getPriorityBadge(task.priority)}
      </div>

      {task.status === 'UNDER_REVIEW' && task.deliverableSubmitted && (
         <div className="mt-1 p-2 bg-slate-950/40 rounded-lg border border-white/5 space-y-1 font-mono text-[8px] text-slate-400">
           <div className="truncate"><strong className="text-slate-300">{t('tasks.filePackage')}</strong> {task.deliverableSubmitted.fileName}</div>
         </div>
      )}

      {task.status === 'IN_PROGRESS' && (
        <div 
           className="mt-2 text-[9px] font-black text-cyan-400 flex items-center gap-1 cursor-pointer hover:text-cyan-300"
           onPointerDown={(e) => {
             e.stopPropagation(); 
             onClick?.();
           }}
        >
          {t('tasks.submitDeliverable')} <ChevronRight size={10} />
        </div>
      )}
    </div>
  );
};

export default function TasksTab() {
  const { t } = useTranslation();
  const tasks = useConsultantStore(state => state.tasks);
  const updateTaskStatus = useConsultantStore(state => state.updateTaskStatus);
  const submitTaskDeliverable = useConsultantStore(state => state.submitTaskDeliverable);

  // Submit Drawer State
  const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [fileName, setFileName] = useState('');
  const [dragging, setDragging] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

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

  const handleDragStart = (event: any) => {
    setActiveDragId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const currentStatus = tasks.find(t => t.id === taskId)?.status;
    const targetStatus = over.id as Task['status'];

    if (currentStatus === targetStatus) return;

    // If moving to UNDER_REVIEW, trigger the submission modal instead of immediate update
    if (targetStatus === 'UNDER_REVIEW' && currentStatus !== 'UNDER_REVIEW') {
      setSubmittingTaskId(taskId);
      return;
    }

    updateTaskStatus(taskId, targetStatus);
  };

  const submittingTaskObj = tasks.find(t => t.id === submittingTaskId);
  const activeDragTask = tasks.find(t => t.id === activeDragId);

  const cols = [
    { id: 'ASSIGNED' as const, title: t('tasks.statusAssigned'), icon: <AlertCircle size={16} className="text-slate-400" /> },
    { id: 'IN_PROGRESS' as const, title: t('tasks.statusCoding'), icon: <TrendingUp size={16} className="text-cyan-400" /> },
    { id: 'UNDER_REVIEW' as const, title: t('tasks.statusAuditing'), icon: <Clock size={16} className="text-amber-400" /> },
    { id: 'COMPLETED' as const, title: t('tasks.statusCompleted'), icon: <CheckCircle size={16} className="text-emerald-400" /> },
  ];

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-100px)] animate-in fade-in duration-300">

      {/* Page Header */}
      <div className="flex-shrink-0">
        <h1 className="text-xl lg:text-2xl font-black text-white">{t('tasks.title')}</h1>
        <p className="text-slate-400 text-xs mt-1">{t('tasks.desc')}</p>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-6 h-full items-start">
            {cols.map(col => (
              <DroppableColumn 
                key={col.id} 
                id={col.id} 
                title={col.title} 
                icon={col.icon} 
                tasks={tasks.filter(t => t.status === col.id)} 
                onTaskClick={(id) => setSubmittingTaskId(id)}
              />
            ))}
          </div>

          <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }) }}>
            {activeDragTask ? <DraggableTaskCard task={activeDragTask} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
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
