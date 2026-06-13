import React, { useState } from 'react';

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

/**
 * Product overview section — image gallery + product info.
 * 
 * Props:
 * - product: { title, description, price: { amount, currency }, images: [{ url }] }
 * - compact: boolean — when true, renders a compact layout suited for a sidebar/left-pane
 */
const ProductOverview = ({ product, compact = false }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [imageTransition, setImageTransition] = useState(false);

  const images = product?.images?.length > 0
    ? product.images
    : [{ url: PLACEHOLDER_IMAGE, _id: 'placeholder' }];

  const currentImage = images[selectedImage]?.url || PLACEHOLDER_IMAGE;

  const handleImageSelect = (index) => {
    if (index === selectedImage) return;
    setImageTransition(true);
    setTimeout(() => {
      setSelectedImage(index);
      setImageTransition(false);
    }, 200);
  };

  // ── Compact (sidebar) layout ──
  if (compact) {
    return (
      <div className="flex flex-col gap-4 h-full animate-fade-in-up">
        {/* Main image */}
        <div className="relative overflow-hidden rounded-xl bg-[#111111] border border-[#2a2a2a]/30 group" style={{ aspectRatio: '3/4', maxHeight: '52vh' }}>
          <img
            src={currentImage}
            alt={product.title}
            className={`w-full h-full object-contain transition-all duration-500 ease-out group-hover:scale-[1.03] ${
              imageTransition ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
            }`}
          />
          <div className="absolute inset-0 bg-[#b8860b]/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          {images.length > 1 && (
            <div className="absolute top-2.5 right-2.5 bg-[#0a0a0a]/70 backdrop-blur-sm text-[#c9a84c] text-[10px] font-bold tracking-wider px-2 py-0.5 rounded">
              {selectedImage + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 products-scroll shrink-0">
            {images.map((image, index) => (
              <button
                key={image._id || index}
                onClick={() => handleImageSelect(index)}
                className={`relative w-12 h-14 overflow-hidden rounded-lg cursor-pointer transition-all duration-300 active:scale-95 flex-shrink-0 ${
                  selectedImage === index
                    ? 'border-2 border-[#b8860b] opacity-100'
                    : 'border border-[#2a2a2a]/40 opacity-50 hover:opacity-90 hover:border-[#b8860b]/50 grayscale hover:grayscale-0'
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

        {/* Product info */}
        <div className="flex flex-col gap-2 shrink-0 pt-1">
          {/* Title */}
          <h1 className="font-['Playfair_Display'] text-2xl xl:text-3xl font-extrabold text-white leading-tight tracking-tight">
            {product.title}
          </h1>
          {/* Price */}
          <p className="text-[#c9a84c] text-xl xl:text-2xl font-bold tracking-tight">
            {formatPrice(product.price?.amount, product.price?.currency)}
          </p>
          {/* Description */}
          <p className="text-xs sm:text-sm text-[#6b6560] leading-relaxed font-medium line-clamp-4">
            {product.description}
          </p>
        </div>
      </div>
    );
  }

  // ── Full (standalone page) layout ──
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 mb-10 lg:mb-16 animate-fade-in-up">
      {/* Left — Image Gallery */}
      <div className="flex flex-col gap-3">
        {/* Main image */}
        <div className="relative overflow-hidden rounded-lg bg-[#111111] border border-[#2a2a2a]/20 group aspect-[4/5]">
          <img
            src={currentImage}
            alt={product.title}
            className={`w-full h-full object-contain transition-all duration-500 ease-out group-hover:scale-[1.03] ${
              imageTransition ? 'opacity-0 scale-[0.98]' : 'opacity-100 scale-100'
            }`}
          />
          {/* Gold overlay on hover */}
          <div className="absolute inset-0 bg-[#b8860b]/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute top-2.5 right-2.5 bg-[#0a0a0a]/70 backdrop-blur-sm text-[#c9a84c] text-[11px] font-bold tracking-wider px-2 py-0.5 rounded">
              {selectedImage + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div className="flex gap-2 sm:gap-2.5 overflow-x-auto pb-1 products-scroll">
            {images.map((image, index) => (
              <button
                key={image._id || index}
                onClick={() => handleImageSelect(index)}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 lg:w-[72px] lg:h-[72px] overflow-hidden rounded cursor-pointer transition-all duration-300 active:scale-95 flex-shrink-0 ${
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

      {/* Right — Product Info */}
      <div className="flex flex-col justify-center gap-4 lg:gap-5">
        <h1 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[1.1] tracking-tight">
          {product.title}
        </h1>

        <p className="text-[#c9a84c] text-xl sm:text-2xl lg:text-[28px] font-bold tracking-tight">
          {formatPrice(product.price?.amount, product.price?.currency)}
        </p>

        <p className="text-sm sm:text-base text-[#6b6560] leading-relaxed font-medium max-w-lg">
          {product.description}
        </p>
      </div>
    </section>
  );
};

export default ProductOverview;
