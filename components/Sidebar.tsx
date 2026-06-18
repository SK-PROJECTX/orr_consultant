'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useConsultantStore } from '@/store/consultantStore';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/ThemeToggle';
import Link from 'next/link';
import {
  LayoutDashboard,
  Wallet,
  CheckSquare,
  FolderLock,
  MessageSquare,
  Calendar,
  LogOut,
  Menu,
  X,
  User,
  ShieldCheck,
  Bell,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  openNotifications: () => void;
}

export default function Sidebar({ openNotifications }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  const onboardingData = useConsultantStore(state => state.onboardingData);
  const notifications = useConsultantStore(state => state.notifications);
  const messages = useConsultantStore(state => state.messages);
  const logoutConsultant = useConsultantStore(state => state.logoutConsultant);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Calculate simulated unread chats
  const lastMsg = messages[messages.length - 1];
  const hasUnreadChat = lastMsg && lastMsg.sender === 'PROJECT_MANAGER';

  // Get active tab from URL path
  const activeTab = pathname === '/' ? 'dashboard' : pathname.split('/')[1] || 'dashboard';

  const menuItems = [
    { id: 'dashboard', label: t('sidebar.dashboard'), icon: LayoutDashboard },
    { id: 'wallet', label: t('sidebar.wallet'), icon: Wallet },
    { id: 'tasks', label: t('sidebar.tasks'), icon: CheckSquare },
    { id: 'vault', label: t('sidebar.vault'), icon: FolderLock },
    { id: 'chat', label: t('sidebar.chat'), icon: MessageSquare, badge: hasUnreadChat },
    { id: 'meetings', label: t('sidebar.meetings'), icon: Calendar },
    { id: 'profile', label: t('sidebar.profile'), icon: User },
  ];

  const handleSignOutClick = () => {
    setShowSignOutModal(true);
  };

  const confirmSignOut = () => {
    setShowSignOutModal(false);
    logoutConsultant();
    router.push('/signin');
  };

  const renderSidebarContent = (isCollapsedView: boolean) => (
    <div className={`flex flex-col h-full bg-surface border-r border-white/10 p-4 lg:p-6 z-40 select-none overflow-y-auto transition-all duration-300`}>
      {/* Brand Header */}
      <div className={`flex items-center pb-8 border-b border-white/5 relative ${isCollapsedView ? 'justify-center' : 'justify-between gap-3'}`}>
        {!isCollapsedView ? (
          <img
            src="https://res.cloudinary.com/depeqzb6z/image/upload/v1764395173/logo_qqpk6j.svg"
            alt="ORR Logo"
            className="h-30 w-auto"
          />
        ) : (
          <img
            src="https://res.cloudinary.com/depeqzb6z/image/upload/v1764395173/logo_qqpk6j.svg"
            alt="ORR Logo"
            className="h-8 w-auto"
          />
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsedView)}
          className="hidden lg:flex p-1.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition"
          title={isCollapsedView ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsedView ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation List using Next.js Link elements */}
      <nav className="flex-1 mt-8 space-y-2">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <Link
              key={item.id}
              href={`/${item.id}`}
              onClick={() => setIsOpen(false)}
              title={isCollapsedView ? item.label : undefined}
              className={`relative w-full flex items-center ${isCollapsedView ? 'justify-center px-0 py-3' : 'justify-between px-4 py-3.5'} rounded-xl text-xs font-bold transition-all duration-300 border cursor-pointer ${isActive
                ? 'bg-primary text-background border-primary shadow-lg shadow-primary/10'
                : 'text-slate-400 hover:text-white bg-transparent border-transparent hover:bg-white/5'
                }`}
            >
              <div className={`flex items-center ${isCollapsedView ? 'justify-center' : 'gap-3'}`}>
                <Icon size={isCollapsedView ? 22 : 18} className={isActive ? 'text-background' : 'text-slate-400'} />
                {!isCollapsedView && <span>{item.label}</span>}
              </div>
              {item.badge && (
                <span className={`rounded-full ${isActive ? 'bg-background' : 'bg-primary animate-ping'} ${isCollapsedView ? 'absolute top-2 right-2 w-2 h-2' : 'w-2.5 h-2.5'}`} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className={`pt-6 border-t border-white/5 ${isCollapsedView ? 'space-y-4 flex flex-col items-center' : 'space-y-4'}`}>

        {/* Toggles */}
        {!isCollapsedView && (
          <div className="flex justify-center items-center gap-4 pb-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        )}


        {/* Profile Summary Card */}
        <Link 
          href="/profile" 
          onClick={() => setIsOpen(false)}
          className={`mt-6 rounded-2xl bg-card border border-white/5 flex items-center hover:bg-white/5 transition cursor-pointer ${isCollapsedView ? 'p-2 justify-center' : 'p-4 gap-3'}`}
        >
          <div className={`rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-primary relative shrink-0 ${isCollapsedView ? 'w-10 h-10' : 'w-12 h-12'}`}>
            <User size={isCollapsedView ? 18 : 22} className="text-slate-300" />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-primary border-2 border-surface rounded-full flex items-center justify-center">
              <ShieldCheck size={9} className="text-background" />
            </span>
          </div>
          {!isCollapsedView && (
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-extrabold text-white truncate hover:underline">{t('sidebar.profileRole')}</h3>
              <p className="text-[10px] text-slate-400 truncate capitalize">
                {onboardingData?.industry || t('sidebar.uncategorized')}
              </p>
            </div>
          )}
        </Link>


        {/* Notifications Shortcut */}
        <button
          onClick={openNotifications}
          title={isCollapsedView ? t('sidebar.alertLog') : undefined}
          className={`w-full flex items-center ${isCollapsedView ? 'justify-center px-0 py-3' : 'justify-between px-4 py-3'} rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition border border-transparent cursor-pointer relative`}
        >
          <div className="flex items-center gap-3">
            <Bell size={isCollapsedView ? 22 : 18} className="text-slate-400" />
            {!isCollapsedView && <span>{t('sidebar.alertLog')}</span>}
          </div>
          {unreadNotificationsCount > 0 && (
            isCollapsedView ? (
              <span className="absolute top-1 right-1 bg-primary text-background text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-black font-mono">
                {unreadNotificationsCount}
              </span>
            ) : (
              <span className="bg-primary text-background text-[10px] px-2 py-0.5 rounded-full font-black font-mono">
                {unreadNotificationsCount}
              </span>
            )
          )}
        </button>

        {/* Demo State Reset */}
        <button
          onClick={handleSignOutClick}
          title={isCollapsedView ? t('sidebar.signOut') : undefined}
          className={`w-full flex items-center ${isCollapsedView ? 'justify-center px-0 py-3' : 'gap-3 px-4 py-3'} rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent transition cursor-pointer`}
        >
          <LogOut size={isCollapsedView ? 22 : 18} />
          {!isCollapsedView && <span>{t('sidebar.signOut')}</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header Bar */}
      <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-surface border-b border-white/10 w-full z-30 sticky top-0">
        <div className="flex items-center gap-2">
          <img
            src="https://res.cloudinary.com/depeqzb6z/image/upload/v1764395173/logo_qqpk6j.svg"
            alt="ORR Logo"
            className="h-8 w-auto"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={openNotifications}
            className="p-2 hover:bg-white/5 rounded-xl transition text-slate-300 relative"
          >
            <Bell size={20} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-white/5 rounded-xl transition text-slate-300"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Desktop Persistent Sidebar */}
      <aside className={`hidden lg:block h-screen sticky top-0 flex-shrink-0 transition-all duration-300 ${isCollapsed ? 'w-24' : 'w-72'}`}>
        {renderSidebarContent(isCollapsed)}
      </aside>

      {/* Mobile Sidebar Overlay Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          {/* Drawer content panel */}
          <div className="relative flex flex-col w-72 h-full bg-surface shadow-2xl animate-in slide-in-from-left duration-300">
            {renderSidebarContent(false)}
          </div>
        </div>
      )}

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="max-w-sm w-full bg-card border border-red-500/20 backdrop-blur-2xl p-6 lg:p-8 rounded-[2rem] space-y-6 shadow-2xl relative">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center">
                <LogOut size={32} />
              </div>
              <h3 className="text-xl font-extrabold text-white">{t('sidebar.signOut')}</h3>
              <p className="text-sm text-slate-400">{t('sidebar.confirmSignOut')}</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowSignOutModal(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmSignOut}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition text-sm cursor-pointer shadow-lg shadow-red-500/20"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
