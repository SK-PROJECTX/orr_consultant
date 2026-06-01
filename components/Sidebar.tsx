'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useConsultantStore } from '@/store/consultantStore';
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
  Bell 
} from 'lucide-react';

interface SidebarProps {
  openNotifications: () => void;
}

export default function Sidebar({ openNotifications }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'wallet', label: 'Wallet & Invoices', icon: Wallet },
    { id: 'tasks', label: 'Task Board', icon: CheckSquare },
    { id: 'vault', label: 'Document Vault', icon: FolderLock },
    { id: 'chat', label: 'PM Secure Chat', icon: MessageSquare, badge: hasUnreadChat },
    { id: 'meetings', label: 'Meeting Planner', icon: Calendar },
  ];

  const handleSignOut = () => {
    if (confirm("Confirm signing out of secure specialist portal session?")) {
      logoutConsultant();
      router.push('/signin');
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-surface border-r border-white/10 p-6 z-40 select-none">
      {/* Brand Header */}
      <div className="flex items-center gap-3 pb-8 border-b border-white/5">
        <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-primary/20">
          O
        </div>
        <div>
          <span className="text-[10px] font-black uppercase text-primary tracking-widest block font-mono">SOLUTION</span>
          <h2 className="text-base font-extrabold tracking-tight text-white leading-none">Consultant Portal</h2>
        </div>
      </div>

      {/* Profile Summary Card */}
      <div className="mt-6 p-4 rounded-2xl bg-card border border-white/5 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-primary relative">
          <User size={22} className="text-slate-300" />
          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-primary border-2 border-surface rounded-full flex items-center justify-center">
            <ShieldCheck size={9} className="text-background" />
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-extrabold text-white truncate">Specialist Partner</h3>
          <p className="text-[10px] text-slate-400 truncate capitalize">
            {onboardingData?.industry || 'Uncategorized'}
          </p>
        </div>
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
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-xs font-bold transition-all duration-300 border cursor-pointer ${
                isActive
                  ? 'bg-primary text-background border-primary shadow-lg shadow-primary/10'
                  : 'text-slate-400 hover:text-white bg-transparent border-transparent hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isActive ? 'text-background' : 'text-slate-400'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-background' : 'bg-primary animate-ping'}`} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="pt-6 border-t border-white/5 space-y-4">
        {/* Notifications Shortcut */}
        <button
          onClick={openNotifications}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition border border-transparent cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-slate-400" />
            <span>Alert Log</span>
          </div>
          {unreadNotificationsCount > 0 && (
            <span className="bg-primary text-background text-[10px] px-2 py-0.5 rounded-full font-black font-mono">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Demo State Reset */}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent transition cursor-pointer"
        >
          <LogOut size={18} />
          <span>Sign Out Specialist</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header Bar */}
      <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-surface border-b border-white/10 w-full z-30 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center font-black text-slate-950 text-sm shadow-md">
            O
          </div>
          <span className="font-extrabold text-sm text-white">ORR Consultant</span>
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
      <aside className="hidden lg:block w-72 h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
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
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
