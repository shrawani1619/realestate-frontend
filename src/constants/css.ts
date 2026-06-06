/** Design tokens & reusable Tailwind class names — single source of truth for styling */

export const COLORS = {
  primary: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  white: '#ffffff',
  black: '#000000',
} as const;

export const CSS_CLASSES = {
  button: {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
  },
  input: 'input-field',
  card: 'card',
} as const;

export const LAYOUT = {
  container: 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8',
  containerNarrow: 'mx-auto max-w-4xl px-4 sm:px-6 lg:px-8',
  containerMedium: 'mx-auto max-w-5xl px-4 sm:px-6 lg:px-8',
  pagePadding: 'py-12',
  sectionGap: 'mt-8',
} as const;

export const Z_INDEX = {
  navbar: 'z-50',
  modal: 'z-50',
  dropdown: 'z-50',
} as const;

export const BORDER_RADIUS = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  full: 'rounded-full',
} as const;

export const PLOT_STATUS = {
  available: {
    map: 'bg-green-500/70 border-green-600 hover:bg-green-500',
    badge: 'bg-green-100 text-green-700',
    legend: 'bg-green-500',
  },
  booked: {
    map: 'bg-yellow-500/70 border-yellow-600',
    badge: 'bg-yellow-100 text-yellow-700',
    legend: 'bg-yellow-500',
  },
  sold: {
    map: 'bg-red-500/70 border-red-600',
    badge: 'bg-red-100 text-red-700',
    legend: 'bg-red-500',
  },
} as const;

export const BOOKING_STATUS = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
} as const;

export const NOTIFICATION_TYPE = {
  booking: 'bg-blue-100 text-blue-700',
  approval: 'bg-green-100 text-green-700',
  rejection: 'bg-red-100 text-red-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-gray-100 text-gray-700',
} as const;

export const INQUIRY_STATUS = {
  new: 'bg-blue-100 text-blue-700',
  read: 'bg-yellow-100 text-yellow-700',
  replied: 'bg-green-100 text-green-700',
} as const;

export const USER_STATUS = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-red-100 text-red-700',
} as const;

export const DASHBOARD_STAT_COLORS = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-indigo-500',
  'bg-green-500',
  'bg-orange-500',
] as const;

export const NAVBAR = {
  wrapper:
    'sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur',
  brand: 'text-xl font-bold text-primary-700',
  link: 'text-sm font-medium text-gray-600 hover:text-primary-600',
} as const;

export const FORM = {
  label: 'mb-1 block text-sm font-medium',
  labelSmall: 'mb-1 block text-xs font-medium',
  error: 'text-sm text-red-600',
} as const;

export const TABLE = {
  wrapper: 'overflow-x-auto rounded-xl border border-gray-200',
  head: 'bg-gray-50 text-xs uppercase text-gray-500',
  row: 'bg-white',
  cell: 'px-4 py-3',
} as const;

export type PlotStatusKey = keyof typeof PLOT_STATUS;
export type BookingStatusKey = keyof typeof BOOKING_STATUS;
export type InquiryStatusKey = keyof typeof INQUIRY_STATUS;
export type NotificationTypeKey = keyof typeof NOTIFICATION_TYPE;
