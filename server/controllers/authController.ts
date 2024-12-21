import { Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import { sendEmail } from '../utils/email';
import {
  RegisterRequest,
  LoginRequest,
  AuthenticatedRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UpdatePasswordRequest,
  UpdateProfileRequest,
  TokenPayload
} from '../../src/types/controllers/auth.types';
import { UserRole, UserStatus } from '../../src/types/models/user.types';

// Generate JWT Token
export const generateToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Generate Refresh Token
export const generateRefreshToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: '7d'
  });
};

// Update password
export const updatePassword = async (req: UpdatePasswordRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Ο χρήστης δεν βρέθηκε'
      });
    }

    // Check current password
    const isMatch = await user.comparePassword(req.body.currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Ο τρέχων κωδικός είναι λάθος'
      });
    }

    // Update password
    user.password = req.body.newPassword;
    await user.save();

    // Generate new token
    const token = generateToken(user._id.toString());

    res.json({
      status: 'success',
      token,
      message: 'Ο κωδικός άλλαξε επιτυχώς'
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Σφάλμα κατά την αλλαγή κωδικού'
    });
  }
};

// Update profile
export const updateProfile = async (req: UpdateProfileRequest, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        email: req.body.email,
        avatar: req.body.avatar
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Ο χρήστης δεν βρέθηκε'
      });
    }

    res.json({
      status: 'success',
      data: user,
      message: 'Το προφίλ ενημερώθηκε επιτυχώς'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Σφάλμα κατά την ενημέρωση του προφίλ'
    });
  }
};

// Register new user
export const register = async (req: RegisterRequest, res: Response) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        status: 'error',
        message: 'Υπάρχει ήδη λογαριασμός με αυτό το email'
      });
    }

    // Create user
    const user = await User.create({
      ...req.body,
      status: UserStatus.Active
    });

    // Generate token
    const token = generateToken(user._id.toString());

    // Remove password from output
    user.password = undefined;

    res.status(201).json({
      status: 'success',
      token,
      data: user
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Σφάλμα κατά την εγγραφή'
    });
  }
};

// Login user
export const login = async (req: LoginRequest, res: Response) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email });

    // Check if email and password exist
    if (!email || !password) {
      console.log('Missing credentials');
      return res.status(400).json({
        status: 'error',
        message: 'Παρακαλώ συμπληρώστε email και κωδικό'
      });
    }

    // Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');
    console.log('User found:', !!user);
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Λάθος email ή κωδικός'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Λάθος email ή κωδικός'
      });
    }

    // Check if user is active
    if (user.status !== UserStatus.Active) {
      return res.status(401).json({
        status: 'error',
        message: 'Ο λογαριασμός σας έχει απενεργοποιηθεί'
      });
    }

    // Generate tokens
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { id: user._id.toString() },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    user.password = undefined;

    return res.json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status,
          avatar: user.avatar,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        },
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Σφάλμα κατά τη σύνδεση'
    });
  }
};

// Logout user
export const logout = (_req: AuthenticatedRequest, res: Response) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.json({
    status: 'success',
    message: 'Αποσυνδεθήκατε επιτυχώς'
  });
};

// Get current user
export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      status: 'success',
      data: user
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Σφάλμα κατά την ανάκτηση των στοιχείων χρήστη'
    });
  }
};

// Forgot password
export const forgotPassword = async (req: ForgotPasswordRequest, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Δεν υπάρχει χρήστης με αυτό το email'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpire = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

    // Send email
    const message = `
      Λάβαμε αίτημα επαναφοράς του κωδικού σας. 
      Παρακαλώ πατήστε στον παρακάτω σύνδεσμο για να ορίσετε νέο κωδικό:
      \n\n${resetUrl}\n\n
      Ο σύνδεσμος θα λήξει σε 30 λεπτά.
      \n\n
      Αν δεν ζητήσατε εσείς επαναφορά κωδικού, παρακαλώ αγνοήστε αυτό το email.
    `;

    await sendEmail({
      email: user.email,
      subject: 'Επαναφορά Κωδικού',
      message
    });

    res.json({
      status: 'success',
      message: 'Το email επαναφοράς κωδικού στάλθηκε'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    
    // Clear reset tokens
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
    }

    res.status(500).json({
      status: 'error',
      message: 'Σφάλμα κατά την αποστολή του email. Παρακαλώ δοκιμάστε ξανά αργότερα'
    });
  }
};

// Reset password
export const resetPassword = async (req: ResetPasswordRequest, res: Response) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        status: 'error',
        message: 'Μη έγκυρος ή ληγμένος σύνδεσμος επαναφοράς'
      });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Generate token
    const token = generateToken(user._id.toString());

    res.json({
      status: 'success',
      token
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Σφάλμα κατά την επαναφορά του κωδικού'
    });
  }
};
