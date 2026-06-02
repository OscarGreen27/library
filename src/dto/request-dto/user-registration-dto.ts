import { z } from "zod/v4";

export const UserRegistrationDto = z.object({
  name: z.string().min(3).max(16),
  email: z.email(),
  password: z.string().min(4).max(32),
  role: z.string().optional().default("user"),
});

export type UserRegistration = z.infer<typeof UserRegistrationDto>;
