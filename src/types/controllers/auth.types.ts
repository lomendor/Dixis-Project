import { Request } from 'express-serve-static-core';
import { UserDocument } from '../models/user.types';

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface ForgotPasswordBody {
  email: string;
}

export interface ResetPasswordBody {
  password: string;
}

export interface UpdatePasswordBody {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileBody {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface RegisterRequest extends Omit<Request, 'body'> {
  body: RegisterBody;
}

export interface LoginRequest extends Omit<Request, 'body'> {
  body: LoginBody;
}

export interface AuthenticatedRequest extends Request {
  user: UserDocument;
}

export interface ForgotPasswordRequest extends Omit<Request, 'body'> {
  body: ForgotPasswordBody;
}

export interface ResetPasswordRequest extends Omit<Request, 'body'> {
  params: {
    token: string;
  };
  body: ResetPasswordBody;
}

export interface UpdatePasswordRequest extends Omit<AuthenticatedRequest, 'body'> {
  body: UpdatePasswordBody;
}

export interface UpdateProfileRequest extends Omit<AuthenticatedRequest, 'body'> {
  body: UpdateProfileBody;
}

export interface TokenPayload {
  id: string;
  role?: string;
  iat?: number;
  exp?: number;
}
