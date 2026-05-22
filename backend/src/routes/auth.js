const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../config/db');
const { generateToken } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || phone.trim().length < 10) {
      return res.status(400).json({ success: false, errors: ['Valid phone number is required'] });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, errors: ['Password must be at least 6 characters'] });
    }

    const existingUser = await db.query('SELECT id FROM users WHERE phone = $1', [phone.trim()]);
    const existingDonor = await db.query('SELECT id FROM donors WHERE phone = $1', [phone.trim()]);
    if (existingUser.rows.length > 0 || existingDonor.rows.length > 0) {
      return res.status(409).json({ success: false, errors: ['This phone number is already registered. Please sign in.'] });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await db.query(
      `INSERT INTO users (phone, password_hash) VALUES ($1, $2) RETURNING id, donor_id, phone`,
      [phone.trim(), passwordHash]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      token,
      user: { id: user.id, phone: user.phone, donor_id: user.donor_id },
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ success: false, errors: ['Server error during signup'] });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ success: false, errors: ['Phone and password are required'] });
    }

    const result = await db.query(
      `SELECT u.id, u.donor_id, u.phone, u.password_hash FROM users u WHERE u.phone = $1`,
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

    let donor = null;
    if (user.donor_id) {
      const donorResult = await db.query(
        'SELECT id, name, blood_group, age, phone, email, city, state, full_address, last_donation_date FROM donors WHERE id = $1',
        [user.donor_id]
      );
      donor = donorResult.rows[0] || null;
    }

    res.json({
      success: true,
      token,
      user: { id: user.id, phone: user.phone, donor_id: user.donor_id },
      donor,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, errors: ['Server error during login'] });
  }
});

module.exports = router;
