import { Request } from 'express-serve-static-core';
import { Permission } from '../common/permissions.types';

export interface CreateRoleRequest extends Omit<Request, 'body'> {
  body: {
    name: string;
    permissions: Permission[];
  };
}

export interface UpdateRoleRequest extends Omit<Request, 'body' | 'params'> {
  params: {
    id: string;
  };
  body: {
    name: string;
    permissions: Permission[];
  };
}

export interface DeleteRoleRequest extends Omit<Request, 'params'> {
  params: {
    id: string;
  };
}

export interface AssignUserPermissionsRequest extends Omit<Request, 'body' | 'params'> {
  params: {
    userId: string;
  };
  body: {
    permissions: Permission[];
  };
}

export interface GetUserPermissionsRequest extends Omit<Request, 'params'> {
  params: {
    userId: string;
  };
}

export interface Role {
  id: string;
  name: string;
  permissions: Permission[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PermissionGroup {
  name: string;
  permissions: Permission[];
  description?: string;
}
