import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hook/useProduct';
import Navbar from '../components/Navbar.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { useNavigate } from 'react-router';

const SellerDashboard = () => {
  const { handleGetSellerProducts } = useProduct();
  const products = useSelector((state) => state.product.sellerProducts);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        await handleGetSellerProducts();
      } catch (error) {
        console.error('Failed to fetch seller products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] text-[#e5e2e1] overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Main Content — fills remaining height */}
      <main className="flex-1 flex flex-col min-h-0 pt-[60px] sm:pt-[68px]">
        {/* Section Header */}
        <div className="shrink-0 px-5 sm:px-8 lg:px-12 xl:px-16 pt-6 pb-4 sm:pt-8 sm:pb-5 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-semibold text-white leading-tight tracking-tight">
              Your Products
            </h1>
            <div className="w-50 h-[5px] bg-[#b8860b] mt-2" />
          </div>
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            {!loading && products && products.length > 0 && (
              <span className="text-[15px] text-[#6b6560] font-bold tracking-wider uppercase hidden sm:block">
                {products.length} {products.length === 1 ? 'item' : 'items'}
              </span>
            )}
            <a
              href="/seller/create-product"
              className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-bold text-[#c9a84c] hover:text-[#b8860b] transition-colors duration-200 border border-[#b8860b]/30 px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-[#b8860b]/5"
            >
              + Create Product
            </a>
          </div>
        </div>

        {/* Product Grid — scrollable area */}
        <div className="flex-1 min-h-0 overflow-y-auto products-scroll px-5 sm:px-8 lg:px-12 xl:px-16 pb-6 sm:pb-8">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col">
                  <div className="aspect-[3/4] skeleton-shimmer rounded mb-3" />
                  <div className="h-3.5 skeleton-shimmer rounded w-3/4 mb-1.5" />
                  <div className="h-3 skeleton-shimmer rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
              {products.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index}
                onClick = {
                  () => {
                    navigate(`/seller/product/${product._id}`);
                  }
                }
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-14 h-14 mb-5 rounded-full bg-[#111111] border border-[#2a2a2a] flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6b6560" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
              </div>
              <p className="text-[#6b6560] text-sm">No products listed yet.</p>
              <p className="text-[#3a342a] text-[11px] mt-1">
                <a href="/seller/create-product" className="text-[#c9a84c] hover:underline underline-offset-2">
                  Create your first product
                </a>
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SellerDashboard;