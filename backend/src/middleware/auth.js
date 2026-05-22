const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'blood-donor-secret-key-change-in-production';

function generateToken(user) {
  return jwt.sign(
    { userId: user.id, donorId: user.donor_id, phone: user.phone },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, errors: ['Authentication required'] });
  }

  const token = header.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, errors: ['Invalid or expired token'] });
  }
}

module.exports = { generateToken, requireAuth };
