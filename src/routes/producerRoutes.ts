import express from 'express';
import {
  getProducers,
  getProducer,
  createProducer,
  updateProducer,
  deleteProducer,
  bulkAction,
  addDocument,
  updateDocumentStatus,
  deleteDocument,
  getProducerStats,
  getExpiringDocuments,
  getProducerCertifications,
  addCertification,
  getExpiringCertifications
} from '../controllers/producerController';

const router = express.Router();

// Basic CRUD routes
router.route('/')
  .get(getProducers)
  .post(createProducer);

router.route('/:id')
  .get(getProducer)
  .patch(updateProducer)
  .delete(deleteProducer);

// Bulk actions route
router.post('/bulk', bulkAction);

// Document management routes
router.post('/:id/documents', addDocument);
router.patch('/:id/documents/:documentId/status', updateDocumentStatus);
router.delete('/:id/documents/:documentId', deleteDocument);

// Statistics routes
router.get('/:id/stats', getProducerStats);
router.get('/reports/expiring-documents', getExpiringDocuments);

// Certification routes
router.get('/:id/certifications', getProducerCertifications);
router.post('/:id/certifications', addCertification);
router.get('/reports/expiring-certifications', getExpiringCertifications);

// TODO: Θα προσθέσουμε αργότερα:
// - Certification routes (π.χ. /:id/certifications)

export default router; 