const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');
const { generateToken } = require('../middleware/auth');

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ success: false, errors: ['Phone and password are required'] });
    }

    const result = await db.query(
      `SELECT u.id, u.donor_id, u.phone, u.password_hash
       FROM users u WHERE u.phone = $1`,
      [phone.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, errors: ['Invalid phone or password'] });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ success: false, errors: ['Invalid phone or password'] });
    }

    const token = generateToken(user);

    const donorResult = await db.query(
      'SELECT id, name, blood_group, age, phone, email, city, state, full_address, last_donation_date FROM donors WHERE id = $1',
      [user.donor_id]
    );

    res.json({
      success: true,
      token,
      donor: donorResult.rows[0],
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, errors: ['Server error during login'] });
  }
});

module.exports = router;
