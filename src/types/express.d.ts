import { Response as ExpressResponse } from 'express';

declare module 'express' {
  export interface Response extends ExpressResponse {
    status(code: number): this;
    json(body: any): this;
  }
} 