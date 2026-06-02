import { z } from "zod/v4";

export const newBookDtoSchema = z.object({
  title: z.string().min(1).max(64),
  year: z.number().int().positive(), //z.coerce.number(),
  authors: z.array(z.number().int().positive()),
  pages: z.number().int().positive(),
  isbn: z.number().int().positive().gte(1000000000000).lte(9999999999999),//change type to string?
  description: z.string().max(300),
  cover: z.string().optional().default(""),
});

export type newBook = z.infer<typeof newBookDtoSchema>;
