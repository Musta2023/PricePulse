import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Activity, AlertCircle, Info, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useProduct, useCreateProduct, useDeleteProduct } from './hooks/useProducts';
import ProductForm from './components/productForm';
import ProductList from './components/productList';

function App() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, isFetching } = useProduct(page);
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();

  // Modern Error State
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-red-200 p-6 rounded-2xl shadow-sm max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-800 mb-2">Connection Error</h2>
          <p className="text-slate-600 text-sm">
            Failed to load products. Please ensure your backend is running on <code className="bg-slate-100 px-1 py-0.5 rounded text-red-600">http://localhost:3000</code>.
          </p>
        </div>
      </div>
    );
  }

  const handleAdd = (url: string, initialPrice: number) => {
    createProduct.mutate({ url, initialPrice });
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteProduct.mutate(id);
    }
  };

  const products = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-12">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shadow-sm shadow-indigo-200">
              <Activity className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              PricePulse
            </h1>
          </div>

          {/* Real-time Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold border border-emerald-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Updates
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">

        {/* Info Banner */}
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 mb-8 flex gap-4 items-start shadow-sm">
          <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-indigo-900">How tracking works</h3>
            <p className="text-sm text-indigo-700 mt-1 leading-relaxed">
              Prices are simulated and updated automatically every 5 seconds (±5% fluctuation). <br className="hidden sm:block" />
              Watch for <span className="font-semibold text-emerald-600">Green</span> indicators for price drops and <span className="font-semibold text-rose-600">Red</span> for price hikes.
            </p>
          </div>
        </div>

        {/* Action Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800">Add Product to Watchlist</h2>
            <p className="text-sm text-slate-500">Enter a URL and its starting price to begin monitoring.</p>
          </div>
          <ProductForm onSubmit={handleAdd} isLoading={createProduct.isPending} />
        </div>

        {/* Data List Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          {/* Header of the List */}
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800">Tracked Products</h2>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              {isFetching && !isLoading && (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin text-indigo-500" />
                  Refreshing...
                </>
              )}
            </div>
          </div>

          {/* List Content */}
          <div className="p-0 min-h-[300px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin mb-4 text-indigo-500" />
                <p>Loading your products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[300px] text-slate-500 text-center px-4">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                  <Activity className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="font-semibold text-slate-700 mb-1">No products tracked</h3>
                <p className="text-sm">Add your first product using the form above.</p>
              </div>
            ) : (
              <ProductList products={products} onDelete={handleDelete} />
            )}
          </div>

          {/* Pagination Footer */}
          {pagination && products.length > 0 && (
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <p className="text-sm text-slate-600 font-medium">
                Page {pagination.page} of {pagination.pages}
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-700 transition-all shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </button>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= pagination.pages}
                  className="flex items-center gap-1 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-indigo-600 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-700 transition-all shadow-sm"
                >
                  Next
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
          className: 'bg-slate-800 text-white shadow-lg rounded-xl',
          duration: 3000,
        }}
      />
    </div>
  );
}

export default App;
