import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-screen bg-white flex flex-col items-center overflow-hidden font-sans text-slate-900 box-border">

      {/* Background Wave Graphic (Line Art style) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden flex items-end justify-center pointer-events-none opacity-40 z-0">
        <svg viewBox="0 0 1440 800" className="w-[150%] min-w-[1500px] h-auto text-blue-500" fill="none" stroke="currentColor" strokeWidth="1" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'translateY(20%)' }}>
          {[...Array(16)].map((_, i) => (
            <path
              key={i}
              d={`M -200 ${450 + i * 18} C 300 ${250 + i * 22}, 600 ${650 - i * 12}, 1100 ${350 + i * 18} C 1500 ${200 + i * 20}, 1800 ${450 - i * 10}, 2200 ${350 + i * 18}`}
              opacity={1 - (i * 0.06)}
            />
          ))}
        </svg>
      </div>

      {/* Content Wrapper */}
      <div className="relative z-10 flex flex-col items-center w-full h-full justify-center pt-12 pb-24 sm:pb-32 px-6 sm:px-12 max-w-5xl mx-auto">

        {/* Top Section */}
        <div className="flex flex-col items-center text-center w-full mt-4 sm:mt-5">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-3 px-1.5 py-1.5 pr-5 bg-white border border-slate-100 rounded-full shadow-sm mb-8 hover:shadow transition-shadow cursor-pointer text-sm">
            <span className="px-3 py-1 text-xs font-bold text-white bg-orange-500 rounded-full">New</span>
            <span className="text-slate-600 font-medium">Verify. Compare. Detect.</span>
            <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0a1128] leading-[1.2] mb-6 max-w-4xl">
            Unleash the Power of <span className="text-blue-600">CertiVerify</span> <br className="hidden md:block" /> with <span className="text-orange-500">Advanced Detection</span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-[1.1rem] text-slate-500 mb-10 max-w-2xl leading-relaxed">
            An efficient certificate verification platform designed to help organizations validate credentials, detect discrepancies, and streamline the verification process.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => navigate('/home')}
              className="px-8 py-3.5 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] w-full sm:w-auto"
            >
              Get Started Free
            </button>
            <button
              className="px-8 py-3.5 text-base font-semibold text-[#0a1128] bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center gap-2 w-full sm:w-auto group"
            >
              How it works?
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-100 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <svg className="w-2.5 h-2.5 translate-x-[0.5px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </button>
          </div>
        </div>

      </div>

      {/* Footer Features (Separate Sticky Cards) */}
      <div className="absolute bottom-6 sm:bottom-10 left-0 w-full flex justify-center z-10 px-4">
        <div className="flex flex-row items-center justify-between gap-3 sm:gap-6 w-full max-w-4xl flex-wrap">

          <div className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 transition-transform hover:-translate-y-1 cursor-default">
            <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-50 text-blue-500 shrink-0">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
            </div>
            <span className="text-gray-700 font-semibold text-xs sm:text-sm">QR Scan</span>
          </div>

          <div className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 transition-transform hover:-translate-y-1 cursor-default">
            <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-orange-50 text-orange-500 shrink-0">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <span className="text-gray-700 font-semibold text-xs sm:text-sm">OCR Extract</span>
          </div>

          <div className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 transition-transform hover:-translate-y-1 cursor-default">
            <div className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-50 text-blue-500 shrink-0">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            </div>
            <span className="text-gray-700 font-semibold text-xs sm:text-sm hidden sm:block">Real-time Detection</span>
            <span className="text-gray-700 font-semibold text-xs sm:hidden">Detection</span>
          </div>

        </div>
      </div>
    </div>
  );
}
