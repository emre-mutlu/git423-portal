export const SUBMISSION_STATUS = {
  SUBMITTED: 'submitted',
  GRADED: 'graded',
} as const;

export type SubmissionStatus = typeof SUBMISSION_STATUS[keyof typeof SUBMISSION_STATUS];

export const STORAGE_BUCKET = 'submissions';

export const GRADE_ON_TIME = 100;
export const GRADE_LATE = 60;

export const MAX_UPLOAD_SIZE = 50 * 1024 * 1024; // 50 MB
