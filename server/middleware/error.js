import createError from 'http-errors';
import { isProd } from '../config/config.js';

export const notFound = (req, res, next) => next(createError(404, 'Route not found'));

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  
  // Always log error details in development
  console.error(`\n[ERROR ${status}] ${req.method} ${req.originalUrl}`);
  console.error('Error message:', err.message);
  if (err.stack) {
    console.error('Stack trace:');
    console.error(err.stack);
  }
  
  // Log request body (excluding sensitive data) for debugging
  if (!isProd && req.body) {
    const logBody = { ...req.body };
    // Remove file data from logs if present
    if (req.file) {
      logBody.file = `[File: ${req.file.originalname}, ${req.file.size} bytes]`;
    }
    console.error('Request body:', JSON.stringify(logBody, null, 2));
  }
  
  // Don't expose internal error details in production
  const message = isProd && status === 500 
    ? 'Internal server error' 
    : (err.message || 'Server error');
  
  res.status(status).json({ 
    error: message,
    ...(isProd ? {} : { 
      stack: err.stack,
      details: err.details || null
    })
  });
};