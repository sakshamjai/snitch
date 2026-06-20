import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { useProduct } from '../hook/useProduct';
import { useCart } from '../../cart/hook/useCart.js';
import Navbar from '../components/Navbar';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,' + btoa(`
<svg width="600" height="750" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="750" fill="#1a1a1a"/>
  <text x="300" y="375" font-family="Inter, sans-serif" font-size="16" fill="#3a342a" text-anchor="middle" dominant-baseline="middle">No Image</text>
</svg>
`);

const formatPrice = (amount, currency) => {
  const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };
  const symbol = symbols[currency] || currency;
  return `${symbol}${amount?.toLocaleString('en-IN')}`;
};

// ── Helper: extract all unique attribute keys + their possible values from variants ──
const buildAttributeMap = (variants = []) => {
  const map = {}; // { size: Set(['S','M','L']), color: Set(['Black','White']) }
  variants.forEach(v => {
    const attrs = v.attributes || {};
    const entries = attrs instanceof Map ? Array.from(attrs.entries()) : Object.entries(attrs);
    entries.forEach(([key, val]) => {
      if (!map[key]) map[key] = new Set();
      map[key].add(val);
    });
  });
  // Convert Sets to sorted arrays
  return Object.fromEntries(
    Object.entries(map).map(([k, s]) => [k, Array.from(s)])
  );
};

// ── Helper: find the variant that matches ALL currently selected attributes ──
const findMatchingVariant = (variants = [], selectedAttrs = {}) => {
  if (Object.keys(selectedAttrs).length === 0) return null;
  return variants.find(v => {
    const attrs = v.attributes || {};
    const entries = attrs instanceof Map ? Array.from(attrs.entries()) : Object.entries(attrs);
    const vAttrs = Object.fromEntries(entries);
    return Object.entries(selectedAttrs).every(([k, val]) => vAttrs[k] === val);
  }) ?? null;
};

// ── Helper: is a specific attribute value available given currently selected attrs ──
const isValueAvailable = (variants = [], selectedAttrs = {}, checkKey, checkVal) => {
  return variants.some(v => {
    const attrs = v.attributes || {};
    const entries = attrs instanceof Map ? Array.from(attrs.entries()) : Object.entries(attrs);
    const vAttrs = Object.fromEntries(entries);
    // Check this value matches AND all OTHER already-selected attributes also match
    if (vAttrs[checkKey] !== checkVal) return false;
    return Object.entries(selectedAttrs).every(([k, val]) => {
      if (k === checkKey) return true; // skip the key we're currently testing
      return vAttrs[k] === val;
    });
  });
};

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageTransition, setImageTransition] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState({}); // { size: 'M', color: 'Black' }
  const { handleGetProductById } = useProduct();
  const { handleAddItem } = useCart();
  const navigate = useNavigate();

  async function fetchProductDetail() {
    try {
      setLoading(true);
      const data = await handleGetProductById(productId);
      setProduct(data);
      setSelectedAttributes({}); // reset on new product
    } catch (error) {
      console.log("Failed to fetch product details: ", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProductDetail();
  }, [productId]);

  // ── Derive matched variant from selected attributes ──
  const variants = product?.variants || [];
  const attributeMap = buildAttributeMap(variants);      // { size: ['S','M','L'], color: ['Black','White'] }
  const attributeKeys = Object.keys(attributeMap);       // ['size', 'color']
  const matchedVariant = findMatchingVariant(variants, selectedAttributes);
  const allAttrsSelected = attributeKeys.length > 0 && attributeKeys.every(k => selectedAttributes[k]);

  // ── Derived display values ──
  const displayImages = matchedVariant?.images?.length > 0
    ? matchedVariant.images
    : product?.images;
  const displayPrice = matchedVariant?.price?.amount
    ? matchedVariant.price
    : product?.price;
  const isOutOfStock = allAttrsSelected && matchedVariant?.stock === 0;
  const hasVariants = variants.length > 0;

  const images = displayImages?.length > 0
    ? displayImages
    : [{ url: PLACEHOLDER_IMAGE, _id: 'placeholder' }];

  const currentImage = images[selectedImage]?.url || PLACEHOLDER_IMAGE;

  // ── Image transitions ──
  const handleImageSelect = (index) => {
    if (index === selectedImage) return;
    setImageTransition(true);
    setTimeout(() => {
      setSelectedImage(index);
      setImageTransition(false);
    }, 200);
  };

  // Reset to image 0 with fade whenever matched variant changes
  useEffect(() => {
    setImageTransition(true);
    const t = setTimeout(() => {
      setSelectedImage(0);
      setImageTransition(false);
    }, 200);
    return () => clearTimeout(t);
  }, [matchedVariant]);

  // ── Attribute chip click handler ──
  const handleAttributeSelect = (key, val) => {
    setSelectedAttributes(prev => {
      // Toggle off if clicking the already-selected value
      if (prev[key] === val) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: val };
    });
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="h-dvh flex flex-col bg-[#0a0a0a] text-[#e5e2e1] overflow-hidden">
        <Navbar />
        <main className="flex-1 flex items-center min-h-0 pt-[60px] sm:pt-[68px]">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-4 md:py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 lg:gap-12 items-center">
              <div className="flex flex-col gap-3">
                <div className="aspect-[4/3] md:aspect-[4/5] skeleton-shimmer rounded-lg" />
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 skeleton-shimmer rounded" />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="h-8 md:h-10 skeleton-shimmer rounded w-3/4" />
                <div className="h-6 md:h-8 skeleton-shimmer rounded w-1/4" />
                <div className="h-4 skeleton-shimmer rounded w-full" />
                <div className="h-4 skeleton-shimmer rounded w-2/3" />
                {/* Variant chips skeleton */}
                <div className="flex flex-col gap-3 pt-1">
                  <div className="h-3 skeleton-shimmer rounded w-16" />
                  <div className="flex gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-9 w-14 skeleton-shimmer rounded" />
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <div className="h-11 md:h-12 skeleton-shimmer rounded flex-1" />
                  <div className="h-11 md:h-12 skeleton-shimmer rounded flex-1" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="h-dvh flex flex-col bg-[#0a0a0a] text-[#e5e2e1] overflow-hidden">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-[60px] sm:pt-[68px]">
          <div className="text-center">
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
              onClick={() => navigate('/')}
              className="mt-5 px-6 py-2.5 border border-[#b8860b] text-[#c9a84c] font-bold text-sm uppercase tracking-widest hover:bg-[#b8860b]/5 active:scale-[0.98] transition-all cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-dvh flex flex-col bg-[#0a0a0a] text-[#e5e2e1] overflow-hidden">
      <Navbar />

      {/* Main content fills remaining space below navbar */}
      <main className="flex-1 flex items-center min-h-0 pt-[60px] sm:pt-[68px]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20 py-3 sm:py-4 md:py-0">
          <div className="grid grid-cols-1 md:grid-cols-[55%_45%] gap-4 sm:gap-5 md:gap-8 lg:gap-12 xl:gap-16 items-center">

            {/* ── Left: Product Images ── */}
            <div className="flex flex-col gap-2.5 sm:gap-3 animate-fade-in-up">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-lg bg-[#111111] border border-[#2a2a2a]/20 group
                              h-[40vh] sm:h-[42vh] md:h-[60vh] lg:h-[68vh] xl:h-[72vh]">
                <img
                  src={currentImage}
                  alt={product.title}
                  className={`w-full h-full object-contain transition-all duration-500 ease-out group-hover:scale-[1.03] ${
                    imageTransition ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
                  }`}
                />
                {/* Subtle gold overlay on hover */}
                <div className="absolute inset-0 bg-[#b8860b]/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Image counter badge */}
                {images.length > 1 && (
                  <div className="absolute top-2.5 right-2.5 bg-[#0a0a0a]/70 backdrop-blur-sm text-[#c9a84c] text-[11px] font-bold tracking-wider px-2 py-0.5 rounded">
                    {selectedImage + 1} / {images.length}
                  </div>
                )}

                {/* Variant active badge */}
                {matchedVariant && (
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-[#0a0a0a]/70 backdrop-blur-sm px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
                    <span className="text-[#c9a84c] text-[10px] font-bold tracking-wider uppercase">Variant</span>
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <div className="flex gap-2 sm:gap-2.5 justify-start">
                  {images.map((image, index) => (
                    <button
                      key={image._id || index}
                      onClick={() => handleImageSelect(index)}
                      className={`relative w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-[72px] lg:h-[72px] overflow-hidden rounded cursor-pointer transition-all duration-300 active:scale-95 flex-shrink-0 ${
                        selectedImage === index
                          ? 'border-2 border-[#b8860b] opacity-100'
                          : 'border border-[#2a2a2a]/40 opacity-60 hover:opacity-100 hover:border-[#b8860b]/50 grayscale hover:grayscale-0'
                      }`}
                      aria-label={`View image ${index + 1}`}
                    >
                      <img
                        src={image.url}
                        alt={`${product.title} - View ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Right: Product Information ── */}
            <div className="flex flex-col gap-3 sm:gap-4 md:gap-5 lg:gap-6 animate-fade-in-up p-2" style={{ animationDelay: '100ms' }}>

              {/* Product Title */}
              <h1 className="font-['Playfair_Display'] text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[56px] font-extrabold text-white leading-[1.1] tracking-tight">
                {product.title}
              </h1>

              {/* Price — updates live when a variant is matched */}
              <div className="flex items-baseline gap-3">
                <p className="text-xl sm:text-2xl md:text-[28px] lg:text-[32px] font-bold text-[#c9a84c] tracking-tight">
                  {formatPrice(displayPrice?.amount, displayPrice?.currency)}
                </p>
                {/* Strikethrough base price when variant has a different price */}
                {matchedVariant?.price?.amount && matchedVariant.price.amount !== product.price?.amount && (
                  <span className="text-base sm:text-lg text-[#3a342a] font-medium line-through">
                    {formatPrice(product.price?.amount, product.price?.currency)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-[17px] text-[#6b6560] leading-relaxed font-medium max-w-lg">
                {product.description}
              </p>

              {/* ── Variant Attribute Selectors ── */}
              {hasVariants && attributeKeys.length > 0 && (
                <div className="flex flex-col gap-4">
                  {attributeKeys.map(attrKey => (
                    <div key={attrKey}>
                      {/* Attribute label + selected value */}
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-[#8a7a60]">
                          {attrKey}
                        </span>
                        {selectedAttributes[attrKey] && (
                          <span className="text-[10px] text-[#c9a84c] font-semibold">
                            — {selectedAttributes[attrKey]}
                          </span>
                        )}
                      </div>

                      {/* Value chips */}
                      <div className="flex flex-wrap gap-2">
                        {attributeMap[attrKey].map(val => {
                          const isSelected = selectedAttributes[attrKey] === val;
                          const available = isValueAvailable(variants, selectedAttributes, attrKey, val);

                          return (
                            <button
                              key={val}
                              onClick={() => available && handleAttributeSelect(attrKey, val)}
                              disabled={!available}
                              className={`
                                relative px-4 py-2 text-[11px] uppercase tracking-[0.12em] font-bold
                                border rounded transition-all duration-200 cursor-pointer
                                ${isSelected
                                  ? 'bg-[#b8860b]/10 border-[#b8860b] text-[#c9a84c] shadow-[0_0_12px_rgba(184,134,11,0.15)]'
                                  : available
                                    ? 'bg-transparent border-[#2a2a2a] text-[#e5e2e1]/70 hover:border-[#b8860b]/50 hover:text-[#c9a84c]/80'
                                    : 'bg-transparent border-[#1e1e1e] text-[#3a342a] cursor-not-allowed'
                                }
                              `}
                              aria-label={`Select ${attrKey}: ${val}`}
                            >
                              {val}
                              {/* Diagonal strike for unavailable */}
                              {!available && (
                                <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                  <span className="w-full h-px bg-[#2a2a2a] rotate-[-20deg] block" />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Out of stock / selection prompt */}
                  {allAttrsSelected && isOutOfStock && (
                    <p className="text-[11px] uppercase tracking-[0.15em] font-bold text-red-500/70">
                      ✕ Out of Stock
                    </p>
                  )}
                  {!allAttrsSelected && (
                    <p className="text-[11px] text-[#3a342a] font-medium">
                      Select {attributeKeys.filter(k => !selectedAttributes[k]).join(' & ')} to continue
                    </p>
                  )}
                </div>
              )}

              {/* ── Action Buttons ── */}
              <div className="flex flex-row gap-3 sm:gap-4 p-1 md:p-2 sm:p-2">
                <button
                  onClick = {() => {
                    handleAddItem({productId: product._id, variantId: matchedVariant?._id})
                  }}
                  disabled={isOutOfStock || (hasVariants && !allAttrsSelected)}
                  className={`
                    flex-1 px-4 sm:px-6 py-3 sm:py-3.5 md:py-4
                    border font-bold text-xs sm:text-sm uppercase tracking-[0.12em] sm:tracking-[0.15em]
                    transition-all cursor-pointer active:scale-[0.98]
                    ${isOutOfStock || (hasVariants && !allAttrsSelected)
                      ? 'border-[#2a2a2a] text-[#3a342a] cursor-not-allowed'
                      : 'border-[#b8860b] text-[#c9a84c] hover:bg-[#b8860b]/5'
                    }
                  `}
                >
                  Add to Cart
                </button>
                <button
                  disabled={isOutOfStock || (hasVariants && !allAttrsSelected)}
                  className={`
                    flex-1 px-4 sm:px-6 py-3 sm:py-3.5 md:py-4
                    font-bold text-xs sm:text-sm uppercase tracking-[0.12em] sm:tracking-[0.15em]
                    transition-all cursor-pointer active:scale-[0.98]
                    ${isOutOfStock || (hasVariants && !allAttrsSelected)
                      ? 'bg-[#1a1a1a] text-[#3a342a] cursor-not-allowed'
                      : 'bg-[#b8860b] text-[#0a0a0a] hover:bg-[#c9a84c] shadow-[0_0_24px_rgba(184,134,11,0.15)]'
                    }
                  `}
                >
                  {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ProductDetail