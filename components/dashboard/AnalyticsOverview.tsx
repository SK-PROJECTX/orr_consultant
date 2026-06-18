'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Activity, DollarSign, Target, PieChart as PieChartIcon } from 'lucide-react';

// Mock Data
const activityData = [
  { day: 'Mon', logins: 2, actions: 14 },
  { day: 'Tue', logins: 3, actions: 28 },
  { day: 'Wed', logins: 1, actions: 10 },
  { day: 'Thu', logins: 4, actions: 45 },
  { day: 'Fri', logins: 2, actions: 20 },
  { day: 'Sat', logins: 0, actions: 0 },
  { day: 'Sun', logins: 1, actions: 5 },
];

const paymentsData = [
  { month: 'Jan', cleared: 4000, pending: 2400 },
  { month: 'Feb', cleared: 3000, pending: 1398 },
  { month: 'Mar', cleared: 2000, pending: 9800 },
  { month: 'Apr', cleared: 2780, pending: 3908 },
  { month: 'May', cleared: 1890, pending: 4800 },
  { month: 'Jun', cleared: 2390, pending: 3800 },
];

const progressData = [
  { week: 'W1', completion: 10 },
  { week: 'W2', completion: 25 },
  { week: 'W3', completion: 45 },
  { week: 'W4', completion: 60 },
  { week: 'W5', completion: 85 },
  { week: 'W6', completion: 100 },
];

const baseTaskData = [
  { id: 'completed', value: 12, color: '#10b981' }, // Emerald
  { id: 'inProgress', value: 5, color: '#0ea5e9' }, // Cyan
  { id: 'open', value: 3, color: '#f59e0b' },       // Amber
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 border border-white/10 p-3 rounded-xl shadow-xl backdrop-blur-md">
        <p className="text-white font-bold text-xs mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-[10px] font-mono" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsOverview() {
  const { t } = useTranslation();

  const taskData = baseTaskData.map(item => ({
    name: item.id === 'completed' ? t('dashboard.analytics.completed') : 
          item.id === 'inProgress' ? t('dashboard.analytics.inProgress') : 
          t('dashboard.analytics.open'),
    value: item.value,
    color: item.color
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500 delay-100">
      <h2 className="text-lg font-black text-white flex items-center gap-2">
        <Activity className="text-primary" size={20} />
        {t('dashboard.analytics.title')}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Timeline */}
        <div className="bg-card border border-white/5 p-5 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
          <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
            <Activity size={16} className="text-primary" />
            {t('dashboard.analytics.activities')}
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="day" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 1 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                <Line type="monotone" name={t('dashboard.analytics.actions')} dataKey="actions" stroke="#61FD51" strokeWidth={3} dot={{ r: 4, fill: '#1e293b', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#61FD51' }} />
                <Line type="monotone" name={t('dashboard.analytics.logins')} dataKey="logins" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3, fill: '#1e293b', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payments & Revenue */}
        <div className="bg-card border border-white/5 p-5 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
            <DollarSign size={16} className="text-emerald-400" />
            {t('dashboard.analytics.payments')}
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentsData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="month" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                <Bar name={t('dashboard.analytics.cleared')} dataKey="cleared" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar name={t('dashboard.analytics.pending')} dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Progress */}
        <div className="bg-card border border-white/5 p-5 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
          <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
            <Target size={16} className="text-purple-400" />
            {t('dashboard.analytics.projectProgress')}
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="week" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 1 }} />
                <Area type="monotone" name={t('dashboard.analytics.completion')} dataKey="completion" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorCompletion)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Breakdown */}
        <div className="bg-card border border-white/5 p-5 rounded-3xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
          <h3 className="text-sm font-bold text-white mb-6 flex items-center gap-2">
            <PieChartIcon size={16} className="text-cyan-400" />
            {t('dashboard.analytics.taskBreakdown')}
          </h3>
          <div className="h-[250px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {taskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ fontSize: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
