import React, { useRef, useState, useEffect } from 'react';

const labelClass =
  'text-[10px] uppercase tracking-[0.18em] font-bold text-[#8a7a60]';

/**
 * Image upload component with drag-and-drop, preview grid, and remove.
 * Handles URL.createObjectURL / revokeObjectURL lifecycle properly.
 * 
 * Props:
 * - images: Array<{ file: File, previewUrl: string }>
 * - onChange: (updatedImages: Array) => void
 * - maxImages: number (default 7)
 */
const ImageUploader = ({ images, onChange, maxImages = 7 }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Revoke all preview URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
      });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const processFiles = (files) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    const remaining = maxImages - images.length;
    const filesToAdd = validFiles.slice(0, remaining);

    if (validFiles.length > remaining) {
      alert(`You can only upload up to ${maxImages} images. ${filesToAdd.length} added.`);
    }

    const newImageObjects = filesToAdd.map(file => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    onChange([...images, ...newImageObjects]);
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

  const handleRemove = (index) => {
    const imageToRemove = images[index];
    if (imageToRemove?.previewUrl) {
      URL.revokeObjectURL(imageToRemove.previewUrl);
    }
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className={labelClass}>
          Variant Images (Optional)
        </label>
        <span className="text-[10px] text-[#5a5048] tracking-wider font-medium">
          {images.length} / {maxImages}
        </span>
      </div>

      {/* Drop zone */}
      {images.length < maxImages && (
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
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center
            transition-all duration-300
            ${isDragging ? 'bg-[#b8860b]/15' : 'bg-[#1e1e1e]'}
          `}>
            <svg
              className={`w-5 h-5 transition-colors duration-300 ${isDragging ? 'text-[#c9a84c]' : 'text-[#5a5048]'}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-[12px] text-[#8a7a60]">
              <span className="text-[#c9a84c] font-semibold">Click to upload</span>{' '}or drag and drop
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
            aria-label="Upload variant images"
          />
        </div>
      )}

      {/* Image preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
          {images.map((img, index) => (
            <div
              key={index}
              className="group relative aspect-square rounded-lg overflow-hidden border border-[#2a2a2a] bg-[#1a1a1a]"
            >
              <img
                src={img.previewUrl}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Hover overlay with remove */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRemove(index); }}
                  className="w-8 h-8 rounded-full bg-[#ef4444]/90 hover:bg-[#ef4444] flex items-center justify-center transition-all duration-200 cursor-pointer transform hover:scale-110"
                  aria-label="Remove image"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
