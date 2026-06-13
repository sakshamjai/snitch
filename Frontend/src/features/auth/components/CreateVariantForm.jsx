import React, { useState } from 'react';
import AttributeInputs from './AttributeInputs';
import ImageUploader from './ImageUploader';

const inputClass =
  'bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-[#e5e2e1] placeholder-[#3a342a] w-full outline-none transition-all duration-200 focus:border-[#b8860b] focus:shadow-[0_0_0_3px_rgba(184,134,11,0.1)]';

const labelClass =
  'text-[10px] uppercase tracking-[0.18em] font-bold text-[#8a7a60]';

const INITIAL_VARIANT = {
  images: [],
  stock: 0,
  attributes: {},
  price: { amount: '', currency: 'INR' },
};

/**
 * Self-contained variant creation form.
 * Manages its own internal state and calls callbacks on save/cancel.
 *
 * Props:
 * - onSave: (variantData: { images, stock, attributes, price }) => Promise<void>
 * - onCancel: () => void
 */
const CreateVariantForm = ({ onSave, onCancel }) => {
  const [attributeInputs, setAttributeInputs] = useState([{ key: '', value: '' }]);
  const [images, setImages] = useState([]);
  const [stock, setStock] = useState(0);
  const [priceAmount, setPriceAmount] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAttributeChange = (updatedInputs, attrsObj) => {
    setAttributeInputs(updatedInputs);
  };

  // Derive attributes object from inputs (single source of truth)
  const getAttributesObject = () => {
    const attrsObj = {};
    attributeInputs.forEach(attr => {
      if (attr.key.trim() !== '') {
        attrsObj[attr.key.trim()] = attr.value;
      }
    });
    return attrsObj;
  };

  const handleSave = async () => {
    const attributes = getAttributesObject();
    const hasValidAttribute = attributeInputs.some(
      attr => attr.key.trim() && attr.value.trim()
    );

    if (!hasValidAttribute) {
      alert('At least one valid attribute (key and value) is required.');
      return;
    }

    const variantData = {
      images: images.map(img => ({ url: img.previewUrl, file: img.file })),
      stock: Number(stock),
      attributes,
      price: priceAmount ? Number(priceAmount) : undefined,
    };

    setIsSaving(true);
    try {
      await onSave(variantData);
      // Reset form on success
      resetForm();
    } catch (error) {
      console.error('Failed to save variant:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    // Revoke any remaining preview URLs
    images.forEach(img => {
      if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
    });
    setAttributeInputs([{ key: '', value: '' }]);
    setImages([]);
    setStock(0);
    setPriceAmount('');
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  return (
    <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl p-5 sm:p-7 mb-8 shadow-[0_0_80px_rgba(0,0,0,0.4)] animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Create Variant
          </h4>
          <p className="text-[12px] text-[#b8860b] font-medium mt-0.5">
            Add a new size, color, or style option
          </p>
        </div>
        <button
          onClick={handleCancel}
          className="text-[#6b6560] hover:text-[#e5e2e1] text-[10px] uppercase tracking-[0.15em] font-bold transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {/* Form body — two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left — Attributes + Stock + Price */}
        <div className="space-y-6">
          {/* Dynamic Attributes */}
          <AttributeInputs
            inputs={attributeInputs}
            onChange={handleAttributeChange}
          />

          {/* Stock & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="variant-stock" className={labelClass}>
                Initial Stock
              </label>
              <input
                id="variant-stock"
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="variant-price" className={labelClass}>
                Price Amount (Optional)
              </label>
              <input
                id="variant-price"
                type="number"
                min="0"
                step="0.01"
                value={priceAmount}
                onChange={(e) => setPriceAmount(e.target.value)}
                placeholder="Uses base price if empty"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Right — Image Upload */}
        <ImageUploader
          images={images}
          onChange={setImages}
          maxImages={7}
        />
      </div>

      {/* Footer — Save button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`
            font-extrabold text-[11px] sm:text-[12px] uppercase tracking-[0.25em]
            px-8 sm:px-10 py-3.5 rounded-lg transition-all duration-200 cursor-pointer
            ${isSaving
              ? 'bg-[#3a3428] text-[#6b6560] cursor-not-allowed shadow-none'
              : 'bg-[#b8860b] hover:bg-[#9c7209] active:scale-[0.98] text-[#0a0a0a] shadow-[0_0_24px_rgba(184,134,11,0.25)] hover:shadow-[0_0_32px_rgba(184,134,11,0.35)]'
            }
          `}
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Saving…
            </span>
          ) : (
            'Save Variant'
          )}
        </button>
      </div>
    </div>
  );
};

export default CreateVariantForm;
