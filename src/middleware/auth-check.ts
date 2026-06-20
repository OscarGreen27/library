import { NextFunction, Request, Response } from "express";

export const authorize = (requiredRole: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const sessionData = req.session.userData;
    if (!sessionData) {
      return next(new Error("Unauthorized: No session"));
    }

    if (sessionData.role !== requiredRole) {
      return next(new Error("Forbiden: Insufficient permissions"));
    }

    next();
  };
};
