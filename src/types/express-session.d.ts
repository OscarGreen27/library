import "express-session";

declare module "express-session" {
  interface SessionData {
    userData?: {
      id: string;
      role: string;
    };
  }
}
