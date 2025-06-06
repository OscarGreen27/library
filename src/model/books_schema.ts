import { z } from "zod/v4";


export const BookSchema = z.object({
  title: z.string(),
  year: z.number(),
  author: z.string(),
  pages: z.number(),
  isbn: z.number(),
  description: z.string(),
  id: z.number().optional(),
  numbersOfView: z.number().optional(),
  wantCount: z.number().optional(),
  cover: z.string().optional()
});

export type BookDto = z.infer<typeof BookSchema>;
