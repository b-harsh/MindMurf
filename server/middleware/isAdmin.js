const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(403).json({ error: 'Access Denied: Admins Only' });
};

module.exports = { isAdmin };
