import type { Response } from 'express';
import Order from '../../models/Order';
import type {
  TypedRequestBody,
  TypedRequestParams,
  UpdateOrderBody,
  ReviewParams,
  OrderDocument
} from '../../types/admin';
import { sendResponse, sendError, HTTP_STATUS } from '../../utils/response';

export const getOrders = async (_req: TypedRequestBody<void>, res: Response): Promise<void> => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .lean() as OrderDocument[];
    sendResponse(res, orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    sendError(res, 'Internal server error');
  }
};

export const updateOrder = async (
  req: TypedRequestBody<UpdateOrderBody> & TypedRequestParams<ReviewParams>,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    ).populate('user', 'name email').lean() as OrderDocument | null;

    if (!order) {
      sendError(res, 'Order not found', HTTP_STATUS.NOT_FOUND);
      return;
    }

    sendResponse(res, order);
  } catch (error) {
    console.error('Error updating order:', error);
    sendError(res, 'Internal server error');
  }
}; 