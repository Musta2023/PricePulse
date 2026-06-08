import type { Product } from "../api/products";
import { ArrowUp, ArrowDown, ExternalLink, Trash2, Minus } from "lucide-react";

interface Props {
    products: Product[],
    onDelete: (id: number) => void
}

function TrendIndicator({ current, initial }: { current: number; initial: number }) {
    const diff = current - initial;
    const percent = initial === 0 ? (diff === 0 ? 0 : Infinity) : (diff / Math.abs(initial)) * 100;

    if (percent === Infinity) {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200" title="Changement infini">
                <Minus size={14} /> —
            </span>
        );
    }

    // Price went UP (Bad for buyers -> Red/Rose)
    if (percent > 0) {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-100" title={`+${percent.toFixed(2)}%`}>
                <ArrowUp size={14} className="text-rose-500" />
                +{percent.toFixed(2)}%
            </span>
        );
    }

    // Price went DOWN (Good for buyers -> Green/Emerald)
    if (percent < 0) {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100" title={`${percent.toFixed(2)}%`}>
                <ArrowDown size={14} className="text-emerald-500" />
                {Math.abs(percent).toFixed(2)}%
            </span>
        );
    }

    // No Change (Neutral -> Slate)
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-50 text-slate-600 border border-slate-200" title="0%">
            <Minus size={14} /> 0.00%
        </span>
    );
}

export default function ProductList({ products, onDelete }: Props) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                    <tr>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Nom de produit
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                            URL
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Prix Initial
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Prix Actuel
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Tendance %
                        </th>
                        <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-100">
                    {products.map(p => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">
                                {p.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <a
                                    href={p.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition-colors"
                                >
                                    <span className="truncate max-w-[150px]">{p.url.replace(/^https?:\/\/(www\.)?/, '')}</span>
                                    <ExternalLink size={12} className="shrink-0" />
                                </a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">
                                {p.initialPrice.toFixed(2)} €
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <span className={`font-bold ${p.currentPrice < p.initialPrice ? 'text-emerald-600' : p.currentPrice > p.initialPrice ? 'text-rose-600' : 'text-slate-700'}`}>
                                    {p.currentPrice.toFixed(2)} €
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <TrendIndicator current={p.currentPrice} initial={p.initialPrice} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => onDelete(p.id)}
                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 inline-flex"
                                    title="Supprimer"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
