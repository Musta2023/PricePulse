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
  const chartData = products.map(p => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
    initial: p.initialPrice,
    current: p.currentPrice,
  }));

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
      <h2 className="text-lg font-bold text-slate-800">Analyse des prix</h2>
      <p className="text-sm text-slate-500 mb-6">
        Visualisez l'évolution des prix des produits suivis afin d'identifier rapidement les meilleures opportunités.
      </p>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="initial" name="Prix initial" fill="#CBD5E1" />
            <Bar dataKey="current" name="Prix actuel" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
