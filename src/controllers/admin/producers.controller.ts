import type { Response } from 'express';
import Producer from '../../models/Producer';
import User from '../../models/User';
import type {
  TypedRequestBody,
  TypedRequestParams,
  AssignProducerBody,
  ReviewApplicationBody,
  ReviewParams,
  UserDocument
} from '../../types/admin';
import { sendResponse, sendError, HTTP_STATUS } from '../../utils/response';

export const assignProducerToSeller = async (
  req: TypedRequestBody<AssignProducerBody>,
  res: Response
): Promise<void> => {
  const { sellerId, producerId } = req.body;

  try {
    const user = await User.findById(sellerId).lean() as UserDocument | null;
    const producer = await Producer.findById(producerId).lean();

    if (!user) {
      sendError(res, 'Seller not found', HTTP_STATUS.NOT_FOUND);
      return;
    }

    if (!producer) {
      sendError(res, 'Producer not found', HTTP_STATUS.NOT_FOUND);
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(
      sellerId,
      {
        $addToSet: { managedProducers: producerId }
      },
      { new: true }
    ).lean();

    if (!updatedUser) {
      sendError(res, 'Failed to update user', HTTP_STATUS.NOT_FOUND);
      return;
    }

    sendResponse(res, { message: 'Producer assigned successfully' });
  } catch (error) {
    console.error('Error assigning producer:', error);
    sendError(res, 'Internal server error');
  }
};

export const getPendingApplications = async (_req: TypedRequestBody<void>, res: Response): Promise<void> => {
  try {
    const applications = await Producer.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .select('name email status createdAt')
      .lean();
    sendResponse(res, applications);
  } catch (error) {
    console.error('Error fetching pending applications:', error);
    sendError(res, 'Internal server error');
  }
};

export const reviewApplication = async (
  req: TypedRequestBody<ReviewApplicationBody> & TypedRequestParams<ReviewParams>,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { status, feedback } = req.body;

  try {
    const producer = await Producer.findByIdAndUpdate(
      id,
      { status, feedback },
      { new: true }
    ).lean();

    if (!producer) {
      sendError(res, 'Producer not found', HTTP_STATUS.NOT_FOUND);
      return;
    }

    sendResponse(res, producer);
  } catch (error) {
    console.error('Error reviewing application:', error);
    sendError(res, 'Internal server error');
  }
}; 