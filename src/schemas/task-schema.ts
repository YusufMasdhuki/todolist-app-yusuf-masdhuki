import { z } from 'zod';

export const taskSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .nonempty('Title is required'),

  priority: z
    .enum(['LOW', 'MEDIUM', 'HIGH'])
    .refine((val) => val !== undefined && val !== null, {
      message: 'Priority is required',
    }),

  date: z
    .string()
    .nonempty('Date is required')
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date',
    }),
});

export type TaskInput = z.infer<typeof taskSchema>;
