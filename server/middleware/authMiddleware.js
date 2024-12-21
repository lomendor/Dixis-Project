import jwt from 'jsonwebtoken';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({
        status: 'error',
        message: 'Δεν έχετε συνδεθεί'
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    if (typeof decoded === 'string') {
      throw new Error('Invalid token payload');
    }

    req.user = {
      _id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      permissions: decoded.permissions
    };

    next();
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Μη έγκυρο token'
    });
  }
}; 