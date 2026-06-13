import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useProduct } from '../hook/useProduct';
import Navbar from '../components/Navbar';
import ProductOverview from '../components/ProductOverview';
import VariantCard from '../components/VariantCard';
import CreateVariantForm from '../components/CreateVariantForm';

const SellerProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [localVariants, setLocalVariants] = useState([]);
  const [isAddingVariant, setIsAddingVariant] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(null);

  // Derived — null means show base product data
  const selectedVariant = selectedVariantIdx !== null ? localVariants[selectedVariantIdx] ?? null : null;

  const { productId } = useParams();
  const navigate = useNavigate();
  const { handleGetProductById, handleAddProductVariant } = useProduct();

  const fetchProductDetails = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedProduct = await handleGetProductById(productId);
      setProduct(fetchedProduct);
      if (fetchedProduct?.variants) {
        setLocalVariants(fetchedProduct.variants);
      }
      setSelectedVariantIdx(null); // reset selection on fresh fetch
    } catch (error) {
      console.error('Failed to fetch product details:', error);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  const handleStockChange = (index, newStock) => {
    setLocalVariants(prev =>
      prev.map((v, i) => i === index ? { ...v, stock: Number(newStock) } : v)
    );
  };

  const handleSaveVariant = async (variantData) => {
    await handleAddProductVariant(productId, variantData);
    setIsAddingVariant(false);
    await fetchProductDetails(); // also resets selectedVariantIdx inside
  };

  const handleVariantSelect = (idx) => {
    // Toggle off if clicking the already-selected variant
    setSelectedVariantIdx(prev => (prev === idx ? null : idx));
  };

  // ─── Loading Skeleton ───
  if (loading) {
    return (
      <div className="h-dvh flex flex-col bg-[#0a0a0a] text-[#e5e2e1] overflow-hidden">
        <Navbar />
        <div className="flex-1 flex overflow-hidden pt-[60px] sm:pt-[68px]">
          {/* Left skeleton */}
          <div className="hidden lg:flex w-[42%] xl:w-[40%] flex-col gap-4 p-6 xl:p-8 border-r border-[#1e1e1e] overflow-y-auto">
            <div className="aspect-[3/4] skeleton-shimmer rounded-xl w-full" />
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-14 h-14 skeleton-shimmer rounded-lg" />
              ))}
            </div>
            <div className="h-8 skeleton-shimmer rounded w-3/4 mt-2" />
            <div className="h-6 skeleton-shimmer rounded w-1/3" />
            <div className="h-4 skeleton-shimmer rounded w-full" />
            <div className="h-4 skeleton-shimmer rounded w-2/3" />
          </div>
          {/* Right skeleton */}
          <div className="flex-1 flex flex-col gap-4 p-6 xl:p-8 overflow-y-auto">
            <div className="h-8 skeleton-shimmer rounded w-1/3 mb-2" />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 skeleton-shimmer rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── Not Found State ───
  if (!product) {
    return (
      <div className="h-dvh flex flex-col bg-[#0a0a0a] text-[#e5e2e1] overflow-hidden">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center px-6">
            <div className="w-14 h-14 mb-5 rounded-full bg-[#111111] border border-[#2a2a2a] flex items-center justify-center mx-auto">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b6560" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </div>
            <p className="text-[#6b6560] text-base font-bold">Product not found</p>
            <p className="text-[#3a342a] text-sm mt-1.5">The product you're looking for doesn't exist.</p>
            <button
              onClick={() => navigate('/seller/dashboard')}
              className="mt-5 px-6 py-2.5 border border-[#b8860b] text-[#c9a84c] font-bold text-sm uppercase tracking-widest hover:bg-[#b8860b]/5 active:scale-[0.98] transition-all cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ─── Main Content ───
  return (
    <div className="h-dvh flex flex-col bg-[#0a0a0a] text-[#e5e2e1] overflow-hidden">
      <Navbar />

      {/* Body — two-pane split below fixed navbar */}
      <div className="flex-1 flex overflow-hidden pt-[60px] sm:pt-[68px]">

        {/* ── LEFT PANE — Product Overview (desktop only) ── */}
        <aside className="hidden lg:flex flex-col w-[42%] xl:w-[40%] border-r border-[#1e1e1e] overflow-y-auto">
          <div className="p-6 xl:p-8 flex-1">
            <ProductOverview product={product} selectedVariant={selectedVariant} compact />
          </div>
        </aside>

        {/* ── RIGHT PANE — Variants & Inventory ── */}
        <main className="flex-1 flex flex-col overflow-hidden">

          {/* Mobile: product summary strip (reflects selected variant) */}
          <div className="lg:hidden px-4 sm:px-6 pt-4 pb-3 border-b border-[#1e1e1e] flex items-center gap-3 shrink-0">
            {(() => {
              const mobileImg = selectedVariant?.images?.[0]?.url || product.images?.[0]?.url;
              const mobilePrice = selectedVariant?.price?.amount ? selectedVariant.price : product.price;
              return (
                <>
                  {mobileImg && (
                    <img
                      src={mobileImg}
                      alt={product.title}
                      className="w-10 h-12 object-cover rounded border border-[#2a2a2a] transition-all duration-300"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <h1 className="text-sm font-bold text-white truncate">{product.title}</h1>
                    <p className="text-xs text-[#c9a84c] font-semibold mt-0.5">
                      {mobilePrice?.currency === 'INR' ? '₹' : mobilePrice?.currency}
                      {mobilePrice?.amount?.toLocaleString('en-IN')}
                      {selectedVariant && (
                        <span className="ml-1.5 text-[9px] uppercase tracking-wider text-[#b8860b] font-bold">Variant</span>
                      )}
                    </p>
                  </div>
                  {selectedVariant && (
                    <button
                      onClick={() => setSelectedVariantIdx(null)}
                      className="text-[#6b6560] hover:text-[#e5e2e1] text-[9px] uppercase tracking-wider font-bold transition-colors cursor-pointer shrink-0"
                    >
                      Reset
                    </button>
                  )}
                </>
              );
            })()}
          </div>

          {/* Scrollable variants area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 xl:px-8 py-5 xl:py-6">

            {/* Section header */}
            <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-[#2a2a2a]">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Variants &amp; Inventory
                </h2>
                <p className="text-[11px] text-[#6b6560] mt-0.5">
                  {localVariants.length} variant{localVariants.length !== 1 ? 's' : ''} · Manage sizes, colors &amp; stock
                </p>
              </div>
              {!isAddingVariant && (
                <button
                  onClick={() => setIsAddingVariant(true)}
                  className="shrink-0 px-4 py-2 border border-[#b8860b]/30 text-[#c9a84c] text-[10px] uppercase tracking-[0.15em] font-bold hover:bg-[#b8860b]/5 hover:text-[#b8860b] hover:border-[#b8860b]/60 transition-all cursor-pointer flex items-center gap-1.5 rounded"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Variant
                </button>
              )}
            </div>

            {/* Create Variant Form */}
            {isAddingVariant && (
              <CreateVariantForm
                onSave={handleSaveVariant}
                onCancel={() => setIsAddingVariant(false)}
              />
            )}

            {/* Variant Grid or Empty State */}
            {localVariants.length === 0 && !isAddingVariant ? (
              <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in-up">
                <div className="w-12 h-12 mb-4 rounded-full bg-[#111111] border border-[#2a2a2a] flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b6560" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 01-8 0" />
                  </svg>
                </div>
                <p className="text-[#6b6560] text-sm font-medium">No variants yet</p>
                <p className="text-[#3a342a] text-[11px] mt-1">
                  <button
                    onClick={() => setIsAddingVariant(true)}
                    className="text-[#c9a84c] hover:underline underline-offset-2 cursor-pointer"
                  >
                    Create your first variant
                  </button>
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
                {localVariants.map((variant, idx) => (
                  <VariantCard
                    key={variant._id || idx}
                    variant={variant}
                    index={idx}
                    isSelected={selectedVariantIdx === idx}
                    onSelect={handleVariantSelect}
                    onStockChange={handleStockChange}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerProductDetail;