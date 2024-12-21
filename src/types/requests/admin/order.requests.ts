import { UpdateOrderBody } from '../../models/order.types';
import { IdParam } from './index';

export interface GetOrdersQuery {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdateOrderRequest {
  params: IdParam;
  body: UpdateOrderBody;
} 