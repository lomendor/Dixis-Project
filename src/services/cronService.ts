import cron from 'node-cron';
import Producer, { ProducerDocument } from '../models/Producer';
import { NotificationService } from './notificationService';

interface CertificationDocument {
  name: string;
  type: string;
  validUntil: Date;
  status: 'pending' | 'active' | 'rejected';
}

export class CronService {
  static initializeCronJobs() {
    // Check for expiring certifications daily at 9:00
    cron.schedule('0 9 * * *', async () => {
      try {
        const producers = await Producer.find({
          'certifications.status': 'active'
        });

        for (const producer of producers) {
          const expiringCertifications = producer.documents.filter(doc => {
            if (doc.type !== 'certification' || !doc.validUntil) return false;
            
            const validUntil = doc.validUntil;
            const daysUntilExpiry = Math.ceil(
              (validUntil.getTime() - new Date().getTime()) / 
              (1000 * 60 * 60 * 24)
            );

            return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
          }) as CertificationDocument[];

          // Send notifications for each expiring certification
          for (const cert of expiringCertifications) {
            const daysUntilExpiry = Math.ceil(
              (cert.validUntil.getTime() - new Date().getTime()) / 
              (1000 * 60 * 60 * 24)
            );

            await NotificationService.sendExpiringCertificationNotification(
              producer,
              cert.name,
              daysUntilExpiry
            );
          }
        }
      } catch (error) {
        console.error('Error in certification expiry cron job:', error);
      }
    });
  }
} 