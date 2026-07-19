const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  // Token might be prepended with "Bearer "
  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.substring(7, authHeader.length) 
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'abc_secret_key');
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied: Administrator privileges required' });
  }
};

const dealerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'dealer' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied: Dealer or Administrator privileges required' });
  }
};

module.exports = { auth, adminOnly, dealerOrAdmin };
