/**
 * Simple Authentication Middleware for Admin Panel
 * 
 * Uses HTTP Basic Auth with credentials from environment variables:
 * - ADMIN_USERNAME
 * - ADMIN_PASSWORD
 */

const auth = require('basic-auth');
const logger = require('../config/logger');

const PUBLIC_PATHS = ['/health', '/webhook'];

const isPublicPath = (path) => {
  return PUBLIC_PATHS.some((publicPath) => path === publicPath || path.startsWith(`${publicPath}/`));
};

/**
 * Middleware to protect admin routes
 */
const requireAuth = (req, res, next) => {
  if (isPublicPath(req.path)) {
    return next();
  }

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  
  // If no credentials configured, allow access (for development)
  if (!username || !password) {
    logger.warn('Admin auth not configured, allowing unrestricted access');
    return next();
  }
  
  const user = auth(req);
  
  if (!user || user.name !== username || user.pass !== password) {
    res.set('WWW-Authenticate', 'Basic realm="Dental Bot Admin"');
    return res.status(401).json({ error: 'Acceso no autorizado' });
  }
  
  next();
};

/**
 * Check if request is authenticated (for API routes)
 */
const checkAuth = (req, res, next) => {
  if (isPublicPath(req.path)) {
    return next();
  }

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  
  // If no credentials configured, allow access
  if (!username || !password) {
    return next();
  }
  
  const user = auth(req);
  
  if (!user || user.name !== username || user.pass !== password) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
};

module.exports = { requireAuth, checkAuth };
