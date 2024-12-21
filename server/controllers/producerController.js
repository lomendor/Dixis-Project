import Producer from '../models/Producer.js';

// Get all producers
export const getProducers = async (req, res) => {
  try {
    const producers = await Producer.find();
    res.json(producers);
  } catch (error) {
    console.error('Error fetching producers:', error);
    res.status(500).json({ message: 'Σφάλμα κατά την ανάκτηση των παραγωγών' });
  }
};

// Get single producer
export const getProducer = async (req, res) => {
  try {
    const producer = await Producer.findById(req.params.id);
    if (!producer) {
      return res.status(404).json({ message: 'Ο παραγωγός δεν βρέθηκε' });
    }
    res.json(producer);
  } catch (error) {
    console.error('Error fetching producer:', error);
    res.status(500).json({ message: 'Σφάλμα κατά την ανάκτηση του παραγωγού' });
  }
};

// Create producer
export const createProducer = async (req, res) => {
  try {
    const producer = await Producer.create(req.body);
    res.status(201).json(producer);
  } catch (error) {
    console.error('Error creating producer:', error);
    res.status(500).json({ message: 'Σφάλμα κατά τη δημιουργία του παραγωγού' });
  }
};

// Update producer
export const updateProducer = async (req, res) => {
  try {
    const producer = await Producer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!producer) {
      return res.status(404).json({ message: 'Ο παραγωγός δεν βρέθηκε' });
    }
    res.json(producer);
  } catch (error) {
    console.error('Error updating producer:', error);
    res.status(500).json({ message: 'Σφάλμα κατά την ενημέρωση του παραγωγού' });
  }
};

// Delete producer
export const deleteProducer = async (req, res) => {
  try {
    const producer = await Producer.findByIdAndDelete(req.params.id);
    if (!producer) {
      return res.status(404).json({ message: 'Ο παραγωγός δεν βρέθηκε' });
    }
    res.json({ message: 'Ο παραγωγός διαγράφηκε επιτυχώς' });
  } catch (error) {
    console.error('Error deleting producer:', error);
    res.status(500).json({ message: 'Σφάλμα κατά τη διαγραφή του παραγωγού' });
  }
}; 