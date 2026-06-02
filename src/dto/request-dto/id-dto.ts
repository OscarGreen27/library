import { z } from "zod/v4";

export const IdDtoSchema = z.object({
  id: z.coerce.number().int().positive(),
});
