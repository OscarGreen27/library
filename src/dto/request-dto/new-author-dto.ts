import { z } from "zod/v4";

export const NewAuthorSchema = z.object({
  name: z.string().min(3).max(32),
});
