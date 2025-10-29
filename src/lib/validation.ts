import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  fullName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().regex(/^\d{10,15}$/),
  password: z.string().min(6),
});

export const createBookingSchema = z.object({
  exhibitionID: z.string().uuid(),
  customerID: z.string().uuid(),
  ticketsBooked: z.number().int().positive(),
});

export const createFeedbackSchema = z.object({
  exhibitionID: z.string().uuid(),
  customerID: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1),
});

export const updateFeedbackSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  comment: z.string().optional(),
});

