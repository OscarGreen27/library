import { z } from "zod/v4";


export const BookSchema = z.object({
  title: z.string(),
  year: z.coerce.number(),
  author: z.string(),
  pages: z.coerce.number(),
  isbn: z.coerce.number(),
  description: z.string(),
  id: z.coerce.number().optional(),
  numbersOfView: z.coerce.number().optional(),
  wantCount: z.coerce.number().optional(),
  cover: z.string().optional()
});

export type BookDto = z.infer<typeof BookSchema>;
