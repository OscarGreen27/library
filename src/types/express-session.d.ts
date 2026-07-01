import "express-session";
import { Roles } from "./roles.ts";

declare module "express-session" {
  interface SessionData {
    userData?: {
      id: string;
      role: Roles;
    };
  }
}
