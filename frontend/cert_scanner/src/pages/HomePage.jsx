import React, { useState } from 'react';
import Navbar from '../components/home/Navbar';
import UploadZone from '../components/home/UploadZone';
import FileList from '../components/home/FileList';
import ProcessingStatus from '../components/home/ProcessingStatus';
import SummaryCards from '../components/home/SummaryCards';
import FilterBar from '../components/home/FilterBar';
import VerificationTable from '../components/home/VerificationTable';
import { processCertificates } from '../services/dummyProcessor';

export default function HomePage() {
  const [files, setFiles] = useState([]);

  // App States: 'idle', 'scanning', 'completed'
  const [appStatus, setAppStatus] = useState('idle');
  const [showResults, setShowResults] = useState(false);

  const [processedCount, setProcessedCount] = useState(0);
  const [currentProcessingFile, setCurrentProcessingFile] = useState('');
  const [results, setResults] = useState([]);
  const [filter, setFilter] = useState('All');
  const [resultSearchQuery, setResultSearchQuery] = useState('');

  const handleFilesSelected = (newFiles) => {
    if (files.length + newFiles.length > 100) {
      alert('You can upload a maximum of 100 certificates.');
      return;
    }
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const startVerification = async () => {
    if (files.length === 0) return;

    setAppStatus('scanning');
    setShowResults(false);
    setProcessedCount(0);
    setCurrentProcessingFile(files[0]?.name || '');
    setResults([]);

    try {
      await processCertificates(files, ({ currentFilename, completedCount, latestResult }) => {
        setCurrentProcessingFile(currentFilename);
        setProcessedCount(completedCount);

        if (latestResult) {
          const formatted = {
            ...latestResult,
            id: `cert-${Date.now()}-${Math.random()}`,
            filename: latestResult.file,
            visual: latestResult.visual_result
              ? {
                  ...latestResult.visual_result,
                  course: latestResult.visual_result.course_name,
                  completedOn: latestResult.visual_result.completed_on
                }
              : { name: '', course: '', completedOn: '' },
            qr: latestResult.qr_result
              ? {
                  ...latestResult.qr_result,
                  course: latestResult.qr_result.course_name,
                  completedOn: latestResult.qr_result.completed_on
                }
              : { name: '', course: '', completedOn: '' },
            status: latestResult.status,
            comparison: latestResult.comparison || { course_name: false, name: false, completed_on: false }
          };

          setResults((prev) => [...prev, formatted]);
        }
      });
    } catch (error) {
      console.error('Error during verification simulation:', error);
      alert('An unexpected error occurred during processing.');
    } finally {
      setAppStatus('completed');
      setShowResults(true);
    }
  };

  const filteredResults = results.filter(res => {
    const isFailed = !['Matched', 'Mismatch'].includes(res.status);

    const matchesFilter = filter === 'All' ||
      (filter === 'Matched' ? res.status === 'Matched' :
       filter === 'Mismatch' ? res.status === 'Mismatch' :
       filter === 'Name Mismatch' ? (res.comparison ? res.comparison.name === false : res.visual?.name !== res.qr?.name) :
       filter === 'Processing Failed' ? isFailed :
       res.status === filter);

    if (!matchesFilter) return false;

    if (resultSearchQuery.trim() === '') return true;

    const query = resultSearchQuery.toLowerCase();
    const searchStr = `${res.visual.name} ${res.qr.name} ${res.visual.course} ${res.qr.course}`.toLowerCase();
    return searchStr.includes(query);
  });

  const getCounts = () => {
    const verified = results.filter(r => r.status === 'Matched').length;
    const mismatches = results.filter(r => r.status === 'Mismatch').length;
    const failed = results.length - verified - mismatches;
    return { verified, mismatches, failed };
  };

  const handleExportCSV = () => {
    if (results.length === 0) return;

    const headers = [
      'File',
      'Visual Course Name',
      'Visual Name',
      'Visual Completed On',
      'QR Course Name',
      'QR Name',
      'QR Completed On',
      'Status'
    ];

    const csvRows = [
      headers.join(','),
      ...results.map(r => [
        `"${(r.filename || '').replace(/"/g, '""')}"`,
        `"${(r.visual.course || '').replace(/"/g, '""')}"`,
        `"${(r.visual.name || '').replace(/"/g, '""')}"`,
        `"${(r.visual.completedOn || '').replace(/"/g, '""')}"`,
        `"${(r.qr.course || '').replace(/"/g, '""')}"`,
        `"${(r.qr.name || '').replace(/"/g, '""')}"`,
        `"${(r.qr.completedOn || '').replace(/"/g, '""')}"`,
        `"${(r.status || '').replace(/"/g, '""')}"`
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'verification_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  const { verified, mismatches, failed } = getCounts();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <Navbar selectedCount={files.length} />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-3">

        {appStatus === 'idle' && (
          <div className="flex flex-col items-center animate-in fade-in duration-500">
            <UploadZone onFilesSelected={handleFilesSelected} />

            <FileList files={files} onRemoveFile={handleRemoveFile} />

            {files.length > 0 && (
              <div className="mt-10 flex justify-center w-full">
                <button
                  onClick={startVerification}
                  className="px-10 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] transition-colors text-lg"
                >
                  Start Verification →
                </button>
              </div>
            )}
          </div>
        )}

        {(appStatus === 'scanning' || appStatus === 'completed') && (
          <div className="animate-in fade-in duration-500">
            {!showResults && (
              <ProcessingStatus
                total={files.length}
                completed={processedCount}
                currentFilename={currentProcessingFile}
                isScanning={appStatus === 'scanning'}
                showResults={showResults}
                onToggleResults={() => setShowResults((prev) => !prev)}
              />
            )}

            {showResults && (
              <div className="flex flex-col w-full mt-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 border border-slate-200 rounded-2xl shadow-sm">
                  <div>
                    <h2 className="text-2xl font-bold text-[#0a1128]">
                      {appStatus === 'scanning' ? 'Verifying...' : 'Verification Results'}
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                      {appStatus === 'scanning'
                        ? 'Review certificates as they are processed in real-time.'
                        : 'Review certificate information and identify discrepancies.'}
                    </p>
                    {appStatus === 'scanning' && (
                      <button
                        onClick={() => setShowResults(false)}
                        className="text-xs text-blue-600 hover:text-blue-700 font-semibold underline mt-2 inline-block cursor-pointer"
                      >
                        ← Back to Progress View
                      </button>
                    )}
                  </div>

                  {appStatus === 'scanning' && (
                    <div className="flex flex-col items-end min-w-[200px]">
                      <span className="text-sm font-semibold text-slate-700 mb-2">
                        {processedCount} done out of {files.length}
                      </span>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-green-500 h-full transition-all duration-300 ease-out"
                          style={{ width: `${(processedCount / files.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <SummaryCards
                  processed={results.length}
                  verified={verified}
                  mismatches={mismatches}
                  failed={failed}
                />

                <div className="bg-white p-4 sm:p-6 border border-slate-200 rounded-2xl shadow-sm">
                  <FilterBar
                    currentFilter={filter}
                    onFilterChange={setFilter}
                    searchQuery={resultSearchQuery}
                    onSearchChange={setResultSearchQuery}
                    onExport={handleExportCSV}
                  />

                  <div className="mb-4 text-sm font-medium text-slate-500">
                    Showing {filteredResults.length} {filter === 'All' ? 'completed' : filter} certificates
                  </div>

                  <VerificationTable results={filteredResults} />
                </div>

                {appStatus === 'completed' && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => {
                        setAppStatus('idle');
                        setFiles([]);
                        setResults([]);
                        setShowResults(false);
                        setProcessedCount(0);
                        setCurrentProcessingFile('');
                      }}
                      className="px-6 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      Start New Verification
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
