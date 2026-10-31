// backend/src/middleware/roleMiddleware.js
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

export const isAdmin = authorize('ADMIN', 'SUPER_ADMIN');
export const isSuperAdmin = authorize('SUPER_ADMIN');