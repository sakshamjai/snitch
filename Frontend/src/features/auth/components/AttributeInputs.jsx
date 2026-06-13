import React from 'react';

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const inputClass =
  'bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-sm text-[#e5e2e1] placeholder-[#3a342a] w-full outline-none transition-all duration-200 focus:border-[#b8860b] focus:shadow-[0_0_0_3px_rgba(184,134,11,0.1)]';

const labelClass =
  'text-[10px] uppercase tracking-[0.18em] font-bold text-[#8a7a60]';

/**
 * Dynamic key-value attribute input rows with add/remove.
 * 
 * Props:
 * - inputs: Array<{ key: string, value: string }>
 * - onChange: (updatedInputs: Array, attributesObj: Object) => void
 */
const AttributeInputs = ({ inputs, onChange }) => {

  const syncAndUpdate = (updatedInputs) => {
    const attrsObj = {};
    updatedInputs.forEach(attr => {
      if (attr.key.trim() !== '') {
        attrsObj[attr.key.trim()] = attr.value;
      }
    });
    onChange(updatedInputs, attrsObj);
  };

  const handleChange = (index, field, value) => {
    const updated = inputs.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    syncAndUpdate(updated);
  };

  const handleAdd = () => {
    syncAndUpdate([...inputs, { key: '', value: '' }]);
  };

  const handleRemove = (index) => {
    const updated = inputs.filter((_, i) => i !== index);
    syncAndUpdate(updated);
  };

  return (
    <div>
      <label className={labelClass}>
        Attributes (e.g. Size, Color) *
      </label>
      <div className="mt-3 space-y-3">
        {inputs.map((attr, index) => (
          <div key={index} className="flex gap-2 items-center">
            <input
              type="text"
              placeholder="Key (e.g., Size)"
              value={attr.key}
              onChange={(e) => handleChange(index, 'key', e.target.value)}
              className={inputClass}
              style={{ flex: 1 }}
            />
            <input
              type="text"
              placeholder="Value (e.g., M)"
              value={attr.value}
              onChange={(e) => handleChange(index, 'value', e.target.value)}
              className={inputClass}
              style={{ flex: 1 }}
            />
            {inputs.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="p-2 text-[#ef4444] hover:bg-[#ef4444]/10 rounded-lg transition-colors cursor-pointer shrink-0"
                aria-label="Remove attribute"
              >
                <TrashIcon />
              </button>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={handleAdd}
        className="mt-3 text-[#c9a84c] text-[10px] uppercase tracking-[0.15em] font-bold flex items-center gap-1.5 hover:text-[#b8860b] transition-colors cursor-pointer"
      >
        <PlusIcon /> Add Attribute
      </button>
    </div>
  );
};

export default AttributeInputs;
