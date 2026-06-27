import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface ProfileData {
  // 1. Personal Information
  photoUrl?: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  headline: string;
  bio: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
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
  jobId: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'COMPLETED';
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
  verify2fa: (code: string) => boolean;
  logoutConsultant: () => void;

  // Profile
  profileData: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;

  // Onboarding
  onboardingCompleted: boolean;
  onboardingData: {
    industry: string;
    skills: string[];
    itCapabilities: string[];
    timezone: string;
    ndaAccepted: boolean;
  } | null;
  completeOnboarding: (industry: string, skills: string[], itCapabilities: string[], timezone: string, ndaAccepted: boolean, consultantId?: string) => void;

  // Jobs
  availableJobs: JobOffer[];
  activeJobs: Job[];
  acceptJob: (jobId: string) => void;
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
  submitTaskDeliverable: (taskId: string, notes: string, fileName: string) => void;

  // Document Vault
  documents: VaultDocument[];
  addDocumentTrackChange: (docId: string, type: 'INSERTION' | 'DELETION', text: string, line: number) => void;
  resetDocumentChanges: (docId: string) => void;
  updateDocumentContent: (docId: string, newTitle: string, newContent: string) => void;
  createFolder: (title: string, parentId: string | null) => void;
  createDocument: (type: 'doc' | 'sheet' | 'slide', title: string, parentId: string | null) => void;
  uploadFileToVault: (fileObj: { name: string, type: string, size: number }, parentId: string | null) => void;

  // Chat
  messages: Message[];
  sendChatMessage: (text: string, attachment?: { name: string; url?: string; type: string }) => void;

  // Meetings
  meetings: Meeting[];
  bookMeeting: (title: string, date: string, timeSlot: string) => void;

  // Notifications
  notifications: AppNotification[];
  addNotification: (title: string, text: string, type: AppNotification['type']) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

// Re-seeded Seed Data with real ORR Solutions parameters
const INITIAL_JOB_OFFERS: JobOffer[] = [
  {
    id: 'JOB-901',
    title: 'Costa Rican Agroforestry Ecological Survey',
    industry: 'Living Systems Regeneration',
    clientSector: 'Ecotourism & Agriculture',
    rate: '$120/hr',
    duration: '6 Weeks',
    description: 'Perform structural canopy tree density surveys, deep-core soil carbon testing, and Indicator-Species bird biodiversity metrics logging in the Osa Peninsula reforestation belt.',
    scope: [
      'Conduct structural canopy cover audits using LiDAR metrics',
      'Take core soil diagnostic samples at 30cm depth to evaluate organic indexes',
      'Record bio-acoustic patterns for 48 hours at Osa Peninsula sites',
      'Formulate a final Osa Ecological Regeneration report'
    ],
    deliverables: [
      'Osa Canopy Structure & Biomass Map',
      'Core Soil Carbon Diagnostic spreadsheet',
      'Indicator Bird Species Bio-acoustic report'
    ]
  },
  {
    id: 'JOB-902',
    title: 'Circular Flow Battery E-Waste Tracing Database',
    industry: 'Operational Systems',
    clientSector: 'Consumer Electronics Recyclers',
    rate: '$145/hr',
    duration: '4 Weeks',
    description: 'Architect a secure material-flow ledger system to track batch shipments of recycled lithium/cobalt battery metals from waste center to smelt fabrication nodes.',
    scope: [
      'Design a relational PostgreSQL material batched provenance schema',
      'Implement OAuth2 endpoints to secure ledger transfers between nodes',
      'Develop automated audit triggers verifying the 1.5% mass-balance tolerance',
      'Formulate API endpoints for barcode scanner clients'
    ],
    deliverables: [
      'Provenance batch ledger relational schema',
      'HMAC OAuth2 transfer endpoints',
      'Automated Mass-balance validation triggers'
    ]
  }
];

const INITIAL_TASKS: Task[] = [
  {
    id: 'TASK-101',
    jobId: 'ACTIVE-100', // General initial startup
    title: 'Verify VPN Workspace & Security Clearance',
    description: 'Ensure hardware authenticator token matches database keys, confirm secure VPN tunnels, and verify local encrypted partition access.',
    dueDate: '2026-05-28',
    priority: 'HIGH',
    status: 'IN_PROGRESS'
  },
  {
    id: 'TASK-102',
    jobId: 'ACTIVE-100',
    title: 'Define ESG Scope & Core Milestones Catalog',
    description: 'Formulate preliminary reporting guidelines mapping circular ESG indicators for the upcoming PM kickoff sync.',
    dueDate: '2026-06-03',
    priority: 'MEDIUM',
    status: 'ASSIGNED'
  }
];

const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'INV-401',
    invoiceNumber: 'INV-2026-001',
    billingPeriod: 'May 1 - May 15, 2026',
    hours: 32,
    rate: 110,
    amount: 3520,
    taskTitle: 'Supply Chain Carbon Scoping Review',
    submittedAt: '2026-05-15T14:30:00Z',
    fileName: 'orr-supply-chain-carbon-inv.pdf',
    status: 'PAID',
    reviewerNotes: 'Approved for payout. Settled on May 19.'
  },
  {
    id: 'INV-402',
    invoiceNumber: 'INV-2026-002',
    billingPeriod: 'May 16 - May 24, 2026',
    hours: 18,
    rate: 110,
    amount: 1980,
    taskTitle: 'Recycler Mass Balance Audit',
    submittedAt: '2026-05-24T09:15:00Z',
    fileName: 'orr-mass-balance-audit-inv.pdf',
    status: 'APPROVED',
    reviewerNotes: 'Approved by PM Vance, queued for Treasury disbursement.'
  }
];

const INITIAL_DOCUMENTS: VaultDocument[] = [
  {
    id: 'doc-1',
    title: 'Master Service Agreement',
    category: 'LEGAL',
    type: 'doc',
    jobId: 'job-1',
    status: 'UNLOCKED',
    lastModified: new Date().toISOString(),
    content: '<h2>1. General Provisions</h2>\n<p>This master agreement covers the initial infrastructure provisions.</p>\n<p>Supplier shall maintain 99.9% uptime for all deployed endpoints.</p>\n<p>...</p>',
    trackChanges: []
  },
  {
    id: 'doc-2',
    title: 'Q3 Financial Projections',
    category: 'FINANCIAL',
    type: 'sheet',
    jobId: 'job-1',
    status: 'UNLOCKED',
    lastModified: new Date(Date.now() - 86400000).toISOString(),
    content: 'A1: Revenue, B1: $4.5M\nA2: Expenses, B2: $2.1M\nA3: Profit, B3: $2.4M',
    trackChanges: []
  },
  {
    id: 'doc-3',
    title: 'Technical Implementation Slides',
    category: 'TECHNICAL',
    type: 'slide',
    jobId: 'job-2',
    status: 'UNLOCKED',
    lastModified: new Date(Date.now() - 172800000).toISOString(),
    content: 'Slide 1: Architecture Overview\nSlide 2: Deployment Strategy',
    trackChanges: []
  }
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'MSG-001',
    sender: 'PROJECT_MANAGER',
    text: "Welcome to the ORR Solutions partner workspace! I will be your primary point of contact for all regenerative systems projects you accept through this portal.",
    timestamp: '2026-05-24T10:00:00Z'
  },
  {
    id: 'MSG-002',
    sender: 'CONSULTANT',
    text: "Thank you, Marcus. I am verifying my workspace compliance now. I'll complete onboarding to access the Osa Peninsula reforestation survey scope.",
    timestamp: '2026-05-24T10:15:00Z'
  },
  {
    id: 'MSG-003',
    sender: 'PROJECT_MANAGER',
    text: "Excellent. I've uploaded our default guidelines for 'Living Systems Regeneration' and 'Operational Systems' batter tracing to the Vault. Once onboarded, you can accept matching project charters.",
    timestamp: '2026-05-24T10:18:00Z'
  }
];

const INITIAL_MEETINGS: Meeting[] = [
  {
    id: 'MEET-301',
    title: 'ORR Project Onboarding & Scope Alignment Sync',
    date: '2026-05-26',
    timeSlot: '11:00 AM - 11:30 AM',
    joinLink: 'https://orr.zoom.us/j/9082314561?pwd=mock-meeting-key',
    status: 'UPCOMING'
  }
];

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'NOT-001',
    title: 'Invoice Status Update',
    text: 'Your invoice for Recycler Mass Balance Audit (INV-2026-002) has been APPROVED by the PM.',
    timestamp: '2026-05-24T09:20:00Z',
    read: false,
    type: 'PAYMENT'
  },
  {
    id: 'NOT-002',
    title: 'New Contract Broadcast',
    text: 'A high-matching Costa Rican ecological survey brief has been dispatched to your dashboard.',
    timestamp: '2026-05-25T08:00:00Z',
    read: false,
    type: 'JOB'
  }
];

// Zustand Store implementation
export const useConsultantStore = create<ConsultantState>()(
  persist(
    (set, get) => ({
      // Language State
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),

  // Authentication & 2FA State
  isAuthenticated: false,
  is2faPending: false,
  loginError: null,
  loginConsultant: async (email, password) => {
    set({ loginError: null });
    // Mock authentication check
    if (email.trim() && password.length >= 6) {
      set({ is2faPending: true });
      return true;
    } else {
      set({ loginError: 'Invalid specialist credentials. Password must exceed 5 characters.' });
      return false;
    }
  },
  verify2fa: (code) => {
    // 2FA code is hardcoded as '123456' or '888888' for easy user testing
    if (code === '123456' || code === '888888') {
      set({ 
        isAuthenticated: true, 
        is2faPending: false,
        loginError: null 
      });
      get().addNotification(
        'Specialist Authorization Granted',
        'Secure session established. Two-factor clearance approved.',
        'SYSTEM'
      );
      return true;
    } else {
      set({ loginError: 'Security validation code incorrect. Please verify and try again.' });
      return false;
    }
  },
  logoutConsultant: () => {
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
    }
  },
  updateProfile: (data) => {
    set(state => ({
      profileData: { ...state.profileData, ...data }
    }));
    get().addNotification(
      'Profile Updated',
      'Your specialist profile parameters have been successfully updated.',
      'SYSTEM'
    );
  },

  // Onboarding State
  onboardingCompleted: false,
  onboardingData: null,
  completeOnboarding: (industry, skills, itCapabilities, timezone, ndaAccepted, consultantId) => {
    set({
      onboardingCompleted: true,
      onboardingData: { industry, skills, itCapabilities, timezone, ndaAccepted }
    });
    
    // Add success notification
    get().addNotification(
      'Profile Onboarding Completed',
      `Welcome to ORR Solutions! Your capabilities in ${industry} have been archived. You are cleared to accept active job scopes.`,
      'SYSTEM'
    );
  },

  // Jobs
  availableJobs: INITIAL_JOB_OFFERS,
  activeJobs: [],
  acceptJob: (jobId) => {
    const jobOffer = get().availableJobs.find(j => j.id === jobId);
    if (!jobOffer) return;

    const acceptedJob: Job = {
      ...jobOffer,
      acceptedAt: new Date().toISOString(),
      status: 'ACTIVE'
    };

    // Move to active, remove from available
    set(state => ({
      activeJobs: [...state.activeJobs, acceptedJob],
      availableJobs: state.availableJobs.filter(j => j.id !== jobId),
      // Automatically add new tasks based on the job deliverables!
      tasks: [
        ...state.tasks,
        ...jobOffer.deliverables.map((del, idx) => ({
          id: `TASK-${jobId.split('-')[1]}-${idx + 1}`,
          jobId: jobId,
          title: `Submit: ${del}`,
          description: `Deliverable requirement: Complete comprehensive partner verification matching scope: ${jobOffer.scope[idx] || del}`,
          dueDate: new Date(Date.now() + (idx + 1) * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1wk, 2wk out
          priority: idx === 0 ? 'HIGH' : 'MEDIUM' as Task['priority'],
          status: 'ASSIGNED' as Task['status']
        }))
      ]
    }));

    // Notify user
    get().addNotification(
      'Project Scope Accepted',
      `You accepted: ${jobOffer.title}. Security directives and survey files in the Vault are unlocked.`,
      'JOB'
    );

    // Simulated PM message welcoming them
    setTimeout(() => {
      set(state => ({
        messages: [
          ...state.messages,
          {
            id: `MSG-${Date.now()}`,
            sender: 'PROJECT_MANAGER',
            text: `Perfect! Thank you for accepting the "${jobOffer.title}" contract. I have unlocked the related documents in the Vault. Please review the directives for "${jobOffer.title}" to coordinate our diagnostics. Let me know if you want to book a kickoff sync!`,
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
    available: 3520, // Pre-seeded paid
    pending: 1980,   // Pre-seeded approved but pending disbursement
    totalEarned: 5500
  },
  invoices: INITIAL_INVOICES,
  submitInvoice: (invoiceData) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `INV-${Date.now()}`,
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString()
    };

    set(state => ({
      invoices: [newInvoice, ...state.invoices],
      walletBalance: {
        ...state.walletBalance,
        pending: state.walletBalance.pending + newInvoice.amount
      }
    }));

    get().addNotification(
      'Invoice Submitted Successfully',
      `Invoice for ${newInvoice.taskTitle} (${newInvoice.invoiceNumber}) has been locked in for PM review.`,
      'PAYMENT'
    );

    // Simulate review progress
    setTimeout(() => {
      set(state => {
        const updatedInvoices = state.invoices.map(inv => {
          if (inv.id === newInvoice.id) {
            return {
              ...inv,
              status: 'UNDER_REVIEW' as const,
              reviewerNotes: 'Invoice under audit by PM Marcus Vance. Soil/code outputs verified.'
            };
          }
          return inv;
        });
        return { invoices: updatedInvoices };
      });
      get().addNotification(
        'Invoice Under PM Audit',
        `Invoice ${newInvoice.invoiceNumber} is now being audited by the Project Manager.`,
        'PAYMENT'
      );
    }, 15000);
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
  updateTaskStatus: (taskId, status) => {
    set(state => ({
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, status } : t)
    }));
  },
  submitTaskDeliverable: (taskId, notes, fileName) => {
    set(state => ({
      tasks: state.tasks.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            status: 'UNDER_REVIEW',
            deliverableSubmitted: {
              submittedAt: new Date().toISOString(),
              notes,
              fileName
            }
          };
        }
        return t;
      })
    }));

    const taskObj = get().tasks.find(t => t.id === taskId);

    get().addNotification(
      'Deliverable Package Submitted',
      `Deliverable archive for "${taskObj?.title || taskId}" has been uploaded.`,
      'SYSTEM'
    );

    // Simulate PM approving task and offering an invoice trigger
    setTimeout(() => {
      set(state => ({
        tasks: state.tasks.map(t => {
          if (t.id === taskId) {
            return { ...t, status: 'COMPLETED' as const };
          }
          return t;
        }),
        messages: [
          ...state.messages,
          {
            id: `MSG-${Date.now()}`,
            sender: 'PROJECT_MANAGER',
            text: `Hey, I just audited your final deliverable package for "${taskObj?.title || 'your deliverable'}". The depth of ecological data is perfect! I've marked the task as COMPLETED. Please head to your Wallet tab to submit your digital invoice.`,
            timestamp: new Date().toISOString()
          }
        ]
      }));
      get().addNotification(
        'Milestone Deliverable Approved',
        `Your deliverable for "${taskObj?.title}" has been approved! You can now file your billing invoice.`,
        'DOCUMENT'
      );
    }, 10000);
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
  createFolder: (title, parentId) => {
    set(state => ({
      documents: [
        {
          id: `fld-${Date.now()}`,
          title,
          category: 'OPERATIONAL', // Defaulting
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
  createDocument: (type, title, parentId) => {
    set(state => ({
      documents: [
        {
          id: `doc-${Date.now()}`,
          title,
          category: 'TECHNICAL',
          content: type === 'sheet' ? '[{"name":"Sheet1","data":[[]]}]' : '',
          type,
          status: 'UNLOCKED',
          lastModified: new Date().toISOString(),
          trackChanges: [],
          parentId
        },
        ...state.documents
      ]
    }));
  },
  uploadFileToVault: (fileObj, parentId) => {
    set(state => ({
      documents: [
        {
          id: `file-${Date.now()}`,
          title: fileObj.name,
          category: 'OPERATIONAL',
          content: '',
          type: 'file',
          status: 'UNLOCKED',
          lastModified: new Date().toISOString(),
          trackChanges: [],
          parentId,
          fileMeta: {
            size: fileObj.size,
            mimeType: fileObj.type
          }
        },
        ...state.documents
      ]
    }));
  },

  // Chat Secure Messaging
  messages: INITIAL_MESSAGES,
  sendChatMessage: (text, attachment) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'CONSULTANT',
      text,
      timestamp: new Date().toISOString(),
      attachment
    };

    set(state => ({
      messages: [...state.messages, newMsg]
    }));

    // Automated smart responder based on keyword triggers
    setTimeout(() => {
      let pmReply = "Received your secure ping. I am checking our compliance logs and will sync back with you shortly.";
      const query = text.toLowerCase();
      
      if (query.includes('hello') || query.includes('hi ')) {
        pmReply = "Hello! Let me know if you have questions regarding your active reforestation scopes or upcoming provenance audits.";
      } else if (query.includes('invoice') || query.includes('pay') || query.includes('wallet') || query.includes('money') || query.includes('billing')) {
        pmReply = "Our billing cycle runs bi-weekly. Once your soil reports or schema codes are marked 'COMPLETED' on the task board, submit your digital invoice. Treasury usually processes approved payouts within 48 hours.";
      } else if (query.includes('deadline') || query.includes('time') || query.includes('late') || query.includes('extension')) {
        pmReply = "If you need a timeline extension, write a quick justification here. I can update task due dates on our internal PM dashboard.";
      } else if (query.includes('contract') || query.includes('scope') || query.includes('job') || query.includes('survey')) {
        pmReply = "Project parameters and guidelines are fully documented in the secure 'Document Vault' unlocked upon accepting a job. Let me know if there's any parameter we need to review.";
      }

      set(state => ({
        messages: [
          ...state.messages,
          {
            id: `MSG-${Date.now()}`,
            sender: 'PROJECT_MANAGER',
            text: pmReply,
            timestamp: new Date().toISOString()
          }
        ]
      }));

      get().addNotification(
        'New Encrypted Message from PM',
        pmReply.substring(0, 50) + '...',
        'CHAT'
      );
    }, 1200);
  },

  // Meetings Scheduler
  meetings: INITIAL_MEETINGS,
  bookMeeting: (title, date, timeSlot) => {
    const newMeeting: Meeting = {
      id: `MEET-${Date.now()}`,
      title,
      date,
      timeSlot,
      joinLink: `https://orr.zoom.us/j/${Math.floor(1000000000 + Math.random() * 9000000000)}?pwd=mock-meet-${Date.now().toString().slice(-4)}`,
      status: 'UPCOMING'
    };

    set(state => ({
      meetings: [...state.meetings, newMeeting]
    }));

    get().addNotification(
      'Meeting Scheduled',
      `Meeting booked with Project Manager on ${date} at ${timeSlot}.`,
      'SYSTEM'
    );
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
        profileData: state.profileData
      }),
    }
  )
);
