export const INQUIRY_SUBJECTS = [
  'General Inquiry',
  'Plot Inquiry',
  'Site Visit Request',
  'Other',
] as const;

export type InquirySubject = (typeof INQUIRY_SUBJECTS)[number];

export const INQUIRY_STATUSES = ['new', 'read', 'replied'] as const;

export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];
