import { z } from "zod/v4";

export const RoleSchema = z.enum(["admin", "user"]);
export type Roles = z.infer<typeof RoleSchema>;
