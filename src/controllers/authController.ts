import jwt from 'jsonwebtoken';
import { z } from 'zod';
import crypto from 'crypto';
import User, { UserSchema, UserDocument } from '../models/User';
import { NotificationService } from '../services/notificationService';
import type { CustomRequestHandler, RefreshTokenResponse, ValidationErrorResponse } from '../types/express';

// Register
export const register: CustomRequestHandler<{}, { message: string } | ValidationErrorResponse, z.infer<typeof UserSchema>> = async (req, res) => {
  try {
    const validatedData = UserSchema.parse(req.body);
    const user = await User.create(validatedData) as UserDocument;
    const verificationToken = user.createVerificationToken();
    await user.save();

    // Αποστολή email επιβεβαίωσης
    await NotificationService.sendVerificationEmail(
      user.email,
      user.name,
      verificationToken
    );

    return res.json({
      status: 'success',
      message: 'Ο λογαριασμός δημιουργήθηκε. Παρακαλώ ελέγξτε το email σας για επιβεβαίωση.'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.json({
        status: 'error',
        data: {
          errors: error.errors.map(err => ({ message: err.message }))
        }
      });
    }

    if (error instanceof Error && 'code' in error && error.code === 11000) {
      return res.json({
        status: 'error',
        message: 'Το email χρησιμοποιείται ήδη'
      });
    }

    console.error('Error in register:', error);
    return res.json({
      status: 'error',
      message: 'Σφάλμα κατά τη δημιουργία του λογαριασμού'
    });
  }
};

// Login
interface LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
  refreshToken: string;
}

export const login: CustomRequestHandler<{}, LoginResponse, { email: string; password: string }> = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Έλεγχος για email και password
    if (!email || !password) {
      return res.json({
        status: 'error',
        message: 'Παρακαλώ συμπληρώστε email και κωδικό'
      });
    }

    // Αναζήτηση χρήστη με το email (συμπεριλαμβάνοντας το password)
    const user = await User.findOne({ email }).select('+password') as UserDocument;
    if (!user) {
      return res.json({
        status: 'error',
        message: 'Λάθος email ή κωδικός'
      });
    }

    // Έλεγχος κωδικού
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.json({
        status: 'error',
        message: 'Λάθος email ή κωδικός'
      });
    }

    // Έλεγχος επιβεβαίωσης email
    if (!user.isEmailVerified) {
      return res.json({
        status: 'error',
        message: 'Παρακαλώ επιβεβαιώστε το email σας'
      });
    }

    // Δημιουργία JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    // Δημιουργία refresh token
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    // Ενημέρωση lastLogin
    user.lastLogin = new Date();
    await user.save();

    return res.json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    return res.json({
      status: 'error',
      message: 'Σφάλμα κατά τη σύνδεση'
    });
  }
};

// Verify email
export const verifyEmail: CustomRequestHandler<{}, any, { token: string }> = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.body.token)
      .digest('hex');

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.json({
        status: 'error',
        message: 'Μη έγκυρο ή ληγμένο token'
      });
    }

    user.isEmailVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    return res.json({
      status: 'success',
      message: 'Το email επιβεβαιώθηκε με επιτυχία'
    });
  } catch (error) {
    console.error('Error in verifyEmail:', error);
    return res.json({
      status: 'error',
      message: 'Σφάλμα κατά την επιβεβαίωση του email'
    });
  }
};

// Forgot password
export const forgotPassword: CustomRequestHandler<{}, any, { email: string }> = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }) as UserDocument;

    if (!user) {
      return res.json({
        status: 'success',
        message: 'Αν το email υπάρχει, θα λάβετε οδηγίες για την επαναφορά του κωδικού'
      });
    }

    const resetToken = user.createPasswordResetToken();
    await user.save();

    await NotificationService.sendPasswordResetEmail(
      user.email,
      user.name,
      resetToken
    );

    return res.json({
      status: 'success',
      message: 'Οι οδηγίες για την επαναφορά του κωδικού στάλθηκαν στο email σας'
    });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    return res.json({
      status: 'error',
      message: 'Σφάλμα κατά την αποστολή των οδηγιών επαναφοράς κωδικού'
    });
  }
};

// Reset password
export const resetPassword: CustomRequestHandler<{}, any, { token: string; password: string }> = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.body.token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() }
    }).select('+password') as UserDocument;

    if (!user) {
      return res.json({
        status: 'error',
        message: 'Μη έγκυρο ή ληγμένο token'
      });
    }

    // Validate new password
    const validatedData = UserSchema.pick({ password: true }).parse(req.body);
    user.password = validatedData.password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.json({
      status: 'success',
      message: 'Ο κωδικός άλλαξε με επιτυχία'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.json({
        status: 'error',
        message: 'Ο κωδικός δεν πληροί τις προϋποθέσεις',
        data: error.errors
      });
    }

    console.error('Error in resetPassword:', error);
    return res.json({
      status: 'error',
      message: 'Σφάλμα κατά την αλλαγή του κωδικού'
    });
  }
};

// Refresh token
interface RefreshTokenRequest {
  refreshToken: string;
}

export const refreshToken: CustomRequestHandler<{}, RefreshTokenResponse, RefreshTokenRequest> = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.json({
        status: 'error',
        message: 'Δεν παρέχεται refresh token'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET as string) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.json({
        status: 'error',
        message: 'Μη έγκυρο refresh token'
      });
    }

    // Generate new access token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    return res.json({
      status: 'success',
      data: { token }
    });
  } catch (error) {
    console.error('Error in refreshToken:', error);
    return res.json({
      status: 'error',
      message: 'Μη έγκυρο ή ληγμένο refresh token'
    });
  }
};

// Logout
export const logout: CustomRequestHandler<{}, { message: string }> = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id);

    if (!user) {
      return res.json({
        status: 'error',
        message: 'Δεν έχετε συνδεθεί'
      });
    }

    // Clear refresh token
    user.refreshToken = null;
    await user.save();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    return res.json({
      status: 'success',
      message: 'Αποσυνδεθήκατε επιτυχώς'
    });
  } catch (error) {
    console.error('Error in logout:', error);
    return res.json({
      status: 'error',
      message: 'Σφάλμα κατά την αποσύνδεση'
    });
  }
};

// ... θα συνεχίσω με τα υπόλοιπα endpoints (forgot/reset password, update profile) ... 