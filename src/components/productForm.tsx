import { useState } from 'react';
import { Link, Plus, Loader2 } from 'lucide-react';

interface Props {
    onSubmit: (url: string, price: number, name: string) => void;
    isLoading: boolean;
}

export default function ProductForm({ onSubmit, isLoading }: Props) {
    const [url, setUrl] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const priceNum = parseFloat(price);
        if (!url || isNaN(priceNum) || priceNum <= 0) return;
        onSubmit(url, priceNum, name);
        setUrl('');
        setName('');
        setPrice('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
            {/* URL Input Container */}
            <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link className="h-4 w-4 text-slate-400" />
                </div>
                <input
                    type="url"
                    placeholder="URL du produit"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
            </div>

            {/* Name Input Container */}
            <div className="relative w-full md:w-48 shrink-0">
                <input
                    type="text"
                    placeholder="Nom du produit"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
            </div>

            {/* Price Input Container */}
            <div className="relative w-full md:w-32 shrink-0">
                <input
                    type="number"
                    step="0.01"
                    placeholder="Prix"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm shadow-indigo-200 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Plus className="w-4 h-4" />
                )}
                <span>Ajouter</span>
            </button>
        </form>
    );
}
