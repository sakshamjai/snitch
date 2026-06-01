import React from 'react';
import { useNavigate } from 'react-router';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-50 nav-blur bg-[#0a0a0a]/90 border-b border-[#b8860b]/10">
      <div className="flex justify-between items-center px-5 sm:px-8 lg:px-12 xl:px-16 h-[60px] sm:h-[68px] w-full">
        {/* Brand */}
        <a
          onClick={() => navigate('/')}
          className="font-['Playfair_Display'] text-xl sm:text-2xl font-bold text-[#c9a84c] tracking-tight cursor-pointer select-none"
        >
          SNITCH
        </a>

        {/* Cart */}
        <button className="relative text-[#c9a84c]/70 hover:text-[#c9a84c] transition-colors active:scale-95" aria-label="Cart">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          <span className="absolute -top-1.5 -right-1.5 bg-[#b8860b] text-[#0a0a0a] text-[8px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full">
            0
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

