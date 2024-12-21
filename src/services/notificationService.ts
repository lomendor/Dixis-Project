import nodemailer from 'nodemailer';
import type { Document } from 'mongoose';
import type { Producer, ProducerDocument } from '../models/Producer';
import type { UserDocument } from '../models/User';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export class NotificationService {
  static async sendExpiringCertificationNotification(
    producer: ProducerDocument,
    certificationName: string,
    daysUntilExpiry: number
  ) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: producer.email,
      subject: `Η πιστοποίηση ${certificationName} λήγει σε ${daysUntilExpiry} ημέρες`,
      html: `
        <h1>Ειδοποίηση Λήξης Πιστοποίησης</h1>
        <p>Αγαπητέ/ή ${producer.name},</p>
        <p>Η πιστοποίηση "${certificationName}" πρόκειται να λήξει σε ${daysUntilExpiry} ημέρες.</p>
        <p>Παρακαλούμε ανανεώστε την πιστοποίησή σας εγκαίρως.</p>
      `
    };

    await transporter.sendMail(mailOptions);
  }

  static async sendCertificationStatusNotification(
    producer: ProducerDocument,
    certificationName: string,
    status: 'approved' | 'rejected',
    comments?: string
  ) {
    const statusText = status === 'approved' ? 'εγκρίθηκε' : 'απορρίφθηκε';
    const commentsHtml = comments ? `<p>Σχόλια: ${comments}</p>` : '';

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: producer.email,
      subject: `Η πιστοποίηση ${certificationName} ${statusText}`,
      html: `
        <h1>Ενημέρωση Κατάστασης Πιστοποίησης</h1>
        <p>Αγαπητέ/ή ${producer.name},</p>
        <p>Η πιστοποίηση "${certificationName}" ${statusText}.</p>
        ${commentsHtml}
      `
    };

    await transporter.sendMail(mailOptions);
  }

  static async notifyProducerForNewReview(
    producer: ProducerDocument,
    rating: number,
    comment: string
  ) {
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: producer.email,
      subject: 'Νέα Αξιολόγηση',
      html: `
        <h1>Νέα Αξιολόγηση</h1>
        <p>Αγαπητέ/ή ${producer.name},</p>
        <p>Λάβατε μια νέα αξιολόγηση:</p>
        <p>Βαθμολογία: ${rating}/5</p>
        <p>Σχόλιο: ${comment}</p>
      `
    };

    await transporter.sendMail(mailOptions);
  }

  static async notifyUserForReviewStatus(
    user: UserDocument,
    producerName: string,
    status: 'approved' | 'rejected',
    comments?: string
  ) {
    const statusText = status === 'approved' ? 'εγκρίθηκε' : 'απορρίφθηκε';
    const commentsHtml = comments ? `<p>Σχόλια: ${comments}</p>` : '';

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: user.email,
      subject: `Η αξιολόγησή σας ${statusText}`,
      html: `
        <h1>Ενημέρωση Κατάστασης Αξιολόγησης</h1>
        <p>Αγαπητέ/ή ${user.name},</p>
        <p>Η αξιολόγησή σας για τον παραγωγό "${producerName}" ${statusText}.</p>
        ${commentsHtml}
      `
    };

    await transporter.sendMail(mailOptions);
  }

  static async sendVerificationEmail(
    email: string,
    name: string,
    token: string
  ) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Επιβεβαίωση Email',
      html: `
        <h1>Επιβεβαίωση Email</h1>
        <p>Αγαπητέ/ή ${name},</p>
        <p>Παρακαλώ επιβεβαιώστε το email σας κάνοντας κλικ στον παρακάτω σύνδεσμο:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>Ο σύνδεσμος θα λήξει σε 24 ώρες.</p>
      `
    };

    await transporter.sendMail(mailOptions);
  }

  static async sendPasswordResetEmail(
    email: string,
    name: string,
    token: string
  ) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Επαναφορά Κωδικού',
      html: `
        <h1>Επαναφορά Κωδικού</h1>
        <p>Αγαπητέ/ή ${name},</p>
        <p>Λάβαμε αίτημα για επαναφορά του κωδικού σας. Αν δεν το ζητήσατε εσείς, παρακαλούμε αγνοήστε αυτό το email.</p>
        <p>Για να επαναφέρετε τον κωδικό σας, κάντε κλικ στον παρακάτω σύνδεσμο:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Ο σύνδεσμος θα λήξει σε 1 ώρα.</p>
      `
    };

    await transporter.sendMail(mailOptions);
  }
} 