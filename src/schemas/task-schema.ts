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

  date: z.preprocess(
    (val) => (val === '' || val == null ? undefined : val),
    z
      .date()
      .refine((val) => !!val, { message: 'Date is required' })
      .refine((val) => !isNaN(val.getTime()), {
        message: 'Invalid date',
      })
  ),
});

export type Task = z.infer<typeof taskSchema>;
