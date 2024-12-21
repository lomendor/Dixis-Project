import { Request } from 'express-serve-static-core';
import { ParamsDictionary } from 'express-serve-static-core';

// Base Request Types
export interface TypedRequestBody<T> extends Omit<Request, 'body'> {
  body: T;
}

export interface TypedRequestParams<T extends ParamsDictionary> extends Omit<Request, 'params'> {
  params: T;
}

export interface TypedRequest<T, P extends ParamsDictionary> extends Omit<Request, 'body' | 'params'> {
  body: T;
  params: P;
}

// Common Params Types
export interface IdParam extends ParamsDictionary {
  id: string;
}

// Re-export all request types
export * from './user.requests';
export * from './order.requests';
export * from './producer.requests'; 