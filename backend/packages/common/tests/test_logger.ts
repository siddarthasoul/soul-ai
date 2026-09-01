import logger from "../utils/logger.js"

logger.info('Server started successfully');
logger.warn('Database connection retrying...');

try {
  throw new Error('Database crash!');
} catch (error) {
  // Pass the error object directly; winston will extract and log the entire stack trace
  logger.error('Critical failure occurred', error); 
}
