import { z } from "zod/v4";

/**
 * validate id from qury param
 */
export const IdDtoSchema = z.coerce.number().int().positive();
