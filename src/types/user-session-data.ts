import { z } from "zod/v4";

export const UserSessionDataSchema = z.object({
  id: z.string(),
  role: z.string(),
});

export type UserSessionData = z.infer<typeof UserSessionDataSchema>;
