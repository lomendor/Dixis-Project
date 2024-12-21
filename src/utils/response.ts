import type { Response } from 'express';

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

type StatusCode = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];

export function sendResponse<T>(res: Response, data: T, statusCode: StatusCode = HTTP_STATUS.OK): void {
  (res as any).status(statusCode).json(data);
}

export function sendError(res: Response, message: string, statusCode: StatusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR): void {
  (res as any).status(statusCode).json({ error: message });
}
 