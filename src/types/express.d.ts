import { Request as ExpressRequest, Response as ExpressResponse } from 'express';

export interface Request extends ExpressRequest {
  params: Record<string, string>;
  query: Record<string, string>;
  body: any;
  user?: any;
}

export interface Response extends ExpressResponse {
  status(code: number): this;
  json<T = any>(body: T): Response;
}

export type CustomRequestHandler = (req: Request, res: Response) => Promise<Response | void>;

declare module 'express' {
  interface Request extends ExpressRequest {
    params: Record<string, string>;
    query: Record<string, string>;
    body: any;
    user?: any;
  }

  interface Response extends ExpressResponse {
    status(code: number): this;
    json<T = any>(body: T): Response;
  }
} 