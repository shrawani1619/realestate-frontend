export interface User {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  isActive: boolean;
  status?: 'active' | 'inactive';
  totalBookings?: number;
  joinedAt?: string;
  createdAt: string;
}

export interface UserListResponse {
  users: User[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export interface UserDetailResponse {
  user: User;
  bookings: Booking[];
}

export interface PlotStats {
  total: number;
  available: number;
  booked: number;
  sold: number;
}

export interface Layout {
  _id: string;
  name: string;
  description: string;
  location: string;
  coordinates?: { lat?: number; lng?: number };
  imageUrl: string;
  images?: string[];
  totalPlots: number;
  status: 'active' | 'inactive';
  createdBy?: string;
  availablePlots?: number;
  startingPrice?: number | null;
  plotStats?: PlotStats;
  plots?: Plot[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Plot {
  _id: string;
  layoutId: string | Layout;
  plotNumber: string;
  size: string;
  price: number;
  facing?: 'North' | 'South' | 'East' | 'West';
  status: 'available' | 'booked' | 'sold';
  coordinates: { x: number; y: number };
  description: string;
}

export interface Booking {
  _id: string;
  plotId?: string;
  layoutId?: string;
  userId?: string;
  plot: Plot;
  layout: Layout;
  user?: User;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNote: string;
  approvedAt?: string;
  rejectedAt?: string;
  createdAt: string;
}

export interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

export interface Content {
  _id: string;
  section: 'homepage' | 'about' | 'contact' | 'footer';
  title: string;
  subtitle: string;
  body: string;
  heroImage: string;
  metadata: Record<string, unknown>;
}

export interface Notification {
  _id: string;
  userId?: string;
  title: string;
  message: string;
  type: 'booking' | 'approval' | 'rejection' | 'info' | 'error';
  isRead: boolean;
  relatedId?: string;
  createdAt: string;
}

export interface RecentBooking {
  id: string;
  userName: string;
  plotNumber: string;
  layoutName: string;
  status: string;
  date: string;
}

export interface RecentUser {
  id: string;
  name: string;
  email: string;
  date: string;
}

export interface MonthlyBooking {
  month: string;
  year: number;
  monthNumber: number;
  count: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalLayouts: number;
  totalPlots: number;
  availablePlots: number;
  bookedPlots: number;
  soldPlots: number;
  recentBookings: RecentBooking[];
  recentUsers: RecentUser[];
  monthlyBookings: MonthlyBooking[];
}

export interface PublicStats {
  totalLayouts: number;
  totalPlots: number;
  availablePlots: number;
  happyCustomers: number;
  completedBookings: number;
}

export interface Activity {
  _id: string;
  type: string;
  message: string;
  user?: User;
  createdAt: string;
}
