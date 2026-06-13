import React from 'react';

const formatPrice = (amount, currency) => {
  const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };
  const symbol = symbols[currency] || currency;
  return `${symbol}${amount?.toLocaleString('en-IN')}`;
};

/**
 * Individual variant card with thumbnail, attribute badges, price, and stock input.
 * 
 * Props:
 * - variant: { images, attributes, price, stock }
 * - index: number
 * - isSelected: boolean — highlights this card as the active variant
 * - onSelect: (index) => void — called when card is clicked
 * - onStockChange: (index, newStock) => void
 */
const VariantCard = ({ variant, index, isSelected = false, onSelect, onStockChange }) => {
  const thumbUrl = variant.images?.[0]?.url || null;
  const attributes = variant.attributes || {};

  // Handle both Map-like objects and plain objects from the backend
  const attributeEntries = attributes instanceof Map
    ? Array.from(attributes.entries())
    : Object.entries(attributes);

  return (
    <div
      onClick={() => onSelect?.(index)}
      className={`
        relative bg-[#111111] border rounded-lg flex flex-col
        cursor-pointer transition-all duration-200
        ${isSelected
          ? 'border-[#b8860b] shadow-[0_0_0_1px_rgba(184,134,11,0.4),0_0_24px_rgba(184,134,11,0.12)]'
          : 'border-[#2a2a2a] hover:border-[#3a3a3a] hover:shadow-[0_0_20px_rgba(184,134,11,0.04)]'
        }
      `}
    >
      {/* Active selection ring indicator (top edge) */}
      {isSelected && (
        <div className="absolute inset-x-0 top-0 h-[2px] rounded-t-lg bg-gradient-to-r from-[#b8860b]/60 via-[#c9a84c] to-[#b8860b]/60" />
      )}

      {/* Top — Thumbnail + Attributes + Price */}
      <div className="p-4 sm:p-5 flex gap-4">
        {/* Variant thumbnail */}
        <div className={`w-14 h-[70px] sm:w-16 sm:h-20 rounded overflow-hidden shrink-0 transition-all duration-200 ${
          isSelected
            ? 'border-2 border-[#b8860b]/60 bg-[#1a1a1a]'
            : 'border border-[#2a2a2a]/40 bg-[#1a1a1a]'
        }`}>
          {thumbUrl ? (
            <img src={thumbUrl} alt="Variant" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-5 h-5 text-[#3a342a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
              </svg>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Attribute badges */}
          {attributeEntries.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {attributeEntries.map(([key, val]) => (
                <span
                  key={key}
                  className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-medium transition-colors duration-200 ${
                    isSelected
                      ? 'bg-[#b8860b]/10 border border-[#b8860b]/25 text-[#c9a84c]/90'
                      : 'bg-[#1a1a1a] border border-[#2a2a2a]/50 text-[#e5e2e1]/70'
                  }`}
                >
                  <span className={isSelected ? 'text-[#b8860b]/70' : 'text-[#6b6560]'}>{key}:</span> {val}
                </span>
              ))}
            </div>
          )}

          {/* Price */}
          <p className={`text-sm font-semibold transition-colors duration-200 ${isSelected ? 'text-[#c9a84c]' : 'text-[#c9a84c]'}`}>
            {variant.price?.amount
              ? formatPrice(variant.price.amount, variant.price.currency)
              : 'Base Price'}
          </p>

          {/* Selected label */}
          {isSelected && (
            <p className="text-[9px] uppercase tracking-[0.15em] text-[#b8860b] font-bold mt-1.5">
              ● Active
            </p>
          )}
        </div>
      </div>

      {/* Bottom — Stock input */}
      <div
        onClick={(e) => e.stopPropagation()} // don't trigger card select when editing stock
        className={`mt-auto border-t rounded-b-lg px-4 sm:px-5 py-3 flex items-center justify-between transition-colors duration-200 ${
          isSelected ? 'border-[#b8860b]/20 bg-[#0e0e0e]' : 'border-[#2a2a2a]/40 bg-[#0e0e0e]'
        }`}
      >
        <label className="text-[9px] uppercase tracking-[0.15em] font-bold text-[#6b6560]">
          Stock
        </label>
        <input
          type="number"
          value={variant.stock || 0}
          onChange={(e) => onStockChange(index, e.target.value)}
          className={`w-20 bg-transparent border-b py-1 text-right focus:outline-none text-[#e5e2e1] text-base font-semibold transition-colors ${
            isSelected ? 'border-[#b8860b]/40 focus:border-[#b8860b]' : 'border-[#2a2a2a] focus:border-[#b8860b]'
          }`}
          min="0"
        />
      </div>
    </div>
  );
};

export default VariantCard;
