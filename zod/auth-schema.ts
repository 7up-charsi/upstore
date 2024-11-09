import { z } from 'zod';

const baseSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email(),
});

export const signInSchema = baseSchema;

export const signUpSchema = baseSchema.extend({
  fullName: z
    .string()
    .trim()
    .min(2, 'Full name must contain at least 2 character(s)')
    .max(12, 'Full name must contain at most 12 character(s)'),
});
