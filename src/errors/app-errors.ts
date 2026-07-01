/**
 * module contains classes that extend the standard Error class to send appropriate codes and messages if necessary.
 */

import { MulterError } from "multer";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(404, message);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Resource already exists") {
    super(409, message);
  }
}

export class PayloadTooLargeError extends AppError {
  constructor(message = "File too large") {
    super(413, message);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(400, message);
  }
}

export function fromMulterError(err: MulterError): AppError {
  switch (err.code) {
    case "LIMIT_FILE_SIZE":
      return new PayloadTooLargeError("File is too large");
    case "LIMIT_FILE_COUNT":
      return new BadRequestError("Too many files");
    case "LIMIT_UNEXPECTED_FILE":
      return new BadRequestError(`Unexpected field: ${err.field}`);
    default:
      return new BadRequestError(err.message);
  }
}
