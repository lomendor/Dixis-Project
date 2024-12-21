import { UpdateUserBody } from '../../models/user.types';
import { IdParam } from './index';

export interface GetUsersQuery {
  page?: number;
  limit?: number;
  sort?: string;
  search?: string;
}

export interface UpdateUserRequest {
  params: IdParam;
  body: UpdateUserBody;
} 