import React, { useState } from 'react';
import { useAuth } from '../hook/useAuth';
import { useNavigate } from 'react-router';
const inputClass =
  'bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-[#e5e2e1] placeholder-[#3a342a] w-full outline-none transition-all duration-200 focus:border-[#b8860b] focus:shadow-[0_0_0_3px_rgba(184,134,11,0.1)]';

const labelClass =
  'text-[10px] uppercase tracking-[0.18em] font-bold text-[#8a7a60]';

const Register = () => {
  const navigate = useNavigate();
  const { handleRegister }= useAuth();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    contact: '',
    password: '',
    isSeller: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleRegister({
      email: formData.email,
      contact: formData.contact,
      password: formData.password,
      fullname: formData.fullname,
      isSeller: formData.isSeller,
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-[#0a0a0a] text-[#e5e2e1] flex flex-col">

      {/* ── Navbar ── */}
      <nav className="w-full z-50 shrink-0 flex justify-between items-center px-6 sm:px-10 lg:px-14 py-4 bg-[#0d0d0d]/80 backdrop-blur-xl border-b border-[#b8860b]/10">
        <span className="text-xl sm:text-2xl font-black tracking-tight text-[#c9a84c] select-none">
          SNITCH
        </span>
        <div className="flex items-center gap-6 sm:gap-8">
          <a
            href="#"
            className="text-[10px] sm:text-[11px] uppercase tracking-widest font-medium text-[#e5e2e1]/50 hover:text-[#c9a84c] transition-colors duration-200"
          >
            Back to site
          </a>
          <a
            href="#"
            className="hidden sm:block text-[11px] uppercase tracking-widest font-medium text-[#e5e2e1]/50 hover:text-[#c9a84c] transition-colors duration-200"
          >
            Login
          </a>
        </div>
      </nav>

      {/* ── Body ── */}
      <div className="flex flex-1 lg:overflow-hidden">

        {/* ── LEFT PANEL (desktop only) ── */}
        <aside className="hidden lg:flex flex-col justify-between w-[42%] xl:w-[45%] relative bg-[#0e0e0e] border-r border-[#b8860b]/10 px-14 xl:px-20 py-14 overflow-hidden">

          {/* Decorative watermark */}
          <div
            aria-hidden="true"
            className="absolute -bottom-16 -left-10 text-[38vw] xl:text-[34vw] font-black text-[#b8860b] opacity-[0.04] leading-none select-none pointer-events-none"
          >
            S
          </div>

          {/* Top brand copy */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#b8860b]/70 font-semibold mb-6">
              Welcome to Snitch
            </p>
            <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight">
              Dress to
              <br />
              <span className="text-[#c9a84c]">Impress.</span>
            </h2>
            <p className="mt-5 text-sm text-[#6b6560] leading-relaxed max-w-xs">
              Join thousands of fashion-forward shoppers. Exclusive drops, early access, and curated collections — all in one place.
            </p>
          </div>

          {/* Feature list */}
          <ul className="flex flex-col gap-4 relative z-10">
            {[
              ['⚡', 'Early access to new drops'],
              ['🎁', 'Members-only offers & discounts'],
              ['📦', 'Free shipping on first order'],
            ].map(([icon, text]) => (
              <li key={text} className="flex items-center gap-3">
                <span className="text-base">{icon}</span>
                <span className="text-[13px] text-[#9a8a70]">{text}</span>
              </li>
            ))}
          </ul>

          {/* Bottom quote */}
          <div className="relative z-10 border-l-2 border-[#b8860b]/40 pl-4">
            <p className="text-xs italic text-[#6b6560]">
              "Fashion is the armor to survive the reality of everyday life."
            </p>
            <p className="text-[10px] tracking-wider text-[#b8860b]/60 mt-1 uppercase">— Bill Cunningham</p>
          </div>
        </aside>

        {/* ── RIGHT PANEL — Form ── */}
        <main className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10 lg:py-0 lg:overflow-y-auto">

          <div className="w-full max-w-sm sm:max-w-md lg:max-w-[420px] xl:max-w-[440px]">

            {/* Mobile watermark (hidden on lg) */}
            <div
              aria-hidden="true"
              className="lg:hidden fixed inset-0 flex items-center justify-center text-[70vw] font-black text-[#b8860b] opacity-[0.03] pointer-events-none select-none z-0 leading-none"
            >
              S
            </div>

            {/* Form card */}
            <div className="relative z-10 bg-[#111111] border border-[#b8860b]/15 rounded-2xl px-7 sm:px-9 py-8 sm:py-9 shadow-[0_0_80px_rgba(0,0,0,0.9)]">

              {/* Header */}
              <header className="mb-7">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Create Account
                </h1>
                <p className="text-[12px] text-[#b8860b] font-medium mt-1">
                  Join the SNITCH family today
                </p>
              </header>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reg-fullname" className={labelClass}>Full Name</label>
                  <input
                    id="reg-fullname"
                    name="fullname"
                    type="text"
                    value={formData.fullname}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    required
                    className={inputClass}
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reg-email" className={labelClass}>Email Address</label>
                  <input
                    id="reg-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. john@snitch.com"
                    required
                    className={inputClass}
                  />
                </div>

                {/* Contact + Password side by side on sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="reg-contact" className={labelClass}>Contact</label>
                    <input
                      id="reg-contact"
                      name="contact"
                      type="tel"
                      value={formData.contact}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      required
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="reg-password" className={labelClass}>Password</label>
                    <input
                      id="reg-password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Min. 8 characters"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Seller Checkbox */}
                <label htmlFor="reg-seller" className="flex items-center gap-3 cursor-pointer group mt-1">
                  <span className="relative">
                    <input
                      id="reg-seller"
                      name="isSeller"
                      type="checkbox"
                      checked={formData.isSeller}
                      onChange={handleChange}
                      className="peer sr-only"
                    />
                    <span className="flex h-4 w-4 rounded-sm border border-[#4f4535] bg-[#1a1a1a] transition-all duration-200 peer-checked:bg-[#b8860b] peer-checked:border-[#b8860b] items-center justify-center">
                      <svg
                        className="hidden peer-checked:block w-2.5 h-2.5 text-[#0a0a0a]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  </span>
                  <span className="text-[12px] text-[#8a7a60] group-hover:text-[#d3c4af] transition-colors">
                    Register as a seller
                  </span>
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full mt-2 bg-[#b8860b] hover:bg-[#9c7209] active:scale-[0.98] text-[#0a0a0a] font-extrabold text-[11px] sm:text-[12px] uppercase tracking-[0.25em] py-3.5 sm:py-4 rounded-lg transition-all duration-200 cursor-pointer shadow-[0_0_24px_rgba(184,134,11,0.25)] hover:shadow-[0_0_32px_rgba(184,134,11,0.35)]"
                >
                  Create Account
                </button>

                {/* Sign In */}
                <p className="text-center text-[12px] text-[#5a5048] mt-1">
                  Already have an account?{' '}
                  <a
                    href="/login"
                    className="text-[#c9a84c] font-semibold hover:underline underline-offset-2 transition-all"
                  >
                    Sign In
                  </a>
                </p>

              </form>
            </div>

            {/* Footer text — below card on mobile, hidden on desktop */}
            <p className="lg:hidden text-center text-[10px] text-[#3a3428] uppercase tracking-widest mt-6">
              © 2025 Snitch. All rights reserved.
            </p>
          </div>
        </main>
      </div>

    </div>
  );
};

export default Register;