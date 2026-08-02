'use client';

import React, { useState } from "react";
import { Send, Bug, AlertCircle, FileText, Paperclip, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useConsultantStore } from "@/store/consultantStore";

interface FeedbackFormData {
  title: string;
  category: string;
  description: string;
  priority: string;
  hasDocuments: boolean;
  documents: { file: File; description: string }[];
}

const INITIAL_FORM_DATA: FeedbackFormData = {
  title: "",
  category: "",
  description: "",
  priority: "",
  hasDocuments: false,
  documents: [],
};

export default function FeedbackPage() {
  const { t } = useTranslation();
  const onboardingData = useConsultantStore(state => state.onboardingData);
  
  const [formData, setFormData] = useState<FeedbackFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const CATEGORY_OPTIONS = [
    { value: "ui_issue", label: t('feedbackPage.categoryOptions.ui_issue') || "UI / Design Issue" },
    { value: "bug", label: t('feedbackPage.categoryOptions.bug') || "Bug / Error" },
    { value: "feature_request", label: t('feedbackPage.categoryOptions.feature_request') || "Feature Request" },
    { value: "other", label: t('feedbackPage.categoryOptions.other') || "Other" },
  ];

  const PRIORITY_OPTIONS = [
    { value: "low", label: t('feedbackPage.priorityOptions.low') || "Low (Not urgent)" },
    { value: "medium", label: t('feedbackPage.priorityOptions.medium') || "Medium (Affects workflow)" },
    { value: "high", label: t('feedbackPage.priorityOptions.high') || "High (Critical issue / Blocker)" },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newDocs = Array.from(e.target.files).map((file) => ({
        file,
        description: "",
      }));
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...newDocs],
      }));
    }
    e.target.value = "";
  };

  const removeDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulating API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto mt-10 p-8 bg-card border border-white/5 rounded-2xl shadow-xl text-center"
        >
          <div className="w-16 h-16 bg-white/5 text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">{t('feedbackPage.successTitle') || 'Feedback Submitted!'}</h2>
          <p className="text-slate-400 mb-8">
            {t('feedbackPage.successDescription') || 'Thank you for helping us improve. Our technical team has received your report and will investigate it shortly.'}
          </p>
          <button
            onClick={() => {
              setFormData(INITIAL_FORM_DATA);
              setIsSuccess(false);
            }}
            className="px-6 py-3 bg-primary hover:bg-primary/90 text-background font-bold rounded-xl transition-colors cursor-pointer"
          >
            {t('feedbackPage.submitAnother') || 'Submit Another Report'}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-card border border-white/5 rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8 border-b border-white/5 bg-surface/30">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2 mb-2">
            <Bug className="w-6 h-6 text-white" />
            {t('feedbackPage.title') || 'Submit Technical Feedback'}
          </h2>
          <p className="text-sm text-slate-400">
            {t('feedbackPage.description') || 'Use this form to report bugs, errors, or suggest UI/UX improvements.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" />
              {t('feedbackPage.titleLabel') || 'Title'}
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-surface text-white focus:outline-none focus:border-primary transition"
              placeholder={t('feedbackPage.titlePlaceholder') || "E.g., Button not working on dashboard"}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-slate-400" />
                {t('feedbackPage.category') || 'Category'}
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-surface text-white focus:outline-none focus:border-primary transition appearance-none"
              >
                <option value="" disabled>{t('feedbackPage.categoryPlaceholder') || 'Select category...'}</option>
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-white">
                {t('feedbackPage.priority') || 'Priority'}
              </label>
              <select
                name="priority"
                required
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-surface text-white focus:outline-none focus:border-primary transition appearance-none"
              >
                <option value="" disabled>{t('feedbackPage.priorityPlaceholder') || 'Select priority...'}</option>
                {PRIORITY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-white">
              {t('feedbackPage.details') || 'Description'}
            </label>
            <textarea
              name="description"
              required
              value={formData.description}
              onChange={handleInputChange}
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-surface text-white focus:outline-none focus:border-primary transition resize-none"
              placeholder={t('feedbackPage.detailsPlaceholder') || "Please provide steps to reproduce the issue..."}
            />
          </div>

          <div className="pt-6 border-t border-white/5">
            <div className="flex items-start justify-between p-4 border border-white/10 rounded-xl bg-surface/30 mb-4">
              <div className="space-y-1 pr-4">
                <label className="text-sm font-bold text-white">
                  {t('feedbackPage.hasScreenshots') || 'Do you have screenshots or screen recordings?'}
                </label>
                <p className="text-xs text-slate-400">
                  {t('feedbackPage.screenshotsHint') || 'Visual evidence helps us resolve issues much faster.'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formData.hasDocuments}
                      onChange={(e) => setFormData(prev => ({ ...prev, hasDocuments: e.target.checked }))}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${formData.hasDocuments ? 'bg-primary' : 'bg-slate-700'}`}></div>
                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.hasDocuments ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                  <span className="ml-3 text-sm font-bold text-white">
                    {formData.hasDocuments ? (t('feedbackPage.yes') || "Yes") : (t('feedbackPage.no') || "No")}
                  </span>
                </label>
              </div>
            </div>

            {formData.hasDocuments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4 overflow-hidden"
              >
                <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center bg-surface/50 hover:bg-surface transition-colors">
                  <div className="mx-auto w-12 h-12 bg-white/5 text-white rounded-full flex items-center justify-center mb-3">
                    <Paperclip className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-white mb-1">
                    {t('feedbackPage.uploadHint') || 'Upload screenshots or videos'}
                  </p>
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-primary text-background text-sm font-bold rounded-lg hover:bg-primary/90 transition-opacity mt-4">
                    {t('feedbackPage.browseFiles') || 'Browse Files'}
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </label>
                </div>

                {formData.documents.length > 0 && (
                  <div className="space-y-3 mt-4">
                    {formData.documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-surface border border-white/10 rounded-xl">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FileText className="w-5 h-5 text-slate-300 shrink-0" />
                          <span className="text-sm text-white truncate font-bold">
                            {doc.file.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0 font-bold text-xs cursor-pointer"
                        >
                          {t('feedbackPage.remove') || 'Remove'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          <div className="pt-4 border-t border-white/5 mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl text-background font-bold text-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${isSubmitting
                  ? "bg-slate-500 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/10"
                }`}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-background" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('feedbackPage.submitting') || 'Submitting...'}
                </span>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  {t('feedbackPage.submit') || 'Submit Feedback'}
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
