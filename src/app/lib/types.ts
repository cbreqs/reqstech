export interface Business {
  id: string;
  business_name: string;
  client_email: string;
  client_first: string;
  client_last: string;
  client_pseudo?: string;
  url?: string;
  members: Record<string, 'admin' | 'editor' | 'viewer'>;
  themeConfig?: ThemeConfig;
  bookingConfig?: BookingConfig;
}

export interface ThemeConfig {
  primary?: string;
  accent?: string;
  background?: string;
  card?: string;
  border?: string;
}

export interface BookingConfig {
  bookingModel: 'capacity' | 'appointment';
  timezone?: string;
  availableDays?: number[]; // 0=Sun, 1=Mon, etc.
  slotStartHour?: number;
  slotEndHour?: number;
  slotIntervalMinutes?: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  maxCapacity: number;
  price: number;
  isActive: boolean;
  type: 'group' | 'appointment' | 'consultation';
  imageKey?: string;
}

export interface Booking {
  id: string;
  bookingTypeId: string;
  businessId: string;
  grandclientId: string;
  bookerName: string;
  bookerEmail: string;
  bookerPhoneNumber?: string;
  numberOfAttendees: number;
  bookingStatus: 'confirmed' | 'cancelled' | 'pending';
  startTime: string;
  endTime?: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface GrandClient {
  id: string;
  'g-client_email': string;
  'g-client_first': string;
  'g-client_last': string;
  updatedAt?: string;
  uid?: string;
}

export interface TimeSlot {
  time: string;       // "09:00"
  remainingSeats: number;
  totalCapacity: number;
  isAvailable: boolean;
}
