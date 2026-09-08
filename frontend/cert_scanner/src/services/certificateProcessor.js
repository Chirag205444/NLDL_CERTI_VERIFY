/**
 * Real Certificate Processing Service
 * Connects the React frontend to the FastAPI /scan endpoint.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Maps a single backend result object to the frontend result format.
 *
 * @param {Object} item - Single item from backend results array
 * @param {string} fallbackFilename - Fallback name if file property is missing
 * @returns {Object} Mapped frontend result item
 */
function mapBackendResult(item, fallbackFilename, fileObject = null) {
  const ocr = item.ocr_result || {};
  const qr = item.qr_result || {};
  const backendComp = item.comparison || {};

  // Extract OCR / Visual fields
  const visualResult = {
    name: ocr['Holder Name'] ?? ocr.name ?? 'Not Found',
    course_name: ocr['Course'] ?? ocr.course_name ?? 'Not Found',
    completed_on: ocr['Completed On'] ?? ocr.completed_on ?? 'Not Found'
  };

  // Extract QR fields
  const qrResult = {
    name: qr['Holder Name'] ?? qr.name ?? 'Not Found',
    course_name: qr['Course'] ?? qr.course_name ?? 'Not Found',
    completed_on: qr['Completed On'] ?? qr.completed_on ?? 'Not Found'
  };

  // Map boolean comparisons
  const comparison = {
    name: backendComp.Name === 'Match' || backendComp.name === true,
    course_name: backendComp.Course === 'Match' || backendComp.course_name === true,
    completed_on: backendComp['Completed On'] === 'Match' || backendComp.completed_on === true
  };

  // Determine status
  const isExplicitFail =
    Boolean(item.error) ||
    Boolean(ocr.Error) ||
    backendComp.Name === 'Failed' ||
    backendComp.Course === 'Failed' ||
    backendComp['Completed On'] === 'Failed' ||
    qr.status === 'Failed' ||
    ocr.status === 'Failed' ||
    item.status === 'Processing Failed' ||
    item.status === 'Failed' ||
    (typeof qr.Status === 'string' && qr.Status.toLowerCase().includes('error')) ||
    (qr.Status === 'QR Not Found' && visualResult.name === 'Not Found' && visualResult.course_name === 'Not Found');

  let status;
  if (isExplicitFail) {
    status = 'Processing Failed';
    comparison.name = false;
    comparison.course_name = false;
    comparison.completed_on = false;
  } else if (typeof backendComp.mismatch_count === 'number') {
    status = backendComp.mismatch_count === 0 ? 'Matched' : 'Mismatch';
  } else {
    // Fallback: check boolean comparison flags
    const allMatched = comparison.name && comparison.course_name && comparison.completed_on;
    status = allMatched ? 'Matched' : 'Mismatch';
  }

  return {
    file: item.file || fallbackFilename,
    fileObject: fileObject || null,
    visual_result: visualResult,
    qr_result: qrResult,
    comparison,
    status,
    raw_comparison: backendComp,
    error: item.error
  };
}

/**
 * Uploads and processes an array of certificate files with the FastAPI backend.
 *
 * @param {File[]} files - Array of selected File objects
 * @param {Function} [onProgress] - Optional callback triggered as results are populated
 * @returns {Promise<{ success: boolean, total_files: number, processed_files: number, results: Array }>}
 */
export async function processCertificates(files, onProgress) {
  if (!files || files.length === 0) {
    return {
      success: true,
      total_files: 0,
      processed_files: 0,
      results: []
    };
  }

  const total = files.length;

  // Signal starting scan
  if (onProgress) {
    onProgress({
      currentFilename: files[0]?.name || 'certificate.pdf',
      completedCount: 0,
      totalCount: total
    });
  }

  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }

  const response = await fetch(`${API_BASE_URL}/scan`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(
      `API request failed with status ${response.status}: ${errorText || response.statusText}`
    );
  }

  const data = await response.json();
  const rawResults = data.results || [];

  const results = rawResults.map((item, index) => {
    const fallbackName = files[index]?.name || `certificate_${index + 1}.pdf`;
    return mapBackendResult(item, fallbackName, files[index] || null);
  });

  // Provide progress updates for each result to match HomePage handler expectations
  results.forEach((resultItem, idx) => {
    if (onProgress) {
      onProgress({
        currentFilename: resultItem.file,
        completedCount: idx + 1,
        totalCount: total,
        latestResult: resultItem
      });
    }
  });

  return {
    success: true,
    total_files: total,
    processed_files: results.length,
    results
  };
}
