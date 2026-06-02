import { z } from "zod/v4";

export const UserAuthentificationDto = z.object({
  email: z.email(),
  password: z.string().min(3).max(32),
});

export type UserAuthentification = z.infer<typeof UserAuthentificationDto>;
