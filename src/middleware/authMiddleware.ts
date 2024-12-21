import { Request, Response, NextFunction } from 'express-serve-static-core';
import type { RequestHandler } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';

// Extend Express Request
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      _id: string;
      role: string;
      managedProducers?: string[];
    };
  }
}

// Auth middleware
export const isAuth: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const bearerToken = req.headers.authorization?.replace('Bearer ', '');

    if (!bearerToken) {
      res.status(401).json({
        status: 'error',
        message: 'Δεν έχετε πρόσβαση. Παρακαλώ συνδεθείτε.'
      });
      return;
    }

    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET as string) as {
      id: string;
      role: string;
    };

    req.user = {
      _id: decoded.id,
      role: decoded.role,
      managedProducers: []
    };

    next();
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Μη έγκυρο token. Παρακαλώ συνδεθείτε ξανά.'
    });
    return;
  }
};

// Admin middleware
export const isAdmin: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({
      status: 'error',
      message: 'Δεν έχετε δικαιώματα διαχειριστή.'
    });
    return;
  }
  next();
};

// Seller middleware
export const isSeller: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (req.user?.role !== 'seller') {
    res.status(403).json({
      status: 'error',
      message: 'Δεν έχετε δικαιώματα πωλητή.'
    });
    return;
  }
  next();
};

// Check if user has access to producer
export const hasProducerAccess: RequestHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const producerId = req.params.producerId || req.body.producerId;
  const user = req.user;

  if (!user) {
    res.status(401).json({
      status: 'error',
      message: 'Δεν έχετε συνδεθεί.'
    });
    return;
  }

  const hasAccess = 
    user.role === 'admin' || 
    (user.role === 'seller' && user.managedProducers?.includes(producerId)) ||
    user._id === producerId;

  if (!hasAccess) {
    res.status(403).json({
      status: 'error',
      message: 'Δεν έχετε πρόσβαση σε αυτόν τον παραγωγό.'
    });
    return;
  }

  next();
}; 