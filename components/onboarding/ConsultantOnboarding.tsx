'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useConsultantStore } from '@/store/consultantStore';
import {
  ShieldCheck,
  Cpu,
  Terminal,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Plus,
  Check,
  CheckCircle,
  X,
  FileText,
  ExternalLink,
  UploadCloud
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import { COUNTRIES } from './countries';

const steps = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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
  const [consultantId, setConsultantId] = useState('');
  const [basicProfileStep, setBasicProfileStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [countryQuery, setCountryQuery] = useState('');
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [secondaryIndustries, setSecondaryIndustries] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillProficiencies, setSkillProficiencies] = useState<Record<string, string>>({});
  const [skillYearsExperience, setSkillYearsExperience] = useState<Record<string, string>>({});
  const [skillQuery, setSkillQuery] = useState('');
  const [itConfidence, setItConfidence] = useState('');
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [customSkills, setCustomSkills] = useState<{ name: string, status: 'Pending Review' | 'Approved' | 'Rejected' | 'Merged' }[]>([]);
  const [specializationStep, setSpecializationStep] = useState(1);
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [softwareExperience, setSoftwareExperience] = useState<string[]>([]);
  const [customSoftwareInput, setCustomSoftwareInput] = useState('');
  const [aiFamiliarity, setAiFamiliarity] = useState('');
  const [dataHandling, setDataHandling] = useState<string[]>([]);
  const [timezone, setTimezone] = useState('');
  const [timezoneQuery, setTimezoneQuery] = useState('');
  const [isTimezoneOpen, setIsTimezoneOpen] = useState(false);
  const [ndaAccepted, setNdaAccepted] = useState(false);
  const [professionalSummary, setProfessionalSummary] = useState('');
  const [sectorExperience, setSectorExperience] = useState<string[]>([]);
  const [customSectorInput, setCustomSectorInput] = useState('');
  const [professionalEvidence, setProfessionalEvidence] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [weeklyCapacity, setWeeklyCapacity] = useState('');
  const [preferredRoles, setPreferredRoles] = useState<string[]>([]);
  const [workModes, setWorkModes] = useState<string[]>([]);
  const [geoCoverage, setGeoCoverage] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [customLanguageInput, setCustomLanguageInput] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [engagementTypes, setEngagementTypes] = useState<string[]>([]);
  const [rightToWork, setRightToWork] = useState(false);
  const [conflictOfInterest, setConflictOfInterest] = useState(false);
  const [conflictDetails, setConflictDetails] = useState('');
  const [dataProtection, setDataProtection] = useState(false);
  const [skillsStep, setSkillsStep] = useState(1);
  const [itCompetenceStep, setItCompetenceStep] = useState(1);
  const [experienceStep, setExperienceStep] = useState(1);
  const [workPrefStep, setWorkPrefStep] = useState(1);
  const [commercialsStep, setCommercialsStep] = useState(1);
  const [complianceStep, setComplianceStep] = useState(1);
  const industries = [
    {
      id: 'Strategy Advisory & Compliance',
      title: t('onboarding.industries.strategyAdvisory'),
      description: t('onboarding.industries.strategyAdvisoryDesc'),
      icon: ShieldCheck,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
      borderColor: 'border-amber-500',
      shadowColor: 'shadow-amber-500/10',
      checkBgColor: 'bg-amber-500',
    },
    {
      id: 'Operational Systems & Infrastructure',
      title: t('onboarding.industries.operationalSystems'),
      description: t('onboarding.industries.operationalSystemsDesc'),
      icon: Terminal,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
      borderColor: 'border-cyan-500',
      shadowColor: 'shadow-cyan-500/10',
      checkBgColor: 'bg-cyan-500',
    },
    {
      id: 'Living Systems Regeneration',
      title: t('onboarding.industries.livingSystems'),
      description: t('onboarding.industries.livingSystemsDesc'),
      icon: Cpu,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10',
      borderColor: 'border-emerald-500',
      shadowColor: 'shadow-emerald-500/10',
      checkBgColor: 'bg-emerald-500',
    }
  ];

  const standardSkills: Record<string, string[]> = {
    'Strategy Advisory & Compliance': [
      'Regulatory compliance', 'Business strategy', 'Market-entry planning',
      'Governance frameworks', 'Policy analysis', 'Risk assessment',
      'Licensing support', 'ESG advisory', 'Due diligence',
      'Business planning', 'Commercial structuring', 'Stakeholder mapping',
      'Report writing'
    ],
    'Operational Systems & Infrastructure': [
      'System architecture', 'Workflow automation', 'Database structuring',
      'API integration', 'CRM configuration', 'Client portal design',
      'Dashboard design', 'Data migration', 'Cybersecurity basics',
      'Process mapping', 'Technical documentation', 'QA testing',
      'Infrastructure planning', 'Resilience planning'
    ],
    'Living Systems Regeneration': [
      'Agronomic advisory', 'Soil diagnostics', 'Biodiversity assessment',
      'Forestry management', 'Regenerative agriculture', 'Ecological restoration',
      'Environmental monitoring', 'GIS mapping', 'Land-use planning',
      'Carbon / nature-based project support', 'Plant health', 'Nursery systems',
      'Irrigation planning'
    ]
  };

  const ALL_SKILLS = Array.from(new Set([
    ...Object.values(standardSkills).flat(),
    'React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker', 'Kubernetes', 'Management Consulting', 'Market Entry', 'M&A', 'Financial Modeling', 'Agronomy', 'Machine Learning', 'Data Engineering', 'DevOps', 'Cybersecurity', 'GDPR Compliance', 'ISO 27001'
  ])).sort();

  const hardwareChecks = [
    { id: 'encrypted-workstation', label: t('onboarding.hardwareChecks.encryptedWorkstation') },
    { id: 'mfa-key', label: t('onboarding.hardwareChecks.mfaKey') },
    { id: 'vpn', label: t('onboarding.hardwareChecks.vpn') },
    { id: 'isolated-env', label: t('onboarding.hardwareChecks.isolatedEnv') }
  ];



  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));

    const newProf = { ...skillProficiencies };
    delete newProf[skillToRemove];
    setSkillProficiencies(newProf);

    const newExp = { ...skillYearsExperience };
    delete newExp[skillToRemove];
    setSkillYearsExperience(newExp);
  };

  const toggleSkill = (skill: string) => {
    if (skills.includes(skill)) {
      handleRemoveSkill(skill);
    } else {
      setSkills([...skills, skill]);
    }
  };

  const handleProficiencyChange = (skill: string, level: string) => {
    setSkillProficiencies(prev => ({ ...prev, [skill]: level }));
  };

  const handleExperienceChange = (skill: string, years: string) => {
    setSkillYearsExperience(prev => ({ ...prev, [skill]: years }));
  };

  const handleAddCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (trimmed && !customSkills.some(s => s.name.toLowerCase() === trimmed.toLowerCase()) && !skills.includes(trimmed)) {
      setCustomSkills([...customSkills, { name: trimmed, status: 'Pending Review' }]);
      setCustomSkillInput('');
    }
  };

  const handleRemoveCustomSkill = (skillToRemove: string) => {
    setCustomSkills(customSkills.filter(s => s.name !== skillToRemove));
  };

  const toggleCapability = (capId: string) => {
    if (capabilities.includes(capId)) {
      setCapabilities(capabilities.filter(c => c !== capId));
    } else {
      setCapabilities([...capabilities, capId]);
    }
  };

  const toggleDataHandling = (capId: string) => {
    if (dataHandling.includes(capId)) {
      setDataHandling(dataHandling.filter(c => c !== capId));
    } else {
      setDataHandling([...dataHandling, capId]);
    }
  };

  const toggleSector = (sector: string) => {
    if (sectorExperience.includes(sector)) {
      setSectorExperience(sectorExperience.filter(s => s !== sector));
    } else {
      setSectorExperience([...sectorExperience, sector]);
    }
  };

  const handleAddCustomSector = () => {
    const trimmed = customSectorInput.trim();
    if (trimmed && !sectorExperience.includes(trimmed)) {
      setSectorExperience([...sectorExperience, trimmed]);
      setCustomSectorInput('');
    }
  };

  const handleRemoveSector = (sectorToRemove: string) => {
    setSectorExperience(sectorExperience.filter(s => s !== sectorToRemove));
  };

  const togglePreferredRole = (role: string) => {
    if (preferredRoles.includes(role)) {
      setPreferredRoles(preferredRoles.filter(r => r !== role));
    } else {
      setPreferredRoles([...preferredRoles, role]);
    }
  };

  const toggleWorkMode = (mode: string) => {
    if (workModes.includes(mode)) {
      setWorkModes(workModes.filter(m => m !== mode));
    } else {
      setWorkModes([...workModes, mode]);
    }
  };

  const toggleLanguage = (lang: string) => {
    if (languages.includes(lang)) {
      setLanguages(languages.filter(l => l !== lang));
    } else {
      setLanguages([...languages, lang]);
    }
  };

  const handleAddCustomLanguage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customLanguageInput.trim()) {
      e.preventDefault();
      if (!languages.includes(customLanguageInput.trim())) {
        setLanguages([...languages, customLanguageInput.trim()]);
      }
      setCustomLanguageInput('');
    }
  };

  const handleRemoveLanguage = (langToRemove: string) => {
    setLanguages(languages.filter(l => l !== langToRemove));
  };

  const toggleEngagementType = (type: string) => {
    if (engagementTypes.includes(type)) {
      setEngagementTypes(engagementTypes.filter(t => t !== type));
    } else {
      setEngagementTypes([...engagementTypes, type]);
    }
  };

  const toggleSoftware = (sw: string) => {
    if (softwareExperience.includes(sw)) {
      setSoftwareExperience(softwareExperience.filter(s => s !== sw));
    } else {
      setSoftwareExperience([...softwareExperience, sw]);
    }
  };

  const handleAddCustomSoftware = () => {
    const trimmed = customSoftwareInput.trim();
    if (trimmed && !softwareExperience.includes(trimmed)) {
      setSoftwareExperience([...softwareExperience, trimmed]);
      setCustomSoftwareInput('');
    }
  };

  const handleRemoveSoftware = (swToRemove: string) => {
    setSoftwareExperience(softwareExperience.filter(s => s !== swToRemove));
  };

  const handleNext = () => {
    if (step === 1 && !consultantId) {
      alert('Please enter your Consultant ID to proceed.');
      return;
    }
    if (step === 2) {
      if (basicProfileStep === 1 && !fullName) {
        alert('Please enter your Full Name to proceed.');
        return;
      }
      if (basicProfileStep === 5 && !country) {
        alert('Please select your Country to proceed.');
        return;
      }
      if (basicProfileStep < 6) {
        setBasicProfileStep(prev => prev + 1);
        return;
      }
    }
    if (step === 3) {
      if (specializationStep === 1 && !selectedIndustry) return;
      if (specializationStep < 2) {
        setSpecializationStep(prev => prev + 1);
        return;
      }
    }
    if (step === 4) {
      if (skillsStep < 2) {
        setSkillsStep(prev => prev + 1);
        return;
      }
    }
    if (step === 5) {
      if (itCompetenceStep === 1 && !itConfidence) {
        alert('Please select your General IT Confidence to proceed.');
        return;
      }
      if (itCompetenceStep < 3) { // 1: IT Confidence, 2: Software, 3: Hardware
        setItCompetenceStep(prev => prev + 1);
        return;
      }
    }
    if (step === 6) {
      if (experienceStep < 6) {
        setExperienceStep(prev => prev + 1);
        return;
      }
    }
    if (step === 7) {
      if (workPrefStep < 6) {
        setWorkPrefStep(prev => prev + 1);
        return;
      }
    }
    if (step === 8) {
      if (commercialsStep < 2) {
        setCommercialsStep(prev => prev + 1);
        return;
      }
    }
    if (step === 9) {
      if (complianceStep === 1 && !rightToWork) {
        alert('You must confirm your right to provide services.');
        return;
      }
      if (complianceStep === 2 && !ndaAccepted) {
        alert('You must accept the confidentiality terms.');
        return;
      }
      if (complianceStep === 3 && !conflictOfInterest) {
        alert('You must confirm your conflict of interest declaration.');
        return;
      }
      if (complianceStep === 4 && !dataProtection) {
        alert('You must accept the data protection terms.');
        return;
      }
      if (complianceStep < 4) {
        setComplianceStep(prev => prev + 1);
        return;
      }
    }

    if (step < 9) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step === 2 && basicProfileStep > 1) {
      setBasicProfileStep(prev => prev - 1);
      return;
    }
    if (step === 3 && specializationStep > 1) {
      setSpecializationStep(prev => prev - 1);
      return;
    }
    if (step === 4 && skillsStep > 1) {
      setSkillsStep(prev => prev - 1);
      return;
    }
    if (step === 5 && itCompetenceStep > 1) {
      setItCompetenceStep(prev => prev - 1);
      return;
    }
    if (step === 6 && experienceStep > 1) {
      setExperienceStep(prev => prev - 1);
      return;
    }
    if (step === 7 && workPrefStep > 1) {
      setWorkPrefStep(prev => prev - 1);
      return;
    }
    if (step === 8 && commercialsStep > 1) {
      setCommercialsStep(prev => prev - 1);
      return;
    }
    if (step === 9 && complianceStep > 1) {
      setComplianceStep(prev => prev - 1);
      return;
    }
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = () => {
    if (!selectedIndustry || !ndaAccepted || !consultantId || !fullName || !country || !conflictOfInterest || !dataProtection) return;
    completeOnboarding(selectedIndustry, secondaryIndustries, skills, skillProficiencies, skillYearsExperience, customSkills, capabilities, itConfidence, softwareExperience, aiFamiliarity, dataHandling, professionalSummary, sectorExperience, professionalEvidence, cvFile, portfolioUrl, isAvailable, weeklyCapacity, preferredRoles, workModes, geoCoverage, languages, hourlyRate, currency, engagementTypes, rightToWork, conflictOfInterest, conflictDetails, dataProtection, timezone, ndaAccepted, consultantId, fullName, displayName, phone, country, jobTitle);
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
            {t('onboarding.stepIndicator', { current: step, total: 9 })}
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
            <AnimatePresence mode="wait">
              <motion.div
                key={`header-${step}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="mb-12"
              >
              <span className="text-[10px] font-black uppercase text-primary tracking-wider font-mono">
                {t('onboarding.categorization')}
              </span>
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <h2 className="text-3xl font-bold mt-2 mb-4">System Identity</h2>
                  <p className="text-lg text-slate-400">
                    Provide your unique ID to link your profile to the ORR portal.
                  </p>
                </div>
              )}
              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <h2 className="text-3xl font-bold mt-2 mb-4">Basic Profile</h2>
                  <p className="text-lg text-slate-400">
                    Basic information about you and where you are located.
                  </p>
                </div>
              )}
              {step === 3 && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <h2 className="text-3xl font-bold mt-2 mb-4">Specialization</h2>
                  <p className="text-lg text-slate-400">
                    Define your primary and secondary areas of expertise.
                  </p>
                </div>
              )}
              {step === 4 && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <h2 className="text-3xl font-bold mt-2 mb-4">Skills</h2>
                  <p className="text-lg text-slate-400">
                    Select your core consulting skills and capabilities.
                  </p>
                </div>
              )}
              {step === 5 && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <h2 className="text-3xl font-bold mt-2 mb-4">IT Competence</h2>
                  <p className="text-lg text-slate-400">
                    Evaluate your readiness for digital tools and secure hardware.
                  </p>
                </div>
              )}
              {step === 6 && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <h2 className="text-3xl font-bold mt-2 mb-4">Experience</h2>
                  <p className="text-lg text-slate-400">
                    Detail your professional background, sectors, and upload your CV.
                  </p>
                </div>
              )}
              {step === 7 && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <h2 className="text-3xl font-bold mt-2 mb-4">Work Preferences</h2>
                  <p className="text-lg text-slate-400">
                    Set your availability, capacity, and preferred working modes.
                  </p>
                </div>
              )}
              {step === 8 && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <h2 className="text-3xl font-bold mt-2 mb-4">Commercials</h2>
                  <p className="text-lg text-slate-400">
                    Establish your preferred rates and engagement types.
                  </p>
                </div>
              )}
              {step === 9 && (
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                  <h2 className="text-3xl font-bold mt-2 mb-4">Compliance</h2>
                  <p className="text-lg text-slate-400">
                    Acknowledge confidentiality, NDAs, and right to work.
                  </p>
                </div>
              )}
              </motion.div>
            </AnimatePresence>

            {/* Content Area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`content-step-${step}-bp-${basicProfileStep}-spec-${specializationStep}-skills-${skillsStep}-it-${itCompetenceStep}-exp-${experienceStep}-wp-${workPrefStep}-comm-${commercialsStep}-comp-${complianceStep}`}
                initial={{ opacity: 0, x: 20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: -20, y: -10 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="flex-1"
              >
              {step === 1 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both max-w-3xl">
                  {/* Consultant ID Input */}
                  <div className="space-y-4">
                    <span className="text-sm font-black uppercase my-5 text-slate-500 tracking-wider font-mono">Enter your consultant ID</span>
                    <div className="flex gap-3 bg-card border border-white/10 rounded-2xl p-2 focus-within:border-primary transition-colors shadow-lg">
                      <input
                        type="text"
                        placeholder="e.g. ORR-CONS-000001"
                        value={consultantId}
                        onChange={e => setConsultantId(e.target.value)}
                        className="flex-1 bg-transparent px-5 py-4 text-base font-semibold text-white focus:outline-none focus:border-transparent placeholder-slate-500"
                        required
                      />
                    </div>
                  </div>

                  {/* User Account ID Readonly */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-black uppercase text-slate-500 tracking-wider font-mono">User Account ID</span>
                      <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-mono">System Generated</span>
                    </div>
                    <div className="flex gap-3 bg-card/50 border border-white/5 rounded-2xl p-2 shadow-inner opacity-80 cursor-not-allowed">
                      <input
                        type="text"
                        value="USR-ACC-9043"
                        className="flex-1 bg-transparent px-5 py-4 text-base font-semibold text-slate-400 focus:outline-none cursor-not-allowed"
                        disabled
                        readOnly
                      />
                    </div>
                    <p className="text-xs text-slate-500">
                      This profile will be linked to your authenticated portal user account upon onboarding completion.
                    </p>
                  </div>

                  {/* Profile Status Readonly */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-black uppercase text-slate-500 tracking-wider font-mono">Profile Status</span>
                      <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-mono">Internal</span>
                    </div>
                    <div className="flex gap-3 bg-card/50 border border-white/5 rounded-2xl p-2 shadow-inner opacity-80 cursor-not-allowed">
                      <input
                        type="text"
                        value="Draft"
                        className="flex-1 bg-transparent px-5 py-4 text-base font-bold text-amber-500 focus:outline-none cursor-not-allowed uppercase tracking-widest"
                        disabled
                        readOnly
                      />
                    </div>
                    <p className="text-xs text-slate-500">
                      Only Approved profiles are searchable for assignments. Your status will update to <strong className="text-slate-300">Pending Review</strong> once onboarding is submitted.
                    </p>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-8 max-w-3xl">
                  {/* Full Name Input */}
                  {basicProfileStep === 1 && (
                    <div key="bp-1" className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                      <span className="text-sm font-black uppercase my-5 text-slate-500 tracking-wider font-mono">1. Enter your full name</span>
                      <div className="flex gap-3 bg-card border border-white/10 rounded-2xl p-2 focus-within:border-primary transition-colors shadow-lg">
                        <input
                          type="text"
                          placeholder="e.g. Jane Doe"
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleNext()}
                          className="flex-1 bg-transparent px-5 py-4 text-base font-semibold text-white focus:outline-none focus:border-transparent placeholder-slate-500"
                          required
                          autoFocus
                        />
                      </div>
                    </div>
                  )}

                  {/* Display Name Input */}
                  {basicProfileStep === 2 && (
                    <div key="bp-2" className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black uppercase my-5 text-slate-500 tracking-wider font-mono">2. Professional Display Name</span>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-mono">Optional</span>
                      </div>
                      <div className="flex gap-3 bg-card border border-white/10 rounded-2xl p-2 focus-within:border-primary transition-colors shadow-lg">
                        <input
                          type="text"
                          placeholder="e.g. Jane"
                          value={displayName}
                          onChange={e => setDisplayName(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleNext()}
                          className="flex-1 bg-transparent px-5 py-4 text-base font-semibold text-white focus:outline-none focus:border-transparent placeholder-slate-500"
                          autoFocus
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        Enter the name you would like shown internally to ORR project managers.
                      </p>
                    </div>
                  )}

                  {/* Email Address Readonly */}
                  {basicProfileStep === 3 && (
                    <div key="bp-3" className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black uppercase my-5 text-slate-500 tracking-wider font-mono">3. Email Address</span>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-mono">System / Verified</span>
                      </div>
                      <div className="flex gap-3 bg-card/50 border border-white/5 rounded-2xl p-2 shadow-inner opacity-80 cursor-not-allowed">
                        <input
                          type="email"
                          value="consultant@partner.orr.com" // Mocked pulled email
                          className="flex-1 bg-transparent px-5 py-4 text-base font-semibold text-slate-400 focus:outline-none cursor-not-allowed"
                          disabled
                          readOnly
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        Use the email linked to your ORR account.
                      </p>
                    </div>
                  )}

                  {/* Phone / WhatsApp Input */}
                  {basicProfileStep === 4 && (
                    <div key="bp-4" className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black uppercase my-5 text-slate-500 tracking-wider font-mono">4. Phone / WhatsApp</span>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-mono">Recommended</span>
                      </div>
                      <div className="flex gap-3 bg-card border border-white/10 rounded-2xl p-2 focus-within:border-primary transition-colors shadow-lg">
                        <input
                          type="tel"
                          placeholder="e.g. +1 234 567 8900"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleNext()}
                          className="flex-1 bg-transparent px-5 py-4 text-base font-semibold text-white focus:outline-none focus:border-transparent placeholder-slate-500"
                          autoFocus
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        Enter your preferred contact number. Useful for urgent project coordination.
                      </p>
                    </div>
                  )}

                  {/* Country Dropdown */}
                  {basicProfileStep === 5 && (
                    <div key="bp-5" className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                      <span className="text-sm font-black uppercase my-5 text-slate-500 tracking-wider font-mono">5. Country of Residence</span>
                      <div className="relative">
                        <input
                          type="text"
                          value={countryQuery}
                          onChange={(e) => {
                            setCountryQuery(e.target.value);
                            setCountry('');
                            setIsCountryOpen(true);
                          }}
                          onFocus={() => setIsCountryOpen(true)}
                          onBlur={() => setTimeout(() => setIsCountryOpen(false), 200)}
                          placeholder="Search for your country..."
                          className="w-full bg-card border border-white/10 rounded-2xl p-4 pr-14 text-white text-lg font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-lg hover:border-white/20"
                          required
                          autoFocus
                        />
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors" size={24} />

                        {isCountryOpen && (
                          <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
                            {COUNTRIES.filter(c => c.toLowerCase().includes(countryQuery.toLowerCase())).map(c => (
                              <div
                                key={c}
                                className="px-4 py-3 hover:bg-primary/20 cursor-pointer text-white font-semibold transition-colors"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  setCountry(c);
                                  setCountryQuery(c);
                                  setIsCountryOpen(false);
                                }}
                              >
                                {c}
                              </div>
                            ))}
                            {COUNTRIES.filter(c => c.toLowerCase().includes(countryQuery.toLowerCase())).length === 0 && (
                              <div className="px-4 py-3 text-slate-400 font-semibold">No countries found</div>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        Useful for time zone, tax, legal, and on-site work planning.
                      </p>
                    </div>
                  )}

                  {/* Time Zone Auto-suggest */}
                  {basicProfileStep === 6 && (
                    <div key="bp-6" className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black uppercase my-5 text-slate-500 tracking-wider font-mono">6. Time Zone</span>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-mono">Recommended</span>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={timezoneQuery}
                          onChange={(e) => {
                            setTimezoneQuery(e.target.value);
                            setTimezone('');
                            setIsTimezoneOpen(true);
                          }}
                          onFocus={() => setIsTimezoneOpen(true)}
                          onBlur={() => setTimeout(() => setIsTimezoneOpen(false), 200)}
                          placeholder="Select your working time zone..."
                          className="w-full bg-card border border-white/10 rounded-2xl p-4 pr-14 text-white text-lg font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-lg hover:border-white/20"
                          required
                          autoFocus
                        />
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors" size={24} />

                        {isTimezoneOpen && (
                          <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-white/10 rounded-2xl shadow-2xl max-h-60 overflow-y-auto">
                            {Intl.supportedValuesOf('timeZone')
                              .filter(tz => tz.toLowerCase().replace(/_/g, ' ').includes(timezoneQuery.toLowerCase()))
                              .map(tz => (
                                <div
                                  key={tz}
                                  className="px-4 py-3 hover:bg-primary/20 cursor-pointer text-white font-semibold transition-colors"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    setTimezone(tz);
                                    setTimezoneQuery(tz.replace(/_/g, ' '));
                                    setIsTimezoneOpen(false);
                                  }}
                                >
                                  {tz.replace(/_/g, ' ')}
                                </div>
                              ))}
                            {Intl.supportedValuesOf('timeZone').filter(tz => tz.toLowerCase().replace(/_/g, ' ').includes(timezoneQuery.toLowerCase())).length === 0 && (
                              <div className="px-4 py-3 text-slate-400 font-semibold">No timezones found</div>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        Important for international client work and meetings.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {step === 6 && (
                <div className="space-y-8 max-w-3xl">
                  {/* Professional Title Input */}
                  {experienceStep === 1 && (
                    <div key="exp-1" className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black uppercase my-5 text-slate-500 tracking-wider font-mono">7. Professional Title</span>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-mono">Recommended</span>
                      </div>
                      <div className="flex gap-3 bg-card border border-white/10 rounded-2xl p-2 focus-within:border-primary transition-colors shadow-lg">
                        <input
                          type="text"
                          placeholder="e.g. Regulatory Consultant, ESG Advisor"
                          value={jobTitle}
                          onChange={e => setJobTitle(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleNext()}
                          className="flex-1 bg-transparent px-5 py-4 text-base font-semibold text-white focus:outline-none focus:border-transparent placeholder-slate-500"
                          autoFocus
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        Helps administrators and PMs understand your profile quickly.
                      </p>
                    </div>
                  )}

                  {/* Professional Summary Input */}
                  {experienceStep === 2 && (
                    <div key="exp-2" className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black uppercase my-5 text-slate-500 tracking-wider font-mono">8. Professional Summary</span>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-mono">Recommended</span>
                      </div>
                      <div className="flex gap-3 bg-card border border-white/10 rounded-2xl p-2 focus-within:border-primary transition-colors shadow-lg">
                        <textarea
                          placeholder="Briefly summarise your professional background, sectors, and main areas of expertise..."
                          value={professionalSummary}
                          onChange={e => setProfessionalSummary(e.target.value)}
                          className="flex-1 bg-transparent px-5 py-4 text-base font-semibold text-white focus:outline-none focus:border-transparent placeholder-slate-500 min-h-[120px] resize-y"
                          autoFocus
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        This can be shown to administrators and project managers during consultant selection.
                      </p>
                    </div>
                  )}

                  {/* Sector Experience Input */}
                  {experienceStep === 3 && (
                    <div key="exp-3" className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black uppercase my-5 text-slate-500 tracking-wider font-mono">9. Sector Experience</span>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-mono">Recommended</span>
                      </div>
                      <p className="text-sm text-slate-400">Helps ORR match consultants to industry-specific client problems.</p>
                      
                      <div className="flex flex-wrap gap-2 mt-2">
                        {[
                          'Agriculture', 'IT / Software', 'Regulatory Affairs', 'Environment', 'Forestry', 
                          'Construction', 'Finance', 'Import / Export', 'Immigration / Residency', 
                          'Healthcare', 'Manufacturing', 'Food', 'Legal / Compliance'
                        ].map(sector => (
                          <button
                            key={sector}
                            type="button"
                            onClick={() => toggleSector(sector)}
                            className={`
                              px-4 py-2 rounded-xl border text-sm font-semibold transition-all
                              ${sectorExperience.includes(sector)
                                ? 'bg-primary/20 border-primary text-primary shadow-sm'
                                : 'bg-slate-900/40 border-white/10 text-slate-300 hover:border-white/20 hover:bg-slate-900/60'
                              }
                            `}
                          >
                            {sector}
                          </button>
                        ))}
                      </div>

                      {/* Custom Sector Input */}
                      <div className="flex gap-3 bg-slate-900/40 border border-white/10 rounded-2xl p-2 focus-within:border-primary transition-colors shadow-sm mt-3">
                        <input
                          type="text"
                          placeholder="Other sector (e.g. Energy, Mining)..."
                          value={customSectorInput}
                          onChange={e => setCustomSectorInput(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomSector();
                            }
                          }}
                          className="flex-1 bg-transparent px-3 py-2 text-sm font-semibold text-white focus:outline-none focus:border-transparent placeholder-slate-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomSector}
                          className="bg-primary/20 hover:bg-primary/40 text-primary px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-2 text-xs"
                        >
                          <Plus size={14} />
                          Add
                        </button>
                      </div>

                      {/* Selected Custom Sectors */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {sectorExperience.filter(sector => ![
                          'Agriculture', 'IT / Software', 'Regulatory Affairs', 'Environment', 'Forestry', 
                          'Construction', 'Finance', 'Import / Export', 'Immigration / Residency', 
                          'Healthcare', 'Manufacturing', 'Food', 'Legal / Compliance'
                        ].includes(sector)).map(sector => (
                          <span
                            key={sector}
                            className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-xl text-xs font-bold font-mono group transition-all shadow-sm"
                          >
                            {sector}
                            <button
                              type="button"
                              onClick={() => handleRemoveSector(sector)}
                              className="text-primary/50 hover:text-red-400 cursor-pointer transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Professional Evidence / Notes Input */}
                  {experienceStep === 4 && (
                    <div key="exp-4" className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black uppercase my-5 text-slate-500 tracking-wider font-mono">10. Professional Evidence / Notes</span>
                      </div>
                      <div className="flex gap-3 bg-card border border-white/10 rounded-2xl p-2 focus-within:border-primary transition-colors shadow-lg">
                        <textarea
                          placeholder="Briefly describe where you have applied these capabilities professionally..."
                          value={professionalEvidence}
                          onChange={e => setProfessionalEvidence(e.target.value)}
                          className="flex-1 bg-transparent px-5 py-4 text-base font-semibold text-white focus:outline-none focus:border-transparent placeholder-slate-500 min-h-[120px] resize-y"
                          autoFocus
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        Useful for administrator review before approval.
                      </p>
                    </div>
                  )}

                  {/* CV / Profile Upload */}
                  {experienceStep === 5 && (
                    <div key="exp-5" className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black uppercase my-5 text-slate-500 tracking-wider font-mono">11. CV / Profile Upload</span>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-mono">Recommended</span>
                      </div>
                      
                      <div 
                        className="flex flex-col items-center justify-center p-8 bg-card border-2 border-dashed border-white/10 rounded-2xl hover:border-primary/50 transition-colors cursor-pointer shadow-lg"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <input
                          type="file"
                          ref={fileInputRef}
                          className="hidden"
                          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setCvFile(e.target.files[0]);
                            }
                          }}
                        />
                        <UploadCloud className="w-12 h-12 text-slate-400 mb-4" />
                        <h4 className="text-white font-bold mb-1 text-center">
                          {cvFile ? cvFile.name : 'Upload your CV or professional biography'}
                        </h4>
                        <p className="text-sm text-slate-400">Accepts PDF and DOCX formats</p>
                        {cvFile && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCvFile(null);
                            }}
                            className="mt-4 px-4 py-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-300 rounded-lg text-sm font-semibold transition-colors z-10"
                          >
                            Remove File
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        Stored securely in your consultant document vault.
                      </p>
                    </div>
                  )}

                  {/* Portfolio / Website / LinkedIn */}
                  {experienceStep === 6 && (
                    <div key="exp-6" className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black uppercase my-5 text-slate-500 tracking-wider font-mono">12. Portfolio / Website / LinkedIn</span>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-mono">Recommended</span>
                      </div>
                      <div className="flex gap-3 bg-card border border-white/10 rounded-2xl p-2 focus-within:border-primary transition-colors shadow-lg">
                        <div className="flex items-center pl-3 text-slate-400">
                          <ExternalLink size={20} />
                        </div>
                        <input
                          type="url"
                          placeholder="https://linkedin.com/in/yourprofile"
                          value={portfolioUrl}
                          onChange={e => setPortfolioUrl(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleNext()}
                          className="flex-1 bg-transparent px-2 py-4 text-base font-semibold text-white focus:outline-none focus:border-transparent placeholder-slate-500"
                          autoFocus
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        Optional but useful for verification. Add a professional website, LinkedIn profile, or portfolio link.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {step === 7 && (
                <div className="space-y-8 max-w-3xl">
                  {/* Availability for Work */}
                  {workPrefStep === 1 && (
                    <div key="wp-1" className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black uppercase my-5 text-slate-500 tracking-wider font-mono">13. Availability for Work</span>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-mono">Recommended</span>
                      </div>
                      
                      <div 
                        className={`flex items-center justify-between p-6 rounded-2xl border cursor-pointer transition-all ${isAvailable ? 'bg-primary/20 border-primary text-primary shadow-lg shadow-primary/10' : 'bg-slate-900/40 border-white/10 text-slate-400 hover:border-white/20'}`}
                        onClick={() => setIsAvailable(!isAvailable)}
                      >
                        <div>
                          <h4 className="text-base font-bold text-white mb-1">
                            {isAvailable ? 'Available for work' : 'Currently unavailable'}
                          </h4>
                          <p className="text-sm text-slate-400">
                            Are you currently available to be considered for ORR client work?
                          </p>
                        </div>
                        
                        <div className={`w-14 h-8 rounded-full p-1 transition-colors ${isAvailable ? 'bg-primary' : 'bg-slate-700'}`}>
                          <div className={`w-6 h-6 rounded-full bg-slate-950 transition-transform duration-300 ${isAvailable ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 mt-2">
                        You can update this at any time from your profile.
                      </p>
                    </div>
                  )}

                  {/* Weekly Capacity Input */}
                  {workPrefStep === 2 && (
                    <div key="wp-2" className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black uppercase my-5 text-slate-500 tracking-wider font-mono">14. Weekly Capacity</span>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-mono">Recommended</span>
                      </div>
                      <div className="relative">
                        <select
                          value={weeklyCapacity}
                          onChange={(e) => {
                            setWeeklyCapacity(e.target.value);
                            // We don't auto-advance here to let them see their selection, 
                            // but they can click Next. 
                          }}
                          className="w-full bg-card border border-white/10 rounded-2xl px-5 py-4 pr-14 text-base font-semibold text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-lg hover:border-white/20 appearance-none cursor-pointer"
                        >
                          <option value="" disabled>Select your availability...</option>
                          <option value="1-5 hours">1–5 hours</option>
                          <option value="5-10 hours">5–10 hours</option>
                          <option value="10-20 hours">10–20 hours</option>
                          <option value="20+ hours">20+ hours</option>
                          <option value="Project-dependent">Project-dependent</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors" size={24} />
                      </div>
                      <p className="text-xs text-slate-500">
                        Helps PMs assign appropriately sized tasks.
                      </p>
                    </div>
                  )}

                  {/* Preferred Role Input */}
                  {workPrefStep === 3 && (
                    <div key="wp-3" className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black uppercase my-5 text-slate-500 tracking-wider font-mono">15. Preferred Role</span>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-mono">Recommended</span>
                      </div>
                      <p className="text-sm text-slate-400">Helps ORR determine how you should be engaged within projects.</p>
                      
                      <div className="flex flex-col gap-2 mt-2">
                        {[
                          'Consultant', 'Reviewer', 'Technical Implementer', 'Project Lead', 'Subject-Matter Expert'
                        ].map(role => (
                          <label
                            key={role}
                            className={`
                              flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all
                              ${preferredRoles.includes(role)
                                ? 'bg-primary/10 border-primary text-primary shadow-sm'
                                : 'bg-slate-900/40 border-white/10 text-slate-300 hover:border-white/20 hover:bg-slate-900/60'
                              }
                            `}
                            onClick={() => togglePreferredRole(role)}
                          >
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors
                              ${preferredRoles.includes(role) ? 'border-primary bg-primary text-slate-950' : 'border-slate-600'}
                            `}>
                              {preferredRoles.includes(role) && <Check size={14} />}
                            </div>
                            <span className="text-sm font-semibold">{role}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Work Mode Input */}
                  {workPrefStep === 4 && (
                    <div key="wp-4" className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black uppercase my-5 text-slate-500 tracking-wider font-mono">16. Work Mode</span>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-mono">Recommended</span>
                      </div>
                      <p className="text-sm text-slate-400">Useful for location-specific or client-facing work.</p>
                      
                      <div className="flex flex-col gap-2 mt-2">
                        {[
                          'Remote', 'On-site', 'Hybrid'
                        ].map(mode => (
                          <label
                            key={mode}
                            className={`
                              flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all
                              ${workModes.includes(mode)
                                ? 'bg-primary/10 border-primary text-primary shadow-sm'
                                : 'bg-slate-900/40 border-white/10 text-slate-300 hover:border-white/20 hover:bg-slate-900/60'
                              }
                            `}
                            onClick={() => toggleWorkMode(mode)}
                          >
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors
                              ${workModes.includes(mode) ? 'border-primary bg-primary text-slate-950' : 'border-slate-600'}
                            `}>
                              {workModes.includes(mode) && <Check size={14} />}
                            </div>
                            <span className="text-sm font-semibold">{mode}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Geographic Coverage Input */}
                  {workPrefStep === 5 && (
                    <div key="wp-5" className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black uppercase my-5 text-slate-500 tracking-wider font-mono">17. Geographic Coverage</span>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-mono">Recommended</span>
                      </div>
                      
                      <div className="flex gap-3 bg-card border border-white/10 rounded-2xl p-2 focus-within:border-primary transition-colors shadow-lg">
                        <input
                          type="text"
                          placeholder="E.g., Italy, Malta, London, EMEA..."
                          value={geoCoverage}
                          onChange={e => setGeoCoverage(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleNext()}
                          className="flex-1 bg-transparent px-5 py-4 text-base font-semibold text-white focus:outline-none focus:border-transparent placeholder-slate-500"
                          autoFocus
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        Enter countries, regions, or cities where you can support on-site work. Important for Italy, Malta, and future regional expansion.
                      </p>
                    </div>
                  )}

                  {/* Languages Input */}
                  {workPrefStep === 6 && (
                    <div key="wp-6" className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black uppercase my-5 text-slate-500 tracking-wider font-mono">18. Languages</span>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-mono">Recommended</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {['English', 'Maltese', 'Italian', 'French', 'Spanish'].map(lang => (
                          <button
                            key={lang}
                            onClick={() => toggleLanguage(lang)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
                              languages.includes(lang)
                                ? 'bg-primary text-slate-950 border-primary shadow-sm shadow-primary/20'
                                : 'bg-slate-900/40 border-white/10 text-slate-300 hover:border-white/30 hover:bg-slate-800'
                            }`}
                          >
                            {lang} {languages.includes(lang) && <Check size={14} className="inline ml-1" />}
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-3 bg-card border border-white/10 rounded-2xl p-2 focus-within:border-primary transition-colors shadow-lg">
                        <input
                          type="text"
                          placeholder="Other language (Press Enter to add)..."
                          value={customLanguageInput}
                          onChange={e => setCustomLanguageInput(e.target.value)}
                          onKeyDown={handleAddCustomLanguage}
                          className="flex-1 bg-transparent px-5 py-4 text-base font-semibold text-white focus:outline-none focus:border-transparent placeholder-slate-500"
                        />
                      </div>
                      
                      {languages.filter(l => !['English', 'Maltese', 'Italian', 'French', 'Spanish'].includes(l)).length > 0 && (
                        <div className="mt-4 p-4 border border-white/10 rounded-xl bg-slate-900/40">
                          <h4 className="text-xs font-black uppercase text-slate-500 mb-3 tracking-wider">Other Languages</h4>
                          <div className="flex flex-wrap gap-2">
                            {languages
                              .filter(l => !['English', 'Maltese', 'Italian', 'French', 'Spanish'].includes(l))
                              .map(lang => (
                                <div key={lang} className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-semibold border border-primary/20">
                                  {lang}
                                  <button
                                    onClick={() => handleRemoveLanguage(lang)}
                                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                                  >
                                    <X size={14} />
                                  </button>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {step === 8 && (
                <div className="space-y-8 max-w-3xl">
                  {/* Hourly Rate Input */}
                  {commercialsStep === 1 && (
                    <div key="comm-1" className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black uppercase my-5 text-slate-500 tracking-wider font-mono">19. Preferred Hourly Rate</span>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-mono">Optional</span>
                      </div>
                      
                      <div className="flex gap-3 bg-card border border-white/10 rounded-2xl p-2 focus-within:border-primary transition-colors shadow-lg relative">
                        <select
                          value={currency}
                          onChange={e => setCurrency(e.target.value)}
                          className="bg-slate-900/40 text-slate-300 font-bold px-4 py-4 rounded-xl border border-white/5 focus:outline-none focus:border-primary appearance-none cursor-pointer"
                        >
                          <option value="EUR">EUR (€)</option>
                          <option value="GBP">GBP (£)</option>
                          <option value="USD">USD ($)</option>
                          <option value="Other">Other</option>
                        </select>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={hourlyRate}
                          onChange={e => setHourlyRate(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleNext()}
                          className="flex-1 bg-transparent px-5 py-4 text-base font-semibold text-white focus:outline-none focus:border-transparent placeholder-slate-500"
                          autoFocus
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <p className="text-xs text-slate-500">
                        Enter your preferred hourly rate, if applicable. Can be hidden from PMs if ORR wants admin-only visibility.
                      </p>
                    </div>
                  )}

                  {/* Engagement Type Input */}
                  {commercialsStep === 2 && (
                    <div key="comm-2" className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black uppercase my-5 text-slate-500 tracking-wider font-mono">20. Engagement Type</span>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-mono">Recommended</span>
                      </div>
                      <p className="text-sm text-slate-400">Useful for commercial planning and client proposals.</p>
                      
                      <div className="flex flex-col gap-2 mt-2">
                        {[
                          'Hourly', 'Fixed-scope project', 'Retainer support', 'Ad hoc review', 'On-site assignment'
                        ].map(type => (
                          <label
                            key={type}
                            className={`
                              flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all
                              ${engagementTypes.includes(type)
                                ? 'bg-primary/10 border-primary text-primary shadow-sm'
                                : 'bg-slate-900/40 border-white/10 text-slate-300 hover:border-white/20 hover:bg-slate-900/60'
                              }
                            `}
                            onClick={() => toggleEngagementType(type)}
                          >
                            <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors
                              ${engagementTypes.includes(type) ? 'border-primary bg-primary text-slate-950' : 'border-slate-600'}
                            `}>
                              {engagementTypes.includes(type) && <Check size={14} />}
                            </div>
                            <span className="text-sm font-semibold">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 9 && (
                <div className="space-y-8 max-w-3xl">
                  {/* Right to Provide Services Input */}
                  {complianceStep === 1 && (
                    <div key="comp-1" className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-black uppercase my-5 text-slate-500 tracking-wider font-mono">21. Right to Provide Services</span>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-mono">Required</span>
                      </div>
                      
                      <div className="flex gap-3 bg-card border border-white/10 rounded-2xl p-4 focus-within:border-primary transition-colors shadow-lg cursor-pointer" onClick={() => setRightToWork(!rightToWork)}>
                        <div className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-colors mt-1
                          ${rightToWork ? 'border-primary bg-primary text-slate-950' : 'border-slate-600'}
                        `}>
                          {rightToWork && <Check size={16} />}
                        </div>
                        <div>
                          <p className="text-base font-semibold text-white">I confirm that I am legally able to provide consulting services in my jurisdiction.</p>
                          <p className="text-sm text-slate-500 mt-1">This is a basic self-declaration, not a substitute for legal verification.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-12">
                  {/* Primary Specialization */}
                  {specializationStep === 1 && (
                    <div key="spec-1" className="animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">1. Primary Specialization</h3>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-mono">Required</span>
                      </div>
                      <p className="text-sm text-slate-400 mb-6">Select the main ORR service area that best reflects your professional expertise. Consultant must select one only.</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {industries.map(ind => {
                          const Icon = ind.icon;
                          const isSelected = selectedIndustry === ind.id;
                          return (
                            <div
                              key={ind.id}
                              onClick={() => {
                                setSelectedIndustry(ind.id);
                                if (skills.length === 0 || standardSkills[selectedIndustry]?.every(s => skills.includes(s))) {
                                  setSkills(standardSkills[ind.id]);
                                }
                                if (secondaryIndustries.includes(ind.id)) {
                                  setSecondaryIndustries(prev => prev.filter(i => i !== ind.id));
                                }
                              }}
                              className={`
                                relative cursor-pointer border rounded-3xl p-6 transition-all duration-300 overflow-hidden
                                flex flex-col h-full
                                ${isSelected
                                  ? `${ind.borderColor} bg-card shadow-lg ${ind.shadowColor}`
                                  : "border-white/10 bg-slate-900/40 hover:bg-slate-900/80 hover:border-white/20"
                                }
                              `}
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isSelected ? ind.bgColor : 'bg-slate-800'}`}>
                                  <Icon size={24} className={isSelected ? ind.color : 'text-slate-400'} />
                                </div>
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                                  ${isSelected ? `${ind.borderColor} ${ind.checkBgColor}` : 'border-slate-700'}
                                `}>
                                  {isSelected && <CheckCircle size={14} className="text-slate-950" />}
                                </div>
                              </div>
                              <h3 className="text-xl font-bold mb-2 text-white">{ind.title}</h3>
                              <p className="text-sm text-slate-400 leading-relaxed flex-1">
                                {ind.description}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Secondary Specializations */}
                  {specializationStep === 2 && (
                    <div key="spec-2" className="animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white">2. Secondary Specializations</h3>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-mono">Max 2</span>
                      </div>
                      <p className="text-sm text-slate-400 mb-6">Select any additional ORR service areas where you can provide meaningful support.</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {industries.map(ind => {
                          const Icon = ind.icon;
                          const isPrimary = selectedIndustry === ind.id;
                          const isSelected = secondaryIndustries.includes(ind.id);

                          return (
                            <div
                              key={`sec-${ind.id}`}
                              onClick={() => {
                                if (isPrimary) return;
                                if (isSelected) {
                                  setSecondaryIndustries(prev => prev.filter(i => i !== ind.id));
                                } else if (secondaryIndustries.length < 2) {
                                  setSecondaryIndustries(prev => [...prev, ind.id]);
                                }
                              }}
                              className={`
                                relative border rounded-3xl p-6 transition-all duration-300 overflow-hidden
                                flex flex-col h-full
                                ${isPrimary ? 'opacity-50 grayscale cursor-not-allowed border-white/5 bg-slate-900/20' : 'cursor-pointer'}
                                ${!isPrimary && isSelected
                                  ? `${ind.borderColor} bg-card shadow-lg ${ind.shadowColor}`
                                  : !isPrimary ? "border-white/10 bg-slate-900/40 hover:bg-slate-900/80 hover:border-white/20" : ""
                                }
                              `}
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isSelected ? ind.bgColor : 'bg-slate-800'}`}>
                                  <Icon size={24} className={isSelected ? ind.color : 'text-slate-400'} />
                                </div>
                                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors
                                  ${isSelected ? `${ind.borderColor} ${ind.checkBgColor}` : 'border-slate-700'}
                                `}>
                                  {isSelected && <CheckCircle size={14} className="text-slate-950" />}
                                </div>
                              </div>
                              <h3 className="text-xl font-bold mb-2 text-white">{ind.title}</h3>
                              <p className="text-sm text-slate-400 leading-relaxed flex-1">
                                {isPrimary ? 'Selected as Primary' : ind.description}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 4 && (
                <div className="space-y-8 max-w-3xl">

                  {skillsStep === 1 && (
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-xl font-bold text-white">1. Map Technical Capabilities</h3>
                        </div>
                        <p className="text-sm text-slate-400">Select the technical capabilities that accurately reflect your experience. (Searchable by PMs/admin)</p>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search for skills..."
                        value={skillQuery}
                        onChange={e => setSkillQuery(e.target.value)}
                        className="w-full bg-card border border-white/10 rounded-2xl p-4 text-white text-base font-semibold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-lg hover:border-white/20"
                      />
                    </div>

                    {/* Searchable Checklist */}
                    <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-6 max-h-[400px] overflow-y-auto space-y-2">
                      {ALL_SKILLS.filter(s => s.toLowerCase().includes(skillQuery.toLowerCase())).map(skill => {
                        const isSelected = skills.includes(skill);
                        return (
                          <label
                            key={skill}
                            onClick={(e) => {
                              e.preventDefault();
                              toggleSkill(skill);
                            }}
                            className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-colors border
                              ${isSelected ? 'bg-primary/10 border-primary/30' : 'bg-slate-800/50 border-transparent hover:bg-slate-800 hover:border-white/10'}
                            `}
                          >
                            <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors
                              ${isSelected ? 'border-primary bg-primary' : 'border-slate-600 bg-slate-900'}
                            `}>
                              {isSelected && <CheckCircle size={14} className="text-slate-950 stroke-[3px]" />}
                            </div>
                            <span className={`font-semibold ${isSelected ? 'text-primary' : 'text-slate-300'}`}>
                              {skill}
                            </span>
                          </label>
                        );
                      })}
                      {ALL_SKILLS.filter(s => s.toLowerCase().includes(skillQuery.toLowerCase())).length === 0 && (
                        <div className="text-center p-8 text-slate-500">No skills found matching &quot;{skillQuery}&quot;</div>
                      )}
                    </div>
                  </div>

                  {/* Selected Skills with Proficiency */}
                  <div className="space-y-4 pt-6 border-t border-white/5">
                    <span className="text-sm font-black uppercase text-slate-500 tracking-wider font-mono">Selected Capabilities ({skills.length})</span>
                    <p className="text-xs text-slate-400">Please indicate your proficiency level for each selected skill.</p>
                    <div className="flex flex-col gap-3">
                      {skills.length === 0 ? (
                        <span className="text-slate-600 text-sm italic">No capabilities selected yet.</span>
                      ) : (
                        skills.map(sk => (
                          <div
                            key={sk}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-primary/5 border border-primary/20 rounded-2xl group transition-all shadow-sm"
                          >
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => handleRemoveSkill(sk)}
                                className="text-primary/50 hover:text-red-400 cursor-pointer transition-colors p-1 bg-slate-900 rounded-md"
                              >
                                <X size={16} />
                              </button>
                              <span className="font-bold text-primary font-mono text-sm">{sk}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                              <select
                                value={skillProficiencies[sk] || ''}
                                onChange={(e) => handleProficiencyChange(sk, e.target.value)}
                                className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-auto"
                              >
                                <option value="" disabled>Select proficiency...</option>
                                <option value="Working knowledge">Working knowledge</option>
                                <option value="Experienced">Experienced</option>
                                <option value="Advanced">Advanced</option>
                                <option value="Expert">Expert</option>
                              </select>

                              <select
                                value={skillYearsExperience[sk] || ''}
                                onChange={(e) => handleExperienceChange(sk, e.target.value)}
                                className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-auto"
                              >
                                <option value="" disabled>Select experience...</option>
                                <option value="Less than 1 year">Less than 1 year</option>
                                <option value="1–3 years">1–3 years</option>
                                <option value="3–5 years">3–5 years</option>
                                <option value="5–10 years">5–10 years</option>
                                <option value="10+ years">10+ years</option>
                              </select>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                    </div>
                  )}

                  {/* Custom Skills Input Box */}
                  {skillsStep === 2 && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-bold text-white">2. Other / Custom Skill</h3>
                      </div>
                    <p className="text-sm text-slate-400">Add any relevant capability not listed above. Custom entries will be reviewed before becoming searchable in the ORR consultant database.</p>
                    <div className="flex gap-3 bg-card border border-white/10 rounded-2xl p-2 focus-within:border-primary transition-colors shadow-lg">
                      <input
                        type="text"
                        placeholder="e.g. Specialized Proprietary Protocol"
                        value={customSkillInput}
                        onChange={e => setCustomSkillInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomSkill();
                          }
                        }}
                        className="flex-1 bg-transparent px-5 py-3 text-base font-semibold text-white focus:outline-none focus:border-transparent placeholder-slate-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomSkill}
                        className="bg-primary hover:bg-[lemon] text-slate-950 px-6 py-3 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-2 text-sm shadow-md"
                      >
                        <Plus size={16} />
                        Add Custom
                      </button>
                    </div>

                    {/* Custom Skills Pills Box */}
                    {customSkills.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-4">
                        {customSkills.map(sk => (
                          <span
                            key={sk.name}
                            className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-xl text-sm font-bold font-mono group transition-all shadow-sm"
                          >
                            <span>{sk.name}</span>
                            <span className="bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-md text-xs">{sk.status}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomSkill(sk.name)}
                              className="text-yellow-500/50 hover:text-red-400 cursor-pointer transition-colors ml-1"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                </div>
              )}

              {step === 5 && (
                <div className="space-y-8 max-w-3xl">
                  {/* IT Competence Section */}
                  {itCompetenceStep === 1 && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-bold text-white">3. IT Competence</h3>
                        <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-mono">Required</span>
                      </div>
                      <p className="text-sm text-slate-400">Important because ORR consultants will operate through a digital portal and may interact with project tools.</p>
                      <div className="flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-white">General IT Confidence</label>
                          <select
                            value={itConfidence}
                            onChange={(e) => setItConfidence(e.target.value)}
                            className="bg-card border border-white/10 rounded-2xl px-5 py-4 text-base font-semibold text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary w-full shadow-lg transition-colors hover:border-white/20 cursor-pointer"
                          >
                            <option value="" disabled>Select confidence level...</option>
                            <option value="Basic">Basic</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-white">AI Tool Familiarity</label>
                            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-mono">Recommended</span>
                          </div>
                          <select
                            value={aiFamiliarity}
                            onChange={(e) => setAiFamiliarity(e.target.value)}
                            className="bg-card border border-white/10 rounded-2xl px-5 py-4 text-base font-semibold text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary w-full shadow-lg transition-colors hover:border-white/20 cursor-pointer"
                          >
                            <option value="" disabled>Select AI familiarity...</option>
                            <option value="None">None</option>
                            <option value="Basic">Basic</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                          <p className="text-[10px] text-slate-400 mt-1">Relevant because ORR uses LLM and AI-agent integrations in project design.</p>
                        </div>
                      </div>
                        </div>
                      </div>
                  )}

                  {itCompetenceStep === 2 && (
                    <div className="space-y-8">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-xl font-bold text-white">4. Digital Readiness & Tools</h3>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-white">Portal / Digital Tool Readiness</span>
                          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-mono">Recommended</span>
                        </div>
                        <p className="text-xs text-slate-400">Helps ORR identify whether the consultant can work independently inside the platform.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                          {[
                            'Comfortable using client portals',
                            'Comfortable using shared drives',
                            'Comfortable using project management tools',
                            'Comfortable using CRM systems',
                            'Comfortable using video meetings',
                            'Comfortable using e-signature tools'
                          ].map(tool => (
                            <label
                              key={tool}
                              className={`
                                flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all
                                ${capabilities.includes(tool)
                                  ? 'bg-primary/10 border-primary text-primary shadow-sm'
                                  : 'bg-slate-900/40 border-white/10 text-slate-300 hover:border-white/20 hover:bg-slate-900/60'
                                }
                              `}
                            >
                              <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors
                                ${capabilities.includes(tool) ? 'border-primary bg-primary text-slate-950' : 'border-slate-600'}
                              `}>
                                {capabilities.includes(tool) && <Check size={14} />}
                              </div>
                              <span className="text-sm font-semibold">{tool}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Data Handling Competence */}
                      <div className="space-y-3 pt-4 border-t border-white/5">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-white">Data Handling Competence</span>
                          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-mono">Recommended</span>
                        </div>
                        <p className="text-xs text-slate-400">Useful for determining whether the consultant can handle data-driven briefs.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                          {[
                            'Basic spreadsheet work',
                            'Data cleaning',
                            'Database use',
                            'Dashboard interpretation',
                            'Data analysis',
                            'Data visualization',
                            'Sensitive data handling'
                          ].map(skill => (
                            <label
                              key={skill}
                              className={`
                                flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all
                                ${dataHandling.includes(skill)
                                  ? 'bg-primary/10 border-primary text-primary shadow-sm'
                                  : 'bg-slate-900/40 border-white/10 text-slate-300 hover:border-white/20 hover:bg-slate-900/60'
                                }
                              `}
                              onClick={() => toggleDataHandling(skill)}
                            >
                              <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors
                                ${dataHandling.includes(skill) ? 'border-primary bg-primary text-slate-950' : 'border-slate-600'}
                              `}>
                                {dataHandling.includes(skill) && <Check size={14} />}
                              </div>
                              <span className="text-sm font-semibold">{skill}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Software / Platform Experience */}
                      <div className="space-y-3 pt-4 border-t border-white/5">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-bold text-white">Software / Platform Experience</span>
                          <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-mono">Recommended</span>
                        </div>
                        <p className="text-xs text-slate-400">Useful for matching consultants to client environments and internal ORR systems.</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {[
                            'Google Workspace', 'Microsoft 365', 'Notion', 'Trello', 'Asana',
                            'ClickUp', 'Slack', 'Teams', 'Zoom', 'HubSpot', 'Airtable',
                            'Excel / Sheets', 'Power BI'
                          ].map(sw => (
                            <button
                              key={sw}
                              type="button"
                              onClick={() => toggleSoftware(sw)}
                              className={`
                                px-4 py-2 rounded-xl border text-sm font-semibold transition-all
                                ${softwareExperience.includes(sw)
                                  ? 'bg-primary/20 border-primary text-primary shadow-sm'
                                  : 'bg-slate-900/40 border-white/10 text-slate-300 hover:border-white/20 hover:bg-slate-900/60'
                                }
                              `}
                            >
                              {sw}
                            </button>
                          ))}
                        </div>

                        {/* Custom Software Input */}
                        <div className="flex gap-3 bg-slate-900/40 border border-white/10 rounded-2xl p-2 focus-within:border-primary transition-colors shadow-sm mt-3">
                          <input
                            type="text"
                            placeholder="Other software (e.g. Salesforce, Jira)..."
                            value={customSoftwareInput}
                            onChange={e => setCustomSoftwareInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCustomSoftware();
                              }
                            }}
                            className="flex-1 bg-transparent px-3 py-2 text-sm font-semibold text-white focus:outline-none focus:border-transparent placeholder-slate-500"
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomSoftware}
                            className="bg-primary/20 hover:bg-primary/40 text-primary px-4 py-2 rounded-xl font-bold transition-colors cursor-pointer flex items-center gap-2 text-xs"
                          >
                            <Plus size={14} />
                            Add
                          </button>
                        </div>

                        {/* Selected Custom Softwares (that are not in standard list) */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {softwareExperience.filter(sw => ![
                            'Google Workspace', 'Microsoft 365', 'Notion', 'Trello', 'Asana',
                            'ClickUp', 'Slack', 'Teams', 'Zoom', 'HubSpot', 'Airtable',
                            'Excel / Sheets', 'Power BI'
                          ].includes(sw)).map(sw => (
                            <span
                              key={sw}
                              className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 text-primary rounded-xl text-xs font-bold font-mono group transition-all shadow-sm"
                            >
                              {sw}
                              <button
                                type="button"
                                onClick={() => handleRemoveSoftware(sw)}
                                className="text-primary/50 hover:text-red-400 cursor-pointer transition-colors"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {itCompetenceStep === 3 && (
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
                </div>
              )}

              {step === 9 && complianceStep > 1 && complianceStep < 5 && (
                <div className="space-y-6 max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
                  <div className="p-8 bg-card border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center shrink-0">
                        <ShieldCheck size={24} />
                      </div>
                      <div className="space-y-4 w-full">
                        {complianceStep === 2 && (
                          <div key="comp-2" className="animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both space-y-4">
                            <h3 className="text-xl font-bold text-white">2. Confidentiality Acknowledgement</h3>
                        <p className="text-slate-400 leading-relaxed">
                          I understand that ORR client information, project details, and internal materials are confidential. This will be linked to formal consultant terms or an NDA later.
                        </p>

                        <div className="mt-4 border border-white/10 bg-slate-900/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                              <FileText size={20} />
                            </div>
                            <div>
                              <div className="font-bold text-white text-sm">ORR Solutions Mutual NDA</div>
                              <div className="text-xs text-slate-400 mt-0.5">Google Drive Document</div>
                            </div>
                          </div>
                          <a href="https://drive.google.com/file/d/1rfrIqgPrl6cgN12YuXYExQL2VFNwGkDi/view?usp=drive_link" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary text-sm font-bold hover:underline bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center">
                            Review Document <ExternalLink size={14} />
                          </a>
                        </div>

                        <label className="flex items-center gap-3 cursor-pointer mt-6 p-4 border border-white/5 rounded-xl hover:bg-white/5 transition-colors" onClick={() => setNdaAccepted(!ndaAccepted)}>
                          <div className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-colors mt-1
                            ${ndaAccepted ? 'border-primary bg-primary text-slate-950' : 'border-slate-600'}
                          `}>
                            {ndaAccepted && <Check size={16} />}
                          </div>
                          <span className="font-bold text-white select-none">
                            I acknowledge and agree to the confidentiality terms
                          </span>
                        </label>
                      </div>
                        )}

                        {/* Conflict of Interest Declaration */}
                        {complianceStep === 3 && (
                          <div key="comp-3" className="animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both space-y-4">
                            <h3 className="text-xl font-bold text-white">3. Conflict of Interest Declaration</h3>
                        <p className="text-slate-400 leading-relaxed">
                          I confirm that I will disclose any actual or potential conflict of interest before accepting ORR work.
                        </p>
                        
                        <label className="flex items-center gap-3 cursor-pointer mt-2 p-4 border border-white/5 rounded-xl hover:bg-white/5 transition-colors" onClick={() => setConflictOfInterest(!conflictOfInterest)}>
                          <div className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-colors mt-1
                            ${conflictOfInterest ? 'border-primary bg-primary text-slate-950' : 'border-slate-600'}
                          `}>
                            {conflictOfInterest && <Check size={16} />}
                          </div>
                          <span className="font-bold text-white select-none">
                            I confirm and agree to disclose conflicts
                          </span>
                        </label>

                        {conflictOfInterest && (
                          <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex gap-3 bg-card border border-white/10 rounded-2xl p-2 focus-within:border-primary transition-colors shadow-lg">
                              <textarea
                                placeholder="Declared Conflicts (Optional)..."
                                value={conflictDetails}
                                onChange={e => setConflictDetails(e.target.value)}
                                className="flex-1 bg-transparent px-5 py-4 text-base font-semibold text-white focus:outline-none focus:border-transparent placeholder-slate-500 resize-none min-h-[100px]"
                              />
                            </div>
                          </div>
                        )}
                          </div>
                        )}

                        {/* Data Protection Acknowledgement */}
                        {complianceStep === 4 && (
                          <div key="comp-4" className="animate-in fade-in slide-in-from-right-8 duration-500 fill-mode-both space-y-4">
                            <h3 className="text-xl font-bold text-white">4. Data Protection Acknowledgement</h3>
                        <p className="text-slate-400 leading-relaxed">
                          I agree to handle personal, commercial, and client data only through approved ORR channels and instructions.
                        </p>
                        
                        <label className="flex items-center gap-3 cursor-pointer mt-2 p-4 border border-white/5 rounded-xl hover:bg-white/5 transition-colors" onClick={() => setDataProtection(!dataProtection)}>
                          <div className={`w-6 h-6 rounded-md border flex items-center justify-center shrink-0 transition-colors mt-1
                            ${dataProtection ? 'border-primary bg-primary text-slate-950' : 'border-slate-600'}
                          `}>
                            {dataProtection && <Check size={16} />}
                          </div>
                          <span className="font-bold text-white select-none">
                            I agree to the data protection terms
                          </span>
                        </label>
                      </div>
                        )}
                    </div>
                    </div>
                  </div>
                </div>
              )}


              </motion.div>
            </AnimatePresence>

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
                onClick={step === 9 && complianceStep === 4 ? handleFinish : handleNext}
                disabled={
                  (step === 1 && !consultantId) ||
                  (step === 2 && basicProfileStep === 1 && !fullName) ||
                  (step === 2 && basicProfileStep === 5 && !country) ||
                  (step === 3 && specializationStep === 1 && !selectedIndustry) ||
                  (step === 9 && complianceStep === 1 && !rightToWork) ||
                  (step === 9 && complianceStep === 2 && !ndaAccepted) ||
                  (step === 9 && complianceStep === 3 && !conflictOfInterest) ||
                  (step === 9 && complianceStep === 4 && !dataProtection)
                }
                className="w-full sm:w-auto bg-primary hover:bg-[lemon] text-slate-950 px-14 py-5 rounded-2xl font-black text-lg tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] flex justify-center items-center gap-2"
              >
                {step === 9 && complianceStep === 4 ? t('onboarding.enterPortalBtn') : t('onboarding.nextBtn')}
                {!(step === 9 && complianceStep === 4) && <ChevronRight size={24} />}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
