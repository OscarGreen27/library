import { z } from "zod/v4";
export const AuthorSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
});

export type Author = z.infer<typeof AuthorSchema>;
