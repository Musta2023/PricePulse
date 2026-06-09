 import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Activity, LogOut, Package, TrendingDown, BellRing, TrendingUp, Link, Tag, Plus, Loader2 } from 'lucide-react';
import { useProduct, useCreateProduct, useDeleteProduct } from './hooks/useProducts';
import ProductList from './components/productList';
import ProductForm from './components/productForm';
import AuthForm from './components/authForm';
import { DashboardStats } from './components/DashboardStats';
import { PriceAnalyticsChart } from './components/PriceAnalyticsChart';

interface User {
  id: number;
  email: string;
  name: string;
}

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const { data, isLoading, error } = useProduct(token ? 1 : -1);
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();

  const handleAuthSuccess = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <AuthForm onSuccess={handleAuthSuccess} />
        <Toaster position="bottom-right" />
      </div>
    );
  }

  const products = data?.data || [];

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-900 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PricePulse</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-rose-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Dashboard Section */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">AI-powered price monitoring is active. Prices are checked automatically.</p>
          </div>
          <DashboardStats products={products} />
        </section>

        {/* Analytics Section */}
        <PriceAnalyticsChart products={products} />

        {/* Tracked Items Table */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Ajouter un produit</h2>
            <ProductForm onSubmit={(url, price, name) => createProduct.mutate({ url, initialPrice: price, name })} isLoading={createProduct.isPending} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Produits suivis</h2>
          {isLoading ? (
            <p>Chargement...</p>
          ) : (
            <ProductList products={products} onDelete={(id) => deleteProduct.mutate(id)} />
          )}
        </section>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
