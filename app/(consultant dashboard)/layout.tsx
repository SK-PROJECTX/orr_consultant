'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useConsultantStore } from '@/store/consultantStore';
import Sidebar from '@/components/Sidebar';

// Lucide Icons
import { 
  Bell, 
  X, 
  ShieldAlert, 
  CheckCircle, 
  Info,
  ShieldCheck, 
  Cpu, 
  Terminal, 
  ChevronRight, 
  ChevronLeft, 
  Plus, 
  Laptop
} from 'lucide-react';

// LOCAL ONBOARDING COMPONENT INLINED
function OnboardingView() {
  const completeOnboarding = useConsultantStore(state => state.completeOnboarding);
  
  const [step, setStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [capabilities, setCapabilities] = useState<string[]>([]);

  const industries = [
    {
      id: 'Strategy Advisory',
      title: 'Strategy Advisory & ESG',
      description: 'Supply chain carbon scoping, Scope-3 greenhouse gas auditing, ESG frameworks, circular economy logistics policy.',
      icon: ShieldCheck,
      color: 'text-amber-400',
      glow: 'shadow-amber-500/10 hover:border-amber-500/30'
    },
    {
      id: 'Operational Systems',
      title: 'Operational Systems Engineering',
      description: 'Relational provenance ledger databases, OAuth2 secure transaction transfers, mass-balance calculations, scanner APIs.',
      icon: Terminal,
      color: 'text-cyan-400',
      glow: 'shadow-cyan-500/10 hover:border-cyan-500/30'
    },
    {
      id: 'Living Systems',
      title: 'Living Systems Regeneration',
      description: 'LiDAR canopy structural diagnostics, deep-core soil organic carbon testing, bio-acoustic indicator species logging.',
      icon: Cpu,
      color: 'text-emerald-400',
      glow: 'shadow-emerald-500/10 hover:border-emerald-500/30'
    }
  ];

  const standardSkills: Record<string, string[]> = {
    'Strategy Advisory': ['Scope-3 Audits', 'ESG Scoping Frameworks', 'Circular Economics', 'Supply Chain Audits', 'Carbon Policies', 'ESG Disclosures'],
    'Operational Systems': ['PostgreSQL Schemas', 'OAuth2 HMAC Tunnels', 'Mass Balance Verifications', 'Batch UUID Mappings', 'Scanner API integration', 'HMAC Checksums'],
    'Living Systems': ['LiDAR Canopy Density', 'Deep-Core Soil carbon', 'Bio-acoustic Auditing', 'Species Biodiversity Index', 'Reforestation Mapping', 'Ecological Surveys']
  };

  const hardwareChecks = [
    { id: 'encrypted-workstation', label: 'Encrypted Workstation Drive (AES-256 enabled)' },
    { id: 'mfa-key', label: 'Dual-Factor Authenticator (Hardware Token/App Active)' },
    { id: 'vpn', label: 'Secure VPN client installed with DNS Leak protection' },
    { id: 'isolated-env', label: 'Dedicated and isolated developer workspace environment' }
  ];

  const handleIndustrySelect = (indId: string) => {
    setSelectedIndustry(indId);
    setSkills(standardSkills[indId] || []);
    setStep(2);
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const toggleCapability = (capId: string) => {
    if (capabilities.includes(capId)) {
      setCapabilities(capabilities.filter(c => c !== capId));
    } else {
      setCapabilities([...capabilities, capId]);
    }
  };

  const handleFinish = () => {
    if (!selectedIndustry) return;
    completeOnboarding(selectedIndustry, skills, capabilities);
  };

  const progressPercentage = (step / 4) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/80 via-background to-surface relative w-full">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl w-full bg-card border border-white/10 backdrop-blur-xl p-8 lg:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        {/* Neon glow header lines */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-primary opacity-60" />

        {/* Step Indicator Header */}
        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-primary tracking-wider font-mono">Consultant Categorization</span>
            <h1 className="text-xl font-extrabold text-white">ORR Partner Onboarding</h1>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-bold font-mono">Step {step} of 4</span>
            <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-primary transition-all duration-500 rounded-full" 
                style={{ width: `${progressPercentage}%` }} 
              />
            </div>
          </div>
        </div>

        {/* Wizard Panel Screens */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-2">
              <h2 className="text-lg font-extrabold text-white">Select Primary Specialization</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                Categorize your consultant contract to ensure the ORR dashboard serves matching client job briefs and secure PM resources.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {industries.map(ind => {
                const Icon = ind.icon;
                return (
                  <button
                    key={ind.id}
                    onClick={() => handleIndustrySelect(ind.id)}
                    className={`text-left p-5 rounded-2xl bg-slate-900/40 border border-white/5 hover:bg-slate-900/80 shadow-md transition-all duration-300 cursor-pointer ${ind.glow} flex gap-4 items-start active:scale-[0.98] group`}
                  >
                    <div className={`p-3 rounded-xl bg-slate-800/80 border border-white/5 ${ind.color}`}>
                      <Icon size={20} />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h4 className="text-xs font-black text-white group-hover:text-primary transition-colors">{ind.title}</h4>
                      <p className="text-[10px] text-slate-400 leading-relaxed font-medium">{ind.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-2">
              <h2 className="text-lg font-extrabold text-white">Map Technical Skills</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                Adjust or add custom engineering credentials. These are audited by our administrator for task capability matching.
              </p>
            </div>

            {/* Custom skill add input */}
            <div className="flex gap-2 bg-slate-950/40 p-2 border border-white/10 rounded-xl">
              <input
                type="text"
                placeholder="Enter custom capability..."
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
                className="flex-1 bg-transparent px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-transparent placeholder-slate-500"
              />
              <button
                onClick={handleAddSkill}
                className="bg-primary hover:bg-lemon text-background p-2.5 rounded-lg transition-colors cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Skills Pills Box */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">Assigned Capabilities</span>
              <div className="flex flex-wrap gap-2 p-5 bg-slate-900/40 border border-white/5 rounded-2xl min-h-[120px]">
                {skills.length === 0 ? (
                  <span className="text-slate-500 text-xs m-auto">No capabilities tagged yet. Enter one above.</span>
                ) : (
                  skills.map(sk => (
                    <span 
                      key={sk} 
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-xl text-xs font-bold font-mono"
                    >
                      {sk}
                      <button 
                        onClick={() => handleRemoveSkill(sk)} 
                        className="hover:text-red-400 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-white/5">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-5 py-2.5 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-primary hover:bg-lemon text-background rounded-xl text-xs font-black transition-all cursor-pointer shadow-lg shadow-primary/10"
              >
                Continue
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="space-y-2">
              <h2 className="text-lg font-extrabold text-white">IT Infrastructure Compliance</h2>
              <p className="text-slate-400 text-xs leading-relaxed">
                As self-employed contractors working on client systems, security isolation is highly required. Toggle your active system parameters below.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {hardwareChecks.map(check => {
                const isSelected = capabilities.includes(check.id);
                return (
                  <button
                    key={check.id}
                    onClick={() => toggleCapability(check.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left cursor-pointer ${
                      isSelected 
                        ? 'bg-primary/5 border-primary text-white shadow-sm' 
                        : 'bg-slate-900/20 border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold pr-4 leading-relaxed">{check.label}</span>
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-primary border-primary text-background' : 'border-white/20'
                    }`}>
                      {isSelected && <CheckCircle size={14} className="stroke-[3px]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-4 border-t border-white/5">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1.5 px-5 py-2.5 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-primary hover:bg-lemon text-background rounded-xl text-xs font-black transition-all cursor-pointer shadow-lg shadow-primary/10"
              >
                Validate Configuration
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 text-center py-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="w-16 h-16 bg-primary/10 border border-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Laptop size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white">Infrastructure Verification Completed</h2>
              <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed">
                Your computer environment meets client isolation prerequisites. Your specialist partner account has been successfully initialized.
              </p>
            </div>

            <div className="max-w-xs mx-auto p-4 bg-slate-900/60 border border-white/5 rounded-2xl text-left space-y-2 font-mono text-[10px] text-slate-400">
              <div><strong className="text-slate-300">Profile sector:</strong> {selectedIndustry}</div>
              <div><strong className="text-slate-300">Skills logged:</strong> {skills.length} parameters</div>
              <div><strong className="text-slate-300">Isolated node:</strong> Active and safe</div>
            </div>

            <div className="flex justify-center gap-3 pt-6 border-t border-white/5">
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-1.5 px-5 py-2.5 border border-white/10 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
                Review
              </button>
              <button
                onClick={handleFinish}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-primary hover:opacity-90 text-slate-950 font-black rounded-xl text-xs transition-all cursor-pointer shadow-xl shadow-primary/20"
              >
                Enter Consultant Portal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  
  const isAuthenticated = useConsultantStore(state => state.isAuthenticated);
  const onboardingCompleted = useConsultantStore(state => state.onboardingCompleted);
  const notifications = useConsultantStore(state => state.notifications);
  const markNotificationRead = useConsultantStore(state => state.markNotificationRead);
  const clearNotifications = useConsultantStore(state => state.clearNotifications);

  const [showAlertLog, setShowAlertLog] = useState(false);

  const isAuthPage = pathname === '/signin' || pathname === '/register';

  useEffect(() => {
    if (!isAuthenticated && !isAuthPage) {
      router.replace('/signin');
    }
  }, [isAuthenticated, isAuthPage, router]);

  // If it's a signin or register page, render directly without sidebar wrappers
  if (isAuthPage) {
    return <>{children}</>;
  }

  // Auth Protection Gatekeeper
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#61FD51] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Onboarding Compliance Guard
  if (!onboardingCompleted) {
    return <OnboardingView />;
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'PAYMENT':
        return <CheckCircle size={14} className="text-emerald-400" />;
      case 'JOB':
        return <Info size={14} className="text-cyan-400" />;
      default:
        return <ShieldAlert size={14} className="text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row relative overflow-hidden w-full">
      {/* Ambience glow elements */}
      <div className="absolute top-1/3 left-1/4 w-[480px] h-[480px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[480px] h-[480px] bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Shared Sidebar */}
      <Sidebar openNotifications={() => setShowAlertLog(true)} />

      {/* Scrolling central canvas */}
      <main className="flex-1 h-screen overflow-y-auto px-6 py-8 lg:p-12 z-10 w-full">
        <div className="max-w-6xl mx-auto animate-in fade-in duration-300">
          {children}
        </div>
      </main>

      {/* Shared Alert Logs Modal */}
      {showAlertLog && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="max-w-md w-full bg-slate-900 border border-primary/20 backdrop-blur-2xl p-6 lg:p-8 rounded-[2rem] space-y-6 shadow-2xl relative">
            
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <Bell size={20} className="text-primary" />
                <h3 className="text-base font-extrabold text-white">Workspace Alert Log</h3>
              </div>
              <button 
                onClick={() => setShowAlertLog(false)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-500 font-medium">
                  No alert logs recorded on this session.
                </div>
              ) : (
                notifications.map(not => (
                  <div 
                    key={not.id}
                    onClick={() => markNotificationRead(not.id)}
                    className={`p-3.5 rounded-xl border flex gap-3 text-left cursor-pointer transition-all ${
                      not.read 
                        ? 'bg-slate-900/10 border-white/5 text-slate-400 opacity-60' 
                        : 'bg-slate-900/60 border-primary/20 text-white shadow-sm'
                    }`}
                  >
                    <div className="mt-1 flex-shrink-0">
                      {getAlertIcon(not.type)}
                    </div>
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <h4 className="text-xs font-black truncate">{not.title}</h4>
                      <p className="text-[10px] text-slate-400 leading-relaxed">{not.text}</p>
                      <span className="text-[8px] font-mono text-slate-500 block mt-1">
                        {new Date(not.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {!not.read && (
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-3 pt-2 border-t border-white/5">
              <button
                onClick={clearNotifications}
                disabled={notifications.length === 0}
                className="flex-1 bg-red-950/20 hover:bg-red-950/40 border border-red-500/20 disabled:opacity-40 text-red-400 font-bold py-2.5 rounded-xl transition text-xs cursor-pointer"
              >
                Clear All Logs
              </button>
              <button
                onClick={() => setShowAlertLog(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl transition text-xs cursor-pointer"
              >
                Close Logs
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
