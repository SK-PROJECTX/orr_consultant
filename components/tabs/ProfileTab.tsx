'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { useConsultantStore, ProfileData } from '@/store/consultantStore';
import { User, Mail, Phone, FileText, Link, Save } from 'lucide-react';

export default function ProfileTab() {
  const { t } = useTranslation();
  const profileData = useConsultantStore(state => state.profileData);
  const updateProfile = useConsultantStore(state => state.updateProfile);

  const [formData, setFormData] = useState<ProfileData>(profileData);

  // Sync state if profileData changes externally
  useEffect(() => {
    setFormData(profileData);
  }, [profileData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl lg:text-2xl font-black text-white flex items-center gap-2">
          <User className="text-primary" />
          {t('profile.title')}
        </h1>
        <p className="text-slate-400 text-xs mt-1">{t('profile.desc')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Details Section */}
        <div className="bg-card border border-white/5 p-6 lg:p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-cyan-500/50" />
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
            <User size={18} className="text-primary" />
            {t('profile.personalDetails')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">
                {t('profile.firstName')}
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder={t('profile.placeholderFirstName')}
                className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">
                {t('profile.lastName')}
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder={t('profile.placeholderLastName')}
                className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">
                {t('profile.email')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('profile.placeholderEmail')}
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">
                {t('profile.phone')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Phone size={16} />
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t('profile.placeholderPhone')}
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Summary Section */}
        <div className="bg-card border border-white/5 p-6 lg:p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500/50 to-purple-500/50" />
          <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
            <FileText size={18} className="text-blue-400" />
            {t('profile.professionalSummary')}
          </h2>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">
                {t('profile.bio')}
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder={t('profile.placeholderBio')}
                className="w-full px-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 transition-colors min-h-[120px] resize-y"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-mono">
                {t('profile.linkedIn')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Link size={16} />
                </span>
                <input
                  type="url"
                  name="linkedIn"
                  value={formData.linkedIn}
                  onChange={handleChange}
                  placeholder={t('profile.placeholderLinkedIn')}
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 bg-primary hover:bg-lemon text-slate-950 font-black px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] cursor-pointer"
          >
            <Save size={18} />
            {t('profile.updateProfile')}
          </button>
        </div>
      </form>
    </div>
  );
}
