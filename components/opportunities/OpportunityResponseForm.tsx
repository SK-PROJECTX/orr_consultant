"use client";

import React, { useState } from 'react';
import { Opportunity, useConsultantStore } from '@/store/consultantStore';
import { ArrowRight, CheckCircle, XCircle, HelpCircle, Loader2, Lock, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OpportunityResponseFormProps {
  opportunity: Opportunity;
  onStageChange: (newStage: any, newStatus: string) => void;
  isExternal?: boolean;
}

export default function OpportunityResponseForm({ opportunity, onStageChange, isExternal = false }: OpportunityResponseFormProps) {
  const router = useRouter();
  const respondToOpportunity = useConsultantStore(state => state.respondToOpportunity);
  const addNotification = useConsultantStore(state => state.addNotification);
  
  const [responseType, setResponseType] = useState<string>('');
  const [interestStatement, setInterestStatement] = useState('');
  const [clarificationRequest, setClarificationRequest] = useState('');
  const [declineReason, setDeclineReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!responseType) return;
    setIsSubmitting(true);
    
    try {
      await respondToOpportunity(opportunity.id, {
        response: responseType,
        interest_statement: interestStatement,
        clarification_request: clarificationRequest,
        decline_reason: declineReason
      });
      addNotification('Success', 'Opportunity response submitted successfully!', 'SYSTEM');
      onStageChange(responseType.toUpperCase(), 'Response Submitted');
    } catch (err: any) {
      addNotification('Error', err.message || 'Failed to submit response', 'SYSTEM');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRestrictedAccess = () => (
    <div className="flex flex-col items-center justify-center text-center space-y-6 py-12 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-24 h-24 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center border border-amber-500/20 shadow-lg shadow-amber-500/10 mb-2">
        <Lock size={40} className="mb-1" />
      </div>
      <div>
        <h3 className="text-2xl font-black text-white mb-3">Restricted Access</h3>
        <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
          You must complete the ORR consultant onboarding process before you can access this project opportunity.
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

  if (isExternal && opportunity.stage !== 'INVITED') {
    return renderRestrictedAccess();
  }

  // If already responded
  if (opportunity.stage !== 'INVITED' && opportunity.stage !== 'EXPRESSION_OF_INTEREST' && opportunity.stage !== 'NOT_RESPONDED') {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-6 py-12 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/10 mb-2">
          <CheckCircle size={40} className="mb-1" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-white mb-3">Response Received</h3>
          <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
            You have already submitted your response to this opportunity. 
            The Project Manager will review it and activate your access if selected.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="mb-2 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-2.5 py-1 bg-white/10 text-white rounded-md text-[10px] font-bold font-mono tracking-wider">
            {opportunity.id}
          </span>
          <span className="text-xs text-slate-500 font-mono">Assigned: {opportunity.dateAssigned}</span>
        </div>
        <h2 className="text-2xl lg:text-3xl font-black text-white leading-tight">
          {opportunity.title}
        </h2>
        <div className="mt-4 whitespace-pre-wrap text-sm text-slate-300">
          {opportunity.description}
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <h3 className="text-lg font-bold text-white">Your Response</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <label className={`p-4 rounded-xl border flex flex-col items-center gap-3 cursor-pointer transition-all ${responseType === 'interested' ? 'bg-primary/20 border-primary shadow-lg shadow-primary/10' : 'bg-slate-900/50 border-white/10 hover:border-white/20'}`}>
            <input type="radio" name="response" value="interested" className="hidden" onChange={(e) => setResponseType(e.target.value)} />
            <CheckCircle className={responseType === 'interested' ? 'text-primary' : 'text-slate-500'} size={24} />
            <span className={`font-bold text-sm ${responseType === 'interested' ? 'text-white' : 'text-slate-400'}`}>I am Interested</span>
          </label>
          <label className={`p-4 rounded-xl border flex flex-col items-center gap-3 cursor-pointer transition-all ${responseType === 'need_clarification' ? 'bg-amber-500/20 border-amber-500 shadow-lg shadow-amber-500/10' : 'bg-slate-900/50 border-white/10 hover:border-white/20'}`}>
            <input type="radio" name="response" value="need_clarification" className="hidden" onChange={(e) => setResponseType(e.target.value)} />
            <HelpCircle className={responseType === 'need_clarification' ? 'text-amber-500' : 'text-slate-500'} size={24} />
            <span className={`font-bold text-sm text-center ${responseType === 'need_clarification' ? 'text-white' : 'text-slate-400'}`}>Need Clarification</span>
          </label>
          <label className={`p-4 rounded-xl border flex flex-col items-center gap-3 cursor-pointer transition-all ${responseType === 'declined' ? 'bg-red-500/20 border-red-500 shadow-lg shadow-red-500/10' : 'bg-slate-900/50 border-white/10 hover:border-white/20'}`}>
            <input type="radio" name="response" value="declined" className="hidden" onChange={(e) => setResponseType(e.target.value)} />
            <XCircle className={responseType === 'declined' ? 'text-red-500' : 'text-slate-500'} size={24} />
            <span className={`font-bold text-sm ${responseType === 'declined' ? 'text-white' : 'text-slate-400'}`}>Decline</span>
          </label>
        </div>

        {responseType === 'interested' && (
          <div className="animate-in fade-in slide-in-from-top-2">
            <label className="block text-xs font-bold text-white mb-2">Interest Statement (Optional)</label>
            <textarea
              value={interestStatement}
              onChange={(e) => setInterestStatement(e.target.value)}
              placeholder="Briefly describe your interest and relevant experience..."
              className="w-full bg-slate-950/60 border border-primary/30 focus:border-primary rounded-xl p-4 text-sm text-white focus:outline-none transition-colors h-32 resize-none"
            />
          </div>
        )}

        {responseType === 'need_clarification' && (
          <div className="animate-in fade-in slide-in-from-top-2">
            <label className="block text-xs font-bold text-white mb-2">What needs clarification?</label>
            <textarea
              value={clarificationRequest}
              onChange={(e) => setClarificationRequest(e.target.value)}
              placeholder="Please detail the questions you have for the Project Manager..."
              className="w-full bg-slate-950/60 border border-amber-500/30 focus:border-amber-500 rounded-xl p-4 text-sm text-white focus:outline-none transition-colors h-32 resize-none"
            />
          </div>
        )}

        {responseType === 'declined' && (
          <div className="animate-in fade-in slide-in-from-top-2">
            <label className="block text-xs font-bold text-white mb-2">Reason for Declining (Optional)</label>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="E.g., No capacity, lack of relevant skills, etc."
              className="w-full bg-slate-950/60 border border-red-500/30 focus:border-red-500 rounded-xl p-4 text-sm text-white focus:outline-none transition-colors h-32 resize-none"
            />
          </div>
        )}

      </div>

      <div className="pt-4 border-t border-white/5 flex justify-end">
        <button 
          onClick={handleSubmit}
          disabled={!responseType || isSubmitting}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-[#11aa6a] text-slate-950 px-8 py-3.5 rounded-xl font-black transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Response'}
          {!isSubmitting && <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  );
}
