import React, { useState } from 'react';
import { useConsultantStore, VaultDocument } from '@/store/consultantStore';
import { 
  FolderLock, 
  Lock, 
  FileText, 
  Play, 
  RotateCcw, 
  Plus, 
  Trash2, 
  CheckCircle,
  FileCheck,
  Code
} from 'lucide-react';

export default function VaultTab() {
  const documents = useConsultantStore(state => state.documents);
  const activeJobs = useConsultantStore(state => state.activeJobs);
  const addDocumentTrackChange = useConsultantStore(state => state.addDocumentTrackChange);
  const resetDocumentChanges = useConsultantStore(state => state.resetDocumentChanges);

  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  // Edit form simulator states
  const [editType, setEditType] = useState<'INSERTION' | 'DELETION'>('INSERTION');
  const [editLine, setEditLine] = useState(3);
  const [editText, setEditText] = useState('');

  // Unlocked documents based on accepted active jobs!
  const activeJobIds = activeJobs.map(j => j.id);
  const unlockedDocs = documents.filter(doc => activeJobIds.includes(doc.jobId));

  const currentDoc = unlockedDocs.find(d => d.id === (selectedDocId || unlockedDocs[0]?.id));

  // If no jobs accepted, vault is locked!
  const isVaultLocked = unlockedDocs.length === 0;

  const handleSimulateEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDoc || !editText.trim()) {
      alert("Please provide the simulated edit text parameters.");
      return;
    }

    addDocumentTrackChange(currentDoc.id, editType, editText.trim(), editLine);
    setEditText('');
  };

  const handleResetDoc = () => {
    if (currentDoc && confirm("Discard all tracked edits and restore document to original company state?")) {
      resetDocumentChanges(currentDoc.id);
    }
  };

  if (isVaultLocked) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 animate-in fade-in duration-300">
        <div className="max-w-md w-full bg-slate-900/60 border border-primary/20 backdrop-blur-xl p-8 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          
          <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mx-auto text-primary animate-pulse">
            <Lock size={32} />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-white">Secure Document Vault Locked</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Company-owned source files and directives are protected. The document vault is unlocked immediately after you accept a job tender from the dashboard.
            </p>
          </div>

          <div className="pt-2">
            <div className="p-4 bg-slate-950/40 rounded-2xl border border-white/5 space-y-2 text-left">
              <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider font-mono">Vault Prerequisites</span>
              <ul className="space-y-1.5 text-[10px] text-slate-400 font-semibold">
                <li className="flex gap-2 items-center">
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  Complete partner onboarding profile
                </li>
                <li className="flex gap-2 items-center">
                  <span className="w-1 h-1 rounded-full bg-slate-600" />
                  Accept any available contract tender
                </li>
                <li className="flex gap-2 items-center">
                  <span className="w-1 h-1 rounded-full bg-slate-600 font-bold" />
                  PM unlocks security assets package
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-black text-white flex items-center gap-2">
          <FolderLock className="text-primary" />
          Secure Document Vault
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Review company blueprints, and collaborate on guideline updates. All changes are recorded via track-changes logs for PM approval.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Documents Selector List */}
        <div className="space-y-3.5">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block font-mono">Unlocked Files Bundle</span>
          <div className="space-y-2">
            {unlockedDocs.map(doc => {
              const isSelected = currentDoc?.id === doc.id;
              return (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`w-full text-left p-4 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-primary/5 border-primary text-white shadow-sm' 
                      : 'bg-card/40 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-300'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary/10 text-primary' : 'bg-slate-800 text-slate-400'}`}>
                    <FileText size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold truncate leading-normal">{doc.title}</h4>
                    <span className="text-[8px] font-mono text-slate-500 block mt-0.5 uppercase">
                      {doc.category.replace('_', ' ')}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 3 Columns: Interactive Track Changes Editor */}
        {currentDoc && (
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Editor Workspace Column */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex justify-between items-center bg-slate-900/60 p-4 border border-white/5 rounded-2xl">
                <div className="space-y-0.5">
                  <span className="text-[8px] font-mono font-black text-primary uppercase">Active File Buffer</span>
                  <h3 className="text-xs font-black text-white font-mono">{currentDoc.title}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleResetDoc}
                    className="flex items-center gap-1 px-3 py-1.5 border border-white/10 hover:border-white/20 text-slate-400 hover:text-white rounded-xl text-[10px] font-bold font-mono transition cursor-pointer"
                  >
                    <RotateCcw size={12} />
                    Reset
                  </button>
                </div>
              </div>

              {/* IDE Editor Console display */}
              <div className="bg-slate-950/60 border border-white/10 rounded-3xl p-6 font-mono text-xs text-slate-300 min-h-[360px] max-h-[480px] overflow-y-auto space-y-1 relative shadow-inner">
                
                {/* Visual Line by Line rendering */}
                {currentDoc.content.split('\n').map((lineText, idx) => {
                  const lineNum = idx + 1;
                  // Color highlight for track change insertions and deletions
                  const isTrackChangeInsertion = lineText.includes('[Track Change - Insertion]');
                  const isTrackChangeDeletion = lineText.includes('~~');

                  return (
                    <div 
                      key={idx} 
                      className={`flex gap-4 py-0.5 px-2 rounded -mx-2 ${
                        isTrackChangeInsertion ? 'bg-emerald-500/10 text-emerald-300 font-bold border-l-2 border-emerald-500' :
                        isTrackChangeDeletion ? 'bg-red-500/10 text-red-400 line-through opacity-70 border-l-2 border-red-500' : 
                        'hover:bg-white/5'
                      }`}
                    >
                      <span className="w-8 text-slate-600 text-right select-none font-extrabold">{lineNum}</span>
                      <span className="flex-1 whitespace-pre-wrap leading-relaxed">{lineText}</span>
                    </div>
                  );
                })}

                {/* If track changes are empty, show initial cursor prompt */}
                {currentDoc.trackChanges.length === 0 && (
                  <div className="absolute right-4 bottom-4 flex items-center gap-1.5 text-[10px] text-slate-500 font-sans bg-slate-900 border border-white/5 px-2.5 py-1 rounded">
                    <Code size={12} />
                    Ready for tracked engineering audits
                  </div>
                )}
              </div>

              {/* Simulated Edit Controls */}
              <div className="bg-card/40 border border-white/5 rounded-3xl p-5 space-y-4">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block font-mono">Simulate Audit Tracked Edit</span>
                
                <form onSubmit={handleSimulateEdit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Action Selector */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider font-mono">Edit Modality</label>
                      <select
                        value={editType}
                        onChange={e => setEditType(e.target.value as any)}
                        className="w-full px-3 py-2.5 bg-slate-950/60 border border-white/10 rounded-xl text-[11px] font-bold text-white focus:outline-none focus:border-primary/50 transition-colors"
                      >
                        <option value="INSERTION" className="text-slate-800">Add Directive (+)</option>
                        <option value="DELETION" className="text-slate-800">Strike Clause (-)</option>
                      </select>
                    </div>

                    {/* Line selector */}
                    <div className="space-y-1">
                      <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider font-mono">Target Line</label>
                      <select
                        value={editLine}
                        onChange={e => setEditLine(Number(e.target.value))}
                        className="w-full px-3 py-2.5 bg-slate-950/60 border border-white/10 rounded-xl text-[11px] font-bold text-white focus:outline-none focus:border-primary/50 transition-colors"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(l => (
                          <option key={l} value={l} className="text-slate-800">Line {l}</option>
                        ))}
                      </select>
                    </div>

                    {/* Text input */}
                    <div className="sm:col-span-1 space-y-1 flex flex-col justify-end">
                      <span className="text-[8px] font-mono text-slate-500 uppercase font-black block mb-1">Author Identity</span>
                      <div className="px-3 py-2.5 bg-slate-900 border border-white/5 rounded-xl text-[11px] font-bold text-slate-400 font-mono select-none">
                        Consultant Partner
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-500 tracking-wider font-mono">
                      {editType === 'INSERTION' ? 'Directive / Content to Insert' : 'Exact Clause Text to Strikeout'}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={editType === 'INSERTION' 
                          ? "e.g. Include zero-trust proxy firewalls for API routing." 
                          : "e.g. key rotation cycles of 90 days."
                        }
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        className="flex-1 px-4 py-3 bg-slate-950/60 border border-white/10 focus:border-primary/50 rounded-xl text-xs font-semibold text-white focus:outline-none transition-colors"
                        required
                      />
                      <button
                        type="submit"
                        className="bg-primary hover:bg-lemon text-background px-5 py-3 rounded-xl transition-colors cursor-pointer flex items-center justify-center text-xs font-black shadow shadow-primary/10"
                      >
                        {editType === 'INSERTION' ? <Plus size={16} /> : <Trash2 size={16} />}
                        <span className="hidden sm:inline ml-1.5">Track Edit</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Changes Log Sidebar Column */}
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block font-mono">Changes Audit Registry</span>
              
              <div className="bg-card/40 border border-white/5 rounded-3xl p-5 space-y-4 min-h-[300px]">
                {currentDoc.trackChanges.length === 0 ? (
                  <div className="text-center py-16 text-xs text-slate-500">
                    No tracked changes logged yet. Submit edits in the workspace simulator.
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[420px] overflow-y-auto">
                    {currentDoc.trackChanges.map(chg => {
                      const isIns = chg.type === 'INSERTION';
                      return (
                        <div 
                          key={chg.id}
                          className={`p-3 rounded-xl border text-left ${
                            isIns ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-red-500/5 border-red-500/10'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className={`text-[8px] px-1.5 py-0.5 rounded font-black font-mono uppercase ${
                              isIns ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {isIns ? 'Insertion' : 'Deletion'}
                            </span>
                            <span className="text-[8px] text-slate-500 font-mono">{chg.timestamp}</span>
                          </div>
                          
                          <p className="text-[10px] text-slate-300 font-medium leading-relaxed font-mono truncate">
                            "{chg.text}"
                          </p>
                          
                          <div className="flex justify-between items-center text-[8px] text-slate-500 font-mono mt-2 pt-1 border-t border-white/5">
                            <span>Line: {chg.line}</span>
                            <span>{chg.author}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
