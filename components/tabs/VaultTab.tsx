import React, { useState } from 'react';
import { useConsultantStore, VaultDocument } from '@/store/consultantStore';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, Search, FileText, Grid3X3, Presentation, 
  Settings2, History, Activity, Zap, ShieldCheck, 
  Download, Clock, ExternalLink, FileCode, ChevronLeft, User, Plus
} from 'lucide-react';
import WorkspaceShell from '../vault/layout/WorkspaceShell';
import DocsEditor from '../vault/editors/DocsEditor';
import SheetsEditor from '../vault/editors/SheetsEditor';
import SlidesEditor from '../vault/editors/SlidesEditor';

export default function VaultTab() {
  const { t } = useTranslation();
  const documents = useConsultantStore(state => state.documents);
  const activeJobs = useConsultantStore(state => state.activeJobs);
  const updateDocumentContent = useConsultantStore(state => state.updateDocumentContent);

  const [view, setView] = useState<'list' | 'detail' | 'studio'>('list');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDetailTab, setActiveDetailTab] = useState<'details' | 'versions' | 'audit' | 'ai'>('details');

  // Unlocked documents based on accepted active jobs!
  const activeJobIds = activeJobs.map(j => j.id);
  const unlockedDocs = documents.filter(doc => activeJobIds.includes(doc.jobId));

  const currentDoc = unlockedDocs.find(d => d.id === selectedDocId) || null;

  // If no jobs accepted, vault is locked!
  const isVaultLocked = unlockedDocs.length === 0;

  if (isVaultLocked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 animate-in fade-in duration-300">
        <div className="max-w-md w-full bg-slate-900/60 border border-primary/20 backdrop-blur-xl p-8 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          
          <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto text-primary animate-pulse">
            <Lock size={32} />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-white">{t('vault.secureVaultLocked')}</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('vault.companyOwnedSourceFiles')}
            </p>
          </div>

          <div className="pt-2">
            <div className="p-4 bg-slate-950/40 rounded-2xl border border-white/5 space-y-2 text-left">
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('vault.vaultPrerequisites')}</span>
              <ul className="space-y-1.5 text-[10px] text-slate-400 font-semibold">
                <li className="flex gap-2 items-center">
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  {t('vault.prereqCompleteOnboarding')}
                </li>
                <li className="flex gap-2 items-center">
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  {t('vault.prereqAcceptTender')}
                </li>
                <li className="flex gap-2 items-center">
                  <span className="w-1 h-1 rounded-full bg-slate-600 font-bold" />
                  {t('vault.prereqPmUnlocks')}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Intercept the WorkspaceShell 'open' event which was meant for '/document-vault/all' in admin
  React.useEffect(() => {
    if (view !== 'studio') return;
    
    const handleGlobalEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.action === 'open') {
        setView('detail');
      }
    };
    document.addEventListener('editor-action', handleGlobalEvent);
    return () => document.removeEventListener('editor-action', handleGlobalEvent);
  }, [view]);

  const renderEditor = () => {
    if (!currentDoc) return null;

    switch (currentDoc.type) {
      case 'doc':
        return (
          <DocsEditor
            content={currentDoc.content}
            onChange={(content) => updateDocumentContent(currentDoc.id, currentDoc.title, content)}
            title={currentDoc.title}
            onTitleChange={(title) => updateDocumentContent(currentDoc.id, title, currentDoc.content)}
          />
        );
      case 'sheet':
        return (
          <SheetsEditor
            content={currentDoc.content}
            onChange={(content) => updateDocumentContent(currentDoc.id, currentDoc.title, content)}
            title={currentDoc.title}
            onTitleChange={(title) => updateDocumentContent(currentDoc.id, title, currentDoc.content)}
          />
        );
      case 'slide':
        return (
          <SlidesEditor
            content={currentDoc.content}
            onChange={(content) => updateDocumentContent(currentDoc.id, currentDoc.title, content)}
            title={currentDoc.title}
            onTitleChange={(title) => updateDocumentContent(currentDoc.id, title, currentDoc.content)}
          />
        );
      default:
        return null;
    }
  };

  const filteredDocs = unlockedDocs.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDocIcon = (type: string) => {
    switch (type) {
      case 'doc': return <FileText size={20} className="text-blue-400" />;
      case 'sheet': return <Grid3X3 size={20} className="text-green-400" />;
      case 'slide': return <Presentation size={20} className="text-amber-400" />;
      default: return <FileText size={20} className="text-slate-400" />;
    }
  };

  if (view === 'list') {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Document <span className="text-primary">Vault</span></h2>
            <p className="text-slate-400 text-sm mt-1">Access secure project deliverables and guidelines.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search vault..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900/60 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:border-primary/50 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map(doc => (
            <div 
              key={doc.id}
              onClick={() => { setSelectedDocId(doc.id); setView('detail'); }}
              className="group cursor-pointer bg-card/40 hover:bg-card border border-white/5 hover:border-primary/30 rounded-3xl p-6 transition-all shadow-lg hover:shadow-primary/5 relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
              <div className="flex items-start justify-between mb-4 relative">
                <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-white/5 flex items-center justify-center">
                  {getDocIcon(doc.type)}
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 bg-slate-900/80 px-3 py-1 rounded-full border border-white/5">
                  {doc.category}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 leading-tight group-hover:text-primary transition-colors">{doc.title}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-2 font-medium">
                <Clock size={12} /> {new Date(doc.lastModified).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
        {filteredDocs.length === 0 && (
          <div className="text-center py-20 bg-card/20 rounded-3xl border border-white/5 border-dashed">
            <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white">No documents found</h3>
            <p className="text-slate-500 text-sm">Try adjusting your search query.</p>
          </div>
        )}
      </div>
    );
  }

  if (view === 'detail' && currentDoc) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto pb-24">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('list')} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-slate-400 transition-all">
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              {getDocIcon(currentDoc.type)} Vault / {currentDoc.category}
            </div>
            <h1 className="text-2xl font-black uppercase italic tracking-tight text-white mt-1">{currentDoc.title}</h1>
          </div>
          <button 
            onClick={() => setView('studio')}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-lemon transition-all shadow-lg shadow-primary/20"
          >
            <ExternalLink size={16} /> Open in Studio
          </button>
        </div>

        {/* Status Bar */}
        <div className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-[32px] p-8 flex flex-wrap items-center gap-12 shadow-xl">
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Asset Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-black text-white uppercase tracking-tighter">Unlocked & Ready</p>
            </div>
          </div>
          <div className="h-10 w-px bg-white/5 hidden md:block" />
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Last Modified</p>
            <p className="text-xs font-black text-white uppercase tracking-tighter flex items-center gap-2">
              <Clock size={12} className="text-slate-400" /> {new Date(currentDoc.lastModified).toLocaleDateString()}
            </p>
          </div>
          <div className="h-10 w-px bg-white/5 hidden md:block" />
          <div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Job ID</p>
            <p className="text-xs font-black text-white uppercase tracking-tighter">{currentDoc.jobId}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-card/40 backdrop-blur-xl border border-white/5 rounded-[32px] overflow-hidden shadow-xl">
              <div className="flex px-8 border-b border-white/5 bg-white/5">
                {[
                  { id: 'details', label: 'Configuration', icon: Settings2 },
                  { id: 'versions', label: 'History', icon: History },
                  { id: 'ai', label: 'Gemini AI', icon: Zap }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveDetailTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-6 text-[10px] font-black uppercase tracking-widest transition-all relative ${activeDetailTab === tab.id ? 'text-primary' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <tab.icon size={14} />
                    {tab.label}
                    {activeDetailTab === tab.id && (
                      <motion.div layoutId="activeDetailTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary" />
                    )}
                  </button>
                ))}
              </div>

              <div className="p-8">
                {activeDetailTab === 'details' && (
                  <div className="space-y-8">
                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                      <FileCode size={14} /> Structural Metadata
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Document Title</label>
                          <p className="text-sm font-bold text-white">{currentDoc.title}</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Category</label>
                          <p className="text-sm font-bold text-white">{currentDoc.category}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Associated Job</label>
                          <p className="text-sm font-bold text-blue-400">{currentDoc.jobId}</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                          <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2">Internal Notes</label>
                          <p className="text-xs font-medium text-slate-400 leading-relaxed">
                            This document is securely sandboxed for the Consultant portal. Changes made in the studio will sync to the project manager.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeDetailTab === 'versions' && (
                  <div className="space-y-8">
                    <div className="flex justify-between items-center bg-white/5 border border-white/10 border-dashed p-6 rounded-3xl">
                      <div>
                        <h4 className="text-base font-black text-white uppercase italic">Version History</h4>
                        <p className="text-xs text-slate-500 mt-1">Track changes made by you and the PM.</p>
                      </div>
                      <button className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">
                        <Download size={14} /> Export Backup
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="relative pl-8 border-l-2 border-primary/30 pb-4">
                        <div className="absolute left-0 -translate-x-[7px] w-3 h-3 rounded-full border-2 bg-primary border-primary" />
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex justify-between items-center">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-white uppercase">Current Edition</span>
                              <span className="text-[8px] font-black bg-primary/20 text-primary px-2 py-0.5 rounded uppercase tracking-widest">Active</span>
                            </div>
                            <div className="flex gap-4 text-[10px] font-bold text-slate-500">
                              <span className="flex items-center gap-1"><Clock size={12} /> {new Date(currentDoc.lastModified).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {currentDoc.trackChanges.slice().reverse().map((change, i) => (
                        <div key={change.id} className="relative pl-8 border-l-2 border-white/5 pb-4 last:pb-0">
                          <div className="absolute left-0 -translate-x-[7px] w-3 h-3 rounded-full border-2 bg-slate-800 border-white/10" />
                          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 flex justify-between items-center">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-slate-300 uppercase">{change.type} Edit</span>
                              </div>
                              <p className="text-xs text-slate-500 line-clamp-1 italic">"{change.text}"</p>
                              <div className="flex gap-4 text-[10px] font-bold text-slate-600">
                                <span className="flex items-center gap-1"><User size={12} /> {change.author}</span>
                                <span className="flex items-center gap-1"><Clock size={12} /> {change.timestamp}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeDetailTab === 'ai' && (
                  <div className="py-12 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                      <Zap size={40} />
                    </div>
                    <h3 className="text-2xl font-black italic uppercase text-white mb-3">Gemini <span className="text-primary">Assistant</span></h3>
                    <p className="text-slate-400 text-sm max-w-sm mb-8 leading-relaxed">
                      Use AI to analyze this document, extract deliverables, or re-format text to meet compliance guidelines.
                    </p>
                    <button className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                      <Zap size={14} className="text-primary" /> Run Analysis
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-[32px] p-6 space-y-4">
              <div className="flex items-center gap-3 text-emerald-400">
                <ShieldCheck size={24} />
                <span className="text-[10px] font-black uppercase tracking-widest">Client Approved</span>
              </div>
              <p className="text-xs text-emerald-500/70 font-medium leading-relaxed">
                This document is verified and actively linked to your secure consultant session.
              </p>
            </div>
            
            <div className="bg-card/40 border border-white/5 rounded-[32px] p-6 space-y-4">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 mb-4">
                <Activity size={14} /> Quick Actions
              </h3>
              <button 
                onClick={() => setView('studio')}
                className="w-full py-3 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                <ExternalLink size={14} /> Open Editor
              </button>
              <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                <Download size={14} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // view === 'studio'
  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col animate-in slide-in-from-bottom-8 duration-500">
      <div className="flex-1 relative">
        <WorkspaceShell
          activeDocument={currentDoc}
          documents={unlockedDocs}
          folders={[]}
          isLoading={false}
          isSaving={false}
          clients={[]}
          onCreateFolder={() => {}}
          onCreateDocument={() => {}}
          onSelectDocument={(doc) => {
            setSelectedDocId(doc.id);
          }}
          onUpdateTitle={(title) => updateDocumentContent(currentDoc!.id, title, currentDoc!.content)}
          onShareClick={() => {}}
          renderEditor={renderEditor}
        />
      </div>
    </div>
  );
}
