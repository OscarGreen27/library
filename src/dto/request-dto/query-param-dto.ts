import { z } from "zod/v4";

const parseNumericParam = (defaultValue: number) =>
  z.unknown().transform((val) => {
    const parsed = Number(val);
    return val === undefined || val === "" || Number.isNaN(parsed) ? defaultValue : parsed;
  });

export const QueryParamSchema = z.object({
  offset: parseNumericParam(0).pipe(z.number().int().gte(0)),
  limit: parseNumericParam(5).pipe(z.number().int().positive()),
});
