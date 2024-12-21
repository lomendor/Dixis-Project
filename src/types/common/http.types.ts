import { Request, ParamsDictionary, Query } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { Document } from 'mongoose';

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type StatusCode = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];

// HTTP specific types
export interface HttpHeaders {
  [key: string]: string;
}

export interface HttpRequest {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: HttpHeaders;
  body?: any;
}

export interface HttpError extends Error {
  status: StatusCode;
  code?: string;
  details?: Record<string, unknown>;
}

// Express specific types
export interface AuthenticatedUser extends Document {
  _id: string;
  role: string;
  managedProducers?: string[];
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

export interface RefreshTokenResponse {
  token: string;
}

export interface ValidationErrorResponse {
  errors: Array<{ message: string }>;
}

// Request Types
export interface TypedRequestBody<T> extends Omit<Request, 'body'> {
  body: T;
}

export interface TypedRequestParams<T extends ParamsDictionary> extends Omit<Request, 'params'> {
  params: T;
}

export interface TypedRequestQuery<T extends Query> extends Omit<Request, 'query'> {
  query: T;
}

export interface TypedRequest<T, P extends ParamsDictionary> extends Omit<Request, 'body' | 'params'> {
  body: T;
  params: P;
}

// Custom Express Types
export interface CustomRequest extends Request {
  user?: AuthenticatedUser;
}

export interface CustomResponse<ResBody = any> extends Omit<Response, 'json'> {
  json(body: ApiResponse<ResBody | ValidationErrorResponse>): Response;
}

export type CustomRequestHandler = (
  req: CustomRequest,
  res: CustomResponse,
  next?: () => void,
) => Promise<void | Response>; 