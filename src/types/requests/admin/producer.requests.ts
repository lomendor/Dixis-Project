import { AssignProducerBody, ReviewApplicationBody } from '../../models/producer.types';
import { IdParam } from './index';

export interface GetProducersQuery {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface AssignProducerRequest {
  body: AssignProducerBody;
}

export interface ReviewApplicationRequest {
  params: IdParam;
  body: ReviewApplicationBody;
} 