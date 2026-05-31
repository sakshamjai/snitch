import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { userProduct } from '../hook/useProduct';

const SellerDashboard = () => {
  const { handleGetSellerProducts } = userProduct();
  const products = useSelector((state) => state.product.sellerProducts);

  useEffect(() => {
    handleGetSellerProducts();
  }, []);

  const formatPrice = (price) => {
    const symbol =
      price.currency === 'INR'
        ? '₹'
        : price.currency === 'USD'
          ? '$'
          : price.currency === 'EUR'
            ? '€'
            : price.currency === 'GBP'
              ? '£'
              : price.currency === 'JPY'
                ? '¥'
                : '';
    return `${symbol}${price.amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="h-screen overflow-hidden bg-[#0a0a0a] text-[#e5e2e1] flex flex-col">

      {/* ── Decorative Watermark ── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 flex items-center justify-center pointer-events-none select-none z-0"
      >
        <span className="text-[80vh] font-black text-[#b8860b] opacity-[0.03] leading-none">
          S
        </span>
      </div>

      {/* ── Navbar ── */}
      <nav className="w-full z-50 shrink-0 flex justify-between items-center px-4 sm:px-8 lg:px-12 py-3 bg-[#0d0d0d]/80 backdrop-blur-xl border-b border-[#b8860b]/10">
        <span className="text-xl sm:text-2xl font-black tracking-tight text-[#c9a84c] select-none">
          SNITCH
        </span>
        <div className="flex items-center gap-4 sm:gap-8">
          <a
            href="/"
            className="text-[10px] sm:text-[11px] uppercase tracking-widest font-medium text-[#e5e2e1]/50 hover:text-[#c9a84c] transition-colors duration-200"
          >
            Back to site
          </a>
          <a
            href="/seller/create-product"
            className="text-[10px] sm:text-[11px] uppercase tracking-widest font-medium text-[#e5e2e1]/50 hover:text-[#c9a84c] transition-colors duration-200"
          >
            Create Product
          </a>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col overflow-hidden px-4 sm:px-8 lg:px-12 py-4 sm:py-6 relative z-10">

        {/* ── Header ── */}
        <header className="shrink-0 flex items-center justify-between mb-4 sm:mb-5">
          <div className="flex items-center gap-3">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-tight">
              Your Products
            </h1>
            <span className="px-2.5 py-0.5 bg-[#b8860b]/10 border border-[#b8860b]/30 rounded-full text-[#c9a84c] text-[10px] font-bold tracking-[0.15em] uppercase">
              {products.length} {products.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>
        </header>

        {/* ── Product Grid ── */}
        <div className="flex-1 overflow-hidden">
          {products.length === 0 ? (
            /* ── Empty State ── */
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-[#111111] border border-[#b8860b]/15 flex items-center justify-center mb-5">
                <svg className="w-9 h-9 text-[#b8860b]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-sm text-[#6b6560] mb-1">No products listed yet</p>
              <p className="text-xs text-[#3a342a]">
                <a href="/seller/create-product" className="text-[#c9a84c] hover:underline underline-offset-2">
                  Create your first product
                </a>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 h-full auto-rows-fr">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="group relative bg-[#111111] border border-[#b8860b]/10 rounded-xl overflow-hidden hover:border-[#b8860b]/40 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(184,134,11,0.08)] flex flex-col"
                >
                  {/* ── Product Image ── */}
                  <div className="aspect-[4/3] overflow-hidden bg-[#0e0e0e] relative shrink-0">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0].url}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      /* ── No Image Placeholder ── */
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                          <svg className="w-10 h-10 text-[#b8860b]/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                          </svg>
                          <span className="text-[10px] text-[#3a342a] uppercase tracking-wider font-medium">No Image</span>
                        </div>
                        <div className="absolute inset-4 border border-dashed border-[#b8860b]/10 rounded-lg pointer-events-none" />
                      </div>
                    )}
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-60 pointer-events-none" />

                    {/* Image count badge */}
                    {product.images && product.images.length > 1 && (
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-[#0a0a0a]/80 backdrop-blur-sm rounded-full text-[9px] text-[#c9a84c] font-medium tracking-wider border border-[#b8860b]/20">
                        {product.images.length} photos
                      </div>
                    )}
                  </div>

                  {/* ── Product Info ── */}
                  <div className="p-3.5 sm:p-4 flex flex-col flex-1 min-h-0">
                    <h3 className="text-[13px] sm:text-sm font-semibold text-[#e5e2e1] truncate mb-1">
                      {product.title}
                    </h3>
                    <p className="text-[11px] text-[#6b6560] line-clamp-2 leading-relaxed mb-auto">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-[#b8860b]/8">
                      <span className="text-sm font-bold text-[#c9a84c]">
                        {formatPrice(product.price)}
                      </span>
                      <span className="text-[9px] text-[#3a342a] uppercase tracking-widest font-medium">
                        {product.price.currency}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="shrink-0 z-10 border-t border-[#b8860b]/10 bg-[#0d0d0d]/60 px-4 sm:px-8 lg:px-12 py-2.5">
        <p className="text-center text-[9px] sm:text-[10px] text-[#3a3428] uppercase tracking-widest">
          © 2025 Snitch. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default SellerDashboard;