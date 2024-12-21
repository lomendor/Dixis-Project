import { Response } from 'express';
import Producer from '../models/Producer';
import {
  CreateProducerRequest,
  UpdateProducerRequest,
  GetProducerRequest,
  DeleteProducerRequest
} from '../../src/types/controllers/producer.types';

// Get all producers
export const getProducers = async (_req: Request, res: Response) => {
  try {
    const producers = await Producer.find();
    res.json({
      status: 'success',
      data: producers
    });
  } catch (error) {
    console.error('Error fetching producers:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Σφάλμα κατά την ανάκτηση των παραγωγών' 
    });
  }
};

// Get single producer
export const getProducer = async (req: GetProducerRequest, res: Response) => {
  try {
    const producer = await Producer.findById(req.params.id);
    if (!producer) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Ο παραγωγός δεν βρέθηκε' 
      });
    }
    res.json({
      status: 'success',
      data: producer
    });
  } catch (error) {
    console.error('Error fetching producer:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Σφάλμα κατά την ανάκτηση του παραγωγού' 
    });
  }
};

// Create producer
export const createProducer = async (req: CreateProducerRequest, res: Response) => {
  try {
    const producer = await Producer.create(req.body);
    res.status(201).json({
      status: 'success',
      data: producer
    });
  } catch (error) {
    console.error('Error creating producer:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Σφάλμα κατά τη δημιουργία του παραγωγού' 
    });
  }
};

// Update producer
export const updateProducer = async (req: UpdateProducerRequest, res: Response) => {
  try {
    const producer = await Producer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!producer) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Ο παραγωγός δεν βρέθηκε' 
      });
    }
    res.json({
      status: 'success',
      data: producer
    });
  } catch (error) {
    console.error('Error updating producer:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Σφάλμα κατά την ενημέρωση του παραγωγού' 
    });
  }
};

// Delete producer
export const deleteProducer = async (req: DeleteProducerRequest, res: Response) => {
  try {
    const producer = await Producer.findByIdAndDelete(req.params.id);
    if (!producer) {
      return res.status(404).json({ 
        status: 'error',
        message: 'Ο παραγωγός δεν βρέθηκε' 
      });
    }
    res.json({ 
      status: 'success',
      message: 'Ο παραγωγός διαγράφηκε επιτυχώς' 
    });
  } catch (error) {
    console.error('Error deleting producer:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Σφάλμα κατά τη διαγραφή του παραγωγού' 
    });
  }
};
