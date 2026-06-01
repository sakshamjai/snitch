import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#0e0e0e] border-t border-[#b8860b]/10">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-20 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <span className="font-['Playfair_Display'] text-2xl font-bold text-[#c9a84c] mb-4 tracking-tight">
              SNITCH
            </span>
            <p className="text-[13px] text-[#6b6560] leading-relaxed text-center md:text-left max-w-xs">
              Curating the future of premium fashion through timeless elegance and modern innovation.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {['Instagram', 'Twitter', 'LinkedIn'].map((social) => (
              <a
                key={social}
                href="#"
                className="text-sm text-[#6b6560] hover:text-[#c9a84c] transition-colors duration-300"
              >
                {social}
              </a>
            ))}
          </div>

          {/* Legal */}
          <div className="text-center md:text-right">
            <p className="text-xs text-[#6b6560]">
              © {new Date().getFullYear()} SNITCH. All rights reserved.
            </p>
            <div className="mt-3 flex gap-6 justify-center md:justify-end">
              <a
                href="#"
                className="text-[10px] uppercase tracking-[0.15em] font-medium text-[#6b6560] hover:text-[#c9a84c] transition-colors duration-300"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-[10px] uppercase tracking-[0.15em] font-medium text-[#6b6560] hover:text-[#c9a84c] transition-colors duration-300"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
