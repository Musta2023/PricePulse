import React from 'react';
import { Package, TrendingDown, BellRing, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  color: string;
}

const StatCard = ({ title, value, subtext, icon: Icon, color }: StatCardProps) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
      </div>
    </div>
    <h3 className="text-sm font-medium text-slate-500">{title}</h3>
    <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
    <p className="text-xs text-slate-400 mt-1">{subtext}</p>
  </div>
);

interface DashboardStatsProps {
  products: any[];
}

export const DashboardStats = ({ products }: DashboardStatsProps) => {
  const total = products.length;
  const priceDrops = products.filter(p => p.currentPrice < p.initialPrice).length;
  const priceHikes = products.filter(p => p.currentPrice > p.initialPrice).length;
  const alerts = products.filter(p => Math.abs((p.currentPrice - p.initialPrice) / p.initialPrice) >= 0.1).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      <StatCard title="Produits suivis" value={total} subtext="+0 ajoutés cette semaine" icon={Package} color="bg-indigo-600" />
      <StatCard title="Baisses de prix" value={priceDrops} subtext="Produits moins chers" icon={TrendingDown} color="bg-emerald-500" />
      <StatCard title="Alertes actives" value={alerts} subtext="Nécessitent une attention" icon={BellRing} color="bg-orange-500" />
      <StatCard title="Prix en hausse" value={priceHikes} subtext="Prix en augmentation" icon={TrendingUp} color="bg-rose-500" />
    </div>
  );
};
