import React, { useState } from 'react';
import { useConsultantStore, Invoice } from '@/store/consultantStore';
import { 
  Wallet, 
  UploadCloud, 
  CheckCircle, 
  Clock, 
  ShieldAlert, 
  FileText, 
  ChevronDown, 
  ChevronUp, 
  DollarSign, 
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';

export default function WalletTab() {
  const walletBalance = useConsultantStore(state => state.walletBalance);
  const invoices = useConsultantStore(state => state.invoices);
  const submitInvoice = useConsultantStore(state => state.submitInvoice);
  const tasks = useConsultantStore(state => state.tasks);

  // Form State
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [selectedTask, setSelectedTask] = useState('');
  const [billingPeriod, setBillingPeriod] = useState('May 16 - May 24, 2026');
  const [hours, setHours] = useState(10);
  const [rate, setRate] = useState(125);
  const [fileName, setFileName] = useState('');
  const [notes, setNotes] = useState('');
  const [fileDragging, setFileDragging] = useState(false);

  // Expands detail
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);

  // Completed or active billable tasks list
  const billableTasks = tasks.filter(t => t.status === 'COMPLETED' || t.status === 'UNDER_REVIEW');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setFileDragging(true);
  };

  const handleDragLeave = () => {
    setFileDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setFileDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !fileName) {
      alert("Please map a task and upload an invoice PDF sheet.");
      return;
    }

    const calculatedAmount = hours * rate;

    submitInvoice({
      invoiceNumber,
      billingPeriod,
      hours,
      rate,
      amount: calculatedAmount,
      taskTitle: selectedTask,
      fileName,
      notes
    });

    // Reset Form
    setShowSubmitModal(false);
    setFileName('');
    setNotes('');
    setSelectedTask('');
    setInvoiceNumber(`INV-2026-${Math.floor(100 + Math.random() * 900)}`);
  };

  const getStatusBadge = (status: Invoice['status']) => {
    switch (status) {
      case 'PAID':
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] px-2 py-0.5 rounded-full font-black uppercase font-mono">Paid</span>;
      case 'PROCESSING':
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] px-2 py-0.5 rounded-full font-black uppercase font-mono animate-pulse">Processing</span>;
      case 'APPROVED':
        return <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[9px] px-2 py-0.5 rounded-full font-black uppercase font-mono">Approved</span>;
      case 'UNDER_REVIEW':
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] px-2 py-0.5 rounded-full font-black uppercase font-mono">Under PM Review</span>;
      default:
        return <span className="bg-slate-800 text-slate-400 border border-white/5 text-[9px] px-2 py-0.5 rounded-full font-black uppercase font-mono">Submitted</span>;
    }
  };

  // Timeline Stepper rendering helper
  const getTimelineStepClass = (currentStatus: Invoice['status'], stepStatus: Invoice['status'][]) => {
    const statusOrder: Invoice['status'][] = ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'PROCESSING', 'PAID'];
    const currentIdx = statusOrder.indexOf(currentStatus);
    
    // Check if the step status falls before or matches the current index
    const matches = stepStatus.map(s => statusOrder.indexOf(s));
    const highestMatch = Math.max(...matches);

    if (currentIdx >= highestMatch) {
      return {
        circle: 'bg-primary text-background border-primary shadow-lg shadow-primary/20',
        label: 'text-white font-bold',
        bar: 'bg-primary'
      };
    }
    return {
      circle: 'bg-slate-850 text-slate-500 border-white/10',
      label: 'text-slate-500 font-semibold',
      bar: 'bg-white/10'
    };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-white">Wallet & Invoicing Ledger</h1>
          <p className="text-slate-400 text-xs mt-1">Submit digital invoices for approved milestone deliverables and track disbursement status.</p>
        </div>
        <button
          onClick={() => setShowSubmitModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-primary hover:opacity-90 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-primary/10 transition-all active:scale-[0.98] cursor-pointer"
        >
          <UploadCloud size={16} />
          Submit Digital Invoice
        </button>
      </div>

      {/* Ledger Balances Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-card to-card-light p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute right-6 top-6 text-primary opacity-20 group-hover:scale-110 transition-transform duration-300"><Wallet size={40} /></div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono block">Cleared / Available Balance</span>
          <h2 className="text-3xl font-black text-white mt-2">${walletBalance.available.toLocaleString()}</h2>
          <p className="text-[10px] text-slate-400 mt-4 font-semibold flex items-center gap-1">
            <CheckCircle size={12} className="text-primary" />
            Ready for standard withdrawal cycle
          </p>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute right-6 top-6 text-amber-400 opacity-20 group-hover:scale-110 transition-transform duration-300"><Clock size={40} /></div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono block">Pending Treasury Approval</span>
          <h2 className="text-3xl font-black text-white mt-2">${walletBalance.pending.toLocaleString()}</h2>
          <p className="text-[10px] text-slate-400 mt-4 font-semibold flex items-center gap-1">
            <TrendingUp size={12} className="text-primary" />
            Accumulated invoices in routing
          </p>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute right-6 top-6 text-cyan-400 opacity-20 group-hover:scale-110 transition-transform duration-300"><DollarSign size={40} /></div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono block">Cumulative Portal Earnings</span>
          <h2 className="text-3xl font-black text-white mt-2">${walletBalance.totalEarned.toLocaleString()}</h2>
          <p className="text-[10px] text-slate-400 mt-4 font-semibold flex items-center gap-1">
            <ArrowUpRight size={12} className="text-cyan-400" />
            Specialist contract record sum
          </p>
        </div>
      </div>

      {/* Invoice list ledger */}
      <div className="space-y-4">
        <h2 className="text-base font-extrabold text-white">Invoice Submissions Ledger</h2>

        {invoices.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/10 border border-white/5 rounded-2xl space-y-2">
            <FileText size={32} className="text-slate-600 mx-auto" />
            <h4 className="text-xs font-bold text-slate-400">No invoices submitted yet</h4>
            <p className="text-[10px] text-slate-500">Complete tasks and click 'Submit Digital Invoice' to trigger billing.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map(inv => {
              const isExpanded = expandedInvoiceId === inv.id;
              
              // Get timeline step statuses
              const s1 = getTimelineStepClass(inv.status, ['SUBMITTED']);
              const s2 = getTimelineStepClass(inv.status, ['UNDER_REVIEW']);
              const s3 = getTimelineStepClass(inv.status, ['APPROVED']);
              const s4 = getTimelineStepClass(inv.status, ['PROCESSING']);
              const s5 = getTimelineStepClass(inv.status, ['PAID']);

              return (
                <div 
                  key={inv.id}
                  className="bg-card/50 border border-white/5 hover:border-white/10 transition-all rounded-2xl overflow-hidden"
                >
                  {/* Ledger summary row */}
                  <div
                    onClick={() => setExpandedInvoiceId(isExpanded ? null : inv.id)}
                    className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-slate-900/60 border border-white/5 rounded-xl text-primary flex-shrink-0">
                        <FileText size={18} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-white font-extrabold">{inv.invoiceNumber}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({inv.billingPeriod})</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-400">Billed Task: <span className="text-slate-300">{inv.taskTitle}</span></h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 self-stretch md:self-auto justify-between md:justify-end border-t border-white/5 md:border-transparent pt-3 md:pt-0">
                      <div className="text-right">
                        <span className="text-sm font-black text-white font-mono">${inv.amount.toLocaleString()}</span>
                        <p className="text-[9px] text-slate-500 font-mono mt-0.5">{inv.hours} hrs @ ${inv.rate}/hr</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(inv.status)}
                        <div className="p-1 hover:bg-white/5 rounded-lg text-slate-400 transition">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Approval Tracker Timeline */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-white/5 bg-slate-950/20 space-y-6 animate-in slide-in-from-top-1 duration-200">
                      
                      {/* Interactive Visual Stepper Progress */}
                      <div className="space-y-3">
                        <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block font-mono">Disbursement Progress Roadmap</span>
                        
                        <div className="bg-slate-900/50 p-6 border border-white/5 rounded-2xl">
                          {/* Stepper graphical line */}
                          <div className="relative flex justify-between items-center max-w-2xl mx-auto py-2">
                            {/* Running connecting horizontal lines */}
                            <div className="absolute top-1/2 left-0 w-full h-[3px] bg-slate-800 -translate-y-1/2 rounded-full pointer-events-none" />
                            <div className={`absolute top-1/2 left-0 h-[3px] -translate-y-1/2 rounded-full pointer-events-none transition-all duration-500 ${
                              inv.status === 'PAID' ? 'w-full bg-primary' : 
                              inv.status === 'PROCESSING' ? 'w-3/4 bg-primary' :
                              inv.status === 'APPROVED' ? 'w-1/2 bg-primary' :
                              inv.status === 'UNDER_REVIEW' ? 'w-1/4 bg-primary' : 'w-0'
                            }`} />

                            {/* Node 1: Submitted */}
                            <div className="relative flex flex-col items-center gap-1.5 z-10">
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs transition-all ${s1.circle}`}>
                                1
                              </div>
                              <span className={`text-[9px] font-mono tracking-tight ${s1.label}`}>Uploaded</span>
                            </div>

                            {/* Node 2: PM Review */}
                            <div className="relative flex flex-col items-center gap-1.5 z-10">
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs transition-all ${s2.circle}`}>
                                2
                              </div>
                              <span className={`text-[9px] font-mono tracking-tight ${s2.label}`}>PM Audit</span>
                            </div>

                            {/* Node 3: Approved */}
                            <div className="relative flex flex-col items-center gap-1.5 z-10">
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs transition-all ${s3.circle}`}>
                                3
                              </div>
                              <span className={`text-[9px] font-mono tracking-tight ${s3.label}`}>Approved</span>
                            </div>

                            {/* Node 4: Treasury Processing */}
                            <div className="relative flex flex-col items-center gap-1.5 z-10">
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs transition-all ${s4.circle}`}>
                                4
                              </div>
                              <span className={`text-[9px] font-mono tracking-tight ${s4.label}`}>Processing</span>
                            </div>

                            {/* Node 5: Disbursed / Paid */}
                            <div className="relative flex flex-col items-center gap-1.5 z-10">
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs transition-all ${s5.circle}`}>
                                5
                              </div>
                              <span className={`text-[9px] font-mono tracking-tight ${s5.label}`}>Settled</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Detail ledger logs */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block font-mono">Invoice Parameters</span>
                          <div className="p-4 bg-slate-900/30 border border-white/5 rounded-xl space-y-1 font-mono text-[10px] text-slate-400">
                            <div><strong className="text-slate-300">File uploaded:</strong> {inv.fileName}</div>
                            <div><strong className="text-slate-300">Logged hours:</strong> {inv.hours} Hours</div>
                            <div><strong className="text-slate-300">Hourly charge:</strong> ${inv.rate}/hr</div>
                            <div><strong className="text-slate-300">Submitted at:</strong> {new Date(inv.submittedAt).toLocaleString()}</div>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider block font-mono">Auditor & PM Notes</span>
                          <div className="p-4 bg-slate-900/30 border border-white/5 rounded-xl text-xs leading-relaxed text-slate-300 font-semibold min-h-[75px]">
                            {inv.reviewerNotes || 'Invoice received. Security metadata auditing pending.'}
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Invoice Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="max-w-xl w-full bg-slate-900 border border-primary/20 backdrop-blur-2xl p-6 lg:p-8 rounded-[2rem] space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-primary tracking-wider font-mono">Digital Billing Suite</span>
                <h3 className="text-lg font-black text-white">Generate Invoice Submission</h3>
              </div>
              <button 
                onClick={() => setShowSubmitModal(false)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
              >
                <ChevronDown size={18} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">Invoice Number</label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={e => setInvoiceNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-primary/50 transition-colors font-mono"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">Billing Period</label>
                  <input
                    type="text"
                    value={billingPeriod}
                    onChange={e => setBillingPeriod(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-primary/50 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Task mapping selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">Select Billed Task</label>
                <select
                  value={selectedTask}
                  onChange={e => setSelectedTask(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-primary/50 transition-colors"
                  required
                >
                  <option value="" className="text-slate-800">-- Choose Completed/Audited Deliverable --</option>
                  {billableTasks.map(t => (
                    <option key={t.id} value={t.title} className="text-slate-800">
                      [{t.id}] {t.title} ({t.status})
                    </option>
                  ))}
                  <option value="General Technical Consultation" className="text-slate-800">General Technical Partner Consultation</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">Hourly Billing Units</label>
                  <input
                    type="number"
                    value={hours}
                    onChange={e => setHours(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-primary/50 transition-colors font-mono"
                    min={1}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">Agreed Contract Rate ($/hr)</label>
                  <input
                    type="number"
                    value={rate}
                    onChange={e => setRate(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-xs font-bold text-white focus:outline-none focus:border-primary/50 transition-colors font-mono"
                    min={1}
                    required
                  />
                </div>
              </div>

              {/* Drag and Drop File Upload Area */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">Invoice PDF Attachment</label>
                
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`p-6 border-2 border-dashed rounded-2xl text-center transition-all ${
                    fileName 
                      ? 'bg-primary/5 border-primary text-white' 
                      : fileDragging 
                        ? 'bg-slate-850 border-primary text-primary' 
                        : 'bg-slate-950/40 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <UploadCloud className="mx-auto mb-2 text-slate-400 stroke-1" size={32} />
                  {fileName ? (
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-primary">{fileName}</p>
                      <button 
                        type="button"
                        onClick={() => setFileName('')} 
                        className="text-[9px] text-red-400 hover:underline font-mono"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-bold text-slate-300">Drag & drop your invoice PDF sheet here</p>
                      <p className="text-[10px] text-slate-500 mt-1">or click to browse local storage</p>
                      <input 
                        type="file"
                        accept=".pdf"
                        onChange={e => e.target.files && e.target.files[0] && setFileName(e.target.files[0].name)}
                        className="hidden"
                        id="invoice-file-picker"
                      />
                      <label 
                        htmlFor="invoice-file-picker"
                        className="mt-3 inline-block px-4 py-1.5 bg-slate-850 hover:bg-slate-800 border border-white/5 hover:border-white/10 rounded-xl text-[10px] font-bold text-slate-300 cursor-pointer transition-all"
                      >
                        Select File
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Total Calculation */}
              <div className="p-4 bg-slate-950/60 border border-white/5 rounded-xl flex justify-between items-center font-mono">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Billed Amount:</span>
                <span className="text-sm font-black text-emerald-400">${(hours * rate).toLocaleString()}</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition text-xs cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-lemon text-background font-black py-3 rounded-xl transition text-xs shadow-lg shadow-primary/10 cursor-pointer"
                >
                  Submit Billing Record
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
