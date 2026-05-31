import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { userProduct } from '../hook/useProduct';

const inputClass =
  'bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-[#e5e2e1] placeholder-[#3a342a] w-full outline-none transition-all duration-200 focus:border-[#b8860b] focus:shadow-[0_0_0_3px_rgba(184,134,11,0.1)]';

const labelClass =
  'text-[10px] uppercase tracking-[0.18em] font-bold text-[#8a7a60]';

const CreateProduct = () => {
  const navigate = useNavigate();
  const { handleCreateProduct } = userProduct();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'INR',
  });

  const [images, setImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const processFiles = (files) => {
    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith('image/')
    );
    const remaining = 7 - images.length;
    const filesToAdd = validFiles.slice(0, remaining);

    const newImages = filesToAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  const removeImage = (id) => {
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return prev.filter((img) => img.id !== id);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return;

    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('description', formData.description);
      fd.append('priceAmount', formData.priceAmount);
      fd.append('priceCurrency', formData.priceCurrency);
      images.forEach((img) => fd.append('images', img.file));

      await handleCreateProduct(fd);
      navigate('/');
    } catch (err) {
      console.error('Failed to create product:', err);
    } finally {
      setIsSubmitting(false);
    }
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
            href="/"
            className="text-[10px] sm:text-[11px] uppercase tracking-widest font-medium text-[#e5e2e1]/50 hover:text-[#c9a84c] transition-colors duration-200"
          >
            Back to site
          </a>
          <a
            href="/"
            className="hidden sm:block text-[11px] uppercase tracking-widest font-medium text-[#e5e2e1]/50 hover:text-[#c9a84c] transition-colors duration-200"
          >
            Dashboard
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
              Seller Portal
            </p>
            <h2 className="text-4xl xl:text-5xl font-black text-white leading-tight tracking-tight">
              List Your
              <br />
              <span className="text-[#c9a84c]">Product.</span>
            </h2>
            <p className="mt-5 text-sm text-[#6b6560] leading-relaxed max-w-xs">
              Showcase your fashion to the world. Add your product details below
              and let millions of customers discover your creations.
            </p>
          </div>

          {/* Feature list */}
          <ul className="flex flex-col gap-4 relative z-10">
            {[
              ['✨', 'Premium product showcase'],
              ['🌍', 'Reach millions of customers'],
              ['💰', 'Maximize your earnings'],
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
              "The details are not the details. They make the design."
            </p>
            <p className="text-[10px] tracking-wider text-[#b8860b]/60 mt-1 uppercase">
              — Charles Eames
            </p>
          </div>
        </aside>

        {/* ── RIGHT PANEL — Form ── */}
        <main className="flex-1 flex items-start justify-center px-5 sm:px-8 py-10 lg:py-8 lg:overflow-y-auto">

          <div className="w-full max-w-sm sm:max-w-md lg:max-w-[520px] xl:max-w-[560px]">

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
              <header className="mb-8">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Create Product
                </h1>
                <p className="text-[12px] text-[#b8860b] font-medium mt-1">
                  Add a new product to your SNITCH catalog
                </p>
              </header>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                {/* Title */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="product-title" className={labelClass}>
                    Product Title
                  </label>
                  <input
                    id="product-title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Classic Linen Overshirt"
                    required
                    className={inputClass}
                  />
                </div>

                {/* Description */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="product-description" className={labelClass}>
                    Description
                  </label>
                  <textarea
                    id="product-description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the product — material, fit, occasion, care instructions…"
                    required
                    rows={4}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                {/* Price — Amount + Currency */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="product-price" className={labelClass}>
                      Price Amount
                    </label>
                    <input
                      id="product-price"
                      name="priceAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.priceAmount}
                      onChange={handleChange}
                      placeholder="e.g. 2499"
                      required
                      className={inputClass}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="product-currency" className={labelClass}>
                      Currency
                    </label>
                    <select
                      id="product-currency"
                      name="priceCurrency"
                      value={formData.priceCurrency}
                      onChange={handleChange}
                      className={`${inputClass} cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%238a7a60%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_16px_center]`}
                    >
                      <option value="INR">INR — Indian Rupee</option>
                      <option value="USD">USD — US Dollar</option>
                      <option value="EUR">EUR — Euro</option>
                      <option value="GBP">GBP — British Pound</option>
                      <option value="JPY">JPY — Japanese Yen</option>
                    </select>
                  </div>
                </div>

                {/* Images Upload */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className={labelClass}>
                      Product Images
                    </label>
                    <span className="text-[10px] text-[#5a5048] tracking-wider">
                      {images.length} / 7
                    </span>
                  </div>

                  {/* Drop zone */}
                  {images.length < 7 && (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`
                        relative flex flex-col items-center justify-center gap-3 
                        rounded-xl border-2 border-dashed cursor-pointer
                        transition-all duration-300 py-8 px-4
                        ${isDragging
                          ? 'border-[#b8860b] bg-[#b8860b]/5 shadow-[0_0_20px_rgba(184,134,11,0.1)]'
                          : 'border-[#2a2a2a] bg-[#1a1a1a]/50 hover:border-[#3a3a3a] hover:bg-[#1a1a1a]'
                        }
                      `}
                    >
                      {/* Upload icon */}
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center
                        transition-all duration-300
                        ${isDragging ? 'bg-[#b8860b]/15' : 'bg-[#1e1e1e]'}
                      `}>
                        <svg
                          className={`w-5 h-5 transition-colors duration-300 ${isDragging ? 'text-[#c9a84c]' : 'text-[#5a5048]'}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                          />
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-[12px] text-[#8a7a60]">
                          <span className="text-[#c9a84c] font-semibold">Click to upload</span>
                          {' '}or drag and drop
                        </p>
                        <p className="text-[10px] text-[#3a342a] mt-1">
                          PNG, JPG, WEBP up to 5MB each
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        aria-label="Upload product images"
                      />
                    </div>
                  )}

                  {/* Image previews */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-1">
                      {images.map((img) => (
                        <div
                          key={img.id}
                          className="group relative aspect-square rounded-lg overflow-hidden border border-[#2a2a2a] bg-[#1a1a1a]"
                        >
                          <img
                            src={img.preview}
                            alt="Product preview"
                            className="w-full h-full object-cover"
                          />
                          {/* Hover overlay with remove button */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => removeImage(img.id)}
                              className="w-8 h-8 rounded-full bg-[#ef4444]/90 hover:bg-[#ef4444] flex items-center justify-center transition-all duration-200 cursor-pointer transform hover:scale-110"
                              aria-label="Remove image"
                            >
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting || images.length === 0}
                  className={`
                    w-full mt-3 font-extrabold text-[11px] sm:text-[12px] uppercase tracking-[0.25em] 
                    py-3.5 sm:py-4 rounded-lg transition-all duration-200 cursor-pointer
                    ${isSubmitting || images.length === 0
                      ? 'bg-[#3a3428] text-[#6b6560] cursor-not-allowed shadow-none'
                      : 'bg-[#b8860b] hover:bg-[#9c7209] active:scale-[0.98] text-[#0a0a0a] shadow-[0_0_24px_rgba(184,134,11,0.25)] hover:shadow-[0_0_32px_rgba(184,134,11,0.35)]'
                    }
                  `}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Publishing…
                    </span>
                  ) : (
                    'Publish Product'
                  )}
                </button>

                {/* Image count hint */}
                {images.length === 0 && (
                  <p className="text-center text-[11px] text-[#3a342a]">
                    Add at least one image to publish
                  </p>
                )}

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

export default CreateProduct;