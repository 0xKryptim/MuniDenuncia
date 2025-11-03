import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const reportSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title too long'),
  description: z.string().max(500, 'Description too long').optional(),
  photoFile: z.instanceof(File, { message: 'Photo is required' })
    .refine((file) => file.size <= 10 * 1024 * 1024, 'Photo must be less than 10MB')
    .refine((file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type),
      'Only JPEG, PNG, and WebP images are allowed'),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    address: z.string().optional(),
  }),
  urgency: z.enum(['low', 'medium', 'high'] as const, {
    message: "Please select the urgency level"
  })
});

export const messageSchema = z.object({
  text: z.string().min(1, 'Message cannot be empty').max(1000, 'Message too long'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type ReportFormData = z.infer<typeof reportSchema>;
export type MessageFormData = z.infer<typeof messageSchema>;
