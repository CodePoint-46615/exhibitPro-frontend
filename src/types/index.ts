export type UserRole = 'admin' | 'host' | 'customer';

export type User = {
  userID: string;
  fullName: string;
  email: string;
  password?: string;
  phone?: number;
  profile_image?: string | null;
  role: UserRole;
  created_at: string;
};

export type Exhibition = {
  exhibitionID: string;
  title: string;
  description: string;
  ticketPrice: number | string;
  startDate?: string;
  endDate?: string;
  host?: { userID: string; fullName: string; email: string };
};

export type Booking = {
  bookingID: string;
  exhibition: Exhibition;
  customer: User;
  ticketsBooked: number;
  totalPrice: number | string;
  paymentStatus: 'paid' | 'unpaid' | 'cancelled';
  bookingDate: string;
};

export type Feedback = {
  feedbackID: string;
  customer: User;
  exhibition: Exhibition;
  rating: number;
  comment: string;
  submittedAt: string;
};

export type CreateBookingDto = {
  exhibitionID: string;
  customerID: string;
  ticketsBooked: number;
};

export type CreateFeedbackDto = {
  exhibitionID: string;
  customerID: string;
  rating: number;
  comment: string;
};

export type UpdateFeedbackDto = {
  rating?: number;
  comment?: string;
};

