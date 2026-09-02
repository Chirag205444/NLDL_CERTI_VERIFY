/**
 * Dummy Certificate Processing Service
 * Simulates sequential certificate verification with realistic mock data.
 * Can be swapped for real API calls in the future without changing the UI structure.
 */

const DUMMY_TEMPLATES = [
  {
    visual_result: {
      course_name: "Database Management System Part - 1",
      name: "Chirag Shetty",
      completed_on: "November 10, 2025"
    },
    qr_result: {
      course_name: "Database Management System Part - 1",
      name: "Chirag Shetty",
      completed_on: "November 10, 2025"
    },
    comparison: {
      course_name: true,
      name: true,
      completed_on: true
    },
    status: "Matched"
  },
  {
    visual_result: {
      course_name: "Advanced Data Structures & Algorithms",
      name: "Vikram Rao",
      completed_on: "October 20, 2025"
    },
    qr_result: {
      course_name: "Advanced Data Structures & Algorithms",
      name: "Vikram R.",
      completed_on: "October 20, 2025"
    },
    comparison: {
      course_name: true,
      name: false,
      completed_on: true
    },
    status: "Mismatch"
  },
  {
    visual_result: {
      course_name: "Prompt Engineering for Machine Learning",
      name: "Ananya Sharma",
      completed_on: "October 14, 2025"
    },
    qr_result: {
      course_name: "Machine Learning Fundamentals",
      name: "Ananya Sharma",
      completed_on: "October 14, 2025"
    },
    comparison: {
      course_name: false,
      name: true,
      completed_on: true
    },
    status: "Mismatch"
  },
  {
    visual_result: {
      course_name: "Cloud Computing Architectures",
      name: "Rahul Verma",
      completed_on: "November 08, 2025"
    },
    qr_result: {
      course_name: "Cloud Computing Architectures",
      name: "Rahul Verma",
      completed_on: "November 09, 2025"
    },
    comparison: {
      course_name: true,
      name: true,
      completed_on: false
    },
    status: "Mismatch"
  },
  {
    visual_result: {
      course_name: "Full Stack Web Development",
      name: "Priya Nair",
      completed_on: "December 01, 2025"
    },
    qr_result: {
      course_name: "Advanced Web Technologies",
      name: "Priya N.",
      completed_on: "November 30, 2025"
    },
    comparison: {
      course_name: false,
      name: false,
      completed_on: false
    },
    status: "Mismatch"
  },
  {
    visual_result: {
      course_name: "Not Found",
      name: "Not Found",
      completed_on: "Not Found"
    },
    qr_result: {
      course_name: "Not Found",
      name: "Not Found",
      completed_on: "Not Found"
    },
    comparison: {
      course_name: false,
      name: false,
      completed_on: false
    },
    status: "Processing Failed"
  },
  {
    visual_result: {
      course_name: "Introduction to Artificial Intelligence",
      name: "Kavya Patel",
      completed_on: "September 25, 2025"
    },
    qr_result: {
      course_name: "Introduction to Artificial Intelligence",
      name: "Kavya Patel",
      completed_on: "September 25, 2025"
    },
    comparison: {
      course_name: true,
      name: true,
      completed_on: true
    },
    status: "Matched"
  }
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Simulates processing an array of uploaded files sequentially.
 * 
 * @param {File[]} files - Array of selected File objects
 * @param {Function} onProgress - Callback triggered per certificate step
 * @returns {Promise<{ success: boolean, total_files: number, processed_files: number, results: Array }>}
 */
export async function processCertificates(files, onProgress) {
  const results = [];
  const total = files.length;

  for (let i = 0; i < total; i++) {
    const file = files[i];
    const filename = file.name || `certificate_${i + 1}.pdf`;

    if (onProgress) {
      onProgress({
        currentFilename: filename,
        completedCount: i,
        totalCount: total
      });
    }

    // Realistic processing delay (e.g. 700ms per certificate)
    await delay(700);

    const template = DUMMY_TEMPLATES[i % DUMMY_TEMPLATES.length];

    const resultItem = {
      file: filename,
      visual_result: { ...template.visual_result },
      qr_result: { ...template.qr_result },
      comparison: { ...template.comparison },
      status: template.status
    };

    results.push(resultItem);

    if (onProgress) {
      onProgress({
        currentFilename: filename,
        completedCount: i + 1,
        totalCount: total,
        latestResult: resultItem
      });
    }
  }

  return {
    success: true,
    total_files: total,
    processed_files: results.length,
    results
  };
}
