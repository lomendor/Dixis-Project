import type { Request, Response } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';
import type { Document } from 'mongoose';

// Extend Document to include required fields
export interface AuthenticatedUser extends Document {
  _id: string;
  role: string;
  managedProducers?: string[];
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

// Express Request type
export interface CustomRequest<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
> {
  params: P;
  body: ReqBody;
  query: ReqQuery;
  user?: AuthenticatedUser;
}

// Express Response type
export interface CustomResponse<ResBody = any> {
  json(body: ApiResponse<ResBody>): Response;
  status(code: number): Response;
}

// Request Handler type
export type CustomRequestHandler<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = ParsedQs,
> = (
  req: Request & CustomRequest<P, ResBody, ReqBody, ReqQuery>,
  res: Response & CustomResponse<ResBody>,
  next?: () => void,
) => Promise<void | Response>; 