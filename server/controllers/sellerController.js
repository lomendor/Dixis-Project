import User from '../models/User';
import Producer from '../models/Producer';

// Λίστα πωλητών με φίλτρα
export const getSellers = async (req, res) => {
  try {
    const { search = '', status = '' } = req.body;
    
    let query = { role: 'seller' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) {
      query.status = status;
    }

    const sellers = await User.find(query)
      .select('name email status managedProducers sellerStats createdAt lastLogin')
      .populate('managedProducers.producer', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      status: 'success',
      data: sellers
    });
  } catch (error) {
    console.error('Error in getSellers:', error);
    res.status(500).json({
      status: 'error',
      message: 'Σφάλμα κατά την ανάκτηση των πωλητών'
    });
  }
};

// Λεπτομέρειες πωλητή
export const getSeller = async (req, res) => {
  try {
    const seller = await User.findById(req.params.id)
      .select('-password')
      .populate('managedProducers.producer');
    
    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({
        status: 'error',
        message: 'Ο πωλητής δεν βρέθηκε'
      });
    }

    res.json({
      status: 'success',
      data: seller
    });
  } catch (error) {
    console.error('Error in getSeller:', error);
    res.status(500).json({
      status: 'error',
      message: 'Σφάλμα κατά την ανάκτηση του πωλητή'
    });
  }
};

// Ανάθεση παραγωγού σε πωλητή
export const assignProducer = async (req, res) => {
  try {
    const { sellerId, producerId, commission } = req.body;

    const seller = await User.findById(sellerId);
    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({
        status: 'error',
        message: 'Ο πωλητής δεν βρέθηκε'
      });
    }

    const producer = await Producer.findById(producerId);
    if (!producer) {
      return res.status(404).json({
        status: 'error',
        message: 'Ο παραγωγός δεν βρέθηκε'
      });
    }

    await seller.assignProducer(producerId, commission);

    res.json({
      status: 'success',
      message: 'Ο παραγωγός ανατέθηκε επιτυχώς στον πωλητή'
    });
  } catch (error) {
    console.error('Error in assignProducer:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Σφάλμα κατά την ανάθεση του παραγωγού'
    });
  }
};

// Αφαίρεση παραγωγού από πωλητή
export const removeProducer = async (req, res) => {
  try {
    const { sellerId, producerId } = req.body;

    const seller = await User.findById(sellerId);
    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({
        status: 'error',
        message: 'Ο πωλητής δεν βρέθηκε'
      });
    }

    await seller.removeProducer(producerId);

    res.json({
      status: 'success',
      message: 'Ο παραγωγός αφαιρέθηκε επιτυχώς από τον πωλητή'
    });
  } catch (error) {
    console.error('Error in removeProducer:', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Σφάλμα κατά την αφαίρεση του παραγωγού'
    });
  }
};

// Ενημέρωση στατιστικών πωλητή
export const updateSellerStats = async (req, res) => {
  try {
    const { sellerId, month, commission, sales } = req.body;

    const seller = await User.findById(sellerId);
    if (!seller || seller.role !== 'seller') {
      return res.status(404).json({
        status: 'error',
        message: 'Ο πωλητής δεν βρέθηκε'
      });
    }

    await seller.updateMonthlyStats(new Date(month), commission, sales);

    res.json({
      status: 'success',
      message: 'Τα στατιστικά του πωλητή ενημερώθηκαν επιτυχώς'
    });
  } catch (error) {
    console.error('Error in updateSellerStats:', error);
    res.status(500).json({
      status: 'error',
      message: 'Σφάλμα κατά την ενημέρωση των στατιστικών'
    });
  }
};

// Λίστα διαθέσιμων παραγωγών για ανάθεση
export const getAvailableProducers = async (req, res) => {
  try {
    const { search = '' } = req.query;
    
    let query = { 
      status: 'active',
      // Εξαιρούμε παραγωγούς που έχουν ήδη ανατεθεί
      _id: { 
        $nin: await User.distinct('managedProducers.producer', { role: 'seller' })
      }
    };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const producers = await Producer.find(query)
      .select('name email phone')
      .sort({ name: 1 });

    res.json({
      status: 'success',
      data: producers
    });
  } catch (error) {
    console.error('Error in getAvailableProducers:', error);
    res.status(500).json({
      status: 'error',
      message: 'Σφάλμα κατά την ανάκτηση των διαθέσιμων παραγωγών'
    });
  }
}; 