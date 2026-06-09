import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Activity, AlertCircle, Info, ChevronLeft, ChevronRight, RefreshCw, LogOut } from 'lucide-react';
import { useProduct, useCreateProduct, useDeleteProduct } from './hooks/useProducts';
import ProductForm from './components/productForm';
import ProductList from './components/productList';
import AuthForm from './components/authForm';
import ConfirmationModal from './components/ConfirmationModal';
import DashboardStats from './components/DashboardStats';

function App() {
  const [page, setPage] = useState(1);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || 'null'));
  const [deleteModal, setDeleteModal] = useState<{isOpen: boolean, productId: number | null}>({isOpen: false, productId: null});

  const { data, isLoading, error, isFetching } = useProduct(token ? page : -1);
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();

  const handleAuthSuccess = (newToken: string, newUser: any) => {
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <AuthForm onSuccess={handleAuthSuccess} />
        <Toaster position="bottom-right" />
      </div>
    );
  }

  // Modern Error State
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-red-200 p-6 rounded-2xl shadow-sm max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-800 mb-2">Erreur de connexion</h2>
          <p className="text-slate-600 text-sm">
            Impossible de charger les produits. Veuillez vérifier que votre backend est bien lancé sur <code className="bg-slate-100 px-1 py-0.5 rounded text-red-600">http://localhost:3000</code>.
          </p>
        </div>
      </div>
    );
  }

  const handleAdd = (url: string, initialPrice: number, name: string) => {
    createProduct.mutate({ url, initialPrice, name });
  };

  const confirmDelete = () => {
    if (deleteModal.productId) {
      deleteProduct.mutate(deleteModal.productId);
      setDeleteModal({ isOpen: false, productId: null });
    }
  };

  const products = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans pb-12">
      <ConfirmationModal 
        isOpen={deleteModal.isOpen}
        title="Supprimer le produit"
        message="Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, productId: null })}
      />
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg text-white shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-[#0F172A] tracking-tight">
              PricePulse
            </h1>
          </div>

          <div className="flex items-center gap-6">
            {/* Real-time Indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-success rounded-full text-xs font-semibold border border-emerald-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
               live
            </div>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-[#0F172A]">{user?.name}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-danger hover:bg-rose-50 rounded-lg transition-colors"
                title="Déconnexion"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* Page Title & Subtitle */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-[#0F172A] tracking-tight">Tableau de bord</h2>
          <p className="text-slate-500 mt-1 text-xs">Surveillez l'évolution des prix et identifiez rapidement les meilleures opportunités.</p>
        </div>

        {/* KPI Section */}
        <DashboardStats products={products} />

        {/* Info Banner */}
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-4 mb-8 flex gap-4 items-start shadow-sm">
          <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-indigo-900">Comment fonctionne le suivi</h3>
            <p className="text-sm text-indigo-700 mt-1 leading-relaxed">
              Les prix sont simulés et mis à jour automatiquement toutes les 5 secondes (fluctuation de ±5%). <br className="hidden sm:block" />
              Surveillez les indicateurs <span className="font-semibold text-success">Verts</span> pour les baisses de prix et <span className="font-semibold text-danger">Rouges</span> pour les hausses.
            </p>
          </div>
        </div>

        {/* Action Section */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800">Ajouter un produit à surveiller</h2>
            <p className="text-sm text-slate-500">Entrez une URL et son prix de départ pour commencer la surveillance.</p>
          </div>
          <ProductForm onSubmit={handleAdd} isLoading={createProduct.isPending} />
        </div>

        {/* Data List Section */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          {/* Header of the List */}
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Produits suivis</h2>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              {isFetching && !isLoading && (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin text-indigo-500" />
                  Actualisation...
                </>
              )}
            </div>
          </div>

          {/* List Content */}
          <div className="p-0 min-h-[300px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin mb-4 text-indigo-500" />
                <p>Chargement de vos produits...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-slate-500 text-center px-4">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                  <Activity className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="font-semibold text-slate-700 mb-1">Aucun produit suivi</h3>
                <p className="text-sm">Ajoutez votre premier produit en utilisant le formulaire ci-dessus.</p>
              </div>
            ) : (
              <ProductList products={products} onDelete={(id) => setDeleteModal({isOpen: true, productId: id})} />
            )}
          </div>

          {/* Pagination Footer */}
          {pagination && products.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <p className="text-sm text-slate-600 font-medium">
                Page {pagination.page} sur {pagination.pages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p: number) => p - 1)}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-700 transition-all shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Précédent
                </button>
                <button
                  onClick={() => setPage((p: number) => p + 1)}
                  disabled={page >= pagination.pages}
                  className="flex items-center gap-1 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-md text-sm font-medium hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-700 transition-all shadow-sm"
                >
                  Suivant
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'border border-slate-200 shadow-xl rounded-xl',
          duration: 3000,
        }}
      />
    </div>
  );
}

export default App;
