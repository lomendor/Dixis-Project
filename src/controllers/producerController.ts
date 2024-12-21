import type { Request, Response } from 'express';
import type { CustomRequestHandler, ApiResponse } from '../types/express';
import Producer, { ProducerDocument } from '../models/Producer';
import Product from '../models/Product';
import Order, { OrderDocument, OrderItem } from '../models/Order';
import { z } from 'zod';
import mongoose, { Document } from 'mongoose';

// Validation schemas
const ProducerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string(),
  address: z.string().optional(),
  description: z.string().optional()
});

// Get all producers
export const getProducers: CustomRequestHandler = async (req, res) => {
  try {
    const producers = await Producer.find()
      .populate('certifications')
      .sort({ createdAt: -1 });

    return res.json({
      status: 'success',
      data: producers
    } as ApiResponse);
  } catch (error) {
    console.error('Error in getProducers:', error);
    return res.json({
      status: 'error',
      message: 'Σφάλμα κατά την ανάκτηση των παραγωγών'
    } as ApiResponse);
  }
};

// Get single producer
export const getProducer: CustomRequestHandler = async (req, res) => {
  try {
    const producer = await Producer.findById(req.params.id)
      .populate('certifications');

    if (!producer) {
      return res.json({
        status: 'error',
        message: 'Ο παραγωγός δεν βρέθηκε'
      } as ApiResponse);
    }

    return res.json({
      status: 'success',
      data: producer
    } as ApiResponse);
  } catch (error) {
    console.error('Error in getProducer:', error);
    return res.json({
      status: 'error',
      message: 'Σφάλμα κατά την ανάκτηση του παραγωγού'
    } as ApiResponse);
  }
};

// Create producer
export const createProducer: CustomRequestHandler = async (req, res) => {
  try {
    const validatedData = ProducerSchema.parse(req.body);
    const producer = await Producer.create(validatedData);

    return res.json({
      status: 'success',
      data: producer
    } as ApiResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.json({
        status: 'error',
        message: 'Μη έγκυρα δεδομένα',
        data: error.errors
      } as ApiResponse);
    }

    console.error('Error in createProducer:', error);
    return res.json({
      status: 'error',
      message: 'Σφάλμα κατά τη δημιουργία του παραγωγού'
    } as ApiResponse);
  }
};

// Update producer
export const updateProducer: CustomRequestHandler = async (req, res) => {
  try {
    const validatedData = ProducerSchema.partial().parse(req.body);
    const producer = await Producer.findByIdAndUpdate(
      req.params.id,
      validatedData,
      { new: true }
    );

    if (!producer) {
      return res.json({
        status: 'error',
        message: 'Ο παραγωγός δεν βρέθηκε'
      } as ApiResponse);
    }

    return res.json({
      status: 'success',
      data: producer
    } as ApiResponse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.json({
        status: 'error',
        message: 'Μη έγκυρα δεδομένα',
        data: error.errors
      } as ApiResponse);
    }

    console.error('Error in updateProducer:', error);
    return res.json({
      status: 'error',
      message: 'Σφάλμα κατά την ενημέρωση του παραγωγού'
    } as ApiResponse);
  }
};

// Delete producer
export const deleteProducer: CustomRequestHandler = async (req, res) => {
  try {
    const producer = await Producer.findByIdAndDelete(req.params.id);

    if (!producer) {
      return res.json({
        status: 'error',
        message: 'Ο παραγωγός δεν βρέθηκε'
      } as ApiResponse);
    }

    return res.json({
      status: 'success',
      message: 'Ο παραγωγός διαγράφηκε επιτυχώς'
    } as ApiResponse);
  } catch (error) {
    console.error('Error in deleteProducer:', error);
    return res.json({
      status: 'error',
      message: 'Σφάλμα κατά τη διαγραφή του παραγωγού'
    } as ApiResponse);
  }
};

// Bulk action
export const bulkAction: CustomRequestHandler = async (req, res) => {
  try {
    const { ids, action } = req.body;

    switch (action) {
      case 'delete':
        await Producer.deleteMany({ _id: { $in: ids } });
        break;
      case 'activate':
        await Producer.updateMany(
          { _id: { $in: ids } },
          { status: 'active' }
        );
        break;
      case 'deactivate':
        await Producer.updateMany(
          { _id: { $in: ids } },
          { status: 'inactive' }
        );
        break;
      default:
        return res.json({
          status: 'error',
          message: 'Μη έγκυρη ενέργεια'
        } as ApiResponse);
    }

    return res.json({
      status: 'success',
      message: 'Η ενέργεια ολοκληρώθηκε επιτυχώς'
    } as ApiResponse);
  } catch (error) {
    console.error('Error in bulkAction:', error);
    return res.json({
      status: 'error',
      message: 'Σφάλμα κατά την εκτέλεση της ενέργειας'
    } as ApiResponse);
  }
};

// Document management
export const addDocument: CustomRequestHandler = async (req, res) => {
  try {
    const producer = await Producer.findById(req.params.id);
    if (!producer) {
      return res.json({
        status: 'error',
        message: 'Ο παραγωγός δεν βρέθηκε'
      } as ApiResponse);
    }

    producer.documents.push({
      ...req.body,
      status: 'pending'
    });

    await producer.save();

    return res.json({
      status: 'success',
      message: 'Το έγγραφο προστέθηκε επιτυχώς'
    } as ApiResponse);
  } catch (error) {
    console.error('Error in addDocument:', error);
    return res.json({
      status: 'error',
      message: 'Σφάλμα κατά την προσθήκη του εγγράφου'
    } as ApiResponse);
  }
};

// Update document status
export const updateDocumentStatus: CustomRequestHandler = async (req, res) => {
  try {
    const { producerId, documentId } = req.params;
    const { status, comment } = req.body;

    const producer = await Producer.findById(producerId);
    if (!producer) {
      return res.json({
        status: 'error',
        message: 'Ο παραγωγός δεν βρέθηκε'
      } as ApiResponse);
    }

    const document = producer.documents.find(doc => 
      (doc as any)._id.toString() === documentId
    );
    if (!document) {
      return res.json({
        status: 'error',
        message: 'Το έγγραφο δεν βρέθηκε'
      } as ApiResponse);
    }

    document.status = status;
    if (comment) document.comment = comment;
    await producer.save();

    return res.json({
      status: 'success',
      message: 'Η κατάσταση του εγγράφου ενημερώθηκε επιτυχώς'
    } as ApiResponse);
  } catch (error) {
    console.error('Error in updateDocumentStatus:', error);
    return res.json({
      status: 'error',
      message: 'Σφάλμα κατά την ενημέρωση της κατάστασης του εγγράφου'
    } as ApiResponse);
  }
};

// Delete document
export const deleteDocument: CustomRequestHandler = async (req, res) => {
  try {
    const { producerId, documentId } = req.params;

    const producer = await Producer.findById(producerId);
    if (!producer) {
      return res.json({
        status: 'error',
        message: 'Ο παραγωγός δεν βρέθηκε'
      } as ApiResponse);
    }

    producer.documents = producer.documents.filter(doc => 
      (doc as any)._id?.toString() !== documentId
    );
    await producer.save();

    return res.json({
      status: 'success',
      message: 'Το έγγραφο διαγράφηκε επιτυχώς'
    } as ApiResponse);
  } catch (error) {
    console.error('Error in deleteDocument:', error);
    return res.json({
      status: 'error',
      message: 'Σφάλμα κατά τη διαγραφή του εγγράφου'
    } as ApiResponse);
  }
};

// Get producer stats
export const getProducerStats: CustomRequestHandler = async (req, res) => {
  try {
    const producerId = req.params.id;
    const timeframe = (req.query.timeframe as string) || '30d';

    const producer = await Producer.findById(producerId);
    if (!producer) {
      return res.json({
        status: 'error',
        message: 'Ο παραγωγός δεν βρέθηκε'
      } as ApiResponse);
    }

    const stats = {
      totalOrders: 0,
      totalRevenue: 0,
      activeProducts: 0,
      pendingDocuments: 0,
      expiringDocuments: 0
    };

    // Get orders stats
    const orders = await Order.find({
      'items.producer': producerId,
      createdAt: { $gte: getDateFromTimeframe(timeframe) }
    });

    stats.totalOrders = orders.length;
    stats.totalRevenue = orders.reduce((sum: number, order: OrderDocument) => {
      const producerItems = order.items.filter((item: OrderItem) => 
        item.producer.toString() === producerId
      );
      return sum + producerItems.reduce((itemSum: number, item: OrderItem) => 
        itemSum + (item.price * item.quantity), 0
      );
    }, 0);

    // Get product stats
    stats.activeProducts = await Product.countDocuments({
      producer: producerId,
      status: 'active'
    });

    // Get document stats
    stats.pendingDocuments = producer.documents.filter(
      doc => doc.status === 'pending'
    ).length;

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    stats.expiringDocuments = producer.documents.filter(doc => {
      if (!doc.expiryDate) return false;
      return doc.expiryDate <= thirtyDaysFromNow && doc.status === 'active';
    }).length;

    return res.json({
      status: 'success',
      data: stats
    } as ApiResponse);
  } catch (error) {
    console.error('Error in getProducerStats:', error);
    return res.json({
      status: 'error',
      message: 'Σφάλμα κατά την ανάκτηση των στατιστικών'
    } as ApiResponse);
  }
};

// Helper function for timeframe
function getDateFromTimeframe(timeframe: string): Date {
  const date = new Date();
  switch (timeframe) {
    case '7d':
      date.setDate(date.getDate() - 7);
      break;
    case '30d':
      date.setDate(date.getDate() - 30);
      break;
    case '90d':
      date.setDate(date.getDate() - 90);
      break;
    case '1y':
      date.setFullYear(date.getFullYear() - 1);
      break;
    default:
      date.setDate(date.getDate() - 30);
  }
  return date;
}

// Get expiring documents
export const getExpiringDocuments: CustomRequestHandler = async (req, res) => {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const producers = await Producer.find({
      'documents.expiryDate': {
        $gte: new Date(),
        $lte: thirtyDaysFromNow
      },
      'documents.status': 'active'
    });

    const expiringDocs = producers.flatMap(producer => 
      producer.documents
        .filter(doc => {
          if (!doc.expiryDate) return false;
          return doc.expiryDate <= thirtyDaysFromNow && doc.status === 'active';
        })
        .map(doc => ({
          producer: {
            id: producer._id,
            name: producer.name,
            email: producer.email
          },
          document: doc
        }))
    );

    return res.json({
      status: 'success',
      data: expiringDocs
    } as ApiResponse);
  } catch (error) {
    console.error('Error in getExpiringDocuments:', error);
    return res.json({
      status: 'error',
      message: 'Σφάλμα κατά την ανάκτηση των εγγράφων που λήγουν'
    } as ApiResponse);
  }
};

// Get producer certifications
export const getProducerCertifications: CustomRequestHandler = async (req, res) => {
  try {
    const producer = await Producer.findById(req.params.id)
      .select('certifications');

    if (!producer) {
      return res.json({
        status: 'error',
        message: 'Ο παραγωγός δεν βρέθηκε'
      } as ApiResponse);
    }

    return res.json({
      status: 'success',
      data: producer.certifications
    } as ApiResponse);
  } catch (error) {
    console.error('Error in getProducerCertifications:', error);
    return res.json({
      status: 'error',
      message: 'Σφάλμα κατά την ανάκτηση των πιστοποιήσεων'
    } as ApiResponse);
  }
};

// Add certification
export const addCertification: CustomRequestHandler = async (req, res) => {
  try {
    const producer = await Producer.findById(req.params.id);
    if (!producer) {
      return res.json({
        status: 'error',
        message: 'Ο παραγωγός δεν βρέθηκε'
      } as ApiResponse);
    }

    producer.certifications.push({
      ...req.body,
      status: 'pending'
    });

    await producer.save();

    return res.json({
      status: 'success',
      message: 'Η πιστοποίηση προστέθηκε επιτυχώς'
    } as ApiResponse);
  } catch (error) {
    console.error('Error in addCertification:', error);
    return res.json({
      status: 'error',
      message: 'Σφάλμα κατά την προσθήκη της πιστοποίησης'
    } as ApiResponse);
  }
};

// Get expiring certifications
export const getExpiringCertifications: CustomRequestHandler = async (req, res) => {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const producers = await Producer.find({
      'certifications.validUntil': {
        $gte: new Date(),
        $lte: thirtyDaysFromNow
      },
      'certifications.status': 'active'
    });

    const expiringCerts = producers.flatMap(producer => 
      producer.certifications
        .filter(cert => {
          if (!cert.validUntil) return false;
          return cert.validUntil <= thirtyDaysFromNow && cert.status === 'active';
        })
        .map(cert => ({
          producer: {
            id: producer._id,
            name: producer.name,
            email: producer.email
          },
          certification: cert
        }))
    );

    return res.json({
      status: 'success',
      data: expiringCerts
    } as ApiResponse);
  } catch (error) {
    console.error('Error in getExpiringCertifications:', error);
    return res.json({
      status: 'error',
      message: 'Σφάλμα κατά την ανάκτηση των πιστοποιήσεων που λήγουν'
    } as ApiResponse);
  }
};

// ... Θα συνεχίσω με τις υπόλοιπες μεθόδους ... 