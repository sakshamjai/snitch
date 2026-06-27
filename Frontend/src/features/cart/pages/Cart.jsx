import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useCart } from '../hook/useCart';
import { Link, useNavigate } from 'react-router';
import Navbar from '../../auth/components/Navbar';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,' + btoa(`
<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="#1a1a1a"/>
  <text x="200" y="200" font-family="Inter, sans-serif" font-size="14" fill="#3a342a" text-anchor="middle" dominant-baseline="middle">No Image</text>
</svg>
`);

const formatPrice = (amount, currency = 'INR') => {
  const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥' };
  const symbol = symbols[currency] || currency;
  return `${symbol}${amount?.toLocaleString('en-IN')}`;
};

/* ── Cart Item Component ── */
const CartItem = ({ item, index, handleIncrementCartItem }) => {
  const product = item.product;
  const imageUrl = product?.images?.[0]?.url || PLACEHOLDER_IMAGE;
  const title = product?.title || 'Untitled Product';
  const price = item.price || product?.price;

  // Find variant attributes for display
  const variant = product?.variants?.find(v => v._id === item.variant);
  const variantAttributes = variant?.attributes || {};
  const attributeEntries = variantAttributes instanceof Map
    ? Array.from(variantAttributes.entries())
    : Object.entries(variantAttributes);

  const lineTotal = (price?.amount || 0) * (item.quantity || 1);

  return (
    <div
      className="group relative flex gap-4 sm:gap-5 p-4 sm:p-5 rounded-lg bg-[#111111] border border-[#2a2a2a]/60 hover:border-[#b8860b]/20 transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms` }}
      id={`cart-item-${item._id}`}
    >
      {/* Product Image */}
      <div className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 overflow-hidden rounded-md bg-[#0e0e0e] border border-[#2a2a2a]/30">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Subtle gold shimmer on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#b8860b]/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        {/* Top Row: Title + Price */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-white truncate leading-tight">
              {title}
            </h3>
            {/* Variant attributes */}
            {attributeEntries.length > 0 && (
              <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                {attributeEntries.map(([key, val]) => (
                  <span key={key} className="text-[11px] sm:text-xs text-[#6b6560] font-medium">
                    {key}: <span className="text-[#8a7a60]">{val}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* Unit price */}
          <span className="text-sm sm:text-base font-bold text-[#c9a84c] whitespace-nowrap flex-shrink-0">
            {formatPrice(price?.amount, price?.currency)}
          </span>
        </div>

        {/* Bottom Row: Quantity + Line Total */}
        <div className="flex items-center justify-between mt-3 sm:mt-2">
          {/* Quantity Controls */}
          <div className="flex items-center gap-0 border border-[#2a2a2a] rounded-md overflow-hidden">
            <button
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-[#6b6560] hover:text-[#c9a84c] hover:bg-[#b8860b]/5 transition-all duration-200 cursor-pointer active:scale-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#b8860b]"
              aria-label={`Decrease quantity of ${title}`}
              id={`decrement-${item._id}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <span className="w-9 sm:w-10 h-8 sm:h-9 flex items-center justify-center text-xs sm:text-sm font-bold text-[#e5e2e1] border-x border-[#2a2a2a] select-none bg-[#0e0e0e]/50">
              {item.quantity || 1}
            </span>
            <button
              onClick = {() => {
                handleIncrementCartItem();
              }}
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-[#6b6560] hover:text-[#c9a84c] hover:bg-[#b8860b]/5 transition-all duration-200 cursor-pointer active:scale-90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#b8860b]"
              aria-label={`Increase quantity of ${title}`}
              id={`increment-${item._id}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>

          {/* Line Total */}
          <span className="text-sm sm:text-base font-bold text-white">
            {formatPrice(lineTotal, price?.currency)}
          </span>
        </div>
      </div>

      {/* Remove button — top right corner */}
      <button
        className="absolute top-3 right-3 sm:top-4 sm:right-4 w-6 h-6 flex items-center justify-center text-[#3a342a] hover:text-red-400/70 transition-colors duration-200 opacity-0 group-hover:opacity-100 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400/50 rounded"
        aria-label={`Remove ${title} from cart`}
        id={`remove-${item._id}`}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};

/* ── Main Cart Page ── */
const Cart = () => {
  const cartItems = useSelector(state => state.cart.items);
  const { handleGetCart, handleIncrementCartItem } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        await handleGetCart();
      } catch (err) {
        console.error('Failed to fetch cart:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const amount = item.price?.amount || item.product?.price?.amount || 0;
    const qty = item.quantity || 1;
    return sum + amount * qty;
  }, 0);

  const currency = cartItems[0]?.price?.currency || cartItems[0]?.product?.price?.currency || 'INR';
  const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // ── Loading Skeleton ──
  if (loading) {
    return (
      <div className="min-h-dvh flex flex-col bg-[#0a0a0a] text-[#e5e2e1]">
        <Navbar />
        <main className="flex-1 pt-[72px] sm:pt-[80px] pb-8">
          <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10">
            {/* Title skeleton */}
            <div className="h-8 skeleton-shimmer rounded w-48 mb-8" />

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8">
              {/* Items skeleton */}
              <div className="flex flex-col gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-4 p-5 rounded-lg bg-[#111111] border border-[#2a2a2a]/40">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 skeleton-shimmer rounded-md flex-shrink-0" />
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="h-5 skeleton-shimmer rounded w-3/4 mb-2" />
                        <div className="h-3 skeleton-shimmer rounded w-1/3" />
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <div className="h-9 w-28 skeleton-shimmer rounded" />
                        <div className="h-5 w-16 skeleton-shimmer rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Summary skeleton */}
              <div className="p-6 rounded-lg bg-[#111111] border border-[#2a2a2a]/40 h-fit">
                <div className="h-6 skeleton-shimmer rounded w-40 mb-6" />
                <div className="flex flex-col gap-4">
                  <div className="h-4 skeleton-shimmer rounded w-full" />
                  <div className="h-4 skeleton-shimmer rounded w-full" />
                  <div className="h-px bg-[#2a2a2a] my-2" />
                  <div className="h-6 skeleton-shimmer rounded w-full" />
                  <div className="h-12 skeleton-shimmer rounded w-full mt-4" />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Empty Cart State ──
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-dvh flex flex-col bg-[#0a0a0a] text-[#e5e2e1]">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-[60px] sm:pt-[68px]">
          <div className="text-center animate-fade-in-up px-4">
            {/* Empty cart icon */}
            <div className="w-20 h-20 mb-6 rounded-full bg-[#111111] border border-[#2a2a2a] flex items-center justify-center mx-auto">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#6b6560" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </div>
            <h1 className="font-['Playfair_Display'] text-2xl sm:text-3xl font-bold text-white mb-2">
              Your cart is empty
            </h1>
            <p className="text-sm sm:text-base text-[#6b6560] mb-8 max-w-sm mx-auto">
              Looks like you haven't added anything to your cart yet. Explore our collection to find something you love.
            </p>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#b8860b] text-[#0a0a0a] font-bold text-xs uppercase tracking-[0.18em] hover:bg-[#c9a84c] active:scale-[0.97] transition-all duration-300 cursor-pointer shadow-[0_0_30px_rgba(184,134,11,0.15)] hover:shadow-[0_0_40px_rgba(184,134,11,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8860b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
              id="continue-shopping-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Continue Shopping
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ── Cart with Items ──
  return (
    <div className="min-h-dvh flex flex-col bg-[#0a0a0a] text-[#e5e2e1]">
      <Navbar />

      <main className="flex-1 pt-[72px] sm:pt-[80px] pb-8 sm:pb-12">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10">

          {/* ── Page Header ── */}
          <div className="mb-6 sm:mb-8 animate-fade-in-up">
            {/* Back link */}
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.15em] font-bold text-[#6b6560] hover:text-[#c9a84c] transition-colors mb-4 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#b8860b] rounded"
              id="back-to-shop-btn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Continue Shopping
            </button>

            <div className="flex items-baseline gap-3">
              <h1 className="font-['Playfair_Display'] text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                Your Cart
              </h1>
              <span className="text-xs sm:text-sm font-medium text-[#6b6560]">
                ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </span>
            </div>
          </div>

          {/* ── Content Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 items-start">

            {/* ── Cart Items List ── */}
            <div className="flex flex-col gap-3 sm:gap-4" id="cart-items-list">
              {cartItems.map((item, index) => (
                <CartItem key={item._id} item={item} index={index} handleIncrementCartItem = {() => {
                  handleIncrementCartItem({productId: item.product._id, variantId: item.variant})
                }} />
              ))}
            </div>

            {/* ── Order Summary Sidebar ── */}
            <div
              className="lg:sticky lg:top-[88px] p-5 sm:p-6 rounded-lg bg-[#111111] border border-[#2a2a2a]/60 animate-fade-in-up"
              style={{ animationDelay: '150ms' }}
              id="order-summary"
            >
              <h2 className="text-xs uppercase tracking-[0.18em] font-bold text-[#8a7a60] mb-5">
                Order Summary
              </h2>

              {/* Summary rows */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6b6560] font-medium">Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                  <span className="text-sm font-semibold text-[#e5e2e1]">{formatPrice(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#6b6560] font-medium">Shipping</span>
                  <span className="text-xs uppercase tracking-wider font-bold text-[#4a8c3f]">Free</span>
                </div>
              </div>

              {/* Divider */}
              <div className="my-5 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent" />

              {/* Total */}
              <div className="flex justify-between items-baseline mb-6">
                <span className="text-sm uppercase tracking-[0.12em] font-bold text-[#e5e2e1]">Total</span>
                <span className="text-xl sm:text-2xl font-bold text-[#c9a84c] tracking-tight">
                  {formatPrice(subtotal, currency)}
                </span>
              </div>

              {/* Tax note */}
              <p className="text-[10px] text-[#3a342a] font-medium mb-5">
                Tax included. Shipping calculated at checkout.
              </p>

              {/* Make Payment Button */}
              <button
                className="w-full py-3.5 sm:py-4 bg-[#b8860b] text-[#0a0a0a] font-bold text-xs sm:text-sm uppercase tracking-[0.18em] hover:bg-[#c9a84c] active:scale-[0.98] transition-all duration-300 cursor-pointer shadow-[0_0_30px_rgba(184,134,11,0.12)] hover:shadow-[0_0_40px_rgba(184,134,11,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b8860b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] rounded-md"
                id="make-payment-btn"
              >
                Make Payment
              </button>

              {/* Security badges */}
              <div className="flex items-center justify-center gap-4 mt-5 pt-4 border-t border-[#2a2a2a]/40">
                <div className="flex items-center gap-1.5 text-[10px] text-[#3a342a] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                  Secure Checkout
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-[#3a342a] font-medium">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Protected
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Cart;