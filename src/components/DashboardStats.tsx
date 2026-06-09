import { Package, TrendingDown, BellRing, TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Product } from '../api/products';

interface DashboardStatsProps {
  products: Product[];
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtext: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
}

const StatCard = ({ title, value, subtext, icon: Icon, iconBgColor, iconColor }: StatCardProps) => (
  <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-md ${iconBgColor} ${iconColor}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">{value}</h3>
      </div>
    </div>
    <p className="text-xs text-slate-400 mt-4 font-medium">{subtext}</p>
  </div>
);

export default function DashboardStats({ products }: DashboardStatsProps) {
  // Calculs dynamiques basés sur le prix initial et actuel
  const totalProducts = products?.length ?? 0;

  const priceDrops = products?.filter(p => p.currentPrice < p.initialPrice).length ?? 0;
  const priceIncreases = products?.filter(p => p.currentPrice > p.initialPrice).length ?? 0;
  
  // Alertes si baisse de prix > 30% par rapport au prix initial
  const alerts = products?.filter(p => {
    if (p.initialPrice === 0) return false;
    const dropPercentage = (p.initialPrice - p.currentPrice) / p.initialPrice;
    return dropPercentage > 0.30;
  }).length ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Produits suivis"
        value={totalProducts}
        subtext="Nombre total de produits suivis"
        icon={Package}
        iconBgColor="bg-indigo-50"
        iconColor="text-indigo-600"
      />
      <StatCard
        title="Baisses de prix"
        value={priceDrops}
        subtext="Par rapport au prix initial"
        icon={TrendingDown}
        iconBgColor="bg-emerald-50"
        iconColor="text-emerald-600"
      />
      <StatCard
        title="Alertes actives"
        value={alerts}
        subtext="Baisse de prix > 30%"
        icon={BellRing}
        iconBgColor="bg-amber-50"
        iconColor="text-amber-600"
      />
      <StatCard
        title="Prix en hausse"
        value={priceIncreases}
        subtext="Par rapport au prix initial"
        icon={TrendingUp}
        iconBgColor="bg-rose-50"
        iconColor="text-rose-600"
      />
    </div>
  );
}
