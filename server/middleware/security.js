import rateLimit from 'express-rate-limit';

// Basic rate limiter
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Stricter rate limiter for auth routes
export const authLimiter = rateLimit({
  windowMs: process.env.NODE_ENV === 'production' ? 15 * 60 * 1000 : 1000, // 15 λεπτά σε production, 1 δευτερόλεπτο σε development
  max: process.env.NODE_ENV === 'production' ? 5 : 10, // 5 προσπάθειες σε production, 10 σε development
  message: {
    error: 'Πολλές προσπάθειες σύνδεσης. Παρακαλώ δοκιμάστε ξανά αργότερα.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Security headers
export const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
};

// CORS options
export const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true
};

// Compression options
export const compressionOptions = {
  level: 6,
  threshold: 100 * 1000 // only compress responses that are larger than 100KB
};