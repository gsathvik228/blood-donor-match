const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const { validateDonorRegistration, validateDonorUpdate } = require('../middleware/validation');

router.post('/register', requireAuth, validateDonorRegistration, async (req, res) => {
  try {
    const userId = req.user.userId;
    const phone = req.user.phone;
    const { name, blood_group, age, email, city, state, full_address, tattoo_date } = req.body;

    const userCheck = await db.query('SELECT donor_id FROM users WHERE id = $1', [userId]);
    if (userCheck.rows[0].donor_id) {
      return res.status(400).json({ success: false, errors: ['You already have a donor profile. Go to My Profile to update it.'] });
    }

    const donorResult = await db.query(
      `INSERT INTO donors (name, blood_group, age, phone, email, city, state, full_address, has_diseases, tattoo_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false, $9)
       RETURNING id, name, blood_group, age, phone, email, city, state, created_at`,
      [name.trim(), blood_group.toUpperCase(), parseInt(age), phone, email.trim().toLowerCase(), city.trim(), state, full_address.trim(), tattoo_date || null]
    );

    const donor = donorResult.rows[0];

    await db.query('UPDATE users SET donor_id = $1 WHERE id = $2', [donor.id, userId]);

    res.status(201).json({
      success: true,
      message: 'Donor registered successfully. Your blood group is final and cannot be changed.',
      donor,
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, errors: ['Server error during registration'] });
  }
});

router.put('/me', requireAuth, validateDonorUpdate, async (req, res) => {
  try {
    const donorId = req.user.donorId;
    if (!donorId) {
      return res.status(400).json({ success: false, errors: ['You have not registered as a donor yet.'] });
    }

    const { name, age, email, city, state, full_address, last_donation_date } = req.body;

    const existing = await db.query('SELECT * FROM donors WHERE id = $1', [donorId]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, errors: ['Donor not found'] });
    }

    const fields = [];
    const values = [];
    let idx = 1;

    if (name !== undefined) { fields.push(`name = $${idx++}`); values.push(name.trim()); }
    if (age !== undefined) { fields.push(`age = $${idx++}`); values.push(parseInt(age)); }
    if (email !== undefined) { fields.push(`email = $${idx++}`); values.push(email.trim().toLowerCase()); }
    if (city !== undefined) { fields.push(`city = $${idx++}`); values.push(city.trim()); }
    if (state !== undefined) { fields.push(`state = $${idx++}`); values.push(state); }
    if (full_address !== undefined) { fields.push(`full_address = $${idx++}`); values.push(full_address.trim()); }
    if (last_donation_date !== undefined) { fields.push(`last_donation_date = $${idx++}`); values.push(last_donation_date); }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, errors: ['No fields to update'] });
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(donorId);

    const result = await db.query(
      `UPDATE donors SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, name, blood_group, age, phone, email, city, state, full_address, last_donation_date, updated_at`,
      values
    );

    res.json({
      success: true,
      message: 'Donor details updated successfully',
      donor: result.rows[0],
    });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ success: false, errors: ['Server error during update'] });
  }
});

router.get('/search', requireAuth, async (req, res) => {
  try {
    const { blood_group, city } = req.query;

    if (!blood_group || !city) {
      return res.status(400).json({
        success: false,
        errors: ['Blood group and city are required for search'],
      });
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const dateStr = sixMonthsAgo.toISOString().split('T')[0];
    const bg = blood_group.toUpperCase();

    const exactResult = await db.query(
      `SELECT d.id, d.name, d.phone, d.last_donation_date, d.city, d.state
       FROM donors d
       WHERE d.blood_group = $1
         AND LOWER(d.city) = LOWER($2)
         AND (d.last_donation_date IS NULL OR d.last_donation_date <= $3)
       ORDER BY d.name`,
      [bg, city, dateStr]
    );

    if (exactResult.rows.length > 0) {
      return res.json({
        success: true,
        match_type: 'exact',
        count: exactResult.rows.length,
        donors: exactResult.rows,
      });
    }

    const allResult = await db.query(
      `SELECT d.id, d.name, d.phone, d.last_donation_date, d.city, d.state
       FROM donors d
       WHERE d.blood_group = $1
         AND (d.last_donation_date IS NULL OR d.last_donation_date <= $3)
       ORDER BY d.name`,
      [bg, city, dateStr]
    );

    if (allResult.rows.length > 0) {
      return res.json({
        success: true,
        match_type: 'nationwide',
        count: allResult.rows.length,
        message: `No donors found in ${city}. Showing all available ${bg} donors across India.`,
        donors: allResult.rows,
      });
    }

    res.json({
      success: true,
      match_type: 'none',
      count: 0,
      donors: [],
      message: `No ${bg} donors currently available anywhere in India.`,
    });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ success: false, errors: ['Server error during search'] });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const donorId = req.user.donorId;
    if (!donorId) {
      return res.status(404).json({ success: false, errors: ['No donor profile found. Please register as a donor first.'] });
    }

    const result = await db.query(
      'SELECT id, name, blood_group, age, phone, email, city, state, full_address, last_donation_date, created_at, updated_at FROM donors WHERE id = $1',
      [donorId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, errors: ['Donor not found'] });
    }

    res.json({ success: true, donor: result.rows[0] });
  } catch (err) {
    console.error('Get donor error:', err);
    res.status(500).json({ success: false, errors: ['Server error'] });
  }
});

module.exports = router;
