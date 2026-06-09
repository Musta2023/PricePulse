import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Product {
  name: string;
  initialPrice: number;
  currentPrice: number;
}

interface PriceAnalyticsChartProps {
  products: Product[];
}

export const PriceAnalyticsChart = ({ products }: PriceAnalyticsChartProps) => {
  // Sort by absolute price difference and take top 3
  const chartData = [...products]
    .sort((a, b) => Math.abs(b.initialPrice - b.currentPrice) - Math.abs(a.initialPrice - a.currentPrice))
    .slice(0, 3)
    .map(p => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      initial: p.initialPrice,
      current: p.currentPrice,
    }));

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
      <h2 className="text-lg font-bold text-slate-800">Top 3 Analyse des prix</h2>
      <p className="text-sm text-slate-500 mb-6">
        Top 3 des produits avec les plus fortes variations de prix.
      </p>
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="initial" name="Prix initial" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
            <Bar dataKey="current" name="Prix actuel" fill="#4F46E5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
