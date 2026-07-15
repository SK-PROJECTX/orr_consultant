"use client";

import React, { useState } from 'react';
import { Briefcase, ChevronRight, ChevronLeft, Search, Filter } from 'lucide-react';
import OpportunityResponseForm from '@/components/opportunities/OpportunityResponseForm';
import { useConsultantStore } from '@/store/consultantStore';

export type OpportunityStage = 'EXPRESSION_OF_INTEREST' | 'SELECTION' | 'ASSIGNMENT_ACCEPTANCE' | 'ACCESS_ACTIVATION';

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  serviceCategory?: string;
  requiredExpertise?: string[];
  expectedRole?: string;
  expectedDeliverable?: string;
  indicativeDeadline?: string;
  workMode?: string;
  requiredLanguages?: string[];
  stage: OpportunityStage;
  statusText: string;
  dateAssigned: string;
  responseTimestamp?: string;
  lastUpdated?: string;
  createdBy?: string;
  summaryVersion?: string;
}

export default function OpportunitiesTab() {
  const opportunities = useConsultantStore(state => state.opportunities || []);
  const fetchOpportunities = useConsultantStore(state => state.fetchOpportunities);
  
  const [selectedOptId, setSelectedOptId] = useState<string | null>(null);
  const [isExternal, setIsExternal] = useState<boolean>(false);

  React.useEffect(() => {
    fetchOpportunities();
  }, [fetchOpportunities]);

  const selectedOpportunity = opportunities.find(o => o.id === selectedOptId);

  const getStageColor = (stage: OpportunityStage) => {
    switch (stage) {
      case 'EXPRESSION_OF_INTEREST': return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'SELECTION': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'ASSIGNMENT_ACCEPTANCE': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'ACCESS_ACTIVATION': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
      default: return 'text-slate-400 bg-slate-800 border-white/10';
    }
  };

  const handleStageChange = async (optId: string, newStage: OpportunityStage, newStatusText: string) => {
    // Ideally this would make an API call to respond to the opportunity
    // For now, we refetch to keep it simple, or we could optimistically update
    await fetchOpportunities();
    setSelectedOptId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-white flex items-center gap-2">
            <Briefcase className="text-primary" />
            Project Opportunities
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Review, accept, or decline project opportunities and formal assignment offers.
          </p>
        </div>
        
        {/* Mock toggle for Onboarded vs External state */}
        <div className="flex items-center gap-3 bg-slate-900/50 border border-white/5 rounded-xl p-2 px-4 shadow-inner">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Status:</span>
          <label className="flex items-center cursor-pointer gap-2">
            <span className={`text-[11px] font-bold ${!isExternal ? 'text-primary' : 'text-slate-500'}`}>Onboarded</span>
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={isExternal} onChange={() => setIsExternal(!isExternal)} />
              <div className={`block w-10 h-6 rounded-full transition-colors ${isExternal ? 'bg-amber-500/20 border border-amber-500/50' : 'bg-primary/20 border border-primary/50'}`}></div>
              <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isExternal ? 'transform translate-x-4 bg-amber-400' : 'bg-primary'}`}></div>
            </div>
            <span className={`text-[11px] font-bold ${isExternal ? 'text-amber-400' : 'text-slate-500'}`}>External</span>
          </label>
        </div>
      </div>

      {selectedOpportunity ? (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
          <button 
            onClick={() => setSelectedOptId(null)} 
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold bg-slate-900/50 hover:bg-slate-800 px-4 py-2 rounded-xl border border-white/5 w-fit"
          >
            <ChevronLeft size={16} /> Back to Opportunities
          </button>
          <div className="bg-card border border-white/5 rounded-3xl p-6 lg:p-10 shadow-lg">
            <OpportunityResponseForm 
              opportunity={selectedOpportunity} 
              onStageChange={(newStage, newStatus) => handleStageChange(selectedOpportunity.id, newStage, newStatus)} 
              isExternal={isExternal}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
          
          {/* Top Bar for List */}
          <div className="flex flex-col sm:flex-row gap-4 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text"
                placeholder="Search opportunities..."
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm font-semibold text-white focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            <button className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-slate-300 px-6 py-3 rounded-xl text-sm font-bold transition-colors whitespace-nowrap">
              <Filter size={16} /> Filter
            </button>
          </div>

          {/* Grid of Opportunities */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {opportunities.map(opt => (
              <div 
                key={opt.id} 
                className="bg-card border border-white/5 rounded-3xl p-6 flex flex-col hover:border-primary/30 transition-all hover:shadow-xl hover:-translate-y-1 shadow-lg group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono font-bold text-slate-500 bg-slate-900/50 px-2 py-1 rounded-md">{opt.id}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{opt.dateAssigned}</span>
                </div>
                
                <h3 className="text-lg font-black text-white mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                  {opt.title}
                </h3>
                
                <div className="mb-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold font-mono border ${getStageColor(opt.stage)}`}>
                    {opt.statusText}
                  </span>
                  {(opt.responseTimestamp || opt.lastUpdated) && (
                    <div className="mt-3 space-y-1">
                      {opt.responseTimestamp && (
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-500 font-bold uppercase tracking-wider">Submitted:</span>
                          <span className="font-mono text-slate-400">{new Date(opt.responseTimestamp).toLocaleDateString()}</span>
                        </div>
                      )}
                      {opt.lastUpdated && (
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="text-slate-500 font-bold uppercase tracking-wider">Last Updated:</span>
                          <span className="font-mono text-slate-400">{new Date(opt.lastUpdated).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-slate-400 line-clamp-3 mb-8 flex-1 leading-relaxed">
                  {opt.description}
                </p>
                
                <button 
                  onClick={() => setSelectedOptId(opt.id)}
                  className="mt-auto w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary text-primary hover:text-slate-950 py-3.5 rounded-xl font-bold transition-all border border-primary/20 hover:border-transparent group-hover:shadow-lg group-hover:shadow-primary/20"
                >
                  View Opportunity <ChevronRight size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
