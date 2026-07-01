import { z } from "zod/v4";
import { RoleSchema } from "./roles.js";

export const UserSessionDataSchema = z.object({
  id: z.string(),
  role: RoleSchema,
});

export type UserSessionData = z.infer<typeof UserSessionDataSchema>;
