import { UserRegistration } from "../dto/request-dto/user-registration-dto.ts";

declare global {
  namespace Express {
    interface Request {
      body: {
        user?: UserRegistration;
      };
    }
  }
}
