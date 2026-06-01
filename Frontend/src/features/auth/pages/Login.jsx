import React, { useState } from 'react';
import { useAuth } from '../hook/useAuth';
import { useNavigate } from 'react-router';
import ContinueWithGoogle from '../components/ContinueWithGoogle';

const inputClass =
  'bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-[#e5e2e1] placeholder-[#3a342a] w-full outline-none transition-all duration-200 focus:border-[#b8860b] focus:shadow-[0_0_0_3px_rgba(184,134,11,0.1)]';

const labelClass =
  'text-[10px] uppercase tracking-[0.18em] font-bold text-[#8a7a60]';

const Login = () => {
  const navigate = useNavigate();
  const { handleLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const user = await handleLogin({ email: formData.email, password: formData.password });
      if(user.role == 'buyer'){
        navigate('/');
      }
      else if (user.role == 'seller'){
        navigate('/seller/dashboard')
      }
    }
    catch(error){
      console.log("Login failed", error);
    };
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
            href="/register"
            className="hidden sm:block text-[11px] uppercase tracking-widest font-medium text-[#e5e2e1]/50 hover:text-[#c9a84c] transition-colors duration-200"
          >
            Register
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
              Welcome Back
            </p>
            <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight">
              Style
              <br />
              <span className="text-[#c9a84c]">Never Stops.</span>
            </h2>
            <p className="mt-5 text-sm text-[#6b6560] leading-relaxed max-w-xs">
              Sign back in to continue your journey. Your wishlist, orders, and exclusive drops are waiting for you.
            </p>
          </div>

          {/* Feature list */}
          <ul className="flex flex-col gap-4 relative z-10">
            {[
              ['🔒', 'Your account, your style'],
              ['🛍️', 'Pick up where you left off'],
              ['⚡', 'Instant access to new drops'],
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
              "In order to be irreplaceable, one must always be different."
            </p>
            <p className="text-[10px] tracking-wider text-[#b8860b]/60 mt-1 uppercase">— Coco Chanel</p>
          </div>
        </aside>

        {/* ── RIGHT PANEL — Form ── */}
        <main className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10 lg:py-0 lg:overflow-y-auto">

          <div className="w-full max-w-sm sm:max-w-md lg:max-w-[420px] xl:max-w-[440px]">

            {/* Mobile watermark */}
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
                  Welcome Back
                </h1>
                <p className="text-[12px] text-[#b8860b] font-medium mt-1">
                  Sign in to your SNITCH account
                </p>
              </header>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="login-email" className={labelClass}>Email Address</label>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. john@snitch.com"
                    required
                    className={inputClass}
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="login-password" className={labelClass}>Password</label>
                    <a
                      href="#"
                      className="text-[10px] text-[#b8860b]/70 hover:text-[#c9a84c] tracking-wider uppercase transition-colors duration-200"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <input
                    id="login-password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className={inputClass}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full mt-2 bg-[#b8860b] hover:bg-[#9c7209] active:scale-[0.98] text-[#0a0a0a] font-extrabold text-[11px] sm:text-[12px] uppercase tracking-[0.25em] py-3.5 sm:py-4 rounded-lg transition-all duration-200 cursor-pointer shadow-[0_0_24px_rgba(184,134,11,0.25)] hover:shadow-[0_0_32px_rgba(184,134,11,0.35)]"
                >
                  Sign In
                </button>
                <ContinueWithGoogle />
                {/* Register link */}
                <p className="text-center text-[12px] text-[#5a5048] mt-1">
                  Don't have an account?{' '}
                  <a
                    href="/register"
                    className="text-[#c9a84c] font-semibold hover:underline underline-offset-2 transition-all"
                  >
                    Create one
                  </a>
                </p>

              </form>
            </div>

            {/* Footer text — mobile only */}
            <p className="lg:hidden text-center text-[10px] text-[#3a3428] uppercase tracking-widest mt-6">
              © 2025 Snitch. All rights reserved.
            </p>
          </div>
        </main>
      </div>

    </div>
  );
};

export default Login;
