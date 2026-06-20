'use client';

import React, { useState } from 'react';
import { useConsultantStore } from '@/store/consultantStore';
import {
  ShieldCheck,
  Cpu,
  Terminal,
  ChevronRight,
  ChevronLeft,
  Plus,
  Laptop,
  CheckCircle,
  X
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';

const steps = [1, 2, 3, 4, 5, 6];

function CustomStepper({ activeStep }: { activeStep: number }) {
  return (
    <div className="flex flex-col items-center">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-colors duration-300 ${index <= activeStep ? "bg-primary text-slate-950 shadow-lg shadow-primary/20" : "bg-slate-800 text-slate-500"
              }`}
          >
            {step}
          </div>
          {index < steps.length - 1 && (
            <div className={`w-0.5 h-16 my-2 transition-colors duration-500 ${index < activeStep ? "bg-primary" : "bg-slate-800"}`}></div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ConsultantOnboarding() {
  const completeOnboarding = useConsultantStore(state => state.completeOnboarding);
  const { t } = useTranslation();

  const [step, setStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [timezone, setTimezone] = useState('');
  const [ndaAccepted, setNdaAccepted] = useState(false);

  const industries = [
    {
      id: 'Strategy Advisory',
      title: t('onboarding.industries.strategyAdvisory'),
      description: t('onboarding.industries.strategyAdvisoryDesc'),
      icon: ShieldCheck,
      color: 'text-amber-400',
    },
    {
      id: 'Operational Systems',
      title: t('onboarding.industries.operationalSystems'),
      description: t('onboarding.industries.operationalSystemsDesc'),
      icon: Terminal,
      color: 'text-cyan-400',
    },
    {
      id: 'Living Systems',
      title: t('onboarding.industries.livingSystems'),
      description: t('onboarding.industries.livingSystemsDesc'),
      icon: Cpu,
      color: 'text-emerald-400',
    }
  ];

  const standardSkills: Record<string, string[]> = {
    'Strategy Advisory': ['Scope-3 Audits', 'ESG Scoping Frameworks', 'Circular Economics', 'Supply Chain Audits', 'Carbon Policies', 'ESG Disclosures'],
    'Operational Systems': ['PostgreSQL Schemas', 'OAuth2 HMAC Tunnels', 'Mass Balance Verifications', 'Batch UUID Mappings', 'Scanner API integration', 'HMAC Checksums'],
    'Living Systems': ['LiDAR Canopy Density', 'Deep-Core Soil carbon', 'Bio-acoustic Auditing', 'Species Biodiversity Index', 'Reforestation Mapping', 'Ecological Surveys']
  };

  const hardwareChecks = [
    { id: 'encrypted-workstation', label: t('onboarding.hardwareChecks.encryptedWorkstation') },
    { id: 'mfa-key', label: t('onboarding.hardwareChecks.mfaKey') },
    { id: 'vpn', label: t('onboarding.hardwareChecks.vpn') },
    { id: 'isolated-env', label: t('onboarding.hardwareChecks.isolatedEnv') }
  ];

  const handleIndustrySelect = (indId: string) => {
    setSelectedIndustry(indId);
    setSkills(standardSkills[indId] || []);
  };

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (trimmed && !skills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      setSkills([...skills, trimmed]);
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

  const handleNext = () => {
    if (step === 1 && !selectedIndustry) return;
    if (step === 3 && !timezone) return;
    if (step === 4 && !ndaAccepted) {
      alert(t('onboarding.ndaWarning'));
      return;
    }
    if (step < 6) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = () => {
    if (!selectedIndustry || !ndaAccepted) return;
    completeOnboarding(selectedIndustry, skills, capabilities, timezone, ndaAccepted);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900/80 via-background to-surface text-white">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Stepper Sidebar */}
        <div className="lg:w-32 flex justify-center py-10 border-b lg:border-b-0 lg:border-r border-white/10 bg-surface/50 backdrop-blur-md shrink-0 z-20">
          <div className="hidden lg:block sticky top-10 h-fit">
            <CustomStepper activeStep={step - 1} />
          </div>
          {/* Mobile horizontal stepper representation */}
          <div className="lg:hidden text-lg font-black text-primary">
            {t('onboarding.step')} {step} {t('onboarding.of')} 6
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen px-6 py-10 relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-5xl mx-auto w-full relative z-10 flex-1 flex flex-col justify-between">

            {/* Top actions */}
            <div className="flex justify-end gap-4 mb-4 lg:absolute lg:top-0 lg:right-0">
              <ThemeToggle />
              <LanguageToggle />
            </div>

            {/* Header Area */}
            <div className="mb-12">
              <span className="text-[10px] font-black uppercase text-primary tracking-wider font-mono">
                {t('onboarding.categorization')}
              </span>
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <h2 className="text-3xl font-bold mt-2 mb-4">{t('onboarding.step1Title')}</h2>
                  <p className="text-lg text-slate-400">
                    {t('onboarding.step1Desc')}
                  </p>
                </div>
              )}
              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <h2 className="text-3xl font-bold mt-2 mb-4">{t('onboarding.step2Title')}</h2>
                  <p className="text-lg text-slate-400">
                    {t('onboarding.step2Desc')}
                  </p>
                </div>
              )}
              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <h2 className="text-3xl font-bold mt-2 mb-4">{t('onboarding.step3Title')}</h2>
                  <p className="text-lg text-slate-400">
                    {t('onboarding.step3Desc')}
                  </p>
                </div>
              )}
              {step === 4 && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <h2 className="text-3xl font-bold mt-2 mb-4">{t('onboarding.step4Title')}</h2>
                  <p className="text-lg text-slate-400">
                    {t('onboarding.step4Desc')}
                  </p>
                </div>
              )}
              {step === 5 && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <h2 className="text-3xl font-bold mt-2 mb-4">{t('onboarding.step5Title')}</h2>
                  <p className="text-lg text-slate-400">
                    {t('onboarding.step5Desc')}
                  </p>
                </div>
              )}
              {step === 6 && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <h2 className="text-3xl font-bold mt-2 mb-4">{t('onboarding.step6Title')}</h2>
                  <p className="text-lg text-slate-400">
                    {t('onboarding.step6Desc')}
                  </p>
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="flex-1">
              {step === 1 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
                  {industries.map(ind => {
                    const Icon = ind.icon;
                    const isActive = selectedIndustry === ind.id;
                    return (
                      <div
                        key={ind.id}
                        onClick={() => handleIndustrySelect(ind.id)}
                        className={`
                          relative cursor-pointer border rounded-3xl p-8 transition-all duration-300
                          flex flex-col items-center text-center
                          ${isActive
                            ? "border-primary bg-card shadow-2xl shadow-primary/10"
                            : "border-white/10 bg-slate-900/40 hover:bg-slate-900/80 hover:border-white/20"
                          }
                        `}
                      >
                        <div
                          className={`absolute right-4 top-4 w-6 h-6 rounded-full border transition-colors flex items-center justify-center
                            ${isActive
                              ? "border-primary bg-primary"
                              : "border-slate-700"
                            }`}
                        >
                          {isActive && <CheckCircle size={14} className="text-slate-950 stroke-[3px]" />}
                        </div>
                        <div className={`p-5 rounded-2xl bg-slate-800/80 border border-white/5 mb-6 ${ind.color}`}>
                          <Icon size={32} />
                        </div>
                        <h4 className={`text-xl font-black mb-3 transition-colors ${isActive ? "text-primary" : "text-white"}`}>{ind.title}</h4>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed">{ind.description}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both max-w-3xl">
                  {/* Custom skill add input */}
                  <div className="flex gap-3 bg-card border border-white/10 rounded-2xl p-2 focus-within:border-primary transition-colors shadow-lg">
                    <input
                      type="text"
                      placeholder={t('onboarding.enterCustomCapability')}
                      value={newSkill}
                      onChange={e => setNewSkill(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      className="flex-1 bg-transparent px-5 py-4 text-base font-semibold text-white focus:outline-none focus:border-transparent placeholder-slate-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="bg-primary hover:bg-[lemon] text-slate-950 px-8 py-4 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-2 text-lg shadow-md"
                    >
                      <Plus size={20} />
                      {t('onboarding.addBtn')}
                    </button>
                  </div>

                  {/* Skills Pills Box */}
                  <div className="space-y-4">
                    <span className="text-sm font-black uppercase text-slate-500 tracking-wider font-mono">{t('onboarding.assignedCapabilities')}</span>
                    <div className="flex flex-wrap gap-3 p-8 bg-slate-900/40 border border-white/5 rounded-3xl min-h-[200px]">
                      {skills.length === 0 ? (
                        <span className="text-slate-500 text-base m-auto">{t('onboarding.noCapabilitiesTagged')}</span>
                      ) : (
                        skills.map(sk => (
                          <span
                            key={sk}
                            className="flex items-center gap-2 px-5 py-3 bg-primary/10 border border-primary/20 text-primary rounded-xl text-sm font-bold font-mono group transition-all hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 shadow-sm"
                          >
                            {sk}
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(sk)}
                              className="text-primary/50 group-hover:text-red-400 cursor-pointer transition-colors"
                            >
                              <X size={16} />
                            </button>
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-slate-400">{t('onboarding.timezonePlaceholder')}</label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="bg-card border border-white/10 rounded-2xl p-4 text-white text-lg focus:outline-none focus:border-primary transition-colors cursor-pointer"
                    >
                      <option value="" disabled>{t('onboarding.timezonePlaceholder')}</option>
                      <option value="GMT">GMT (London, Lisbon)</option>
                      <option value="CET">CET (Rome, Paris, Berlin)</option>
                      <option value="EST">EST (New York, Toronto)</option>
                      <option value="PST">PST (Los Angeles, Vancouver)</option>
                      <option value="JST">JST (Tokyo, Seoul)</option>
                      <option value="AEST">AEST (Sydney, Melbourne)</option>
                    </select>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
                  <div className="p-8 bg-card border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center shrink-0">
                        <ShieldCheck size={24} />
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white">Non-Disclosure Agreement (NDA)</h3>
                        <p className="text-slate-400 leading-relaxed">
                          {t('onboarding.ndaAgreementText')}
                        </p>
                        
                        <label className="flex items-center gap-3 cursor-pointer mt-4 p-4 border border-white/5 rounded-xl hover:bg-white/5 transition-colors">
                          <input
                            type="checkbox"
                            checked={ndaAccepted}
                            onChange={(e) => setNdaAccepted(e.target.checked)}
                            className="w-5 h-5 rounded border-white/20 bg-slate-900 text-primary focus:ring-primary focus:ring-offset-0 cursor-pointer"
                          />
                          <span className="font-bold text-white select-none">
                            I understand and agree
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                <div className="space-y-4 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
                  {hardwareChecks.map(check => {
                    const isSelected = capabilities.includes(check.id);
                    return (
                      <div
                        key={check.id}
                        onClick={() => toggleCapability(check.id)}
                        className={`
                          relative cursor-pointer border rounded-2xl p-6 transition-all duration-300
                          flex items-center justify-between
                          ${isSelected
                            ? "border-primary bg-card shadow-lg shadow-primary/5"
                            : "border-white/10 bg-slate-900/40 hover:bg-slate-900/80 hover:border-white/20"
                          }
                        `}
                      >
                        <span className="text-lg font-bold pr-4 text-white">{check.label}</span>
                        <div
                          className={`w-7 h-7 rounded-full border transition-colors flex items-center justify-center shrink-0
                            ${isSelected
                              ? "border-primary bg-primary"
                              : "border-slate-700 bg-slate-800"
                            }`}
                        >
                          {isSelected && <CheckCircle size={16} className="text-slate-950 stroke-[3px]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {step === 6 && (
                <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
                  <div className="w-28 h-28 bg-primary/10 border border-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-10 animate-pulse shadow-2xl shadow-primary/20">
                    <Laptop size={56} />
                  </div>

                  <div className="max-w-lg mx-auto p-8 bg-card border border-white/10 rounded-3xl text-left space-y-6 font-mono text-base text-slate-400 shadow-2xl">
                    <div className="flex justify-between items-center border-b border-white/5 pb-5">
                      <span className="text-slate-500 font-bold uppercase tracking-wider text-sm">{t('onboarding.profileSector')}</span>
                      <strong className="text-white bg-slate-800 px-4 py-1.5 rounded-xl">{selectedIndustry}</strong>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-5">
                      <span className="text-slate-500 font-bold uppercase tracking-wider text-sm">{t('onboarding.skillsLogged')}</span>
                      <strong className="text-white bg-slate-800 px-4 py-1.5 rounded-xl">{skills.length} {t('onboarding.parameters')}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 font-bold uppercase tracking-wider text-sm">{t('onboarding.isolatedNode')}</span>
                      <strong className="text-primary bg-primary/10 px-4 py-1.5 rounded-xl flex items-center gap-2 shadow-sm">
                        <ShieldCheck size={16} /> {t('onboarding.activeAndSafe')}
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Navigation */}
            <div className="mt-16 pt-8 flex flex-col-reverse sm:flex-row justify-between gap-4 sm:gap-0">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white px-10 py-5 rounded-2xl font-bold text-lg tracking-wide transition-colors flex justify-center items-center gap-2 shadow-md"
                >
                  <ChevronLeft size={24} />
                  {t('onboarding.backBtn')}
                </button>
              ) : (
                <div className="hidden sm:block"></div>
              )}

              <button
                type="button"
                onClick={step === 6 ? handleFinish : handleNext}
                disabled={step === 1 && !selectedIndustry || (step === 3 && !timezone) || (step === 4 && !ndaAccepted)}
                className="w-full sm:w-auto bg-primary hover:bg-[lemon] text-slate-950 px-14 py-5 rounded-2xl font-black text-lg tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] flex justify-center items-center gap-2"
              >
                {step === 6 ? t('onboarding.enterPortalBtn') : t('onboarding.nextBtn')}
                {step < 6 && <ChevronRight size={24} />}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
