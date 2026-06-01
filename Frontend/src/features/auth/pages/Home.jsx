import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useProduct } from '../hook/useProduct.js';
import Navbar from '../components/Navbar.jsx';
import ProductCard from '../components/ProductCard.jsx';

const Home = () => {
  const products = useSelector((state) => state.product.products);
  const { handleGetAllProducts } = useProduct();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        await handleGetAllProducts();
      } catch (error) {
        console.error('Failed to fetch products:', error);
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
            <h1 className="font-['Playfair_Display'] text-2xl sm:text-3xl lg:text-[34px] font-semibold text-white leading-tight tracking-tight">
              All Products
            </h1>
            <div className="w-10 h-px bg-[#b8860b] mt-2" />
          </div>
          {!loading && products && products.length > 0 && (
            <span className="text-[11px] text-[#6b6560] tracking-wider uppercase shrink-0">
              {products.length} {products.length === 1 ? 'item' : 'items'}
            </span>
          )}
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
                <ProductCard key={product._id} product={product} index={index} />
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
              <p className="text-[#6b6560] text-sm">No products available yet.</p>
              <p className="text-[#3a342a] text-[11px] mt-1">Check back soon for new arrivals.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;