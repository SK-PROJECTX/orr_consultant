'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useConsultantStore, ProfileData } from '@/store/consultantStore';
import { User, Briefcase, Award, Calendar, Save, X, Globe, Phone, Mail, Link as LinkIcon, Camera, MapPin, Building2, BookOpen, Clock, Tag, ChevronDown, CheckSquare, Plus } from 'lucide-react';

type Tab = 'personal' | 'professional' | 'skills' | 'availability';

export default function ProfileTab() {
  const { t } = useTranslation();
  const profileData = useConsultantStore(state => state.profileData);
  const updateProfile = useConsultantStore(state => state.updateProfile);

  const [activeTab, setActiveTab] = useState<Tab>('personal');
  const [formData, setFormData] = useState<ProfileData>(profileData);
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');

  // Sync state if profileData changes externally
  useEffect(() => {
    setFormData(profileData);
  }, [profileData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNestedChange = (section: keyof ProfileData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any || {}),
        [field]: value
      }
    }));
  };

  const handleArrayAdd = (field: keyof ProfileData, value: string) => {
    if (!value.trim()) return;
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[] || []), value.trim()]
    }));
  };

  const handleArrayRemove = (field: keyof ProfileData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const handleNestedArrayAdd = (section: 'availability', field: keyof ProfileData['availability'], value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...(prev[section][field] as any[] || []), value]
      }
    }));
  };

  const handleNestedArrayRemove = (section: 'availability', field: keyof ProfileData['availability'], index: number) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: (prev[section][field] as any[]).filter((_, i) => i !== index)
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    alert('Profile saved successfully!'); // Temporary simple feedback
  };

  const tabs = [
    { id: 'personal', label: t('profile.tabPersonal'), icon: User },
    { id: 'professional', label: t('profile.tabProfessional'), icon: Briefcase },
    { id: 'skills', label: t('profile.tabSkills'), icon: Award },
    { id: 'availability', label: t('profile.tabAvailability'), icon: Calendar }
  ];

  const ArrayInput = ({ label, field, placeholder }: { label: string, field: keyof ProfileData, placeholder: string }) => {
    const [input, setInput] = useState('');
    const items = (formData[field] as string[]) || [];

    return (
      <div className="space-y-2">
        <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{label}</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {items.map((item, idx) => (
            <span key={idx} className="bg-primary/10 text-primary border border-primary/20 text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium">
              {item}
              <button type="button" onClick={() => handleArrayRemove(field, idx)} className="hover:text-white transition">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleArrayAdd(field, input);
                setInput('');
              }
            }}
            placeholder={placeholder}
            className="flex-1 px-4 py-2.5 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
          />
          <button
            type="button"
            onClick={() => {
              handleArrayAdd(field, input);
              setInput('');
            }}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-semibold transition"
          >
            {t('profile.add')}
          </button>
        </div>
      </div>
    );
  };

  const renderPersonalTab = () => (
    <div className="space-y-6">
      <div className="bg-card border border-white/5 p-6 lg:p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-cyan-500/50" />
        <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
          <User size={18} className="text-primary" />
          {t('profile.personalInformation')}
        </h2>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="w-24 h-24 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center flex-shrink-0 relative overflow-hidden group">
            {formData.photoUrl ? (
              <img src={formData.photoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={32} className="text-slate-500" />
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
              <Camera size={20} className="text-white" />
            </div>
          </div>
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('profile.firstName')}</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('profile.lastName')}</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('profile.jobTitle')}</label>
              <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('profile.headline')}</label>
              <input type="text" name="headline" value={formData.headline} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('profile.bio')}</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 resize-y" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('profile.gender')}</label>
            <input type="text" name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('profile.dateOfBirth')}</label>
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 [color-scheme:dark]" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('profile.nationality')}</label>
            <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
          </div>
        </div>

        <ArrayInput label={t('profile.languages')} field="languages" placeholder={t('profile.typeAndPressEnter')} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('profile.timezone')}</label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input type="text" name="timezone" value={formData.timezone} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-white/5 p-6 lg:p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
          <Phone size={18} className="text-emerald-400" />
          {t('profile.contactInfo')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('profile.email')}</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('profile.phone')}</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('profile.website')}</label>
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
            </div>
          </div>
        </div>

        <h3 className="text-sm font-bold text-white border-b border-white/5 pb-2 pt-4">{t('profile.socialLinks')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('profile.linkedIn')}</label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input type="url" value={formData.socialLinks?.linkedIn || ''} onChange={(e) => handleNestedChange('socialLinks', 'linkedIn', e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('profile.twitter')}</label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input type="url" value={formData.socialLinks?.twitter || ''} onChange={(e) => handleNestedChange('socialLinks', 'twitter', e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('profile.facebook')}</label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input type="url" value={formData.socialLinks?.facebook || ''} onChange={(e) => handleNestedChange('socialLinks', 'facebook', e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('profile.portfolio')}</label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input type="url" value={formData.socialLinks?.portfolio || ''} onChange={(e) => handleNestedChange('socialLinks', 'portfolio', e.target.value)} className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfessionalTab = () => (
    <div className="space-y-6">
      <div className="bg-card border border-white/5 p-6 lg:p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 to-purple-500/50" />
        <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
          <Briefcase size={18} className="text-blue-400" />
          {t('profile.professionalInformation')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('profile.consultantCategory')}</label>
            <input type="text" name="consultantCategory" value={formData.consultantCategory} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('profile.yearsOfExperience')}</label>
            <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('profile.primarySpecialization')}</label>
            <input type="text" name="primarySpecialization" value={formData.primarySpecialization} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('profile.currentCompany')}</label>
            <input type="text" name="currentCompany" value={formData.currentCompany} onChange={handleChange} className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
          </div>
        </div>

        <ArrayInput label={t('profile.secondarySpecializations')} field="secondarySpecializations" placeholder={t('profile.typeAndPressEnter')} />
        <ArrayInput label={t('profile.previousCompanies')} field="previousCompanies" placeholder={t('profile.typeAndPressEnter')} />
        <ArrayInput label={t('profile.industryExpertise')} field="industryExpertise" placeholder={t('profile.typeAndPressEnter')} />
        <ArrayInput label={t('profile.certifications')} field="certifications" placeholder={t('profile.typeAndPressEnter')} />
        <ArrayInput label={t('profile.licenses')} field="licenses" placeholder={t('profile.typeAndPressEnter')} />
        <ArrayInput label={t('profile.educationalQualifications')} field="educationalQualifications" placeholder={t('profile.typeAndPressEnter')} />
        <ArrayInput label={t('profile.professionalMemberships')} field="professionalMemberships" placeholder={t('profile.typeAndPressEnter')} />
      </div>
    </div>
  );

  const renderSkillsTab = () => {
    const handleAddSkill = () => {
      if (!skillName.trim()) return;
      setFormData(prev => ({
        ...prev,
        skills: [...(prev.skills || []), { name: skillName.trim(), level: skillLevel }]
      }));
      setSkillName('');
    };

    const handleRemoveSkill = (index: number) => {
      setFormData(prev => ({
        ...prev,
        skills: prev.skills.filter((_, i) => i !== index)
      }));
    };

    return (
      <div className="space-y-6">
        <div className="bg-card border border-white/5 p-6 lg:p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500/50 to-amber-500/50" />
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
            <Award size={18} className="text-amber-400" />
            {t('profile.skillsAndExpertise')}
          </h2>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('profile.skillsManagement')}</label>
            
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4">
              <div className="flex gap-3 items-end">
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-semibold text-slate-400">Skill</label>
                  <input type="text" value={skillName} onChange={e => setSkillName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }} placeholder={t('profile.skillNamePlaceholder')} className="w-full px-4 py-2.5 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
                </div>
                <div className="w-48 space-y-2">
                  <label className="text-[10px] font-semibold text-slate-400">{t('profile.competencyLevel')}</label>
                  <select value={skillLevel} onChange={e => setSkillLevel(e.target.value as any)} className="w-full px-4 py-2.5 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 appearance-none">
                    <option value="Beginner">{t('profile.levelBeginner')}</option>
                    <option value="Intermediate">{t('profile.levelIntermediate')}</option>
                    <option value="Advanced">{t('profile.levelAdvanced')}</option>
                    <option value="Expert">{t('profile.levelExpert')}</option>
                  </select>
                </div>
                <button type="button" onClick={handleAddSkill} className="px-6 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/20 rounded-xl text-sm font-bold transition flex items-center justify-center">
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              {formData.skills && formData.skills.map((skill, idx) => (
                <div key={idx} className="flex justify-between items-center bg-white/5 border border-white/10 p-3 rounded-xl">
                  <span className="text-sm font-semibold text-white flex items-center gap-2">
                    <Tag size={14} className="text-amber-400" />
                    {skill.name}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded">{skill.level}</span>
                    <button type="button" onClick={() => handleRemoveSkill(idx)} className="text-slate-500 hover:text-red-400 transition">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <ArrayInput label={t('profile.expertiseTags')} field="expertiseTags" placeholder={t('profile.typeAndPressEnter')} />
          <ArrayInput label={t('profile.areasOfSpecialization')} field="areasOfSpecialization" placeholder={t('profile.typeAndPressEnter')} />
          <ArrayInput label={t('profile.consultingMethodologies')} field="consultingMethodologies" placeholder={t('profile.typeAndPressEnter')} />
        </div>
      </div>
    );
  };

  const renderAvailabilityTab = () => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    const toggleWorkingDay = (day: string) => {
      const current = formData.availability?.workingDays || [];
      if (current.includes(day)) {
        handleNestedChange('availability', 'workingDays', current.filter(d => d !== day));
      } else {
        handleNestedChange('availability', 'workingDays', [...current, day]);
      }
    };

    return (
      <div className="space-y-6">
        <div className="bg-card border border-white/5 p-6 lg:p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500/50 to-teal-500/50" />
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
            <Calendar size={18} className="text-emerald-400" />
            {t('profile.availabilityManagement')}
          </h2>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('profile.workingDays')}</label>
            <div className="flex flex-wrap gap-3">
              {daysOfWeek.map(day => {
                const isActive = (formData.availability?.workingDays || []).includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleWorkingDay(day)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors border ${isActive ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-900/50 text-slate-400 border-white/5 hover:border-white/10'}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('profile.startTime')}</label>
              <input type="time" value={formData.availability?.workingHours?.start || ''} onChange={e => handleNestedChange('availability', 'workingHours', { ...(formData.availability?.workingHours || {}), start: e.target.value })} className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 [color-scheme:dark]" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('profile.endTime')}</label>
              <input type="time" value={formData.availability?.workingHours?.end || ''} onChange={e => handleNestedChange('availability', 'workingHours', { ...(formData.availability?.workingHours || {}), end: e.target.value })} className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 [color-scheme:dark]" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('profile.bufferTime')}</label>
              <input type="number" value={formData.availability?.bufferTimeMinutes || ''} onChange={e => handleNestedChange('availability', 'bufferTimeMinutes', Number(e.target.value))} className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">{t('profile.maxDailyConsultations')}</label>
              <input type="number" value={formData.availability?.maxDailyConsultations || ''} onChange={e => handleNestedChange('availability', 'maxDailyConsultations', Number(e.target.value))} className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50" />
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.availability?.calendarIntegration ? 'bg-primary border-primary text-slate-950' : 'bg-slate-900 border-white/10 text-transparent'}`}>
                <CheckSquare size={14} className={formData.availability?.calendarIntegration ? 'opacity-100' : 'opacity-0'} />
              </div>
              <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{t('profile.calendarIntegration')}</span>
              <input type="checkbox" checked={formData.availability?.calendarIntegration || false} onChange={e => handleNestedChange('availability', 'calendarIntegration', e.target.checked)} className="hidden" />
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.availability?.publicHolidays ? 'bg-primary border-primary text-slate-950' : 'bg-slate-900 border-white/10 text-transparent'}`}>
                <CheckSquare size={14} className={formData.availability?.publicHolidays ? 'opacity-100' : 'opacity-0'} />
              </div>
              <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{t('profile.publicHolidays')}</span>
              <input type="checkbox" checked={formData.availability?.publicHolidays || false} onChange={e => handleNestedChange('availability', 'publicHolidays', e.target.checked)} className="hidden" />
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.availability?.autoBookingRules ? 'bg-primary border-primary text-slate-950' : 'bg-slate-900 border-white/10 text-transparent'}`}>
                <CheckSquare size={14} className={formData.availability?.autoBookingRules ? 'opacity-100' : 'opacity-0'} />
              </div>
              <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{t('profile.autoBookingRules')}</span>
              <input type="checkbox" checked={formData.availability?.autoBookingRules || false} onChange={e => handleNestedChange('availability', 'autoBookingRules', e.target.checked)} className="hidden" />
            </label>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-white flex items-center gap-2">
            <User className="text-primary" />
            {t('profile.title')}
          </h1>
          <p className="text-slate-400 text-xs mt-1">{t('profile.desc')}</p>
        </div>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-primary hover:bg-lemon text-slate-950 font-black px-6 py-3 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] cursor-pointer"
        >
          <Save size={18} />
          {t('profile.updateProfile')}
        </button>
      </div>

      {/* Internal Navigation */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 border-b border-white/5">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-bold text-sm transition-all whitespace-nowrap ${isActive ? 'bg-white/10 text-white border-b-2 border-primary' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border-b-2 border-transparent'}`}
            >
              <Icon size={16} className={isActive ? 'text-primary' : 'text-slate-500'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'personal' && renderPersonalTab()}
        {activeTab === 'professional' && renderProfessionalTab()}
        {activeTab === 'skills' && renderSkillsTab()}
        {activeTab === 'availability' && renderAvailabilityTab()}
      </form>
    </div>
  );
}
