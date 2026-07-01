import { NextFunction, Request, Response } from "express";
import { ForbiddenError, UnauthorizedError } from "../errors/app-errors.js";
import { Roles } from "../types/roles.js";


export const authorize = (requiredRoles: Roles[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const sessionData = req.session.userData;
    if (!sessionData) {
      return next(new UnauthorizedError("No session"));
    }

    if (!requiredRoles.includes(sessionData.role)) {
      return next(new ForbiddenError("Insufficient permissions"));
    }

    next();
  };
};
