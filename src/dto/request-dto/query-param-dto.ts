import { z } from "zod/v4";

export const QueryParamSchema = z.object({
  offset: z.coerce.number().int().gte(0).default(0),
  limit: z.coerce.number().int().positive().default(10),
});
