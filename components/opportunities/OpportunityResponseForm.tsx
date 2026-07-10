"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Opportunity, OpportunityStage } from '@/components/tabs/OpportunitiesTab';
import { CheckCircle, XCircle, HelpCircle, ShieldCheck, FileText, ArrowRight, Lock, UserPlus, Link as LinkIcon, EyeOff, UserCheck, AlertTriangle, Calendar, MapPin, Globe, Tag, Layers, Award, Briefcase } from 'lucide-react';

interface OpportunityResponseFormProps {
  opportunity: Opportunity;
  onStageChange: (newStage: OpportunityStage, newStatus: string) => void;
  isExternal?: boolean;
}

export default function OpportunityResponseForm({ opportunity, onStageChange, isExternal = false }: OpportunityResponseFormProps) {
  const router = useRouter();
  const [suitabilityStatement, setSuitabilityStatement] = useState('');
  const [coiConfirmed, setCoiConfirmed] = useState(false);
  const [conflictDetails, setConflictDetails] = useState('');
  const [ndaConfirmed, setNdaConfirmed] = useState(false);
  const [dataConfirmed, setDataConfirmed] = useState(false);
  
  const [responseChoice, setResponseChoice] = useState('');
  const [relevantExperience, setRelevantExperience] = useState('');
  const [availability, setAvailability] = useState('');
  const [estimatedCapacity, setEstimatedCapacity] = useState('');
  const [clarificationRequest, setClarificationRequest] = useState('');
  const [declineReason, setDeclineReason] = useState('');
  const [declineOther, setDeclineOther] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const RESPONSE_CHOICES = [
    'I am interested',
    'I may be interested after reviewing more details',
    'I need clarification',
    'I decline'
  ];

  const AVAILABILITY_OPTIONS = [
    'Available immediately', 'Available within 1 week', 'Available within 2 weeks', 'Limited availability', 'Not currently available'
  ];

  const CAPACITY_OPTIONS = [
    '1–5 hours', '5–10 hours', '10–20 hours', '20+ hours', 'Project-dependent'
  ];

  const DECLINE_REASONS = [
    'Not available', 'Outside expertise', 'Conflict of interest', 'Timeline not suitable', 'Commercial terms not suitable', 'Other'
  ];

  // Helper to mock an API call transition
  const handleTransition = (newStage: OpportunityStage, newStatus: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      onStageChange(newStage, newStatus);
      setIsSubmitting(false);
    }, 1500);
  };

  const renderExpressionOfInterest = () => (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* SECTION 1: System Linkage */}
      <div className="xl:col-span-1 bg-slate-900/40 p-6 rounded-3xl border border-white/5 space-y-5">
        {/* Status Tracking */}
        {(opportunity.responseTimestamp || opportunity.lastUpdated) && (
          <div className="bg-black/30 p-4 rounded-2xl border border-white/5 space-y-3 mb-6">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Status Tracking</h5>
            {opportunity.responseTimestamp && (
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400">Response Submitted</span>
                <span className="text-[10px] font-mono text-slate-300">
                  {new Date(opportunity.responseTimestamp).toLocaleString()}
                </span>
              </div>
            )}
            {opportunity.lastUpdated && (
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400">Last Updated</span>
                <span className="text-[10px] font-mono text-slate-300">
                  {new Date(opportunity.lastUpdated).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )}

        <h4 className="text-sm font-bold text-white mb-2 font-mono uppercase tracking-wider flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <LinkIcon size={14} />
          </div>
          System Linkage
        </h4>
        
        {/* Opportunity ID */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center justify-between">
            Opportunity ID
            <span className="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Auto</span>
          </label>
          <div className="bg-slate-950/60 border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-slate-300 shadow-inner">
            {opportunity.id}
          </div>
          <p className="text-[10px] text-slate-500">Auto-generated system field</p>
        </div>
        
        {/* Project ID */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center justify-between">
            Project ID
            <span className="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Auto</span>
          </label>
          <div className="bg-slate-950/60 border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-slate-300 shadow-inner">
            PRJ-2026-089
          </div>
          <p className="text-[10px] text-slate-500">Auto-filled from project record</p>
        </div>

        {/* Client ID */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center justify-between">
            Client ID
            <span className="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Hidden</span>
          </label>
          <div className="bg-slate-950/30 border border-white/5 rounded-xl px-4 py-3 text-sm font-mono text-slate-600 flex items-center gap-2 cursor-not-allowed">
            <EyeOff size={14} /> [Hidden for confidentiality]
          </div>
          <p className="text-[10px] text-slate-500">Not displayed unless authorised</p>
        </div>

        {/* Consultant ID / External Email */}
        {!isExternal ? (
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center justify-between">
              Consultant ID
              <span className="text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded">Auto</span>
            </label>
            <div className="bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 text-sm font-mono text-primary flex items-center gap-2 shadow-inner">
               <UserCheck size={14} /> ORR-CONS-8492
            </div>
            <p className="text-[10px] text-slate-500">Auto-filled from consultant profile</p>
          </div>
        ) : (
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-amber-500 uppercase tracking-wider flex items-center justify-between">
              External Consultant Email
              <span className="text-[8px] bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded">Required</span>
            </label>
            <input 
              type="email"
              placeholder="Enter your email address"
              className="w-full bg-slate-950/80 border border-amber-500/30 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all shadow-inner"
            />
            <p className="text-[10px] text-amber-500/70">Required for restricted invitation</p>
          </div>
        )}

        {/* Audit Trail */}
        <div className="pt-4 border-t border-white/5 space-y-3">
          <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Audit Trail</h5>
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Created By</span>
            <span className="font-mono text-slate-300">{opportunity.createdBy || 'System'}</span>
          </div>
          <div className="flex justify-between items-center text-[10px]">
            <span className="text-slate-400 font-bold uppercase tracking-wider">Summary Version</span>
            <span className="font-mono text-slate-300">{opportunity.summaryVersion || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: Opportunity Details & Response */}
      <div className="xl:col-span-2 flex flex-col bg-slate-900/40 p-6 rounded-3xl border border-white/5">
        <h4 className="text-sm font-bold text-white mb-6 font-mono uppercase tracking-wider flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <FileText size={14} />
          </div>
          Opportunity Details & Response
        </h4>

        {/* Confidentiality Notice */}
        <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3">
          <AlertTriangle className="text-red-400 shrink-0 mt-0.5" size={16} />
          <div>
            <h5 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1 font-mono">Confidentiality Notice</h5>
            <p className="text-xs text-red-200/80 leading-relaxed italic">
              "This opportunity summary is confidential and is shared only for the purpose of assessing your suitability and availability. Do not copy, forward, disclose, or use this information for any other purpose."
            </p>
          </div>
        </div>

        <div className="bg-slate-950/40 p-6 rounded-2xl border border-white/5 relative overflow-hidden mb-6">
          <h5 className="text-xs font-bold text-slate-400 mb-3 font-mono uppercase tracking-wider">Consultant-Facing Project Summary</h5>
          
          {isExternal ? (
            <>
              <p className="text-slate-300 text-sm leading-relaxed blur-[3px] select-none">
                {opportunity.description.length > 100 ? opportunity.description : opportunity.description + " This is additional mock text to ensure the blur looks substantial and covers a decent amount of the block so it clearly looks like hidden content."}
              </p>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-[1px]">
                <Lock className="text-amber-400 mb-2 drop-shadow-md" size={24} />
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest drop-shadow-md">Restricted Summary</span>
              </div>
            </>
          ) : (
            <p className="text-slate-300 text-sm leading-relaxed">
              {opportunity.description}
            </p>
          )}
        </div>

        {/* Additional Opportunity Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 relative">
          {isExternal && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-[2px] rounded-2xl border border-white/5">
               <Lock className="text-amber-400 mb-2 drop-shadow-md" size={20} />
               <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest drop-shadow-md">Details Hidden</span>
            </div>
          )}

          {/* Service Category */}
          <div className="bg-slate-950/30 border border-white/5 rounded-xl p-4 flex gap-3 items-start">
            <Layers className="text-slate-500 shrink-0 mt-0.5" size={16} />
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Service Category</label>
              <span className="text-sm font-semibold text-slate-200">{opportunity.serviceCategory || 'Not specified'}</span>
            </div>
          </div>

          {/* Expected Role */}
          <div className="bg-slate-950/30 border border-white/5 rounded-xl p-4 flex gap-3 items-start">
            <Briefcase className="text-slate-500 shrink-0 mt-0.5" size={16} />
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Expected Role</label>
              <span className="text-sm font-semibold text-slate-200">{opportunity.expectedRole || 'Not specified'}</span>
            </div>
          </div>

          {/* Expected Deliverable */}
          <div className="bg-slate-950/30 border border-white/5 rounded-xl p-4 flex gap-3 items-start">
            <Tag className="text-slate-500 shrink-0 mt-0.5" size={16} />
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Expected Deliverable</label>
              <span className="text-sm font-semibold text-slate-200">{opportunity.expectedDeliverable || 'Not specified'}</span>
            </div>
          </div>

          {/* Indicative Deadline */}
          <div className="bg-slate-950/30 border border-white/5 rounded-xl p-4 flex gap-3 items-start">
            <Calendar className="text-slate-500 shrink-0 mt-0.5" size={16} />
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Indicative Deadline</label>
              <span className="text-sm font-semibold text-slate-200">{opportunity.indicativeDeadline || 'Not specified'}</span>
            </div>
          </div>

          {/* Work Mode & Languages (Grouped for space) */}
          <div className="bg-slate-950/30 border border-white/5 rounded-xl p-4 flex flex-col gap-4">
             <div className="flex gap-3 items-start">
                <MapPin className="text-slate-500 shrink-0 mt-0.5" size={16} />
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Work Mode</label>
                  <span className="text-sm font-semibold text-slate-200">{opportunity.workMode || 'Not specified'}</span>
                </div>
             </div>
             <div className="w-full h-px bg-white/5"></div>
             <div className="flex gap-3 items-start">
                <Globe className="text-slate-500 shrink-0 mt-0.5" size={16} />
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Required Language(s)</label>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {opportunity.requiredLanguages?.map(lang => (
                      <span key={lang} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-xs font-medium">{lang}</span>
                    )) || <span className="text-sm font-semibold text-slate-500">Not specified</span>}
                  </div>
                </div>
             </div>
          </div>

          {/* Required Expertise */}
          <div className="bg-slate-950/30 border border-white/5 rounded-xl p-4 flex gap-3 items-start">
            <Award className="text-slate-500 shrink-0 mt-0.5" size={16} />
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Required Expertise</label>
              <div className="flex flex-wrap gap-2">
                {opportunity.requiredExpertise?.map(skill => (
                  <span key={skill} className="px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold">
                    {skill}
                  </span>
                )) || <span className="text-sm font-semibold text-slate-500">Not specified</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 mb-6 flex-1 bg-slate-900/50 p-6 rounded-2xl border border-white/5">
          <h5 className="text-sm font-bold text-white font-mono uppercase tracking-wider border-b border-white/10 pb-3 mb-4">Consultant Response</h5>
          
          {/* Response Choice */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Response Choice <span className="text-red-400">*</span></label>
            <select 
              value={responseChoice} 
              onChange={(e) => setResponseChoice(e.target.value)}
              className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
            >
              <option value="" disabled>Select a response...</option>
              {RESPONSE_CHOICES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <p className="text-[10px] text-slate-500">This is an expression of interest only, not assignment acceptance.</p>
          </div>

          {/* Conditional Fields based on Response Choice */}
          {(responseChoice === 'I am interested' || responseChoice === 'I may be interested after reviewing more details') && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Suitability Statement <span className="text-red-400">*</span></label>
                <p className="text-[10px] text-slate-500">Briefly explain why you are suitable for this project.</p>
                <textarea 
                  value={suitabilityStatement}
                  onChange={(e) => setSuitabilityStatement(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors h-24 resize-none shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Relevant Experience (Recommended)</label>
                <p className="text-[10px] text-slate-500">Briefly describe relevant experience, qualifications, or previous work.</p>
                <textarea 
                  value={relevantExperience}
                  onChange={(e) => setRelevantExperience(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors h-32 resize-none shadow-inner"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Availability Confirmation</label>
                  <select 
                    value={availability} 
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                  >
                    <option value="">Select availability...</option>
                    {AVAILABILITY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Estimated Capacity</label>
                  <select 
                    value={estimatedCapacity} 
                    onChange={(e) => setEstimatedCapacity(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                  >
                    <option value="">Select capacity...</option>
                    {CAPACITY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {responseChoice === 'I need clarification' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Clarification Request <span className="text-red-400">*</span></label>
              <p className="text-[10px] text-slate-500">Enter any questions or clarifications needed before you can confirm interest.</p>
              <textarea 
                value={clarificationRequest}
                onChange={(e) => setClarificationRequest(e.target.value)}
                className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors h-32 resize-none shadow-inner"
              />
            </div>
          )}

          {responseChoice === 'I decline' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Decline Reason <span className="text-red-400">*</span></label>
                <select 
                  value={declineReason} 
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                >
                  <option value="" disabled>Select reason...</option>
                  {DECLINE_REASONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {declineReason === 'Other' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">Additional Details (Optional)</label>
                  <input 
                    type="text"
                    value={declineOther}
                    onChange={(e) => setDeclineOther(e.target.value)}
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors shadow-inner"
                    placeholder="Please specify..."
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 pt-6 border-t border-white/5 mt-auto">
          {isExternal ? (
            <div className="w-full flex flex-col gap-6">
              <div className="w-full bg-amber-500/5 border border-amber-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-4 text-left">
                <AlertTriangle className="text-amber-500 shrink-0 mt-1" size={24} />
                <div>
                  <h4 className="text-amber-400 font-bold mb-2">Onboarding Required Notice</h4>
                  <p className="text-sm text-amber-200/80 leading-relaxed">
                    Before ORR can formally assign you to this project or share further information, you must complete the ORR consultant onboarding and approval process.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col xl:flex-row gap-4">
                <button 
                  onClick={() => {
                    handleTransition('EXPRESSION_OF_INTEREST', 'Interest Submitted (Pending Onboarding)');
                    setTimeout(() => router.push(`/register?opportunityId=${opportunity.id}`), 1500);
                  }}
                  disabled={
                    isSubmitting || 
                    !responseChoice || 
                    (responseChoice === 'I decline' && !declineReason) || 
                    (responseChoice === 'I need clarification' && !clarificationRequest) || 
                    ((responseChoice === 'I am interested' || responseChoice === 'I may be interested after reviewing more details') && !suitabilityStatement)
                  }
                  className="flex-[2] flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 py-3.5 px-6 rounded-xl font-black transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit interest and continue to consultant onboarding'}
                  {!isSubmitting && <ArrowRight size={18} />}
                </button>
                
                <button 
                  onClick={() => router.push(`/register?opportunityId=${opportunity.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-3.5 px-6 rounded-xl font-bold transition-all border border-transparent whitespace-nowrap"
                >
                  Start onboarding
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => handleTransition('SELECTION', 'Under Review by Admin')}
              disabled={
                isSubmitting || 
                !responseChoice || 
                (responseChoice === 'I decline' && !declineReason) || 
                (responseChoice === 'I need clarification' && !clarificationRequest) || 
                ((responseChoice === 'I am interested' || responseChoice === 'I may be interested after reviewing more details') && !suitabilityStatement)
              }
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-[#11aa6a] text-slate-950 py-3.5 rounded-xl font-black transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Response'}
              {!isSubmitting && <CheckCircle size={18} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderSelection = () => (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* SECTION 1: System Linkage (Read-only reference) */}
      <div className="xl:col-span-1 space-y-6">
        {/* Status Tracking */}
        {(opportunity.responseTimestamp || opportunity.lastUpdated) && (
          <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 shadow-lg space-y-4">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Status Tracking</h5>
            {opportunity.responseTimestamp && (
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-[10px] font-bold text-slate-400">Response Submitted</span>
                <span className="text-[10px] font-mono text-slate-300">
                  {new Date(opportunity.responseTimestamp).toLocaleString()}
                </span>
              </div>
            )}
            {opportunity.lastUpdated && (
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400">Last Updated</span>
                <span className="text-[10px] font-mono text-slate-300">
                  {new Date(opportunity.lastUpdated).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 shadow-lg">
          <h5 className="text-sm font-bold text-white font-mono uppercase tracking-wider border-b border-white/10 pb-3 mb-6">System Linkage</h5>
          
          <div className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1.5">Opportunity ID</label>
              <div className="bg-slate-950/50 border border-white/5 rounded-xl p-3 flex items-center justify-between">
                <span className="text-sm font-mono text-slate-300 font-medium">{opportunity.id}</span>
                <Lock size={14} className="text-slate-600" />
              </div>
            </div>
          </div>

          {/* Audit Trail */}
          <div className="pt-4 border-t border-white/5 space-y-3 mt-5">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Audit Trail</h5>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-400 font-bold uppercase tracking-wider">Created By</span>
              <span className="font-mono text-slate-300">{opportunity.createdBy || 'System'}</span>
            </div>
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-400 font-bold uppercase tracking-wider">Summary Version</span>
              <span className="font-mono text-slate-300">{opportunity.summaryVersion || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Status & Review */}
      <div className="xl:col-span-2 flex flex-col space-y-6">
        <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 lg:p-10 shadow-lg flex flex-col items-center justify-center text-center flex-1 min-h-[400px]">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative w-24 h-24 bg-slate-950 border border-blue-500/30 text-blue-400 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/10">
              <ShieldCheck size={40} />
            </div>
          </div>
          
          <h3 className="text-2xl font-black text-white mb-3">Under Administrative Review</h3>
          
          <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed mb-8">
            Your expression of interest has been successfully logged. The ORR Administrative team and Project Managers are currently reviewing all candidate profiles.
          </p>

          <div className="w-full max-w-sm bg-slate-950/50 border border-white/5 rounded-2xl p-5 text-left space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Internal Status</span>
              <span className="text-xs font-bold text-blue-400 bg-blue-400/10 px-2.5 py-1 rounded-md">Shortlisting in Progress</span>
            </div>
            <div className="w-full h-px bg-white/5"></div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Note: Administrative selection notes and shortlist rankings are strictly internal and not visible on the Consultant Portal. You will be notified immediately if you are formally selected for Assignment Acceptance.
            </p>
          </div>

          <div className="mt-8">
            <button 
              onClick={() => handleTransition('ASSIGNMENT_ACCEPTANCE', 'Formal Assignment Offer')}
              className="text-[10px] text-slate-600 underline hover:text-slate-400 transition-colors uppercase tracking-widest font-bold"
            >
              [Mock Transition to Assignment Acceptance]
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAssignmentAcceptance = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="bg-purple-500/10 border border-purple-500/20 p-6 rounded-2xl flex items-start gap-4">
        <FileText className="text-purple-400 shrink-0 mt-1" size={24} />
        <div>
          <h3 className="text-lg font-bold text-purple-100 mb-1">Formal Assignment Offer</h3>
          <p className="text-sm text-purple-300/80">
            You have been selected for this assignment. Before project access can be granted, you must formally accept the assignment and confirm the following compliance requirements.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Compliance Confirmations</h4>
        
        {/* Conflict of Interest */}
        <div className="space-y-4 bg-slate-900/30 border border-white/5 p-5 rounded-2xl">
          <label className="flex items-start gap-4 cursor-pointer hover:bg-slate-900/60 p-2 -m-2 rounded-xl transition-colors">
            <input 
              type="checkbox" 
              checked={coiConfirmed}
              onChange={(e) => {
                setCoiConfirmed(e.target.checked);
                if (e.target.checked) setConflictDetails(''); // Clear details if they confirm no conflict
              }}
              className="mt-1 accent-primary w-5 h-5 cursor-pointer shrink-0"
            />
            <div className="flex-1">
              <span className="block text-sm font-bold text-white mb-1">Conflict of Interest Declaration</span>
              <span className="block text-xs text-slate-400 leading-relaxed">
                I confirm that I have no actual or potential conflict of interest in relation to this project. If any conflict exists, I will disclose it below.
              </span>
            </div>
          </label>

          {!coiConfirmed && (
            <div className="pl-9 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-black uppercase tracking-widest text-amber-500 block mb-2">Conflict Details (Required if unconfirmed above)</label>
              <textarea
                value={conflictDetails}
                onChange={(e) => setConflictDetails(e.target.value)}
                placeholder="Describe any actual, potential, or perceived conflict of interest..."
                className="w-full bg-slate-950/60 border border-amber-500/30 focus:border-amber-500/60 rounded-xl p-3 text-sm text-white focus:outline-none transition-colors h-24 resize-none shadow-inner placeholder:text-slate-600"
              />
              <p className="text-[10px] text-amber-500/70 mt-1">Note: Disclosing a conflict requires Admin review before project access can be activated.</p>
            </div>
          )}
        </div>

        {/* Confidentiality Reconfirmation */}
        <label className="flex items-start gap-4 p-5 rounded-2xl border border-white/5 bg-slate-900/30 cursor-pointer hover:bg-slate-900/60 transition-colors">
          <input 
            type="checkbox" 
            checked={ndaConfirmed}
            onChange={(e) => setNdaConfirmed(e.target.checked)}
            className="mt-1 accent-primary w-5 h-5 cursor-pointer shrink-0"
          />
          <div className="flex-1">
            <span className="block text-sm font-bold text-white mb-1">Confidentiality Reconfirmation</span>
            <span className="block text-xs text-slate-400 leading-relaxed">
              I reconfirm that all project information, client information, documents, communications, and ORR internal materials are confidential and must only be used for the assigned ORR work.
            </span>
          </div>
        </label>

        {/* Data Handling Confirmation */}
        <label className="flex items-start gap-4 p-5 rounded-2xl border border-white/5 bg-slate-900/30 cursor-pointer hover:bg-slate-900/60 transition-colors">
          <input 
            type="checkbox" 
            checked={dataConfirmed}
            onChange={(e) => setDataConfirmed(e.target.checked)}
            className="mt-1 accent-primary w-5 h-5 cursor-pointer shrink-0"
          />
          <div className="flex-1">
            <span className="block text-sm font-bold text-white mb-1">Data Handling Confirmation</span>
            <span className="block text-xs text-slate-400 leading-relaxed">
              I agree to access, store, process, and communicate project information only through approved ORR channels and according to ORR instructions.
            </span>
          </div>
        </label>
      </div>

      <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row justify-end gap-4">
        {(!coiConfirmed && conflictDetails.trim().length > 0) && (
          <div className="flex-1 flex items-center gap-2 text-amber-500 bg-amber-500/10 px-4 py-3 rounded-xl border border-amber-500/20 text-xs font-bold">
            <AlertTriangle size={16} />
            Submitting this conflict declaration will pause access until Admin review.
          </div>
        )}
        <button 
          onClick={() => handleTransition('ACCESS_ACTIVATION', !coiConfirmed ? 'Conflict Review Required' : 'Project Access Activated')}
          disabled={(!coiConfirmed && conflictDetails.trim().length === 0) || !ndaConfirmed || !dataConfirmed || isSubmitting}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-[#11aa6a] text-slate-950 px-8 py-3.5 rounded-xl font-black transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Processing...' : (!coiConfirmed ? 'Submit for Conflict Review' : 'Accept Assignment & Activate Access')}
          {!isSubmitting && <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  );

  const renderAccessPendingNotice = () => (
    <div className="flex flex-col items-center justify-center text-center space-y-6 py-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center border border-amber-500/20 shadow-lg shadow-amber-500/10 mb-2">
        <Lock size={40} className="mb-1" />
      </div>
      <div>
        <h3 className="text-2xl font-black text-white mb-3">Access Pending Activation</h3>
        <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
          Your assignment has been accepted. Project access will be activated after ORR completes the required compliance checks.
        </p>
      </div>
    </div>
  );

  const renderExternalRestrictedAccess = () => (
    <div className="flex flex-col items-center justify-center text-center space-y-6 py-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center border border-amber-500/20 shadow-lg shadow-amber-500/10 mb-2">
        <Lock size={40} className="mb-1" />
      </div>
      <div>
        <h3 className="text-2xl font-black text-white mb-3">Restricted Access</h3>
        <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
          You must complete the ORR consultant onboarding process before you can access advanced stages of project opportunities.
        </p>
      </div>
      <div className="pt-6 w-full max-w-xs">
         <button 
          onClick={() => router.push('/register')}
          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-4 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20"
        >
          <UserPlus size={18} />
          Complete Onboarding
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="mb-8 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-2.5 py-1 bg-white/10 text-white rounded-md text-[10px] font-bold font-mono tracking-wider">
            {opportunity.id}
          </span>
          <span className="text-xs text-slate-500 font-mono">Assigned: {opportunity.dateAssigned}</span>
        </div>
        <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight">
          {opportunity.title}
        </h2>
      </div>

      <div className="flex-1">
        {isExternal && opportunity.stage !== 'EXPRESSION_OF_INTEREST' ? (
          renderExternalRestrictedAccess()
        ) : (
          <>
            {opportunity.stage === 'EXPRESSION_OF_INTEREST' && renderExpressionOfInterest()}
            {opportunity.stage === 'SELECTION' && renderSelection()}
            {opportunity.stage === 'ASSIGNMENT_ACCEPTANCE' && renderAssignmentAcceptance()}
            {opportunity.stage === 'ACCESS_ACTIVATION' && renderAccessPendingNotice()}
          </>
        )}
      </div>
    </div>
  );
}
