import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { vaultApi } from '@/lib/vault-api';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://orr-backend-105825824472.asia-southeast2.run.app';

// 401 Interceptor Wrapper
async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, init);
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('auth-token');
      localStorage.removeItem('refresh_token');
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signin')) {
        window.location.href = '/signin?expired=true';
      }
    }
  }
  return response;
}

export type OpportunityStage = 
  | 'INVITED'
  | 'VIEWED'
  | 'INTERESTED'
  | 'CLARIFICATION_REQUESTED'
  | 'DECLINED'
  | 'SHORTLISTED'
  | 'NOT_SHORTLISTED'
  | 'SELECTED'
  | 'ASSIGNMENT_OFFERED'
  | 'ASSIGNMENT_ACCEPTED'
  | 'ASSIGNMENT_DECLINED'
  | 'CONFLICT_REVIEW_REQUIRED'
  | 'ACCESS_ACTIVATION'
  | 'EXPRESSION_OF_INTEREST'
  | 'NOT_RESPONDED'
  | 'SELECTION'
  | 'ASSIGNMENT_ACCEPTANCE';


// Types
export interface ProfileData {
  // 1. Personal Information
  photoUrl?: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  jobTitle: string;
  headline: string;
  bio: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  country: string;
  languages: string[];
  timezone: string;
  email: string;
  phone: string;
  website: string;
  socialLinks: {
    linkedIn: string;
    twitter: string;
    facebook: string;
    portfolio: string;
  };

  // 2. Professional Information
  consultantCategory: string;
  primarySpecialization: string;
  secondarySpecializations: string[];
  yearsOfExperience: number | '';
  currentCompany: string;
  previousCompanies: string[];
  industryExpertise: string[];
  certifications: string[];
  licenses: string[];
  educationalQualifications: string[];
  professionalMemberships: string[];

  // 3. Skills & Expertise
  skills: { name: string; level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' }[];
  expertiseTags: string[];
  areasOfSpecialization: string[];
  consultingMethodologies: string[];

  // 4. Availability Management
  availability: {
    workingDays: string[];
    workingHours: { start: string; end: string };
    calendarIntegration: boolean;
    vacationDates: string[];
    unavailableDates: string[];
    publicHolidays: boolean;
    autoBookingRules: boolean;
    bufferTimeMinutes: number;
    maxDailyConsultations: number | '';
    consultationDurationOptions: number[];
  };
  
  // 5. System Fields
  profileStatus: 'Draft' | 'Submitted' | 'Pending Review' | 'Approved' | 'Needs Clarification' | 'Rejected' | 'Suspended' | 'Archived';
}
export interface JobOffer {
  id: string;
  title: string;
  industry: string;
  clientSector: string;
  rate: string;
  duration: string;
  description: string;
  scope: string[];
  deliverables: string[];
}

export interface Job extends JobOffer {
  acceptedAt: string;
  status: 'ACTIVE' | 'COMPLETED';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  billingPeriod: string;
  hours: number;
  rate: number;
  amount: number;
  taskTitle: string;
  submittedAt: string;
  fileName: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'PROCESSING' | 'PAID';
  notes?: string;
  reviewerNotes?: string;
}

export interface Task {
  id: string;
  dbId?: number;
  jobId: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'COMPLETED' | 'BLOCKED' | 'NOT_STARTED';
  deliverableSubmitted?: {
    submittedAt: string;
    notes: string;
    fileName: string;
  };
}

export interface TrackChange {
  id: string;
  type: 'INSERTION' | 'DELETION';
  text: string;
  author: string;
  timestamp: string;
  line: number;
}

export interface VaultDocument {
  id: string;
  title: string;
  category: 'LEGAL' | 'FINANCIAL' | 'OPERATIONAL' | 'TECHNICAL';
  content: string;
  type: 'doc' | 'sheet' | 'slide' | 'folder' | 'file';
  jobId?: string;
  status: 'LOCKED' | 'UNLOCKED';
  lastModified: string;
  trackChanges: TrackChange[];
  parentId?: string | null;
  fileMeta?: {
    size: number;
    mimeType: string;
  };
}

export interface Message {
  id: string;
  sender: 'CONSULTANT' | 'PROJECT_MANAGER';
  text: string;
  timestamp: string;
  attachment?: {
    name: string;
    url?: string;
    type: string;
  };
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  timeSlot: string;
  joinLink: string;
  status: 'UPCOMING' | 'COMPLETED';
}

export interface AppNotification {
  id: string;
  title: string;
  text: string;
  timestamp: string;
  read: boolean;
  type: 'JOB' | 'PAYMENT' | 'CHAT' | 'DOCUMENT' | 'SYSTEM';
}

interface ConsultantState {
  // Authentication & 2FA Gate
  language: 'en' | 'it';
  setLanguage: (lang: 'en' | 'it') => void;
  isAuthenticated: boolean;
  is2faPending: boolean;
  loginError: string | null;
  loginConsultant: (email: string, password: string) => Promise<boolean>;
  registerConsultant: (email: string, password: string) => Promise<{success: boolean, message?: string, consultantNumber?: string}>;
  verifyConsultant: (email: string, consultantNumber: string) => Promise<{success: boolean, message?: string}>;
  googleLogin: (credential: string) => Promise<boolean>;
  verify2fa: (code: string) => Promise<boolean>;
  resend2fa: (emailArg?: string) => Promise<boolean>;
  logoutConsultant: () => void;
  forgotPassword: (email: string) => Promise<{success: boolean, message?: string}>;
  resetPassword: (uid: string, token: string, new_password: string) => Promise<{success: boolean, message?: string}>;

  // Profile
  profileData: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;

  // Onboarding
  onboardingCompleted: boolean;
  onboardingData: {
    industry: string;
    secondaryIndustries: string[];
    skills: string[];
    skillProficiencies: Record<string, string>;
    skillYearsExperience: Record<string, string>;
    customSkills: { name: string; status: 'Pending Review' | 'Approved' | 'Rejected' | 'Merged' }[];
    itCapabilities: string[];
    itConfidence: string;
    softwareExperience: string[];
    aiFamiliarity: string;
    dataHandling: string[];
    professionalSummary: string;
    sectorExperience: string[];
    professionalEvidence: string;
    cvFile: File | null;
    portfolioUrl: string;
    isAvailable: boolean;
    weeklyCapacity: string;
    preferredRoles: string[];
    workModes: string[];
    geoCoverage: string;
    languages: string[];
    hourlyRate: string;
    currency: string;
    engagementTypes: string[];
    rightToWork: boolean;
    conflictOfInterest: boolean;
    conflictDetails: string;
    dataProtection: boolean;
    timezone: string;
    ndaAccepted: boolean;
  } | null;
  completeOnboarding: (
    industry: string, 
    secondaryIndustries: string[], 
    skills: string[], 
    skillProficiencies: Record<string, string>,
    skillYearsExperience: Record<string, string>,
    customSkills: { name: string; status: 'Pending Review' | 'Approved' | 'Rejected' | 'Merged' }[], 
    itCapabilities: string[],
    itConfidence: string,
    softwareExperience: string[], 
    aiFamiliarity: string,
    dataHandling: string[],
    professionalSummary: string,
    sectorExperience: string[],
    professionalEvidence: string,
    cvFile: File | null,
    portfolioUrl: string,
    isAvailable: boolean,
    weeklyCapacity: string,
    preferredRoles: string[],
    workModes: string[],
    geoCoverage: string,
    languages: string[],
    hourlyRate: string,
    currency: string,
    engagementTypes: string[],
    rightToWork: boolean,
    conflictOfInterest: boolean,
    conflictDetails: string,
    dataProtection: boolean,
    timezone: string, 
    ndaAccepted: boolean, 
    consultantId?: string, 
    fullName?: string, 
    displayName?: string, 
    phone?: string, 
    country?: string, 
    jobTitle?: string
  ) => void;

  // Jobs
  availableJobs: JobOffer[];
  interestedJobs: JobOffer[];
  compliancePendingJobs: JobOffer[];
  activeJobs: Job[];
  expressInterest: (jobId: string) => void;
  confirmCompliance: (jobId: string) => void;
  rejectJob: (jobId: string) => void;

  // Wallet & Invoices
  walletBalance: {
    available: number;
    pending: number;
    totalEarned: number;
  };
  invoices: Invoice[];
  submitInvoice: (invoice: Omit<Invoice, 'id' | 'status' | 'submittedAt'>) => void;
  withdrawFunds: (amount: number, method: string) => void;

  // Tasks
  tasks: Task[];
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  submitTaskDeliverable: (taskId: string, notes: string, file: any) => Promise<void>;

  // Document Vault
  documents: VaultDocument[];
  addDocumentTrackChange: (docId: string, type: 'INSERTION' | 'DELETION', text: string, line: number) => void;
  resetDocumentChanges: (docId: string) => void;
  updateDocumentContent: (docId: string, newTitle: string, newContent: string) => void;
  createFolder: (title: string, parentId: string | null) => Promise<void>;
  createDocument: (type: 'doc' | 'sheet' | 'slide', title: string, parentId: string | null) => Promise<void>;
  uploadFileToVault: (fileObj: any, parentId: string | null) => Promise<void>;

  // Chat
  messages: Message[];
  fetchMessages: (contactId?: string, since?: string) => Promise<void>;
  sendChatMessage: (text: string, attachment?: any, contactId?: string | null) => Promise<void>;
  pmDirectory: any[];
  fetchPmDirectory: () => Promise<void>;
  clearMessages: () => void;

  // Meetings
  meetings: Meeting[];
  fetchMeetings: () => Promise<void>;
  bookMeeting: (title: string, date: string, timeSlot: string, pmId?: string) => Promise<void>;

  // Notifications
  notifications: AppNotification[];
  addNotification: (title: string, text: string, type: AppNotification['type']) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Profile/Other fetch actions
  fetchProfile: () => Promise<void>;
  fetchJobs: () => Promise<void>;
  fetchTasks: () => Promise<void>;
  fetchInvoices: () => void;
  fetchDocuments: () => Promise<void>;
  fetchNotifications: () => Promise<void>;

  // Opportunities and other fields
  isRegistered: boolean;
  isOnboarded: boolean;
  opportunities: Opportunity[];
  setRegistered: (status: boolean) => void;
  setOnboarded: (status: boolean) => void;
  fetchOpportunities: () => Promise<void>;
  respondToOpportunity: (id: string, payload: any) => Promise<void>;
  updateOpportunityStage: (id: string, stage: OpportunityStage, status: string) => void;
}

// Re-seeded Seed Data with real ORR Solutions parameters
const INITIAL_JOB_OFFERS: JobOffer[] = [];

const INITIAL_TASKS: Task[] = [];

const INITIAL_INVOICES: Invoice[] = [];

const INITIAL_DOCUMENTS: VaultDocument[] = [];

const INITIAL_MESSAGES: Message[] = [];

const INITIAL_MEETINGS: Meeting[] = [];

const INITIAL_NOTIFICATIONS: AppNotification[] = [];

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
  status?: string;
  statusText?: string;
  dateAssigned: string;
  responseTimestamp?: string;
  lastUpdated?: string;
  createdBy?: string;
  sentTo?: string[];
  summaryVersion?: string;
}


// Zustand Store implementation
export const useConsultantStore = create<ConsultantState>()(
  persist(
    (set, get) => ({
      isRegistered: false,
      isOnboarded: false,
      opportunities: [],
      setRegistered: (status) => set({ isRegistered: status }),
      setOnboarded: (status) => set({ isOnboarded: status }),
      updateOpportunityStage: (id, stage, status) => set((state) => ({
        opportunities: state.opportunities.map(opp => 
          opp.id === id ? { 
            ...opp, 
            stage, 
            status,
            ...(stage !== 'EXPRESSION_OF_INTEREST' && !opp.responseTimestamp ? { responseTimestamp: new Date().toISOString() } : {}),
            lastUpdated: new Date().toISOString()
          } : opp
        )
      })),

      // Language State
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
      
      registerConsultant: async (email: string, password: string) => {
        try {
          const res = await apiFetch(`${API_BASE}/api/v1/consultants/auth/register/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
          });
          const data = await res.json();
          if (res.ok) {
            return { success: true, message: data.message, consultantNumber: data.data?.consultant_number };
          } else {
            return { success: false, message: data.message || "Registration failed" };
          }
        } catch (e: any) {
          return { success: false, message: e.message || "Network error" };
        }
      },
      verifyConsultant: async (email: string, consultantNumber: string) => {
        try {
          const res = await apiFetch(`${API_BASE}/api/v1/consultants/auth/verify/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, consultant_number: consultantNumber })
          });
          const data = await res.json();
          if (res.ok) {
            return { success: true, message: data.message };
          } else {
            return { success: false, message: data.message || "Verification failed" };
          }
        } catch (e: any) {
          return { success: false, message: e.message || "Network error" };
        }
      },
      forgotPassword: async (email: string) => {
        try {
          const res = await apiFetch(`${API_BASE}/api/auth/forget-password/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, portal: "consultant" })
          });
          const data = await res.json();
          if (res.ok) {
            return { success: true, message: data.message || "Password reset email sent." };
          } else {
            return { success: false, message: data.message || data.error || "Failed to send reset email." };
          }
        } catch (e: any) {
          return { success: false, message: e.message || "Network error" };
        }
      },
      resetPassword: async (uid: string, token: string, new_password: string) => {
        try {
          const res = await apiFetch(`${API_BASE}/api/auth/verify-reset-password/${uid}/${token}/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid, token, new_password })
          });
          const data = await res.json();
          if (res.ok) {
            return { success: true, message: data.message || "Password reset successfully." };
          } else {
            return { success: false, message: data.message || data.error || "Failed to reset password." };
          }
        } catch (e: any) {
          return { success: false, message: e.message || "Network error" };
        }
      },

  // Authentication & 2FA State
  isAuthenticated: false,
  is2faPending: false,
  loginError: null,
  googleLogin: async (credential) => {
    set({ loginError: null });
    try {
      const response = await apiFetch(`${API_BASE}/api/auth/google-login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential, portal: "consultant" })
      });
      const data = await response.json();
      if (response.ok) {
        if (data.data.user.user_type === 'consultant') {
          const status = data.data.user.status || 'PENDING_REVIEW';
          const onboardingDone = !['ACCOUNT_CREATED', 'EMAIL_VERIFIED', 'DRAFT'].includes(status);
          
          let frontendStatus: ProfileData['profileStatus'] = 'Draft';
          if (status === 'PENDING_REVIEW') frontendStatus = 'Pending Review';
          if (status === 'APPROVED') frontendStatus = 'Approved';
          if (status === 'NEEDS_CLARIFICATION') frontendStatus = 'Needs Clarification';
          if (status === 'REJECTED') frontendStatus = 'Rejected';
          if (status === 'SUSPENDED') frontendStatus = 'Suspended';
          if (status === 'ARCHIVED') frontendStatus = 'Archived';

          set({
            isAuthenticated: true,
            is2faPending: false,
            onboardingCompleted: onboardingDone,
            profileData: {
              ...get().profileData,
              profileStatus: frontendStatus,
            }
          });

          if (data.data.user.consultant_number) {
            sessionStorage.setItem("consultant_number", data.data.user.consultant_number);
            get().fetchProfile();
          }

          if (data.data.access) {
            localStorage.setItem("access_token", data.data.access);
          }
          return true;
        } else {
          set({ loginError: 'Account is not registered as a specialist.' });
          return false;
        }
      } else {
        set({ loginError: data.message || 'Google authentication failed.' });
        return false;
      }
    } catch (e) {
      set({ loginError: 'Network error communicating with authentication server.' });
      return false;
    }
  },
  loginConsultant: async (email, password) => {
    set({ loginError: null });
    try {
      const response = await apiFetch(`${API_BASE}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, portal: 'consultant' })
      });
      const data = await response.json();
      if (response.ok) {
        if (data.data.user.user_type === 'consultant') {
          // If status is not ACCOUNT_CREATED or EMAIL_VERIFIED, they have completed onboarding
          const status = data.data.user.status;
          const onboardingDone = !['ACCOUNT_CREATED', 'EMAIL_VERIFIED', 'DRAFT'].includes(status);
          
          // Map backend status to frontend display strings
          let frontendStatus: ProfileData['profileStatus'] = 'Draft';
          if (status === 'PENDING_REVIEW') frontendStatus = 'Pending Review';
          if (status === 'APPROVED') frontendStatus = 'Approved';
          if (status === 'NEEDS_CLARIFICATION') frontendStatus = 'Needs Clarification';
          if (status === 'REJECTED') frontendStatus = 'Rejected';
          if (status === 'SUSPENDED') frontendStatus = 'Suspended';
          if (status === 'ARCHIVED') frontendStatus = 'Archived';

          if (data.data.mfa_required) {
            set({
              is2faPending: true,
              loginError: null
            });
            // Temporarily store token for 2FA validation
            if (data.data.access) {
              sessionStorage.setItem("temp_access_token", data.data.access);
              sessionStorage.setItem("temp_user_data", JSON.stringify(data.data.user));
            }
            return true;
          }

          set({
            isAuthenticated: true,
            is2faPending: false,
            onboardingCompleted: onboardingDone,
            profileData: {
              ...get().profileData,
              profileStatus: frontendStatus,
            }
          });

          // Save consultant number so the onboarding form can use it to submit
          if (data.data.user.consultant_number) {
            sessionStorage.setItem("consultant_number", data.data.user.consultant_number);
            get().fetchProfile();
          }

          if (data.data.access) {
            localStorage.setItem("access_token", data.data.access);
          }

          return true;
        } else {
          set({ loginError: 'Account is not registered as a specialist.' });
          return false;
        }
      } else {
        set({ loginError: data.message || 'Invalid specialist credentials.' });
        return false;
      }
    } catch (e) {
      set({ loginError: 'Network error communicating with authentication server.' });
      return false;
    }
  },
  verify2fa: async (code) => {
    try {
      const tempToken = sessionStorage.getItem("temp_access_token");
      const userDataStr = sessionStorage.getItem("temp_user_data");
      const user = userDataStr ? JSON.parse(userDataStr) : null;
      const email = user?.email || sessionStorage.getItem("verify_email") || "";

      if (!tempToken && !email) {
        set({ loginError: 'Session expired. Please sign in again.' });
        return false;
      }
      const response = await fetch(`${API_BASE}/api/auth/mfa/verify/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(tempToken ? { "Authorization": `Bearer ${tempToken}` } : {})
        },
        body: JSON.stringify({ email, code })
      });
      const data = await response.json();

      if (response.ok && (data.success !== false)) {
        const status = user?.status || 'APPROVED';
        const onboardingDone = !['ACCOUNT_CREATED', 'EMAIL_VERIFIED', 'DRAFT'].includes(status);
        
        let frontendStatus: ProfileData['profileStatus'] = 'Draft';
        if (status === 'PENDING_REVIEW') frontendStatus = 'Pending Review';
        if (status === 'APPROVED') frontendStatus = 'Approved';
        
        set({ 
          isAuthenticated: true, 
          is2faPending: false,
          onboardingCompleted: onboardingDone,
          loginError: null,
          profileData: {
            ...get().profileData,
            profileStatus: frontendStatus,
          }
        });
        
        if (user?.consultant_number) {
          sessionStorage.setItem("consultant_number", user.consultant_number);
          get().fetchProfile();
        }
        
        localStorage.setItem("access_token", data.access || tempToken || "");
        sessionStorage.removeItem("temp_access_token");
        sessionStorage.removeItem("temp_user_data");

        get().addNotification(
          'Specialist Authorization Granted',
          'Secure session established. Two-factor clearance approved.',
          'SYSTEM'
        );
        return true;
      } else {
        set({ loginError: data.error || data.message || 'Security validation code incorrect. Please verify and try again.' });
        return false;
      }
    } catch (e) {
      set({ loginError: 'Network error communicating with authentication server.' });
      return false;
    }
  },

  resend2fa: async (emailArg) => {
    try {
      const userDataStr = sessionStorage.getItem("temp_user_data");
      const user = userDataStr ? JSON.parse(userDataStr) : null;
      const email = emailArg || user?.email || sessionStorage.getItem("verify_email");
      if (!email) {
        set({ loginError: 'Email not found. Please sign in again.' });
        return false;
      }
      const response = await fetch(`${API_BASE}/api/auth/mfa/resend/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (response.ok && data.success !== false) {
        set({ loginError: null });
        get().addNotification(
          'Verification Code Resent',
          `A new verification code has been dispatched to ${email}.`,
          'SYSTEM'
        );
        return true;
      } else {
        set({ loginError: data.error || data.message || 'Failed to resend verification code.' });
        return false;
      }
    } catch (e) {
      set({ loginError: 'Network error communicating with authentication server.' });
      return false;
    }
  },

  fetchProfile: async () => {
    try {
      const cNum = sessionStorage.getItem('consultant_number');
      if (!cNum) return;
      
      const token = localStorage.getItem('access_token');
      const response = await apiFetch(`${API_BASE}/api/v1/consultants/${cNum}/profile/`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      
      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          const p = json.data;
          const status = (p.profileStatus || p.status || '').toUpperCase();
          const uncompletedStatuses = ['ACCOUNT_CREATED', 'EMAIL_VERIFIED', 'DRAFT', 'ACCOUNT CREATED', 'EMAIL VERIFIED'];
          const isDoneByStatus = status ? !uncompletedStatuses.includes(status) : false;
          const isDoneByFlag = Boolean(p.is_onboarding_complete || p.onboarding_completed || p.onboardingCompleted);

          let frontendStatus: ProfileData['profileStatus'] = p.profileStatus || 'Draft';
          if (status === 'PENDING_REVIEW' || status === 'PENDING REVIEW' || status === 'PENDING') frontendStatus = 'Pending Review';
          if (status === 'APPROVED') frontendStatus = 'Approved';
          if (status === 'NEEDS_CLARIFICATION' || status === 'NEEDS CLARIFICATION') frontendStatus = 'Needs Clarification';
          if (status === 'REJECTED') frontendStatus = 'Rejected';
          if (status === 'SUSPENDED') frontendStatus = 'Suspended';
          if (status === 'ARCHIVED') frontendStatus = 'Archived';

          set(state => ({
            onboardingCompleted: state.onboardingCompleted || isDoneByStatus || isDoneByFlag,
            profileData: {
              ...state.profileData,
              firstName: p.firstName || state.profileData.firstName,
              lastName: p.lastName || state.profileData.lastName,
              displayName: p.displayName || state.profileData.displayName,
              email: p.email || state.profileData.email,
              phone: p.phone || state.profileData.phone,
              country: p.country || state.profileData.country,
              timezone: p.timezone || state.profileData.timezone,
              jobTitle: p.jobTitle || state.profileData.jobTitle,
              profileStatus: frontendStatus,
            }
          }));
        }
      }
    } catch (e) {
      console.error('Failed to fetch profile', e);
    }
  },
  fetchJobs: async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await apiFetch(`${API_BASE}/pm/v1/consultant/assignments/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          const arr = Array.isArray(json.data) ? json.data : (json.data.data || []);
          const mappedJobs = arr.map((asg: any) => ({
            id: String(asg.assignment_id || asg.id),
            title: asg.project_title || 'Active Project',
            industry: 'Consulting',
            clientSector: 'Confidential',
            rate: asg.assignment_budget ? `€${asg.assignment_budget}` : 'TBD',
            duration: 'TBD',
            description: asg.invitation_message || 'Active Project Workspace',
            scope: [],
            deliverables: [],
            acceptedAt: asg.access_activation_date || asg.acceptance_timestamp || new Date().toISOString(),
            status: 'ACTIVE'
          }));
          set({ activeJobs: mappedJobs });
        }
      }
    } catch (err) {
      console.error('Failed to fetch active jobs:', err);
    }
  },
  fetchTasks: async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await apiFetch(`${API_BASE}/pm/v1/consultant/tasks/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const json = await response.json();
        if (json.success && json.data) {
          const arr = Array.isArray(json.data) ? json.data : (json.data.data || []);
          const mappedTasks = arr.map((t: any) => ({
            id: String(t.task_id || t.id),
            dbId: t.id,
            jobId: String(t.project), // Map project to job ID logic (or we can just use ID)
            title: t.title,
            description: t.description,
            dueDate: t.due_date || new Date().toISOString(),
            priority: t.priority?.toUpperCase() || 'MEDIUM',
            status: t.status === 'completed' ? 'COMPLETED' : (t.status === 'submitted_for_review' || t.status === 'revision_required') ? 'UNDER_REVIEW' : t.status === 'in_progress' ? 'IN_PROGRESS' : t.status === 'blocked' ? 'BLOCKED' : 'ASSIGNED'
          }));
          set({ tasks: mappedTasks });
        }
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  },
  fetchInvoices: async () => {
    try {
      const token = localStorage.getItem('access_token');
      const cNum = sessionStorage.getItem('consultant_number');
      const response = await apiFetch(`${API_BASE}/api/v1/consultants/invoices/?consultant__consultant_number=${cNum}`, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (!response.ok) throw new Error('Failed to fetch invoices');
      const invoicesRaw = await response.json();
      const invoicesData = invoicesRaw.data || invoicesRaw.results || (Array.isArray(invoicesRaw) ? invoicesRaw : []);
      
      const mappedInvoices = invoicesData.map((inv: any) => ({
        id: inv.id.toString(),
        invoiceNumber: inv.invoice_number,
        billingPeriod: inv.billing_period,
        hours: parseFloat(inv.hours),
        rate: parseFloat(inv.rate),
        amount: parseFloat(inv.amount),
        taskTitle: inv.task_title,
        submittedAt: inv.submitted_at,
        fileName: inv.file_name,
        status: inv.status,
        reviewerNotes: inv.reviewer_notes
      }));
      
      // Calculate balances based on status
      let pending = 0;
      let available = 0;
      let totalEarned = 0;
      
      mappedInvoices.forEach((inv: Invoice) => {
        if (inv.status === 'PAID') {
          available += inv.amount;
          totalEarned += inv.amount;
        } else {
          pending += inv.amount;
        }
      });
      
      set(state => ({
        invoices: mappedInvoices,
        walletBalance: {
          ...state.walletBalance,
          available,
          pending,
          totalEarned
        }
      }));
    } catch (e) {
      console.error('Failed to fetch consultant invoices:', e);
    }
  },
    fetchDocuments: async () => {
    try {
      const cNum = sessionStorage.getItem('consultant_number');
      const token = localStorage.getItem('access_token');
      if (!cNum || !token) return;
      
      const res = await apiFetch(`${API_BASE}/api/v1/consultants/${cNum}/documents/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
        if (res.ok) {
          const json = await res.json();
          let arr = [];
          if (Array.isArray(json)) arr = json;
          else if (json && Array.isArray(json.data)) arr = json.data;
          else if (json && json.data && Array.isArray(json.data.data)) arr = json.data.data;
          else if (json && Array.isArray(json.results)) arr = json.results;
          
          if (arr.length >= 0) {
            const mapped = arr.map((d: any) => ({
            id: String(d.id),
            title: d.title,
            category: d.category,
            content: d.content,
            type: d.doc_type,
            status: d.status,
            lastModified: d.created_at,
            parentId: d.parent_id,
            trackChanges: [],
            fileMeta: d.doc_type === 'file' ? { size: d.file_size, mimeType: d.mime_type } : undefined
          }));
          set({ documents: mapped });
        }
      }
    } catch(e) { console.error('fetchDocs error', e); }
  },
    clearMessages: () => set({ messages: [] }),
    fetchMessages: async (contactId?: string, since?: string) => {
      try {
        const cNum = sessionStorage.getItem('consultant_number');
        const token = localStorage.getItem('access_token');
        if (!cNum || !token) return;
        
        let url = `${API_BASE}/api/v1/consultants/${cNum}/messages/`;
        let params = [];
        if (contactId && contactId !== 'pm') params.push(`pm_id=${contactId}`);
        if (since) params.push(`since=${since}`);
        if (params.length > 0) url += `?${params.join('&')}`;
        
        const res = await apiFetch(url, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          const arr = Array.isArray(json.data) ? json.data : (json.data.data || []);
          const mapped = arr.map((m: any) => ({
            id: String(m.id),
            text: m.text,
            sender: m.sender === 'CONSULTANT' ? 'CONSULTANT' : 'PROJECT_MANAGER',
            timestamp: m.created_at || new Date().toISOString(),
            status: 'sent',
            attachment: m.attachment_url ? { name: m.attachment_name || 'Attachment', url: m.attachment_url, type: 'file' } : undefined
          }));
            const sortedNew = mapped.sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
            set(state => {
              if (since) {
                const nonTempPrev = state.messages.filter(m => !String(m.id).startsWith('temp-'));
                const existingIds = new Set(nonTempPrev.map(m => m.id));
                const filteredNew = sortedNew.filter((m: any) => !existingIds.has(m.id));
                if (filteredNew.length === 0) return { messages: state.messages };
                return { messages: [...nonTempPrev, ...filteredNew] };
              }
              return { messages: sortedNew };
            });
          }
        }
    } catch(e) { console.error('fetchMessages error', e); }
  },

  fetchNotifications: async () => {
    try {
      const token = localStorage.getItem('access_token');
      const cNum = sessionStorage.getItem('consultant_number');
      if (!token || !cNum) return;
      const response = await apiFetch(`${API_BASE}/api/v1/consultants/${cNum}/notifications/`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        const payload = await response.json();
        let notifs = [];
        if (Array.isArray(payload)) notifs = payload;
        else if (payload && Array.isArray(payload.data)) notifs = payload.data;
        else if (payload && payload.data && Array.isArray(payload.data.data)) notifs = payload.data.data;
        else if (payload && Array.isArray(payload.results)) notifs = payload.results;
        
        const mappedNotifs = notifs.map((n: any) => ({
          id: String(n.id),
          title: n.title,
          text: n.text,
          timestamp: new Date(n.created_at || new Date()).toLocaleString(),
          read: n.is_read || false,
          type: n.notif_type === 'PAYMENT' ? 'success' : (n.notif_type === 'SYSTEM' ? 'info' : 'warning')
        }));
        set({ notifications: mappedNotifs });
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  },

  fetchOpportunities: async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await apiFetch(`${API_BASE}/pm/v1/opportunities/`, {
        headers: token ? { "Authorization": `Bearer ${token}` } : {}
      });
      if (response.ok) {
        const payload = await response.json();
        
        let opts = [];
        if (Array.isArray(payload)) {
          opts = payload;
        } else if (payload && Array.isArray(payload.data)) {
          opts = payload.data;
        } else if (payload && payload.data && Array.isArray(payload.data.data)) {
          opts = payload.data.data;
        } else if (payload && Array.isArray(payload.results)) {
          opts = payload.results;
        }
        
        const mappedOpts = opts.map((o: any) => ({
          id: String(o.id), // Use pk for API calls
          title: o.project_title || 'Untitled Opportunity',
          description: `Urgency: ${o.urgency || 'Normal'}\nService Category: ${o.service_category || 'N/A'}\nExternal: ${o.is_external_consultant ? 'Yes' : 'No'}`,
          serviceCategory: o.service_category,
          indicativeDeadline: o.deadline,
          stage: o.response_status?.toUpperCase() || 'EXPRESSION_OF_INTEREST',
          statusText: o.response_status?.replace(/_/g, ' ') || 'New',
          dateAssigned: o.created_at ? new Date(o.created_at).toLocaleDateString() : 'N/A',
        }));
        
        set({ opportunities: mappedOpts });
      }
    } catch (e) {
      console.error("Failed to fetch opportunities", e);
    }
  },

  respondToOpportunity: async (id: string, payload: any) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await apiFetch(`${API_BASE}/pm/v1/opportunities/${id}/respond/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to submit response');
      }
      get().fetchOpportunities(); // Refresh the list
    } catch (e) {
      console.error('Error responding:', e);
      throw e;
    }
  },

  logoutConsultant: () => {
    localStorage.removeItem("access_token");
    set({
      isAuthenticated: false,
      is2faPending: false,
      loginError: null,
      onboardingCompleted: false, // Reset onboarding state on logout for demo ease
      onboardingData: null,
      activeJobs: [],
      availableJobs: INITIAL_JOB_OFFERS,
      tasks: INITIAL_TASKS,
      invoices: INITIAL_INVOICES,
      documents: INITIAL_DOCUMENTS,
      messages: INITIAL_MESSAGES,
      meetings: INITIAL_MEETINGS,
      notifications: INITIAL_NOTIFICATIONS
    });
  },

  // Profile State
  profileData: {
    firstName: '',
    lastName: '',
    jobTitle: '',
    headline: '',
    bio: '',
    gender: '',
    dateOfBirth: '',
    nationality: '',
    country: '',
    languages: [],
    timezone: '',
    email: '',
    phone: '',
    website: '',
    socialLinks: {
      linkedIn: '',
      twitter: '',
      facebook: '',
      portfolio: '',
    },
    consultantCategory: '',
    primarySpecialization: '',
    secondarySpecializations: [],
    yearsOfExperience: '',
    currentCompany: '',
    previousCompanies: [],
    industryExpertise: [],
    certifications: [],
    licenses: [],
    educationalQualifications: [],
    professionalMemberships: [],
    skills: [],
    expertiseTags: [],
    areasOfSpecialization: [],
    consultingMethodologies: [],
    availability: {
      workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      workingHours: { start: '09:00', end: '17:00' },
      calendarIntegration: false,
      vacationDates: [],
      unavailableDates: [],
      publicHolidays: false,
      autoBookingRules: false,
      bufferTimeMinutes: 15,
      maxDailyConsultations: '',
      consultationDurationOptions: [30, 60],
    },
    profileStatus: 'Draft'
  },
  updateProfile: async (data) => {
    try {
      const cNum = sessionStorage.getItem('consultant_number');
      if (!cNum) return;
      
      const token = localStorage.getItem('access_token');
      const response = await apiFetch(`${API_BASE}/api/v1/consultants/${cNum}/profile/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(data)
      });
      
      if (response.ok) {
        const json = await response.json();
        if (json.success) {
          set(state => ({
            profileData: { ...state.profileData, ...data }
          }));
          get().addNotification(
            'Profile Updated',
            'Your specialist profile parameters have been successfully updated in the database.',
            'SYSTEM'
          );
        }
      } else {
        console.error('Failed to update profile:', await response.text());
      }
    } catch (e) {
      console.error('Failed to update profile network error:', e);
    }
  },

  // Onboarding State
  onboardingCompleted: false,
  onboardingData: null,
  completeOnboarding: async (industry, secondaryIndustries, skills, skillProficiencies, skillYearsExperience, customSkills, itCapabilities, itConfidence, softwareExperience, aiFamiliarity, dataHandling, professionalSummary, sectorExperience, professionalEvidence, cvFile, portfolioUrl, isAvailable, weeklyCapacity, preferredRoles, workModes, geoCoverage, languages, hourlyRate, currency, engagementTypes, rightToWork, conflictOfInterest, conflictDetails, dataProtection, timezone, ndaAccepted, consultantId, fullName, displayName, phone, country, jobTitle) => {
    try {
      const payload = {
        consultantId, fullName, displayName, phone, country, timezone, jobTitle,
        industry, secondaryIndustries, skills, skillProficiencies, skillYearsExperience, customSkills,
        itCapabilities, itConfidence, softwareExperience, aiFamiliarity, dataHandling,
        professionalSummary, sectorExperience, professionalEvidence, portfolioUrl,
        isAvailable, weeklyCapacity, preferredRoles, workModes, geoCoverage, languages,
        hourlyRate, currency, engagementTypes,
        rightToWork, ndaAccepted, conflictOfInterest, conflictDetails, dataProtection
      };

      const token = localStorage.getItem('access_token');
      const response = await apiFetch(`${API_BASE}/api/v1/consultants/${consultantId}/onboarding/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errorMsg = 'Failed to submit onboarding profile.';
        try {
          const json = await response.json();
          if (json.data) {
            const errors = [];
            for (const key of Object.keys(json.data)) {
              const errs = json.data[key];
              if (Array.isArray(errs)) {
                errors.push(`${key}: ${errs.join(', ')}`);
              } else {
                errors.push(`${key}: ${errs}`);
              }
            }
            if (errors.length > 0) errorMsg = errors.join(' | ');
          } else if (json.message) {
            errorMsg = json.message;
          }
        } catch (parseErr) {
          // If parsing JSON fails
        }
        throw new Error(errorMsg);
      }
    } catch (e) {
      console.error('Error during onboarding:', e);
      throw e;
    }

    set(state => ({
      onboardingCompleted: true,
      onboardingData: { industry, secondaryIndustries, skills, skillProficiencies, skillYearsExperience, customSkills, itCapabilities, itConfidence, softwareExperience, aiFamiliarity, dataHandling, professionalSummary, sectorExperience, professionalEvidence, cvFile, portfolioUrl, isAvailable, weeklyCapacity, preferredRoles, workModes, geoCoverage, languages, hourlyRate, currency, engagementTypes, rightToWork, conflictOfInterest, conflictDetails, dataProtection, timezone, ndaAccepted },
      profileData: {
        ...state.profileData,
        profileStatus: 'Pending Review',
        ...(fullName ? { firstName: fullName.split(' ')[0] || '', lastName: fullName.split(' ').slice(1).join(' ') || '' } : {}),
        ...(displayName ? { displayName } : {}),
        ...(phone ? { phone } : {}),
        ...(country ? { country } : {}),
        ...(jobTitle ? { jobTitle } : {})
      }
    }));
    
    // Add success notification
    get().addNotification(
      'Profile Onboarding Completed',
      `Welcome to ORR Solutions! Your capabilities in ${industry} have been archived. You are cleared to accept active job scopes.`,
      'SYSTEM'
    );
  },

  // Jobs
  availableJobs: INITIAL_JOB_OFFERS,
  interestedJobs: [],
  compliancePendingJobs: [],
  activeJobs: [],
  
  expressInterest: (jobId) => {
    const jobOffer = get().availableJobs.find(j => j.id === jobId);
    if (!jobOffer) return;

    set(state => ({
      interestedJobs: [...state.interestedJobs, jobOffer],
      availableJobs: state.availableJobs.filter(j => j.id !== jobId),
    }));

    get().addNotification(
      'Interest Registered',
      `You have expressed interest in ${jobOffer.title}. The Admin/PM will review your profile for consideration.`,
      'SYSTEM'
    );
  },

  confirmCompliance: (jobId) => {
    const jobOffer = get().compliancePendingJobs.find(j => j.id === jobId);
    if (!jobOffer) return;

    const acceptedJob: Job = {
      ...jobOffer,
      acceptedAt: new Date().toISOString(),
      status: 'ACTIVE'
    };

    set(state => ({
      activeJobs: [...state.activeJobs, acceptedJob],
      compliancePendingJobs: state.compliancePendingJobs.filter(j => j.id !== jobId),
      // Automatically add new tasks based on the job deliverables!
      tasks: [
        ...state.tasks,
        ...jobOffer.deliverables.map((del, idx) => ({
          id: `TASK-${jobId.split('-')[1]}-${idx + 1}`,
          jobId: jobId,
          title: `Submit: ${del}`,
          description: `Deliverable requirement: Complete comprehensive partner verification matching scope: ${jobOffer.scope[idx] || del}`,
          dueDate: new Date(Date.now() + (idx + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: idx === 0 ? 'HIGH' : 'MEDIUM' as Task['priority'],
          status: 'ASSIGNED' as Task['status']
        }))
      ]
    }));

    get().addNotification(
      'Compliance Confirmed',
      `You confirmed compliance for: ${jobOffer.title}. The PM will now activate your workspace access.`,
      'JOB'
    );

    setTimeout(() => {
      set(state => ({
        messages: [
          ...state.messages,
          {
            id: `MSG-${Date.now()}`,
            sender: 'PROJECT_MANAGER',
            text: `Perfect! Thank you for confirming compliance on the "${jobOffer.title}" contract. I am preparing your workspace access. Please review the assignment brief. Let me know if you want to book a kickoff sync!`,
            timestamp: new Date().toISOString()
          }
        ]
      }));
      get().addNotification(
        'New Message from PM',
        `PM sent project kickoff guidelines for ${jobOffer.title}.`,
        'CHAT'
      );
    }, 1500);
  },
  rejectJob: (jobId) => {
    set(state => ({
      availableJobs: state.availableJobs.filter(j => j.id !== jobId)
    }));
    get().addNotification(
      'Job Offer Declined',
      'The custom client tender broadcast has been dismissed.',
      'JOB'
    );
  },

  // Wallet
  walletBalance: {
    available: 0,
    pending: 0,
    totalEarned: 0
  },
  invoices: INITIAL_INVOICES,
  submitInvoice: async (invoiceData) => {
    try {
      const payload = {
        invoice_number: invoiceData.invoiceNumber,
        billing_period: invoiceData.billingPeriod,
        hours: invoiceData.hours,
        rate: invoiceData.rate,
        amount: invoiceData.amount,
        task_title: invoiceData.taskTitle,
        file_name: invoiceData.fileName,
        status: 'SUBMITTED',
      };
      
      const token = localStorage.getItem('access_token');
      const response = await apiFetch(`${API_BASE}/api/v1/consultants/invoices/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Invoice submission failed:', response.status, errorText);
        throw new Error(`Failed to submit invoice: ${response.status} ${errorText}`);
      }
      
      get().addNotification(
        'Invoice Submitted Successfully',
        `Invoice for ${invoiceData.taskTitle} (${invoiceData.invoiceNumber}) has been submitted for PM review.`,
        'PAYMENT'
      );
      
      // Re-fetch invoices to get the real created record
      get().fetchInvoices();
    } catch (e) {
      console.error('Failed to submit invoice:', e);
      get().addNotification(
        'Submission Failed',
        'Could not submit the invoice. Please try again later.',
        'SYSTEM'
      );
    }
  },
  withdrawFunds: (amount, method) => {
    set(state => ({
      walletBalance: {
        ...state.walletBalance,
        available: Math.max(0, state.walletBalance.available - amount)
      }
    }));
    get().addNotification(
      'Withdrawal Initiated',
      `A withdrawal of $${amount.toLocaleString()} via ${method} is being processed.`,
      'PAYMENT'
    );
  },

  // Tasks
  tasks: INITIAL_TASKS,
  updateTaskStatus: async (taskId, status) => {
    // Optimistic UI update
    set(state => ({
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, status } : t)
    }));

    try {
      const token = localStorage.getItem('access_token');
      const taskObj = get().tasks.find(t => t.id === taskId);
      const targetId = taskObj?.dbId || taskId;
      
      let backendStatus = 'not_started';
      if (status === 'IN_PROGRESS') backendStatus = 'in_progress';
      else if (status === 'UNDER_REVIEW') backendStatus = 'submitted_for_review';
      else if (status === 'COMPLETED') backendStatus = 'completed';
      else if (status === 'BLOCKED') backendStatus = 'blocked';

      const response = await apiFetch(`${API_BASE}/pm/v1/tasks/${targetId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status: backendStatus })
      });
      
      if (!response.ok) {
        console.error("Failed to update task status on backend");
      }
    } catch (e) {
      console.error("Error updating task status", e);
    }
  },  submitTaskDeliverable: async (taskId, notes, file) => {
    // Optimistic update
    set(state => ({
      tasks: state.tasks.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            status: 'UNDER_REVIEW',
            deliverableSubmitted: {
              submittedAt: new Date().toISOString(),
              notes,
              fileName: file?.name || 'Deliverable'
            }
          };
        }
        return t;
      })
    }));

    try {
      const token = localStorage.getItem('access_token');
      const taskObj = get().tasks.find(t => t.id === taskId);
      const targetId = taskObj?.dbId || taskId;
      
      const formData = new FormData();
      formData.append('notes', notes);
      if (file) {
        formData.append('deliverable_file', file);
      }

      const response = await apiFetch(`${API_BASE}/pm/v1/tasks/${targetId}/submit-review/`, {
        method: 'POST',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: formData
      });
      
      if (!response.ok) {
        console.error("Failed to submit deliverable to backend");
      }
    } catch (e) {
      console.error("Failed to submit task deliverable", e);
    }

    const taskObj = get().tasks.find(t => t.id === taskId);

    get().addNotification(
      'Deliverable Package Submitted',
      `Deliverable archive for "${taskObj?.title || taskId}" has been uploaded.`,
      'SYSTEM'
    );
  },

  // Document Vault & Track Changes Simulation
  documents: INITIAL_DOCUMENTS,
  addDocumentTrackChange: (docId, type, text, line) => {
    set(state => ({
      documents: state.documents.map(d => 
        d.id === docId ? { 
          ...d, 
          trackChanges: [...d.trackChanges, { id: Math.random().toString(), type, text, line, timestamp: new Date().toLocaleTimeString(), author: 'Consultant Partner' }] 
        } : d
      )
    }));
  },
  resetDocumentChanges: (docId) => {
    set(state => ({
      documents: state.documents.map(d => d.id === docId ? { ...d, trackChanges: [] } : d)
    }));
  },
  updateDocumentContent: (docId, newTitle, newContent) => {
    set(state => ({
      documents: state.documents.map(d => 
        d.id === docId ? { 
          ...d, 
          title: newTitle, 
          content: newContent, 
          lastModified: new Date().toISOString() 
        } : d
      )
    }));
  },
  createFolder: async (title, parentId) => {
    try {
      const cNum = sessionStorage.getItem('consultant_number');
      const token = localStorage.getItem('access_token');
      if (cNum && token) {
        const res = await apiFetch(`${API_BASE}/api/v1/consultants/${cNum}/documents/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({
            title,
            doc_type: 'folder',
            category: 'OPERATIONAL',
            content: '',
            parent_id: parentId || null
          })
        });
        if (res.ok) {
          await get().fetchDocuments();
          return;
        }
      }
    } catch(e) { console.error('createFolder error', e); }
    set(state => ({
      documents: [
        {
          id: `fld-${Date.now()}`,
          title,
          category: 'OPERATIONAL',
          content: '',
          type: 'folder',
          status: 'UNLOCKED',
          lastModified: new Date().toISOString(),
          trackChanges: [],
          parentId
        },
        ...state.documents
      ]
    }));
  },
  createDocument: async (type, title, parentId) => {
    try {
      const cNum = sessionStorage.getItem('consultant_number');
      const token = localStorage.getItem('access_token');
      if (!cNum || !token) return;
      
      const content = type === 'sheet' ? '[{"name":"Sheet1","data":[[]]}]' : '';
      const res = await apiFetch(`${API_BASE}/api/v1/consultants/${cNum}/documents/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          title,
          doc_type: type,
          category: 'TECHNICAL',
          content,
          parent_id: parentId || null
        })
      });
      if (res.ok) {
        get().fetchDocuments();
      }
    } catch(e) { console.error('createDoc error', e); }
  },
  uploadFileToVault: async (fileObj, parentId) => {
    try {
      const cNum = sessionStorage.getItem('consultant_number');
      const token = localStorage.getItem('access_token');
      if (!cNum || !token) return;
      
      const res = await apiFetch(`${API_BASE}/api/v1/consultants/${cNum}/documents/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          title: fileObj.name,
          doc_type: 'file',
          category: 'OPERATIONAL',
          content: (fileObj as any).content || '', // Base64 content from file read
          parent_id: parentId || null,
          file_size: fileObj.size,
          mime_type: fileObj.type
        })
      });
      if (res.ok) {
        get().fetchDocuments();
      }
    } catch(e) { console.error('uploadFile error', e); }
  },

  // Chat Secure Messaging
  messages: INITIAL_MESSAGES,
  sendChatMessage: async (text, attachment, contactId = null) => {
    // Optimistic Update
    const tempId = `msg-${Date.now()}`;
    set(state => ({
      messages: [
        ...state.messages,
        { id: tempId, text, sender: 'CONSULTANT', timestamp: new Date().toISOString(), attachment }
      ]
    }));
    
    try {
      const cNum = sessionStorage.getItem('consultant_number');
      const token = localStorage.getItem('access_token');
      if (!cNum || !token) return;
      
      const res = await apiFetch(`${API_BASE}/api/v1/consultants/${cNum}/messages/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          text,
          consultant: cNum,
          pm: (contactId && contactId !== 'pm' && contactId !== 'admin') ? parseInt(String(contactId), 10) : null,
          sender: 'CONSULTANT',
          attachment_name: attachment?.name || '',
          attachment_url: attachment?.url || ''
        })
      });
      if (res.ok) {
        get().fetchMessages();
      }
    } catch(e) { console.error('sendMsg error', e); }
  },

  pmDirectory: [],
  fetchPmDirectory: async () => {
    try {
      const cNum = sessionStorage.getItem('consultant_number');
      const token = localStorage.getItem('access_token');
      if (!cNum || !token) return;
      
      const res = await apiFetch(`${API_BASE}/api/v1/consultants/${cNum}/messages/directory/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const result = await res.json();
        const actualData = result?.data?.data || result?.data || [];
        set({ pmDirectory: Array.isArray(actualData) ? actualData : [] });
      }
    } catch(e) {}
  },

  // Meetings Scheduler
  meetings: [],
  fetchMeetings: async () => {
    try {
      const cNum = sessionStorage.getItem('consultant_number');
      const token = localStorage.getItem('access_token');
      if (!cNum || !token) return;
      
      const res = await apiFetch(`${API_BASE}/api/v1/consultants/${cNum}/meetings/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const result = await res.json();
        const data = result.data || result;
        const mappedMeetings = data.map((m: any) => {
          let dateStr = 'Unknown';
          let timeStr = 'Unknown';
          if (m.start_time && m.end_time) {
              const startDate = new Date(m.start_time);
              const endDate = new Date(m.end_time);
              dateStr = startDate.toLocaleDateString();
              timeStr = `${startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${endDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
          }
          return {
            id: m.id.toString(),
            title: m.title,
            date: dateStr,
            timeSlot: timeStr,
            joinLink: m.join_link || '#',
            status: m.status
          };
        });
        set({ meetings: mappedMeetings });
      }
    } catch(e) { console.error('fetchMeetings error', e); }
  },
  
  bookMeeting: async (title, date, timeSlot, pmId) => {
    try {
      const cNum = sessionStorage.getItem('consultant_number');
      const token = localStorage.getItem('access_token');
      if (!cNum || !token) return;

      // Basic parsing of date and timeSlot (e.g. "10:00 AM - 11:00 AM")
      // In a real app we'd get start/end time directly from the form, but let's do a basic conversion
      const startDate = new Date(date);
      // Assuming timeSlot starts with something like "10:00"
      const [startHourStr] = timeSlot.split(' - ');
      if (startHourStr) {
         const [hr, min] = startHourStr.replace(/[^0-9:]/g, '').split(':');
         if (hr) startDate.setHours(parseInt(hr, 10), parseInt(min || '0', 10));
      }
      const endDate = new Date(startDate.getTime() + 60*60*1000); // add 1 hr

      const res = await apiFetch(`${API_BASE}/api/v1/consultants/${cNum}/meetings/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          title,
          start_time: startDate.toISOString(),
          end_time: endDate.toISOString(),
          pm: pmId ? parseInt(pmId, 10) : null
        })
      });
      
      if (res.ok) {
        get().fetchMeetings();
        get().addNotification(
          'Meeting Scheduled',
          `Meeting booked with Project Manager on ${date} at ${timeSlot}.`,
          'SYSTEM'
        );
      }
    } catch(e) { console.error('bookMeeting error', e); }
  },

  // Notifications
  notifications: INITIAL_NOTIFICATIONS,
  addNotification: (title, text, type) => {
    const newNot: AppNotification = {
      id: `NOT-${Date.now()}`,
      title,
      text,
      timestamp: new Date().toISOString(),
      read: false,
      type
    };
    set(state => ({
      notifications: [newNot, ...state.notifications]
    }));
  },
  markNotificationRead: (id) => {
    set(state => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
  },
  clearNotifications: () => {
    set({ notifications: [] });
  }
    }),
    {
      name: 'consultant-storage',
      partialize: (state) => ({ 
        language: state.language,
        onboardingCompleted: state.onboardingCompleted,
        onboardingData: state.onboardingData,
        profileData: state.profileData,
        isAuthenticated: state.isAuthenticated,
        is2faPending: state.is2faPending
      }),
    }
  )
);
