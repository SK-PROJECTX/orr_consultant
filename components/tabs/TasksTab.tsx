'use client';

import React, { useState } from 'react';
import { useConsultantStore, Task } from '@/store/consultantStore';
import Skeleton from '@/components/ui/Skeleton';
import { SkeletonCardGrid } from '@/components/ui/SkeletonPresets';
import {
  Clock,
  AlertCircle,
  UploadCloud,
  CheckCircle,
  TrendingUp,
  GripHorizontal,
  ChevronRight,
  X,
  FileText,
  Loader2
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { 
  DndContext, 
  DragEndEvent,
  DragOverlay,
  defaultDropAnimationSideEffects,
  useSensor,
  useSensors,
  PointerSensor,
  closestCorners,
  useDroppable
} from '@dnd-kit/core';
import { 
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DroppableColumnProps {
  id: Task['status'];
  title: string;
  icon: React.ReactNode;
  tasks: Task[];
  onSubmitClick?: (taskId: string) => void;
  onViewClick?: (taskId: string) => void;
}

const DroppableColumn: React.FC<DroppableColumnProps> = ({ id, title, icon, tasks, onSubmitClick, onViewClick }) => {
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
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <SortableTaskCard key={task.id} task={task} onSubmitClick={() => onSubmitClick?.(task.id)} onViewClick={() => onViewClick?.(task.id)} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

const SortableTaskCard: React.FC<{ task: Task, isOverlay?: boolean, onSubmitClick?: () => void, onViewClick?: () => void }> = ({ task, isOverlay, onSubmitClick, onViewClick }) => {
  const { t } = useTranslation();
  const updatingTaskId = useConsultantStore(state => state.updatingTaskId);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = transform ? {
    transform: CSS.Transform.toString(transform),
    transition,
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
      className={`bg-card/70 border border-white/5 hover:border-white/15 transition-all p-4 rounded-2xl flex flex-col gap-3 relative shadow-lg ${isOverlay ? 'scale-105 shadow-primary/20 cursor-grabbing' : 'cursor-grab active:cursor-grabbing hover:bg-white/5'} ${updatingTaskId === task.id ? 'overflow-hidden' : ''}`}
      onClick={() => onViewClick?.()}
      {...attributes}
      {...listeners}
    >
      {updatingTaskId === task.id && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] rounded-2xl z-10 flex flex-col items-center justify-center pointer-events-none">
          <Loader2 className="w-5 h-5 animate-spin text-primary mb-2" />
          <span className="text-[10px] font-bold text-white tracking-widest uppercase animate-pulse">Changing Status</span>
        </div>
      )}
      
      {task.status === 'IN_PROGRESS' && (
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-400" />
      )}
      
      <div className="flex justify-between items-start">
        <span className="text-[9px] font-mono text-slate-500 font-extrabold">{task.id}</span>
        <div className="text-slate-600 p-1 -mr-1 -mt-1 rounded hover:bg-white/10 hover:text-white transition-colors">
          <GripHorizontal size={14} />
        </div>
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
           className="mt-2 text-[9px] font-black text-blue-400 flex items-center gap-1 cursor-pointer hover:text-blue-300"
           onClick={(e) => {
             e.stopPropagation(); 
             onSubmitClick?.();
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
  const fetchTasks = useConsultantStore(state => state.fetchTasks);
  const updateTaskStatus = useConsultantStore(state => state.updateTaskStatus);
  const submitTaskDeliverable = useConsultantStore(state => state.submitTaskDeliverable);
  const isTasksLoading = useConsultantStore(state => state.isTasksLoading);

  const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null);
  const [viewingTaskId, setViewingTaskId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const isSubmittingRef = React.useRef(submittingTaskId);
  const isDraggingRef = React.useRef(activeDragId);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  React.useEffect(() => {
    setIsMounted(true);
    isSubmittingRef.current = submittingTaskId;
  }, [submittingTaskId]);

  React.useEffect(() => {
    isDraggingRef.current = activeDragId;
  }, [activeDragId]);

  React.useEffect(() => {
    fetchTasks();
    const interval = setInterval(() => {
      if (!isSubmittingRef.current && !isDraggingRef.current) {
        fetchTasks();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchTasks]);

  if (!isMounted || (isTasksLoading && tasks.length === 0)) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col gap-3">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <SkeletonCardGrid count={6} />
      </div>
    );
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim() || !file) {
      alert(t('tasks.alertCompletionNotes'));
      return;
    }

    if (submittingTaskId) {
      submitTaskDeliverable(submittingTaskId, notes, file);
      setSubmittingTaskId(null);
      setNotes('');
      setFile(null);
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
    const overId = over.id as string;
    
    const activeTask = tasks.find(t => t.id === taskId);
    const overTask = tasks.find(t => t.id === overId);
    
    const currentStatus = activeTask?.status;
    let targetStatus = overId as Task['status'];
    if (overTask) {
      targetStatus = overTask.status;
    }

    if (currentStatus === targetStatus || !targetStatus) return;

    if (targetStatus === 'UNDER_REVIEW' && currentStatus !== 'UNDER_REVIEW') {
      setSubmittingTaskId(taskId);
      return;
    }

    updateTaskStatus(taskId, targetStatus);
  };

  const submittingTaskObj = tasks.find(t => t.id === submittingTaskId);
  const activeDragTask = tasks.find(t => t.id === activeDragId);

  const cols = [
    { id: 'NOT_STARTED' as const, title: t('tasks.statusAssigned'), icon: <Clock size={16} className="text-slate-400" /> },
    { id: 'IN_PROGRESS' as const, title: t('tasks.statusCoding'), icon: <TrendingUp size={16} className="text-blue-400" /> },
    { id: 'UNDER_REVIEW' as const, title: t('tasks.statusAuditing'), icon: <AlertCircle size={16} className="text-amber-400" /> },
    { id: 'BLOCKED' as const, title: t('tasks.statusBlocked'), icon: <AlertCircle size={16} className="text-red-400" /> },
    { id: 'COMPLETED' as const, title: t('tasks.statusCompleted'), icon: <CheckCircle size={16} className="text-emerald-400" /> },
  ];

  const getColumnTasks = (colId: string) => {
    if (colId === 'NOT_STARTED') {
      return tasks.filter(t => {
        const s = (t.status || '').toUpperCase();
        return s === 'NOT_STARTED' || s === 'ASSIGNED' || s === 'NOT STARTED' || s === 'DRAFT';
      });
    }
    return tasks.filter(t => (t.status || '').toUpperCase() === colId.toUpperCase());
  };

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-100px)] animate-in fade-in duration-300">

      <div className="flex-shrink-0">
        <h1 className="text-xl lg:text-2xl font-black text-white">{t('tasks.title')}</h1>
        <p className="text-slate-400 text-xs mt-1">{t('tasks.desc')}</p>
      </div>

      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-6 h-full items-start">
            {cols.map(col => (
              <DroppableColumn 
                key={col.id} 
                id={col.id} 
                title={col.title} 
                icon={col.icon} 
                tasks={getColumnTasks(col.id)} 
                onSubmitClick={(id) => setSubmittingTaskId(id)}
                onViewClick={(id) => setViewingTaskId(id)}
              />
            ))}
          </div>

          <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }) }}>
            {activeDragTask ? <SortableTaskCard task={activeDragTask} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      {submittingTaskId && submittingTaskObj && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border-l border-white/10 w-full max-w-md h-full p-6 flex flex-col shadow-2xl animate-in slide-in-from-right">
            <h2 className="text-xl font-black text-white mb-2">{t('tasks.modalTitle')}</h2>
            <p className="text-sm text-slate-400 mb-6">{submittingTaskObj.title}</p>
            <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col gap-6">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">{t('tasks.labelNotes')}</label>
                <textarea 
                  className="w-full mt-2 bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-primary/50 h-32 resize-none"
                  placeholder={t('tasks.placeholderNotes')}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase">{t('tasks.labelFile')}</label>
                <div 
                  className={`mt-2 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-colors ${dragging ? 'border-primary/50 bg-primary/10' : 'border-white/10 hover:border-white/20'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                >
                  <UploadCloud size={32} className={dragging ? 'text-primary' : 'text-slate-500'} />
                  <div className="text-center">
                    <p className="text-sm text-white font-bold">{t('tasks.dropFile')}</p>
                    <p className="text-xs text-slate-500 mt-1">{t('tasks.supportedFormats')}</p>
                  </div>
                  {file && (
                    <div className="mt-4 px-4 py-2 bg-white/5 rounded-lg border border-white/10 flex items-center gap-2">
                      <FileText size={16} className="text-primary" />
                      <span className="text-sm font-mono text-white">{file.name}</span>
                    </div>
                  )}
                  <input type="file" className="hidden" id="fileUpload" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  <label htmlFor="fileUpload" className="mt-2 text-xs font-bold text-primary cursor-pointer hover:underline">
                    Browse files
                  </label>
                </div>
              </div>

              <div className="mt-auto flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setSubmittingTaskId(null)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-colors"
                >
                  {t('tasks.btnCancel')}
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl text-sm font-bold transition-colors"
                >
                  {t('tasks.btnSubmit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Task Modal Drawer */}
      {viewingTaskId && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border-l border-white/10 w-full max-w-xl h-full flex flex-col shadow-2xl animate-in slide-in-from-right overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
              <div>
                <span className="text-[10px] font-black uppercase text-blue-400 tracking-wider font-mono">Task Details</span>
                <h2 className="text-xl font-bold text-white mt-1 leading-tight">{tasks.find(t => t.id === viewingTaskId)?.title}</h2>
              </div>
              <button 
                className="text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"
                onClick={() => setViewingTaskId(null)}
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6 flex-1 space-y-8">
              {/* Meta Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-500 font-mono uppercase font-black block mb-1">Status</span>
                  <span className="text-sm text-white font-semibold">{tasks.find(t => t.id === viewingTaskId)?.status}</span>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-500 font-mono uppercase font-black block mb-1">Due Date</span>
                  <span className="text-sm text-white font-semibold">{tasks.find(t => t.id === viewingTaskId)?.dueDate}</span>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] text-slate-500 font-mono uppercase font-black block mb-1">Priority</span>
                  <span className="text-sm text-white font-semibold">{tasks.find(t => t.id === viewingTaskId)?.priority}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-white">Full Description</h3>
                <div className="bg-slate-950/30 p-5 rounded-2xl border border-white/5">
                  <p className="text-slate-300 text-sm whitespace-pre-wrap leading-relaxed">
                    {tasks.find(t => t.id === viewingTaskId)?.description}
                  </p>
                </div>
              </div>

              {/* Deliverable Info if exists */}
              {tasks.find(t => t.id === viewingTaskId)?.deliverableSubmitted && (
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-white">Submitted Deliverable</h3>
                  <div className="bg-slate-950/30 p-5 rounded-2xl border border-white/5 space-y-3">
                    <p className="text-sm text-emerald-400 font-mono font-black">
                      {tasks.find(t => t.id === viewingTaskId)?.deliverableSubmitted?.fileName}
                    </p>
                    <p className="text-sm text-slate-400 whitespace-pre-wrap italic">
                      "{tasks.find(t => t.id === viewingTaskId)?.deliverableSubmitted?.notes}"
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-slate-900 sticky bottom-0">
              <button 
                className="w-full py-4 bg-slate-800 text-white rounded-xl text-sm font-black hover:bg-slate-700 transition-colors"
                onClick={() => setViewingTaskId(null)}
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
