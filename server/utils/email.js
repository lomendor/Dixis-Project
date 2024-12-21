import nodemailer from 'nodemailer';

// Development mock transport
const devTransport = {
  name: 'development',
  version: '1.0.0',
  send: (mail, callback) => {
    console.log('Email would have been sent in production:');
    console.log('To:', mail.data.to);
    console.log('Subject:', mail.data.subject);
    console.log('Text:', mail.data.text);
    callback(null, { messageId: 'mock-id' });
  }
};

const transporter = process.env.NODE_ENV === 'production' 
  ? nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
  : nodemailer.createTransport(devTransport);

export const sendEmail = async (options) => {
  try {
    // Create email options
    const mailOptions = {
      from: `Dixis <${process.env.EMAIL_FROM}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    
    return info;
  } catch (error) {
    console.error('Email error:', error);
    // In development, don't throw error
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Σφάλμα κατά την αποστολή του email');
    }
    return { messageId: 'mock-error' };
  }
};

// Verify transporter connection only in production
if (process.env.NODE_ENV === 'production') {
  transporter.verify((error, success) => {
    if (error) {
      console.error('SMTP connection error:', error);
    } else {
      console.log('SMTP server is ready to send emails');
    }
  });
} else {
  console.log('Email service running in development mode (emails will be logged to console)');
} 