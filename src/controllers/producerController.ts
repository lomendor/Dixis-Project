import type { Response } from '../types/express';
import type { CustomRequestHandler } from '../types/express';
import type { ApiResponse } from '@/types/common/api.types';
import type { ProducerDocument, UpdateProducerBody } from '@/types/models/producer.types';
import type { WithId } from '@/types/models/base.types';
import Producer from '../models/Producer';
import { z } from 'zod';
import { Types } from 'mongoose';

// Validation schemas
const ProducerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string(),
  address: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending']).default('pending'),
  certifications: z.array(z.object({
    name: z.string(),
    issuer: z.string(),
    validUntil: z.date(),
    documentUrl: z.string(),
    status: z.enum(['active', 'expired', 'pending']).default('pending')
  })).default([]),
  documents: z.array(z.object({
    name: z.string(),
    type: z.string(),
    url: z.string(),
    status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
    uploadedAt: z.date(),
    expiresAt: z.date().optional()
  })).default([]),
  statusHistory: z.array(z.object({
    status: z.string(),
    comment: z.string().optional(),
    date: z.date()
  })).default([])
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
    const validatedData = ProducerSchema.partial().parse(req.body) as UpdateProducerBody;
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
    const { ids, action } = req.body as { ids: string[]; action: string };

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
    const producer = await Producer.findById(req.params.id) as WithId<ProducerDocument>;
    if (!producer) {
      return res.json({
        status: 'error',
        message: 'Ο παραγωγός δεν βρέθηκε'
      } as ApiResponse);
    }

    const newDocument = {
      ...req.body,
      status: 'pending' as const,
      uploadedAt: new Date(),
      _id: new Types.ObjectId()
    };

    producer.documents.push(newDocument);
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
    const { status, comment } = req.body as { status: 'pending' | 'approved' | 'rejected'; comment?: string };

    const producer = await Producer.findById(producerId) as WithId<ProducerDocument>;
    if (!producer) {
      return res.json({
        status: 'error',
        message: 'Ο παραγωγός δεν βρέθηκε'
      } as ApiResponse);
    }

    const document = producer.documents.find(doc => 
      doc._id?.toString() === documentId
    );
    if (!document) {
      return res.json({
        status: 'error',
        message: 'Το έγγραφο δεν βρέθηκε'
      } as ApiResponse);
    }

    document.status = status;
    if (comment) {
      document.comments = document.comments || [];
      document.comments.push({
        text: comment,
        date: new Date()
      });
    }

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

    const producer = await Producer.findById(producerId) as WithId<ProducerDocument>;
    if (!producer) {
      return res.json({
        status: 'error',
        message: 'Ο παραγωγός δεν βρέθηκε'
      } as ApiResponse);
    }

    producer.documents = producer.documents.filter(doc => 
      doc._id?.toString() !== documentId
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
    }) as WithId<ProducerDocument>[];

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