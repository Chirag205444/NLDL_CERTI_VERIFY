import React, { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';

export default function UploadZone({ onFilesSelected }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 px-6">
      <h2 className="text-2xl font-bold text-[#0a1128] mb-2 text-center">Verify Your Certificates</h2>
      <p className="text-slate-500 text-center mb-8">
        Upload your certificates and compare their details with verified QR information to quickly identify discrepancies.
      </p>

      <div 
        className={`w-full flex flex-col items-center justify-center py-16 px-4 border-2 border-dashed rounded-xl transition-colors bg-white cursor-pointer ${
          isDragOver ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadCloud className={`w-12 h-12 mb-4 ${isDragOver ? 'text-blue-600' : 'text-slate-400'}`} />
        <h3 className="text-lg font-semibold text-slate-700 mb-1">Upload your certificates</h3>
        <p className="text-sm text-slate-500 mb-6 text-center max-w-xs">
          Drag and drop your PDF files here, or browse from your device.
        </p>
        <button 
          className="px-6 py-2.5 bg-white border border-slate-200 shadow-sm rounded-lg text-sm font-semibold text-[#0a1128] hover:bg-slate-50 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          Browse Files
        </button>
        <p className="text-xs text-slate-400 mt-4">Maximum 100 PDF files</p>

        <input 
          type="file" 
          multiple 
          accept="application/pdf" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
