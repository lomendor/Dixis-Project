import User from '../models/User.js';
import Order from '../models/Order.js';

export const exportUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password')
      .lean();

    const orders = await Order.find({ user: req.user.userId })
      .populate('items.product')
      .lean();

    const userData = {
      personalInfo: {
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      orders: orders.map(order => ({
        id: order._id,
        items: order.items,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        shippingAddress: order.shippingAddress,
      })),
    };

    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Failed to export user data' });
  }
};

export const deleteUserAccount = async (req, res) => {
  try {
    // Delete user's orders
    await Order.deleteMany({ user: req.user.userId });

    // Delete user account
    await User.findByIdAndDelete(req.user.userId);

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete account' });
  }
};

export const updatePrivacySettings = async (req, res) => {
  try {
    const { marketingEmails, dataSharing } = req.body;

    await User.findByIdAndUpdate(req.user.userId, {
      privacySettings: { marketingEmails, dataSharing },
    });

    res.json({ message: 'Privacy settings updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update privacy settings' });
  }
};