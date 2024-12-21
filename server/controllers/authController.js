import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendEmail } from '../utils/email.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Register new user
export const register = async (req, res) => {
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
      status: 'active'
    });

    // Generate token
    const token = generateToken(user._id);

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
export const login = async (req, res) => {
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
    if (user.status !== 'active') {
      return res.status(401).json({
        status: 'error',
        message: 'Ο λογαριασμός σας έχει απενεργοποιηθεί'
      });
    }

    // Generate tokens
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
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
export const logout = (req, res) => {
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
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

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
export const forgotPassword = async (req, res) => {
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
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes

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
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    res.status(500).json({
      status: 'error',
      message: 'Σφάλμα κατά την αποστολή του email. Παρακαλώ δοκιμάστε ξανά αργότερα'
    });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
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
        message: 'Μη έγκυρο ή ληγμένο token επαναφοράς'
      });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      status: 'success',
      token,
      message: 'Ο κωδικός σας άλλαξε επιτυχώς'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Σφάλμα κατά την επαναφορά του κωδικού'
    });
  }
};

// Update password
export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!(await user.comparePassword(req.body.currentPassword))) {
      return res.status(401).json({
        status: 'error',
        message: 'Ο τρέχων κωδικός είναι λάθος'
      });
    }

    // Update password
    user.password = req.body.newPassword;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      status: 'success',
      token,
      message: 'Ο κωδικός σας ενημερώθηκε επιτυχώς'
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Σφάλμα κατά την ενημέρωση του κωδικού'
    });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    // Prevent password update
    if (req.body.password) {
      return res.status(400).json({
        status: 'error',
        message: 'Αυτή η διαδρομή δεν είναι για ενημέρωση κωδικού'
      });
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address
      },
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      status: 'success',
      data: user,
      message: 'Το προφίλ σας ενημερώθηκε επιτυχώς'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Σφάλμα κατά την ενημέρωση του προφίλ'
    });
  }
}; 