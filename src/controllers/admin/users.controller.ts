import type { Response } from 'express';
import User from '../../models/User';
import type {
  TypedRequestBody,
  TypedRequestParams,
  UpdateUserBody,
  ReviewParams
} from '../../types/admin';
import { sendResponse, sendError, HTTP_STATUS } from '../../utils/response';

export const getUsers = async (_req: TypedRequestBody<void>, res: Response): Promise<void> => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();
    sendResponse(res, users);
  } catch (error) {
    console.error('Error fetching users:', error);
    sendError(res, 'Internal server error');
  }
};

export const updateUser = async (
  req: TypedRequestBody<UpdateUserBody> & TypedRequestParams<ReviewParams>,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    ).select('-password').lean();

    if (!user) {
      sendError(res, 'User not found', HTTP_STATUS.NOT_FOUND);
      return;
    }

    sendResponse(res, user);
  } catch (error) {
    console.error('Error updating user:', error);
    sendError(res, 'Internal server error');
  }
}; 