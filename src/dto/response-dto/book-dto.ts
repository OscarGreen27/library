import z from "zod/v4";

export const BookSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  year: z.coerce.number(),
  authors: z.string().array(),
  pages: z.coerce.number(),
  isbn: z.coerce.number(),
  description: z.string(),
});

export type Book = z.infer<typeof BookSchema>;
