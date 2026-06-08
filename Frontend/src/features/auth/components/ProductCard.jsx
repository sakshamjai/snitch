import React from 'react';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,' + btoa(`
<svg width="400" height="530" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="530" fill="#1a1a1a"/>
  <text x="200" y="265" font-family="Inter, sans-serif" font-size="14" fill="#3a342a" text-anchor="middle" dominant-baseline="middle">No Image</text>
</svg>
`);

const ProductCard = ({ product, index = 0, onClick }) => {
  const { title, description, price, images } = product;
  const imageUrl = images && images.length > 0 ? images[0].url : PLACEHOLDER_IMAGE;
  const hasImage = images && images.length > 0;

  const formatPrice = (amount, currency) => {
    const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };
    const symbol = symbols[currency] || currency;
    return `${symbol}${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div
      onClick = {onClick}
      className="group flex flex-col opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${(index % 8) * 80}ms` }}
    >
      {/* Image */}
      <div className="relative aspect-[3/4]  bg-[#111111] rounded mb-2.5 sm:mb-3 border border-[#2a2a2a]/20">
        <img
          src={imageUrl}
          alt={title}
          className={`w-full h-full transition-transform duration-500 ease-out group-hover:scale-[1.04] object-contain`}
          loading="lazy"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-[#b8860b]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />

        {/* Quick add */}
        <button
          className="absolute bottom-2.5 right-2.5 bg-[#0a0a0a]/75 backdrop-blur-sm p-2 rounded-full text-[#c9a84c] translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-250 hover:bg-[#b8860b] hover:text-[#0a0a0a] cursor-pointer"
          aria-label={`Add ${title} to cart`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        </button>

        {/* Multi-image badge */}
        {images && images.length > 1 && (
          <div className="absolute top-2 right-2 bg-[#0a0a0a]/60 backdrop-blur-sm text-[#c9a84c] text-[9px] font-medium tracking-wider px-1.5 py-0.5 rounded-sm">
            1/{images.length}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex justify-between items-start gap-2 px-0.5">
        <h3 className="text-xs sm:text-[13px] font-medium text-[#e5e2e1] group-hover:text-[#c9a84c] transition-colors duration-200 leading-snug line-clamp-1">
          {title}
        </h3>
        <span className="text-xs sm:text-[13px] font-semibold text-[#c9a84c] whitespace-nowrap shrink-0">
          {formatPrice(price.amount, price.currency)}
        </span>
      </div>
      <p className="text-[10px] sm:text-[11px] text-[#6b6560] line-clamp-1 mt-0.5 px-0.5">
        {description}
      </p>
    </div>
  );
};

export default ProductCard;
